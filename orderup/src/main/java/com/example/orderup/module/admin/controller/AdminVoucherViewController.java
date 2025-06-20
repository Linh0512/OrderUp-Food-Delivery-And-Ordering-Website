package com.example.orderup.module.admin.controller;

import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.repositories.RestaurantRepository;
import com.example.orderup.module.voucher.dto.*;
import com.example.orderup.module.voucher.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin/view")
public class AdminVoucherViewController {
    
    @Autowired
    private VoucherService voucherService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @GetMapping("/vouchers")
    public String viewVouchers() {
        return "admin/voucher/vouchers";
    }

    @GetMapping("/api/vouchers")
    @ResponseBody
    public ResponseEntity<List<VoucherThumbDTO>> getAllVouchers(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.ok(voucherService.getAllVouchers());
            }
            String actualToken = token.substring(7);
            return ResponseEntity.ok(voucherService.getVouchersByUserRole(actualToken, null));
        } catch (Exception e) {
            return ResponseEntity.ok(voucherService.getAllVouchers());
        }
    }

    @GetMapping("/api/vouchers/{code}")
    @ResponseBody
    public ResponseEntity<VoucherDetailDTO> getVoucherDetail(
            @PathVariable String code,
            @RequestHeader(value = "Authorization", required = false) String token) {
        VoucherDetailDTO voucher = voucherService.getVoucherDetail(code);
        return ResponseEntity.ok(voucher);
    }

    @PostMapping("/api/vouchers")
    @ResponseBody
    public ResponseEntity<VoucherDetailDTO> createVoucher(
            @RequestBody CreateVoucherDTO dto,
            @RequestHeader(value = "Authorization", required = false) String token) {
        return ResponseEntity.ok(voucherService.createVoucher(dto, token));
    }

    @PatchMapping("/api/vouchers/{code}")
    @ResponseBody
    public ResponseEntity<VoucherDetailDTO> updateVoucher(
            @PathVariable String code,
            @RequestBody CreateVoucherDTO dto,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            return ResponseEntity.ok(voucherService.updateVoucher(code, dto, token));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/api/vouchers/{code}")
    @ResponseBody
    public ResponseEntity<Void> deleteVoucher(
            @PathVariable String code,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            voucherService.deleteVoucher(code, token);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/api/restaurants")
    @ResponseBody
    public ResponseEntity<List<RestaurantOption>> getRestaurants() {
        List<RestaurantOption> restaurants = restaurantRepository.findAll().stream()
                .map(restaurant -> new RestaurantOption(
                    restaurant.getId(), 
                    restaurant.getBasicInfo().getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(restaurants);
    }

    // DTO cho danh sách nhà hàng
    private static class RestaurantOption {
        private String id;
        private String name;

        public RestaurantOption(String id, String name) {
            this.id = id;
            this.name = name;
        }

        public String getId() {
            return id;
        }

        public String getName() {
            return name;
        }
    }
} 