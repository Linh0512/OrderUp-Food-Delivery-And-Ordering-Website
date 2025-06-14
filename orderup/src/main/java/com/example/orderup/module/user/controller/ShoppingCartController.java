package com.example.orderup.module.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.example.orderup.module.user.entirty.ShoppingCart;
import com.example.orderup.module.user.service.ShoppingCartService;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<ShoppingCart> getCart(@PathVariable String userId) {
        try {
            ShoppingCart cart = cartService.getCart(userId);
            if (cart != null) {
                return new ResponseEntity<>(cart, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{userId}/restaurants/{restaurantId}/items")
    public ResponseEntity<ShoppingCart> addToCart(
            @PathVariable String userId,
            @PathVariable String restaurantId,
            @RequestBody ShoppingCart.CartItem item) {
        try {
            ShoppingCart cart = cartService.addToCart(userId, restaurantId, item);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{userId}/items/{itemId}")
    public ResponseEntity<ShoppingCart> updateCartItem(
            @PathVariable String userId,
            @PathVariable String itemId,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer quantity = request.get("quantity");
            if (quantity == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            ShoppingCart cart = cartService.updateCartItem(userId, itemId, quantity);
            if (cart != null) {
                return new ResponseEntity<>(cart, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{userId}/items/{itemId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable String userId,
            @PathVariable String itemId) {
        try {
            cartService.removeFromCart(userId, itemId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable String userId) {
        try {
            cartService.clearCart(userId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 