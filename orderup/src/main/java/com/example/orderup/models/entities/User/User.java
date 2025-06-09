package com.example.orderup.models.entities.User;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
   
    @Field("email")
    private String email;

    @Field("password")
    private String password;

    @Field("role")
    private String role;

    @Field("profile")
    private Profile profile;

    @Field("Preferences")
    private Preferences preferences;

    @Field("addresses")
    private List<Addresses> addresses;

    @Field("paymentMethods")
    private List<PaymentMethods> paymentMethods;

    @Field("loyaltyPoints")
    private Integer loyaltyPoints;

    @Field("isActive")
    private boolean active;

    @Field("isVerified")
    private boolean verified;

    @Field("lastLogin")
    private Date lastLogin;

    @Field("createdAt")
    private Date createdAt;

    @Field("updatedAt")
    private Date updatedAt;

    public User() {
        // Default constructor
    }

    public User(String id, String email, String password, String role, Profile profile,
                Preferences preferences, List<Addresses> addresses, List<PaymentMethods> paymentMethods,
                Integer loyaltyPoints, boolean isActive, boolean isVerified, Date lastLogin,
                Date createdAt, Date updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.profile = profile;
        this.preferences = preferences;
        this.addresses = addresses;
        this.paymentMethods = paymentMethods;
        this.loyaltyPoints = loyaltyPoints;
        this.active = isActive;
        this.verified = isVerified;
        this.lastLogin = lastLogin;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean isActive) {
        this.active = isActive;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean isVerified) {
        this.verified = isVerified;
    }
}
