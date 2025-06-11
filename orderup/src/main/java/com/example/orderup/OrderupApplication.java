package com.example.orderup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.example.orderup.config.security.JwtTokenProvider;


@SpringBootApplication
public class OrderupApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrderupApplication.class, args);
	}
	@Bean
    public JwtTokenProvider jwtTokenProvider() {
        return new JwtTokenProvider();
    }
}
