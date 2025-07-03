# Use an official Node.js LTS image as the base image.
FROM node:18

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy package files for dependency installation.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application source code.
COPY . .

# Build the TypeScript code (output will go to the dist/ folder).
RUN npm run build

ENV NODE_ENV=production
ENV NETWORK_TYPE=mainnet
ENV PORT=3000
ENV DYNAMODB_TABLE=DepositIntentsMainnet

# Expose port 3000 (or the port used by your worker service).
EXPOSE 3000

# Start the worker service.
CMD [ "node", "dist/app.js" ]
