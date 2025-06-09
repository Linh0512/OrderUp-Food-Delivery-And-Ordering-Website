package com.example.orderup.controllers.auth;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.orderup.models.dto.LoginRequest;
import com.example.orderup.models.dto.LoginResponse;
import com.example.orderup.models.entities.User.User;
import com.example.orderup.security.JwtTokenProvider;
import com.example.orderup.services.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.getByEmail(loginRequest.getEmail());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, null, "Invalid email", null, null));
            }

            if (!user.isActive()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, null, "User is blocked", null, null));
            }

            // Thêm log để kiểm tra mật khẩu
            System.out.println("Provided password: " + loginRequest.getPassword());
            System.out.println("Stored password: " + user.getPassword());

            if (!user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, null, "Invalid password", null, null));
            }
            
            // Cập nhật thông tin đăng nhập cuối
            user.setLastLogin(new Date());
            userService.saveUser(user);
            
            // Tạo JWT token
            String token = jwtTokenProvider.generateToken(user);
            System.out.println("Generated token: " + token);
            
            // Trả về response với token
            return ResponseEntity.ok(new LoginResponse(true, user.getId(), "Login successful", user.getRole(), token));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse(false, null, "An error occurred during login: " + e.getMessage(), null, null));
        }
    }
}