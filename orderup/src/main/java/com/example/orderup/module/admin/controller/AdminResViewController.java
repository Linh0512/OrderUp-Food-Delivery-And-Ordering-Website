package com.example.orderup.module.admin.controller;

import com.example.orderup.module.restaurant.entity.Restaurant;
import com.example.orderup.module.restaurant.service.RestaurantService;
import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.repository.UserRepository;

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
import java.util.Optional;

@Controller
@RequestMapping("/admin/restaurants")
public class AdminResViewController {
    @Autowired
    private RestaurantService restaurantService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("")
    public String viewRestaurants(Model model, 
            @RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Restaurant> restaurantsPage = restaurantService.getAllRestaurantsPage(pageable);
            
            model.addAttribute("restaurants", restaurantsPage.getContent());
            model.addAttribute("currentPage", restaurantsPage.getNumber());
            model.addAttribute("totalItems", restaurantsPage.getTotalElements());
            model.addAttribute("totalPages", restaurantsPage.getTotalPages());
            model.addAttribute("pageSize", size);
            
            Map<String, Object> stats = restaurantService.getRestaurantStats();
            model.addAttribute("stats", stats);
            
            return "admin/restaurant/restaurants";
        } catch (Exception e) {
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
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            
            if (restaurant == null) {
                model.addAttribute("error", "Không tìm thấy nhà hàng với ID: " + id);
                return "error";
            }

            if (restaurant.getHostId() != null) {
                Optional<User> hostUser = userRepository.findById(restaurant.getHostId());
                if (hostUser.isPresent() && hostUser.get().getProfile() != null) {
                    Restaurant.HostInfo hostInfo = new Restaurant.HostInfo();
                    hostInfo.setFirstName(hostUser.get().getProfile().getFirstName());
                    hostInfo.setLastName(hostUser.get().getProfile().getLastName());
                    hostInfo.setPhone(hostUser.get().getProfile().getPhone());
                    hostInfo.setEmail(hostUser.get().getEmail());
                    hostInfo.setDateOfBirth(hostUser.get().getProfile().getDateOfBirth());
                    hostInfo.setGender(hostUser.get().getProfile().getGender());
                    hostInfo.setAvatar(hostUser.get().getProfile().getAvatar());
                    restaurant.setHostInfo(hostInfo);
                }
            }

            initializeRestaurantForForm(restaurant);

            model.addAttribute("restaurant", restaurant);
            return "admin/restaurant/restaurantDetail";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
            return "error";
        }
    }

    @GetMapping("/create")
    public String showCreateRestaurantForm(Model model) {
        Restaurant restaurant = new Restaurant();
        initializeRestaurantForForm(restaurant);
        
        List<User> potentialHosts = userRepository.findByRole("restaurantHost");
        
        model.addAttribute("potentialHosts", potentialHosts);
        model.addAttribute("restaurant", restaurant);
        model.addAttribute("isNew", true);
        return "admin/restaurant/form";
    }

    @PostMapping("/create")
    public String createRestaurant(@ModelAttribute Restaurant restaurant, RedirectAttributes redirectAttributes) {
        try {
            restaurant.setId(null);
            
            LocalDateTime now = LocalDateTime.now();
            restaurant.setCreatedAt(now);
            restaurant.setUpdatedAt(now);
            
            if (restaurant.getHostId() != null) {
                Optional<User> hostUser = userRepository.findById(restaurant.getHostId());
                if (hostUser.isPresent() && hostUser.get().getProfile() != null) {
                    Restaurant.HostInfo hostInfo = new Restaurant.HostInfo();
                    hostInfo.setFirstName(hostUser.get().getProfile().getFirstName());
                    hostInfo.setLastName(hostUser.get().getProfile().getLastName());
                    hostInfo.setPhone(hostUser.get().getProfile().getPhone());
                    hostInfo.setEmail(hostUser.get().getEmail());
                    hostInfo.setDateOfBirth(hostUser.get().getProfile().getDateOfBirth());
                    hostInfo.setGender(hostUser.get().getProfile().getGender());
                    hostInfo.setAvatar(hostUser.get().getProfile().getAvatar());
                    restaurant.setHostInfo(hostInfo);
                }
            }
            
            initializeRestaurantForForm(restaurant);

            Restaurant savedRestaurant = restaurantService.saveRestaurant(restaurant);
            
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
                model.addAttribute("error", "Không tìm thấy nhà hàng");
                return "error";
            }
            
            if (restaurant.getHostId() != null) {
                Optional<User> hostUser = userRepository.findById(restaurant.getHostId());
                if (hostUser.isPresent() && hostUser.get().getProfile() != null) {
                    Restaurant.HostInfo hostInfo = new Restaurant.HostInfo();
                    hostInfo.setFirstName(hostUser.get().getProfile().getFirstName());
                    hostInfo.setLastName(hostUser.get().getProfile().getLastName());
                    hostInfo.setPhone(hostUser.get().getProfile().getPhone());
                    hostInfo.setEmail(hostUser.get().getEmail());
                    hostInfo.setDateOfBirth(hostUser.get().getProfile().getDateOfBirth());
                    hostInfo.setGender(hostUser.get().getProfile().getGender());
                    hostInfo.setAvatar(hostUser.get().getProfile().getAvatar());
                    restaurant.setHostInfo(hostInfo);
                }
            }
            
            List<User> potentialHosts = userRepository.findByRole("restaurantHost");
            
            model.addAttribute("potentialHosts", potentialHosts);
            model.addAttribute("restaurant", restaurant);
            model.addAttribute("isNew", false);
            return "admin/restaurant/form";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Đã xảy ra lỗi: " + e.getMessage());
            return "error";
        }
    }

    @PostMapping("/{id}/edit")
    public String updateRestaurant(@PathVariable("id") String id, 
            @ModelAttribute Restaurant restaurant, RedirectAttributes redirectAttributes) {
        try {
            Restaurant existingRestaurant = restaurantService.getRestaurantById(id);
            if (existingRestaurant == null) {
                redirectAttributes.addFlashAttribute("error", "Không tìm thấy nhà hàng");
                return "redirect:/admin/restaurants";
            }

            restaurant.setId(id);
            restaurant.setUpdatedAt(LocalDateTime.now());
            restaurant.setCreatedAt(existingRestaurant.getCreatedAt());
            
            if (restaurant.getHostId() != null) {
                Optional<User> hostUser = userRepository.findById(restaurant.getHostId());
                if (hostUser.isPresent() && hostUser.get().getProfile() != null) {
                    Restaurant.HostInfo hostInfo = new Restaurant.HostInfo();
                    hostInfo.setFirstName(hostUser.get().getProfile().getFirstName());
                    hostInfo.setLastName(hostUser.get().getProfile().getLastName());
                    hostInfo.setPhone(hostUser.get().getProfile().getPhone());
                    hostInfo.setEmail(hostUser.get().getEmail());
                    hostInfo.setDateOfBirth(hostUser.get().getProfile().getDateOfBirth());
                    hostInfo.setGender(hostUser.get().getProfile().getGender());
                    hostInfo.setAvatar(hostUser.get().getProfile().getAvatar());
                    restaurant.setHostInfo(hostInfo);
                }
            }

            restaurantService.saveRestaurant(restaurant);
            redirectAttributes.addFlashAttribute("success", "Cập nhật nhà hàng thành công");
            return "redirect:/admin/restaurants/" + id + "/view";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Đã xảy ra lỗi khi cập nhật nhà hàng: " + e.getMessage());
            return "redirect:/admin/restaurants/" + id + "/edit";
        }
    }

    @PostMapping("/{id}/delete")
    public String deleteRestaurant(@PathVariable("id") String id, RedirectAttributes redirectAttributes) {
        try {
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            if (restaurant == null) {
                redirectAttributes.addFlashAttribute("error", "Không tìm thấy nhà hàng với ID: " + id);
                return "redirect:/admin/restaurants";
            }

            restaurantService.deleteRestaurant(id);
            redirectAttributes.addFlashAttribute("success", "Xóa nhà hàng thành công");
            return "redirect:/admin/restaurants";
        } catch (Exception e) {
            e.printStackTrace();
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            redirectAttributes.addFlashAttribute("error", "Đã xảy ra lỗi khi xóa nhà hàng: " + e.getMessage());
            return "redirect:/admin/restaurants";
        }
    }

    @PostMapping("/{id}/approve")
    public String approveRestaurant(@PathVariable("id") String id, RedirectAttributes redirectAttributes) {
        try {
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            if (restaurant != null) {
                restaurant.setVerificationStatus("APPROVED");
                restaurant.setVerified(true);
                restaurant.setUpdatedAt(LocalDateTime.now());
                restaurantService.saveRestaurant(restaurant);
                redirectAttributes.addFlashAttribute("success", "Đã duyệt nhà hàng thành công");
            } else {
                redirectAttributes.addFlashAttribute("error", "Không tìm thấy nhà hàng");
            }
            return "redirect:/admin/restaurants/" + id + "/view";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Đã xảy ra lỗi khi duyệt nhà hàng: " + e.getMessage());
            return "redirect:/admin/restaurants/" + id + "/view";
        }
    }

    @PostMapping("/{id}/reject")
    public String rejectRestaurant(@PathVariable("id") String id, RedirectAttributes redirectAttributes) {
        try {
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            if (restaurant != null) {
                restaurant.setVerificationStatus("REJECTED");
                restaurant.setVerified(false);
                restaurant.setUpdatedAt(LocalDateTime.now());
                restaurantService.saveRestaurant(restaurant);
                redirectAttributes.addFlashAttribute("success", "Đã từ chối nhà hàng thành công");
            } else {
                redirectAttributes.addFlashAttribute("error", "Không tìm thấy nhà hàng");
            }
            return "redirect:/admin/restaurants/" + id + "/view";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Đã xảy ra lỗi khi từ chối nhà hàng: " + e.getMessage());
            return "redirect:/admin/restaurants/" + id + "/view";
        }
    }

    @PostMapping("/{id}/pending")
    public String setPendingRestaurant(@PathVariable("id") String id, RedirectAttributes redirectAttributes) {
        try {
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            if (restaurant != null) {
                restaurant.setVerificationStatus("PENDING");
                restaurant.setVerified(false);
                restaurant.setUpdatedAt(LocalDateTime.now());
                restaurantService.saveRestaurant(restaurant);
                redirectAttributes.addFlashAttribute("success", "Đã đặt trạng thái chờ duyệt cho nhà hàng thành công");
            } else {
                redirectAttributes.addFlashAttribute("error", "Không tìm thấy nhà hàng");
            }
            return "redirect:/admin/restaurants/" + id + "/view";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Đã xảy ra lỗi khi đặt trạng thái chờ duyệt: " + e.getMessage());
            return "redirect:/admin/restaurants/" + id + "/view";
        }
    }

    private void initializeRestaurantForForm(Restaurant restaurant) {
        if (restaurant.getBasicInfo() == null) {
            restaurant.setBasicInfo(new Restaurant.BasicInfo());
        }
        if (restaurant.getAddress() == null) {
            restaurant.setAddress(new Restaurant.Address());
            restaurant.getAddress().setCoordinates(new Restaurant.GeoCoordinates());
        }
        if (restaurant.getDelivery() == null) {
            restaurant.setDelivery(new Restaurant.DeliveryInfo());
        }
        if (restaurant.getBusinessInfo() == null) {
            restaurant.setBusinessInfo(new Restaurant.BusinessInfo());
        }
        if (restaurant.getBankInfo() == null) {
            restaurant.setBankInfo(new Restaurant.BankInfo());
        }
        if (restaurant.getOperatingHours() == null || restaurant.getOperatingHours().isEmpty()) {
            List<Restaurant.OperatingHour> hours = new ArrayList<>();
            for (int i = 0; i < 7; i++) {
                Restaurant.OperatingHour hour = new Restaurant.OperatingHour(i);
                hour.setOpen(true);
                hour.setOpenTime("08:00");
                hour.setCloseTime("22:00");
                hours.add(hour);
            }
            restaurant.setOperatingHours(hours);
        }
        
        // Đặt các giá trị mặc định cho nhà hàng mới
        if (restaurant.getId() == null) {
            restaurant.setActive(true); // Set active mặc định là true
            restaurant.setVerified(false);
            restaurant.setFeatured(false);
            restaurant.setVerificationStatus("PENDING");
        }
    }
}