package com.ssafy.pwandora.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableCaching  // 캐싱 기능 활성화
public class RedisConfig {

    @Value("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;

    @Value("${spring.data.redis.password:}")
    private String redisPassword;

    // Redis 연결 팩토리 생성
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        // Redis 서버 구성 설정
        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration(redisHost, redisPort);

        // 비밀번호 설정
        if (redisPassword != null && !redisPassword.isEmpty()) {
            redisConfig.setPassword(redisPassword);
        }

        // Lettuce 연결 팩토리 생성 및 반환
        return new LettuceConnectionFactory(redisConfig);
    }

    // 기본 레디스 템플릿 구성
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // 키 직렬화 설정 - String 타입으로 직렬화
        template.setKeySerializer(new StringRedisSerializer());

        // 값 직렬화 설정 - JSON 형식으로 직렬화
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        // 해시 키/값 직렬화 설정
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

        // 기본 직렬화 설정
        template.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());

        // 설정 적용
        template.afterPropertiesSet();
        return template;
    }
}
