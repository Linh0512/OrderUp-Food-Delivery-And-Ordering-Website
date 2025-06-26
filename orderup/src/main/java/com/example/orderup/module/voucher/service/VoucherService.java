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

    public VoucherDetailDTO getVoucherDetail(String code) {
        Voucher voucher = voucherRepository.findByCode(code);
        if (voucher == null) {
            throw new RuntimeException("Voucher not found");
        }
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

        String role = jwtTokenProvider.getRoleFromToken(token);
        if (role == null) {
            throw new RuntimeException("Invalid token");
        }

        // Set type based on role
        switch (role.toUpperCase()) {
            case "ADMIN":
                // Admin can create both GLOBAL and LOCAL vouchers
                if (dto.getType() == null) {
                    dto.setType("GLOBAL"); // Default to GLOBAL for admin
                }
                break;
            case "RESTAURANTHOST":
                // RestaurantHost can only create LOCAL vouchers
                dto.setType("LOCAL");
                if (dto.getRestaurantId() == null) {
                    throw new RuntimeException("RestaurantId is required for LOCAL vouchers");
                }
                break;
            default:
                throw new RuntimeException("Unauthorized to create vouchers");
        }
        
        Voucher voucher = voucherMapper.toEntity(dto);
        voucher.setActive(true);
        voucher.updateActiveStatus();
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toDetailDTO(voucher);
    }

    @Transactional
    public VoucherDetailDTO updateVoucher(String code, CreateVoucherDTO dto, String token) {
        Voucher voucher = voucherRepository.findByCode(code);
        if (voucher == null) {
            throw new RuntimeException("Voucher not found");
        }
        
        voucherMapper.updateFromDTO(voucher, dto);
        voucher.updateActiveStatus();
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toDetailDTO(voucher);
    }

    @Transactional
    public boolean deleteVoucher(String code, String token) {
        Voucher voucher = voucherRepository.findByCode(code);
        if (voucher == null) {
            throw new IllegalArgumentException("Không tìm thấy voucher");
        }
        voucherRepository.delete(voucher);
        return true;
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

    public Voucher getVoucherByCode(String code) {
        Voucher voucher = voucherRepository.findByCode(code);
        if (voucher == null) {
            throw new IllegalArgumentException("Không tìm thấy voucher");
        }
        voucher.updateActiveStatus();
        return voucher;
    }

    public void useVoucher(String code, String userId) {
        Voucher voucher = voucherRepository.findByCode(code);
        if (voucher == null) {
            throw new IllegalArgumentException("Không tìm thấy voucher");
        }

        // Kiểm tra trạng thái voucher
        voucher.updateActiveStatus();
        if (!voucher.isActive()) {
            throw new IllegalArgumentException("Voucher không còn hiệu lực");
        }

        // Kiểm tra số lượng còn lại
        if (voucher.getRemainingValue() <= 0) {
            throw new IllegalArgumentException("Voucher đã hết lượt sử dụng");
        }

        // Thêm lịch sử sử dụng
        if (voucher.getUsage() == null) {
            voucher.setUsage(new ArrayList<>());
        }
        Voucher.VoucherUsage usage = new Voucher.VoucherUsage();
        usage.setUserId(userId);
        usage.setUsedAt(LocalDateTime.now());
        voucher.getUsage().add(usage);

        // Giảm số lượng còn lại
        voucher.setRemainingValue(voucher.getRemainingValue() - 1);

        // Cập nhật trạng thái
        voucher.updateActiveStatus();

        // Lưu voucher
        voucherRepository.save(voucher);
    }
} 