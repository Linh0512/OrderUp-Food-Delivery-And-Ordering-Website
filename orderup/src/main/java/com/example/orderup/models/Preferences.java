package com.example.orderup.models;

import lombok.Data;

@Data
public class Preferences {
    private String language;
    private Notifications notifications;
}
