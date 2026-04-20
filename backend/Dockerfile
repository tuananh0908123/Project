
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Giai đoạn 2: Run (Dùng bản Java 17 nhẹ của Amazon Corretto)
FROM amazoncorretto:17-alpine
WORKDIR /app
# Tự động lấy file jar mà không cần quan tâm tên cụ thể
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]