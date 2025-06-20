package com.example.orderup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.example.orderup.config.security.JwtTokenProvider;

import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
public class OrderupApplication {

	public static void main(String[] args) {
		try {
            Dotenv dotenv = Dotenv.load();
            dotenv.entries().forEach(entry -> 
                System.setProperty(entry.getKey(), entry.getValue())
            );
        } catch (Exception e) {
            System.out.println("No .env file found or error loading it");
        }
		SpringApplication.run(OrderupApplication.class, args);
	}
	@Bean
    public JwtTokenProvider jwtTokenProvider() {
        return new JwtTokenProvider();
    }
}
