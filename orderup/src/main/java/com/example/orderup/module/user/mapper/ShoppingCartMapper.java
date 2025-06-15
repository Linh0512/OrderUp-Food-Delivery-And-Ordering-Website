package com.example.orderup.module.user.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

import com.example.orderup.module.user.entirty.ShoppingCart;
import com.example.orderup.module.user.dto.ShoppingCartDTO;
import com.example.orderup.module.restaurant.service.RestaurantService;
import com.example.orderup.module.restaurant.entity.Restaurant;

@Component
public class ShoppingCartMapper {
    
    @Autowired
    private RestaurantService restaurantService;

    public ShoppingCartDTO toDTO(ShoppingCart cart) {
        if (cart == null) return null;

        Restaurant restaurant = restaurantService.getRestaurantById(cart.getRestaurantId().toString());
        String restaurantName = restaurant != null ? restaurant.getBasicInfo().getName() : "N/A";

        return ShoppingCartDTO.builder()
                .id(cart.getId())
                .userId(cart.getUserId().toString())
                .restaurantId(cart.getRestaurantId().toString())
                .restaurantName(restaurantName)
                .items(cart.getItems().stream()
                        .map(this::toCartItemDTO)
                        .collect(Collectors.toList()))
                .subtotal(cart.getSubtotal())
                .build();
    }

    private ShoppingCartDTO.CartItemDTO toCartItemDTO(ShoppingCart.CartItem item) {
        return ShoppingCartDTO.CartItemDTO.builder()
                .dishId(item.getDishId().toString())
                .dishName(item.getDishName())
                .dishImage(item.getDishImage())
                .quantity(item.getQuantity())
                .unitPrice(String.format("%,.0f", item.getUnitPrice()))
                .selectedOptions(item.getSelectedOptions().stream()
                        .map(this::toSelectedOptionDTO)
                        .collect(Collectors.toList()))
                .subtotal(String.format("%,.0f", item.getSubtotal()))
                .specialInstructions(item.getSpecialInstructions())
                .build();
    }

    private ShoppingCartDTO.SelectedOptionDTO toSelectedOptionDTO(ShoppingCart.SelectedOption option) {
        return ShoppingCartDTO.SelectedOptionDTO.builder()
                .optionName(option.getOptionName())
                .choiceName(option.getChoiceName())
                .additionalPrice(String.format("%,.0f", option.getAdditionalPrice()))
                .build();
    }
} 