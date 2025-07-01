package com.example.orderup.module.user.service;

import org.springframework.stereotype.Service;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class OrderNumberGenerator {
    private static final String PREFIX = "Or_";
    private final AtomicInteger sequence = new AtomicInteger(1);
    private final Random random = new Random();

    public String generateOrderNumber() {
        // Tạo số ngẫu nhiên 6 chữ số
        int randomNum = random.nextInt(900000) + 100000; // Đảm bảo luôn có 6 chữ số
        
        // Kết hợp với sequence để đảm bảo không trùng lặp
        int currentSequence = sequence.getAndIncrement();
        if (sequence.get() > 999999) {
            sequence.set(1); // Reset sequence khi đạt giới hạn
        }
        
        // Kết hợp random và sequence để tạo số cuối cùng
        int finalNumber = (randomNum + currentSequence) % 1000000;
        
        // Format số thành chuỗi 6 chữ số
        return PREFIX + String.format("%06d", finalNumber);
    }
} 