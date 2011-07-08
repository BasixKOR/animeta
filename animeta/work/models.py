# -*- coding: utf-8 -*-
from django.core.cache import cache
from django.db import models, transaction, IntegrityError
from django.conf import settings
from django.contrib.auth.models import User

class Work(models.Model):
    title = models.CharField(max_length=100, unique=True)

    @property
    def popularity(self):
        return self.record_set.count()

    @property
    def rank(self):
        key = 'rank:%d' % self.id
        rank = cache.get(key)
        if not rank:
            from django.db import connection
            cursor = connection.cursor()
            cursor.execute("SELECT rank FROM (SELECT work_id, RANK() OVER (ORDER BY COUNT(*) DESC) AS rank FROM record_record GROUP BY work_id) t WHERE work_id = %s", [self.id])
            row = cursor.fetchone()
            rank = row[0] if row else None
            cache.set(key, rank, 60 * 60 * 24)
        return rank

    @property
    def similar_objects(self):
        if settings.DEBUG:
            qs = Work.objects.filter(title__icontains=self.title)
        else:
            qs = Work.objects.extra(
                select={'dist': 'title_distance(%s, title)'},
                select_params=[self.title],
                where=['title_distance(%s, title) <= 0.6'],
                params=[self.title],
                order_by=['dist'])
        return qs.exclude(id=self.id)
    
    def has_merge_request(self, w):
        return bool(MergeRequest.objects.filter(source=self, target=w)) or bool(MergeRequest.objects.filter(target=self, source=w))

    def __unicode__(self):
        return self.title

    @models.permalink
    def get_absolute_url(self):
        return ('work.views.detail', (), {'title': self.title})

    def merge(self, other):
        TitleMapping.objects.filter(work=other).update(work=self)
        forced = []
        try:
            with transaction.commit_on_success():
                other.record_set.update(work=self)
                other.history_set.update(work=self)
        except IntegrityError, e:
            # self와 other의 기록을 함께 가진 경우
            # 나중에 기록된 것에 모두 합쳐버린다.
            w = [self, other]
            for u in User.objects.filter(record__work__in=w) \
                .annotate(count=models.Count('record__work')) \
                .filter(count__gt=1):
                forced.append(u)
                with transaction.commit_on_success():
                    r = u.record_set.filter(work__in=w).latest('updated_at')
                    delete = other if r.work == self else self
                    u.record_set.filter(work=delete).delete()
                    u.history_set.filter(work=delete).update(work=r.work)

            # 병합 처리가 완료되면 다시 합쳐본다.
            with transaction.commit_on_success():
                other.record_set.update(work=self)
                other.history_set.update(work=self)
        return forced

def suggest_works(query, user=None):
    queryset = Work.objects

    if user and user.is_authenticated():
        queryset = queryset.exclude(id__in=user.record_set.values('work'))

    return queryset.filter(title__istartswith=query)

def get_or_create_work(title):
    key = normalize_title(title)
    try:
        # 1. 제목이 정확히 맞는 매핑 찾기
        mapping = TitleMapping.objects.get(title=title)
        return mapping.work
    except TitleMapping.DoesNotExist:
        # 2. 1이 없으면 key가 같은 매핑 찾기
        try:
            # 2에서 찾았으면 매핑 새로 생성
            similar_mapping = TitleMapping.objects.filter(key=key)[0]
            mapping = TitleMapping.objects.create(work=similar_mapping.work, title=title, key=key)
            return mapping.work
        except:
            # 그마저도 없으면 Work와 매핑 새로 생성
            work = Work.objects.create(title=title)
            mapping = TitleMapping.objects.create(work=work, title=title, key=key)
            return work

import unicodedata
EXCEPTION_CHARS = u'!+'
def normalize_title(title):
    result = ''
    for ch in title:
        # 전각 기호를 ASCII 기호로 변환
        if 0xFF01 <= ord(ch) <= 0xFF5E:
            ch = unichr(ord(ch) - 0xFF01 + 0x21)

        if unicodedata.category(ch)[0] in 'LN' or ch in EXCEPTION_CHARS:
            result = result + ch
    return result.lower().strip()

class MergeRequest(models.Model):
    user = models.ForeignKey(User)
    target = models.ForeignKey(Work)
    source = models.ForeignKey(Work, related_name='merge_with')

    @property
    def avail(self):
        return normalize_title(self.target.title) != normalize_title(self.source.title) and self.target.popularity > 0 and self.source.popularity > 0

    class Meta:
        unique_together = ('target', 'source')

class TitleMapping(models.Model):
    work = models.ForeignKey(Work)
    title = models.CharField(max_length=100, unique=True)
    key = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        self.key = normalize_title(self.title)
        return super(TitleMapping, self).save(*args, **kwargs)
