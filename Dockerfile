# Use official Node.js 20 slim image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy server + public folder
COPY server.js ./
COPY public/ ./public/

# Cloud Run injects PORT env var (default 8080)
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
