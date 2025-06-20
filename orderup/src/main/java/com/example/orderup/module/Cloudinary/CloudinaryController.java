package com.example.orderup.module.Cloudinary;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/cloudinary")
@Slf4j
public class CloudinaryController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "uploads") String folder) {
        
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "File không được để trống"));
            }

            // Check file size (10MB limit)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "File quá lớn. Giới hạn 10MB"));
            }

            CloudinaryResponse response = cloudinaryService.uploadFile(file, folder);
            
            log.info("File uploaded successfully: {}", response.getPublicId());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Upload thành công",
                "data", response
            ));

        } catch (Exception e) {
            log.error("Upload failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "error", "Upload thất bại: " + e.getMessage()
                ));
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "folder", defaultValue = "images") String folder) {
        
        try {
            // Validate image
            if (image.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Hình ảnh không được để trống"));
            }

            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "File phải là hình ảnh"));
            }

            CloudinaryResponse response = cloudinaryService.uploadImage(image, folder);
            
            log.info("Image uploaded successfully: {}", response.getPublicId());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Upload hình ảnh thành công",
                "data", response
            ));

        } catch (Exception e) {
            log.error("Image upload failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "error", "Upload hình ảnh thất bại: " + e.getMessage()
                ));
        }
    }

    @DeleteMapping("/delete/{publicId}")
    public ResponseEntity<?> deleteFile(@PathVariable String publicId) {
        try {
            // Replace underscores with slashes for nested folder structure
            String decodedPublicId = publicId.replace("_", "/");
            
            boolean deleted = cloudinaryService.deleteFile(decodedPublicId);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Xóa file thành công"
                ));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Không thể xóa file"));
            }

        } catch (Exception e) {
            log.error("Delete failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "error", "Xóa file thất bại: " + e.getMessage()
                ));
        }
    }

    @GetMapping("/optimize/{publicId}")
    public ResponseEntity<?> getOptimizedUrl(
            @PathVariable String publicId,
            @RequestParam(defaultValue = "800") int width,
            @RequestParam(defaultValue = "600") int height) {
        
        try {
            String decodedPublicId = publicId.replace("_", "/");
            String optimizedUrl = cloudinaryService.getOptimizedUrl(decodedPublicId, width, height);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "url", optimizedUrl
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false,
                    "error", "Không thể tạo URL: " + e.getMessage()
                ));
        }
    }
}