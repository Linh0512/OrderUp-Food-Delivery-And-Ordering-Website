package com.example.orderup.module.user.entirty;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;
import java.util.Date;
import java.util.List;
import lombok.Data;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String orderNumber;
    private ObjectId customerId;
    private ObjectId restaurantId;
    private OrderDetails orderDetails;
    private DeliveryInfo deliveryInfo;
    private List<OrderItem> orderItems;
    private Payment payment;
    private Promocode promocode;
    private OrderStatus status;
    private Timing timing;
    private ObjectId assignedDriver;
    private boolean isReview = false; // Trường để kiểm tra order đã được review chưa
    private Date createdAt;
    private Date updatedAt;
    
    @Data
    public static class OrderDetails {
        private List<OrderItem> items;
        private double subtotal;
        private double deliveryFee;
        private double serviceFee;
        private double tax;
        private double discount;
        private double totalAmount;
    }
    
    @Data
    public static class OrderItem {
        private ObjectId dishId;
        private String dishName;
        private String dishImage;
        private int quantity;
        private double unitPrice;
        private List<SelectedOption> selectedOptions;
        private double subtotal;
        private String specialInstructions;
    }
    
    @Data
    public static class SelectedOption {
        private String optionName;
        private String choiceName;
        private double additionalPrice;
    }
    
    @Data
    public static class DeliveryInfo {
        private Address address;
        private String customerName;
        private String customerPhone;
        private String deliveryInstructions;
        private String deliveryType;
        private Date estimatedDeliveryTime;
        private Date actualDeliveryTime;
    }
    
    @Data
    public static class Address {
        private String fullAddress;
        private String district;
        private String city;
        private GeoCoordinates coordinates;
    }
    
    @Data
    public static class GeoCoordinates {
        private double lat;
        private double lng;
    }
    
    @Data
    public static class Payment {
        private String method;
        private String status;
        private String transactionId;
        private Date paidAt;
    }
    
    @Data
    public static class Promocode {
        private String code;
        private double discountAmount;
        private String discountType;
    }
    
    @Data
    public static class StatusHistory {
        private String status;
        private Date timestamp;
        private String note;
    }
    
    @Data
    public static class OrderStatus {
        private String current;
        private List<StatusHistory> history;
    }
    
    @Data
    public static class Timing {
        private Date placedAt;
        private Date confirmedAt;
        private Date preparingAt;
        private Date readyAt;
        private Date pickedUpAt;
        private Date deliveredAt;
    }
}
