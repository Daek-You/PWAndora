package com.ssafy.pwandora.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignupPostRequest {
	private String loginId;
	private String password;
	private Integer languageId;
	private String email;
}
