package com.ecommerce.service.storage;

import com.ecommerce.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

/**
 * Local filesystem implementation of StorageService.
 * Used for zero-dependency local development and Docker volume mounts.
 */
@Service("localStorageService")
public class LocalStorageService implements StorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalStorageService.class);

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".webp");

    @Value("${app.storage.local.upload-dir:uploads/products}")
    private String baseUploadDir;

    @Override
    public String upload(MultipartFile file, String subDirectory) throws IOException {
        validateFile(file);

        String subDir = (subDirectory != null && !subDirectory.isBlank()) ? subDirectory.trim() : "products";
        Path basePath = Paths.get("uploads", subDir).toAbsolutePath().normalize();
        if (!Files.exists(basePath)) {
            Files.createDirectories(basePath);
        }

        String ext = extractExtension(file.getOriginalFilename());
        String fileName = "prod_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;

        Path targetPath = basePath.resolve(fileName).normalize();
        if (!targetPath.startsWith(basePath)) {
            throw new BadRequestException("Invalid path traversal sequence detected in upload request");
        }

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        log.info("File successfully stored locally: {}", targetPath);

        return "/uploads/" + subDir + "/" + fileName;
    }

    @Override
    public boolean delete(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith("/uploads/")) {
            return false;
        }
        try {
            String relative = fileUrl.replaceFirst("^/uploads/", "");
            Path targetPath = Paths.get("uploads", relative).toAbsolutePath().normalize();
            Path basePath = Paths.get("uploads").toAbsolutePath().normalize();

            if (!targetPath.startsWith(basePath)) {
                log.warn("Path traversal attempt in file deletion: {}", fileUrl);
                return false;
            }

            return Files.deleteIfExists(targetPath);
        } catch (Exception e) {
            log.error("Failed to delete local file at '{}': {}", fileUrl, e.getMessage());
            return false;
        }
    }

    @Override
    public boolean exists(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith("/uploads/")) {
            return false;
        }
        try {
            String relative = fileUrl.replaceFirst("^/uploads/", "");
            Path targetPath = Paths.get("uploads", relative).toAbsolutePath().normalize();
            return Files.exists(targetPath);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String getStorageType() {
        return "LOCAL";
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
