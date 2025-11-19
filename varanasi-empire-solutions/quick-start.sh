#!/bin/bash

###############################################################################
# Varanasi Empire Solutions - Quick Start Script
# This script helps you quickly set up any solution
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js: $NODE_VERSION"
    else
        print_error "Node.js not found. Please install Node.js v18 or v20 LTS"
        exit 1
    fi

    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm: v$NPM_VERSION"
    else
        print_error "npm not found"
        exit 1
    fi

    # Check PostgreSQL
    if command -v psql &> /dev/null; then
        PSQL_VERSION=$(psql --version | awk '{print $3}')
        print_success "PostgreSQL: $PSQL_VERSION"
    else
        print_warning "PostgreSQL not found. Install PostgreSQL 15+ or use Docker"
    fi

    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
        print_success "Docker: $DOCKER_VERSION"
    else
        print_info "Docker not found (optional)"
    fi
}

# List available solutions
list_solutions() {
    print_header "Available Solutions"

    echo "Solutions with Complete Frontend (Ready to Deploy):"
    echo "  1. Restaurant POS Management (03)"
    echo "  2. Hotel & Hospitality Management (01)"
    echo ""
    echo "Solutions with Backend Only (API Ready):"
    echo "  3. Temple Management System (02)"
    echo "  4. Travel & Tour Agency (04)"
    echo "  5. Hospital Management System (05)"
    echo "  6. Real Estate Management (06)"
    echo "  7. Pharmacy Management (07)"
    echo "  8. Jewellery Store Management (08)"
    echo "  9. Saree & Textile Store (09)"
    echo " 10. Educational Institute (10)"
    echo " 11. Event & Wedding Planning (11)"
    echo " 12. Gym & Fitness Center (12)"
    echo " 13. Professional Services Hub (13)"
    echo " 14. School Management System (14)"
    echo " 15. Food Production & Distribution (15)"
    echo " 16. Transport & Logistics (16)"
    echo " 17. CA Firm Management (17)"
    echo " 18. Health & Fitness Center (18)"
    echo " 19. Laundry & Dry Cleaning (19)"
    echo " 20. Home Services Platform (20)"
    echo " 21. Arts & Crafts Studio (21)"
    echo " 22. Spa & Salon Management (22)"
    echo ""
}

# Setup database
setup_database() {
    local DB_NAME=$1
    local SOLUTION_DIR=$2

    print_header "Setting up Database: $DB_NAME"

    # Check if database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
        print_warning "Database $DB_NAME already exists"
        read -p "Drop and recreate? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            psql -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
            print_success "Dropped existing database"
        else
            print_info "Using existing database"
            return
        fi
    fi

    # Create database
    print_info "Creating database..."
    psql -U postgres -c "CREATE DATABASE $DB_NAME;"
    print_success "Database created"

    # Create extensions
    print_info "Creating extensions..."
    psql -U postgres -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
    psql -U postgres -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"postgis\";" 2>/dev/null || true
    psql -U postgres -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"timescaledb\";" 2>/dev/null || true
    print_success "Extensions created"

    # Load schema
    if [ -f "$SOLUTION_DIR/database/complete-schema.sql" ]; then
        print_info "Loading schema..."
        psql -U postgres -d $DB_NAME -f "$SOLUTION_DIR/database/complete-schema.sql"
        print_success "Schema loaded"
    fi

    # Load demo data
    if [ -f "$SOLUTION_DIR/database/demo-data.sql" ]; then
        print_info "Loading demo data..."
        psql -U postgres -d $DB_NAME -f "$SOLUTION_DIR/database/demo-data.sql"
        print_success "Demo data loaded"
    fi
}

# Setup backend
setup_backend() {
    local SOLUTION_DIR=$1
    local DB_NAME=$2
    local PORT=$3

    print_header "Setting up Backend"

    cd "$SOLUTION_DIR/backend"

    # Install dependencies
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"

    # Create .env file
    if [ ! -f ".env" ]; then
        print_info "Creating .env file..."
        cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=$DB_NAME
DB_USER=postgres
DB_PASSWORD=postgres

# Server Configuration
NODE_ENV=development
PORT=$PORT

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
EOF
        print_success ".env file created"
    else
        print_info ".env file already exists"
    fi

    cd - > /dev/null
}

# Setup frontend
setup_frontend() {
    local SOLUTION_DIR=$1
    local BACKEND_PORT=$2

    print_header "Setting up Frontend"

    if [ ! -d "$SOLUTION_DIR/frontend" ]; then
        print_warning "No frontend directory found"
        return
    fi

    cd "$SOLUTION_DIR/frontend"

    # Install dependencies
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"

    # Create .env.local file
    if [ ! -f ".env.local" ]; then
        print_info "Creating .env.local file..."
        cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:$BACKEND_PORT/api/v1
EOF
        print_success ".env.local file created"
    else
        print_info ".env.local file already exists"
    fi

    cd - > /dev/null
}

