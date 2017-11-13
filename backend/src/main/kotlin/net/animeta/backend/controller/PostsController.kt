package net.animeta.backend.controller

import net.animeta.backend.db.Datastore
import net.animeta.backend.db.query
import net.animeta.backend.dto.PostDTO
import net.animeta.backend.model.QHistory.history
import net.animeta.backend.serializer.PostSerializer
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/v2/posts")
class PostsController(val datastore: Datastore, val postSerializer: PostSerializer) {
    @GetMapping
    fun get(@RequestParam("before_id", required = false) beforeId: Int?,
            @RequestParam("min_record_count", required = false) minRecordCount: Int?,
            @RequestParam(defaultValue = "32") count: Int): List<PostDTO> {
        var query = history.query.selectRelated(history.user, history.record)
                .filter(history.comment.ne(""))
                .orderBy(history.id.desc())
        if (beforeId != null) {
            query = query.filter(history.id.lt(beforeId))
        }
        if (minRecordCount != null) {
            query = query.filter(history.work.indexes.any().record_count.goe(minRecordCount))
        }
        val limit = minOf(count, 128)
        return datastore.query(query.limit(limit))
                .map { postSerializer.serialize(it, includeRecord = true, includeUser = true) }
    }
}