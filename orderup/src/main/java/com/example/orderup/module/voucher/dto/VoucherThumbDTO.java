package com.example.orderup.module.voucher.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VoucherThumbDTO {
    private String id;
    private String code;
    private double value;
    private String type;
    private String restaurantId;
    private double minimumOrderAmount;
    private LocalDateTime expiresAt;
    private int remainingValue;
    private boolean isActive;
} 