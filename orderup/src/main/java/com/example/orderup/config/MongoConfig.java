package com.example.orderup.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.example.orderup")
public class MongoConfig {
    // Không sử dụng bất kỳ custom converters nào
    // Tất cả entities sử dụng kiểu dữ liệu chuẩn MongoDB
} 