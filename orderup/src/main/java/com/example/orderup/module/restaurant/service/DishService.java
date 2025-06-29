package com.example.orderup.module.restaurant.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.orderup.module.restaurant.repository.DishRepository;
import com.example.orderup.module.restaurant.repository.RestaurantDetailRepository;
import com.example.orderup.module.restaurant.mapper.DishMapper;
import com.example.orderup.module.restaurant.dto.DishListResponseDTO;
import com.example.orderup.module.restaurant.dto.DishThumbDTO;
import com.example.orderup.module.restaurant.dto.DishDetailDTO;
import com.example.orderup.module.restaurant.entity.Dish;
import com.example.orderup.module.restaurant.entity.Restaurant;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Date;
import org.bson.types.ObjectId;
import java.util.ArrayList;

@Service
public class DishService {
    
    @Autowired
    private DishRepository dishRepository;
    
    @Autowired
    private RestaurantDetailRepository restaurantRepository;
    
    @Autowired
    private DishMapper dishMapper;
    
    public DishListResponseDTO getDishesByRestaurantId(String restaurantId) {
        Restaurant restaurant = restaurantRepository.findRestaurantById(restaurantId);
        if (restaurant == null) {
            throw new RuntimeException("Không tìm thấy nhà hàng với id: " + restaurantId);
        }
        
        ObjectId restaurantObjectId = new ObjectId(restaurantId);
        List<Dish> dishes = dishRepository.findByRestaurantId(restaurantObjectId);
        List<DishThumbDTO> dishDTOs = dishes.stream()
                .map(dish -> dishMapper.toDishThumbDTO(dish, restaurant))
                .collect(Collectors.toList());
                
        return DishListResponseDTO.builder()
                .count(dishDTOs.size())
                .data(dishDTOs)
                .build();
    }
    
    public DishDetailDTO getDishById(String dishId) {
        Dish dish = dishRepository.findById(dishId);
        if (dish == null) {
            throw new RuntimeException("Không tìm thấy món ăn với id: " + dishId);
        }
        
        Restaurant restaurant = restaurantRepository.findRestaurantById(dish.getRestaurantId().toString());
        return dishMapper.toDishDetailDTO(dish, restaurant);
    }

    public DishDetailDTO addDish(DishDetailDTO dishDTO) {
        // Kiểm tra restaurant tồn tại
        Restaurant restaurant = restaurantRepository.findRestaurantById(dishDTO.getRestaurantId());
        if (restaurant == null) {
            throw new RuntimeException("Không tìm thấy nhà hàng với id: " + dishDTO.getRestaurantId());
        }

        // Tạo mới dish entity
        Dish dish = new Dish();
        
        // Set basic info
        Dish.BasicInfo basicInfo = new Dish.BasicInfo();
        basicInfo.setName(dishDTO.getName());
        basicInfo.setDescription(dishDTO.getDescription());
        basicInfo.setImages(dishDTO.getImages());
        basicInfo.setTags(dishDTO.getTags() != null ? dishDTO.getTags() : new ArrayList<>());
        dish.setBasicInfo(basicInfo);
        
        // Set pricing
        Dish.Pricing pricing = new Dish.Pricing();
        pricing.setBasePrice(dishDTO.getBasePrice());
        pricing.setDiscountPrice(dishDTO.getDiscountPrice());
        pricing.setDiscounted(dishDTO.isDiscounted());
        dish.setPricing(pricing);

        // Set options nếu có
        if (dishDTO.getOptions() != null && !dishDTO.getOptions().isEmpty()) {
            List<Dish.Option> options = dishDTO.getOptions().stream()
                .map(optionDTO -> {
                    Dish.Option option = new Dish.Option();
                    option.setName(optionDTO.getName());
                    option.setType(optionDTO.getType());
                    option.setRequired(optionDTO.isRequired());
                    
                    if (optionDTO.getChoices() != null) {
                        List<Dish.Choice> choices = optionDTO.getChoices().stream()
                            .map(choiceDTO -> {
                                Dish.Choice choice = new Dish.Choice();
                                choice.setName(choiceDTO.getName());
                                choice.setPrice(choiceDTO.getPrice());
                                choice.setDefault(choiceDTO.isDefault());
                                return choice;
                            })
                            .collect(Collectors.toList());
                        option.setChoices(choices);
                    }
                    return option;
                })
                .collect(Collectors.toList());
            dish.setOptions(options);
        }
        
        // Set restaurant ID and other fields
        dish.setRestaurantId(new ObjectId(dishDTO.getRestaurantId()));
        dish.setPreparationTime(dishDTO.getPreparationTime());
        dish.setActive(true);
        dish.setCreatedAt(new Date());
        dish.setUpdatedAt(new Date());
        
        // Lưu vào dishes collection
        Dish savedDish = dishRepository.addDish(dish);
        return dishMapper.toDishDetailDTO(savedDish, restaurant);
    }

