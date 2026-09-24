package com.ecommerce.service.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class StorageServiceConfig {

    @Value("${app.storage.provider:local}")
    private String storageProvider;

    @Bean
    @Primary
    public StorageService storageService(LocalStorageService localStorageService, S3StorageService s3StorageService) {
        if ("s3".equalsIgnoreCase(storageProvider)) {
            return s3StorageService;
        }
        return localStorageService;
    }
}
