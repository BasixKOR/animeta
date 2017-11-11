package net.animeta.backend.security

import com.fasterxml.jackson.databind.ObjectMapper
import django.Signing
import net.animeta.backend.exception.ApiException
import net.animeta.backend.model.User
import net.animeta.backend.repository.UserRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.MethodParameter
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer
import java.time.Duration

@Component
class CurrentUserArgumentResolver(val userRepository: UserRepository,
                                  @Value("\${animeta.security.secret-key}") val secretKey: String) : HandlerMethodArgumentResolver {
    private val objectMapper = ObjectMapper().readerFor(DjangoAuthSession::class.java)
    private val sessionCookieAge = Duration.ofDays(14) // 2 weeks

    override fun supportsParameter(parameter: MethodParameter): Boolean {
        return parameter.hasParameterAnnotation(CurrentUser::class.java) &&
                User::class.java.isAssignableFrom(parameter.parameterType)
    }

    override fun resolveArgument(parameter: MethodParameter,
                                 mavContainer: ModelAndViewContainer,
                                 webRequest: NativeWebRequest,
                                 binderFactory: WebDataBinderFactory): User? {
        val annotation = parameter.getParameterAnnotation(CurrentUser::class.java)
        val user = extractUser(webRequest)
        if (annotation.required && user == null) {
            throw ApiException("Login required.", HttpStatus.UNAUTHORIZED)
        } else {
            return user
        }
    }

    private fun extractUser(webRequest: NativeWebRequest): User? {
        val header = webRequest.getHeader("x-animeta-session-key")
        if (header == null) {
            return null
        }
        try {
            val session: DjangoAuthSession = Signing.loadString(header, secretKey, "django.contrib.sessions.backends.signed_cookies", objectMapper::readValue, sessionCookieAge)
            return userRepository.findOne(session.userId.toIntOrNull())
        } catch (e: Exception) {
            return null
        }
    }
}