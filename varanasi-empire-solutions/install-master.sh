#!/bin/bash

###################################################################################
# VARANASI EMPIRE SOLUTIONS - MASTER INSTALLATION SCRIPT
# Version: 1.0.0
# Author: Nexavoyagers Development Team
#
# This script installs one or more business management systems with full
# configuration, demo data, and production-ready setup.
###################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     VARANASI EMPIRE - BUSINESS SOLUTIONS INSTALLER           ║
║                                                              ║
║     Complete Digital Transformation Package                 ║
║     12 Production-Ready Business Management Systems         ║
║                                                              ║
║     © 2025 Nexavoyagers Digital Solutions                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
   echo -e "${RED}Please do not run this script as root${NC}"
   exit 1
fi

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}✗ $1 is not installed${NC}"
        echo -e "${YELLOW}Please install $1 first${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ $1 found${NC}"
    fi
}

check_command docker
check_command docker-compose
check_command git

# System selection menu
echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}           SELECT SYSTEMS TO INSTALL                    ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

echo "Select the systems you want to install (space-separated numbers, or 'all'):"
echo ""
echo "  1)  Hotel Management System (₹40-60k/month)"
echo "  2)  Temple Management System (₹25-40k/month)"
echo "  3)  Restaurant Management System (₹20-35k/month)"
echo "  4)  Education Management System (₹25-40k/month)"
echo "  5)  Saree E-commerce System (₹30-50k/month)"
echo "  6)  Travel & Tourism System (₹15-25k/month)"
echo "  7)  Health & Wellness System (₹20-35k/month)"
echo "  8)  Professional Services CRM (₹20-35k/month)"
echo "  9)  Laundry Management System (₹15-25k/month)"
echo "  10) Home Services System (₹12-20k/month)"
echo "  11) Food Production System (₹15-30k/month)"
echo "  12) Arts & Crafts E-commerce (₹12-20k/month)"
echo ""
echo -n "Your choice (e.g., '1 3 5' or 'all'): "
read -r SELECTION

# Parse selection
SYSTEMS=()
if [ "$SELECTION" = "all" ]; then
    SYSTEMS=(1 2 3 4 5 6 7 8 9 10 11 12)
else
    SYSTEMS=($SELECTION)
fi

# System directory mapping
declare -A SYSTEM_DIRS=(
    [1]="01-hotel-management-system"
    [2]="02-temple-management-system"
    [3]="03-restaurant-management-system"
    [4]="04-education-management-system"
    [5]="05-saree-ecommerce-system"
    [6]="06-travel-tourism-system"
    [7]="07-health-wellness-system"
    [8]="08-professional-services-crm"
    [9]="09-laundry-management-system"
    [10]="10-home-services-system"
    [11]="11-food-production-system"
    [12]="12-arts-crafts-ecommerce"
)

declare -A SYSTEM_NAMES=(
    [1]="Hotel Management System"
    [2]="Temple Management System"
    [3]="Restaurant Management System"
    [4]="Education Management System"
    [5]="Saree E-commerce System"
    [6]="Travel & Tourism System"
    [7]="Health & Wellness System"
    [8]="Professional Services CRM"
    [9]="Laundry Management System"
    [10]="Home Services System"
    [11]="Food Production System"
    [12]="Arts & Crafts E-commerce"
)

echo -e "\n${GREEN}Selected systems:${NC}"
for sys in "${SYSTEMS[@]}"; do
    echo -e "  ✓ ${SYSTEM_NAMES[$sys]}"
done

# Confirm installation
echo -e "\n${YELLOW}This will install ${#SYSTEMS[@]} system(s).${NC}"
echo -n "Continue? (y/n): "
read -r CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "Installation cancelled."
    exit 0
fi

# Load demo data?
echo -e "\n${BLUE}Load demo data?${NC}"
echo "Demo data includes realistic business scenarios for demonstration."
echo -n "Load demo data? (y/n): "
read -r LOAD_DEMO

# Configure database
echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}           DATABASE CONFIGURATION                       ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

echo -n "Database username [default: empire_user]: "
read -r DB_USER
DB_USER=${DB_USER:-empire_user}

echo -n "Database password [auto-generate]: "
read -rs DB_PASSWORD
echo ""
if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated secure password${NC}"
fi

# Configure domain
echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}           DOMAIN CONFIGURATION                         ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

echo "Enter domain name (e.g., example.com) or press Enter to use localhost:"
echo -n "Domain: "
read -r DOMAIN
DOMAIN=${DOMAIN:-localhost}

# SSL Setup
USE_SSL="n"
if [ "$DOMAIN" != "localhost" ]; then
    echo -n "Setup SSL certificate with Let's Encrypt? (y/n): "
    read -r USE_SSL
fi

# Payment Gateway
echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}           PAYMENT GATEWAY (Optional)                   ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

echo -n "Configure Razorpay now? (y/n): "
read -r SETUP_RAZORPAY

RAZORPAY_KEY=""
RAZORPAY_SECRET=""
if [ "$SETUP_RAZORPAY" = "y" ]; then
    echo -n "Razorpay Key ID: "
    read -r RAZORPAY_KEY
    echo -n "Razorpay Key Secret: "
    read -rs RAZORPAY_SECRET
    echo ""
fi

# WhatsApp/SMS
echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}           WHATSAPP/SMS SETUP (Optional)                ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

echo -n "Configure Twilio (WhatsApp/SMS) now? (y/n): "
read -r SETUP_TWILIO

