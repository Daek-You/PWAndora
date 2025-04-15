package com.ssafy.pwandora.global.exception.handler;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.pwandora.global.exception.CustomException;
import com.ssafy.pwandora.global.exception.response.ErrorResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
	private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(CustomException.class)
	public ResponseEntity<ErrorResponse> handleCustomException(CustomException e) {
		logException(e);
		ErrorResponse errorResponse = new ErrorResponse(e.getStatus().value(), e.getMessage(),
			LocalDateTime.now());
		return new ResponseEntity<>(errorResponse, e.getStatus());
	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
		logException(e);
		ErrorResponse errorResponse = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage(),
			LocalDateTime.now());
		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}

	// 마지막까지 어떠한 핸들러도 못 잡은 예외 처리
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGlobalException(Exception e) {
		logException(e);
		ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버 내부에 오류가 발생했습니다.",
			LocalDateTime.now());
		return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	private void logException(Exception ex) {
		log.error("""
				Ex={}
				Message={}
				StackTrace={}""",
			ex.getClass().getSimpleName(),
			ex.getMessage(),
			Arrays.stream(ex.getStackTrace())
				.map(StackTraceElement::toString) // 스택트레이스 줄바꿈 추가
				.collect(Collectors.joining("\n")));
	}
}
