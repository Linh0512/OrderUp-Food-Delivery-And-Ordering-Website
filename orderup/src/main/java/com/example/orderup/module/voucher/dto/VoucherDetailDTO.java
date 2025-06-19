package com.example.orderup.module.voucher.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VoucherDetailDTO extends VoucherThumbDTO {
    private List<VoucherUsageDTO> usage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 