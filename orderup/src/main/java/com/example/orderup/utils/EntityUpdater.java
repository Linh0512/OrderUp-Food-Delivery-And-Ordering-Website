package com.example.orderup.utils;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Lớp tiện ích để cập nhật các thuộc tính của đối tượng
 */
public class EntityUpdater {
    
    // Các trường không nên cập nhật
    private static final Set<String> IGNORED_FIELDS = new HashSet<>();
    static {
        IGNORED_FIELDS.add("id");
        IGNORED_FIELDS.add("createdAt");
        IGNORED_FIELDS.add("updatedAt");
        IGNORED_FIELDS.add("password"); // Mật khẩu cần xử lý riêng
        IGNORED_FIELDS.add("usage");
    }
    
    /**
     * Cập nhật các thuộc tính từ nguồn vào đích
     * @param target Đối tượng đích
     * @param source Đối tượng nguồn
     * @param ignoreNulls Có bỏ qua các giá trị null hay không
     */
    public static void updateEntity(Object target, Object source, boolean ignoreNulls) {
        if (target == null || source == null) {
            return;
        }

        Class<?> targetClass = target.getClass();
        
        // Lấy tất cả các trường của lớp
        Field[] fields = targetClass.getDeclaredFields();
        
        for (Field field : fields) {
            String fieldName = field.getName();
            
            // Bỏ qua các trường không nên cập nhật
            if (IGNORED_FIELDS.contains(fieldName)) {
                continue;
            }
            
            try {
                field.setAccessible(true);
                
                // Lấy giá trị từ đối tượng nguồn
                Object sourceValue = field.get(source);
                
                // Nếu ignoreNulls=true và giá trị là null, bỏ qua
                if (ignoreNulls && sourceValue == null) {
                    continue;
                }
                
                // Xử lý đặc biệt cho các đối tượng phức tạp
                if (sourceValue != null && !isPrimitive(field.getType())) {
                    Object targetValue = field.get(target);
                    
                    // Nếu đối tượng đích chưa được khởi tạo, khởi tạo nó
                    if (targetValue == null) {
                        try {
                            targetValue = field.getType().getDeclaredConstructor().newInstance();
                            field.set(target, targetValue);
                        } catch (Exception e) {
                            // Không thể khởi tạo, gán trực tiếp giá trị từ nguồn
                            field.set(target, sourceValue);
                            continue;
                        }
                    }
                    
                    // Nếu là collection, gán trực tiếp
                    if (Collection.class.isAssignableFrom(field.getType())) {
                        field.set(target, sourceValue);
                    } else {
                        // Nếu là đối tượng phức tạp, đệ quy cập nhật
                        updateEntity(targetValue, sourceValue, ignoreNulls);
                    }
                } else {
                    // Đối với các kiểu dữ liệu đơn giản, gán trực tiếp
                    field.set(target, sourceValue);
                }
            } catch (Exception e) {
                // Bỏ qua nếu không thể cập nhật trường này
                System.err.println("Could not update field: " + fieldName + " - " + e.getMessage());
            }
        }
    }
    
    /**
     * Kiểm tra xem một kiểu dữ liệu có phải là primitive hoặc wrapper hay không
     */
    private static boolean isPrimitive(Class<?> type) {
        return type.isPrimitive() || 
               type == String.class ||
               type == Boolean.class ||
               type == Character.class ||
               type == Byte.class ||
               type == Short.class ||
               type == Integer.class ||
               type == Long.class ||
               type == Float.class ||
               type == Double.class ||
               type == Date.class;
    }
}
