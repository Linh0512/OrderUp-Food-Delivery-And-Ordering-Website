package com.example.orderup.module.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.bson.types.ObjectId;
import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.repository.UserPasswordRepository;

@Service
public class UserPasswordService {
    private static final Logger logger = LoggerFactory.getLogger(UserPasswordService.class);
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private UserPasswordRepository userPasswordRepository;

    public String updateUserPassword(String id, String oldPassword, String newPassword, String confirmPassword) {
        // Tìm user theo id
        Query query = new Query(Criteria.where("_id").is(new ObjectId(id)));
        User user = mongoTemplate.findOne(query, User.class, "users");
        if (user == null) {
            logger.error("User not found with id: {}", id);
            return null;
        }

        // Kiểm tra mật khẩu cũ
        if (!oldPassword.equals(user.getPassword())) {
            logger.error("Old password is incorrect for user: {}", id);
            return null;
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (!newPassword.equals(confirmPassword)) {
            logger.error("New password and confirm password do not match for user: {}", id);
            return null;
        }

        // Kiểm tra mật khẩu mới không được giống mật khẩu cũ
        if (newPassword.equals(user.getPassword())) {
            logger.error("New password must be different from old password for user: {}", id);
            return null;
        }

        try {
            // Cập nhật mật khẩu mới
            Query query1 = new Query(Criteria.where("_id").is(new ObjectId(id)));
            Update update = new Update().set("password", newPassword);
            User updatedUser = mongoTemplate.findAndModify(query1, update, User.class, "users");
            
            if (updatedUser != null) {
                return "success";
            }
            return null;
        } catch (Exception e) {
            logger.error("Error updating password for user: {}, error: {}", id, e.getMessage());
            return null;
        }
    }

    public String getUserPasswordByEmail(String email) {
        Query query = new Query(Criteria.where("email").is(email));
        try {
            User user = mongoTemplate.findOne(query, User.class, "users");
            return user.getPassword();
        } catch (Exception e) {
            logger.error("Error getting user password by email: {}", e.getMessage());
            return null;
        }
    }
}
