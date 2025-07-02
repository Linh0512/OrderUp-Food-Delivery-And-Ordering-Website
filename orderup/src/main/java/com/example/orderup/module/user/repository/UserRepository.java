package com.example.orderup.module.user.repository;

import java.util.Date;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.orderup.module.user.entirty.User;

public interface UserRepository  extends MongoRepository<User, String> {

    @Query("{ 'email': ?0 }")
    User findByEmail(String email);

    @Query("{ 'email': { $regex: ?0, $options: 'i' } }")
    List<User> getByEmail(String email);

    @Query("{ 'profile.phone': ?0 }")
    List<User> getByPhone(String phone);

    @Query("{ '$or': [ { 'profile.firstName': { $regex: ?0, $options: 'i' } }, { 'profile.lastName': { $regex: ?0, $options: 'i' } } ] }")
    List<User> getByUserName(String userName);

    @Query("{ 'role': ?0 }")
    List<User> findByRole(String role);

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
