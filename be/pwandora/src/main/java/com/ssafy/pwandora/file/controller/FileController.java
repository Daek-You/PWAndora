package com.ssafy.pwandora.file.controller;

import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.pwandora.file.dto.resquest.FileDownloadPostRequest;
import com.ssafy.pwandora.file.service.FileService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {

	private final FileService fileService;

	@PostMapping
	public Resource downloadFile(@RequestBody FileDownloadPostRequest request, HttpServletResponse response) {
		return fileService.getFileResource(request, response);
	}
}
