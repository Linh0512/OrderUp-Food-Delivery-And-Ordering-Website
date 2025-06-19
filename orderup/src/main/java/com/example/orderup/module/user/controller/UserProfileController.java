package com.example.orderup.module.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.orderup.module.user.service.UserProfileService;
import com.example.orderup.module.user.dto.UserProfileDTO;
import com.example.orderup.module.user.entirty.Profile;

@RestController
@RequestMapping("/api/users/profile")
public class UserProfileController {
    @Autowired
    private UserProfileService userProfileService;

    // Lấy thông tin profile của user theo ID
    @GetMapping("/id/{id}")
    public ResponseEntity<UserProfileDTO> getUserProfileById(@PathVariable("id") String id) {
        try {
            UserProfileDTO profile = userProfileService.getUserProfile(id);
            if (profile != null) {
                return new ResponseEntity<>(profile, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/id/{id}")
    public ResponseEntity<UserProfileDTO> updateUserProfileById(
            @PathVariable("id") String id, 
            @RequestBody Profile profile) {
        try {
            UserProfileDTO updatedProfile = userProfileService.updateUserProfile(id, profile);
            if (updatedProfile != null) {
                return new ResponseEntity<>(updatedProfile, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
