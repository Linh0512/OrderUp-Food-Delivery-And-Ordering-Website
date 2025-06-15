package com.example.orderup.module.restaurant.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.example.orderup.module.restaurant.service.RestaurantDashboardService;
import com.example.orderup.module.restaurant.dto.OrderDashboardDTO;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantDashboardController {

    @Autowired
    private RestaurantDashboardService dashboardService;

    @GetMapping("/{restaurantId}/dashboard")
    public ResponseEntity<OrderDashboardDTO> getDashboardData(@PathVariable String restaurantId) {
        try {
            OrderDashboardDTO dashboardData = dashboardService.getDashboardData(restaurantId);
            return new ResponseEntity<>(dashboardData, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 