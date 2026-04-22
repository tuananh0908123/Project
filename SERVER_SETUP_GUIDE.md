# Server Setup Guide

## 📋 Yêu Cầu

- **OS**: Ubuntu 20.04 LTS hoặc mới hơn
- **RAM**: Ít nhất 2GB (4GB khuyến nghị)
- **Disk**: Ít nhất 20GB
- **Network**: Truy cập được SSH (port 22) và HTTP (port 80, 8081 cho staging)

## 🚀 Cách Setup Staging Server

### Bước 1: Tạo Server

**Trên AWS EC2**:

```bash
# Tạo instance Ubuntu 20.04 LTS
# Mở inbound rules cho:
# - Port 22 (SSH) từ GitHub Actions IP hoặc your IP
# - Port 80 (HTTP)
# - Port 8081 (Staging app)
```

**Trên DigitalOcean/Linode**:

- Tạo Ubuntu 20.04 droplet
- Ghi chú IP address

### Bước 2: SSH vào Server

```bash
ssh -i your-key.pem ubuntu@your-server-ip
```

### Bước 3: Chạy Setup Script

```bash
# Download script
curl -O https://raw.githubusercontent.com/your-repo/main/setup-staging-server.sh

# Hoặc copy-paste từ file setup-staging-server.sh
nano setup-staging-server.sh

# Chạy script
sudo bash setup-staging-server.sh
```

### Bước 4: Manual Setup (Nếu không dùng script)

#### 4.1 Update system

```bash
sudo apt update
sudo apt upgrade -y
```

#### 4.2 Cài Java 17

```bash
sudo apt install -y openjdk-17-jdk
java -version
```

#### 4.3 Cài Maven (optional, chỉ cần nếu build trên server)

```bash
sudo apt install -y maven
mvn --version
```

#### 4.4 Cài Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 4.5 Tạo directories

```bash
sudo mkdir -p /opt/staging/backend
sudo mkdir -p /var/www/staging
sudo chown -R $USER:$USER /opt/staging/backend
sudo chown -R $USER:$USER /var/www/staging
```

#### 4.6 Tạo systemd service cho backend

```bash
sudo tee /etc/systemd/system/backend-staging.service > /dev/null <<EOF
[Unit]
Description=Spring Boot Backend (Staging)
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/opt/staging/backend
ExecStart=/usr/bin/java -jar /opt/staging/backend/demo-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable backend-staging
```

#### 4.7 Cấu hình Nginx

```bash
sudo tee /etc/nginx/sites-available/staging > /dev/null <<'EOF'
server {
    listen 8081;
    server_name _;
    root /var/www/staging;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Enable config
sudo ln -sf /etc/nginx/sites-available/staging /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test và start
sudo nginx -t
sudo systemctl restart nginx
```

## 🔑 Thiết Lập SSH Access Cho GitHub Actions

### Bước 1: Tạo SSH key trên GitHub Actions runner

Chạy trong terminal local:

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions-staging" -f ~/.ssh/github_rsa_staging -N ""
```

### Bước 2: Copy public key lên server

```bash
ssh-copy-id -i ~/.ssh/github_rsa_staging.pub user@staging-server-ip
```

Hoặc manual:

```bash
# Trên local
cat ~/.ssh/github_rsa_staging.pub

# Trên server
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste public key
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Bước 3: Test SSH connection

```bash
ssh -i ~/.ssh/github_rsa_staging user@staging-server-ip "echo 'SSH works!'"
```

## 📝 Thêm GitHub Secrets

Trong repository GitHub:

1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** - Thêm những secrets sau:

```
STAGING_HOST_IP = your-staging-server-ip
STAGING_SSH_USER = ubuntu (hoặc user name)
STAGING_SSH_PRIVATE_KEY = (nội dung ~/.ssh/github_rsa_staging, KHÔNG .pub)
```

### Cách copy private key

```bash
# Trên local
cat ~/.ssh/github_rsa_staging | xclip -selection clipboard
# Hoặc
cat ~/.ssh/github_rsa_staging
# Copy-paste vào GitHub secret
```

## ✅ Thiết Lập GitHub Environments

1. **Settings** → **Environments**
2. Click **New environment**
3. Tạo environment `staging`
4. (Optional) Thêm deployment protection rules

## 🧪 Test Deploy

### Cách 1: Push code lên `develop` branch

```bash
git add .
git commit -m "Setup staging server"
git push origin develop
```

GitHub Actions sẽ tự động:

1. Build backend & frontend
2. Upload artifacts
3. Deploy lên staging server

### Cách 2: Manual test với script

```bash
./deploy.sh staging
```

## 📊 Kiểm Tra Status

### Kiểm tra services

```bash
# Backend status
sudo systemctl status backend-staging

# Nginx status
sudo systemctl status nginx

# Check listening ports
sudo ss -tlnp | grep -E ':(8081|8082)'
```

### Xem logs

```bash
# Backend logs
sudo journalctl -u backend-staging -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Health check

```bash
# Frontend
curl -I http://localhost:8081/

# Backend API
curl http://localhost:8082/api/hello
```

## 🔒 Security Best Practices

1. **Firewall**:

   ```bash
   sudo ufw enable
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 8081/tcp
   sudo ufw allow 8082/tcp
   ```

2. **SSH Key**: Không share private key, chỉ dùng cho CI/CD

3. **Updates**: Định kỳ update system

   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **Monitoring**: Cài fail2ban để bảo vệ SSH

   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

## 🚨 Troubleshooting

### Deploy fail

```bash
# Check logs
sudo journalctl -u backend-staging -n 50
sudo tail -50 /var/log/nginx/error.log

# Check disk space
df -h

# Check memory
free -h

# Check ports
sudo ss -tlnp
```

### SSH connection fail

```bash
# Test SSH
ssh -v -i ~/.ssh/github_rsa_staging ubuntu@staging-ip

# Check authorized_keys
cat ~/.ssh/authorized_keys
```

### Nginx config error

```bash
# Test config
sudo nginx -t

# Reload config
sudo systemctl reload nginx
```

## ⏭️ Tiếp Theo: Setup Production Server

Sau khi staging work, lặp lại quy trình cho production:

1. Tạo production server
2. Chạy setup script
3. Tạo SSH keys cho production
4. Thêm GitHub secrets: `PROD_HOST_IP`, `PROD_SSH_USER`, `PROD_SSH_PRIVATE_KEY`
5. Tạo GitHub environment `production`
6. Push lên `main` branch để test
