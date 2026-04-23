

## 📋 Mục Lục

- [Kiến Trúc](#kiến-trúc)
- [Yêu Cầu Tiên Quyết](#yêu-cầu-tiên-quyết)
- [Cài Đặt và Chạy](#cài-đặt-và-chạy)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Cấu Trúc Project](#cấu-trúc-project)
- [Đóng Góp](#đóng-góp)

## 🏗️ Kiến Trúc

- **Backend**: Spring Boot 3.2.5 (Java 17+, Maven)
- **Frontend**: React 18+ (Node.js 18+)
- **Database**: Không sử dụng (có thể thêm sau)
- **CI/CD**: GitHub Actions (không dùng Docker)
- **Deployment**: Direct host deployment với Nginx reverse proxy

## 📋 Yêu Cầu Tiên Quyết

- **Java 17+** - Tải từ [Adoptium](https://adoptium.net/)
  - Windows: Tải file .msi và cài đặt, thêm vào PATH
  - Linux/Mac: Sử dụng package manager hoặc tải tar.gz và cấu hình PATH
- **Node.js 18+** - Tải từ [Node.js](https://nodejs.org/)
  - Windows: Tải installer .exe và cài đặt (bao gồm npm)
  - Linux/Mac: Sử dụng nvm hoặc tải tar.xz
- **Maven 3.9+** - Tải từ [Maven](https://maven.apache.org/) (hoặc sử dụng Maven Wrapper)
  - Windows: Tải zip, giải nén, thêm bin vào PATH
  - Linux/Mac: Sử dụng package manager
- **Git** - Tải từ [Git](https://git-scm.com/)
  - Windows: Tải installer và cài đặt
  - Linux/Mac: Đã có sẵn hoặc cài đặt qua package manager

Sau khi cài đặt, kiểm tra bằng lệnh:
```bash
java -version
node -v
npm -v
mvn -v
git --version
```

## 🚀 Cài Đặt và Chạy

### 1. Clone Repository

```bash
git clone <repository-url>
cd project
```

### 2. Chạy Development Environment

#### Backend

```bash
cd backend
./mvnw spring-boot:run
```

- Windows: `mvnw.cmd spring-boot:run`
- Backend sẽ chạy trên: http://localhost:8080
- API documentation: http://localhost:8080/swagger-ui.html (sau khi thêm Swagger)

#### Frontend

```bash
cd frontend
npm install
npm start
```

- Frontend sẽ chạy trên: http://localhost:3000
- Tự động reload khi thay đổi code

### 3. Truy Cập Ứng Dụng

Mở trình duyệt và truy cập:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/hello

## 📡 API Endpoints

### Backend API

- `GET /api/hello` - Trả về thông điệp chào mừng
- `GET /api/health` - Kiểm tra trạng thái service

### CORS Configuration

Backend được cấu hình để cho phép frontend truy cập từ:
- http://localhost:3000 (development)
- http://127.0.0.1:3000 (development)

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

- Windows: `mvnw.cmd test`

### Frontend Tests

```bash
cd frontend
npm test
```

## 🚢 Deployment

### Development Deployment

Sử dụng script `deploy.sh` để deploy lên server staging/production.

```bash
./deploy.sh
```

### Manual Deployment

Xem chi tiết trong [SERVER_SETUP_GUIDE.md](SERVER_SETUP_GUIDE.md)

#### Bước Cơ Bản:

1. **Build Backend:**
   ```bash
   cd backend
   ./mvnw clean package -DskipTests
   ```
   - Windows: `mvnw.cmd clean package -DskipTests`

2. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy lên Server:**
   - Copy `backend/target/*.jar` lên server
   - Copy `frontend/build/*` lên web server directory
   - Chạy backend với `java -jar *.jar`
   - Cấu hình Nginx reverse proxy

## 📁 Cấu Trúc Project

```
project/
├── backend/                    # Spring Boot application
│   ├── src/
│   │   ├── main/java/com/example/demo/
│   │   │   ├── DemoApplication.java
│   │   │   ├── config/CorsConfig.java
│   │   │   └── controller/ApiController.java
│   │   └── resources/application.properties
│   ├── target/                 # Build output
│   ├── pom.xml
│   └── mvnw                    # Maven wrapper
├── frontend/                   # React application
│   ├── src/
│   │   ├── App.js
│   │   ├── api/client.js
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
├── deploy.sh                   # Deployment script
├── SERVER_SETUP_GUIDE.md       # Server setup guide
└── README.md                   # This file
```

## 🤝 Đóng Góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Liên Hệ

Nếu có câu hỏi, vui lòng tạo issue trên GitHub.

Script sẽ build, copy files, restart services và health check.

## Build Cho Production

### Backend

```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

- Windows: `mvnw.cmd clean package -DskipTests` và `java -jar target\demo-0.0.1-SNAPSHOT.jar`

### Frontend

```bash
cd frontend
npm run build
```

Sau đó, phục vụ thư mục `build` bằng web server như Nginx hoặc Apache.

## Triển Khai Trên Host

### Backend

1. Build JAR:

   ```bash
   cd backend
   ./mvnw clean package -DskipTests
   ```

2. Chạy JAR:

   ```bash
   java -jar target/demo-0.0.1-SNAPSHOT.jar
   ```

3. Để chạy nền (background):

   ```bash
   nohup java -jar target/demo-0.0.1-SNAPSHOT.jar &
   ```

4. Tạo systemd service (Linux):
   Tạo file `/etc/systemd/system/backend.service`:

   ```
   [Unit]
   Description=Spring Boot Backend
   After=network.target

   [Service]
   Type=simple
   User=your-user
   WorkingDirectory=/path/to/project/backend
   ExecStart=/usr/bin/java -jar target/demo-0.0.1-SNAPSHOT.jar
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

   Sau đó:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable backend
   sudo systemctl start backend
   ```

### Frontend

1. Build production:

   ```bash
   cd frontend
   npm run build
   ```

2. Phục vụ bằng Nginx:
   - Copy thư mục `build` vào `/var/www/html/` hoặc thư mục của Nginx
   - Cấu hình Nginx để phục vụ trên port 80

Ví dụ cấu hình Nginx:

```
server {
    listen 80;
    server_name tuananh.local;
    root /var/www/html/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

1. Restart Nginx:

   ```bash
   sudo systemctl restart nginx
   ```

## Pipeline DevOps Chuẩn

### Môi Trường Deployment

- **Staging**: Branch `develop` → Deploy tự động lên staging server
- **Production**: Branch `main` → Deploy tự động lên production server

### Thiết Lập Pipeline

#### 📖 Hướng Dẫn Setup Server

**Chi tiết đầy đủ xem tại**: [SERVER_SETUP_GUIDE.md](SERVER_SETUP_GUIDE.md)

Hoặc chạy script tự động:

Trong repository GitHub > Settings > Secrets and variables > Actions:

**Staging**:

- `STAGING_HOST_IP`: IP của staging server
- `STAGING_SSH_USER`: SSH username
- `STAGING_SSH_PRIVATE_KEY`: Private key content

**Production**:

- `PROD_HOST_IP`: IP của production server
- `PROD_SSH_USER`: SSH username
- `PROD_SSH_PRIVATE_KEY`: Private key content

#### 4. Tạo Environments

Trong repository GitHub > Settings > Environments:

- Tạo environment `staging`
- Tạo environment `production`

### Quy Trình Deployment

1. **Develop feature** trên branch feature
2. **Merge vào `develop`** → Tự động deploy staging
3. **Test trên staging** (<http://staging-server:8081>)
4. **Merge `develop` vào `main`** → Tự động deploy production
5. **Monitor production** (<http://production-server>)

### Rollback

Nếu production có lỗi:

```bash
# Revert commit trên GitHub
git revert <commit-hash>
git push origin main
# Pipeline sẽ deploy version cũ
```

### Monitoring

Sau deploy, pipeline kiểm tra health check. Để monitor thêm:

- Logs backend: `journalctl -u backend -f`
- Logs Nginx: `tail -f /var/log/nginx/access.log`
- System resources: `htop` hoặc `top`

## Cách Sử Dụng

### API Endpoints

Backend hiện tại là ứng dụng cơ bản Spring Boot. Bạn cần thêm REST controllers để có endpoints thực tế. Ví dụ:

- GET / - Trang chủ Spring Boot mặc định

### Frontend

Frontend React phục vụ giao diện người dùng. Hiện tại là template mặc định, cần tùy chỉnh để kết nối với backend API.

## Giám Sát và Logging

- Logs của backend trong console hoặc file log
- Logs của frontend trong browser console
- Cân nhắc thêm công cụ giám sát như ELK stack cho production

## DevOps Standards

Pipeline này tuân thủ các chuẩn DevOps:

- **Continuous Integration**: Tự động build và test trên mỗi PR
- **Continuous Deployment**: Tự động deploy lên staging và production
- **Multi-Environment**: Tách biệt staging và production
- **Infrastructure as Code**: Cấu hình deploy qua scripts
- **Security**: SSH key-based authentication, environment protection
- **Monitoring**: Health check sau deploy
- **Rollback**: Git-based rollback strategy
- **Branching Strategy**: GitFlow với develop/main branches

Để cải thiện thêm:

- Thêm database migration scripts
- Thêm monitoring với Prometheus/Grafana
- Thêm alerting với Slack/email
- Thêm blue-green deployment
- Thêm automated testing cho staging

Dự án hiện tại là skeleton cơ bản. Để hoàn thiện theo chuẩn DevOps, bạn cần:

### Backend

- Thêm REST API endpoints thực tế
- Cấu hình CORS cho frontend
- Thêm logging và exception handling
- Thêm security (Spring Security)
- Thêm API documentation (Swagger)

## Thiếu Sót Và Cải Tiến

Dự án hiện tại là skeleton cơ bản. Để hoàn thiện theo chuẩn DevOps, bạn cần:

### Backend

- Thêm REST API endpoints thực tế
- Cấu hình CORS cho frontend
- Thêm logging và exception handling
- Thêm security (Spring Security)
- Thêm API documentation (Swagger)

### Frontend

- Tùy chỉnh App.js với logic thực tế
- Thêm API client để gọi backend
- Thêm error handling và loading states
- Thêm environment variables (.env)
- Thêm ESLint cho linting (để CI/CD pass)

### Triển Khai

- Cài đặt Nginx và cấu hình reverse proxy
- Thêm SSL/HTTPS
- Setup staging và production servers
- Thêm monitoring (Prometheus, Grafana)
- Thêm log rotation
