# Stage 1: Build source code
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve bằng Nginx
FROM nginx:alpine
# Copy file build từ Stage 1 sang thư mục của Nginx
COPY --from=build /app/build /usr/share/nginx/html
# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]