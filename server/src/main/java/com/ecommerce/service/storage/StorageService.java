package com.ecommerce.service.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

/**
 * Storage abstraction separating media asset operations from the underlying persistence layer.
 * Enables zero-credential local file storage in development and S3-compatible cloud object storage in production.
 */
public interface StorageService {

    /**
     * Validates and persists a file to the configured storage medium.
     *
     * @param file the uploaded multipart file
     * @param subDirectory optional sub-directory or folder prefix (e.g., "products")
     * @return the authoritative public or relative URL to the stored asset
     * @throws IOException on validation or I/O failure
     */
    String upload(MultipartFile file, String subDirectory) throws IOException;

    /**
     * Deletes a file identified by its storage URL.
     *
     * @param fileUrl the asset URL previously returned by upload
     * @return true if deleted, false if not found or deletion failed
     */
    boolean delete(String fileUrl);

    /**
     * Checks if a file exists at the given URL.
     */
    boolean exists(String fileUrl);

    /**
     * Returns the name of the active storage provider ("LOCAL" or "S3_COMPATIBLE").
     */
    String getStorageType();
}
