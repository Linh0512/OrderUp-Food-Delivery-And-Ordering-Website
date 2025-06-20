package com.example.orderup.module.user.entirty;

import com.example.orderup.module.user.entirty.Coordinates;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.annotation.Id;

@Data
public class Addresses {
    @Id
    private String id;

    @Field("title")
    private String title;
    
    @Field("fullAddress")
    private String fullAddress;
    
    @Field("isDefault")
    private boolean isDefault;

    @Field("coordinates")
    private Coordinates coordinates;

    public Addresses() {
        // Default constructor
    }

    public Addresses(String title, String fullAddress, boolean isDefault, Coordinates coordinates) {
        this.title = title;
        this.fullAddress = fullAddress;
        this.isDefault = isDefault;
        this.coordinates = coordinates;
    }
}
