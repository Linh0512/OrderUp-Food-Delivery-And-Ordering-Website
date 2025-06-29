package com.example.orderup.module.voucher.mapper;

import com.example.orderup.module.voucher.dto.*;
import com.example.orderup.module.voucher.entity.Voucher;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class VoucherMapper {
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter HTML_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter HTML_DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
    private static final SimpleDateFormat SIMPLE_DATE_FORMATTER = new SimpleDateFormat("dd/MM/yyyy");
    
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
        if (voucher.getValidity() != null && voucher.getValidity().getExpiresAt() != null) {
            // Convert Date to LocalDate for DTO
            LocalDate expiresAtLocal = voucher.getValidity().getExpiresAt().toInstant()
                .atZone(ZoneId.systemDefault()).toLocalDate();
            dto.setExpiresAt(expiresAtLocal);
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
        if (voucher.getValidity() != null && voucher.getValidity().getExpiresAt() != null) {
            // Convert Date to LocalDate for DTO
            LocalDate expiresAtLocal = voucher.getValidity().getExpiresAt().toInstant()
                .atZone(ZoneId.systemDefault()).toLocalDate();
            dto.setExpiresAt(expiresAtLocal);
        }
        dto.setActive(voucher.isActive());
        dto.setRestaurantId(voucher.getRestaurantId());
        
        if (voucher.getCreatedAt() != null) {
            dto.setCreatedAt(SIMPLE_DATE_FORMATTER.format(voucher.getCreatedAt()));
        }
        if (voucher.getUpdatedAt() != null) {
            dto.setUpdatedAt(SIMPLE_DATE_FORMATTER.format(voucher.getUpdatedAt()));
        }
        
        if (voucher.getUsage() != null) {
            dto.setUsage(voucher.getUsage().stream()
                .map(usage -> {
                    VoucherUsageDTO usageDTO = new VoucherUsageDTO();
                    usageDTO.setUserId(usage.getUserId());
                    // Convert Date to LocalDateTime for DTO
                    if (usage.getUsedAt() != null) {
                        LocalDateTime localDateTime = usage.getUsedAt().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDateTime();
                        usageDTO.setUsedAt(localDateTime);
                    }
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
        
        if (dto.getIssuedAt() != null && !dto.getIssuedAt().isEmpty()) {
            try {
                LocalDateTime localDateTime = LocalDateTime.parse(dto.getIssuedAt(), HTML_DATETIME_FORMATTER);
                validity.setIssuedAt(Date.from(localDateTime.atZone(java.time.ZoneId.systemDefault()).toInstant()));
            } catch (Exception e) {
                validity.setIssuedAt(new Date());
            }
        } else {
            validity.setIssuedAt(new Date());
        }
        
        if (dto.getExpiresAt() != null && !dto.getExpiresAt().isEmpty()) {
            try {
                LocalDate localDate = LocalDate.parse(dto.getExpiresAt(), HTML_DATE_FORMATTER);
                validity.setExpiresAt(Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));
            } catch (Exception e) {
                LocalDate defaultDate = LocalDate.now().plusDays(30);
                validity.setExpiresAt(Date.from(defaultDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));
            }
        } else {
            LocalDate defaultDate = LocalDate.now().plusDays(30);
            validity.setExpiresAt(Date.from(defaultDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));
        }
        
        voucher.setValidity(validity);
        
        voucher.setRemainingValue(dto.getRemainingValue() != null ? dto.getRemainingValue() : null);
        voucher.setRestaurantId(dto.getRestaurantId());
        voucher.setUsage(new ArrayList<>());
        
        // Convert LocalDateTime to Date for entity
        Date now = new Date();
        voucher.setCreatedAt(now);
        voucher.setUpdatedAt(now);
        
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
        
        if (dto.getExpiresAt() != null && !dto.getExpiresAt().isEmpty()) {
            try {
                LocalDate localDate = LocalDate.parse(dto.getExpiresAt(), HTML_DATE_FORMATTER);
                validity.setExpiresAt(Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));
            } catch (Exception e) {
                // Keep existing value if parsing fails
            }
        }
        
        voucher.setRemainingValue(dto.getRemainingValue() != null ? dto.getRemainingValue() : null);
        if (dto.getRestaurantId() != null) {
            voucher.setRestaurantId(dto.getRestaurantId());
        }
        // Convert to Date for entity
        voucher.setUpdatedAt(new Date());
    }

    public VoucherUsageDTO toUsageDTO(Voucher.VoucherUsage usage) {
        if (usage == null) return null;
        VoucherUsageDTO dto = new VoucherUsageDTO();
        dto.setUserId(usage.getUserId());
        
        // Convert Date to LocalDateTime for DTO
        if (usage.getUsedAt() != null) {
            LocalDateTime localDateTime = usage.getUsedAt().toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
            dto.setUsedAt(localDateTime);
        }
        
        return dto;
    }
} 