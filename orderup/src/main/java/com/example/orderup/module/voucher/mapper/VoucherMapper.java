package com.example.orderup.module.voucher.mapper;

import com.example.orderup.module.voucher.dto.*;
import com.example.orderup.module.voucher.entity.*;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class VoucherMapper {
    
    public VoucherThumbDTO toThumbDTO(Voucher voucher) {
        if (voucher == null) return null;
        
        VoucherThumbDTO dto = new VoucherThumbDTO();
        dto.setId(voucher.getId());
        dto.setCode(voucher.getCode());
        dto.setValue(voucher.getValue());
        dto.setType(voucher.getType());
        dto.setRestaurantId(voucher.getRestaurantId());
        dto.setMinimumOrderAmount(voucher.getConditions().getMinimumOrderAmount());
        dto.setExpiresAt(voucher.getValidity().getExpiresAt());
        dto.setRemainingValue(voucher.getRemainingValue());
        dto.setActive(voucher.isActive());
        return dto;
    }
    
    public VoucherDetailDTO toDetailDTO(Voucher voucher) {
        if (voucher == null) return null;
        
        VoucherDetailDTO dto = new VoucherDetailDTO();
        // Copy các trường từ thumb
        dto.setId(voucher.getId());
        dto.setCode(voucher.getCode());
        dto.setValue(voucher.getValue());
        dto.setType(voucher.getType());
        dto.setRestaurantId(voucher.getRestaurantId());
        dto.setMinimumOrderAmount(voucher.getConditions().getMinimumOrderAmount());
        dto.setExpiresAt(voucher.getValidity().getExpiresAt());
        dto.setRemainingValue(voucher.getRemainingValue());
        dto.setActive(voucher.isActive());
        
        // Thêm các trường chi tiết
        dto.setCreatedAt(voucher.getCreatedAt());
        dto.setUpdatedAt(voucher.getUpdatedAt());
        
        // Map usage history
        if (voucher.getUsage() != null) {
            dto.setUsage(voucher.getUsage().stream()
                .map(usage -> {
                    VoucherUsageDTO usageDTO = new VoucherUsageDTO();
                    usageDTO.setUserId(usage.getUserId());
                    usageDTO.setUsedAt(usage.getUsedAt());
                    return usageDTO;
                })
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    public Voucher toEntity(CreateVoucherDTO dto) {
        if (dto == null) return null;
        
        Voucher voucher = new Voucher();
        voucher.setCode(dto.getCode());
        voucher.setValue(dto.getValue());
        voucher.setType(dto.getType());
        voucher.setRestaurantId(dto.getRestaurantId());
        
        // Set conditions
        Voucher.VoucherCondition conditions = new Voucher.VoucherCondition();
        conditions.setMinimumOrderAmount(dto.getMinimumOrderAmount());
        voucher.setConditions(conditions);
        
        // Set validity
        Voucher.VoucherValidity validity = new Voucher.VoucherValidity();
        validity.setIssuedAt(dto.getIssuedAt() != null ? dto.getIssuedAt() : LocalDateTime.now());
        validity.setExpiresAt(dto.getExpiresAt());
        voucher.setValidity(validity);
        
        // Set other fields
        voucher.setUsage(new ArrayList<>());
        voucher.setRemainingValue(dto.getRemainingValue());
        voucher.setCreatedAt(LocalDateTime.now());
        voucher.setUpdatedAt(LocalDateTime.now());
        voucher.setActive(true);
        
        return voucher;
    }

    public VoucherUsageDTO toUsageDTO(Voucher.VoucherUsage usage) {
        if (usage == null) return null;
        VoucherUsageDTO dto = new VoucherUsageDTO();
        dto.setUserId(usage.getUserId());
        dto.setUsedAt(usage.getUsedAt());
        return dto;
    }
} 