package com.example.orderup.module.user.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.orderup.module.user.entirty.User;

@Repository
public interface UserPasswordRepository extends MongoRepository<User, String> {

    User findById(ObjectId id);

    User findByEmail(String email);
}
