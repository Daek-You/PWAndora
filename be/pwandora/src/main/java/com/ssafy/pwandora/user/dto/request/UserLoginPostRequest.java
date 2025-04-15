package com.ssafy.pwandora.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginPostRequest {
	private String loginId;
	private String password;
}
