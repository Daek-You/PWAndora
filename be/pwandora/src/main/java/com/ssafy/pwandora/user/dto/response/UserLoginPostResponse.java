package com.ssafy.pwandora.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginPostResponse {
    private Integer userId;
    private String loginId;
}
