package com.example.orderup.models.entities.User;

import lombok.Data;

@Data
public class Preferences {
    private String language;
    private Notifications notifications;
}
