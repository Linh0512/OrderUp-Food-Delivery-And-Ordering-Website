package com.example.orderup.module.restaurant.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.orderup.module.restaurant.service.DishService;
import com.example.orderup.module.restaurant.dto.DishListResponseDTO;
import com.example.orderup.module.restaurant.dto.DishDetailDTO;

@RestController
@RequestMapping("/api/dishes")
public class DishController {

    @Autowired
    private DishService dishService;

    @GetMapping("/restaurant/{restaurantId}")
    public DishListResponseDTO getDishesByRestaurantId(@PathVariable String restaurantId) {
        return dishService.getDishesByRestaurantId(restaurantId);
    }

    @GetMapping("/{dishId}")
    public DishDetailDTO getDishById(@PathVariable String dishId) {
        return dishService.getDishById(dishId);
    }
}