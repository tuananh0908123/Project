#!/bin/bash

# Deploy script for manual deployment
# Usage: ./deploy.sh [staging|production]

ENVIRONMENT=$1

if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "Usage: $0 [staging|production]"
    exit 1
fi

echo "Deploying to $ENVIRONMENT environment"

# Build backend
echo "Building backend..."
cd backend
./mvnw clean package -DskipTests

# Build frontend
echo "Building frontend..."
cd ../frontend
npm run build

# Deploy based on environment
if [ "$ENVIRONMENT" = "staging" ]; then
    BACKEND_DIR="/opt/staging/backend"
    FRONTEND_DIR="/var/www/staging"
    SERVICE_NAME="backend-staging"
    NGINX_SERVICE="nginx-staging"
    HEALTH_URL="http://localhost:8081/"
else
    BACKEND_DIR="/opt/backend"
    FRONTEND_DIR="/var/www/html"
    SERVICE_NAME="backend"
    NGINX_SERVICE="nginx"
    HEALTH_URL="http://localhost/"
fi

echo "Stopping services..."
sudo systemctl stop $SERVICE_NAME || true
sudo systemctl stop $NGINX_SERVICE || true

echo "Deploying backend..."
sudo cp ../backend/target/demo-0.0.1-SNAPSHOT.jar $BACKEND_DIR/
sudo systemctl start $SERVICE_NAME

echo "Deploying frontend..."
sudo rm -rf $FRONTEND_DIR/*
sudo cp -r build/* $FRONTEND_DIR/
sudo systemctl start $NGINX_SERVICE

echo "Waiting for services to start..."
sleep 10

echo "Health check..."
if curl -f $HEALTH_URL; then
    echo "✅ Deployment to $ENVIRONMENT successful!"
else
    echo "❌ Health check failed!"
    exit 1
fi