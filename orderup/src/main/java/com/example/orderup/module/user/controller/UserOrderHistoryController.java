package com.example.orderup.module.user.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.orderup.module.user.dto.UserOrderHistoryThumbDTO;
import com.example.orderup.module.user.dto.UserOrderHistoryDetailDTO;
import com.example.orderup.module.user.service.UserOrderHistoryService;

import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.example.orderup.module.user.entirty.Order;
import org.bson.types.ObjectId;
import com.example.orderup.config.security.JwtTokenProvider;

@RestController
@RequestMapping("/api/orders")
public class UserOrderHistoryController {
    private static final Logger logger = LoggerFactory.getLogger(UserOrderHistoryController.class);

    @Autowired
    private UserOrderHistoryService orderHistoryService;

    @Autowired 
    private MongoTemplate mongoTemplate;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Test endpoint để debug Order parsing
    @GetMapping("/debug/count")
    public ResponseEntity<Map<String, Object>> debugOrderCount() {
        try {
            logger.debug("Debug: Counting total orders");
            
            long totalCount = mongoTemplate.count(new Query(), "orders");
            logger.debug("Debug: Total order count from mongoTemplate: {}", totalCount);
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalOrdersInDB", totalCount);
            response.put("message", "Success - no entity parsing required");
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error in debug count", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Test endpoint để debug Order entity parsing
    @GetMapping("/debug/parse-one")
    public ResponseEntity<Map<String, Object>> debugParseOneOrder() {
        try {
            logger.debug("Debug: Trying to parse one order");
            
            // Thử lấy 1 order với MongoTemplate và parse thành Order entity
            Query query = new Query().limit(1);
            Order order = mongoTemplate.findOne(query, Order.class, "orders");
            
            Map<String, Object> response = new HashMap<>();
            if (order != null) {
                response.put("success", true);
                response.put("orderId", order.getId());
                response.put("orderNumber", order.getOrderNumber());
                response.put("customerId", order.getCustomerId());
                response.put("message", "Order entity parsed successfully");
            } else {
                response.put("success", false);
                response.put("message", "No orders found");
            }
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error parsing order entity", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint để lấy lịch sử đơn hàng theo userId
    @GetMapping("/userId")
    public ResponseEntity<Map<String, Object>> getUserOrderHistory(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String orderDate,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        try {
            logger.debug("Fetching order history for userId: {}", token);
            
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection), sortBy));

            LocalDateTime date = null;
            if (orderDate != null) {
                try {
                    date = LocalDateTime.parse(orderDate + "T00:00:00");
                } catch (Exception e) {
                    logger.error("Invalid date format: " + orderDate, e);
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
            
            Page<UserOrderHistoryThumbDTO> ordersPage = orderHistoryService.filterUserOrderByDate(token, date, pageable);

            logger.debug("Found {} orders for userId: {}", ordersPage.getTotalElements(), token);

            Map<String, Object> response = new HashMap<>();
            response.put("orders", ordersPage.getContent());
            response.put("currentPage", ordersPage.getNumber());
            response.put("totalItems", ordersPage.getTotalElements());
            response.put("totalPages", ordersPage.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching order history for userId: " + token, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint để lấy lịch sử đơn hàng theo restaurantId
    @GetMapping("/restaurantId/{restaurantId}")
    public ResponseEntity<Map<String, Object>> getRestaurantOrderHistory(
            @PathVariable("restaurantId") String restaurantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String orderDate,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        try {
            logger.debug("Fetching order history for restaurantId: {}", restaurantId);
            
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDirection), sortBy));

            LocalDateTime date = null;
            if (orderDate != null) {
                try {
                    date = LocalDateTime.parse(orderDate + "T00:00:00");
                } catch (Exception e) {
                    logger.error("Invalid date format: " + orderDate, e);
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            }
            
            Page<UserOrderHistoryThumbDTO> ordersPage = orderHistoryService.filterRestaurantOrderByDate(restaurantId, date, pageable);

            logger.debug("Found {} orders for restaurantId: {}", ordersPage.getTotalElements(), restaurantId);

            Map<String, Object> response = new HashMap<>();
            response.put("orders", ordersPage.getContent());
            response.put("currentPage", ordersPage.getNumber());
            response.put("totalItems", ordersPage.getTotalElements());
            response.put("totalPages", ordersPage.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error fetching order history for restaurantId: " + restaurantId, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint để lấy chi tiết đơn hàng
    @GetMapping("/{orderId}")
    public ResponseEntity<UserOrderHistoryDetailDTO> getOrderDetail(
            @PathVariable("orderId") String orderId) {
        try {
            logger.debug("Fetching order detail for orderId: {}", orderId);
            
            UserOrderHistoryDetailDTO orderDetail = orderHistoryService.getOrderDetail(orderId);
            if (orderDetail != null) {
                logger.debug("Found order detail for orderId: {}", orderId);
                return new ResponseEntity<>(orderDetail, HttpStatus.OK);
            } else {
                logger.debug("Order not found for orderId: {}", orderId);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error fetching order detail for orderId: " + orderId, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Test endpoint để debug repository findByCustomerId với pagination
    @GetMapping("/debug/repository")
    public ResponseEntity<Map<String, Object>> debugRepository() {
        try {
            logger.debug("Debug: Testing repository findByCustomerId");
            
            // Test với user ID từ JWT
            String userId = "68417874a74d530ba550eb69";
            ObjectId userIdObject = new ObjectId(userId);
            
            // Tạo Pageable đơn giản
            Pageable pageable = PageRequest.of(0, 5);
            
            // Test repository method thông qua service
            Page<Order> orders = orderHistoryService.getOrdersByCustomerId(userIdObject, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalElements", orders.getTotalElements());
            response.put("totalPages", orders.getTotalPages());
            response.put("currentPage", orders.getNumber());
            response.put("numberOfElements", orders.getNumberOfElements());
            response.put("message", "Repository method worked successfully");
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error in repository debug", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Test endpoint để debug method gây lỗi
    @GetMapping("/debug/actual-method")
    public ResponseEntity<Map<String, Object>> debugActualMethod() {
        try {
            logger.debug("Debug: Testing actual getUserOrderHistory method");
            
            // Test chính xác method đang gây lỗi
            String token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2ODQxNzg3NGE3NGQ1MzBiYTU1MGViNjkiLCJpYXQiOjE3MzYwODc1ODQsImV4cCI6MTczNjE3Mzk4NH0.KPBd5AjjZf7yKNjXmHOctEKBH8ZVUQDCKwBZdMRvQpw";
            Pageable pageable = PageRequest.of(0, 5);
            
            // Đây chính xác là method call gây lỗi
            Page<UserOrderHistoryThumbDTO> result = orderHistoryService.getUserOrderHistory(token, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalElements", result.getTotalElements());
            response.put("numberOfElements", result.getNumberOfElements());
            response.put("message", "getUserOrderHistory method worked successfully");
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error in actual method debug", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            errorResponse.put("stackTrace", e.getStackTrace()[0].toString());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Test endpoint với hardcoded userId để bypass JWT
    @GetMapping("/debug/bypass-jwt")
    public ResponseEntity<Map<String, Object>> debugBypassJWT() {
        try {
            logger.debug("Debug: Testing with hardcoded userId, bypassing JWT");
            
            // Hardcode userId để bypass JWT
            String userId = "68417874a74d530ba550eb69";
            ObjectId userIdObject = new ObjectId(userId);
            Pageable pageable = PageRequest.of(0, 5);
            
            // Test repository direct
            Page<Order> orders = orderHistoryService.getOrdersByCustomerId(userIdObject, pageable);
            
            if (orders.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "No orders found for hardcoded user");
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            
            // Test mapper conversion với dummy user
            Order firstOrder = orders.getContent().get(0);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalElements", orders.getTotalElements());
            response.put("firstOrderId", firstOrder.getId());
            response.put("firstOrderNumber", firstOrder.getOrderNumber());
            response.put("message", "Repository and entity parsing successful with hardcoded userId");
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error in bypass JWT debug", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            errorResponse.put("stackTrace", e.getStackTrace()[0].toString());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Test endpoint để debug JWT token
    @GetMapping("/debug/jwt")
    public ResponseEntity<Map<String, Object>> debugJWT(@RequestHeader("Authorization") String authHeader) {
        try {
            logger.debug("Debug: Testing JWT token parsing");
            
            Map<String, Object> response = new HashMap<>();
            response.put("authHeader", authHeader);
            
            // Test JWT parsing
            String userId = jwtTokenProvider.getUserIdFromToken(authHeader);
            String role = jwtTokenProvider.getRoleFromToken(authHeader);
            
            response.put("extractedUserId", userId);
            response.put("extractedRole", role);
            response.put("userIdIsNull", userId == null);
            response.put("message", userId != null ? "JWT parsing successful" : "JWT parsing failed");
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error in JWT debug", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Test endpoint để debug mapper với valid JWT
    @GetMapping("/debug/mapper-jwt")
    public ResponseEntity<Map<String, Object>> debugMapperWithJWT(@RequestHeader("Authorization") String authHeader) {
        try {
            logger.debug("Debug: Testing mapper with valid JWT");
            
            // Extract userId from valid JWT
            String userId = jwtTokenProvider.getUserIdFromToken(authHeader);
            ObjectId userIdObject = new ObjectId(userId);
            
            // Get orders
            Pageable pageable = PageRequest.of(0, 1);
            Page<Order> orders = orderHistoryService.getOrdersByCustomerId(userIdObject, pageable);
            
            if (orders.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "No orders found");
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            
            Order order = orders.getContent().get(0);
            
            // Test mapper step by step
            Map<String, Object> response = new HashMap<>();
            response.put("step1_orderOK", true);
            response.put("orderId", order.getId());
            
            // Bây giờ test phần gây lỗi - getUserById trong mapper
            try {
                // Đây có thể là nơi gây lỗi ConverterNotFoundException
                Page<UserOrderHistoryThumbDTO> result = orderHistoryService.getUserOrderHistory(authHeader, pageable);
                response.put("step2_mapperOK", true);
                response.put("totalElements", result.getTotalElements());
                response.put("message", "All steps successful");
            } catch (Exception mapperError) {
                response.put("step2_mapperOK", false);
                response.put("mapperError", mapperError.getMessage());
                response.put("mapperErrorType", mapperError.getClass().getSimpleName());
                response.put("message", "Mapper failed");
            }
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error in mapper JWT debug", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Test endpoint với MongoTemplate raw query để bypass entity mapping  
    @GetMapping("/debug/raw-query")
    public ResponseEntity<Map<String, Object>> debugRawQuery(@RequestHeader("Authorization") String authHeader) {
        try {
            logger.debug("Debug: Testing MongoTemplate raw query");
            
            String userId = jwtTokenProvider.getUserIdFromToken(authHeader);
            ObjectId userIdObject = new ObjectId(userId);
            
            // Raw query để bypass entity mapping
            Query query = new Query();
            query.addCriteria(Criteria.where("customerId").is(userIdObject));
            query.with(PageRequest.of(0, 5));
            
            // Count only để tránh entity mapping
            long count = mongoTemplate.count(query, "orders");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalOrders", count);
            response.put("message", "Raw query successful - no entity mapping");
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error in raw query debug", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("errorType", e.getClass().getSimpleName());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
