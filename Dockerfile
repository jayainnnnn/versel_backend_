# Use node:18-alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first (for cache efficiency)
COPY package*.json ./

# Install dependencies first
RUN npm install

# Copy rest of the app
COPY . .

# Ensure proper port is exposed
EXPOSE 3008

# Define env so Render picks it up
ENV PORT=3008

# Run the app
CMD ["node", "app.js"]
