package com.example.orderup.module.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.orderup.module.user.dto.ShoppingCartDTO;
import com.example.orderup.module.user.dto.ShoppingCartDTO.*;
import com.example.orderup.module.user.service.ShoppingCartService;
import com.example.orderup.module.user.entirty.Order;
import lombok.Data;

@RestController
@RequestMapping("/api/cart")
public class ShoppingCartController {
    
    @Autowired
    private ShoppingCartService cartService;

    // Lấy tất cả giỏ hàng của user
    @GetMapping
    public ResponseEntity<?> getUserCarts(@RequestHeader("Authorization") String token) {
        try {
            List<ShoppingCartDTO> carts = cartService.getUserCarts(token);
            return ResponseEntity.ok(carts);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Lỗi dữ liệu", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi hệ thống", "Đã có lỗi xảy ra, vui lòng thử lại sau"));
        }
    }

    // Thêm món vào giỏ hàng
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestHeader("Authorization") String token,
            @RequestBody AddToCartRequest request) {
        try {
            ShoppingCartDTO cart = cartService.addToCart(token, request);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Lỗi dữ liệu", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi hệ thống", "Đã có lỗi xảy ra, vui lòng thử lại sau"));
        }
    }

    // Cập nhật món trong giỏ hàng
    @PutMapping("/{cartId}/item/{itemIndex}")
    public ResponseEntity<?> updateCartItem(
            @RequestHeader("Authorization") String token,
            @PathVariable String cartId,
            @PathVariable int itemIndex,
            @RequestBody UpdateCartItemRequest request) {
        try {
            ShoppingCartDTO cart = cartService.updateCartItem(token, cartId, itemIndex, request);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Lỗi dữ liệu", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi hệ thống", "Đã có lỗi xảy ra, vui lòng thử lại sau"));
        }
    }

    // Xóa món khỏi giỏ hàng
    @DeleteMapping("/{cartId}/item/{itemIndex}")
    public ResponseEntity<?> removeCartItem(
            @RequestHeader("Authorization") String token,
            @PathVariable String cartId,
            @PathVariable int itemIndex) {
        try {
            ShoppingCartDTO cart = cartService.removeCartItem(token, cartId, itemIndex);
            if (cart == null) {
                return ResponseEntity.ok()
                    .body(new SuccessResponse("Đã xóa giỏ hàng thành công"));
            }
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Lỗi dữ liệu", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi hệ thống", "Đã có lỗi xảy ra, vui lòng thử lại sau"));
        }
    }

    // Thanh toán giỏ hàng
    @PostMapping("/{cartId}/checkout")
    public ResponseEntity<?> checkoutCart(
            @RequestHeader("Authorization") String token,
            @PathVariable String cartId) {
        try {
            Order order = cartService.checkoutCart(token, cartId);
            return ResponseEntity.ok(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Lỗi dữ liệu", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Lỗi hệ thống", "Đã có lỗi xảy ra, vui lòng thử lại sau"));
        }
    }

    @Data
    private static class ErrorResponse {
        private final String error;
        private final String message;
    }

    @Data
    private static class SuccessResponse {
        private final String message;
    }
} 