    public DishDetailDTO updateDish(DishDetailDTO dishDTO) {
        try {
            if (dishDTO.getId() == null) {
                throw new IllegalArgumentException("ID món ăn không được để trống");
            }

            Dish existingDish = dishRepository.findById(dishDTO.getId());
            if (existingDish == null) {
                throw new IllegalArgumentException("Không tìm thấy món ăn với id: " + dishDTO.getId() + " hoặc id không hợp lệ");
            }

            // Update basic info
            if (existingDish.getBasicInfo() == null) {
                existingDish.setBasicInfo(new Dish.BasicInfo());
            }
            Dish.BasicInfo basicInfo = existingDish.getBasicInfo();
            if (dishDTO.getName() != null) {
                basicInfo.setName(dishDTO.getName());
            }
            if (dishDTO.getDescription() != null) {
                basicInfo.setDescription(dishDTO.getDescription());
            }
            if (dishDTO.getImages() != null) {
                basicInfo.setImages(dishDTO.getImages());
            }
            if (dishDTO.getTags() != null) {
                basicInfo.setTags(dishDTO.getTags());
            }
            existingDish.setBasicInfo(basicInfo);
            
            // Update pricing
            if (existingDish.getPricing() == null) {
                existingDish.setPricing(new Dish.Pricing());
            }
            Dish.Pricing pricing = existingDish.getPricing();
            if (dishDTO.getBasePrice() > 0) {
                pricing.setBasePrice(dishDTO.getBasePrice());
            }
            if (dishDTO.getDiscountPrice() > 0) {
                pricing.setDiscountPrice(dishDTO.getDiscountPrice());
            }
            pricing.setDiscounted(dishDTO.isDiscounted());
            existingDish.setPricing(pricing);

            existingDish.setActive(dishDTO.isActive());
            
            // Update options nếu có
            if (dishDTO.getOptions() != null && !dishDTO.getOptions().isEmpty()) {
                List<Dish.Option> options = dishDTO.getOptions().stream()
                    .map(optionDTO -> {
                        Dish.Option option = new Dish.Option();
                        option.setName(optionDTO.getName());
                        option.setType(optionDTO.getType());
                        option.setRequired(optionDTO.isRequired());
                        
                        if (optionDTO.getChoices() != null) {
                            List<Dish.Choice> choices = optionDTO.getChoices().stream()
                                .map(choiceDTO -> {
                                    Dish.Choice choice = new Dish.Choice();
                                    choice.setName(choiceDTO.getName());
                                    choice.setPrice(choiceDTO.getPrice());
                                    choice.setDefault(choiceDTO.isDefault());
                                    return choice;
                                })
                                .collect(Collectors.toList());
                            option.setChoices(choices);
                        }
                        return option;
                    })
                    .collect(Collectors.toList());
                existingDish.setOptions(options);
            }
            
            // Update other fields
            if (dishDTO.getPreparationTime() > 0) {
                existingDish.setPreparationTime(dishDTO.getPreparationTime());
            }
            existingDish.setUpdatedAt(new Date());
            
            // Lưu thay đổi vào database
            Dish updatedDish = dishRepository.updateDish(existingDish);
            if (updatedDish == null) {
                throw new RuntimeException("Không thể cập nhật món ăn");
            }
            
            Restaurant restaurant = restaurantRepository.findRestaurantById(updatedDish.getRestaurantId().toString());
            if (restaurant == null) {
                throw new RuntimeException("Không tìm thấy nhà hàng của món ăn này");
            }
            
            return dishMapper.toDishDetailDTO(updatedDish, restaurant);
        } catch (IllegalArgumentException e) {
            throw e; // Ném lại exception để controller xử lý
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi cập nhật món ăn: " + e.getMessage());
        }
    }

    public void deleteDish(String id) {
        Dish dish = dishRepository.findById(id);
        if (dish == null) {
            throw new RuntimeException("Không tìm thấy món ăn với id: " + id);
        }
        dishRepository.deleteDish(id);
    }
}