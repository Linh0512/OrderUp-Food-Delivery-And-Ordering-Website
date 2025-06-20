package com.example.orderup.module.user.dto;

import lombok.Data;

@Data
public class UpdatePasswordDTO {
    private String oldPassword;
    private String newPassword;
    private String confirmNewPassword;
}
