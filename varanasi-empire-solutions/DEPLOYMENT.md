# VARANASI EMPIRE SOLUTIONS - DEPLOYMENT GUIDE
## Complete Installation & Setup Instructions for All 12 Business Systems

**Version:** 1.0.0
**Last Updated:** November 2025

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start (One-Command Installation)](#quick-start)
3. [Individual System Installation](#individual-system-installation)
4. [Server Configuration](#server-configuration)
5. [Domain & SSL Setup](#domain-ssl-setup)
6. [Database Setup](#database-setup)
7. [Payment Gateway Configuration](#payment-gateway-configuration)
8. [WhatsApp & SMS Integration](#whatsapp-sms-integration)
9. [Backup & Recovery](#backup-recovery)
10. [Troubleshooting](#troubleshooting)
11. [Support](#support)

---

## 🖥️ System Requirements

### Minimum Requirements (For 1-2 Systems)

**Server:**
- CPU: 2 cores
- RAM: 4 GB
- Storage: 50 GB SSD
- OS: Ubuntu 20.04 LTS or CentOS 8+

**Network:**
- Bandwidth: 10 Mbps
- Static IP address (recommended)

### Recommended Requirements (For 3-5 Systems)

**Server:**
- CPU: 4 cores
- RAM: 8 GB
- Storage: 100 GB SSD
- OS: Ubuntu 20.04 LTS

**Network:**
- Bandwidth: 50 Mbps
- Static IP + Domain name

### Production Requirements (For 6+ Systems)

**Server:**
- CPU: 8 cores
- RAM: 16 GB
- Storage: 250 GB SSD
- OS: Ubuntu 22.04 LTS
- Load Balancer (optional)

**Network:**
- Bandwidth: 100 Mbps
- Multiple domains
- CDN (Cloudflare recommended)

### Software Prerequisites

```bash
# Required on server:
- Docker 20.10+
- Docker Compose 2.0+
- Git 2.30+
- Node.js 18+ (for local development)
- PostgreSQL 15+ (or use Docker)
```

---

## 🚀 Quick Start (One-Command Installation)

### Step 1: Clone Repository

```bash
git clone https://github.com/nexavoyagers/varanasi-empire-solutions.git
cd varanasi-empire-solutions
```

### Step 2: Run Installation Wizard

```bash
chmod +x install-master.sh
./install-master.sh
```

**The wizard will:**
1. Ask which systems you want to install (select 1-12)
2. Configure database credentials
3. Set up domain names
4. Generate SSL certificates
5. Configure payment gateways
6. Load demo data (optional)
7. Create admin users
8. Start all services

**Installation Time:** 10-30 minutes (depending on number of systems)

### Step 3: Access Systems

After installation:
- View access URLs: `./show-urls.sh`
- View admin credentials: `./show-credentials.sh`

---

## 📦 Individual System Installation

### Install Specific System

```bash
# Example: Install Hotel Management System only
cd 01-hotel-management-system
./install.sh

# Follow prompts:
# 1. Database credentials
# 2. Domain name
# 3. SSL certificate setup
# 4. Payment gateway keys
# 5. WhatsApp/SMS API keys
# 6. Load demo data? (Y/N)
```

### Manual Installation (Without Script)

```bash
# 1. Navigate to system directory
cd 01-hotel-management-system

# 2. Configure environment
cp .env.example .env
nano .env  # Edit configuration

# 3. Start with Docker Compose
cd docker
docker-compose up -d

# 4. Run migrations
docker-compose exec backend npm run migrate

# 5. Load demo data (optional)
docker-compose exec backend npm run seed

# 6. Access system
# Open browser: http://your-domain.com
# Admin: admin@demo.com / DemoPass@123
```

---

## 🔧 Server Configuration

### For Ubuntu 20.04/22.04

#### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 3. Install Required Tools

```bash
sudo apt install -y git nginx certbot python3-certbot-nginx
```

#### 4. Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 🌐 Domain & SSL Setup

### Option 1: Automatic SSL (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate (per domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured by certbot)
sudo systemctl status certbot.timer
```

### Option 2: Manual SSL Certificate

```bash
# Place your SSL certificate files:
/etc/ssl/certs/yourdomain.crt
/etc/ssl/private/yourdomain.key

# Update nginx configuration
sudo nano /etc/nginx/sites-available/yourdomain.conf
```

### Option 3: Cloudflare SSL (Recommended for Multiple Domains)

1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS (Full or Full Strict)
4. Create Origin Certificate
5. Install certificate on server

---

## 💾 Database Setup

### Option 1: Dockerized PostgreSQL (Recommended)

Already configured in `docker-compose.yml`

```bash
# Access PostgreSQL
docker-compose exec postgres psql -U hms_user -d hotel_management
```

### Option 2: External PostgreSQL Server

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database user
sudo -u postgres psql
CREATE USER hms_user WITH PASSWORD 'your_password';
CREATE DATABASE hotel_management OWNER hms_user;
\q

# Update .env file
DB_HOST=localhost
DB_PORT=5432
DB_USER=hms_user
DB_PASSWORD=your_password
DB_NAME=hotel_management
```

### Database Backup

```bash
# Automatic daily backups (already configured)
# Backups location: /var/backups/varanasi-empire/

# Manual backup
./scripts/backup.sh

# Restore from backup
./scripts/restore.sh backup_filename.sql
```

---

## 💳 Payment Gateway Configuration

### Razorpay Setup

1. **Create Account:** https://razorpay.com
2. **Get API Keys:**
   - Dashboard → Settings → API Keys
   - Copy Key ID and Key Secret
3. **Configure in .env:**
   ```bash
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
   ```
4. **Webhook Setup:**
   - Dashboard → Webhooks
   - URL: https://yourdomain.com/api/v1/webhooks/razorpay
   - Events: payment.authorized, payment.captured, payment.failed

### PhonePe Setup

1. **Merchant Account:** https://business.phonepe.com
2. **Get Credentials:**
   - Merchant ID
   - Salt Key
   - Salt Index
3. **Configure in .env:**
   ```bash
   PHONEPE_MERCHANT_ID=PGTESTPAYUAT
   PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
   PHONEPE_SALT_INDEX=1
   PHONEPE_ENV=PRODUCTION  # or UAT for testing
   ```

### Paytm Setup

1. **Merchant Account:** https://business.paytm.com
2. **Get Credentials:**
   - MID (Merchant ID)
   - Merchant Key
   - Website
3. **Configure in .env:**
   ```bash
   PAYTM_MID=your_mid
   PAYTM_MERCHANT_KEY=your_key
   PAYTM_WEBSITE=WEBSTAGING  # or DEFAULT for production
   ```

---

## 📱 WhatsApp & SMS Integration

### WhatsApp Business API (Twilio)

1. **Create Account:** https://www.twilio.com
2. **Get WhatsApp Sandbox** (for testing)
3. **Production Setup:**
   - Apply for WhatsApp Business API access
   - Get approved (24-48 hours)
   - Create message templates
4. **Configure in .env:**
   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=+14155238886  # Your WhatsApp number
   ```

### SMS Gateway (MSG91)

1. **Create Account:** https://msg91.com
2. **Get Auth Key:**
   - Dashboard → Settings → API
3. **Configure in .env:**
   ```bash
   MSG91_AUTH_KEY=your_auth_key
   MSG91_SENDER_ID=TXTIND  # Your approved sender ID
   MSG91_ROUTE=4  # 1=Promotional, 4=Transactional
   ```

### Email Service (SendGrid)

1. **Create Account:** https://sendgrid.com
2. **Get API Key:**
   - Settings → API Keys → Create API Key
3. **Verify Domain:**
   - Settings → Sender Authentication
4. **Configure in .env:**
   ```bash
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   SENDGRID_FROM_NAME=Hotel Name
   ```

---

## 🔄 Backup & Recovery

### Automated Backups

**Already configured in all systems:**

```bash
# Backup schedule (via cron):
# - Database: Daily at 2 AM
# - Files: Daily at 3 AM
# - Retention: 30 days

# View backup status
./scripts/backup-status.sh

# Configure backup settings
nano /etc/varanasi-empire/backup.conf
```

### Manual Backup

```bash
# Backup specific system
cd 01-hotel-management-system
./scripts/backup.sh

# Backup all systems
cd varanasi-empire-solutions
./backup-all.sh

# Backups saved to:
/var/backups/varanasi-empire/
```

### Restore from Backup

```bash
# List available backups
./scripts/list-backups.sh

# Restore specific backup
./scripts/restore.sh 01-hotel-management-system_2025-11-18_02-00.tar.gz

# Full system restore
./restore-all.sh backup_date
```

### Cloud Backup (Recommended for Production)

```bash
# Configure AWS S3 backup
nano .env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=varanasi-empire-backups

# Enable cloud backup
./scripts/enable-cloud-backup.sh
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Issue 1: Docker containers not starting

```bash
# Check Docker status
sudo systemctl status docker

# Restart Docker
sudo systemctl restart docker

# View container logs
docker-compose logs -f
```

#### Issue 2: Database connection failed

```bash
# Check PostgreSQL status
docker-compose ps

# Check credentials in .env
cat .env | grep DB_

# Test database connection
docker-compose exec postgres psql -U hms_user -d hotel_management
```

#### Issue 3: Port already in use

```bash
# Find process using port
sudo lsof -i :5000

# Kill process
sudo kill -9 PID

# Or change port in docker-compose.yml
ports:
  - "5001:5000"  # Changed from 5000 to 5001
```

#### Issue 4: SSL certificate not working

```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

#### Issue 5: Payment gateway not working

```bash
# Check API keys in .env
cat .env | grep RAZORPAY

# Test in demo mode first
# Check webhook logs
docker-compose logs backend | grep webhook
```

#### Issue 6: WhatsApp messages not sending

```bash
# Verify Twilio credentials
curl -X GET 'https://api.twilio.com/2010-04-01/Accounts.json' \
  -u YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN

# Check message logs
docker-compose logs backend | grep whatsapp

# Verify WhatsApp template approval status
```

### Performance Issues

#### High CPU Usage

```bash
# Check processes
htop

# Optimize Docker
docker system prune -a

# Increase resources in docker-compose.yml
resources:
  limits:
    cpus: '2.0'
    memory: 4G
```

#### High Memory Usage

```bash
# Check memory
free -h

# Restart services
docker-compose restart

# Check for memory leaks
docker stats
```

#### Slow Database Queries

```bash
# Enable query logging
# In PostgreSQL: postgresql.conf
log_min_duration_statement = 1000  # Log queries > 1 second

# Analyze slow queries
docker-compose exec postgres psql -U hms_user -d hotel_management
\x on
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

---

## 📞 Support

### Self-Service Resources

- **Documentation:** Each system has detailed docs in its folder
- **Video Tutorials:** https://learn.nexavoyagers.com
- **FAQ:** See FAQ.md in each system folder
- **Community Forum:** https://community.nexavoyagers.com

### Technical Support

**For Nexavoyagers Team:**
- **Email:** tech-support@nexavoyagers.com
- **WhatsApp:** +91-XXXXX-XXXXX
- **Phone:** +91-XXXXX-XXXXX (9 AM - 9 PM IST)
- **Emergency:** +91-XXXXX-XXXXX (24/7)

**For End Clients:**
- Contact your Nexavoyagers representative
- Email: support@nexavoyagers.com
- Support Portal: https://support.nexavoyagers.com

### Escalation

**Level 1:** Community Forum / Documentation
**Level 2:** Email Support (24-hour response)
**Level 3:** Phone/WhatsApp Support (4-hour response)
**Level 4:** Emergency Hotline (1-hour response)

---

## 🔐 Security Best Practices

### 1. Change Default Credentials

```bash
# IMMEDIATELY after installation:
# 1. Change admin password
# 2. Change database password
# 3. Regenerate JWT secret
# 4. Update .env with strong passwords
```

### 2. Enable Firewall

```bash
# Only allow necessary ports
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Regular Updates

```bash
# Update system packages weekly
sudo apt update && sudo apt upgrade -y

# Update Docker images monthly
docker-compose pull
docker-compose up -d
```

### 4. Monitor Logs

```bash
# Check for suspicious activity
tail -f /var/log/nginx/access.log
docker-compose logs -f backend
```

### 5. Enable 2FA

```bash
# Enable 2FA for admin users in settings
# Enforce 2FA policy for all staff
```

---

## 📈 Monitoring & Analytics

### Health Checks

```bash
# Check all systems
./scripts/health-check.sh

# Output:
# ✓ Hotel Management System: Running
# ✓ Temple Management System: Running
# ✓ Restaurant Management System: Running
# ...
```

### Performance Monitoring

**Pre-configured:**
- Prometheus (metrics collection)
- Grafana (visualization)
- Access: http://your-domain.com:3001

**Default Dashboards:**
- System resources (CPU, RAM, Disk)
- API response times
- Database performance
- Error rates
- User activity

---

## 🎓 Training Resources

### For Nexavoyagers Team

**Training Videos (Hindi):**
1. Installation & Setup (30 min)
2. Demo Walkthrough for Each System (10 min each)
3. Sales Pitch Examples (15 min)
4. Handling Common Objections (20 min)
5. Troubleshooting Basics (25 min)

**Access:** https://learn.nexavoyagers.com/team

### For End Clients

**Per System:**
- User Manual (PDF) - Hindi + English
- Video Tutorials (5-10 videos)
- Quick Reference Cards
- Staff Training Checklist

---

## 📅 Maintenance Schedule

### Daily
- ✅ Automated backups
- ✅ Health checks
- ✅ Log review (automated alerts)

### Weekly
- ✅ Review error logs
- ✅ Check disk space
- ✅ Review backup integrity

### Monthly
- ✅ Update Docker images
- ✅ Security audit
- ✅ Performance optimization
- ✅ Update SSL certificates (if needed)

### Quarterly
- ✅ Major version upgrades
- ✅ Infrastructure review
- ✅ Disaster recovery test
- ✅ Client feedback review

---

## 🚀 Production Deployment Checklist

### Pre-Launch

- [ ] Server provisioned with recommended specs
- [ ] Domain registered and DNS configured
- [ ] SSL certificate installed
- [ ] Database configured and backed up
- [ ] Payment gateway tested in sandbox
- [ ] WhatsApp/SMS tested
- [ ] Email sending tested
- [ ] Demo data loaded and verified
- [ ] Admin users created
- [ ] Staff training completed
- [ ] Documentation reviewed

### Launch Day

- [ ] Final backup taken
- [ ] Switch payment gateway to production
- [ ] Monitor logs in real-time
- [ ] Test all critical workflows
- [ ] Announce go-live to users
- [ ] Support team on standby

### Post-Launch (First Week)

- [ ] Daily health checks
- [ ] Monitor error rates
- [ ] Collect user feedback
- [ ] Address any issues immediately
- [ ] Performance tuning if needed

---

## 💡 Optimization Tips

### For Better Performance

1. **Enable Caching**
   - Redis for session storage
   - CDN for static assets
   - Browser caching headers

2. **Database Optimization**
   - Regular VACUUM
   - Index optimization
   - Query optimization

3. **Image Optimization**
   - Compress images before upload
   - Use WebP format
   - Lazy loading

4. **Code Optimization**
   - Enable production mode
   - Minimize API calls
   - Use pagination

---

## 🎉 You're All Set!

Your Varanasi Empire Solutions are now deployed and ready to transform businesses!

**Next Steps:**
1. Complete staff training
2. Load real data (replace demo)
3. Customize branding
4. Start selling!

**Questions?** Contact support@nexavoyagers.com

---

**Built with ❤️ by Nexavoyagers for Varanasi's Digital Transformation**

*Version 1.0.0 | Last Updated: November 2025*
