FROM node:18

# Create app directory
WORKDIR /opensearch-poc

# Expose port 8080
EXPOSE 8080

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .


CMD ["npm", "start"]
