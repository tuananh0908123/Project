# Sử dụng base image Java 17 siêu nhẹ
FROM eclipse-temurin:17-jdk-alpine

# Thư mục làm việc trong container
WORKDIR /app

# Copy file jar đã build vào container (Giả sử file build ra tên là app.jar)
COPY target/*.jar app.jar

# Mở cổng 8080
EXPOSE 8080

# Lệnh chạy ứng dụng
ENTRYPOINT ["java","-jar","app.jar"]