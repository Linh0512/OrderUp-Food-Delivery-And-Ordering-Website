package com.example.orderup.controllers.auth;

import com.example.orderup.models.entities.User.User;
import com.example.orderup.security.JwtTokenProvider;
import com.example.orderup.services.UserService;
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
            System.out.println("Attempting login with token: " + token);
            
            // Kiểm tra nếu token là undefined
            if (token == null || token.equals("undefined")) {
                System.out.println("Token is null or undefined");
                return "redirect:/error?reason=invalid-token";
            }
            
            // Xác thực token JWT
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            System.out.println("User ID from token: " + userId);
            
            if (userId != null) {
                User user = userService.getUserById(userId);
                System.out.println("User found: " + (user != null ? user.getEmail() : "null"));
                
                if (user != null && "admin".equals(user.getRole())) {
                    // Lưu thông tin user vào session
                    session.setAttribute("adminUser", user);
                    session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
                    
                    // Thiết lập authentication trong SecurityContext
                    List<GrantedAuthority> authorities = new ArrayList<>();
                    authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                    
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        authorities
                    );
                    
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    
                    System.out.println("Admin authentication successful, redirecting to /admin/users");
                    return "redirect:/admin/users";
                } else {
                    System.out.println("User is not admin or null");
                    return "redirect:/error?reason=not-admin";
                }
            } else {
                System.out.println("Invalid token, userId is null");
                return "redirect:/error?reason=invalid-token";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "redirect:/error?reason=server-error&message=" + e.getMessage();
        }
    }
}