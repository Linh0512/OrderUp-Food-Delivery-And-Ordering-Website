package com.example.orderup.module.restaurant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class WebController {    
    @GetMapping("/")
    public RedirectView home() {
        // Redirect root path về frontend React app
        return new RedirectView("http://localhost:5173");
    }
    
    @GetMapping("/users")
    public RedirectView redirectToAdminUsers() {
        return new RedirectView("/admin/users");
    }
}