package com.example.orderup.module.admin.controller;

import com.example.orderup.config.security.JwtTokenProvider;
import com.example.orderup.module.user.entirty.Profile;
import com.example.orderup.module.user.entirty.User;
import com.example.orderup.module.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class AdminUserViewController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @GetMapping("/users")
    public String viewUsers(Model model, 
            @RequestParam(defaultValue = "0") int page, 
            @RequestParam(defaultValue = "10") int size) {
        try {
            System.out.println("AdminViewController.viewUsers() called");
            System.out.println("Current authentication: " + SecurityContextHolder.getContext().getAuthentication());

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof User) {
                User user = (User) auth.getPrincipal();
                System.out.println("Authenticated user: " + user.getEmail() + " with role: " + user.getRole());
            } else {
                System.out.println("Authentication principal is not a User object: " + auth.getPrincipal());
            }


            Page<User> usersPage = userService.getAllUsers(page, size, new String[]{"updatedAt"}, "desc");
            
            // Debug thông tin
            System.out.println("Total users found: " + usersPage.getTotalElements());
            for (User user : usersPage.getContent()) {
                System.out.println("User: " + user.getEmail() + " (Role: " + user.getRole() + ")");
                if (user.getProfile() != null) {
                    System.out.println("  Profile: " + user.getProfile().getFirstName() + " " + user.getProfile().getLastName());
                } else {
                    System.out.println("  Profile: null");
                }
            }
            
            model.addAttribute("Users", usersPage.getContent());
            model.addAttribute("currentPage", usersPage.getNumber());
            model.addAttribute("totalItems", usersPage.getTotalElements());
            model.addAttribute("totalPages", usersPage.getTotalPages());
            model.addAttribute("pageSize", size);
            
            // Thêm thống kê
            Map<String, Object> stats = userService.getUserStats();
            model.addAttribute("stats", stats);
            
            return "admin/user/users";
        } catch (Exception e) {
            System.err.println("Error in AdminViewController.viewUsers(): " + e.getMessage());
            e.printStackTrace();
            return "error";
        }
    }
    
    @GetMapping("/users/search")
    public String searchUsers(
            @RequestParam String userName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model) {
        try {
            List<User> users = userService.getByUserName(userName); 
            
            model.addAttribute("Users", users);
            model.addAttribute("currentPage", 0);
            model.addAttribute("totalItems", (long) users.size());
            model.addAttribute("totalPages", users.isEmpty() ? 0 : 1);
            model.addAttribute("pageSize", size);
            
            // Thêm thống kê
            Map<String, Object> stats = userService.getUserStats();
            model.addAttribute("stats", stats);
            
            return "admin/user/users";
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    @GetMapping("/users/{id}/view")
    public String viewUserDetail(@PathVariable("id") String id, Model model) {
        try {
            User user = userService.getUserById(id);
            if (user == null) {
                model.addAttribute("error", "User not found");
                return "error";
            }
            
            model.addAttribute("user", user);
            return "admin/user/userDetail"; // Trả về view để hiển thị chi tiết người dùng
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "An error occurred while fetching user details");
            return "error";
        }
    }

    @GetMapping("/users/create")
    public String showCreateUserForm(Model model) {
        // Hiển thị form thêm người dùng mới
        User user = new User(); // Tạo một đối tượng User mới
        user.setProfile(new Profile()); // Khởi tạo Profile
        model.addAttribute("user", new User());
        model.addAttribute("isNew", true); // Thêm tham số
        return "admin/user/addUser"; // Trả về view để thêm người dùng mới
    }

    @PostMapping("/users/create")
    public String createUser (@ModelAttribute User user, RedirectAttributes redirectAttributes) {
        // Xử lý logic thêm người dùng mới
        try {
            Date now = new Date();
            user.setCreatedAt(now);
            user.setUpdatedAt(now);

            User savedUser = userService.saveUser(user);
            redirectAttributes.addFlashAttribute("message", "User created successfully: ");
            return "redirect:/admin/users";
        }
        catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "An error occurred while creating user: " + e.getMessage());
            return "redirect:/admin/users/create"; // Quay lại trang tạo người dùng
        }
    }

    @GetMapping("/users/{id}/edit")
    public String showEditUserForm(@PathVariable("id") String id, Model model) {
        try {
            User user = userService.getUserById(id);
            if (user == null) {
                model.addAttribute("error", "User not found");
                return "error";
            }
            
            model.addAttribute("user", user);
            model.addAttribute("isNew", false); // Thêm tham số
            return "admin/user/editUser"; // Trả về view để chỉnh sửa người dùng
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "An error occurred while fetching user details");
            return "error";
        }
    }

    @PostMapping("/users/{id}/edit")
    public String updateUser(@PathVariable("id") String id, 
            @ModelAttribute User user, RedirectAttributes redirectAttributes) {
        try {
            User existingUser = userService.getUserById(id);
            if (existingUser == null) {
                redirectAttributes.addFlashAttribute("error", "User not found");
                return "redirect:/admin/users";
            }
            
            boolean updatePassword = user.getPassword() != null && !user.getPassword().isEmpty();

            existingUser = userService.updateUserData(existingUser, user, updatePassword); // Cập nhật dữ liệu từ form

            userService.saveUser(existingUser);

            redirectAttributes.addFlashAttribute("message", "User updated successfully");
            return "redirect:/admin/users";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "An error occurred while updating user: " + e.getMessage());
            return "redirect:/admin/users/" + id + "/edit"; // Quay lại trang chỉnh sửa người dùng
        }
    }
    
    @PostMapping("/users/{id}/delete")
    public String deleteUser(@PathVariable("id") String id, RedirectAttributes redirectAttributes) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                redirectAttributes.addFlashAttribute("error", "Unauthorized access");
                return "redirect:/admin/users";
            }
            
            // Lấy user cần xóa
            User targetUser = userService.getUserById(id);
            if(targetUser == null) {
                redirectAttributes.addFlashAttribute("error", "User not found");
                return "redirect:/admin/users";
            }
            
            // Không cho phép xóa tài khoản admin
            if ("admin".equals(targetUser.getRole())) {
                redirectAttributes.addFlashAttribute("error", "Cannot delete admin account");
                return "redirect:/admin/users";
            }
            
            userService.deleteUser(id);
            redirectAttributes.addFlashAttribute("message", "User deleted successfully");
            return "redirect:/admin/users";
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "An error occurred while deleting user: " + e.getMessage());
            return "redirect:/admin/users";
        }
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        
        return "redirect:http://localhost:5173/login";
    }
}