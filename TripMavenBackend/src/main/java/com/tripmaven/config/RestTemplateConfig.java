package com.tripmaven.config;

import java.util.concurrent.TimeUnit;

import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.config.ConnectionConfig;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.io.HttpClientConnectionManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {
	static final int READ_TIMEOUT = 1500;
	static final int CONN_TIMEOUT = 3000;

	@Bean
	public RestTemplate restTemplate() {
		HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
		factory.setHttpClient(createHttpClient());
	    return new RestTemplate(factory);
	}

	private HttpClient createHttpClient() {
		return HttpClientBuilder.create()
	                      .setConnectionManager(createHttpClientConnectionManager())
	                      .build();
	}

	private HttpClientConnectionManager createHttpClientConnectionManager() {
		return PoolingHttpClientConnectionManagerBuilder.create()
	                                                    .setDefaultConnectionConfig(ConnectionConfig.custom()
	                                                                                                .setSocketTimeout(READ_TIMEOUT, TimeUnit.MILLISECONDS)
	                                                                                                .setConnectTimeout(CONN_TIMEOUT, TimeUnit.MILLISECONDS)
	                                                                                                .build())
	                                                    .build();
	}
	
}