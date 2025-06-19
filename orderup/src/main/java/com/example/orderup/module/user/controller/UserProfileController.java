package com.example.orderup.module.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.orderup.module.user.service.UserProfileService;
import com.example.orderup.module.user.dto.UserProfileDTO;
import com.example.orderup.module.user.dto.UserProfileDTO.*;
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

    // Cập nhật thông tin profile
    @PutMapping("/id/{id}")
    public ResponseEntity<UserProfileDTO> updateUserProfileById(
            @PathVariable("id") String id, 
            @RequestBody UpdateProfileRequest request) {
        try {
            UserProfileDTO updatedProfile = userProfileService.updateUserProfile(id, request);
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

    // Lấy danh sách địa chỉ
    @GetMapping("/id/{id}/address")
    public ResponseEntity<List<UserProfileDTO.AddressInfo>> getUserAddresses(@PathVariable("id") String id) {
        try {
            List<UserProfileDTO.AddressInfo> addresses = userProfileService.getUserAddresses(id);
            return new ResponseEntity<>(addresses, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Thêm địa chỉ mới
    @PostMapping("/id/{id}/address")
    public ResponseEntity<UserProfileDTO> addUserAddress(
            @PathVariable("id") String id,
            @RequestBody AddAddressRequest request) {
        try {
            UserProfileDTO updatedProfile = userProfileService.addUserAddress(id, request);
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

    // Cập nhật địa chỉ
    @PutMapping("/id/{id}/address/{addressIndex}")
    public ResponseEntity<UserProfileDTO> updateUserAddress(
            @PathVariable("id") String id,
            @PathVariable("addressIndex") int addressIndex,
            @RequestBody AddAddressRequest request) {
        try {
            UserProfileDTO updatedProfile = userProfileService.updateUserAddress(id, addressIndex, request);
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

    // Xóa địa chỉ
    @DeleteMapping("/id/{id}/address/{addressIndex}")
    public ResponseEntity<UserProfileDTO> deleteUserAddress(
            @PathVariable("id") String id,
            @PathVariable("addressIndex") int addressIndex) {
        try {
            UserProfileDTO updatedProfile = userProfileService.deleteUserAddress(id, addressIndex);
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
