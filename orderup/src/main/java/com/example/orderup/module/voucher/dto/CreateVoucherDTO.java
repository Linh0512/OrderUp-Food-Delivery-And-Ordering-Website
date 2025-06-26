package com.example.orderup.module.voucher.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.example.orderup.config.JacksonConfig;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CreateVoucherDTO {
    private String code;
    private Double value;
    private String type; // Chỉ admin mới được set GLOBAL
    private String restaurantId; // Bắt buộc cho LOCAL voucher
    private Double minimumOrderAmount;
    
    @JsonDeserialize(using = JacksonConfig.LocalDateTimeDeserializer.class)
    private LocalDateTime issuedAt;
    
    @JsonDeserialize(using = JacksonConfig.LocalDateDeserializer.class)
    @JsonSerialize(using = JacksonConfig.LocalDateSerializer.class)
    private LocalDate expiresAt;
    
    private Integer remainingValue;
} 