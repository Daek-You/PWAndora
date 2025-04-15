package com.ssafy.pwandora.global.util;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpSession;

@Component
public class SessionUtil {
	private static final String USER_SESSION_KEY = "loggedInUser";

	public static Integer getUserId(HttpSession session) {
		return (Integer)session.getAttribute(USER_SESSION_KEY);
	}
}

