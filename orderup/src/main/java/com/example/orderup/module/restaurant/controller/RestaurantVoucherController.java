package com.example.orderup.module.restaurant.controller;

import com.example.orderup.module.voucher.dto.*;
import com.example.orderup.module.voucher.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/vouchers")
public class RestaurantVoucherController {
    
    @Autowired
    private VoucherService voucherService;
    
    @GetMapping
    public ResponseEntity<List<VoucherThumbDTO>> getRestaurantVouchers(
            @PathVariable String restaurantId,
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(voucherService.getVouchersByUserRole(token, restaurantId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VoucherDetailDTO> getVoucherDetail(
            @PathVariable String restaurantId,
            @PathVariable String id) {
        VoucherDetailDTO voucher = voucherService.getVoucherDetail(id);
        if (voucher == null || !restaurantId.equals(voucher.getRestaurantId())) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(voucher);
    }
    
    @PostMapping
    public ResponseEntity<VoucherDetailDTO> createVoucher(
            @PathVariable String restaurantId,
            @RequestBody CreateVoucherDTO dto,
            @RequestHeader("Authorization") String token) {
        dto.setRestaurantId(restaurantId);
        return ResponseEntity.ok(voucherService.createVoucher(dto, token));
    }
    
    @PutMapping("/{voucherId}")
    public ResponseEntity<VoucherDetailDTO> updateVoucher(
            @PathVariable String restaurantId,
            @PathVariable String voucherId,
            @RequestBody CreateVoucherDTO dto,
            @RequestHeader("Authorization") String token) {
        dto.setRestaurantId(restaurantId);
        return ResponseEntity.ok(voucherService.updateVoucher(voucherId, dto, token));
    }
    
    @DeleteMapping("/{voucherId}")
    public ResponseEntity<Void> deleteVoucher(
            @PathVariable String restaurantId,
            @PathVariable String voucherId,
            @RequestHeader("Authorization") String token) {
        boolean deleted = voucherService.deleteVoucher(voucherId, token);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
} 