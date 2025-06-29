package com.example.orderup.module.restaurant.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;
import org.bson.types.ObjectId;

@Data
@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private ObjectId userId;
    private ObjectId restaurantId;
    private ObjectId orderId; // Thêm orderId để liên kết review với order cụ thể
    private String comment;
    private int rating;
    private List<String> images;
    private Date createdAt;
    private Date updatedAt;
}
