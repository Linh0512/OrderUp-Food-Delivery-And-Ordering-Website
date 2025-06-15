package com.example.orderup.module.restaurant.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.orderup.module.restaurant.dto.OrderDashboardDTO;
import com.example.orderup.module.restaurant.dto.OrderSummaryDTO;
import com.example.orderup.module.restaurant.repository.OrderRepository;
import com.example.orderup.module.restaurant.repository.RestaurantDetailRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RestaurantDashboardService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestaurantDetailRepository restaurantRepository;
    
    @Autowired
    private MongoTemplate mongoTemplate;

    public OrderDashboardDTO getDashboardData(String restaurantId) {
        // Kiểm tra nhà hàng tồn tại
        Query query = new Query(Criteria.where("_id").is(restaurantId));
        boolean exists = mongoTemplate.exists(query, "restaurants");
        if (!exists) {
            throw new RuntimeException("Không tìm thấy nhà hàng với id: " + restaurantId);
        }

        // Lấy thời gian hiện tại
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();
        
        // Lấy danh sách đơn hàng của nhà hàng
        List<OrderSummaryDTO> allOrders = orderRepository.findByRestaurantId(restaurantId);
        
        // Tính toán các thông số
        double totalRevenue = calculateTotalRevenue(allOrders);
        double currentMonthRevenue = calculateCurrentMonthRevenue(allOrders, now);
        Map<String, Double> revenueByMonth = calculateRevenueByMonth(allOrders);
        
        int totalOrders = allOrders.size();
        int todayOrders = calculateTodayOrders(allOrders, today);
        int currentMonthOrders = calculateCurrentMonthOrders(allOrders, now);
        int processingOrders = calculateProcessingOrders(allOrders);
        Map<String, Integer> ordersByMonth = calculateOrdersByMonth(allOrders);

        // Tạo và trả về DTO
        return OrderDashboardDTO.builder()
                .totalRevenue(totalRevenue)
                .currentMonthRevenue(currentMonthRevenue)
                .revenueByMonth(revenueByMonth)
                .totalOrders(totalOrders)
                .todayOrders(todayOrders)
                .currentMonthOrders(currentMonthOrders)
                .processingOrders(processingOrders)
                .ordersByMonth(ordersByMonth)
                .lastUpdated(now)
                .build();
    }

    private double calculateTotalRevenue(List<OrderSummaryDTO> orders) {
        return orders.stream()
                .mapToDouble(OrderSummaryDTO::getTotalAmount)
                .sum();
    }

    private double calculateCurrentMonthRevenue(List<OrderSummaryDTO> orders, LocalDateTime now) {
        return orders.stream()
                .filter(order -> {
                    LocalDateTime orderDate = order.getCreatedAt();
                    return orderDate != null && 
                           orderDate.getYear() == now.getYear() && 
                           orderDate.getMonthValue() == now.getMonthValue();
                })
                .mapToDouble(OrderSummaryDTO::getTotalAmount)
                .sum();
    }

    private Map<String, Double> calculateRevenueByMonth(List<OrderSummaryDTO> orders) {
        return orders.stream()
                .filter(order -> order.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                    order -> order.getCreatedAt().getYear() + "-" + order.getCreatedAt().getMonthValue(),
                    Collectors.summingDouble(OrderSummaryDTO::getTotalAmount)
                ));
    }

    private int calculateTodayOrders(List<OrderSummaryDTO> orders, LocalDate today) {
        return (int) orders.stream()
                .filter(order -> order.getCreatedAt() != null && 
                               order.getCreatedAt().toLocalDate().equals(today))
                .count();
    }

    private int calculateCurrentMonthOrders(List<OrderSummaryDTO> orders, LocalDateTime now) {
        return (int) orders.stream()
                .filter(order -> {
                    LocalDateTime orderDate = order.getCreatedAt();
                    return orderDate != null && 
                           orderDate.getYear() == now.getYear() && 
                           orderDate.getMonthValue() == now.getMonthValue();
                })
                .count();
    }

    private int calculateProcessingOrders(List<OrderSummaryDTO> orders) {
        return (int) orders.stream()
                .filter(order -> "PROCESSING".equals(order.getStatus()))
                .count();
    }

    private Map<String, Integer> calculateOrdersByMonth(List<OrderSummaryDTO> orders) {
        return orders.stream()
                .filter(order -> order.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                    order -> order.getCreatedAt().getYear() + "-" + order.getCreatedAt().getMonthValue(),
                    Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
    }
} 