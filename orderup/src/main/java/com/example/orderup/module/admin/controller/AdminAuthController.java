package com.example.orderup.module.admin.controller;

import com.example.orderup.config.security.JwtTokenProvider;
import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.service.UserService;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Controller
@RequestMapping("/api/admin-auth")
public class AdminAuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @GetMapping("/login-with-token")
    public String loginWithToken(@RequestParam String token, HttpSession session) {
        try {
            // Xác thực token JWT
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            
            if (userId != null) {
                User user = userService.getUserById(userId);
                
                if (user != null && "admin".equals(user.getRole())) {
                    // Lưu thông tin user vào session
                    session.setAttribute("adminUser", user);
                    
                    // Thiết lập authentication trong SecurityContext
                    List<GrantedAuthority> authorities = new ArrayList<>();
                    authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                    
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        authorities
                    );
                    
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    return "redirect:/";
                }
            }
            
            // Nếu không phải admin hoặc token không hợp lệ
            return "redirect:/error?reason=unauthorized";
            
        } catch (Exception e) {
            return "redirect:/error?reason=server-error&message=" + e.getMessage();
        }
    }
}