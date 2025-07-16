package com.example.orderup.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthorizationFilter jwtAuthorizationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .authorizeHttpRequests(authz -> authz
                // Cho phép các endpoint public
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin-auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/shop/**").permitAll()
                .requestMatchers("/api/dish/**").permitAll()
                .requestMatchers("/api/review/**").permitAll()
                
                // Admin pages - sử dụng hasRole thay vì hasAuthority
                .requestMatchers("/admin/**").hasRole("admin")
                
                // Static resources
                .requestMatchers("/", "/error").permitAll()
                .requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**").permitAll()
                
                // API endpoints cần authentication
                .requestMatchers("/api/user/**").authenticated()
                .requestMatchers("/api/order/**").authenticated() 
                .requestMatchers("/api/admin/**").hasRole("admin")
                
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    String requestURI = request.getRequestURI();
                    System.out.println("Authentication failed for URI: " + requestURI);
                    System.out.println("Authentication: " + SecurityContextHolder.getContext().getAuthentication());
                    
                    if (requestURI.startsWith("/admin/")) {
                        // Redirect to frontend login for admin pages
                        response.sendRedirect("http://localhost:5173/login");
                    } else {
                        // Return 401 for API endpoints
                        response.setStatus(401);
                        response.getWriter().write("Unauthorized");
                    }
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    String requestURI = request.getRequestURI();
                    System.out.println("Access denied for URI: " + requestURI);
                    System.out.println("Authentication: " + SecurityContextHolder.getContext().getAuthentication());
                    
                    if (requestURI.startsWith("/admin/")) {
                        response.sendRedirect("http://localhost:5173/login");
                    } else {
                        response.setStatus(403);
                        response.getWriter().write("Access Denied");
                    }
                })
            );
            
        return http.build();
    }
}