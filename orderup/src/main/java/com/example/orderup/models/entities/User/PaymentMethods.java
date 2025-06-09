package com.example.orderup.models.entities.User;

import lombok.Data;

@Data
public class PaymentMethods {
    private String type;
    private String ewalletType;
    private String ewalletAccount;
    private boolean isDefault;
}
