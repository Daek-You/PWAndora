package com.ssafy.pwandora.file.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ssafy.pwandora.file.dto.resquest.FileDownloadPostRequest;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileService {

	private final AmazonS3 amazonS3;

	@Value("${cloud.aws.s3.bucket}")
	private String bucketName;

	public Resource getFileResource(FileDownloadPostRequest request, HttpServletResponse response) {
		String objectKey = request.getUrl();
		try {
			// URL이 포함된 경우 제거
			if (objectKey.startsWith("https://")) {
				objectKey = objectKey.replace("https://pwandora-storage.s3.ap-northeast-2.amazonaws.com/", "");
			}

			String originFileName = URLDecoder.decode(objectKey, "UTF-8");
			response.setHeader("Content-Disposition", String.format("attachment; filename=\"%s\"", originFileName));
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
		return new InputStreamResource(getObjectBytes(bucketName, objectKey));
	}

	public InputStream getObjectBytes(String bucketName, String objectKey) {
		return amazonS3.getObject(bucketName, objectKey)
			.getObjectContent()
			.getDelegateStream();
	}

	// 이미지 업로드
	public String uploadFile(MultipartFile file, String name) {
		String fileName = generateFileName(Objects.requireNonNull(file.getOriginalFilename()), name);
		try {
			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentType(file.getContentType());
			metadata.setContentLength(file.getSize());

			amazonS3.putObject(bucketName, fileName, file.getInputStream(), metadata);
			return amazonS3.getUrl(bucketName, fileName).toString();
		} catch (IOException e) {
			throw new RuntimeException("파일 업로드 중 오류 발생", e);
		}
	}

	private String generateFileName(String originalFileName, String name) {
		String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
		return "apps/" + name + "/images/" + LocalDate.now() + "_" + UUID.randomUUID() + extension;
	}

	public void deleteFile(String fileUrl) {
		String objectKey = extractObjectKey(fileUrl);
		amazonS3.deleteObject(bucketName, objectKey);
	}

	private String extractObjectKey(String fileUrl) {
		return fileUrl.replace("https://pwandora-storage.s3.ap-northeast-2.amazonaws.com/", "");
	}
}
