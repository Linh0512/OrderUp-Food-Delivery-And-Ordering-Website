package com.example.orderup.module.user.entirty;

import lombok.Data;

@Data
public class Addresses {
    private String title;
    private String fullAddress;
    private String district;
    private String city;
    private boolean isDefault;
    private Coordinates coordinates;
}
