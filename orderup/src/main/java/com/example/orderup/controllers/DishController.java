package com.example.orderup.controllers;

import com.example.orderup.models.entities.Res.Dish;
import com.example.orderup.repositories.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/dishes")
public class DishController {

    @Autowired
    private DishRepository dishRepository;

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> getDishesByRestaurant(
            @PathVariable String restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Dish> dishes = dishRepository.findByRestaurantIdAndIsActiveTrue(restaurantId, pageable);
        return ResponseEntity.ok(dishes);
    }

    @GetMapping("/restaurant/{restaurantId}/category/{categoryId}")
    public ResponseEntity<?> getDishesByCategory(
            @PathVariable String restaurantId,
            @PathVariable String categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Dish> dishes = dishRepository.findByRestaurantIdAndCategoryIdAndIsActiveTrue(restaurantId, categoryId, pageable);
        return ResponseEntity.ok(dishes);
    }

    @GetMapping("/restaurant/{restaurantId}/featured")
    public ResponseEntity<?> getFeaturedDishes(
            @PathVariable String restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Dish> dishes = dishRepository.findByRestaurantIdAndIsFeaturedTrueAndIsActiveTrue(restaurantId, pageable);
        return ResponseEntity.ok(dishes);
    }

    @GetMapping("/restaurant/{restaurantId}/search")
    public ResponseEntity<?> searchDishes(
            @PathVariable String restaurantId,
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Dish> dishes = dishRepository.findByRestaurantIdAndNameContainingIgnoreCase(restaurantId, name, pageable);
        return ResponseEntity.ok(dishes);
    }

    @GetMapping("/restaurant/{restaurantId}/tag/{tag}")
    public ResponseEntity<?> getDishesByTag(
            @PathVariable String restaurantId,
            @PathVariable String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Dish> dishes = dishRepository.findByRestaurantIdAndTag(restaurantId, tag, pageable);
        return ResponseEntity.ok(dishes);
    }

    @GetMapping("/restaurant/{restaurantId}/discounted")
    public ResponseEntity<?> getDiscountedDishes(
            @PathVariable String restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Dish> dishes = dishRepository.findByRestaurantIdAndDiscounted(restaurantId, pageable);
        return ResponseEntity.ok(dishes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDishById(@PathVariable String id) {
        Optional<Dish> dish = dishRepository.findById(id);
        if (dish.isPresent()) {
            return ResponseEntity.ok(dish.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createDish(@RequestBody Dish dish) {
        dish.setCreatedAt(LocalDateTime.now());
        dish.setUpdatedAt(LocalDateTime.now());
        Dish savedDish = dishRepository.save(dish);
        return new ResponseEntity<>(savedDish, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDish(@PathVariable String id, @RequestBody Dish dishDetails) {
        return dishRepository.findById(id)
                .map(dish -> {
                    // Update fields
                    if (dishDetails.getBasicInfo() != null) {
                        dish.setBasicInfo(dishDetails.getBasicInfo());
                    }
                    if (dishDetails.getPricing() != null) {
                        dish.setPricing(dishDetails.getPricing());
                    }
                    if (dishDetails.getNutritionInfo() != null) {
                        dish.setNutritionInfo(dishDetails.getNutritionInfo());
                    }
                    if (dishDetails.getOptions() != null) {
                        dish.setOptions(dishDetails.getOptions());
                    }
                    if (dishDetails.getAvailability() != null) {
                        dish.setAvailability(dishDetails.getAvailability());
                    }
                    
                    dish.setActive(dishDetails.isActive());
                    dish.setFeatured(dishDetails.isFeatured());
                    dish.setPreparationTime(dishDetails.getPreparationTime());
                    dish.setUpdatedAt(LocalDateTime.now());
                    
                    return ResponseEntity.ok(dishRepository.save(dish));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDish(@PathVariable String id) {
        return dishRepository.findById(id)
                .map(dish -> {
                    dishRepository.delete(dish);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/restaurant/{restaurantId}/stats")
    public ResponseEntity<?> getDishStats(@PathVariable String restaurantId) {
        long totalDishes = dishRepository.countByRestaurantId(restaurantId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDishes", totalDishes);
        
        return ResponseEntity.ok(stats);
    }
}
