package com.example.orderup.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.orderup.module.user.entirty.User;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret:defaultSecretKeyThatIsAtLeast32CharactersLong}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("email", user.getEmail());
        
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        var key = Keys.hmacShaKeyFor(keyBytes);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getId())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            var key = Keys.hmacShaKeyFor(keyBytes);
            
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
                
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        try {
            byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            var key = Keys.hmacShaKeyFor(keyBytes);
            
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
                
            return claims.get("email", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    private String extractToken(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return bearerToken;
    }

    public String getUserIdFromToken(String bearerToken) {
        try {
            String token = extractToken(bearerToken);
            if (token == null) {
                return null;
            }
            byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            var key = Keys.hmacShaKeyFor(keyBytes);
            
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
            
            return claims.getSubject();
        } catch (Exception e) {
            e.printStackTrace();
            return null; // Token không hợp lệ hoặc đã hết hạn
        }
    }

    public String getRoleFromToken(String bearerToken) {
        try {
            String token = extractToken(bearerToken);
            if (token == null) {
                return null;
            }
            byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            var key = Keys.hmacShaKeyFor(keyBytes);
            
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
            return claims.get("role", String.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}