package com.example.orderup.module.user.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.orderup.module.user.entirty.Profile;
import com.example.orderup.module.user.entirty.User;

@Repository
public class UserProfileRepository {
    @Autowired
    private MongoTemplate mongoTemplate;

    public User findByUserId(String userId) {
        Query query = new Query(Criteria.where("_id").is(userId));
        return mongoTemplate.findOne(query, User.class, "users");
    }

    public Profile updateUserProfileById(String userId, Profile profile) {
        Query query = new Query(Criteria.where("_id").is(userId));
        Update update = new Update().set("profile", profile);
        User updatedUser = mongoTemplate.findAndModify(query, update, User.class, "users");
        return updatedUser != null ? updatedUser.getProfile() : null;
    }
}
