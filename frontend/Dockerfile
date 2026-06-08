# Use node image for local development
FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose Vite development server port
EXPOSE 5173

# Run the dev server and bind to host to allow external connections
CMD ["npm", "run", "dev", "--", "--host"]
