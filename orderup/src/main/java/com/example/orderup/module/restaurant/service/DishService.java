package com.example.orderup.module.restaurant.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.orderup.module.restaurant.repository.DishRepository;
import com.example.orderup.module.restaurant.repository.RestaurantDetailRepository;
import com.example.orderup.module.restaurant.mapper.DishMapper;
import com.example.orderup.module.restaurant.dto.DishListResponseDTO;
import com.example.orderup.module.restaurant.dto.DishThumbDTO;
import com.example.orderup.module.restaurant.dto.DishDetailDTO;
import com.example.orderup.module.restaurant.entity.Dish;
import com.example.orderup.module.restaurant.entity.Restaurant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DishService {
    
    @Autowired
    private DishRepository dishRepository;
    
    @Autowired
    private RestaurantDetailRepository restaurantRepository;
    
    @Autowired
    private DishMapper dishMapper;
    
    public DishListResponseDTO getDishesByRestaurantId(String restaurantId) {
        Restaurant restaurant = restaurantRepository.findRestaurantById(restaurantId);
        if (restaurant == null) {
            throw new RuntimeException("Không tìm thấy nhà hàng với id: " + restaurantId);
        }
        
        List<Dish> dishes = dishRepository.findByRestaurantId(restaurantId);
        List<DishThumbDTO> dishDTOs = dishes.stream()
                .map(dish -> dishMapper.toDishThumbDTO(dish, restaurant))
                .collect(Collectors.toList());
                
        return DishListResponseDTO.builder()
                .count(dishDTOs.size())
                .data(dishDTOs)
                .build();
    }
    
    public DishDetailDTO getDishById(String dishId) {
        Dish dish = dishRepository.findById(dishId);
        if (dish == null) {
            throw new RuntimeException("Không tìm thấy món ăn với id: " + dishId);
        }
        
        Restaurant restaurant = restaurantRepository.findRestaurantById(dish.getRestaurantId());
        return dishMapper.toDishDetailDTO(dish, restaurant);
    }
}