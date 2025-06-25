package com.example.orderup.module.restaurant.mapper;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import com.example.orderup.module.restaurant.dto.RestaurantDetailDTO;
import com.example.orderup.module.restaurant.dto.RestaurantDetailResponseDTO;
import com.example.orderup.module.restaurant.dto.DishThumbDTO;
import com.example.orderup.module.restaurant.dto.RestaurantProfileDTO;
import com.example.orderup.module.restaurant.dto.RestaurantProfileResponseDTO;
import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.entity.Dish;
import com.example.orderup.module.restaurant.entity.Review;
import com.example.orderup.module.restaurant.service.RestaurantService;
import com.example.orderup.module.user.entirty.Order;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class RestaurantDetailMapper {

    @Autowired
    private DishMapper dishMapper;

    @Autowired
    private RestaurantService restaurantService;

    public RestaurantDetailDTO toRestaurantDetailDTO(Restaurant restaurant, List<Dish> dishes, String userId) {
        double distance = 0.0;
        if (userId != null && restaurant != null) {
            distance = restaurantService.generateDistance(restaurant.getId(), userId);
        }

        List<DishThumbDTO> dishDTOs = dishes != null ? 
            dishes.stream()
                .map(dish -> dishMapper.toDishThumbDTO(dish, restaurant))
                .collect(Collectors.toList()) 
            : new ArrayList<>();

        return RestaurantDetailDTO.builder()
            .restaurantId(restaurant.getId())
            .restaurantName(restaurant.getBasicInfo() != null ? 
                restaurant.getBasicInfo().getName() : "Chưa cập nhật")
            .restaurantAddress(restaurant.getAddress() != null ? 
                restaurant.getAddress().getFullAddress() : "Chưa cập nhật")
            .restaurantPhone(restaurant.getBasicInfo() != null ? 
                restaurant.getBasicInfo().getPhone() : "Chưa cập nhật")
            .distance(distance)
            .restaurantReviewCount(restaurant.getRatings() != null ? 
                restaurant.getRatings().getTotalReviews() : 0)
            .restaurantStar(restaurant.getRatings() != null ? 
                restaurant.getRatings().getAverageRating() : 0.0)
            .ratingBreakdown(restaurant.getRatings() != null ? 
                restaurant.getRatings().getRatingBreakdown() : null)
            .restaurantIsActive(restaurant.isActive())
            .restaurantTimeRange(generateTimeRange(restaurant))
            .restaurantPriceRange(getPriceRange(restaurant))
            .restaurantImage(getFirstImage(restaurant))
            .dishes(dishDTOs)
            .build();
    }

    public RestaurantDetailResponseDTO toRestaurantDetailResponseDTO(Restaurant restaurant, List<Dish> dishes, String userId) {
        return RestaurantDetailResponseDTO.builder()
            .data(toRestaurantDetailDTO(restaurant, dishes, userId))
            .build();
    }

    public RestaurantProfileDTO toRestaurantProfileDTO(Restaurant restaurant, String userId) {

        return RestaurantProfileDTO.builder()
            .restaurantId(restaurant.getId())
            .restaurantName(restaurant.getBasicInfo() != null ? 
                restaurant.getBasicInfo().getName() : "Chưa cập nhật")
            .restaurantImages(restaurant.getBasicInfo() != null ? 
                restaurant.getBasicInfo().getImages() : null)
            .restaurantOwner(restaurant.getHostId() != null ? 
                restaurant.getHostId() : "Chưa cập nhật")
            .restaurantDescription(restaurant.getBasicInfo() != null ? 
                restaurant.getBasicInfo().getDescription() : "Chưa cập nhật")
            .restaurantEmail(restaurant.getBasicInfo() != null ? 
                restaurant.getBasicInfo().getEmail() : "Chưa cập nhật")
            .restaurantWebsite(restaurant.getBasicInfo() != null ? 
                restaurant.getBasicInfo().getWebsite() : "Chưa cập nhật")
            .restaurantAddress(restaurant.getAddress() != null ? 
                restaurant.getAddress().getFullAddress() : "Chưa cập nhật")
            .restaurantPhone(restaurant.getBasicInfo() != null ? 
                restaurant.getBasicInfo().getPhone() : "Chưa cập nhật")
            .restaurantReviewCount(restaurant.getRatings() != null ? 
                restaurant.getRatings().getTotalReviews() : 0)
            .restaurantStar(restaurant.getRatings() != null ? 
                restaurant.getRatings().getAverageRating() : 0.0)
            .ratingBreakdown(restaurant.getRatings() != null ? 
                restaurant.getRatings().getRatingBreakdown() : null)
            .restaurantIsActive(restaurant.isActive())
            .restaurantTimeRange(generateTimeRange(restaurant))
            .restaurantPriceRange(getPriceRange(restaurant))
            .restaurantDeliveryRadius(restaurant.getDelivery() != null ? 
                restaurant.getDelivery().getDeliveryRadius() + " km" : "Chưa cập nhật")
            .restaurantDeliveryTime(restaurant.getDelivery() != null ? 
                restaurant.getDelivery().getEstimatedDeliveryTime() + " phút" : "Chưa cập nhật")
            .restaurantDeliveryFee(restaurant.getDelivery() != null ? 
                restaurant.getDelivery().getDeliveryFee() + " VND" : "Chưa cập nhật")
            .restaurantDeliveryAvailable(restaurant.getDelivery() != null ? 
                restaurant.getDelivery().isDeliveryAvailable() : false)
            .build();
    }

    public RestaurantProfileResponseDTO toRestaurantProfileResponseDTO(Restaurant restaurant, String userId) {
        return RestaurantProfileResponseDTO.builder()
            .data(toRestaurantProfileDTO(restaurant, userId))
            .build();
    }

    private String generateTimeRange(Restaurant restaurant) {
        if (restaurant == null || restaurant.getOperatingHours() == null || 
            restaurant.getOperatingHours().isEmpty()) {
            return "Chưa cập nhật";
        }

        Restaurant.OperatingHour weekdayHour = restaurant.getOperatingHours().stream()
                .filter(oh -> oh.getDayOfWeek() >= 1 && oh.getDayOfWeek() <= 5 && oh.isOpen())
                .findFirst()
                .orElse(restaurant.getOperatingHours().get(0));

        if (weekdayHour != null && weekdayHour.isOpen()) {
            return weekdayHour.getOpenTime() + " - " + weekdayHour.getCloseTime();
        }

        return "Đóng cửa";
    }

    private String getPriceRange(Restaurant restaurant) {
        if (restaurant != null && restaurant.getBasicInfo() != null && 
            restaurant.getBasicInfo().getPriceRange() != null) {
            return restaurant.getBasicInfo().getPriceRange();
        }
        return "Chưa cập nhật";
    }

    private String getFirstImage(Restaurant restaurant) {
        if (restaurant != null && restaurant.getBasicInfo() != null && 
            restaurant.getBasicInfo().getImages() != null && 
            !restaurant.getBasicInfo().getImages().isEmpty()) {
            return restaurant.getBasicInfo().getImages().get(0);
        }
        return null;
    }
}
