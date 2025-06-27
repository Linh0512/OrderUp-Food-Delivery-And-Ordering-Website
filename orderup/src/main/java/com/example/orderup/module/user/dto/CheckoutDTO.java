package com.example.orderup.module.user.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutDTO {
    private String cartId;
    
    // Thông tin giao hàng
    private DeliveryInfo deliveryInfo;
    
    // Thông tin thanh toán
    private PaymentInfo paymentInfo;
    
    // Mã giảm giá
    private PromoInfo promoInfo;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeliveryInfo {
        private String fullAddress;
        private String district;
        private String city;
        private String customerName;
        private String customerPhone;
        private String deliveryInstructions;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentInfo {
        private String method; // CASH, MOMO, ZALOPAY, etc.
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PromoInfo {
        private String code;
    }
} 