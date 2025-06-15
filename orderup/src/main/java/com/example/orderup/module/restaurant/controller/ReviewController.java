package com.example.orderup.module.restaurant.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.orderup.module.restaurant.service.ReviewService;
import com.example.orderup.module.restaurant.dto.ReviewListResponseDTO;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/restaurant/{restaurantId}")
    public ReviewListResponseDTO getReviewsByRestaurantId(@PathVariable String restaurantId) {
        return reviewService.getReviewsByRestaurantId(restaurantId);
    }
}