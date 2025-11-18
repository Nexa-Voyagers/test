# Docker Deployment for Varanasi Empire Solutions

Complete Docker containerization for all 22 business management solutions.

## Quick Start

```bash
# 1. Copy docker-compose template to your solution
cp shared/deployment/docker/docker-compose.template.yml 03-RESTAURANT-POS-MANAGEMENT/docker-compose.yml

# 2. Copy environment file
cp shared/deployment/docker/.env.example 03-RESTAURANT-POS-MANAGEMENT/.env

# 3. Configure environment
nano 03-RESTAURANT-POS-MANAGEMENT/.env

# 4. Start all services
cd 03-RESTAURANT-POS-MANAGEMENT
docker-compose up -d

# 5. Check logs
docker-compose logs -f

# 6. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# API Docs: http://localhost:5000/api-docs
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx (80/443)                       │
│              (Reverse Proxy + SSL)                      │
└────────────┬────────────────────────┬───────────────────┘
             │                        │
             ▼                        ▼
    ┌────────────────┐      ┌──────────────────┐
    │   Frontend     │      │     Backend      │
    │   (Next.js)    │      │   (Express.js)   │
    │   Port 3000    │      │   Port 5000      │
    └────────────────┘      └────┬─────────┬───┘
                                 │         │
                    ┌────────────┘         └────────────┐
                    ▼                                   ▼
           ┌─────────────────┐                ┌─────────────┐
           │   PostgreSQL    │                │    Redis    │
           │   Port 5432     │                │  Port 6379  │
           └─────────────────┘                └─────────────┘
```

## Services

### PostgreSQL Database
- **Image:** `postgres:15-alpine`
- **Port:** 5432
- **Data:** Persistent volume
- **Init:** Auto-loads schema and demo data

### Redis Cache
- **Image:** `redis:7-alpine`
- **Port:** 6379
- **Usage:** Session storage, caching

### Backend API
- **Base:** `node:20-alpine`
- **Port:** 5000
- **Health:** `/health` endpoint

### Frontend UI
- **Base:** `node:20-alpine`
- **Port:** 3000
- **Framework:** Next.js 14

### Nginx (Optional)
- **Image:** `nginx:alpine`
- **Ports:** 80, 443
- **Features:** Reverse proxy, SSL, gzip, rate limiting

## Environment Variables

### Required
```env
SOLUTION_NAME=your-solution-name
DB_PASSWORD=secure-password
REDIS_PASSWORD=secure-redis-password
JWT_SECRET=your-jwt-secret-32-chars-min
```

### Optional
```env
BACKEND_PORT=5000
FRONTEND_PORT=3000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=production
```

## Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Restart Service
```bash
docker-compose restart backend
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

### Clean Everything
```bash
docker-compose down -v  # WARNING: Deletes all data
```

### Database Backup
```bash
docker-compose exec postgres pg_dump -U postgres restaurant_pos_db > backup.sql
```

### Database Restore
```bash
docker-compose exec -T postgres psql -U postgres restaurant_pos_db < backup.sql
```

## Production Deployment

### 1. Configure Environment
```bash
# Set production values
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

### 2. Enable SSL
```bash
# Place SSL certificates in nginx/ssl/
nginx/
  ssl/
    cert.pem
    key.pem
```

### 3. Update nginx.conf
- Set your domain in `server_name`
- Configure SSL paths

### 4. Start with SSL
```bash
docker-compose up -d
```

### 5. Setup Auto-Restart
```bash
# Add to /etc/systemd/system/your-solution.service
[Unit]
Description=Your Solution Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/path/to/your-solution
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target

# Enable service
sudo systemctl enable your-solution
sudo systemctl start your-solution
```

## Health Checks

All services include health checks:

```bash
# Check backend health
curl http://localhost:5000/health

# Check frontend
curl http://localhost:3000

# Check all containers
docker-compose ps
```

## Monitoring

### View Resource Usage
```bash
docker stats
```

### Container Logs
```bash
# Real-time logs
docker-compose logs -f --tail=100

# Save logs to file
docker-compose logs > app-logs.txt
```

## Troubleshooting

### Service Won't Start
```bash
# Check logs
docker-compose logs backend

# Check configuration
docker-compose config

# Rebuild image
docker-compose build backend --no-cache
```

### Database Connection Error
```bash
# Wait for database to be ready
docker-compose exec postgres pg_isready

# Check environment variables
docker-compose exec backend env | grep DB_
```

### Port Already in Use
```bash
# Change port in .env
BACKEND_PORT=5001
FRONTEND_PORT=3001
```

### Clear Everything and Restart
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

## Security Best Practices

1. **Change Default Passwords**
   - Generate strong passwords for DB, Redis, JWT

2. **Use Environment Variables**
   - Never commit `.env` file
   - Use secrets management in production

3. **Enable SSL**
   - Use Let's Encrypt or commercial SSL
   - Force HTTPS redirect

4. **Limit Exposed Ports**
   - Only expose 80/443 in production
   - Keep DB, Redis internal

5. **Regular Updates**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

6. **Backup Database**
   - Schedule regular backups
   - Store offsite

7. **Monitor Logs**
   - Set up log aggregation
   - Monitor for errors

## Scaling

### Horizontal Scaling (Multiple Instances)
```yaml
services:
  backend:
    deploy:
      replicas: 3

  frontend:
    deploy:
      replicas: 2
```

### Load Balancer
Use nginx upstream with multiple backends:
```nginx
upstream backend {
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Deploy with Docker Compose
  run: |
    docker-compose pull
    docker-compose up -d
```

### GitLab CI
```yaml
deploy:
  script:
    - docker-compose up -d --build
```

## Support

For issues or questions:
- Documentation: `/shared/deployment/docker/README.md`
- Email: support@varanasi-empire.com

---

**Version:** 1.0
**Last Updated:** November 2025
**Maintained by:** Varanasi Empire Solutions
