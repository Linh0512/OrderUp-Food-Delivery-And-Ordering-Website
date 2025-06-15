package com.example.orderup.module.restaurant.mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import com.example.orderup.module.restaurant.entity.Dish;
import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.dto.DishThumbDTO;
import com.example.orderup.module.restaurant.dto.DishDetailDTO;
import com.example.orderup.module.restaurant.entity.Dish.Choice;
import org.bson.types.ObjectId;


@Component
public class DishMapper {
    
    public DishThumbDTO toDishThumbDTO(Dish dish, Restaurant restaurant) {
        ObjectId restaurantId = new ObjectId(restaurant.getId());
        return DishThumbDTO.builder()
                .id(dish.getId())
                .name(dish.getBasicInfo().getName())
                .description(dish.getBasicInfo().getDescription())
                .basePrice(dish.getPricing().getBasePrice())
                .discountPrice(dish.getPricing().getDiscountPrice())
                .isDiscounted(dish.getPricing().isDiscounted())
                .images(dish.getBasicInfo().getImages())
                .isActive(dish.isActive())  
                .restaurantId(restaurantId)
                .build();
    }

    public DishDetailDTO toDishDetailDTO(Dish dish, Restaurant restaurant) {
        ObjectId restaurantId = new ObjectId(restaurant.getId());
        return DishDetailDTO.builder()
                .id(dish.getId())
                .name(dish.getBasicInfo().getName())
                .description(dish.getBasicInfo().getDescription())
                .basePrice(dish.getPricing().getBasePrice())
                .discountPrice(dish.getPricing().getDiscountPrice())
                .isDiscounted(dish.getPricing().isDiscounted())
                .images(dish.getBasicInfo().getImages())
                .tags(dish.getBasicInfo().getTags())
                .preparationTime(dish.getPreparationTime())
                .restaurantId(restaurantId.toString())
                .optionName(dish.getOptions().get(0).getName())
                .optionType(dish.getOptions().get(0).getType())
                .optionIsRequired(dish.getOptions().get(0).isRequired())
                .choiceName(dish.getOptions().get(0).getChoices().stream().map(Choice::getName).collect(Collectors.toList()))
                .choicePrice(dish.getOptions().get(0).getChoices().stream().map(Choice::getPrice).collect(Collectors.toList()))
                .build();
    }
}