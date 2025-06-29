package com.example.orderup.module.voucher.dto;

import lombok.Data;

@Data
public class CreateVoucherDTO {
    private String code;
    private Double value;
    private String type; // Chỉ admin mới được set GLOBAL
    private String restaurantId; // Bắt buộc cho LOCAL voucher
    private Double minimumOrderAmount;
    
    // Tạm thời dùng String để debug format từ frontend
    private String issuedAt;
    private String expiresAt;
    
    private Integer remainingValue;
} 