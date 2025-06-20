package com.example.orderup.module.Cloudinary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CloudinaryResponse {
    private String publicId;
    private String url;
    private String format;
    private String resourceType;
    private Integer width;
    private Integer height;
}