package com.example.orderup.module.user.controller;

import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.entirty.Profile;
import com.example.orderup.module.user.service.UserProfileService;
import com.example.orderup.module.user.service.UserService;
import com.example.orderup.module.user.service.UserOrderHistoryService;
import com.example.orderup.module.user.dto.UserOrderHistoryThumbDTO;
import com.example.orderup.module.user.dto.UserOrderHistoryDetailDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Date;
import java.util.HashMap;





@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private UserOrderHistoryService orderHistoryService;

    // Sử dụng UserService để lấy tất cả người dùng với phân trang và sắp xếp
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "updatedAt") String[] sortBy,
            @RequestParam(defaultValue = "desc") String direction){

        try {
            Page<User> usersPage = userService.getAllUsers(page, size, sortBy, direction);

            Map<String, Object> response = new HashMap<>();
            response.put("Users", usersPage.getContent());
            response.put("currentPage", usersPage.getNumber());
            response.put("totalItems", usersPage.getTotalElements());
            response.put("totalPages", usersPage.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Sử dụng UserService để lấy user theo email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable("email") String email) {
        try {
            User user = userService.getByEmail(email);
            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Sử dụng UserService để lấy user theo sdt người dùng
    @GetMapping("/phone/{phone}")
    public ResponseEntity<List<User>> getUsersByPhone(@PathVariable("phone") String phone) {
        try {
            List<User> users = userService.getByPhone(phone);

            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(users, HttpStatus.OK);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Sử dụng UserService để tạo user mới
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            // Đặt thời gian tạo và cập nhật mới nhất nếu chưa được đặt
            Date now = new Date();
            if (user.getCreatedAt() == null) {
                user.setCreatedAt(now);
            }
            if (user.getUpdatedAt() == null) {
                user.setUpdatedAt(now);
            }
            
            User savedUser = userService.saveUser(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

     // Cập nhật các trường của người dùng
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserById(@PathVariable("id") String id, @RequestBody User user) {
        User existingUser = userService.getUserById(id);

        try {
            if (existingUser != null) {                
                existingUser.setEmail(user.getEmail());
                existingUser.setPassword(user.getPassword());
                existingUser.setRole(user.getRole());
                existingUser.setProfile(user.getProfile());
                existingUser.setPreferences(user.getPreferences());
                existingUser.setAddresses(user.getAddresses());
                existingUser.setPaymentMethods(user.getPaymentMethods());
                existingUser.setLoyaltyPoints(user.getLoyaltyPoints());
                existingUser.setActive(user.isActive());
                existingUser.setVerified(user.isVerified());
                existingUser.setLastLogin(user.getLastLogin());
                existingUser.setCreatedAt(user.getCreatedAt());

                existingUser.setUpdatedAt(new Date()); // Cập nhật thời gian cập nhật mới nhất

                return new ResponseEntity<>(userService.saveUser(existingUser), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/id/{id}")
    public ResponseEntity<String> deleteUsersById(@PathVariable("id") String id) {
        try {
            User user = userService.getUserById(id);
            if (user != null) {
                userService.deleteUser(id);
                return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error deleting user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Sử dụng UserService để tìm kiếm người dùng theo tên
    @GetMapping("/name/{userName}")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String userName) {
        try {
            List<User> users = userService.getByUserName(userName);
            if (users.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(users, HttpStatus.OK);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        try {
            Map<String, Object> stats = userService.getUserStats();
            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy thông tin user theo ID
    @GetMapping("/id/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") String id) {
        try {
            User user = userService.getUserById(id);
            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
