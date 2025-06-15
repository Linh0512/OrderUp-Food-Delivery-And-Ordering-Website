package com.example.orderup.module.restaurant.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.orderup.module.restaurant.repository.ReviewRepository;
import com.example.orderup.module.restaurant.repository.RestaurantDetailRepository;
import com.example.orderup.module.restaurant.dto.ReviewDTO;
import com.example.orderup.module.restaurant.mapper.ReviewMapper;
import com.example.orderup.module.restaurant.dto.ReviewListResponseDTO;
import com.example.orderup.module.restaurant.entity.Review;
import com.example.orderup.module.restaurant.entity.Restaurant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private RestaurantDetailRepository restaurantRepository;
    
    @Autowired
    private ReviewMapper reviewMapper;
    
    public ReviewListResponseDTO getReviewsByRestaurantId(String restaurantId) {
        Restaurant restaurant = restaurantRepository.findRestaurantById(restaurantId);
        if (restaurant == null) {
            throw new RuntimeException("Không tìm thấy nhà hàng với id: " + restaurantId);
        }
        
        List<Review> reviews = reviewRepository.findByRestaurantId(restaurantId);
        List<ReviewDTO> reviewDTOs = reviews.stream()
                .map(review -> reviewMapper.toReviewDTO(review, restaurant))
                .collect(Collectors.toList());
                
        return ReviewListResponseDTO.builder()
                .count(reviewDTOs.size())
                .data(reviewDTOs)
                .build();
    }
}