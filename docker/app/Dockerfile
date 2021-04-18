FROM node:lts-alpine
WORKDIR /app/
COPY ../package*.json .
RUN npm install
EXPOSE 8080
COPY . .
CMD ["npm", "run", "dev"]