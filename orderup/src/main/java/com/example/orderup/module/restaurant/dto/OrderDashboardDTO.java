package com.example.orderup.module.restaurant.dto;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class OrderDashboardDTO {
    private double totalRevenue;
    private double currentMonthRevenue;
    private Map<String, Double> revenueByMonth;
    private int totalOrders;
    private int todayOrders;
    private int currentMonthOrders;
    private int processingOrders;
    private Map<String, Integer> ordersByMonth;
    private LocalDateTime lastUpdated;
}
