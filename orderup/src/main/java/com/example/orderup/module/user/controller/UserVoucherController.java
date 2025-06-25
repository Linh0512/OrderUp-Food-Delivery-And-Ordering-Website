package com.example.orderup.module.user.controller;

import com.example.orderup.module.voucher.dto.*;
import com.example.orderup.module.voucher.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/user/vouchers")
public class UserVoucherController {
    
    @Autowired
    private VoucherService voucherService;
    
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<VoucherThumbDTO>> getAvailableVouchers(
            @PathVariable String restaurantId,
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(voucherService.getVouchersByUserRole(token, restaurantId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VoucherDetailDTO> getVoucherDetail(@PathVariable String id) {
        VoucherDetailDTO voucher = voucherService.getVoucherDetail(id);
        return voucher != null ? ResponseEntity.ok(voucher) : ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{code}/use")
    public ResponseEntity<Void> useVoucher(
            @PathVariable String code,
            @RequestHeader("Authorization") String token) {
        voucherService.useVoucher(code, token);
        return ResponseEntity.ok().build();
    }
} 