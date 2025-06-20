package com.example.orderup.module.user.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;
import java.util.Collections;

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
        
        return ShoppingCartDTO.builder()
                .id(cart.getId())
                .userId(cart.getUserId().toString())
                .restaurantId(cart.getRestaurantId().toString())
                .restaurant(restaurant != null ? toRestaurantInfo(restaurant) : null)
                .items(cart.getItems() != null ? 
                    cart.getItems().stream()
                        .map(this::toCartItemDTO)
                        .collect(Collectors.toList()) : 
                    Collections.emptyList())
                .summary(toOrderSummaryDTO(cart.getSummary()))
                .build();
    }

    private ShoppingCartDTO.CartItem toCartItemDTO(ShoppingCart.CartItem item) {
        if (item == null) return null;

        return ShoppingCartDTO.CartItem.builder()
                .dishId(item.getDishId().toString())
                .dishName(item.getDishName())
                .dishImage(item.getDishImage())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .selectedOptions(item.getSelectedOptions() != null ? 
                    item.getSelectedOptions().stream()
                        .map(this::toSelectedOptionDTO)
                        .collect(Collectors.toList()) :
                    Collections.emptyList())
                .subtotal(item.getSubtotal())
                .specialInstructions(item.getSpecialInstructions())
                .build();
    }

    private ShoppingCartDTO.SelectedOption toSelectedOptionDTO(ShoppingCart.SelectedOption option) {
        if (option == null) return null;

        return ShoppingCartDTO.SelectedOption.builder()
                .optionName(option.getOptionName())
                .choiceName(option.getChoiceName())
                .additionalPrice(option.getAdditionalPrice())
                .build();
    }

    private ShoppingCartDTO.RestaurantInfo toRestaurantInfo(Restaurant restaurant) {
        if (restaurant == null || restaurant.getBasicInfo() == null) return null;

        return ShoppingCartDTO.RestaurantInfo.builder()
                .name(restaurant.getBasicInfo().getName())
                .image(restaurant.getBasicInfo().getImages() != null && !restaurant.getBasicInfo().getImages().isEmpty() ?
                    restaurant.getBasicInfo().getImages().get(0) : null)
                .address(restaurant.getAddress() != null ? restaurant.getAddress().getFullAddress() : null)
                .build();
    }

    private ShoppingCartDTO.OrderSummary toOrderSummaryDTO(ShoppingCart.OrderSummary summary) {
        if (summary == null) {
            return ShoppingCartDTO.OrderSummary.builder()
                .subtotal(0)
                .deliveryFee(0)
                .serviceFee(0)
                .tax(0)
                .discount(0)
                .total(0)
                .build();
        }

        return ShoppingCartDTO.OrderSummary.builder()
                .subtotal(summary.getSubtotal())
                .deliveryFee(summary.getDeliveryFee())
                .serviceFee(summary.getServiceFee())
                .tax(summary.getTax())
                .discount(summary.getDiscount())
                .total(summary.getTotal())
                .build();
    }
} 