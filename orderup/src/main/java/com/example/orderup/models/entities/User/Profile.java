package com.example.orderup.models.entities.User;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class Profile {
    private String firstName;
    private String lastName;
    private String phone;
    private String avatar;
    
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date dateOfBirth;
    private String gender;
}
