package com.example.orderup.module.admin.controller;

import com.example.orderup.module.voucher.dto.*;
import com.example.orderup.module.voucher.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/vouchers")
public class AdminVoucherController {
    
    @Autowired
    private VoucherService voucherService;
    
    @GetMapping
    public ResponseEntity<List<VoucherThumbDTO>> getAllVouchers(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(voucherService.getVouchersByUserRole(token, null));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VoucherDetailDTO> getVoucherDetail(@PathVariable String id) {
        VoucherDetailDTO voucher = voucherService.getVoucherDetail(id);
        return voucher != null ? ResponseEntity.ok(voucher) : ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<VoucherDetailDTO> createVoucher(@RequestBody CreateVoucherDTO dto, @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(voucherService.createVoucher(dto, token));
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<VoucherDetailDTO> updateVoucher(
            @PathVariable String id,
            @RequestBody CreateVoucherDTO dto,
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(voucherService.updateVoucher(id, dto, token));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoucher(@PathVariable String id, @RequestHeader("Authorization") String token) {
        boolean deleted = voucherService.deleteVoucher(id, token);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
} 