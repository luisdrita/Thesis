FROM node:9
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
CMD node server.js
EXPOSE 3000
