-- HOME SERVICES PLATFORM - Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

CREATE TABLE platform_operators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform_name VARCHAR(255) NOT NULL,
    gstin VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    commission_percentage DECIMAL(5, 2) DEFAULT 15.0,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(255) NOT NULL,
    category_icon VARCHAR(255),
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(id),
    service_name VARCHAR(255) NOT NULL,
    service_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    base_price DECIMAL(8, 2),
    unit VARCHAR(50), -- PER_HOUR, PER_SQ_FT, FIXED
    estimated_duration_minutes INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(100),
    pincode VARCHAR(10),
    location GEOGRAPHY(POINT),
    aadhar_number VARCHAR(20),
    pan_number VARCHAR(20),
    -- Services Offered
    services_offered UUID[], -- Array of service IDs
    specialization TEXT[],
    years_of_experience INTEGER,
    -- Verification
    background_verified BOOLEAN DEFAULT false,
    documents_verified BOOLEAN DEFAULT false,
    -- Ratings
    average_rating DECIMAL(2, 1) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_jobs_completed INTEGER DEFAULT 0,
    -- Status
    is_available BOOLEAN DEFAULT true,
    provider_status VARCHAR(50) DEFAULT 'ACTIVE',
    -- Banking
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    upi_id VARCHAR(100),
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_providers_location ON service_providers USING gist(location);
CREATE INDEX idx_providers_services ON service_providers USING gin(services_offered);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20),
    -- Saved Addresses
    addresses JSONB,
    default_address_id VARCHAR(50),
    -- Portal Access
    portal_username VARCHAR(100) UNIQUE,
    portal_password_hash VARCHAR(255),
    -- Statistics
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    service_id UUID REFERENCES services(id),
    provider_id UUID REFERENCES service_providers(id),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    booking_date TIMESTAMP DEFAULT NOW(),
    -- Service Details
    service_address TEXT NOT NULL,
    service_city VARCHAR(100),
    service_pincode VARCHAR(10),
    service_location GEOGRAPHY(POINT),
    -- Scheduling
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    estimated_duration_minutes INTEGER,
    -- Pricing
    service_charge DECIMAL(8, 2),
    platform_fee DECIMAL(6, 2),
    gst_amount DECIMAL(6, 2),
    total_amount DECIMAL(8, 2),
    -- Payment
    payment_mode VARCHAR(50), -- CASH, ONLINE, CARD, UPI
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    transaction_id VARCHAR(255),
    -- Provider Earnings
    provider_earning DECIMAL(8, 2),
    platform_commission DECIMAL(6, 2),
    -- Status
    booking_status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, CONFIRMED, PROVIDER_ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
    -- Service Tracking
    provider_started_at TIMESTAMP,
    provider_reached_at TIMESTAMP,
    service_started_at TIMESTAMP,
    service_completed_at TIMESTAMP,
    -- Special Instructions
    customer_notes TEXT,
    provider_notes TEXT,
    cancellation_reason TEXT,
    cancelled_by VARCHAR(50), -- CUSTOMER, PROVIDER, PLATFORM
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_number ON bookings(booking_number);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX idx_bookings_status ON bookings(booking_status);

CREATE TABLE reviews_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    customer_id UUID REFERENCES customers(id),
    provider_id UUID REFERENCES service_providers(id),
    rating DECIMAL(2, 1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    review_date TIMESTAMP DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT true,
    provider_response TEXT,
    provider_response_date TIMESTAMP
);

CREATE TABLE provider_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES service_providers(id),
    booking_id UUID REFERENCES bookings(id),
    earning_date DATE NOT NULL,
    service_amount DECIMAL(8, 2),
    platform_commission DECIMAL(6, 2),
    net_earning DECIMAL(8, 2),
    payout_status VARCHAR(50) DEFAULT 'PENDING',
    payout_date DATE,
    payout_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE provider_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES service_providers(id),
    payout_number VARCHAR(50) UNIQUE NOT NULL,
    payout_date DATE NOT NULL,
    total_earnings DECIMAL(10, 2),
    payment_mode VARCHAR(50), -- BANK_TRANSFER, UPI, CASH
    transaction_reference VARCHAR(255),
    payout_status VARCHAR(50) DEFAULT 'PROCESSED',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE daily_booking_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    summary_date DATE NOT NULL,
    total_bookings INTEGER DEFAULT 0,
    completed_bookings INTEGER DEFAULT 0,
    cancelled_bookings INTEGER DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    platform_commission DECIMAL(10, 2) DEFAULT 0,
    provider_earnings DECIMAL(12, 2) DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    new_providers INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(summary_date)
);

SELECT create_hypertable('daily_booking_summary', 'created_at', if_not_exists => TRUE);
