package com.ssafy.pwandora.global.config;

import java.net.MalformedURLException;
import java.net.URL;

import org.apache.http.Header;
import org.apache.http.HttpHost;
import org.apache.http.message.BasicHeader;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.rest_client.RestClientTransport;

@Configuration
public class ElasticsearchConfig {

	@Value("${spring.elasticsearch.uris}")
	private String elasticsearchUri;

	@Value("${spring.elasticsearch.api-key:}")
	private String apiKey;

	@Bean
	public RestClient restClient() {
		try {
			URL url = new URL(elasticsearchUri);
			String host = url.getHost();
			int port = (url.getPort() != -1) ? url.getPort() : 9200;

			// RestClientBuilder 생성
			RestClientBuilder builder = RestClient.builder(new HttpHost(host, port, url.getProtocol()));

			// API 키가 있는 경우 인증 헤더 추가
			if (apiKey != null && !apiKey.isEmpty()) {
				builder.setDefaultHeaders(new Header[] {
					new BasicHeader("Authorization", "ApiKey " + apiKey)
				});
				System.out.println("Elasticsearch: API 키 인증 사용");
			} else {
				System.out.println("Elasticsearch: 인증 없이 연결");
			}

			return builder.build();
		} catch (MalformedURLException e) {
			throw new IllegalArgumentException("잘못된 Elasticsearch URI: " + elasticsearchUri, e);
		}
	}

	@Bean
	public ElasticsearchClient elasticsearchClient(RestClient restClient) {
		RestClientTransport transport = new RestClientTransport(
			restClient,
			new JacksonJsonpMapper()
		);
		return new ElasticsearchClient(transport);
	}
}