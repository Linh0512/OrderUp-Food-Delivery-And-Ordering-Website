package com.example.orderup.module.voucher.service;

import com.example.orderup.config.security.JwtTokenProvider;
import com.example.orderup.module.voucher.dto.*;
import com.example.orderup.module.voucher.entity.Voucher;
import com.example.orderup.module.voucher.mapper.VoucherMapper;
import com.example.orderup.module.voucher.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VoucherService {
    
    @Autowired
    private VoucherRepository voucherRepository;
    
    @Autowired
    private VoucherMapper voucherMapper;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Admin methods
    public List<VoucherThumbDTO> getAllVouchers() {
        List<Voucher> vouchers = voucherRepository.findAll();
        vouchers.forEach(voucher -> {
            voucher.updateActiveStatus();
            voucherRepository.save(voucher);
        });
        return vouchers.stream()
                .map(voucherMapper::toThumbDTO)
                .collect(Collectors.toList());
    }

    public VoucherDetailDTO getVoucherDetail(String id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        voucher.updateActiveStatus();
        voucherRepository.save(voucher);
        return voucherMapper.toDetailDTO(voucher);
    }

    @Transactional
    public VoucherDetailDTO createVoucher(CreateVoucherDTO dto, String token) {
        // Validate
        if (voucherRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Voucher code already exists");
        }
        
        Voucher voucher = voucherMapper.toEntity(dto);
        voucher.setActive(true);
        voucher.updateActiveStatus();
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toDetailDTO(voucher);
    }

    @Transactional
    public VoucherDetailDTO updateVoucher(String id, CreateVoucherDTO dto, String token) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        
        voucherMapper.updateFromDTO(voucher, dto);
        voucher.updateActiveStatus();
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toDetailDTO(voucher);
    }

    @Transactional
    public boolean deleteVoucher(String id, String token) {
        if (voucherRepository.existsById(id)) {
            voucherRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Restaurant methods
    public List<VoucherThumbDTO> getVouchersByUserRole(String token, String restaurantId) {
        String role = jwtTokenProvider.getRoleFromToken(token);
        if (role == null) {
            throw new RuntimeException("Invalid token");
        }

        List<Voucher> vouchers;
        switch (role.toUpperCase()) {
            case "ADMIN":
                vouchers = voucherRepository.findAll();
                break;
            case "RESTAURANTHOST":
                vouchers = voucherRepository.findByTypeAndRestaurantId("LOCAL", restaurantId);
                break;
            case "USER":
                vouchers = voucherRepository.findValidVouchersForUser(LocalDateTime.now(), restaurantId);
                break;
            default:
                return List.of();
        }
        
        vouchers.forEach(voucher -> {
            voucher.updateActiveStatus();
            voucherRepository.save(voucher);
        });
        
        return vouchers.stream()
            .map(voucherMapper::toThumbDTO)
            .collect(Collectors.toList());
    }

    // User methods
    @Transactional
    public boolean useVoucher(String code, String token) {
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        if (userId == null) {
            throw new RuntimeException("Invalid token");
        }

        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        if (!voucher.isActive()) {
            throw new RuntimeException("Voucher is not active");
        }

        if (voucher.getRemainingValue() <= 0) {
            throw new RuntimeException("Voucher is out of stock");
        }

        // Add usage record
        Voucher.VoucherUsage usage = new Voucher.VoucherUsage();
        usage.setUserId(userId);
        usage.setUsedAt(LocalDateTime.now());
        
        if (voucher.getUsage() == null) {
            voucher.setUsage(new ArrayList<>());
        }
        voucher.getUsage().add(usage);
        
        // Update remaining value
        voucher.setRemainingValue(voucher.getRemainingValue() - 1);
        voucher.updateActiveStatus();
        
        voucherRepository.save(voucher);
        return true;
    }
} 