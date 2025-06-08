package com.example.orderup.repositories;

import java.util.Date;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.orderup.models.entities.User.User;

public interface UserRepository  extends MongoRepository<User, String> {

    List<User> getByEmail(String email);

    @Query("{ 'profile.phone': ?0 }")
    List<User> getByPhone(String phone);

    @Query("{ '$or': [ { 'profile.firstName': { $regex: ?0, $options: 'i' } }, { 'profile.lastName': { $regex: ?0, $options: 'i' } } ] }")
    List<User> getByUserName(String userName);

    long countByCreatedAtGreaterThan(Date date);

    long countByLastLoginBetween(Date startDate, Date endDate);

    long countByRole(String role);

    // List<User> findByName(String name);

    // List<User> findByMovieId(String movieId);

    // @Query("{ 'text' : { $regex: ?0, $options: 'i' } }")
    // List<User> findByTextContaining(String text);

    // List<User> findByDateBetween(Date startDate, Date endDate);

    // List<User> findByNameAndMovieId(String name, String movie_id);
}
