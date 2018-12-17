FROM node:8
RUN apt-get update
WORKDIR /app
COPY . /app
RUN npm install
CMD node server.js
EXPOSE 80

