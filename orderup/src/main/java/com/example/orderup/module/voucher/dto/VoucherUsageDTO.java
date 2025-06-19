package com.example.orderup.module.voucher.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherUsageDTO {
    private String userId;
    private LocalDateTime usedAt;
} 