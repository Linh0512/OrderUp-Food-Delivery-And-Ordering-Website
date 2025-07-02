package com.example.orderup.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.service.UserService;

import java.io.IOException;
import java.util.Collections;

@Component
public class AdminSessionAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        
        // Nếu là đường dẫn admin, bắt buộc phải có session và quyền admin
        if (path.startsWith("/admin/")) {
            HttpSession session = request.getSession(false);
            
            // Kiểm tra session tồn tại
            if (session == null) {
                handleUnauthorized(request, response);
                return;
            }
            
            // Lấy user từ session
            User adminUser = (User) session.getAttribute("adminUser");
            
            // Kiểm tra user và role
            if (adminUser == null || !"admin".equals(adminUser.getRole()) || !adminUser.isActive()) {
                handleUnauthorized(request, response);
                return;
            }
            
            // Kiểm tra thời gian tạo session
            long sessionCreationTime = session.getCreationTime();
            long currentTime = System.currentTimeMillis();
            long sessionTimeout = 30 * 60 * 1000; // 30 phút

            if (currentTime - sessionCreationTime > sessionTimeout) {
                session.invalidate();
                handleUnauthorized(request, response);
                return;
            }

            // Kiểm tra email từ token nếu có
            String tokenEmail = null;
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                if (principal instanceof User) {
                    tokenEmail = ((User) principal).getEmail();
                }
            }

            // Nếu có email từ token, kiểm tra xem có khớp với email trong session không
            if (tokenEmail != null && !tokenEmail.equals(adminUser.getEmail())) {
                session.invalidate();
                handleUnauthorized(request, response);
                return;
            }

            // Cập nhật lại thời gian truy cập gần nhất
            adminUser.setLastLogin(new java.util.Date());
            userService.updateUser(adminUser);
            
            // Set authentication nếu chưa có
            if (SecurityContextHolder.getContext().getAuthentication() == null ||
                !SecurityContextHolder.getContext().getAuthentication().isAuthenticated() ||
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals("anonymousUser")) {
                
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    adminUser,
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("admin"))
                );
                
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    private void handleUnauthorized(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Nếu là request đến template HTML, redirect về trang login
        if (!request.getHeader("Accept").contains("application/json")) {
            // Xóa session hiện tại nếu có
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            response.sendRedirect("http://localhost:5173/login");
            return;
        }
        
        // Nếu là API request, trả về lỗi 401
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Unauthorized: Admin access required");
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !path.startsWith("/admin/");
    }
}