package com.example.orderup.module.restaurant.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.orderup.module.restaurant.repository.RestaurantDetailRepository;
import com.example.orderup.module.restaurant.mapper.RestaurantDetailMapper;
import com.example.orderup.module.restaurant.dto.RestaurantDetailResponseDTO;
import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.entity.Dish;
import com.example.orderup.config.security.JwtTokenProvider;

import java.util.List;
import java.util.Collections;
import org.bson.types.ObjectId;

@Service
public class RestaurantDetailService {

    @Autowired
    private RestaurantDetailRepository restaurantDetailRepository;
    
    @Autowired
    private RestaurantDetailMapper restaurantDetailMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public RestaurantDetailResponseDTO getRestaurantDetail(String restaurantId, String token) {
        String userId = null;
        if (token != null) {
            userId = jwtTokenProvider.getUserIdFromToken(token);
        }

        // Lấy thông tin nhà hàng
        Restaurant restaurant = restaurantDetailRepository.findRestaurantById(restaurantId);
        if (restaurant == null) {
            throw new RuntimeException("Không tìm thấy nhà hàng với id: " + restaurantId);
        }
    
        // Lấy danh sách món ăn
        List<Dish> dishes = restaurantDetailRepository.findDishesByRestaurantId(new ObjectId(restaurantId));
        
        // Nếu không có món ăn, trả về danh sách rỗng
        if (dishes == null) {
            dishes = Collections.emptyList();
        }
    
        return restaurantDetailMapper.toRestaurantDetailResponseDTO(restaurant, dishes, userId);
    }

    public boolean isRestaurantExists(String restaurantId) {
        Restaurant restaurant = restaurantDetailRepository.findRestaurantById(restaurantId);
        return restaurant != null;
    }

    public Restaurant save(Restaurant restaurant) {
        return restaurantDetailRepository.save(restaurant);
    }
}
