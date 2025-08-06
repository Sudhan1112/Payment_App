# Use a full Node 20 base image, not Alpine (Alpine is minimal but breaks native builds)
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install Python and build tools needed for native packages
RUN apt-get update && \
    apt-get install -y python3 g++ make && \
    npm install

# Copy the rest of your code
COPY . .

# Build Next.js app
RUN npm run build

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
