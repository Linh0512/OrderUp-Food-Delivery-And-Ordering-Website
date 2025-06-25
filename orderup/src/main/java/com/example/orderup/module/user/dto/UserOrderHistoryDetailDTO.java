package com.example.orderup.module.user.dto;

import java.util.List;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class UserOrderHistoryDetailDTO {
    private String id;
    private String orderNumber;
    private String orderDate;
    
    // Thông tin đặt hàng từ CheckoutDTO
    private DeliveryInfo deliveryInfo;
    private PaymentInfo paymentInfo;
    private PromoInfo promoInfo;
    
    // Thông tin tổng quan đơn hàng
    private OrderSummary orderSummary;
    
    // Danh sách món ăn
    private List<OrderItem> orderItems;

    private UserProfile userProfile;

    @Data
    @Builder
    public static class UserProfile {
        private String fullName;
        private String avatar;
        private String dateOfBirth;
        private String gender;
        private String address;
    }

    @Data
    @Builder
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
    public static class PaymentInfo {
        private String method; // CASH, MOMO, ZALOPAY, etc.
    }
    
    @Data
    @Builder
    public static class PromoInfo {
        private String code;
        private double discountAmount;
    }
    
    @Data
    @Builder
    public static class OrderSummary {
        private double subtotal;
        private double deliveryFee;
        private double serviceFee;
        private double discount;
        private double total;
        private double finalTotal;

        public void setFinalTotal() {
            this.finalTotal = this.total - this.discount;
        }
    }

    @Data
    @Builder
    public static class OrderItem {
        private String dishId;
        private String dishName;
        private String dishImage;
        private int quantity;
        private double unitPrice;
        private double subtotal;
        private String specialInstructions;
        private List<OrderItemOption> selectedOptions;
    }

    @Data
    @Builder
    public static class OrderItemOption {
        private String optionName;
        private String choiceName;
        private double additionalPrice;
    }
}
