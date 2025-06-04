package com.example.orderup.repositories;

import java.util.List;
import java.util.Date;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.orderup.models.Comment;

public interface CommentRepository  extends MongoRepository<Comment, String> {
    List<Comment> findByName(String name);

    List<Comment> findByEmail(String email);

    List<Comment> findByMovieId(String movieId);

    @Query("{ 'text' : { $regex: ?0, $options: 'i' } }")
    List<Comment> findByTextContaining(String text);

    List<Comment> findByDateBetween(Date startDate, Date endDate);

    List<Comment> findByNameAndMovieId(String name, String movie_id);
}
