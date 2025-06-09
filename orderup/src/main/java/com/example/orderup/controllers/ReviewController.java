package com.example.orderup.controllers;

import com.example.orderup.models.entities.Res.Review;
import com.example.orderup.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> getReviewsByRestaurant(
            @PathVariable String restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviews = reviewRepository.findByRestaurantIdAndIsVisibleTrue(restaurantId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/dish/{dishId}")
    public ResponseEntity<?> getReviewsByDish(
            @PathVariable String dishId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviews = reviewRepository.findByDishIdAndIsVisibleTrue(dishId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getReviewsByUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Review> reviews = reviewRepository.findByUserId(userId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/restaurant/{restaurantId}/rating/{rating}")
    public ResponseEntity<?> getReviewsByRating(
            @PathVariable String restaurantId,
            @PathVariable int rating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewRepository.findByRestaurantIdAndRatingAndIsVisibleTrue(restaurantId, rating, pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/restaurant/{restaurantId}/recommended")
    public ResponseEntity<?> getRecommendedReviews(
            @PathVariable String restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewRepository.findByRestaurantIdAndIsRecommendedTrueAndIsVisibleTrue(restaurantId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReviewById(@PathVariable String id) {
        Optional<Review> review = reviewRepository.findById(id);
        if (review.isPresent()) {
            return ResponseEntity.ok(review.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review) {
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());
        review.setVisible(true);
        review.setEdited(false);
        Review savedReview = reviewRepository.save(review);
        return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable String id, @RequestBody Review reviewDetails) {
        return reviewRepository.findById(id)
                .map(review -> {
                    // Update fields
                    review.setRating(reviewDetails.getRating());
                    review.setComment(reviewDetails.getComment());
                    if (reviewDetails.getImages() != null) {
                        review.setImages(reviewDetails.getImages());
                    }
                    review.setEdited(true);
                    review.setUpdatedAt(LocalDateTime.now());
                    
                    return ResponseEntity.ok(reviewRepository.save(review));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reply")
    public ResponseEntity<?> addReply(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        String replyText = payload.get("reply");
        if (replyText == null || replyText.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Reply text is required");
        }
        
        return reviewRepository.findById(id)
                .map(review -> {
                    review.setReplyFromRestaurant(replyText);
                    review.setReplyDate(LocalDateTime.now());
                    review.setUpdatedAt(LocalDateTime.now());
                    
                    return ResponseEntity.ok(reviewRepository.save(review));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/visibility")
    public ResponseEntity<?> updateVisibility(
            @PathVariable String id,
            @RequestParam boolean visible) {
        return reviewRepository.findById(id)
                .map(review -> {
                    review.setVisible(visible);
                    review.setUpdatedAt(LocalDateTime.now());
                    
                    return ResponseEntity.ok(reviewRepository.save(review));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/recommend")
    public ResponseEntity<?> updateRecommendation(
            @PathVariable String id,
            @RequestParam boolean recommended) {
        return reviewRepository.findById(id)
                .map(review -> {
                    review.setRecommended(recommended);
                    review.setUpdatedAt(LocalDateTime.now());
                    
                    return ResponseEntity.ok(reviewRepository.save(review));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable String id) {
        return reviewRepository.findById(id)
                .map(review -> {
                    reviewRepository.delete(review);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/restaurant/{restaurantId}/stats")
    public ResponseEntity<?> getReviewStats(@PathVariable String restaurantId) {
        long totalReviews = reviewRepository.countByRestaurantId(restaurantId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReviews", totalReviews);
        
        // Calculate average rating
        List<Review> allReviews = reviewRepository.findAllVisibleByRestaurantId(restaurantId);
        if (!allReviews.isEmpty()) {
            double avgRating = allReviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            stats.put("averageRating", avgRating);
            
            // Calculate rating breakdown
            Map<Integer, Long> ratingBreakdown = new HashMap<>();
            for (int i = 1; i <= 5; i++) {
                final int rating = i;
                long count = allReviews.stream().filter(r -> r.getRating() == rating).count();
                ratingBreakdown.put(i, count);
            }
            stats.put("ratingBreakdown", ratingBreakdown);
        } else {
            stats.put("averageRating", 0.0);
            stats.put("ratingBreakdown", Map.of());
        }
        
        return ResponseEntity.ok(stats);
    }
}
