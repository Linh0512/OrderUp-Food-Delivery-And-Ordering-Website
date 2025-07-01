package com.example.orderup.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        
        // REMOVED custom deserializers that might cause int->Date conversion issues
        // SimpleModule module = new SimpleModule();
        // module.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer());
        // module.addDeserializer(LocalDate.class, new LocalDateDeserializer());
        // module.addSerializer(LocalDate.class, new LocalDateSerializer());
        // mapper.registerModule(module);
        
        return mapper;
    }

    public static class LocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {
        private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

        @Override
        public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            String date = p.getText();
            
            try {
                // Thử parse với format ISO datetime
                return LocalDateTime.parse(date, ISO_FORMATTER);
            } catch (DateTimeParseException e1) {
                try {
                    // Thử parse với format datetime có space
                    return LocalDateTime.parse(date, DATE_TIME_FORMATTER);
                } catch (DateTimeParseException e2) {
                    try {
                        // Thử parse với format date only và set time là 00:00:00
                        return LocalDateTime.parse(date + " 00:00:00", DATE_TIME_FORMATTER);
                    } catch (DateTimeParseException e3) {
                        throw new IOException("Unable to parse date: " + date, e3);
                    }
                }
            }
        }
    }

    public static class LocalDateDeserializer extends JsonDeserializer<LocalDate> {
        private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

        @Override
        public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            String date = p.getText();
            
            try {
                // Thử parse với format ISO date
                return LocalDate.parse(date, ISO_FORMATTER);
            } catch (DateTimeParseException e1) {
                try {
                    // Thử parse với format date thông thường
                    return LocalDate.parse(date, DATE_FORMATTER);
                } catch (DateTimeParseException e2) {
                    throw new IOException("Unable to parse date: " + date, e2);
                }
            }
        }
    }

    public static class LocalDateSerializer extends JsonSerializer<LocalDate> {
        private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        @Override
        public void serialize(LocalDate value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            gen.writeString(value.format(DATE_FORMATTER));
        }
    }
} 