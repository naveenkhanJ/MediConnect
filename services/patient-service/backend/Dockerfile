# Step 1: Use Node.js LTS image
FROM node:18

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the code
COPY . .

# Step 6: Expose the port your service runs on
EXPOSE 3001

# Step 7: Start the server
CMD ["node", "index.js"]