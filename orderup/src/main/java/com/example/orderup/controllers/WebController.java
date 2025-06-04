package com.example.orderup.controllers;

import com.example.orderup.models.Comment;
import com.example.orderup.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WebController {
    @Autowired
    private CommentRepository commentRepository;
    
    @GetMapping("/")
    public String home() {
        return "index";
    }
    
    @GetMapping("/comments")
        public String viewComments(Model model, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable paging = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
            Page<Comment> pageComments = commentRepository.findAll(paging);
            
            // Kiểm tra dữ liệu
            System.out.println("Found " + pageComments.getTotalElements() + " comments");
            
            model.addAttribute("comments", pageComments.getContent());
            model.addAttribute("currentPage", pageComments.getNumber());
            model.addAttribute("totalItems", pageComments.getTotalElements());
            model.addAttribute("totalPages", pageComments.getTotalPages());
            model.addAttribute("pageSize", size);
            
            return "comments";
        } catch (Exception e) {
            e.printStackTrace();
            return "error";  // Tạo thêm trang error.html
        }
    }
}