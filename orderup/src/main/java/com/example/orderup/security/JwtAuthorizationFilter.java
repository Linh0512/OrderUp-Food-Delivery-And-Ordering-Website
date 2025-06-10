package com.example.orderup.security;

import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret:defaultSecretKeyThatIsAtLeast32CharactersLong}")
    private String jwtSecret;

    @Autowired
    private UserService userService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        
        // Danh sách các đường dẫn công khai không cần xác thực
        return path.startsWith("/api/auth/") ||
            path.startsWith("/admin/") || 
            path.equals("/") || 
            path.startsWith("/swagger-ui") ||
            path.startsWith("/v3/api-docs") ||
            path.startsWith("/error");
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain chain
    ) throws ServletException, IOException {
           
        // // Kiểm tra token cho tất cả các API khác
        // String authHeader = request.getHeader("Authorization");
        // if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        //     response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        //     response.getWriter().write("Unauthorized: Missing or invalid token");
        //     return;
        // }
        
        // try {
        //     // Trích xuất token từ header (loại bỏ "Bearer ")
        //     String token = authHeader.substring(7);
            
        //     // Tạo secret key từ string
        //     byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        //     var key = Keys.hmacShaKeyFor(keyBytes);
            
        //     // Xác thực token và trích xuất thông tin
        //     Claims claims = Jwts.parserBuilder()
        //         .setSigningKey(key)
        //         .build()
        //         .parseClaimsJws(token)
        //         .getBody();
            
        //     // Kiểm tra token có hết hạn chưa
        //     if (claims.getExpiration().before(new Date())) {
        //         response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        //         response.getWriter().write("Unauthorized: Token expired");
        //         return;
        //     }
            
        //     // Lấy userId và role từ claims
        //     String userId = claims.getSubject();
        //     String role = claims.get("role", String.class);
            
        //     // Tìm user tương ứng trong database
        //     // Sử dụng getByEmail nếu đã có sẵn và có thể lấy email từ token
        //     User user = userService.getByEmail(claims.get("email", String.class));
        //     // Hoặc nếu đã thêm method findById
        //     // User user = userService.findById(userId);
            
        //     if (user == null || !user.isActive()) {
        //         response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        //         response.getWriter().write("Unauthorized: User not found or inactive");
        //         return;
        //     }
            
        //     // Tạo đối tượng Authentication cho Spring Security
        //     UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
        //         userId,
        //         null,
        //         Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
        //     );
            
        //     // Thiết lập đối tượng Authentication vào Security Context
        //     SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Tiếp tục chuỗi filter
            chain.doFilter(request, response);
        // } catch (Exception e) {
        //     e.printStackTrace();
        //     response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        //     response.getWriter().write("Unauthorized: Invalid token");
        // }
    }
}