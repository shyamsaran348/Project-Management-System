# Use Node.js as the base image
FROM node:20-slim as builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:alpine

# Copy build files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
