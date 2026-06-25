package kz.kmg.dmaic.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

import jakarta.annotation.PostConstruct;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;

@Service
@RequiredArgsConstructor
public class StorageService {

    // Maps allowed content-types → file extension. Doubles as the allowlist.
    private static final Map<String, String> CONTENT_TYPE_TO_EXT = Map.of(
            "image/jpeg", ".jpg",
            "image/png",  ".png",
            "image/webp", ".webp");

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024L; // 5 MB

    // Stage file allowlist
    private static final Set<String> STAGE_FILE_TYPES = Set.of(
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",        // .xlsx
            "application/msword",        // .doc
            "application/vnd.ms-excel",  // .xls
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private static final Map<String, String> STAGE_TYPE_TO_EXT = Map.ofEntries(
            Map.entry("application/pdf", ".pdf"),
            Map.entry("application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"),
            Map.entry("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx"),
            Map.entry("application/msword", ".doc"),
            Map.entry("application/vnd.ms-excel", ".xls"),
            Map.entry("image/jpeg", ".jpg"),
            Map.entry("image/png", ".png"),
            Map.entry("image/webp", ".webp")
    );

    private static final long MAX_STAGE_FILE_SIZE = 10 * 1024 * 1024L; // 10 MB

    private final MinioClient minioClient;

    @Value("${app.minio.bucket}")
    private String bucket;

    @Value("${app.minio.endpoint}")
    private String endpoint;

    @PostConstruct
    public void initBucket() {
        try {
            boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            }
        } catch (Exception e) {
            System.err.println("WARNING: Failed to initialize Minio bucket on startup. Please ensure Minio is running. Error: " + e.getMessage());
        }
    }

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

    public String uploadStageFile(Long stageId, MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !STAGE_FILE_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(
                    "Allowed file types: PDF, DOCX, XLSX, DOC, XLS, JPEG, PNG, WebP");
        }
        if (file.getSize() > MAX_STAGE_FILE_SIZE) {
            throw new IllegalArgumentException("File size must not exceed 10 MB");
        }

        String ext = STAGE_TYPE_TO_EXT.getOrDefault(contentType, "");
        String objectName = "stages/" + stageId + "/" + UUID.randomUUID() + ext;

        try {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(contentType)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload stage file", e);
        }
        return endpoint + "/" + bucket + "/" + objectName;
    }

    public void deleteFile(String fileUrl) {
        // Extract object name from URL: endpoint/bucket/objectName
        String prefix = endpoint + "/" + bucket + "/";
        if (!fileUrl.startsWith(prefix)) return;
        String objectName = fileUrl.substring(prefix.length());

        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }
}
