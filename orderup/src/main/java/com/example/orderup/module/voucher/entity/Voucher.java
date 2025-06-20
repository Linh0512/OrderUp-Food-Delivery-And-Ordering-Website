package com.example.orderup.module.voucher.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "vouchers")
public class Voucher {
    @Id
    private String id;
    private String code;
    private double value;
    private String type; // "GLOBAL" hoặc "LOCAL"
    private String restaurantId; // null nếu là voucher global
    private VoucherCondition conditions;
    private VoucherValidity validity;
    private List<VoucherUsage> usage;
    private int remainingValue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive;
    
    public boolean isActive() {
        return this.isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public void updateActiveStatus() {
        boolean isExpired = this.validity.getExpiresAt().isBefore(LocalDateTime.now());
        boolean isOutOfStock = this.remainingValue <= 0;
        this.isActive = !isExpired && !isOutOfStock;
    }
    
    // Nested classes
    @Data
    public static class VoucherCondition {
        private double minimumOrderAmount;
    }

    @Data
    public static class VoucherValidity {
        private LocalDateTime issuedAt;
        private LocalDateTime expiresAt;
    }

    @Data
    public static class VoucherUsage {
        private String userId;
        private LocalDateTime usedAt;
    }
}