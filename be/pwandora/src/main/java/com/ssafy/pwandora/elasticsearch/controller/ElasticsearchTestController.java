package com.ssafy.pwandora.elasticsearch.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.cluster.ClusterHealth;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/es-test")
@Tag(name = "Elasticsearch Test API", description = "Elasticsearch 연결 테스트를 위한 API")
@RequiredArgsConstructor
public class ElasticsearchTestController {

    private final ElasticsearchOperations elasticsearchOperations;

    @GetMapping("/ping")
    @Operation(summary = "Elasticsearch 연결 상태 확인", description = "Elasticsearch 서버와의 연결 상태를 확인합니다.")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();

        try {
            // 클러스터 상태 확인
            ClusterHealth health = elasticsearchOperations.cluster().health();
            String clusterName = health.getClusterName();

            response.put("status", "success");
            response.put("message", "Elasticsearch에 성공적으로 연결되었습니다.");
            response.put("clusterName", clusterName);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Elasticsearch 연결 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(response);
        }
    }
}
