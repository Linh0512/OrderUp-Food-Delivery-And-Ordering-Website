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
            @PathVariable String restaurantId) {
        return ResponseEntity.ok(voucherService.getAvailableVouchersForUser(restaurantId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VoucherDetailDTO> getVoucherDetail(@PathVariable String id) {
        VoucherDetailDTO voucher = voucherService.getVoucherDetail(id);
        return voucher != null ? ResponseEntity.ok(voucher) : ResponseEntity.notFound().build();
    }
} 