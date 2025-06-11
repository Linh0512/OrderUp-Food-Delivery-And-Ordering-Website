package com.example.orderup.module.user.entirty;

import lombok.Data;

@Data
public class Notifications {
    private boolean email;
    private boolean push;
    private boolean sms;
    private boolean orderUpdates;
    private boolean promotions;
}
