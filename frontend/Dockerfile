# Development stage
FROM node:18-alpine

# Thiết lập working directory
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port 5173
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]

# Stage 1: Build stage
FROM node:18-alpine AS build

# Thiết lập working directory
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Install ALL dependencies (cần devDependencies để build)
RUN npm ci

# Copy source code
COPY . .

# Build ứng dụng
RUN npm run build

# Stage 2: Production stage
FROM nginx:alpine

# Copy static files từ build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 