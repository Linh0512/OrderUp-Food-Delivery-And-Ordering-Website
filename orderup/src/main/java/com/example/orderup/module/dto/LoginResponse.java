package com.example.orderup.module.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private boolean success;
    private String userId;
    private String message;
    private String role;
    private String token;

    public LoginResponse() {
    }

    public LoginResponse(boolean success, String userId, String message, String role, String token) {
        this.success = success;
        this.userId = userId;
        this.message = message;
        this.role = role;
        this.token = token;
    }
}
