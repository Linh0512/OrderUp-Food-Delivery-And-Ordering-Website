package com.example.orderup.module.restaurant.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestHeader;

import com.example.orderup.module.restaurant.service.RestaurantDetailService;
import com.example.orderup.module.restaurant.dto.RestaurantDetailResponseDTO;

@RestController
@RequestMapping("/api/restaurant-detail")
public class RestaurantDetailController {

    @Autowired
    private RestaurantDetailService restaurantDetailService;

    @GetMapping("/{restaurantId}")
    public RestaurantDetailResponseDTO getRestaurantDetail(
            @PathVariable String restaurantId,
            @RequestHeader(value = "Authorization", required = false) String token) {
        return restaurantDetailService.getRestaurantDetail(restaurantId, token);
    }
}
