package com.example.orderup.module.restaurant.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private String customerId;
    private String restaurantId;
    private int rating;
    private String userComment;
    private List<String> images;
    private String restaurantReply;
    private LocalDateTime replyDate;
    private int likes;
    private boolean isActive;
    private boolean isEdited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public boolean isEdited() {
        return isEdited;
    }

    public void setEdited(boolean isEdited) {
        this.isEdited = isEdited;
    }
}
