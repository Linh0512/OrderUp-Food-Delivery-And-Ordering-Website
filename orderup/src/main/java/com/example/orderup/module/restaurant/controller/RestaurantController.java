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

import java.util.List;

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

    @GetMapping()
    public ResponseEntity<?> getAllRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> restaurants = restaurantService.getAllRestaurantsPage(pageable);
        ShopThumbResponseDTO shopThumbResponseDTO = restaurantMapper.toShopThumbResponseDTO(restaurants);
        return ResponseEntity.ok(shopThumbResponseDTO);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable String id) {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        if (restaurant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(restaurant);
    }
    
    @GetMapping("/name/{name}")
    public ResponseEntity<?> getRestaurantByName(@PathVariable String name) {
        List<Restaurant> restaurants = restaurantService.searchRestaurantsByName(name);
        ShopThumbResponseDTO shopThumbResponseDTO = restaurantMapper.toShopThumbResponseDTO(restaurants);
        return ResponseEntity.ok(shopThumbResponseDTO);
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
    
    @PutMapping("/{id}/verification")
    public ResponseEntity<?> updateVerificationStatus(
            @PathVariable String id,
            @RequestParam String status) {
        Restaurant updatedRestaurant = restaurantService.updateVerificationStatus(id, status);
        if (updatedRestaurant == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedRestaurant);
    }
    
    @GetMapping("/cuisine/{cuisineType}")
    public ResponseEntity<?> getRestaurantsByCuisineType(
            @PathVariable String cuisineType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> restaurants = restaurantService.getRestaurantsByCuisineType(cuisineType, pageable);
        ShopThumbResponseDTO shopThumbResponseDTO = restaurantMapper.toShopThumbResponseDTO(restaurants);
        return ResponseEntity.ok(shopThumbResponseDTO);
    }
    
    @GetMapping("/city/{city}")
    public ResponseEntity<?> getRestaurantsByCity(
            @PathVariable String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> restaurants = restaurantService.getRestaurantsByCity(city, pageable);
        ShopThumbResponseDTO shopThumbResponseDTO = restaurantMapper.toShopThumbResponseDTO(restaurants);
        return ResponseEntity.ok(shopThumbResponseDTO);
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchRestaurants(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> restaurants = restaurantService.searchRestaurantsByName(name, pageable);
        ShopThumbResponseDTO shopThumbResponseDTO = restaurantMapper.toShopThumbResponseDTO(restaurants);
        return ResponseEntity.ok(shopThumbResponseDTO);
    }
    
    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> restaurants = restaurantService.getFeaturedRestaurants(pageable);
        ShopThumbResponseDTO shopThumbResponseDTO = restaurantMapper.toShopThumbResponseDTO(restaurants);
        return ResponseEntity.ok(shopThumbResponseDTO);
    }
    
    @GetMapping("/delivery/{area}")
    public ResponseEntity<?> getRestaurantsByDeliveryArea(
            @PathVariable String area,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> restaurants = restaurantService.getRestaurantsByDeliveryArea(area, pageable);
        ShopThumbResponseDTO shopThumbResponseDTO = restaurantMapper.toShopThumbResponseDTO(restaurants);
        return ResponseEntity.ok(shopThumbResponseDTO);
    }
    
    @GetMapping("/rating")
    public ResponseEntity<?> getRestaurantsByMinimumRating(
            @RequestParam double minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Restaurant> restaurants = restaurantService.getRestaurantsByMinimumRating(minRating, pageable);
        ShopThumbResponseDTO shopThumbResponseDTO = restaurantMapper.toShopThumbResponseDTO(restaurants);
        return ResponseEntity.ok(shopThumbResponseDTO);
    }
}