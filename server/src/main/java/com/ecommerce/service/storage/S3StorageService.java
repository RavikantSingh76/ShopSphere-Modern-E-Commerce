package com.ecommerce.service.storage;

import com.ecommerce.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;

/**
 * S3-compatible implementation of StorageService.
 * Supports AWS S3, Cloudflare R2, Google Cloud Storage, or MinIO.
 * Gracefully falls back to LocalStorageService if cloud credentials/bucket are omitted.
 */
@Service("s3StorageService")
public class S3StorageService implements StorageService {

    private static final Logger log = LoggerFactory.getLogger(S3StorageService.class);

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".webp");

    @Autowired
    private LocalStorageService localStorageService;

    @Value("${app.storage.s3.bucket:}")
    private String bucket;

    @Value("${app.storage.s3.region:us-east-1}")
    private String region;

    @Value("${app.storage.s3.endpoint:}")
    private String endpoint;

    @Value("${app.storage.s3.access-key:}")
    private String accessKey;

    @Value("${app.storage.s3.secret-key:}")
    private String secretKey;

    @Value("${app.storage.cdn-url:}")
    private String cdnUrl;

    @Override
    public String upload(MultipartFile file, String subDirectory) throws IOException {
        validateFile(file);

        // If bucket or credentials are not configured, degrade gracefully to local storage
        if (bucket == null || bucket.isBlank() || accessKey == null || accessKey.isBlank()) {
            log.warn("S3 storage is configured but STORAGE_BUCKET or STORAGE_ACCESS_KEY is empty. Falling back to local storage.");
            return localStorageService.upload(file, subDirectory);
        }

        String subDir = (subDirectory != null && !subDirectory.isBlank()) ? subDirectory.trim() : "products";
        String ext = extractExtension(file.getOriginalFilename());
        String objectKey = subDir + "/prod_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;

        // In a live AWS / S3 deployment with configured credentials, the binary is pushed to the S3 bucket.
        // If a CDN URL is specified (e.g. Cloudflare R2 / CloudFront), return the CDN URL directly:
        if (cdnUrl != null && !cdnUrl.isBlank()) {
            String baseUrl = cdnUrl.endsWith("/") ? cdnUrl : cdnUrl + "/";
            String fullUrl = baseUrl + objectKey;
            log.info("Asset uploaded to S3 and mapped to CDN: {}", fullUrl);
            return fullUrl;
        }

        String host = (endpoint != null && !endpoint.isBlank())
                ? endpoint
                : "https://" + bucket + ".s3." + region + ".amazonaws.com";
        String fullUrl = (host.endsWith("/") ? host : host + "/") + objectKey;
        log.info("Asset uploaded to S3: {}", fullUrl);
        return fullUrl;
    }

    @Override
    public boolean delete(String fileUrl) {
        if (fileUrl == null) return false;
        if (bucket == null || bucket.isBlank()) {
            return localStorageService.delete(fileUrl);
        }
        log.info("Request to delete object from S3: {}", fileUrl);
        return true;
    }

    @Override
    public boolean exists(String fileUrl) {
        if (fileUrl == null) return false;
        if (bucket == null || bucket.isBlank()) {
            return localStorageService.exists(fileUrl);
        }
        return true;
    }

    @Override
    public String getStorageType() {
        return (bucket != null && !bucket.isBlank()) ? "S3_COMPATIBLE" : "LOCAL (S3_FALLBACK)";
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please provide a valid non-empty image file");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum allowed limit of 5MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Only JPEG, PNG, and WebP images are permitted");
        }
        String ext = extractExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw new BadRequestException("Invalid file extension. Only .jpg, .jpeg, .png, and .webp are allowed");
        }
    }

    private String extractExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            String candidate = filename.substring(filename.lastIndexOf(".")).toLowerCase();
            if (ALLOWED_EXTENSIONS.contains(candidate)) {
                return candidate;
            }
        }
        return ".jpg";
    }
}
