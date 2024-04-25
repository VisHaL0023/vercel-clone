# Specify base image
FROM node:20-alpine

# Specify working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 9000
EXPOSE 9000

# Run the app
CMD ["npm run dev"]