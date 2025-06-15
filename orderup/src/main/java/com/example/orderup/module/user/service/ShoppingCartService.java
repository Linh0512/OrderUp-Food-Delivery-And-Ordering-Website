package com.example.orderup.module.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.bson.types.ObjectId;
import java.time.LocalDateTime;
import java.util.ArrayList;

import com.example.orderup.module.user.entirty.ShoppingCart;
import com.example.orderup.module.user.repository.ShoppingCartRepository;
import com.example.orderup.module.restaurant.service.RestaurantService;

@Service
public class ShoppingCartService {
    
    @Autowired
    private ShoppingCartRepository cartRepository;
    
    @Autowired
    private RestaurantService restaurantService;

    public ShoppingCart getOrCreateCart(String userId, String restaurantId) {
        ObjectId userObjectId = new ObjectId(userId);
        ShoppingCart cart = cartRepository.findByUserId(userObjectId);
        
        if (cart == null) {
            cart = new ShoppingCart();
            cart.setUserId(userObjectId);
            cart.setRestaurantId(new ObjectId(restaurantId));
            cart.setItems(new ArrayList<>());
            cart.setSubtotal(0.0);
            cart.setCreatedAt(LocalDateTime.now());
            cart.setUpdatedAt(LocalDateTime.now());
            cartRepository.save(cart);
        } else if (!cart.getRestaurantId().equals(new ObjectId(restaurantId))) {
            // Nếu user chọn món từ nhà hàng khác, xóa giỏ hàng cũ
            cartRepository.delete(cart);
            cart = new ShoppingCart();
            cart.setUserId(userObjectId);
            cart.setRestaurantId(new ObjectId(restaurantId));
            cart.setItems(new ArrayList<>());
            cart.setSubtotal(0.0);
            cart.setCreatedAt(LocalDateTime.now());
            cart.setUpdatedAt(LocalDateTime.now());
            cartRepository.save(cart);
        }
        
        return cart;
    }

    public ShoppingCart addToCart(String userId, String restaurantId, ShoppingCart.CartItem item) {
        ShoppingCart cart = getOrCreateCart(userId, restaurantId);
        
        // Tính toán subtotal cho item
        double itemSubtotal = item.getUnitPrice() * item.getQuantity();
        if (item.getSelectedOptions() != null) {
            for (ShoppingCart.SelectedOption option : item.getSelectedOptions()) {
                itemSubtotal += option.getAdditionalPrice() * item.getQuantity();
            }
        }
        item.setSubtotal(itemSubtotal);
        
        // Thêm item vào cart
        cart.getItems().add(item);
        
        // Cập nhật subtotal của cart
        double cartSubtotal = cart.getItems().stream()
                .mapToDouble(ShoppingCart.CartItem::getSubtotal)
                .sum();
        cart.setSubtotal(cartSubtotal);
        cart.setUpdatedAt(LocalDateTime.now());
        
        return cartRepository.save(cart);
    }

    public ShoppingCart updateCartItem(String userId, String itemId, int quantity) {
        ObjectId userObjectId = new ObjectId(userId);
        ShoppingCart cart = cartRepository.findByUserId(userObjectId);
        
        if (cart != null) {
            cart.getItems().stream()
                .filter(item -> item.getDishId().toString().equals(itemId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(quantity);
                    double itemSubtotal = item.getUnitPrice() * quantity;
                    if (item.getSelectedOptions() != null) {
                        for (ShoppingCart.SelectedOption option : item.getSelectedOptions()) {
                            itemSubtotal += option.getAdditionalPrice() * quantity;
                        }
                    }
                    item.setSubtotal(itemSubtotal);
                });
            
            double cartSubtotal = cart.getItems().stream()
                    .mapToDouble(ShoppingCart.CartItem::getSubtotal)
                    .sum();
            cart.setSubtotal(cartSubtotal);
            cart.setUpdatedAt(LocalDateTime.now());
            
            return cartRepository.save(cart);
        }
        
        return null;
    }

    public void removeFromCart(String userId, String itemId) {
        ObjectId userObjectId = new ObjectId(userId);
        ShoppingCart cart = cartRepository.findByUserId(userObjectId);
        
        if (cart != null) {
            cart.getItems().removeIf(item -> item.getDishId().toString().equals(itemId));
            
            double cartSubtotal = cart.getItems().stream()
                    .mapToDouble(ShoppingCart.CartItem::getSubtotal)
                    .sum();
            cart.setSubtotal(cartSubtotal);
            cart.setUpdatedAt(LocalDateTime.now());
            
            cartRepository.save(cart);
        }
    }

    public void clearCart(String userId) {
        ObjectId userObjectId = new ObjectId(userId);
        cartRepository.deleteByUserId(userObjectId);
    }

    public ShoppingCart getCart(String userId) {
        ObjectId userObjectId = new ObjectId(userId);
        return cartRepository.findByUserId(userObjectId);
    }
} 