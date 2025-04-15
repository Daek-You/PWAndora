package com.ssafy.pwandora.acceptance.util;


import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.stream.Stream;

// 임시 디렉토리를 자동으로 관리하기 위한 AutoCloseable 구현체 (For Lighthouse API)
@Slf4j
public class TempDirectoryContext implements AutoCloseable {
    private final Path tempDir;

    public TempDirectoryContext() throws IOException {
        this.tempDir = Files.createTempDirectory("lighthouse-");
    }

    public Path getTempDir() {
        return tempDir;
    }

    @Override
    public void close() throws IOException {
        // 디렉토리 내의 모든 파일을 먼저 삭제
        if (Files.exists(tempDir)) {
            try (Stream<Path> paths = Files.list(tempDir)) {
                paths.forEach(file -> {
                    try {
                        Files.deleteIfExists(file);
                    } catch (IOException e) {
                        log.warn("임시 파일 삭제 중 오류 발생: {}", e.getMessage());
                    }
                });
            }

            // 디렉토리 자체 삭제
            try {
                Files.deleteIfExists(tempDir);
            } catch (IOException e) {
                log.warn("임시 디렉토리 삭제 중 오류 발생: {}", e.getMessage());
            }
        }
    }
}
