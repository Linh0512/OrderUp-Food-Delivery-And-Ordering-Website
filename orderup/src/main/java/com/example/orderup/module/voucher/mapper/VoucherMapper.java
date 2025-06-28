package com.example.orderup.module.voucher.mapper;

import com.example.orderup.module.voucher.dto.*;
import com.example.orderup.module.voucher.entity.Voucher;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class VoucherMapper {
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    
    public VoucherThumbDTO toThumbDTO(Voucher voucher) {
        if (voucher == null) return null;
        
        VoucherThumbDTO dto = new VoucherThumbDTO();
        dto.setId(voucher.getId());
        dto.setCode(voucher.getCode());
        dto.setType(voucher.getType());
        dto.setValue(voucher.getValue());
        if (voucher.getConditions() != null) {
            dto.setMinimumOrderAmount(voucher.getConditions().getMinimumOrderAmount());
        }
        dto.setRemainingValue(voucher.getRemainingValue());
        if (voucher.getValidity() != null) {
            dto.setExpiresAt(voucher.getValidity().getExpiresAt());
        }
        dto.setActive(voucher.isActive());
        dto.setRestaurantId(voucher.getRestaurantId());
        return dto;
    }
    
    public VoucherDetailDTO toDetailDTO(Voucher voucher) {
        if (voucher == null) return null;
        
        VoucherDetailDTO dto = new VoucherDetailDTO();
        dto.setId(voucher.getId());
        dto.setCode(voucher.getCode());
        dto.setType(voucher.getType());
        dto.setValue(voucher.getValue());
        if (voucher.getConditions() != null) {
            dto.setMinimumOrderAmount(voucher.getConditions().getMinimumOrderAmount());
        }
        dto.setRemainingValue(voucher.getRemainingValue());
        if (voucher.getValidity() != null) {
            dto.setExpiresAt(voucher.getValidity().getExpiresAt());
        }
        dto.setActive(voucher.isActive());
        dto.setRestaurantId(voucher.getRestaurantId());
        
        if (voucher.getCreatedAt() != null) {
            dto.setCreatedAt(voucher.getCreatedAt().format(DATE_FORMATTER));
        }
        if (voucher.getUpdatedAt() != null) {
            dto.setUpdatedAt(voucher.getUpdatedAt().format(DATE_FORMATTER));
        }
        
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
        Voucher voucher = new Voucher();
        voucher.setCode(dto.getCode());
        voucher.setType(dto.getType());
        voucher.setValue(dto.getValue());
        
        Voucher.VoucherCondition conditions = new Voucher.VoucherCondition();
        conditions.setMinimumOrderAmount(dto.getMinimumOrderAmount());
        voucher.setConditions(conditions);
        
        Voucher.VoucherValidity validity = new Voucher.VoucherValidity();
        validity.setIssuedAt(LocalDateTime.now());
        validity.setExpiresAt(dto.getExpiresAt());
        voucher.setValidity(validity);
        
        voucher.setRemainingValue(dto.getRemainingValue());
        voucher.setRestaurantId(dto.getRestaurantId());
        voucher.setUsage(new ArrayList<>());
        voucher.setCreatedAt(LocalDateTime.now());
        voucher.setUpdatedAt(LocalDateTime.now());
        
        return voucher;
    }

    public void updateFromDTO(Voucher voucher, CreateVoucherDTO dto) {
        voucher.setCode(dto.getCode());
        if (dto.getType() != null) {
            voucher.setType(dto.getType());
        }
        voucher.setValue(dto.getValue());
        
        Voucher.VoucherCondition conditions = voucher.getConditions();
        if (conditions == null) {
            conditions = new Voucher.VoucherCondition();
            voucher.setConditions(conditions);
        }
        conditions.setMinimumOrderAmount(dto.getMinimumOrderAmount());
        
        Voucher.VoucherValidity validity = voucher.getValidity();
        if (validity == null) {
            validity = new Voucher.VoucherValidity();
            voucher.setValidity(validity);
        }
        validity.setExpiresAt(dto.getExpiresAt());
        
        voucher.setRemainingValue(dto.getRemainingValue());
        if (dto.getRestaurantId() != null) {
            voucher.setRestaurantId(dto.getRestaurantId());
        }
        voucher.setUpdatedAt(LocalDateTime.now());
    }

    public VoucherUsageDTO toUsageDTO(Voucher.VoucherUsage usage) {
        if (usage == null) return null;
        VoucherUsageDTO dto = new VoucherUsageDTO();
        dto.setUserId(usage.getUserId());
        dto.setUsedAt(usage.getUsedAt());
        return dto;
    }
} 