package com.ssafy.pwandora.global.aop.user;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.ssafy.pwandora.global.exception.CustomException;
import com.ssafy.pwandora.global.util.SessionUtil;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Aspect
@Component
@RequiredArgsConstructor
public class LoginCheckAspect {

	@Around("@annotation(com.ssafy.pwandora.global.aop.user.CheckLogin)")  // 어노테이션이 붙은 메서드 실행 시 적용
	public Object checkLogin(ProceedingJoinPoint joinPoint) throws Throwable {
		// HttpSession 파라미터 가져오기
		HttpSession session = getSessionFromArgs(joinPoint.getArgs());

		// 로그인 여부 확인
		Integer userId = SessionUtil.getUserId(session);
		if (userId == null) {
			throw new CustomException(HttpStatus.UNAUTHORIZED, "로그인이 필요한 기능입니다.");
		}

		// 원래 메서드 실행
		return joinPoint.proceed();
	}

	private HttpSession getSessionFromArgs(Object[] args) {
		for (Object arg : args) {
			if (arg instanceof HttpSession) {
				return (HttpSession)arg;
			}
		}
		throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "HttpSession 이 필요하지만 제공되지 않았습니다.");
	}
}
