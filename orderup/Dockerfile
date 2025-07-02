# Stage 1: Build stage
FROM openjdk:21-jdk-slim AS build

# Install Maven
RUN apt-get update && apt-get install -y maven

# Thiết lập working directory
WORKDIR /app

# Copy pom.xml
COPY pom.xml .

# Download dependencies (cache layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build ứng dụng
RUN mvn clean package -DskipTests

# Stage 2: Production stage
FROM eclipse-temurin:21-jre-alpine

# Thiết lập working directory
WORKDIR /app

# Copy JAR file từ build stage
COPY --from=build /app/target/*.jar app.jar

# Tạo user non-root cho bảo mật
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Expose port 8080
EXPOSE 8080

# Start ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"] 