package com.example.orderup.module.restaurant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.mapper.RestaurantMapper;
import com.example.orderup.module.restaurant.service.RestaurantService;
import com.example.orderup.module.restaurant.dto.ShopThumbResponseDTO;
import com.example.orderup.module.user.dto.ErrorResponse;
import com.example.orderup.config.security.JwtTokenProvider;

@RestController
@RequestMapping("/api/shop")
@CrossOrigin(origins = "http://localhost:5173", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    allowedHeaders = "*")
public class RestaurantController {     

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private RestaurantMapper restaurantMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @GetMapping()
    public ResponseEntity<?> getAllRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String userId = token != null ? jwtTokenProvider.getUserIdFromToken(token) : null;
            Pageable pageable = PageRequest.of(page, size);
            Page<Restaurant> restaurants = restaurantService.getAllRestaurantsPage(pageable);
            ShopThumbResponseDTO shopThumbResponseDTO = restaurantMapper.toShopThumbResponseDTO(restaurants, userId);
            return ResponseEntity.ok(shopThumbResponseDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new ErrorResponse("Đã xảy ra lỗi khi lấy danh sách nhà hàng"));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurantById(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String userId = token != null ? jwtTokenProvider.getUserIdFromToken(token) : null;
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            if (restaurant == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(restaurantMapper.toShopThumbDTO(restaurant, userId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new ErrorResponse("Đã xảy ra lỗi khi lấy thông tin nhà hàng"));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createRestaurant(@RequestBody Restaurant restaurant) {
        Restaurant newRestaurant = restaurantService.createRestaurant(restaurant);
        return new ResponseEntity<>(newRestaurant, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRestaurant(
            @PathVariable String id,
            @RequestBody Restaurant restaurantDetails) {
        Restaurant updatedRestaurant = restaurantService.updateRestaurant(id, restaurantDetails);
        if (updatedRestaurant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedRestaurant);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRestaurant(@PathVariable String id) {
        boolean deleted = restaurantService.deleteRestaurant(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRestaurantStatus(
            @PathVariable String id,
            @RequestParam boolean active) {
        Restaurant updatedRestaurant = restaurantService.updateRestaurantStatus(id, active);
        if (updatedRestaurant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedRestaurant);
    }
    
    
    @GetMapping("/cuisine/{cuisineType}")
    public ResponseEntity<?> getRestaurantsByCuisineType(
            @PathVariable String cuisineType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String userId = token != null ? jwtTokenProvider.getUserIdFromToken(token) : null;
            Pageable pageable = PageRequest.of(page, size);
            Page<Restaurant> restaurants = restaurantService.getRestaurantsByCuisineType(cuisineType, pageable);
            ShopThumbResponseDTO shopThumbResponseDTO = restaurantMapper.toShopThumbResponseDTO(restaurants, userId);
            return ResponseEntity.ok(shopThumbResponseDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new ErrorResponse("Đã xảy ra lỗi khi lọc nhà hàng theo loại ẩm thực"));
        }
    }
    
    
    @GetMapping("/search/{name}")
    public ResponseEntity<?> searchRestaurants(
            @PathVariable String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String userId = token != null ? jwtTokenProvider.getUserIdFromToken(token) : null;
            Pageable pageable = PageRequest.of(page, size);
            Page<Restaurant> restaurants = restaurantService.searchRestaurantsByName(name, pageable);
            ShopThumbResponseDTO shopThumbResponseDTO = restaurantMapper.toShopThumbResponseDTO(restaurants, userId);
            return ResponseEntity.ok(shopThumbResponseDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new ErrorResponse("Đã xảy ra lỗi khi tìm kiếm nhà hàng"));
        }
    }
    
    @GetMapping("/delivery/{area}")
    public ResponseEntity<?> getRestaurantsByDeliveryArea(
            @PathVariable String area,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            String userId = token != null ? jwtTokenProvider.getUserIdFromToken(token) : null;
            Pageable pageable = PageRequest.of(page, size);
            Page<Restaurant> restaurants = restaurantService.getRestaurantsByDeliveryArea(area, pageable);
            ShopThumbResponseDTO shopThumbResponseDTO = restaurantMapper.toShopThumbResponseDTO(restaurants, userId);
            return ResponseEntity.ok(shopThumbResponseDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new ErrorResponse("Đã xảy ra lỗi khi lọc nhà hàng theo khu vực giao hàng"));
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterRestaurants(
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Integer minReviews,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double maxDistance,
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            Pageable pageable = PageRequest.of(page, size);
            Page<Restaurant> restaurants = restaurantService.filterRestaurants(
                minRating, minReviews, maxPrice, maxDistance, userId, pageable);
            ShopThumbResponseDTO response = restaurantMapper.toShopThumbResponseDTO(restaurants, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new ErrorResponse("Đã xảy ra lỗi khi lọc danh sách nhà hàng"));
        }
    }
}