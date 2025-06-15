package com.example.orderup.module.admin.controller;

import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.service.RestaurantService;
import com.example.orderup.module.user.entirty.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.Arrays;

@Controller
@RequestMapping("/admin/restaurants")
public class AdminResViewController {
    @Autowired
    private RestaurantService restaurantService;
    
    @GetMapping("")
    public String viewRestaurants(Model model, 
            @RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "10") int size) {
        try {
            System.out.println("AdminResViewController.viewRestaurants() called");
            System.out.println("Current authentication: " + SecurityContextHolder.getContext().getAuthentication());

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof User) {
                User user = (User) auth.getPrincipal();
                System.out.println("Authenticated user: " + user.getEmail() + " with role: " + user.getRole());
            } else {
                System.out.println("Authentication principal is not a User object: " + auth.getPrincipal());
            }

            Pageable pageable = PageRequest.of(page, size);
            Page<Restaurant> restaurantsPage = restaurantService.getAllRestaurantsPage(pageable);
            
            // Debug thông tin
            System.out.println("Total restaurants found: " + restaurantsPage.getTotalElements());
            for (Restaurant restaurant : restaurantsPage.getContent()) {
                System.out.println("Restaurant: " + (restaurant.getBasicInfo() != null ? restaurant.getBasicInfo().getName() : "N/A"));
            }
            
            model.addAttribute("restaurants", restaurantsPage.getContent());
            model.addAttribute("currentPage", restaurantsPage.getNumber());
            model.addAttribute("totalItems", restaurantsPage.getTotalElements());
            model.addAttribute("totalPages", restaurantsPage.getTotalPages());
            model.addAttribute("pageSize", size);
            
            // Thêm thống kê
            Map<String, Object> stats = restaurantService.getRestaurantStats();
            model.addAttribute("stats", stats);
            
            return "admin/restaurant/restaurants";
        } catch (Exception e) {
            System.err.println("Error in AdminResViewController.viewRestaurants(): " + e.getMessage());
            e.printStackTrace();
            return "error";
        }
    }
    
    @GetMapping("/search")
    public String searchRestaurants(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Restaurant> restaurantsPage = restaurantService.searchRestaurantsByNamePage(name, pageable);
            
            model.addAttribute("restaurants", restaurantsPage.getContent());
            model.addAttribute("currentPage", restaurantsPage.getNumber());
            model.addAttribute("totalItems", restaurantsPage.getTotalElements());
            model.addAttribute("totalPages", restaurantsPage.getTotalPages());
            model.addAttribute("pageSize", size);
            model.addAttribute("searchQuery", name);
            
            // Thêm thống kê
            Map<String, Object> stats = restaurantService.getRestaurantStats();
            model.addAttribute("stats", stats);
            
            return "admin/restaurant/restaurants";
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    @GetMapping("/{id}/view")
    public String viewRestaurantDetail(@PathVariable("id") String id, Model model) {
        try {
            System.out.println("DEBUG: Viewing restaurant detail for ID: " + id);
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            
            if (restaurant == null) {
                model.addAttribute("error", "Không tìm thấy nhà hàng với ID: " + id);
                return "error";
            }

            // Khởi tạo các đối tượng nested nếu null
            if (restaurant.getBasicInfo() == null) {
                restaurant.setBasicInfo(new Restaurant.BasicInfo());
            }
            if (restaurant.getAddress() == null) {
                restaurant.setAddress(new Restaurant.Address());
                restaurant.getAddress().setCoordinates(new Restaurant.GeoCoordinates());
            } else if (restaurant.getAddress().getCoordinates() == null) {
                restaurant.getAddress().setCoordinates(new Restaurant.GeoCoordinates());
            }
            if (restaurant.getBusinessInfo() == null) {
                restaurant.setBusinessInfo(new Restaurant.BusinessInfo());
            }
            if (restaurant.getOperatingHours() == null) {
                restaurant.setOperatingHours(new ArrayList<>());
                // Khởi tạo 7 ngày trong tuần
                for (int i = 0; i < 7; i++) {
                    Restaurant.OperatingHour hour = new Restaurant.OperatingHour();
                    hour.setDayOfWeek(i);
                    hour.setOpen(false);
                    restaurant.getOperatingHours().add(hour);
                }
            }
            if (restaurant.getDelivery() == null) {
                restaurant.setDelivery(new Restaurant.DeliveryInfo());
            }
            if (restaurant.getRatings() == null) {
                restaurant.setRatings(new Restaurant.RatingInfo());
            }
            if (restaurant.getTags() == null) {
                restaurant.setTags(new ArrayList<>());
            }
            if (restaurant.getBankInfo() == null) {
                restaurant.setBankInfo(new Restaurant.BankInfo());
            }

            // Debug thông tin
            System.out.println("DEBUG: Restaurant processed successfully");
            System.out.println("DEBUG: BasicInfo: " + restaurant.getBasicInfo());
            System.out.println("DEBUG: Address: " + restaurant.getAddress());
            System.out.println("DEBUG: Operating Hours: " + restaurant.getOperatingHours());
            
            model.addAttribute("restaurant", restaurant);
            model.addAttribute("daysOfWeek", Arrays.asList("Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"));
            return "admin/restaurant/restaurantDetail";
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("ERROR in viewRestaurantDetail: " + e.getMessage());
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
            model.addAttribute("trace", sw.toString());
            return "error";
        }
    }

    @GetMapping("/create")
    public String showCreateRestaurantForm(Model model) {
        Restaurant restaurant = new Restaurant();
        restaurant.setBasicInfo(new Restaurant.BasicInfo());
        restaurant.setAddress(new Restaurant.Address());
        restaurant.setOperatingHours(new ArrayList<>());
        restaurant.setTags(new ArrayList<>());
        restaurant.setActive(true);
        
        model.addAttribute("restaurant", restaurant);
        model.addAttribute("isNew", true);
        return "admin/restaurant/form";
    }

    @PostMapping("/create")
    public String createRestaurant(@ModelAttribute Restaurant restaurant, RedirectAttributes redirectAttributes) {
        try {
            // Đảm bảo ID là null để MongoDB tự động tạo ID mới
            restaurant.setId(null);
            
            LocalDateTime now = LocalDateTime.now();
            restaurant.setCreatedAt(now);
            restaurant.setUpdatedAt(now);
            
            // Đảm bảo các collection khác không bị null
            if (restaurant.getBasicInfo() == null) {
                restaurant.setBasicInfo(new Restaurant.BasicInfo());
            }
            if (restaurant.getAddress() == null) {
                restaurant.setAddress(new Restaurant.Address());
            }
            if (restaurant.getOperatingHours() == null) {
                restaurant.setOperatingHours(new ArrayList<>());
            }
            if (restaurant.getTags() == null) {
                restaurant.setTags(new ArrayList<>());
            }

            Restaurant savedRestaurant = restaurantService.saveRestaurant(restaurant);
            
            // In ra ID để kiểm tra
            System.out.println("DEBUG: Created restaurant with ID: " + savedRestaurant.getId());
            
            redirectAttributes.addFlashAttribute("success", "Tạo nhà hàng thành công");
            return "redirect:/admin/restaurants/" + savedRestaurant.getId() + "/view";
        }
        catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Đã xảy ra lỗi khi tạo nhà hàng: " + e.getMessage());
            return "redirect:/admin/restaurants/create";
        }
    }

    @GetMapping("/{id}/edit")
    public String showEditRestaurantForm(@PathVariable("id") String id, Model model) {
        try {
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            if (restaurant == null) {
                model.addAttribute("error", "Restaurant not found");
                return "error";
            }
            
            // Ensure all required objects are initialized
            if (restaurant.getBasicInfo() == null) {
                restaurant.setBasicInfo(new Restaurant.BasicInfo());
            }
            if (restaurant.getAddress() == null) {
                restaurant.setAddress(new Restaurant.Address());
            }
            if (restaurant.getOperatingHours() == null) {
                restaurant.setOperatingHours(new ArrayList<>());
            }
            if (restaurant.getTags() == null) {
                restaurant.setTags(new ArrayList<>());
            }
            
            model.addAttribute("restaurant", restaurant);
            model.addAttribute("isNew", false);
            model.addAttribute("daysOfWeek", Arrays.asList("Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"));
            return "admin/restaurant/form";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "An error occurred while fetching restaurant details");
            return "error";
        }
    }

    @PostMapping("/{id}/edit")
    public String updateRestaurant(@PathVariable("id") String id, 
            @ModelAttribute Restaurant restaurant, RedirectAttributes redirectAttributes) {
        try {
            Restaurant existingRestaurant = restaurantService.getRestaurantById(id);
            if (existingRestaurant == null) {
                redirectAttributes.addFlashAttribute("error", "Restaurant not found");
                return "redirect:/admin/restaurants";
            }
            
            // Keep original created date and ID
            restaurant.setId(existingRestaurant.getId());
            restaurant.setCreatedAt(existingRestaurant.getCreatedAt());
            restaurant.setUpdatedAt(LocalDateTime.now());
            
            restaurantService.saveRestaurant(restaurant);

            redirectAttributes.addFlashAttribute("success", "Restaurant updated successfully");
            return "redirect:/admin/restaurants";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "An error occurred while updating restaurant: " + e.getMessage());
            return "redirect:/admin/restaurants/" + id + "/edit";
        }
    }
    
    @PostMapping("/{id}/delete")
    public String deleteRestaurant(@PathVariable("id") String id, RedirectAttributes redirectAttributes) {
        try {
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            if(restaurant == null) {
                redirectAttributes.addFlashAttribute("error", "Restaurant not found");
                return "redirect:/admin/restaurants";
            }
            
            boolean deleted = restaurantService.deleteRestaurant(id);
            if (deleted) {
                redirectAttributes.addFlashAttribute("success", "Restaurant deleted successfully");
            } else {
                redirectAttributes.addFlashAttribute("error", "Failed to delete restaurant");
            }
            return "redirect:/admin/restaurants";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "An error occurred while deleting restaurant: " + e.getMessage());
            return "redirect:/admin/restaurants";
        }
    }
}