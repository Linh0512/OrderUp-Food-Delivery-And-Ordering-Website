package com.example.orderup.module.voucher.service;

import com.example.orderup.config.security.JwtTokenProvider;
import com.example.orderup.module.voucher.dto.*;
import com.example.orderup.module.voucher.entity.Voucher;
import com.example.orderup.module.voucher.mapper.VoucherMapper;
import com.example.orderup.module.voucher.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.orderup.module.user.entirty.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
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
        // Chỉ update status in-memory, KHÔNG save để tránh schema validation error
        vouchers.forEach(voucher -> voucher.updateActiveStatus());
        return vouchers.stream()
                .map(voucherMapper::toThumbDTO)
                .collect(Collectors.toList());
    }

    public VoucherDetailDTO getVoucherDetail(String id) {
        Voucher voucher = voucherRepository.findById(id).orElse(null);
        if (voucher == null) {
            throw new RuntimeException("Voucher not found");
        }
        
        // Chỉ update status in-memory, KHÔNG save để tránh schema validation error
        voucher.updateActiveStatus();
        
        return voucherMapper.toDetailDTO(voucher);
    }

    @Transactional
    public VoucherDetailDTO createVoucher(CreateVoucherDTO dto, String token) {
        // Validate
        if (voucherRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Voucher code already exists");
        }

        String role = getUserRole(token);
        if (role == null) {
            throw new RuntimeException("Invalid authentication");
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
    public VoucherDetailDTO updateVoucher(String voucherId, CreateVoucherDTO dto, String token) {
        Voucher voucher = voucherRepository.findById(voucherId).orElse(null);
        if (voucher == null) {
            throw new RuntimeException("Voucher not found");
        }
        
        voucherMapper.updateFromDTO(voucher, dto);
        voucher.updateActiveStatus();
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toDetailDTO(voucher);
    }

    @Transactional
    public boolean deleteVoucher(String voucherId, String token) {
        Voucher voucher = voucherRepository.findById(voucherId).orElse(null);
        if (voucher == null) {
            throw new IllegalArgumentException("Không tìm thấy voucher");
        }
        voucherRepository.delete(voucher);
        return true;
    }

    // Restaurant methods
    public List<VoucherThumbDTO> getVouchersByUserRole(String token, String restaurantId) {
        String role = getUserRole(token);
        if (role == null) {
            throw new RuntimeException("Invalid authentication");
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
                vouchers = voucherRepository.findAvailableVouchersForUser(LocalDate.now(), restaurantId);
                break;
            default:
                return List.of();
        }
        
        // Chỉ update status in-memory, KHÔNG save để tránh schema validation error
        vouchers.forEach(voucher -> voucher.updateActiveStatus());
        
        return vouchers.stream()
            .map(voucherMapper::toThumbDTO)
            .collect(Collectors.toList());
    }

    /**
     * Lấy tất cả voucher available cho user tại một nhà hàng cụ thể
     * Bao gồm:
     * - Voucher LOCAL của nhà hàng đó (restaurantId trùng khớp)
     * - Tất cả voucher GLOBAL
     * Chỉ trả về voucher còn hiệu lực, chưa hết hạn và còn số lượng
     */
    public List<VoucherThumbDTO> getAvailableVouchersForUser(String restaurantId) {
        // Debug: Lấy tất cả voucher trước
        List<Voucher> allVouchers = voucherRepository.findAll();
        System.out.println("=== DEBUG: Total vouchers in DB: " + allVouchers.size());
        
        // Filter theo logic business
        Date now = new Date();
        List<Voucher> filteredVouchers = allVouchers.stream()
                .filter(voucher -> {
                    // Cập nhật trạng thái in-memory chỉ, KHÔNG save
                    voucher.updateActiveStatus();
                    
                    // Log debug cho từng voucher
                    System.out.println("Voucher: " + voucher.getCode() + 
                        ", Type: " + voucher.getType() + 
                        ", IsActive: " + voucher.isActive() + 
                        ", RemainingValue: " + voucher.getRemainingValue() + 
                        ", ExpiresAt: " + (voucher.getValidity() != null ? voucher.getValidity().getExpiresAt() : "null") +
                        ", RestaurantId: " + voucher.getRestaurantId());
                    
                    // Check basic conditions
                    if (!voucher.isActive() || voucher.getRemainingValue() <= 0) {
                        return false;
                    }
                    
                    // Check expiry date
                    if (voucher.getValidity() == null || voucher.getValidity().getExpiresAt() == null) {
                        return false;
                    }
                    
                    // Compare dates properly
                    if (voucher.getValidity().getExpiresAt().before(now)) {
                        return false;
                    }
                    
                    // Check type and restaurant
                    if ("GLOBAL".equals(voucher.getType())) {
                        return true; // All global vouchers are valid
                    } else if ("LOCAL".equals(voucher.getType())) {
                        return restaurantId.equals(voucher.getRestaurantId());
                    }
                    
                    return false;
                })
                .collect(Collectors.toList());
                
        System.out.println("=== DEBUG: Filtered vouchers count: " + filteredVouchers.size());
        
        return filteredVouchers.stream()
                .map(voucherMapper::toThumbDTO)
                .collect(Collectors.toList());
    }

    public Voucher getVoucherById(String id) {
        Voucher voucher = voucherRepository.findById(id).orElse(null);
        if (voucher == null) {
            throw new IllegalArgumentException("Không tìm thấy voucher");
        }
        // Chỉ update status in-memory, KHÔNG save để tránh schema validation error
        voucher.updateActiveStatus();
        return voucher;
    }

    public Voucher getVoucherByCode(String code) {
        Voucher voucher = voucherRepository.findByCode(code);
        if (voucher == null) {
            throw new IllegalArgumentException("Không tìm thấy voucher");
        }
        // Chỉ update status in-memory, KHÔNG save để tránh schema validation error
        voucher.updateActiveStatus();
        return voucher;
    }

    /**
     * Sử dụng voucher khi checkout đơn hàng
     * Method này chỉ nên được gọi từ checkout process, không phải từ API endpoint riêng
     * @param code Mã voucher cần sử dụng
     * @param userId ID của user sử dụng voucher
     * @throws IllegalArgumentException Nếu voucher không tồn tại, hết hiệu lực hoặc hết lượt sử dụng
     */
    public void useVoucher(String code, String userId) {
        Voucher voucher = voucherRepository.findByCode(code);
        if (voucher == null) {
            throw new IllegalArgumentException("Không tìm thấy voucher với mã: " + code);
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
        usage.setUsedAt(new Date());
        voucher.getUsage().add(usage);

        // Giảm số lượng còn lại
        voucher.setRemainingValue(voucher.getRemainingValue() - 1);

        // Cập nhật trạng thái
        voucher.updateActiveStatus();

        // Lưu voucher
        voucherRepository.save(voucher);
    }

    /**
     * Get user role from either JWT token or session authentication
     */
    private String getUserRole(String token) {
        // First try to get from session (for admin)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof User) {
            User user = (User) auth.getPrincipal();
            return user.getRole();
        }
        
        // Fallback to JWT token (for mobile/API users)
        if (token != null && !token.trim().isEmpty()) {
            try {
                return jwtTokenProvider.getRoleFromToken(token);
            } catch (Exception e) {
                // Token parsing failed, ignore
            }
        }
        
        return null;
    }
} 