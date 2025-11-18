-- TRANSPORT & LOGISTICS - Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

CREATE TABLE transport_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    gstin VARCHAR(20),
    pan_number VARCHAR(20),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    total_vehicles INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES transport_companies(id),
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type VARCHAR(100), -- TRUCK, TEMPO, MINI_TRUCK, CONTAINER
    vehicle_model VARCHAR(100),
    capacity_tons DECIMAL(6, 2),
    ownership_type VARCHAR(50), -- OWNED, LEASED, VENDOR
    driver_name VARCHAR(255),
    driver_phone VARCHAR(20),
    driver_license_number VARCHAR(50),
    driver_license_expiry DATE,
    registration_expiry DATE,
    insurance_expiry DATE,
    permit_expiry DATE,
    fitness_certificate_expiry DATE,
    last_service_date DATE,
    gps_device_id VARCHAR(100),
    has_gps_tracking BOOLEAN DEFAULT false,
    vehicle_status VARCHAR(50) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_vehicles_number ON vehicles(vehicle_number);
CREATE INDEX idx_vehicles_status ON vehicles(vehicle_status);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    customer_type VARCHAR(50), -- INDIVIDUAL, CORPORATE
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    gstin VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE consignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES transport_companies(id),
    customer_id UUID REFERENCES customers(id),
    consignment_number VARCHAR(50) UNIQUE NOT NULL,
    booking_date TIMESTAMP DEFAULT NOW(),
    -- Origin
    pickup_location TEXT NOT NULL,
    pickup_city VARCHAR(100),
    pickup_pincode VARCHAR(10),
    pickup_contact_name VARCHAR(255),
    pickup_contact_phone VARCHAR(20),
    -- Destination
    delivery_location TEXT NOT NULL,
    delivery_city VARCHAR(100),
    delivery_pincode VARCHAR(10),
    delivery_contact_name VARCHAR(255),
    delivery_contact_phone VARCHAR(20),
    -- Shipment Details
    goods_description TEXT,
    number_of_packages INTEGER,
    total_weight_kg DECIMAL(10, 2),
    declared_value DECIMAL(12, 2),
    packaging_type VARCHAR(100),
    -- Freight Charges
    freight_charges DECIMAL(10, 2),
    loading_charges DECIMAL(8, 2),
    unloading_charges DECIMAL(8, 2),
    other_charges DECIMAL(8, 2),
    gst_amount DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),
    payment_mode VARCHAR(50), -- TO_PAY, PAID, TO_BE_BILLED
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    -- Tracking
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    current_status VARCHAR(50) DEFAULT 'BOOKED',
    current_location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_consignments_number ON consignments(consignment_number);
CREATE INDEX idx_consignments_status ON consignments(current_status);

CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id),
    trip_number VARCHAR(50) UNIQUE NOT NULL,
    trip_date DATE NOT NULL,
    from_location VARCHAR(255),
    to_location VARCHAR(255),
    distance_km DECIMAL(8, 2),
    trip_start_time TIMESTAMP,
    trip_end_time TIMESTAMP,
    trip_status VARCHAR(50) DEFAULT 'PLANNED',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trip_consignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id),
    consignment_id UUID REFERENCES consignments(id),
    loading_sequence INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE consignment_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consignment_id UUID REFERENCES consignments(id),
    status_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    remarks TEXT,
    updated_by VARCHAR(255)
);

CREATE TABLE vehicle_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id),
    expense_date DATE NOT NULL,
    expense_type VARCHAR(100), -- FUEL, MAINTENANCE, TOLL, PERMIT, INSURANCE
    amount DECIMAL(10, 2),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
