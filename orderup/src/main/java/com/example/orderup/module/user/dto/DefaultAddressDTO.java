package com.example.orderup.module.user.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class DefaultAddressDTO {
    private Integer addressIndex;
    private String title;
    private String fullAddress;
} 