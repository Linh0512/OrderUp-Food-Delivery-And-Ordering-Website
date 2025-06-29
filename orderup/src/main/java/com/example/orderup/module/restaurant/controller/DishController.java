package com.example.orderup.module.restaurant.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.example.orderup.module.restaurant.service.DishService;
import com.example.orderup.module.restaurant.service.RestaurantDetailService;
import com.example.orderup.module.restaurant.dto.DishListResponseDTO;
import com.example.orderup.module.restaurant.dto.DishDetailDTO;
import com.example.orderup.module.restaurant.entity.Dish;
import com.example.orderup.module.restaurant.mapper.DishMapper;
import org.bson.types.ObjectId;

@RestController
@RequestMapping("/api/dishes")
public class DishController {

    @Autowired
    private DishService dishService;

    @Autowired
    private RestaurantDetailService restaurantDetailService;

    @Autowired
    private DishMapper dishMapper;

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<DishListResponseDTO> getDishesByRestaurantId(@PathVariable String restaurantId) {
        try {
            DishListResponseDTO response = dishService.getDishesByRestaurantId(restaurantId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error in getDishesByRestaurantId: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{dishId}")
    public ResponseEntity<DishDetailDTO> getDishById(@PathVariable String dishId) {
        try {
            DishDetailDTO dish = dishService.getDishById(dishId);
            return new ResponseEntity<>(dish, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/add/{restaurantId}")
    public ResponseEntity<DishDetailDTO> addDish(
            @PathVariable String restaurantId,
            @RequestBody DishDetailDTO dishDTO) {
        try {
            // Kiểm tra restaurant tồn tại
            if (!restaurantDetailService.isRestaurantExists(restaurantId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            dishDTO.setRestaurantId(restaurantId);
            DishDetailDTO savedDish = dishService.addDish(dishDTO);
            return new ResponseEntity<>(savedDish, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{dishId}")
    public ResponseEntity<DishDetailDTO> updateDish(
            @PathVariable String dishId,
            @RequestBody DishDetailDTO dishDTO) {
        try {
            dishDTO.setId(dishId);
            DishDetailDTO updatedDish = dishService.updateDish(dishDTO);
            return new ResponseEntity<>(updatedDish, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // Trả về lỗi 400 Bad Request cho các lỗi về dữ liệu đầu vào
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{dishId}")
    public ResponseEntity<Void> deleteDish(@PathVariable String dishId) {
        try {
            dishService.deleteDish(dishId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}