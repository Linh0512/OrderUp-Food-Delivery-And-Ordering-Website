package com.example.orderup.module.restaurant.mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import com.example.orderup.module.restaurant.entity.Dish;
import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.dto.DishThumbDTO;
import com.example.orderup.module.restaurant.dto.DishDetailDTO;
import com.example.orderup.module.restaurant.entity.Dish.Choice;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

@Component
public class DishMapper {
    
    public DishThumbDTO toDishThumbDTO(Dish dish, Restaurant restaurant) {
        if (dish == null) return null;

        String firstImage = null;
        if (dish.getBasicInfo() != null && 
            dish.getBasicInfo().getImages() != null && 
            !dish.getBasicInfo().getImages().isEmpty()) {
            firstImage = dish.getBasicInfo().getImages().get(0);
        }

        return DishThumbDTO.builder()
                .id(dish.getId())
                .name(dish.getBasicInfo() != null ? dish.getBasicInfo().getName() : "Chưa cập nhật")
                .description(dish.getBasicInfo() != null ? dish.getBasicInfo().getDescription() : null)
                .image(firstImage)
                .basePrice(dish.getPricing() != null ? dish.getPricing().getBasePrice() : 0)
                .discountPrice(dish.getPricing() != null ? dish.getPricing().getDiscountPrice() : 0)
                .isDiscounted(dish.getPricing() != null && dish.getPricing().isDiscounted())
                .isAvailable(dish.getAvailability() != null && dish.getAvailability().isAvailable())
                .build();
    }

    public DishDetailDTO toDishDetailDTO(Dish dish, Restaurant restaurant) {
        if (dish == null) return null;

        // Map Options với null safety
        List<DishDetailDTO.Option> options = new ArrayList<>();
        if (dish.getOptions() != null) {
            options = dish.getOptions().stream()
                .map(option -> {
                    List<DishDetailDTO.Choice> choices = new ArrayList<>();
                    if (option.getChoices() != null) {
                        choices = option.getChoices().stream()
                            .map(choice -> DishDetailDTO.Choice.builder()
                                .name(choice.getName())
                                .price(choice.getPrice())
                                .isDefault(choice.isDefault())
                                .build())
                            .collect(Collectors.toList());
                    }
                    
                    return DishDetailDTO.Option.builder()
                        .name(option.getName())
                        .type(option.getType())
                        .isRequired(option.isRequired())
                        .choices(choices)
                        .build();
                })
                .collect(Collectors.toList());
        }

        // Map Availability
        DishDetailDTO.Availability availability = null;
        if (dish.getAvailability() != null) {
            List<DishDetailDTO.TimeRange> timeRanges = null;
            if (dish.getAvailability().getAvailableTimes() != null) {
                timeRanges = dish.getAvailability().getAvailableTimes().stream()
                    .map(tr -> DishDetailDTO.TimeRange.builder()
                        .start(tr.getStart())
                        .end(tr.getEnd())
                        .build())
                    .collect(Collectors.toList());
            }

            availability = DishDetailDTO.Availability.builder()
                .isAvailable(dish.getAvailability().isAvailable())
                .availableTimes(timeRanges)
                .stockQuantity(dish.getAvailability().getStockQuantity())
                .soldOut(dish.getAvailability().isSoldOut())
                .build();
        }

        // Map RatingInfo
        DishDetailDTO.RatingInfo ratingInfo = null;
        if (dish.getRatings() != null) {
            ratingInfo = DishDetailDTO.RatingInfo.builder()
                .averageRating(dish.getRatings().getAverageRating())
                .totalReviews(dish.getRatings().getTotalReviews())
                .build();
        }

        return DishDetailDTO.builder()
            .id(dish.getId())
            .restaurantId(dish.getRestaurantId() != null ? dish.getRestaurantId().toString() : null)
            .categoryId(dish.getCategoryId())
            .name(dish.getBasicInfo() != null ? dish.getBasicInfo().getName() : null)
            .description(dish.getBasicInfo() != null ? dish.getBasicInfo().getDescription() : null)
            .images(dish.getBasicInfo() != null ? dish.getBasicInfo().getImages() : null)
            .tags(dish.getBasicInfo() != null ? dish.getBasicInfo().getTags() : null)
            .basePrice(dish.getPricing() != null ? dish.getPricing().getBasePrice() : 0)
            .discountPrice(dish.getPricing() != null ? dish.getPricing().getDiscountPrice() : 0)
            .isDiscounted(dish.getPricing() != null && dish.getPricing().isDiscounted())
            .options(options)
            .availability(availability)
            .ratings(ratingInfo)
            .preparationTime(dish.getPreparationTime())
            .build();
    }
}