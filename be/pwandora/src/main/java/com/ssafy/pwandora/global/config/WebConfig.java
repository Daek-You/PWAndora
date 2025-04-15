package com.ssafy.pwandora.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private static final String[] ALLOWED_ORIGINS = {
            "https://pwandora-monitor.vercel.app",      // Vercel
            "https://pwandora-store.vercel.app",        // Vercel
            "http://j12s005.p.ssafy.io",                // EC2 HTTP
            "https://j12s005.p.ssafy.io",               // EC2 HTTPS
            // Monitor 개발 테스트용 -> 테스트 끝나면 지워야 해!
            "http://localhost:5173",
            "https://localhost:5173"
    };

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins(ALLOWED_ORIGINS)
                .allowedMethods(HttpMethod.GET.name(), HttpMethod.POST.name(), HttpMethod.PUT.name(), HttpMethod.DELETE.name(),
                                HttpMethod.HEAD.name(), HttpMethod.OPTIONS.name(), HttpMethod.PATCH.name())
                .allowCredentials(true)     // 인증 정보(ex. Cookie) 포함 허용
                .maxAge(1800);
    }
}
