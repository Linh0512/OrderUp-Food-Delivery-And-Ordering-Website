package com.example.orderup.config.security;

import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        System.out.println("JWT Filter processing: " + path);

        String token = extractTokenFromRequest(request);
        System.out.println("Extracted token: " + (token != null ? "Found" : "Not found"));

        if (token != null && jwtTokenProvider.isTokenValid(token)) {
            String email = jwtTokenProvider.getEmailFromToken(token);
            System.out.println("Token email: " + email);
            
            // Lấy thông tin user từ database
            User user = userService.findByEmail(email);
            
            if (user != null && user.isActive()) {
                System.out.println("Setting authentication for user: " + user.getEmail() + " with role: " + user.getRole());
                
                // Tạo authority từ role với prefix ROLE_
                String roleWithPrefix = "ROLE_" + user.getRole();
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleWithPrefix);
                
                // Tạo authentication object
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(user, null, Collections.singletonList(authority));
                
                // Set vào security context
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                // Cập nhật last login
                user.setLastLogin(new java.util.Date());
                userService.updateUser(user);
            } else {
                System.out.println("User not found or inactive");
    }
        } else {
            System.out.println("Token invalid or not found");
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        // Lấy token từ header Authorization
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            System.out.println("Found Bearer token in header");
            return bearerToken.substring(7);
        }

        // Lấy token từ cookie (cho admin pages)
        System.out.println("Checking cookies for JWT token...");
        if (request.getCookies() != null) {
            System.out.println("Found " + request.getCookies().length + " cookies:");
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                System.out.println("Cookie: " + cookie.getName() + " = " + (cookie.getValue().length() > 20 ? cookie.getValue().substring(0, 20) + "..." : cookie.getValue()));
                if ("jwt".equals(cookie.getName())) {
                    System.out.println("Found JWT token in cookie: " + cookie.getValue().substring(0, Math.min(20, cookie.getValue().length())) + "...");
                    return cookie.getValue();
                }
            }
        } else {
            System.out.println("No cookies found in request");
        }

        System.out.println("No token found in header or cookies");
        return null;
            }
            
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        boolean shouldSkip = path.startsWith("/api/auth/") || 
               path.startsWith("/api/admin-auth/") ||
               path.startsWith("/api/public/") ||
               path.startsWith("/api/shop/") ||
               path.startsWith("/api/dish/") ||
               path.startsWith("/api/review/") ||
               path.equals("/") ||
               path.equals("/error") ||
               path.startsWith("/css/") ||
               path.startsWith("/js/") ||
               path.startsWith("/images/") ||
               path.startsWith("/webjars/");
        
        System.out.println("Should skip JWT filter for " + path + ": " + shouldSkip);
        return shouldSkip;
    }
}