package com.example.orderup.controllers;

import com.example.orderup.repositories.CommentRepository;
import com.example.orderup.models.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentRepository commentRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String[] sortBy,
            @RequestParam(defaultValue = "desc") String direction){

        try {
            Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
            
            Pageable paging = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            Page<Comment> commentsPage = commentRepository.findAll(paging);
            
            List<Comment> comments = commentsPage.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("comments", comments);
            response.put("currentPage", commentsPage.getNumber());
            response.put("totalItems", commentsPage.getTotalElements());
            response.put("totalPages", commentsPage.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable("id") String id) {
        Optional<Comment> commentData = commentRepository.findById(id);
        if (commentData.isPresent()) {
            return new ResponseEntity<>(commentData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        try {
            Comment savedComment = commentRepository.save(comment);
            return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable("id") String id, @RequestBody Comment comment) {
        Optional<Comment> commentData = commentRepository.findById(id);
        if (commentData.isPresent()) {
            Comment updatedComment = commentData.get();
            updatedComment.setName(comment.getName());
            updatedComment.setEmail(comment.getEmail());
            updatedComment.setText(comment.getText());

            return new ResponseEntity<>(commentRepository.save(updatedComment), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/byMovie/{movie_id}")
    public ResponseEntity<List<Comment>> getCommentsBymovie_id(@PathVariable("movie_id") String movieId) {
        try {
            List<Comment> comments = commentRepository.findByMovieId(movieId);

            if (comments.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(comments, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/byDateRage")
    public ResponseEntity<List<Comment>> getCommentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date endDate) {
        try {
            List<Comment> comments = commentRepository.findByDateBetween(startDate, endDate);
            if (comments.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(comments, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/SearchComments")
    public ResponseEntity<List<Comment>> searchComments(
            @RequestParam String text) {
        try {
            List<Comment> comments = commentRepository.findByTextContaining(text);
            if (comments.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(comments, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        try {
            Map<String, Long> stats = new HashMap<>();
            stats.put("totalComments", commentRepository.count());

            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
    