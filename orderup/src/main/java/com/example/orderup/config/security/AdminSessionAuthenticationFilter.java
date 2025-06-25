package com.example.orderup.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.orderup.module.user.entirty.User;

import java.io.IOException;
import java.util.Collections;

@Component
public class AdminSessionAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        // Kiểm tra nếu đã có authentication
        if (SecurityContextHolder.getContext().getAuthentication() == null ||
            !SecurityContextHolder.getContext().getAuthentication().isAuthenticated() ||
            SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals("anonymousUser")) {
            
            // Kiểm tra session
            HttpSession session = request.getSession(false);
            if (session != null) {
                User adminUser = (User) session.getAttribute("adminUser");
                
                if (adminUser != null && "admin".equals(adminUser.getRole())) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        adminUser,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("admin"))
                    );
                    
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else if (request.getRequestURI().startsWith("/admin/")) {
                    response.sendRedirect("/error?reason=unauthorized");
                    return;
                }
            } else if (request.getRequestURI().startsWith("/admin/")) {
                response.sendRedirect("/error?reason=unauthorized");
                return;
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !path.startsWith("/admin/");
    }
}