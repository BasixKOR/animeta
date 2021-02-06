import $ from 'jquery';
import * as Sentry from '@sentry/react';
import { injectLoader, bootstrap } from 'nuri/client';
import nprogress from 'nprogress';
import app from './routes';
import { getCurrentUser, serializeParams } from './API';
import { trackPageView } from './Tracking';
import '../less/nprogress.less';
import '../less/base.less';
import '../less/signup.less';

if ((window as any).SENTRY_DSN) {
  Sentry.init({
    dsn: (window as any).SENTRY_DSN,
    ignoreErrors: ['hideGuidePopup'],
  });
}

injectLoader({
  call(path: string, params: any) {
    return $.get('/api/v2' + path, serializeParams(params));
  },

  getCurrentUser(params: any) {
    return getCurrentUser(params);
  },
});

$(document).ajaxError((event, jqXHR, ajaxSettings, thrownError) => {
  if (ajaxSettings.__silent__) return;

  try {
    Sentry.captureMessage(thrownError || jqXHR.statusText, {
      extra: {
        type: ajaxSettings.type,
        url: ajaxSettings.url,
        data: ajaxSettings.data,
        status: jqXHR.status,
        error: thrownError || jqXHR.statusText,
        response: jqXHR.responseText && jqXHR.responseText.substring(0, 100),
      },
    });
  } catch (e) {
    try {
      Sentry.captureException(e);
    } catch (e2) {
      // ignore
    }
  }
  if (jqXHR.responseText) {
    try {
      var err = $.parseJSON(jqXHR.responseText);
      alert(err.message);
      return;
    } catch (e) {
      // ignore
    }
  }
  alert('서버 오류로 요청에 실패했습니다.');
});

bootstrap(app, controller => {
  nprogress.configure({
    trickleRate: 0.4,
    trickleSpeed: 600,
    easing: 'ease',
  });

  controller!.subscribe({
    willLoad() {
      nprogress.start();
    },
    didLoad() {
      nprogress.done();
    },
    didAbortLoad() {
      nprogress.done();
    },
    didCommitState() {
      trackPageView();
    },
  });
});
