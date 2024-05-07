# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the tsconfig.json or jsconfig.json file to the working directory
COPY tsconfig.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .
COPY assets ./assets

# Build the Next.js application
RUN npm run build

# Expose the port on which the application will run
EXPOSE 8080

# Start the application
CMD ["npm", "start"]