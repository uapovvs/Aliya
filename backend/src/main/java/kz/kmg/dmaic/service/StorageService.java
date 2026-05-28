package kz.kmg.dmaic.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageService {

    // Maps allowed content-types → file extension. Doubles as the allowlist.
    private static final Map<String, String> CONTENT_TYPE_TO_EXT = Map.of(
            "image/jpeg", ".jpg",
            "image/png",  ".png",
            "image/webp", ".webp");

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024L; // 5 MB

    private final MinioClient minioClient;

    @Value("${app.minio.bucket}")
    private String bucket;

    @Value("${app.minio.endpoint}")
    private String endpoint;

    public String uploadAvatar(Long userId, MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !CONTENT_TYPE_TO_EXT.containsKey(contentType)) {
            throw new IllegalArgumentException("Only JPEG, PNG or WebP images are allowed");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size must not exceed 5 MB");
        }

        // Never use original filename — generate a safe name with a fixed extension
        String ext = CONTENT_TYPE_TO_EXT.get(contentType);
        String objectName = "avatars/" + userId + "/" + UUID.randomUUID() + ext;

        try {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(contentType)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload avatar", e);
        }
        return endpoint + "/" + bucket + "/" + objectName;
    }
}
