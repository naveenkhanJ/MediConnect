# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for better caching
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only production dependencies and source
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/index.js ./index.js

# Use non-root user
USER node

# Port exposed by API Gateway
EXPOSE 4000

# Health check using wget (built-in to alpine)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "index.js"]
