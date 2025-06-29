package com.example.orderup.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Configuration
@EnableMongoRepositories(basePackages = "com.example.orderup")
public class MongoConfig {
    
    @Bean
    public MongoCustomConversions customConversions() {
        List<Converter<?, ?>> converters = new ArrayList<>();
        
        // Converter cho User entity (Integer-Date timestamp fields)
        converters.add(new IntegerToDateConverter());
        converters.add(new DateToIntegerConverter());
        
        // Converter cho Voucher entity (Long-Integer remainingValue)
        converters.add(new LongToIntegerConverter());
        converters.add(new IntegerToLongConverter());
        
        // Converter cho Voucher entity (LocalDateTime và LocalDate fields)
        converters.add(new DateToLocalDateTimeConverter());
        converters.add(new LocalDateTimeToDateConverter());
        converters.add(new DateToLocalDateConverter());
        converters.add(new LocalDateToDateConverter());
        
        return new MongoCustomConversions(converters);
    }
    
    // Converter từ Integer sang Date (cho User entity - timestamp fields)
    static class IntegerToDateConverter implements Converter<Integer, Date> {
        @Override
        public Date convert(Integer source) {
            if (source == null) return null;
            return new Date(source.longValue() * 1000L);
        }
    }
    
    // Converter từ Date sang Integer (cho User entity)
    static class DateToIntegerConverter implements Converter<Date, Integer> {
        @Override
        public Integer convert(Date source) {
            if (source == null) return null;
            return (int) (source.getTime() / 1000L);
        }
    }
    
    // Converter từ Long sang Integer (cho Voucher remainingValue)
    static class LongToIntegerConverter implements Converter<Long, Integer> {
        @Override
        public Integer convert(Long source) {
            if (source == null) return null;
            return source.intValue();
        }
    }
    
    // Converter từ Integer sang Long (khi đọc từ database)
    static class IntegerToLongConverter implements Converter<Integer, Long> {
        @Override
        public Long convert(Integer source) {
            if (source == null) return null;
            return source.longValue();
        }
    }
    
    // Converter từ Date sang LocalDateTime (cho Voucher entity - createdAt, updatedAt, issuedAt, usedAt)
    static class DateToLocalDateTimeConverter implements Converter<Date, LocalDateTime> {
        @Override
        public LocalDateTime convert(Date source) {
            if (source == null) return null;
            return source.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        }
    }
    
    // Converter từ LocalDateTime sang Date
    static class LocalDateTimeToDateConverter implements Converter<LocalDateTime, Date> {
        @Override
        public Date convert(LocalDateTime source) {
            if (source == null) return null;
            return Date.from(source.atZone(ZoneId.systemDefault()).toInstant());
        }
    }
    
    // Converter từ Date sang LocalDate (cho Voucher entity - expiresAt)
    static class DateToLocalDateConverter implements Converter<Date, LocalDate> {
        @Override
        public LocalDate convert(Date source) {
            if (source == null) return null;
            return source.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }
    }
    
    // Converter từ LocalDate sang Date
    static class LocalDateToDateConverter implements Converter<LocalDate, Date> {
        @Override
        public Date convert(LocalDate source) {
            if (source == null) return null;
            return Date.from(source.atStartOfDay(ZoneId.systemDefault()).toInstant());
        }
    }
} 