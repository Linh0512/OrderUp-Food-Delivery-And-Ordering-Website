package com.example.orderup.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.orderup.config.security.AdminSessionAuthenticationFilter;
import com.example.orderup.config.security.JwtAuthorizationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthorizationFilter jwtAuthorizationFilter;

    @Autowired
    private AdminSessionAuthenticationFilter adminSessionAuthenticationFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http)) // Thêm CORS configuration
            // API endpoints sử dụng JWT
            .securityMatcher("/api/**")
            .authorizeHttpRequests(authz -> authz
                // Cho phép các endpoint public trước
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin-auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/shop/**").permitAll()

                .requestMatchers("/api/dish/**").permitAll()
                .requestMatchers("/api/review/**").permitAll()
                // Chỉ các endpoint khác mới cần authentication
                .requestMatchers("/api/user/**").authenticated()
                .requestMatchers("/api/order/**").authenticated()
                .requestMatchers("/api/admin/**").authenticated()
                .anyRequest().permitAll() // Thay đổi từ authenticated() thành permitAll()
            )
            .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
            
        return http.build();
    }

    @Bean
    public SecurityFilterChain webSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/admin/**", "/", "/error")
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/admin/view/api/**")) // Disable CSRF cho các API admin
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**").permitAll()
                .requestMatchers("/admin/**").hasAuthority("admin")
            )
            .addFilterBefore(adminSessionAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .formLogin(form -> form
                .loginPage("/admin/login")
                .permitAll()
            );
            
        return http.build();
    }
}