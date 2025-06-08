package com.example.orderup.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.orderup.models.dto.RestaurantDTO;
import com.example.orderup.models.entities.Res.Restaurant;
import com.example.orderup.services.RestaurantService;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<?> getAllRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(restaurantService.getAllRestaurants(page, size));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable String id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }
    
    @PostMapping
    public ResponseEntity<?> createRestaurant(@RequestBody Restaurant restaurant) {
        RestaurantDTO newRestaurant = restaurantService.createRestaurant(restaurant);
        return new ResponseEntity<>(newRestaurant, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRestaurant(
            @PathVariable String id,
            @RequestBody Restaurant restaurantDetails) {
        RestaurantDTO updatedRestaurant = restaurantService.updateRestaurant(id, restaurantDetails);
        return ResponseEntity.ok(updatedRestaurant);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRestaurant(@PathVariable String id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRestaurantStatus(
            @PathVariable String id,
            @RequestParam boolean isActive) {
        RestaurantDTO updatedRestaurant = restaurantService.updateRestaurantStatus(id, isActive);
        return ResponseEntity.ok(updatedRestaurant);
    }
    
    @PutMapping("/{id}/verification")
    public ResponseEntity<?> updateVerificationStatus(
            @PathVariable String id,
            @RequestParam String status) {
        RestaurantDTO updatedRestaurant = restaurantService.updateVerificationStatus(id, status);
        return ResponseEntity.ok(updatedRestaurant);
    }
    
    @GetMapping("/cuisine/{cuisineType}")
    public ResponseEntity<?> getRestaurantsByCuisineType(
            @PathVariable String cuisineType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDTO> restaurants = restaurantService.getRestaurantsByCuisineType(cuisineType, pageable);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/city/{city}")
    public ResponseEntity<?> getRestaurantsByCity(
            @PathVariable String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDTO> restaurants = restaurantService.getRestaurantsByCity(city, pageable);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchRestaurants(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDTO> restaurants = restaurantService.searchRestaurantsByName(name, pageable);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedRestaurants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDTO> restaurants = restaurantService.getFeaturedRestaurants(pageable);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/delivery/{area}")
    public ResponseEntity<?> getRestaurantsByDeliveryArea(
            @PathVariable String area,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDTO> restaurants = restaurantService.getRestaurantsByDeliveryArea(area, pageable);
        return ResponseEntity.ok(restaurants);
    }
    
    @GetMapping("/rating")
    public ResponseEntity<?> getRestaurantsByMinimumRating(
            @RequestParam double minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RestaurantDTO> restaurants = restaurantService.getRestaurantsByMinimumRating(minRating, pageable);
        return ResponseEntity.ok(restaurants);
    }
}
