package com.example.orderup.module.voucher.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.example.orderup.config.JacksonConfig;
import lombok.Data;
import java.time.LocalDate;

@Data
public class VoucherThumbDTO {
    private String id;
    private String code;
    private double value;
    private String type;
    private String restaurantId;
    private double minimumOrderAmount;
    
    @JsonSerialize(using = JacksonConfig.LocalDateSerializer.class)
    private LocalDate expiresAt;
    
    private Integer remainingValue;
    private boolean isActive;
} 