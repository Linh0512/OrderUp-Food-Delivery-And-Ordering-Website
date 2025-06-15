package com.example.orderup.module.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.orderup.module.user.repository.UserProfileRepository;
import com.example.orderup.module.user.entirty.Profile;
import com.example.orderup.module.user.entirty.User;

@Service
public class UserProfileService {
    @Autowired
    private UserProfileRepository userProfileRepository;

    public Profile findByUserId(String userId) {
        User user = userProfileRepository.findByUserId(userId);
        return user != null ? user.getProfile() : null;
    }

    public Profile updateUserProfileById(String userId, Profile profile) {
        User user = userProfileRepository.findByUserId(userId);
        if (user != null) {
            return userProfileRepository.updateUserProfileById(userId, profile);
        }
        return null;
    }
}
