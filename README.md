# Ứng Dụng Full-Stack

Dự án này là một ứng dụng full-stack với backend Spring Boot và frontend React, chạy trực tiếp trên host theo chuẩn DevOps.

## Kiến Trúc

- **Backend**: Ứng dụng Spring Boot (Java 17, Maven)
- **Frontend**: Ứng dụng React (Node.js 18)
- **CI/CD**: GitHub Actions (không dùng Docker)

## Yêu Cầu Tiên Quyết

- Java 17 (để chạy backend) - Tải từ <https://adoptium.net/>
- Node.js 18 (để chạy frontend) - Tải từ <https://nodejs.org/>
- Maven 3.9+ (để build backend) - Tải từ <https://maven.apache.org/>
- Git (để clone repository)

## Cách Chạy Ứng Dụng

### 1. Cài Đặt Môi Trường

Trước tiên, cài đặt các công cụ cần thiết:

#### Windows

- **Java 17**: Tải từ <https://adoptium.net/> và thêm vào PATH
- **Node.js 18**: Tải từ <https://nodejs.org/> và thêm vào PATH
- **Maven**: Tải từ <https://maven.apache.org/> và thêm vào PATH
- **Git**: Tải từ <https://git-scm.com/>

#### Linux/Ubuntu

```bash
# Java 17
sudo apt update
sudo apt install openjdk-17-jdk

# Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Maven
sudo apt install maven

# Git
sudo apt install git
```

### 2. Chạy Cục Bộ (Development)

1. Clone repository:

   ```bash
   git clone <repository-url>
   cd project
   ```

2. Chạy backend:

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

   - Backend chạy trên: <http://localhost:8080>
   - API docs: <http://localhost:8080/swagger-ui.html> (sau khi thêm Swagger)

3. Chạy frontend (trong terminal khác):

   ```bash
   cd frontend
   npm install
   npm start
   ```

   - Frontend chạy trên: <http://localhost:3000>
   - Tự động reload khi thay đổi code

### 3. Chạy Production Trên Host

#### Chuẩn Bị Server

1. Cài đặt Java, Node.js, Maven như trên
2. Cài đặt Nginx:

   ```bash
   sudo apt update
   sudo apt install nginx
   ```

3. Tạo thư mục:

   ```bash
   sudo mkdir -p /opt/backend
   sudo mkdir -p /var/www/html
   sudo chown -R $USER:$USER /opt/backend
   sudo chown -R $USER:$USER /var/www/html
   ```

#### Deploy Thủ Công

1. Build backend:

   ```bash
   cd backend
   ./mvnw clean package -DskipTests
   ```

2. Build frontend:

   ```bash
   cd frontend
   npm run build
   ```

3. Copy files lên server (hoặc build trực tiếp trên server):

   ```bash
   scp backend/target/demo-0.0.1-SNAPSHOT.jar user@server:/opt/backend/
   scp -r frontend/build/* user@server:/var/www/html/
   ```

4. Chạy backend:

   ```bash
   ssh user@server
   cd /opt/backend
   java -jar demo-0.0.1-SNAPSHOT.jar
   ```

5. Cấu hình Nginx (file `/etc/nginx/sites-available/default`):

   ```
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api {
           proxy_pass http://localhost:8080;
       }
   }
   ```

6. Restart Nginx:

   ```bash
   sudo systemctl restart nginx
   ```

#### Sử Dụng Script Deploy

Project có script `deploy.sh` để deploy tự động:

```bash
# Deploy to staging
./deploy.sh staging

# Deploy to production
./deploy.sh production
```

Script sẽ build, copy files, restart services và health check.

## Build Cho Production

### Backend

```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

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

## Đóng Góp

1. Fork repository
2. Tạo nhánh feature
3. Thực hiện thay đổi và thêm tests
4. Gửi pull request

## Giấy Phép

[Thêm giấy phép của bạn ở đây]
