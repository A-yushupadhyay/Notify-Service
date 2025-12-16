# Backend Dockerfile (notify-service)
FROM node:20-alpine

WORKDIR /app

# Install dependencies (copy package files for caching)
COPY package*.json ./
RUN npm ci --production

# Copy source
COPY . .

# Build step if you have any build (optional)
# RUN npm run build

# Expose API port
EXPOSE 8000

# Default command: start API server
CMD ["node", "server.js"]