# Main setup function
main_setup() {
    local SOLUTION_NUM=$1

    # Map solution number to directory
    case $SOLUTION_NUM in
        1|03) SOLUTION_DIR="03-RESTAURANT-POS-MANAGEMENT"; DB_NAME="restaurant_pos"; PORT=5003; HAS_FRONTEND=true;;
        2|01) SOLUTION_DIR="01-HOTEL-HOSPITALITY-MANAGEMENT"; DB_NAME="hotel_management"; PORT=5001; HAS_FRONTEND=true;;
        3|02) SOLUTION_DIR="02-TEMPLE-MANAGEMENT-SYSTEM"; DB_NAME="temple_management"; PORT=5002; HAS_FRONTEND=false;;
        4|04) SOLUTION_DIR="04-TRAVEL-TOUR-AGENCY"; DB_NAME="travel_agency"; PORT=5004; HAS_FRONTEND=false;;
        5|05) SOLUTION_DIR="05-HOSPITAL-MANAGEMENT-SYSTEM"; DB_NAME="hospital_management"; PORT=5005; HAS_FRONTEND=false;;
        6|06) SOLUTION_DIR="06-REAL-ESTATE-MANAGEMENT"; DB_NAME="real_estate"; PORT=5006; HAS_FRONTEND=false;;
        7|07) SOLUTION_DIR="07-PHARMACY-MANAGEMENT"; DB_NAME="pharmacy"; PORT=5007; HAS_FRONTEND=false;;
        8|08) SOLUTION_DIR="08-JEWELLERY-STORE-MANAGEMENT"; DB_NAME="jewellery_store"; PORT=5008; HAS_FRONTEND=false;;
        9|09) SOLUTION_DIR="09-SAREE-TEXTILE-STORE"; DB_NAME="saree_textile"; PORT=5009; HAS_FRONTEND=false;;
        10) SOLUTION_DIR="10-EDUCATIONAL-INSTITUTE"; DB_NAME="educational_institute"; PORT=5010; HAS_FRONTEND=false;;
        11) SOLUTION_DIR="11-EVENT-WEDDING-PLANNING"; DB_NAME="event_planning"; PORT=5011; HAS_FRONTEND=false;;
        12) SOLUTION_DIR="12-GYM-FITNESS-CENTER"; DB_NAME="gym_fitness"; PORT=5012; HAS_FRONTEND=false;;
        13) SOLUTION_DIR="13-PROFESSIONAL-SERVICES-HUB"; DB_NAME="professional_services"; PORT=5013; HAS_FRONTEND=false;;
        14) SOLUTION_DIR="14-SCHOOL-MANAGEMENT-SYSTEM"; DB_NAME="school_management"; PORT=5014; HAS_FRONTEND=false;;
        15) SOLUTION_DIR="15-FOOD-PRODUCTION-DISTRIBUTION"; DB_NAME="food_production"; PORT=5015; HAS_FRONTEND=false;;
        16) SOLUTION_DIR="16-TRANSPORT-LOGISTICS"; DB_NAME="transport_logistics"; PORT=5016; HAS_FRONTEND=false;;
        17) SOLUTION_DIR="17-CA-FIRM-MANAGEMENT"; DB_NAME="ca_firm"; PORT=5017; HAS_FRONTEND=false;;
        18) SOLUTION_DIR="18-HEALTH-FITNESS-CENTER"; DB_NAME="health_fitness"; PORT=5018; HAS_FRONTEND=false;;
        19) SOLUTION_DIR="19-LAUNDRY-DRY-CLEANING"; DB_NAME="laundry"; PORT=5019; HAS_FRONTEND=false;;
        20) SOLUTION_DIR="20-HOME-SERVICES-PLATFORM"; DB_NAME="home_services"; PORT=5020; HAS_FRONTEND=false;;
        21) SOLUTION_DIR="21-ARTS-CRAFTS-STUDIO"; DB_NAME="arts_crafts"; PORT=5021; HAS_FRONTEND=false;;
        22) SOLUTION_DIR="22-SPA-SALON-MANAGEMENT"; DB_NAME="spa_salon"; PORT=5022; HAS_FRONTEND=false;;
        *) print_error "Invalid solution number"; exit 1;;
    esac

    print_header "Setting up: $SOLUTION_DIR"

    # Check if solution exists
    if [ ! -d "$SOLUTION_DIR" ]; then
        print_error "Solution directory not found: $SOLUTION_DIR"
        exit 1
    fi

    # Setup database
    setup_database "$DB_NAME" "$SOLUTION_DIR"

    # Setup backend
    setup_backend "$SOLUTION_DIR" "$DB_NAME" "$PORT"

    # Setup frontend if available
    if [ "$HAS_FRONTEND" = true ]; then
        setup_frontend "$SOLUTION_DIR" "$PORT"
    fi

    # Print success message
    print_header "Setup Complete!"

    print_success "Database: $DB_NAME created and loaded with demo data"
    print_success "Backend: Configured and ready on port $PORT"

    if [ "$HAS_FRONTEND" = true ]; then
        FRONTEND_PORT=$((PORT - 2000))
        print_success "Frontend: Configured and ready on port $FRONTEND_PORT"
    fi

    print_info "\nTo start the backend:"
    echo "  cd $SOLUTION_DIR/backend"
    echo "  npm run dev"

    if [ "$HAS_FRONTEND" = true ]; then
        print_info "\nTo start the frontend:"
        echo "  cd $SOLUTION_DIR/frontend"
        echo "  npm run dev"
    fi

    print_info "\nBackend will be available at: http://localhost:$PORT"
    if [ "$HAS_FRONTEND" = true ]; then
        print_info "Frontend will be available at: http://localhost:$FRONTEND_PORT"
    fi

    print_info "\nAPI Health Check: http://localhost:$PORT/api/health"
}

# Main script
main() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║   Varanasi Empire Solutions - Quick Start Setup     ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    check_prerequisites
    list_solutions

    echo ""
    read -p "Enter solution number to setup (1-22): " SOLUTION_NUM

    main_setup "$SOLUTION_NUM"
}

# Run main
main
