package com.example.orderup.module.user.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.repository.UserRepository;
import com.example.orderup.module.user.entirty.Profile;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // Add methods to interact with UserRepository as needed
    // Sửa định nghĩa phương thức getAllUsers trong UserService
    public Page<User> getAllUsers(int page, int size, String[] sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? 
                    Sort.by(sortBy).descending() : 
                    Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findAll(pageable);
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getByUserName(String name) {
        return userRepository.getByUserName(name);
    }

    public User getByEmail(String email) {
        List<User> users = userRepository.getByEmail(email);
        return users.isEmpty() ? null : users.get(0);
    }

    public List<User> getByPhone(String phone) {
        return userRepository.getByPhone(phone);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public Map<String, Object> getUserStats() {
        long totalUsers = userRepository.count();

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, -30); // 30 days ago
        Date thirtyDaysAgo = calendar.getTime();

        calendar = Calendar.getInstance(); // Reset calendar to now
        Date now = calendar.getTime();

        calendar.add(Calendar.DAY_OF_MONTH, -7); // -7 days from now
        Date sevenDaysAgo= calendar.getTime();

        long newUsers = userRepository.countByCreatedAtGreaterThan(thirtyDaysAgo);
        long activeUsers = userRepository.countByLastLoginBetween(sevenDaysAgo, now);

        long adminCount = userRepository.countByRole("admin");
        long userCount = userRepository.countByRole("user");
        long restaurantCount = userRepository.countByRole("restaurantHost");

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("newUsers", newUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("adminCount", adminCount);
        stats.put("userCount", userCount);
        stats.put("restaurantCount", restaurantCount);
        return stats;
    }

    public User updateUserData(User existingUser, User newUser, boolean updatePassword) {
        // Cập nhật thông tin cơ bản
        if (newUser.getEmail() != null) existingUser.setEmail(newUser.getEmail());
        if (newUser.getRole() != null) existingUser.setRole(newUser.getRole());
        existingUser.setActive(newUser.isActive());
        existingUser.setVerified(newUser.isVerified());
        
        // Cập nhật mật khẩu nếu cần
        if (updatePassword && newUser.getPassword() != null && !newUser.getPassword().isEmpty()) {
            existingUser.setPassword(newUser.getPassword());
        }
        
        // Cập nhật profile
        if (newUser.getProfile() != null) {
            if (existingUser.getProfile() == null) {
                existingUser.setProfile(new Profile());
            }
            Profile existingProfile = existingUser.getProfile();
            Profile newProfile = newUser.getProfile();
            
            if (newProfile.getFirstName() != null) existingProfile.setFirstName(newProfile.getFirstName());
            if (newProfile.getLastName() != null) existingProfile.setLastName(newProfile.getLastName());
            if (newProfile.getPhone() != null) existingProfile.setPhone(newProfile.getPhone());
            if (newProfile.getGender() != null) existingProfile.setGender(newProfile.getGender());
            if (newProfile.getDateOfBirth() != null) existingProfile.setDateOfBirth(newProfile.getDateOfBirth());
            if (newProfile.getAvatar() != null) existingProfile.setAvatar(newProfile.getAvatar());
        }
        
        // Cập nhật địa chỉ
        if (newUser.getAddresses() != null && !newUser.getAddresses().isEmpty()) {
            existingUser.setAddresses(newUser.getAddresses());
        }
        
        // Cập nhật thời gian
        existingUser.setUpdatedAt(new Date());
        
        return existingUser;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }
}