TWILIO_SID=""
TWILIO_TOKEN=""
if [ "$SETUP_TWILIO" = "y" ]; then
    echo -n "Twilio Account SID: "
    read -r TWILIO_SID
    echo -n "Twilio Auth Token: "
    read -rs TWILIO_TOKEN
    echo ""
fi

# Installation begins
echo -e "\n${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}           INSTALLATION STARTING                        ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}\n"

# Create logs directory
mkdir -p logs

# Install each selected system
for sys in "${SYSTEMS[@]}"; do
    SYSTEM_DIR="${SYSTEM_DIRS[$sys]}"
    SYSTEM_NAME="${SYSTEM_NAMES[$sys]}"

    echo -e "\n${BLUE}Installing: ${SYSTEM_NAME}${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"

    if [ ! -d "$SYSTEM_DIR" ]; then
        echo -e "${RED}✗ Directory $SYSTEM_DIR not found${NC}"
        continue
    fi

    cd "$SYSTEM_DIR"

    # Create .env file
    echo -e "${YELLOW}Creating environment configuration...${NC}"
    cat > .env << EOF
# Environment
NODE_ENV=production

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=${SYSTEM_DIR//-/_}

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Server
PORT=5000
DOMAIN=$DOMAIN

# Security
JWT_SECRET=$(openssl rand -base64 64)
SESSION_SECRET=$(openssl rand -base64 64)

# Payment Gateway
RAZORPAY_KEY_ID=$RAZORPAY_KEY
RAZORPAY_KEY_SECRET=$RAZORPAY_SECRET

# WhatsApp/SMS
TWILIO_ACCOUNT_SID=$TWILIO_SID
TWILIO_AUTH_TOKEN=$TWILIO_TOKEN

# Email
SENDGRID_API_KEY=

# Demo Mode
DEMO_MODE=${LOAD_DEMO}
EOF

    echo -e "${GREEN}✓ Environment configured${NC}"

    # Start with Docker Compose
    echo -e "${YELLOW}Starting Docker containers...${NC}"
    cd docker
    docker-compose up -d

    # Wait for database
    echo -e "${YELLOW}Waiting for database...${NC}"
    sleep 10

    # Run migrations
    echo -e "${YELLOW}Running database migrations...${NC}"
    docker-compose exec -T backend npm run migrate || true

    # Load demo data if requested
    if [ "$LOAD_DEMO" = "y" ]; then
        echo -e "${YELLOW}Loading demo data...${NC}"
        docker-compose exec -T backend npm run seed || true
    fi

    echo -e "${GREEN}✓ ${SYSTEM_NAME} installed successfully!${NC}"

    cd ../..
done

# Setup SSL if requested
if [ "$USE_SSL" = "y" ]; then
    echo -e "\n${BLUE}Setting up SSL certificates...${NC}"
    sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN"
fi

# Create summary
echo -e "\n${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}           INSTALLATION COMPLETE!                       ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}\n"

echo -e "${GREEN}Successfully installed ${#SYSTEMS[@]} system(s)${NC}\n"

echo -e "${BLUE}Access URLs:${NC}"
for sys in "${SYSTEMS[@]}"; do
    SYSTEM_NAME="${SYSTEM_NAMES[$sys]}"
    if [ "$DOMAIN" = "localhost" ]; then
        PORT=$((5000 + sys - 1))
        echo -e "  • $SYSTEM_NAME: http://localhost:$PORT"
    else
        SUBDOMAIN=$(echo "${SYSTEM_DIRS[$sys]}" | cut -d'-' -f1-2)
        echo -e "  • $SYSTEM_NAME: https://$SUBDOMAIN.$DOMAIN"
    fi
done

if [ "$LOAD_DEMO" = "y" ]; then
    echo -e "\n${BLUE}Default Admin Credentials:${NC}"
    echo -e "  Email: admin@demo.com"
    echo -e "  Password: DemoPass@123"
    echo -e "  ${RED}⚠ CHANGE THESE IMMEDIATELY IN PRODUCTION!${NC}"
fi

echo -e "\n${YELLOW}Next Steps:${NC}"
echo "  1. Access the admin panel using the URLs above"
echo "  2. Change default admin password"
echo "  3. Configure remaining integrations (if any)"
echo "  4. Load your actual business data"
echo "  5. Customize branding and settings"
echo "  6. Start selling!"

echo -e "\n${BLUE}Documentation:${NC}"
echo "  • Main README: ./README.md"
echo "  • Deployment Guide: ./DEPLOYMENT.md"
echo "  • Per-system docs: ./<system-folder>/README.md"

echo -e "\n${BLUE}Support:${NC}"
echo "  • Email: support@nexavoyagers.com"
echo "  • WhatsApp: +91-XXXXX-XXXXX"
echo "  • Documentation: https://docs.nexavoyagers.com"

echo -e "\n${GREEN}🎉 Welcome to Varanasi Empire! Let's transform businesses together!${NC}\n"

# Save installation summary
cat > installation-summary.txt << EOF
VARANASI EMPIRE SOLUTIONS - INSTALLATION SUMMARY
================================================

Installation Date: $(date)
Systems Installed: ${#SYSTEMS[@]}

Installed Systems:
EOF

for sys in "${SYSTEMS[@]}"; do
    echo "  - ${SYSTEM_NAMES[$sys]}" >> installation-summary.txt
done

cat >> installation-summary.txt << EOF

Configuration:
  Database User: $DB_USER
  Domain: $DOMAIN
  SSL Enabled: $USE_SSL
  Demo Data: $LOAD_DEMO

Access installation-summary.txt for details.
EOF

echo -e "${GREEN}Installation summary saved to: installation-summary.txt${NC}\n"
