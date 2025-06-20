package com.example.orderup.module.restaurant.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private String userId;
    private String restaurantId;
    private String comment;
    private int rating;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
