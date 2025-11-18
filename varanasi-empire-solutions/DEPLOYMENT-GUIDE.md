# 🚀 Varanasi Empire Solutions - Complete Deployment Guide

**Comprehensive deployment documentation for all 22 business management solutions**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Local Development](#local-development)
4. [Docker Deployment](#docker-deployment)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Production Deployment](#production-deployment)
7. [Environment Configuration](#environment-configuration)
8. [Database Setup](#database-setup)
9. [Troubleshooting](#troubleshooting)
10. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Software Requirements

#### Required
- **Node.js** 20 LTS or higher
- **PostgreSQL** 15+ with PostGIS and TimescaleDB extensions
- **Redis** 7+ (for caching and sessions)
- **Git** 2.0+
- **Docker** 24+ (for containerized deployment)
- **Kubernetes** 1.28+ (for K8s deployment)

#### Optional
- **Docker Compose** 2.20+
- **kubectl** 1.28+
- **Nginx** 1.24+ (for reverse proxy)
- **PM2** 5+ (for process management)

### System Requirements

#### Minimum
- CPU: 4 cores
- RAM: 8 GB
- Storage: 50 GB SSD
- Bandwidth: 10 Mbps

#### Recommended
- CPU: 8+ cores
- RAM: 16+ GB
- Storage: 100+ GB NVMe SSD
- Bandwidth: 100 Mbps

---

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd varanasi-empire-solutions
```

### 2. Choose Your Solution

```bash
# Example: Restaurant POS Management
cd 03-RESTAURANT-POS-MANAGEMENT
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Configure Environment

```bash
# Backend
cp .env.example .env
nano .env  # Update with your credentials

# Frontend
cp .env.example .env.local
nano .env.local  # Update API URL
```

### 5. Setup Database

```bash
# Create database
createdb restaurant_pos_db

# Load schema
psql restaurant_pos_db < database/complete-schema.sql

# Load demo data (optional)
psql restaurant_pos_db < ../shared/database/demo-data-generator.sql
psql restaurant_pos_db < database/demo-data.sql
```

### 6. Start Services

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 7. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs

---

## Local Development

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Build for production
npm run build
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

### Database Migrations

```bash
# Run migrations
npm run migrate

# Create new migration
npm run migrate:create <migration-name>

# Rollback migration
npm run migrate:rollback
```

---

## Docker Deployment

### Using Docker Compose (Recommended for Single Server)

#### 1. Copy Configuration Files

```bash
# Copy docker-compose template
cp shared/deployment/docker/docker-compose.template.yml docker-compose.yml

# Copy environment file
cp shared/deployment/docker/.env.example .env
```

#### 2. Configure Environment

```bash
nano .env

# Update these critical values:
SOLUTION_NAME=restaurant-pos
DB_PASSWORD=<strong-password>
REDIS_PASSWORD=<strong-password>
JWT_SECRET=<strong-secret-32-chars>
```

#### 3. Build and Start Services

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

#### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432
- **Redis**: localhost:6379

#### 5. Stop Services

```bash
# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

### Production Docker Deployment

#### 1. Enable SSL

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Copy SSL certificates
cp /path/to/cert.pem nginx/ssl/
cp /path/to/key.pem nginx/ssl/
```

#### 2. Update nginx.conf

```bash
cp shared/deployment/docker/nginx.conf nginx/

# Edit domain name
nano nginx/nginx.conf
# Update: server_name yourdomain.com;
```

#### 3. Configure Production Environment

```bash
nano .env

# Production settings
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

#### 4. Start with SSL

```bash
docker-compose up -d
```

---

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (GKE, EKS, AKS, or on-premise)
- kubectl configured
- Helm 3+ (optional)
- Metrics Server installed
- Ingress Controller installed (nginx-ingress)
- Cert-Manager installed (for SSL)

### 1. Configure Secrets

```bash
cd shared/deployment/kubernetes

# Create namespace
kubectl apply -f namespace.yaml

# Update secrets
cp secrets.yaml secrets-prod.yaml
nano secrets-prod.yaml

# Update all values with base64 encoded secrets:
echo -n "your-password" | base64
```

### 2. Update ConfigMap

```bash
nano configmap.yaml

# Update domain names, API URLs, etc.
```

### 3. Deploy Infrastructure

```bash
# Deploy in order
kubectl apply -f pv.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets-prod.yaml
kubectl apply -f postgres-statefulset.yaml
kubectl apply -f postgres-service.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f redis-service.yaml
```

### 4. Deploy Application

```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa.yaml
```

### 5. Verify Deployment

```bash
# Check pods
kubectl get pods -n varanasi-empire

# Check services
kubectl get svc -n varanasi-empire

# Check ingress
kubectl get ingress -n varanasi-empire

# View logs
kubectl logs -f deployment/backend -n varanasi-empire
```

### 6. Using Kustomize (Alternative)

```bash
# Deploy everything with one command
kubectl apply -k shared/deployment/kubernetes/

# For different environments
kubectl apply -k shared/deployment/kubernetes/overlays/production/
```

---

## Production Deployment

### Option 1: Single Server with Docker

**Best for**: Small to medium businesses, 100-500 concurrent users

```bash
# 1. Setup server (Ubuntu 22.04 recommended)
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Clone and configure
git clone <repo>
cd varanasi-empire-solutions/03-RESTAURANT-POS-MANAGEMENT
cp shared/deployment/docker/.env.example .env
nano .env

# 5. Deploy
docker-compose up -d

# 6. Setup auto-start
sudo nano /etc/systemd/system/restaurant-pos.service
# Add service configuration
sudo systemctl enable restaurant-pos
sudo systemctl start restaurant-pos
```

### Option 2: Multi-Server with Load Balancer

**Best for**: Large enterprises, 1000+ concurrent users

**Architecture**:
```
Load Balancer (Nginx)
    ├── Frontend Server 1 (Next.js)
    ├── Frontend Server 2 (Next.js)
    ├── Backend Server 1 (Express)
    ├── Backend Server 2 (Express)
    └── Backend Server 3 (Express)

Database Cluster
    ├── PostgreSQL Primary
    └── PostgreSQL Replicas (2)

Cache Cluster
    ├── Redis Primary
    └── Redis Replicas (2)
```

### Option 3: Kubernetes Cluster

**Best for**: Enterprise scale, multi-region, auto-scaling

```bash
# 1. Setup K8s cluster (GKE example)
gcloud container clusters create varanasi-empire \
  --num-nodes=3 \
  --machine-type=n1-standard-4 \
  --zone=asia-south1-a

# 2. Install prerequisites
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
helm install nginx-ingress ingress-nginx/ingress-nginx
helm install cert-manager jetstack/cert-manager

# 3. Deploy application
kubectl apply -k shared/deployment/kubernetes/

# 4. Setup monitoring
helm install prometheus prometheus-community/kube-prometheus-stack
```

---

## Environment Configuration

### Backend Environment Variables

```env
# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_pos_db
DB_USER=postgres
DB_PASSWORD=<secure-password>

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=<secure-password>

# JWT
JWT_SECRET=<32-character-secret>
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=https://yourdomain.com

# Payment Gateway
RAZORPAY_KEY_ID=<your-key>
RAZORPAY_KEY_SECRET=<your-secret>

# SMS/Email
MSG91_AUTH_KEY=<your-key>
SENDGRID_API_KEY=<your-key>
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_NAME=Restaurant POS
```

---

## Database Setup

### 1. Install PostgreSQL 15+

```bash
# Ubuntu/Debian
sudo apt install postgresql-15 postgresql-contrib-15

# Enable extensions
sudo -u postgres psql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "timescaledb";
```

### 2. Create Database

```bash
sudo -u postgres createdb restaurant_pos_db
```

### 3. Load Schema

```bash
psql -U postgres -d restaurant_pos_db -f database/complete-schema.sql
```

### 4. Load Demo Data (Optional)

```bash
psql -U postgres -d restaurant_pos_db -f shared/database/demo-data-generator.sql
psql -U postgres -d restaurant_pos_db -f database/demo-data.sql
```

### 5. Backup Database

```bash
# Create backup
pg_dump -U postgres restaurant_pos_db > backup-$(date +%Y%m%d).sql

# Restore backup
psql -U postgres restaurant_pos_db < backup-20251118.sql
```

---

## Troubleshooting

### Common Issues

#### Database Connection Error

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U postgres -h localhost -p 5432

# Fix: Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Port Already in Use

```bash
# Find process using port
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

#### Docker Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Rebuild image
docker-compose build --no-cache backend

# Restart service
docker-compose restart backend
```

#### Out of Memory

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm start

# Or in package.json:
"scripts": {
  "start": "node --max-old-space-size=4096 src/server.js"
}
```

---

## Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl http://localhost:5000/health

# Frontend health
curl http://localhost:3000

# Database health
psql -U postgres -c "SELECT 1"
```

### Log Management

```bash
# View backend logs
tail -f backend/logs/combined.log

# Docker logs
docker-compose logs -f --tail=100

# K8s logs
kubectl logs -f deployment/backend -n varanasi-empire
```

### Performance Monitoring

```bash
# Check resource usage
docker stats

# Database performance
psql -U postgres -d restaurant_pos_db
SELECT * FROM pg_stat_activity;

# Node.js memory profiling
node --inspect src/server.js
```

### Backup Automation

```bash
# Create backup script
nano /opt/backup.sh

#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
pg_dump -U postgres restaurant_pos_db > /backups/db-$DATE.sql
find /backups -mtime +7 -delete  # Keep 7 days

# Schedule with cron
crontab -e
0 2 * * * /opt/backup.sh
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets (32+ characters)
- [ ] Enable SSL/TLS certificates
- [ ] Configure firewall (allow only necessary ports)
- [ ] Set up fail2ban for brute force protection
- [ ] Enable database encryption at rest
- [ ] Regular security updates
- [ ] Implement rate limiting
- [ ] Enable CORS with specific origins
- [ ] Set up WAF (Web Application Firewall)
- [ ] Regular security audits
- [ ] Backup encryption

---

## Support

For issues or questions:
- **Email**: support@varanasi-empire.com
- **Documentation**: See individual README files in each solution
- **GitHub Issues**: <repository-url>/issues

---

**Last Updated**: November 18, 2025
**Version**: 1.0.0
**Maintained by**: Varanasi Empire Solutions Team
