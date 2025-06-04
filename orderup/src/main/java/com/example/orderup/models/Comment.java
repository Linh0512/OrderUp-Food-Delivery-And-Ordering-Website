package com.example.orderup.models;

import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;
import java.util.Date;

@Data
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String name;
    private String email;
    @Field("movie_id")
    private String movieId;
    private String text;
    private Date date;

    public Comment() {
        // Default constructor
    }

    public Comment(String name, String email, String movieId, String text, Date date) {
        this.name = name;
        this.email = email;
        this.movieId = movieId;
        this.text = text;
        this.date = date;
    }
}
