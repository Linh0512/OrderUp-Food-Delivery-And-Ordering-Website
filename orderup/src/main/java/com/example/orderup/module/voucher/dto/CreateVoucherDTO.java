package com.example.orderup.module.voucher.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateVoucherDTO {
    private String code;
    private Double value;
    private String type; // Chỉ admin mới được set GLOBAL
    private String restaurantId; // Bắt buộc cho LOCAL voucher
    private Double minimumOrderAmount;
    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;
    private Integer remainingValue;
} 