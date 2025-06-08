package com.example.orderup.models.entities.User;

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
