# Modern base image
FROM node:22

# Optional metadata
LABEL maintainer="David Garcia Beatove david.garciab@vargroupiberia.com"

# Working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for dependency caching)
COPY package*.json ./

# Install dependencies in production mode
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose the port (can be overridden with .env)
EXPOSE 8080

# Startup command
CMD ["node", "index.js"]
