package com.example.orderup.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Configuration
public class MongoConfig {
    
    @Bean
    public MongoCustomConversions customConversions() {
        List<Converter<?, ?>> converters = new ArrayList<>();
        converters.add(new IntegerToDateConverter());
        converters.add(new LongToDateConverter());
        return new MongoCustomConversions(converters);
    }
    
    // Converter từ Integer timestamp sang Date
    static class IntegerToDateConverter implements Converter<Integer, Date> {
        @Override
        public Date convert(Integer source) {
            if (source == null) return null;
            // Convert Unix timestamp (seconds) to Date
            return new Date(source * 1000L);
        }
    }
    
    // Converter từ Long timestamp sang Date
    static class LongToDateConverter implements Converter<Long, Date> {
        @Override
        public Date convert(Long source) {
            if (source == null) return null;
            // Convert Unix timestamp to Date
            // Check if it's in seconds or milliseconds
            if (source < 10000000000L) {
                // Seconds since epoch
                return new Date(source * 1000L);
            } else {
                // Milliseconds since epoch
                return new Date(source);
            }
        }
    }
} 