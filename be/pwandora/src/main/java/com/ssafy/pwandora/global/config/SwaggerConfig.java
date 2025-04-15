package com.ssafy.pwandora.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    @Value("${spring.profiles.active:local}")
    private String activeProfile;

    // Swagger API 정보 설정
    @Bean
    public OpenAPI openAPI() {
        Server server;

        // 환경에 따른 서버 URL 설정
        if ("local".equals(activeProfile) || "remote".equals(activeProfile)) {
            server = new Server().url("http://localhost:8080").description("개발 서버");
        } else {
            server = new Server().url("https://j12s005.p.ssafy.io").description("운영 서버");
        }

        return new OpenAPI()
                .info(apiInfo())
                .servers(List.of(server))
                .components(new Components().addSecuritySchemes("apiKey", securityScheme()))
                .addSecurityItem(new SecurityRequirement().addList("apiKey"));
    }

    private Info apiInfo() {
        return new Info().title("Pwandora API").description("Pwandora Backend API Documentation").version("v2.0.0");
    }

    // API Key를 헤더에 포함하는 SecurityScheme 설정
    private SecurityScheme securityScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.APIKEY)
                .in(SecurityScheme.In.HEADER)
                .name("Authorization"); // Authorization 헤더에 API 키를 전달
    }
}

