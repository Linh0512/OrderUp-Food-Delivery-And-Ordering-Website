package com.example.orderup.module.restaurant.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.orderup.module.restaurant.repository.RestaurantDetailRepository;
import com.example.orderup.module.restaurant.mapper.RestaurantDetailMapper;
import com.example.orderup.module.restaurant.dto.RestaurantDetailResponseDTO;
import com.example.orderup.module.restaurant.dto.RestaurantProfileResponseDTO;
import com.example.orderup.module.restaurant.dto.RestaurantProfileDTO;
import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.entity.Dish;
import com.example.orderup.config.security.JwtTokenProvider;

import java.util.List;
import java.util.Collections;
import org.bson.types.ObjectId;

@Service
public class RestaurantDetailService {

    @Autowired
    private RestaurantDetailRepository restaurantDetailRepository;
    
    @Autowired
    private RestaurantDetailMapper restaurantDetailMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public RestaurantDetailResponseDTO getRestaurantDetail(String restaurantId, String token) {
        String userId = null;
        if (token != null) {
            userId = jwtTokenProvider.getUserIdFromToken(token);
        }

        // Lấy thông tin nhà hàng
        Restaurant restaurant = restaurantDetailRepository.findRestaurantById(restaurantId);
        if (restaurant == null) {
            throw new RuntimeException("Không tìm thấy nhà hàng với id: " + restaurantId);
        }
    
        // Lấy danh sách món ăn
        List<Dish> dishes = restaurantDetailRepository.findDishesByRestaurantId(new ObjectId(restaurantId));
        
        // Nếu không có món ăn, trả về danh sách rỗng
        if (dishes == null) {
            dishes = Collections.emptyList();
        }
    
        return restaurantDetailMapper.toRestaurantDetailResponseDTO(restaurant, dishes, userId);
    }

    public RestaurantProfileResponseDTO getRestaurantProfile(String restaurantId, String token) {
        try {
            String userId = null;
            if (token != null) {
                userId = jwtTokenProvider.getUserIdFromToken(token);
            }

            Restaurant restaurant = restaurantDetailRepository.findRestaurantById(restaurantId);
            if (restaurant == null) {
                throw new RuntimeException("Không tìm thấy nhà hàng với id: " + restaurantId);
            }

            return restaurantDetailMapper.toRestaurantProfileResponseDTO(restaurant, userId);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lấy thông tin nhà hàng: " + e.getMessage());
        }
    }

    public RestaurantProfileResponseDTO updateRestaurantProfile(String restaurantId, 
        RestaurantProfileDTO restaurantProfileDTO, String token) {
        try {
            String userId = null;
            if (token != null) {
                userId = jwtTokenProvider.getUserIdFromToken(token);
            } else {
                throw new RuntimeException("Bạn cần đăng nhập để thực hiện thao tác này");
            }
    
            Restaurant restaurant = restaurantDetailRepository.findRestaurantById(restaurantId);
            if (restaurant == null) {
                throw new RuntimeException("Không tìm thấy nhà hàng với id: " + restaurantId);
            }

            // Kiểm tra quyền - chỉ chủ nhà hàng mới được cập nhật
            if (!restaurant.getHostId().equals(userId)) {
                throw new RuntimeException("Bạn không có quyền cập nhật thông tin nhà hàng này");
            }

            // Cập nhật thông tin cơ bản của nhà hàng
            if (restaurant.getBasicInfo() == null) {
                restaurant.setBasicInfo(new Restaurant.BasicInfo());
            }
            restaurant.getBasicInfo().setName(restaurantProfileDTO.getRestaurantName());
            restaurant.getBasicInfo().setImages(restaurantProfileDTO.getRestaurantImages());
            restaurant.getBasicInfo().setDescription(restaurantProfileDTO.getRestaurantDescription());
            restaurant.getBasicInfo().setEmail(restaurantProfileDTO.getRestaurantEmail());
            restaurant.getBasicInfo().setWebsite(restaurantProfileDTO.getRestaurantWebsite());
            restaurant.getBasicInfo().setPhone(restaurantProfileDTO.getRestaurantPhone());
            restaurant.getBasicInfo().setPriceRange(restaurantProfileDTO.getRestaurantPriceRange());

            // Cập nhật địa chỉ
            if (restaurant.getAddress() == null) {
                restaurant.setAddress(new Restaurant.Address());
            }
            restaurant.getAddress().setFullAddress(restaurantProfileDTO.getRestaurantAddress());

            // Cập nhật thông tin giao hàng
            if (restaurant.getDelivery() == null) {
                restaurant.setDelivery(new Restaurant.DeliveryInfo());
            }
            
            // Xử lý và chuyển đổi kiểu dữ liệu cho thông tin giao hàng
            String radiusStr = restaurantProfileDTO.getRestaurantDeliveryRadius().replaceAll("[^0-9.]", "");
            String timeStr = restaurantProfileDTO.getRestaurantDeliveryTime().replaceAll("[^0-9]", "");
            String feeStr = restaurantProfileDTO.getRestaurantDeliveryFee().replaceAll("[^0-9.]", "");

            restaurant.getDelivery().setDeliveryRadius((int) Math.round(Double.parseDouble(radiusStr)));
            restaurant.getDelivery().setEstimatedDeliveryTime(Integer.parseInt(timeStr));
            restaurant.getDelivery().setDeliveryFee(Double.parseDouble(feeStr));
            restaurant.getDelivery().setDeliveryAvailable(restaurantProfileDTO.isRestaurantDeliveryAvailable());

            // Cập nhật trạng thái hoạt động
            restaurant.setActive(restaurantProfileDTO.isRestaurantIsActive());

            // Cập nhật giờ làm việc
            if (restaurantProfileDTO.getOperatingHours() != null && !restaurantProfileDTO.getOperatingHours().isEmpty()) {
                restaurant.setOperatingHours(restaurantProfileDTO.getOperatingHours());
            }

            // Lưu vào database
            restaurant = restaurantDetailRepository.save(restaurant);
    
            return restaurantDetailMapper.toRestaurantProfileResponseDTO(restaurant, userId);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi cập nhật thông tin nhà hàng: " + e.getMessage());
        }
    }

    public boolean isRestaurantExists(String restaurantId) {
        Restaurant restaurant = restaurantDetailRepository.findRestaurantById(restaurantId);
        return restaurant != null;
    }

    public Restaurant save(Restaurant restaurant) {
        return restaurantDetailRepository.save(restaurant);
    }
}
