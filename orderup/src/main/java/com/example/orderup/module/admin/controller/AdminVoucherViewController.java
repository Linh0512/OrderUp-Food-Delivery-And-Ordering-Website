package com.example.orderup.module.admin.controller;

import com.example.orderup.module.restaurant.repository.RestaurantRepository;
import com.example.orderup.module.voucher.dto.*;
import com.example.orderup.module.voucher.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin/view")
public class AdminVoucherViewController {
    
    private static final Logger logger = LoggerFactory.getLogger(AdminVoucherViewController.class);
    
    @Autowired
    private VoucherService voucherService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private AdminViewController adminViewController;
    
    @GetMapping("/vouchers")
    public String viewVouchers(HttpServletRequest request) {
        if (!adminViewController.isAdminAuthenticated(request)) {
            return "redirect:http://localhost:5173/login";
        }
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
        try {
            logger.info("Creating voucher with DTO: {}", dto);
            logger.info("DTO values - code: {}, value: {}, type: {}, restaurantId: {}, minimumOrderAmount: {}, issuedAt: {}, expiresAt: {}, remainingValue: {}", 
                dto.getCode(), dto.getValue(), dto.getType(), dto.getRestaurantId(), 
                dto.getMinimumOrderAmount(), dto.getIssuedAt(), dto.getExpiresAt(), dto.getRemainingValue());
            return ResponseEntity.ok(voucherService.createVoucher(dto, token));
        } catch (Exception e) {
            logger.error("Error creating voucher", e);
            throw e;
        }
    }

    @PatchMapping("/api/vouchers/{voucherId}")
    @ResponseBody
    public ResponseEntity<VoucherDetailDTO> updateVoucher(
            @PathVariable String voucherId,
            @RequestBody CreateVoucherDTO dto,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            return ResponseEntity.ok(voucherService.updateVoucher(voucherId, dto, token));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/api/vouchers/{voucherId}")
    @ResponseBody
    public ResponseEntity<Void> deleteVoucher(
            @PathVariable String voucherId,
            @RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            voucherService.deleteVoucher(voucherId, token);
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