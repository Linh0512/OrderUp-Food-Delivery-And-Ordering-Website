package com.example.orderup.module.voucher.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Date;
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
    
    @JsonProperty("remainingValue")
    private Integer remainingValue;
    
    private Date createdAt;
    private Date updatedAt;
    private boolean isActive;
    
    public boolean isActive() {
        return this.isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public void updateActiveStatus() {
        if (this.validity != null && this.validity.getExpiresAt() != null) {
            boolean isExpired = this.validity.getExpiresAt().before(new Date());
            boolean isOutOfStock = this.remainingValue != null && this.remainingValue <= 0;
            this.isActive = !isExpired && !isOutOfStock;
        } else {
            this.isActive = false;
        }
    }
    
    // Nested classes
    @Data
    public static class VoucherCondition {
        private double minimumOrderAmount;
    }

    @Data
    public static class VoucherValidity {
        private Date issuedAt;
        private Date expiresAt;
    }

    @Data
    public static class VoucherUsage {
        private String userId;
        private Date usedAt;
    }
}