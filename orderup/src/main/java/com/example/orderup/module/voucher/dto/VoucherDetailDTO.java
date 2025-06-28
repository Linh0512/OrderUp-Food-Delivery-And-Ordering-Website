package com.example.orderup.module.voucher.dto;

import lombok.Data;
import java.util.List;

@Data
public class VoucherDetailDTO extends VoucherThumbDTO {
    private List<VoucherUsageDTO> usage;
    private String createdAt;
    private String updatedAt;
} 