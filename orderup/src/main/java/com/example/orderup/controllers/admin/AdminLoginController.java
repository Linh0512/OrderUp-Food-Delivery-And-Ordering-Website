package com.example.orderup.controllers.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminLoginController {
    
    @GetMapping("/admin/login")
    public String loginPage() {
        return "adminLogin";  // Tương ứng với templates/adminLogin.html
    }
}
