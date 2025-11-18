-- EVENT & WEDDING PLANNING - Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- Event Planning Company
CREATE TABLE event_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    gstin VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    specialization TEXT[], -- WEDDING, CORPORATE, BIRTHDAY, ANNIVERSARY, CONFERENCE
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    budget_min DECIMAL(12, 2),
    budget_max DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES event_companies(id),
    client_id UUID REFERENCES clients(id),
    event_number VARCHAR(50) UNIQUE NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100), -- WEDDING, BIRTHDAY, CORPORATE_EVENT, CONFERENCE, ANNIVERSARY
    event_date DATE NOT NULL,
    event_time TIME,
    expected_guests INTEGER,
    -- Wedding Specific
    bride_name VARCHAR(255),
    groom_name VARCHAR(255),
    wedding_date DATE,
    mehendi_date DATE,
    sangeet_date DATE,
    reception_date DATE,
    -- Venue
    venue_name VARCHAR(255),
    venue_address TEXT,
    venue_city VARCHAR(100),
    venue_capacity INTEGER,
    -- Budget
    total_budget DECIMAL(12, 2),
    estimated_cost DECIMAL(12, 2),
    actual_cost DECIMAL(12, 2) DEFAULT 0,
    -- Status
    event_status VARCHAR(50) DEFAULT 'PLANNING',
    -- PLANNING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vendor Categories
CREATE TABLE vendor_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vendors
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_code VARCHAR(50) UNIQUE NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES vendor_categories(id),
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    services_offered TEXT[],
    rating DECIMAL(2, 1),
    base_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Event Vendor Bookings
CREATE TABLE event_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    vendor_id UUID REFERENCES vendors(id),
    service_description TEXT,
    quoted_price DECIMAL(10, 2),
    final_price DECIMAL(10, 2),
    advance_paid DECIMAL(10, 2) DEFAULT 0,
    balance_amount DECIMAL(10, 2),
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    booking_status VARCHAR(50) DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Event Checklist
CREATE TABLE event_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    task_name VARCHAR(255) NOT NULL,
    task_category VARCHAR(100),
    due_date DATE,
    assigned_to VARCHAR(255),
    task_status VARCHAR(50) DEFAULT 'PENDING',
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Guest List
CREATE TABLE event_guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    guest_name VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(20),
    guest_email VARCHAR(255),
    guest_category VARCHAR(50), -- FAMILY, FRIENDS, COLLEAGUES
    invitation_sent BOOLEAN DEFAULT false,
    rsvp_status VARCHAR(50), -- CONFIRMED, DECLINED, PENDING
    number_of_attendees INTEGER DEFAULT 1,
    special_requirements TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE event_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id),
    payment_date DATE NOT NULL,
    payment_to VARCHAR(255), -- Client payment or vendor payment
    amount DECIMAL(10, 2),
    payment_type VARCHAR(50), -- ADVANCE, INSTALLMENT, FINAL, VENDOR_PAYMENT
    payment_mode VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
