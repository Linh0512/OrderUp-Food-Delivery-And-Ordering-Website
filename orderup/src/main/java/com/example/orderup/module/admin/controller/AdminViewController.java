package com.example.orderup.module.admin.controller;

import com.example.orderup.config.security.JwtTokenProvider;
import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminViewController {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String adminDashboard(HttpServletRequest request, Model model) {
        try {
            System.out.println("AdminViewController.adminDashboard() called");
            
            // Kiểm tra authentication thông qua SecurityContext trước
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof User) {
                User user = (User) auth.getPrincipal();
                if ("admin".equals(user.getRole()) && user.isActive()) {
                    System.out.println("Admin authenticated via SecurityContext: " + user.getEmail());
                    model.addAttribute("adminUser", user);
                    return "index";
                }
            }
            
            // Kiểm tra JWT token từ cookie nếu SecurityContext không có
            String token = getJwtTokenFromCookies(request);
            System.out.println("Admin dashboard access - Token found: " + (token != null ? "Yes" : "No"));
            
            if (token != null && jwtTokenProvider.isTokenValid(token)) {
                String email = jwtTokenProvider.getEmailFromToken(token);
                User user = userService.findByEmail(email);
                
                if (user != null && "admin".equals(user.getRole()) && user.isActive()) {
                    System.out.println("Admin authenticated via JWT: " + user.getEmail());
                    model.addAttribute("adminUser", user);
                    return "index";
                }
            }
            
            System.out.println("Admin access denied - redirecting to login");
            return "redirect:http://localhost:5173/login";
        } catch (Exception e) {
            System.err.println("Error in adminDashboard: " + e.getMessage());
            e.printStackTrace();
            return "redirect:http://localhost:5173/login";
        }
    }
    
    public boolean isAdminAuthenticated(HttpServletRequest request) {
        String token = getJwtTokenFromCookies(request);
        
        if (token != null && jwtTokenProvider.isTokenValid(token)) {
            String email = jwtTokenProvider.getEmailFromToken(token);
            User user = userService.findByEmail(email);
            
            return user != null && "admin".equals(user.getRole()) && user.isActive();
        }
        
        return false;
    }
    
    private String getJwtTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    System.out.println("Found JWT cookie in admin view: " + cookie.getValue().substring(0, Math.min(20, cookie.getValue().length())) + "...");
                    return cookie.getValue();
                }
            }
        }
        System.out.println("No JWT cookie found in admin view");
        return null;
    }
} 