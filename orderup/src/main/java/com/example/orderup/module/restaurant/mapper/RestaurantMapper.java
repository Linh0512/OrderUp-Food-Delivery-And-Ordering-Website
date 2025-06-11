package com.example.orderup.module.restaurant.mapper;

import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.dto.ShopThumbDTO;
import com.example.orderup.module.restaurant.dto.ShopThumbResponseDTO;
import org.springframework.stereotype.Component;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RestaurantMapper {

    public ShopThumbDTO toShopThumbDTO(Restaurant restaurant) {
        return ShopThumbDTO.builder()
                .id(restaurant.getId())
                .name(restaurant.getBasicInfo() != null ? restaurant.getBasicInfo().getName() : "Chưa cập nhật")
                .address(restaurant.getAddress() != null ? restaurant.getAddress().getFullAddress() : "Chưa cập nhật")
                .review(restaurant.getRatings() != null ? restaurant.getRatings().getTotalReviews() : 0)
                .star(restaurant.getRatings() != null ? restaurant.getRatings().getAverageRating() : 0.0)
                .isActive(restaurant.isActive())
                .timeRange(generateTimeRange(restaurant))
                .priceRange(priceRange(restaurant))
                .image(getFirstImage(restaurant))
                .build();
    }

    public ShopThumbResponseDTO toShopThumbResponseDTO(List<Restaurant> restaurants) {
        List<ShopThumbDTO> shopDetails = restaurants.stream()
                .map(this::toShopThumbDTO)
                .collect(Collectors.toList());

        return ShopThumbResponseDTO.builder()
                .count(shopDetails.size())
                .data(shopDetails)
                .build();
    }

    public ShopThumbResponseDTO toShopThumbResponseDTO(Page<Restaurant> restaurantPage) {
        List<ShopThumbDTO> shopDetails = restaurantPage.getContent().stream()
                .map(this::toShopThumbDTO)
                .collect(Collectors.toList());

        return ShopThumbResponseDTO.builder()
                .count((int) restaurantPage.getTotalElements())
                .data(shopDetails)
                .build();
    }

    private String generateTimeRange(Restaurant restaurant) {
        if (restaurant.getOperatingHours() == null || restaurant.getOperatingHours().isEmpty()) {
            return "Chưa cập nhật";
        }

        // Lấy giờ mở cửa chung (có thể từ thứ 2-6)
        Restaurant.OperatingHour weekdayHour = restaurant.getOperatingHours().stream()
                .filter(oh -> oh.getDayOfWeek() >= 1 && oh.getDayOfWeek() <= 5 && oh.isOpen())
                .findFirst()
                .orElse(restaurant.getOperatingHours().get(0));

        if (weekdayHour != null && weekdayHour.isOpen()) {
            return weekdayHour.getOpenTime() + " - " + weekdayHour.getCloseTime();
        }

        return "Đóng cửa";
    }

    private String priceRange(Restaurant restaurant) {
        if (restaurant.getBasicInfo() != null && 
            restaurant.getBasicInfo().getPriceRange() != null) {
            
            String priceRange = restaurant.getBasicInfo().getPriceRange();
            
            return priceRange;
        }
        
        return "Chưa cập nhật";
    }

    private String getFirstImage(Restaurant restaurant) {
        if (restaurant.getBasicInfo() != null && 
            restaurant.getBasicInfo().getImages() != null && 
            !restaurant.getBasicInfo().getImages().isEmpty()) {
            return restaurant.getBasicInfo().getImages().get(0);
        }
        return null; // Frontend sẽ fallback về default image
    }
}