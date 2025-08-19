# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Expose the port your app listens on
EXPOSE 80

# Default command to run your API
CMD ["node", "src/server.js"]
