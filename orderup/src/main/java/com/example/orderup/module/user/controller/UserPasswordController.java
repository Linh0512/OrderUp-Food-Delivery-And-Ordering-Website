package com.example.orderup.module.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;
import com.example.orderup.config.security.JwtTokenProvider;

import com.example.orderup.module.user.dto.ForgotPasswordDTO;
import com.example.orderup.module.user.dto.UpdatePasswordDTO;
import com.example.orderup.module.user.service.UserPasswordService;

@RestController
@RequestMapping("/api/users/password")
public class UserPasswordController {

    private static final Logger logger = LoggerFactory.getLogger(UserPasswordController.class);

    @Autowired
    private UserPasswordService userPasswordService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/update")
    public ResponseEntity<?> updateUserPassword(
            HttpServletRequest request,
            @RequestBody UpdatePasswordDTO updatePasswordDTO) {
        try {
            // Lấy token từ header
            String bearerToken = request.getHeader("Authorization");
            if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Không tìm thấy token xác thực");
            }

            // Tách token từ Bearer
            String token = bearerToken.substring(7);
            
            // Lấy userId từ token
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            if (userId == null) {
                logger.error("Token không hợp lệ");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token không hợp lệ");
            }

            // Gọi service để cập nhật mật khẩu
            String result = userPasswordService.updateUserPassword(
                userId,
                updatePasswordDTO.getOldPassword(),
                updatePasswordDTO.getNewPassword(),
                updatePasswordDTO.getConfirmNewPassword()
            );
            
            if (result == null) {
                // Lấy thông báo lỗi từ service thông qua logger
                String errorMessage = logger.getName();
                return ResponseEntity.badRequest()
                    .body(errorMessage);
            }
            
            return ResponseEntity.ok()
                .body("Cập nhật mật khẩu thành công");
        } catch (Exception e) {
            logger.error("Error updating user password: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body("Có lỗi xảy ra khi cập nhật mật khẩu: " + e.getMessage());
        }
    }


    @GetMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        try {
            String password = userPasswordService.getUserPasswordByEmail(forgotPasswordDTO.getEmail());
            if (password == null) {
                return ResponseEntity.badRequest().body("Không tìm thấy mật khẩu");
            }
            return ResponseEntity.ok(password);
        } catch (Exception e) {
            logger.error("Error getting user password by email: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }
}
