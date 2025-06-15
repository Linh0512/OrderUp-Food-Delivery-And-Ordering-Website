package com.example.orderup.module.user.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

@RestController
@RequestMapping("/api/users")
public class UserOrderHistoryController {
    private static final Logger logger = LoggerFactory.getLogger(UserOrderHistoryController.class);

    @Autowired
    private UserOrderHistoryService orderHistoryService;

    // Endpoint để lấy lịch sử đơn hàng theo userId
    @GetMapping("/orders/{userId}")
    public ResponseEntity<Map<String, Object>> getUserOrderHistory(
            @PathVariable("userId") String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            logger.debug("Fetching order history for userId: {}", userId);
            
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<UserOrderHistoryThumbDTO> ordersPage = orderHistoryService.getUserOrderHistory(userId, pageable);
            
            logger.debug("Found {} orders for userId: {}", ordersPage.getTotalElements(), userId);

            Map<String, Object> response = new HashMap<>();
            response.put("orders", ordersPage.getContent());
            response.put("currentPage", ordersPage.getNumber());
            response.put("totalItems", ordersPage.getTotalElements());
            response.put("totalPages", ordersPage.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching order history for userId: " + userId, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint để lấy chi tiết đơn hàng
    @GetMapping("/orders/{userId}/{orderId}")
    public ResponseEntity<UserOrderHistoryDetailDTO> getUserOrderDetail(
            @PathVariable("userId") String userId,
            @PathVariable("orderId") String orderId) {
        try {
            logger.debug("Fetching order detail for userId: {} and orderId: {}", userId, orderId);
            
            UserOrderHistoryDetailDTO orderDetail = orderHistoryService.getUserOrderDetail(userId, orderId);
            if (orderDetail != null) {
                logger.debug("Found order detail for orderId: {}", orderId);
                return new ResponseEntity<>(orderDetail, HttpStatus.OK);
            } else {
                logger.debug("Order not found for orderId: {}", orderId);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error fetching order detail for userId: " + userId + " and orderId: " + orderId, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
