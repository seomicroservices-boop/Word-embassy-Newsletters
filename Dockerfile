# Use standard Node 20 LTS
FROM node:20-slim

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install all dependencies (including devDependencies required for build)
RUN npm install

# Copy source code
COPY . .

# Build Vite client and Express server bundle
RUN npm run build

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Start production server
CMD ["node", "dist/server.cjs"]
