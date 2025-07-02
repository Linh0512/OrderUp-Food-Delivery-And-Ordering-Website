package com.example.orderup.module.admin.controller;

import com.example.orderup.config.security.JwtTokenProvider;
import com.example.orderup.module.dto.LoginRequest;
import com.example.orderup.module.dto.LoginResponse;
import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/api/admin-auth")
public class AdminAuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password, HttpServletResponse response) {
        try {
            // Tìm user bằng email
            User user = userService.findByEmail(email);
            
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            // Thêm log để debug
            System.out.println("Admin login - Provided password: " + password);
            System.out.println("Admin login - Stored password: " + user.getPassword());
            
            // So sánh password trực tiếp (không dùng BCrypt)
            if (!user.getPassword().equals(password)) {
                return ResponseEntity.badRequest().body("Invalid password");
            }
            
            // Kiểm tra role admin
            if (!"admin".equals(user.getRole())) {
                return ResponseEntity.badRequest().body("Access denied: Admin role required");
            }
            
            // Kiểm tra user active
            if (!user.isActive()) {
                return ResponseEntity.badRequest().body("Account is deactivated");
            }
            
            // Tạo JWT token
            String token = jwtTokenProvider.generateToken(user);
            
            // Set JWT token vào cookie với các thuộc tính cụ thể
            Cookie jwtCookie = new Cookie("jwt", token);
            jwtCookie.setHttpOnly(false); // Tạm thời set false để debug
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(24 * 60 * 60); // 24 hours
            jwtCookie.setSecure(false); // Set false cho localhost development
            // Thêm SameSite=Lax để đảm bảo cookie được gửi
            response.setHeader("Set-Cookie", String.format("jwt=%s; Path=/; Max-Age=%d; SameSite=Lax", 
                token, 24 * 60 * 60));
            
            System.out.println("Setting JWT cookie with token: " + token.substring(0, Math.min(20, token.length())) + "...");
            System.out.println("Cookie will be set with SameSite=Lax policy");
            
            // Cập nhật last login
            user.setLastLogin(new java.util.Date());
            userService.updateUser(user);
            
            // Trả về response thành công
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setSuccess(true);
            loginResponse.setUserId(user.getId());
            loginResponse.setMessage("Login successful");
            loginResponse.setRole(user.getRole());
            loginResponse.setToken(token);
            
            return ResponseEntity.ok(loginResponse);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Login error: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    @ResponseBody
    public ResponseEntity<String> logout(HttpServletResponse response) {
        // Xóa JWT cookie
        Cookie jwtCookie = new Cookie("jwt", "");
        jwtCookie.setMaxAge(0);
        jwtCookie.setPath("/");
        response.addCookie(jwtCookie);
        
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/validate")
    @ResponseBody
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        try {
            // Lấy token từ cookie
            String token = null;
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if ("jwt".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }
            
            if (token == null || !jwtTokenProvider.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }
            
            String email = jwtTokenProvider.getEmailFromToken(token);
            User user = userService.findByEmail(email);
            
            if (user == null || !"admin".equals(user.getRole()) || !user.isActive()) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            return ResponseEntity.ok(user);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Validation error: " + e.getMessage());
        }
    }

    @PostMapping("/setup-session")
    @ResponseBody
    public ResponseEntity<?> setupAdminSession(@org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> request, HttpServletResponse response) {
        try {
            String token = request.get("token");
            
            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest().body("Token is required");
            }
            
            // Validate token
            if (!jwtTokenProvider.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }
            
            // Get user from token
            String email = jwtTokenProvider.getEmailFromToken(token);
            User user = userService.findByEmail(email);
            
            if (user == null || !"admin".equals(user.getRole()) || !user.isActive()) {
                return ResponseEntity.status(403).body("Access denied: Admin role required");
            }
            
            // Set JWT token vào cookie để admin có thể truy cập lại
            Cookie jwtCookie = new Cookie("jwt", token);
            jwtCookie.setHttpOnly(false); // Cho phép JavaScript access để debug
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(24 * 60 * 60); // 24 hours
            jwtCookie.setSecure(false); // Set false cho localhost development
            
            // Sử dụng response header để set cookie với SameSite
            response.setHeader("Set-Cookie", String.format("jwt=%s; Path=/; Max-Age=%d; SameSite=Lax", 
                token, 24 * 60 * 60));
            
            System.out.println("Admin session setup successful for: " + email);
            System.out.println("JWT cookie set with token: " + token.substring(0, Math.min(20, token.length())) + "...");
            
            return ResponseEntity.ok().body(java.util.Map.of(
                "success", true, 
                "message", "Admin session setup successful",
                "email", email
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Session setup error: " + e.getMessage());
        }
    }

    @GetMapping("/debug-cookies")
    @ResponseBody
    public ResponseEntity<?> debugCookies(HttpServletRequest request) {
        StringBuilder cookieInfo = new StringBuilder("Cookies received:\n");
        
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                cookieInfo.append("- ").append(cookie.getName()).append(" = ");
                if ("jwt".equals(cookie.getName())) {
                    cookieInfo.append(cookie.getValue().substring(0, Math.min(20, cookie.getValue().length()))).append("...\n");
                } else {
                    cookieInfo.append(cookie.getValue()).append("\n");
                }
            }
        } else {
            cookieInfo.append("No cookies found");
        }
        
        return ResponseEntity.ok(cookieInfo.toString());
    }
}