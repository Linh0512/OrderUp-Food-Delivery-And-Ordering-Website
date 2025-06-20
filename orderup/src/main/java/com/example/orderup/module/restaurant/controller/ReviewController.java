package com.example.orderup.module.restaurant.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.orderup.module.restaurant.service.ReviewService;
import com.example.orderup.module.restaurant.dto.ReviewListResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.example.orderup.module.restaurant.dto.ReviewDTO;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/restaurant/{restaurantId}")
    public ReviewListResponseDTO getReviewsByRestaurantId(@PathVariable String restaurantId) {
        return reviewService.getReviewsByRestaurantId(restaurantId);
    }

    @PostMapping("/{restaurantId}/reviews")
    public ResponseEntity<?> createReview(
            @PathVariable String restaurantId,
            @RequestBody ReviewDTO.CreateReviewRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            ReviewDTO review = reviewService.createReview(restaurantId, request, token);
            if (review != null) {
                return new ResponseEntity<>(review, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>("User has not ordered from this restaurant", HttpStatus.FORBIDDEN);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{restaurantId}/reviews/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable String restaurantId,
            @PathVariable String reviewId,
            @RequestBody ReviewDTO.CreateReviewRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            ReviewDTO review = reviewService.updateReview(restaurantId, reviewId, request, token);
            return new ResponseEntity<>(review, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}