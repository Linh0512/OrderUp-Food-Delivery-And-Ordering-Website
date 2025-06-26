package com.example.orderup.module.voucher.repository;

import com.example.orderup.module.voucher.entity.Voucher;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VoucherRepository extends MongoRepository<Voucher, String> {
    
    // Tìm voucher theo type
    List<Voucher> findByType(String type);

    // Tìm voucher theo code
    Voucher findByCode(String code);
    
    // Tìm voucher theo nhà hàng
    List<Voucher> findByRestaurantId(String restaurantId);
    
    // Tìm voucher hợp lệ cho user
    @Query("{ 'isActive': true, 'remainingValue': { $gt: 0 }, 'validity.expiresAt': { $gt: ?0 }, $or: [ { 'type': 'GLOBAL' }, { 'restaurantId': ?1 } ] }")
    List<Voucher> findValidVouchersForUser(LocalDateTime now, String restaurantId);
    
    // Tìm voucher theo type và restaurantId
    List<Voucher> findByTypeAndRestaurantId(String type, String restaurantId);
    
    // Kiểm tra code đã tồn tại chưa
    boolean existsByCode(String code);
} 