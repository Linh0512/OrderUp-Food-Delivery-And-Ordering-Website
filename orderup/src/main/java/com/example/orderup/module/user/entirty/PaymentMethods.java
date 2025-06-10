package com.example.orderup.module.user.entirty;

import lombok.Data;

@Data
public class PaymentMethods {
    private String type;
    private String ewalletType;
    private String ewalletAccount;
    private boolean isDefault;
}
