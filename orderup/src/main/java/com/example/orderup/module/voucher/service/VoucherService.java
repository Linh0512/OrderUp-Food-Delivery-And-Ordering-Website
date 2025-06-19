package com.example.orderup.module.voucher.service;

import com.example.orderup.config.security.JwtTokenProvider;
import com.example.orderup.module.voucher.dto.*;
import com.example.orderup.module.voucher.entity.*;
import com.example.orderup.module.voucher.mapper.VoucherMapper;
import com.example.orderup.module.voucher.repository.VoucherRepository;
import com.example.orderup.utils.EntityUpdater;
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

    // Lấy danh sách voucher theo role và userId
    public List<VoucherThumbDTO> getVouchersByUserRole(String token, String restaurantId) {
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        if (userId == null) {
            throw new RuntimeException("Invalid token");
        }

        String role = jwtTokenProvider.getRoleFromToken(token);
        if (role == null) {
            throw new RuntimeException("Invalid token");
        }

        List<Voucher> vouchers;
        
        switch (role.toUpperCase()) {
            case "ADMIN":
                vouchers = voucherRepository.findAll();
                // Cập nhật trạng thái cho tất cả voucher
                vouchers.forEach(voucher -> {
                    voucher.updateActiveStatus();
                    voucherRepository.save(voucher);
                });
                break;
            case "RESTAURANTHOST":
                vouchers = voucherRepository.findByTypeAndRestaurantId("LOCAL", restaurantId);
                vouchers.forEach(voucher -> {
                    voucher.updateActiveStatus();
                    voucherRepository.save(voucher);
                });
                break;
            case "USER":
                // Đối với user, chỉ lấy các voucher còn active
                vouchers = voucherRepository.findValidVouchersForUser(LocalDateTime.now(), restaurantId);
                break;
            default:
                return List.of();
        }
        
        return vouchers.stream()
            .map(voucherMapper::toThumbDTO)
            .collect(Collectors.toList());
    }
    
    // Lấy chi tiết voucher
    public VoucherDetailDTO getVoucherDetail(String voucherId) {
        Voucher voucher = voucherRepository.findById(voucherId)
            .orElseThrow(() -> new RuntimeException("Voucher not found"));
        voucher.updateActiveStatus();
        voucherRepository.save(voucher);
        return voucherMapper.toDetailDTO(voucher);
    }
    
    // Tạo voucher mới
    @Transactional
    public VoucherDetailDTO createVoucher(CreateVoucherDTO dto, String token) {
        String role = jwtTokenProvider.getRoleFromToken(token);
        if (role == null) {
            throw new RuntimeException("Role not found");
        }

        // Validate
        if (voucherRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Voucher code already exists");
        }
        
        // Tạo voucher mới
        Voucher voucher = new Voucher();
        
        // Các trường bắt buộc từ DTO
        voucher.setCode(dto.getCode());
        voucher.setValue(dto.getValue());
        
        // Xử lý type dựa vào restaurantId
        if (dto.getRestaurantId() != null) {
            voucher.setType("LOCAL");
            voucher.setRestaurantId(dto.getRestaurantId());
        } else {
            // Nếu không có restaurantId, mặc định là GLOBAL
            voucher.setType("GLOBAL");
            // Kiểm tra quyền tạo voucher GLOBAL
            if (!"admin".equals(role.toLowerCase())) {
                throw new RuntimeException("Only admin can create global vouchers");
            }
        }
        
        // Thiết lập các trường mặc định
        voucher.setCreatedAt(LocalDateTime.now());
        voucher.setUpdatedAt(LocalDateTime.now());
        voucher.setActive(true);
        voucher.setUsage(new ArrayList<>());
        
        // Thiết lập điều kiện voucher
        Voucher.VoucherCondition conditions = new Voucher.VoucherCondition();
        conditions.setMinimumOrderAmount(dto.getMinimumOrderAmount() != null ? 
            dto.getMinimumOrderAmount() : 0.0);
        voucher.setConditions(conditions);
        
        // Thiết lập thời hạn voucher
        Voucher.VoucherValidity validity = new Voucher.VoucherValidity();
        validity.setIssuedAt(LocalDateTime.now());
        validity.setExpiresAt(dto.getExpiresAt());
        voucher.setValidity(validity);
        
        // Thiết lập số lượng còn lại
        voucher.setRemainingValue(dto.getRemainingValue() != null ? 
            dto.getRemainingValue() : 0);

        voucher.updateActiveStatus();
        
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toDetailDTO(voucher);
    }
    
    // Cập nhật voucher
    @Transactional
    public VoucherDetailDTO updateVoucher(String code, CreateVoucherDTO dto, String token) {
        String role = jwtTokenProvider.getRoleFromToken(token);
        if (role == null) {
            throw new RuntimeException("Role not found");
        }

        Voucher existingVoucher = voucherRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Voucher not found"));
        
        // Kiểm tra quyền
        if ("GLOBAL".equals(existingVoucher.getType()) && !"admin".equals(role)) {
            throw new RuntimeException("Only admin can update global vouchers");
        }

        // Cập nhật các trường nếu có giá trị mới
        if (dto.getCode() != null) existingVoucher.setCode(dto.getCode());
        if (dto.getValue() != null) existingVoucher.setValue(dto.getValue());
        if (dto.getType() != null) existingVoucher.setType(dto.getType());
        if (dto.getRestaurantId() != null) existingVoucher.setRestaurantId(dto.getRestaurantId());
        
        // Cập nhật điều kiện voucher
        if (dto.getRemainingValue() != null) 
            existingVoucher.setRemainingValue(dto.getRemainingValue());
        if (dto.getMinimumOrderAmount() != null) 
            existingVoucher.getConditions().setMinimumOrderAmount(dto.getMinimumOrderAmount());
        
        // Cập nhật thời hạn voucher
        if (dto.getIssuedAt() != null) {
            existingVoucher.getValidity().setIssuedAt(dto.getIssuedAt());
        }
        if (dto.getExpiresAt() != null) {
            existingVoucher.getValidity().setExpiresAt(dto.getExpiresAt());
        }
        
        existingVoucher.setUpdatedAt(LocalDateTime.now());
        existingVoucher.updateActiveStatus();
        existingVoucher = voucherRepository.save(existingVoucher);
        
        return voucherMapper.toDetailDTO(existingVoucher);
    }

    // Xóa voucher
    @Transactional
    public boolean deleteVoucher(String code, String token) {
        String role = jwtTokenProvider.getRoleFromToken(token);
        if (role == null) {
            throw new RuntimeException("Role not found");
        }

        Voucher voucher = voucherRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Voucher not found"));
        
        // Kiểm tra quyền
        if ("GLOBAL".equals(voucher.getType()) && !"admin".equals(role)) {
            throw new RuntimeException("Only admin can delete global vouchers");
        }
        
        voucherRepository.delete(voucher);
        return true;
    }
    
    // Sử dụng voucher
    @Transactional
    public boolean useVoucher(String code, String token) {
        // Lấy userId từ token
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        if (userId == null) {
            throw new RuntimeException("Invalid token");
        }

        // Tìm voucher bằng code
        Voucher voucher = voucherRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Voucher not found"));
            
        // Cập nhật và kiểm tra trạng thái
        voucher.updateActiveStatus();
        if (!voucher.isActive()) {
            throw new RuntimeException("Voucher is not active");
        }
        
        if (voucher.getConditions().getMinimumOrderAmount() <= 0) {
            throw new RuntimeException("Order amount does not meet minimum requirement");
        }
        
        // Kiểm tra xem user đã sử dụng voucher này chưa
        boolean hasUsed = voucher.getUsage().stream()
            .anyMatch(usage -> usage.getUserId().equals(userId));
        if (hasUsed) {
            throw new RuntimeException("User has already used this voucher");
        }
        
        // Thêm usage mới
        Voucher.VoucherUsage newUsage = new Voucher.VoucherUsage();
        newUsage.setUserId(userId);
        newUsage.setUsedAt(LocalDateTime.now());
        voucher.getUsage().add(newUsage);
        
        // Cập nhật voucher
        voucher.setRemainingValue(voucher.getRemainingValue() - 1);
        voucher.updateActiveStatus();
        voucher.setUpdatedAt(LocalDateTime.now());
        
        voucherRepository.save(voucher);
        return true;
    }
} 