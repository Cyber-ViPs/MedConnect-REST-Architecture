FROM node:20-bookworm-slim

WORKDIR /app

# Copy package files first to leverage Docker cache for node_modules
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install && \
    npm install jsonwebtoken nodemailer cors helmet
RUN npm install cors helmet
COPY . .

EXPOSE 3000
LABEL description="Node.js REST API - Medical Database System" \
      version="1.2.0" \
      maintainer="Cyber-ViPs <teste.systems1@gmail.com>"

CMD ["npm", "start"]
