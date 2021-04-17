FROM node:14-alpine
WORKDIR /
COPY ../package*.json ./
RUN npm install
EXPOSE 8080
COPY . .
CMD ["npm", "start"]