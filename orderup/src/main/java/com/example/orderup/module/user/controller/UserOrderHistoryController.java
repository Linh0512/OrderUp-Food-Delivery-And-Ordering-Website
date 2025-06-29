package com.example.orderup.module.user.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.orderup.module.user.dto.UserOrderHistoryThumbDTO;
import com.example.orderup.module.user.dto.UserOrderHistoryDetailDTO;
import com.example.orderup.module.user.service.UserOrderHistoryService;

import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/orders")
public class UserOrderHistoryController {
    private static final Logger logger = LoggerFactory.getLogger(UserOrderHistoryController.class);

    @Autowired
    private UserOrderHistoryService orderHistoryService;

    // Endpoint để lấy lịch sử đơn hàng theo userId
    @GetMapping("/userId")
    public ResponseEntity<Map<String, Object>> getUserOrderHistory(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String orderDate,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        try {
            logger.debug("Fetching order history for userId: {}", token);
            
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection), sortBy));

            LocalDateTime date = null;
            if (orderDate != null) {
                try {
                    date = LocalDateTime.parse(orderDate + "T00:00:00");
                } catch (Exception e) {
                    logger.error("Invalid date format: " + orderDate, e);
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
            
            Page<UserOrderHistoryThumbDTO> ordersPage = orderHistoryService.filterUserOrderByDate(token, date, pageable);

            logger.debug("Found {} orders for userId: {}", ordersPage.getTotalElements(), token);

            Map<String, Object> response = new HashMap<>();
            response.put("orders", ordersPage.getContent());
            response.put("currentPage", ordersPage.getNumber());
            response.put("totalItems", ordersPage.getTotalElements());
            response.put("totalPages", ordersPage.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching order history for userId: " + token, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint để lấy lịch sử đơn hàng theo restaurantId
    @GetMapping("/restaurantId/{restaurantId}")
    public ResponseEntity<Map<String, Object>> getRestaurantOrderHistory(
            @PathVariable("restaurantId") String restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String orderDate,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        try {
            logger.debug("Fetching order history for restaurantId: {}", restaurantId);
            
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection), sortBy));

            LocalDateTime date = null;
            if (orderDate != null) {
                try {
                    date = LocalDateTime.parse(orderDate + "T00:00:00");
                } catch (Exception e) {
                    logger.error("Invalid date format: " + orderDate, e);
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
            
            Page<UserOrderHistoryThumbDTO> ordersPage = orderHistoryService.filterRestaurantOrderByDate(restaurantId, date, pageable);

            logger.debug("Found {} orders for restaurantId: {}", ordersPage.getTotalElements(), restaurantId);

            Map<String, Object> response = new HashMap<>();
            response.put("orders", ordersPage.getContent());
            response.put("currentPage", ordersPage.getNumber());
            response.put("totalItems", ordersPage.getTotalElements());
            response.put("totalPages", ordersPage.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching order history for restaurantId: " + restaurantId, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint để lấy chi tiết đơn hàng
    @GetMapping("/{orderId}")
    public ResponseEntity<UserOrderHistoryDetailDTO> getOrderDetail(
            @PathVariable("orderId") String orderId) {
        try {
            logger.debug("Fetching order detail for orderId: {}", orderId);
            
            UserOrderHistoryDetailDTO orderDetail = orderHistoryService.getOrderDetail(orderId);
            if (orderDetail != null) {
                logger.debug("Found order detail for orderId: {}", orderId);
                return new ResponseEntity<>(orderDetail, HttpStatus.OK);
            } else {
                logger.debug("Order not found for orderId: {}", orderId);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error fetching order detail for orderId: " + orderId, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
