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
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import org.bson.types.ObjectId;

import com.example.orderup.module.user.repository.UserProfileRepository;
import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.repository.UserOrderHistoryRepository;
import com.example.orderup.module.user.entirty.Order;
import com.example.orderup.repositories.RestaurantRepository;
import com.example.orderup.config.security.JwtTokenProvider;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private UserProfileRepository userProfileRepository;
    
    @Autowired
    private UserOrderHistoryRepository orderRepository;
    
    @Autowired
    private ReviewMapper reviewMapper;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    public ReviewListResponseDTO getReviewsByRestaurantId(String restaurantId) {
        Restaurant restaurant = restaurantRepository.findRestaurantById(restaurantId);
        if (restaurant == null) {
            throw new RuntimeException("Không tìm thấy nhà hàng với id: " + restaurantId);
        }
        
        // Lấy order gần nhất từ nhà hàng
        Order latestOrder = orderRepository.findByRestaurantId(new ObjectId(restaurantId)).get(0);
        
        List<Review> reviews = reviewRepository.findByRestaurantId(restaurantId);
        List<ReviewDTO> reviewDTOs = reviews.stream()
                .map(review -> reviewMapper.toReviewDTO(review, restaurant, latestOrder))
                .collect(Collectors.toList());
                
        return ReviewListResponseDTO.builder()
                .count(reviewDTOs.size())
                .data(reviewDTOs)
                .build();
    }

    public ReviewDTO createReview(String restaurantId, ReviewDTO.CreateReviewRequest request, String token) {
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        
        // Kiểm tra xem user đã review nhà hàng này chưa
        Optional<Review> existingReview = reviewRepository.findByUserIdAndRestaurantId(userId, restaurantId);
        if (existingReview.isPresent()) {
            throw new RuntimeException("Bạn đã review nhà hàng này rồi. Vui lòng sử dụng chức năng cập nhật review nếu cần.");
        }

        // Kiểm tra xem user có order từ nhà hàng này không
        List<Order> userOrders = orderRepository.findByRestaurantId(new ObjectId(restaurantId));
        if (userOrders == null || userOrders.isEmpty()) {
            return null;
        }

        // Lấy thông tin user
        User user = userProfileRepository.findByUserId(userId);
        if (user == null) {
            return null;
        }

        // Lấy thông tin nhà hàng
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElse(null);
        if (restaurant == null) {
            return null;
        }

        // Lấy danh sách món ăn đã đặt từ order gần nhất
        Order latestOrder = userOrders.get(userOrders.size() - 1);
        List<ReviewDTO.OrderItem> orderedItems = latestOrder.getOrderDetails().getItems().stream()
            .map(item -> ReviewDTO.OrderItem.builder()
                .dishName(item.getDishName())
                .dishImage(item.getDishImage())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .build())
            .collect(Collectors.toList());

        // Tạo review mới
        Review review = new Review();
        review.setUserId(userId);
        review.setRestaurantId(restaurantId);
        review.setComment(request.getUserComment());
        review.setRating((int) request.getRating());
        review.setImages(request.getImages());
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        // Lưu review
        Review savedReview = reviewRepository.save(review);

        // Cập nhật thông tin đánh giá của nhà hàng
        updateRestaurantRatings(restaurant, request.getRating());

        // Chuyển đổi sang DTO
        ReviewDTO reviewDTO = reviewMapper.toDTO(savedReview);
        reviewDTO.setUserName(user.getProfile().getName());
        reviewDTO.setUserAvatar(user.getProfile().getAvatar());
        reviewDTO.setOrderItems(orderedItems);

        return reviewDTO;
    }

    public ReviewDTO updateReview(String restaurantId, String reviewId, ReviewDTO.CreateReviewRequest request, String token) {
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        
        // Tìm review cần cập nhật
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy review với id: " + reviewId));
            
        // Kiểm tra quyền cập nhật
        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền cập nhật review này");
        }
        
        // Lấy rating cũ để cập nhật thống kê
        int oldRating = review.getRating();
        
        // Cập nhật thông tin review
        review.setComment(request.getUserComment());
        review.setRating((int) request.getRating());
        review.setImages(request.getImages());
        review.setUpdatedAt(LocalDateTime.now());
        
        // Lưu review
        Review savedReview = reviewRepository.save(review);
        
        // Cập nhật thông tin đánh giá của nhà hàng
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElse(null);
        if (restaurant != null) {
            updateRestaurantRatingsForUpdate(restaurant, oldRating, request.getRating());
        }
        
        // Lấy thông tin user
        User user = userProfileRepository.findByUserId(userId);
        
        // Chuyển đổi sang DTO
        ReviewDTO reviewDTO = reviewMapper.toDTO(savedReview);
        if (user != null) {
            reviewDTO.setUserName(user.getProfile().getName());
            reviewDTO.setUserAvatar(user.getProfile().getAvatar());
        }
        
        return reviewDTO;
    }

    private void updateRestaurantRatings(Restaurant restaurant, double newRating) {
        // Cập nhật số lượng review và rating trung bình
        int currentTotal = restaurant.getRatings().getTotalReviews();
        double currentAvg = restaurant.getRatings().getAverageRating();
        
        // Tính toán rating trung bình mới
        double newAverage = ((currentAvg * currentTotal) + newRating) / (currentTotal + 1);
        
        // Cập nhật rating breakdown
        int starCount = (int) newRating;
        restaurant.getRatings().getRatingBreakdown().put(starCount + "star", 
            restaurant.getRatings().getRatingBreakdown().getOrDefault(starCount + "star", 0) + 1);
        
        // Cập nhật tổng số review và rating trung bình
        restaurant.getRatings().setTotalReviews(currentTotal + 1);
        restaurant.getRatings().setAverageRating(Math.round(newAverage * 10.0) / 10.0);
        
        // Lưu nhà hàng
        restaurantRepository.save(restaurant);
    }

    private void updateRestaurantRatingsForUpdate(Restaurant restaurant, int oldRating, double newRating) {
        // Cập nhật số lượng trong rating breakdown
        restaurant.getRatings().getRatingBreakdown().put(oldRating + "star", 
            restaurant.getRatings().getRatingBreakdown().get(oldRating + "star") - 1);
        restaurant.getRatings().getRatingBreakdown().put((int)newRating + "star", 
            restaurant.getRatings().getRatingBreakdown().getOrDefault((int)newRating + "star", 0) + 1);
        
        // Cập nhật rating trung bình
        int totalReviews = restaurant.getRatings().getTotalReviews();
        double currentTotal = restaurant.getRatings().getAverageRating() * totalReviews;
        double newAverage = (currentTotal - oldRating + newRating) / totalReviews;
        restaurant.getRatings().setAverageRating(Math.round(newAverage * 10.0) / 10.0);
        
        // Lưu nhà hàng
        restaurantRepository.save(restaurant);
    }
}