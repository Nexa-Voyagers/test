-- FOOD PRODUCTION & DISTRIBUTION - Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

CREATE TABLE production_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_name VARCHAR(255) NOT NULL,
    unit_code VARCHAR(50) UNIQUE NOT NULL,
    unit_type VARCHAR(100), -- MANUFACTURING, PROCESSING, PACKAGING
    fssai_license_number VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    capacity_per_day DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(100),
    unit_of_measure VARCHAR(20),
    shelf_life_days INTEGER,
    storage_temperature VARCHAR(50),
    manufacturing_cost DECIMAL(10, 2),
    selling_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE production_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES production_units(id),
    product_id UUID REFERENCES products(id),
    batch_number VARCHAR(100) UNIQUE NOT NULL,
    production_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_produced DECIMAL(10, 2),
    quality_status VARCHAR(50) DEFAULT 'PENDING',
    approved_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE quality_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES production_batches(id),
    check_date TIMESTAMP DEFAULT NOW(),
    check_type VARCHAR(100),
    check_result VARCHAR(50),
    parameters_tested JSONB,
    checked_by VARCHAR(255),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE distributors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    distributor_code VARCHAR(50) UNIQUE NOT NULL,
    distributor_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    coverage_area TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE distribution_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    distributor_id UUID REFERENCES distributors(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date DATE NOT NULL,
    delivery_date DATE,
    total_amount DECIMAL(12, 2),
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    order_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE distribution_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES distribution_orders(id),
    batch_id UUID REFERENCES production_batches(id),
    quantity DECIMAL(10, 2),
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cold_chain_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES production_batches(id),
    recorded_at TIMESTAMP DEFAULT NOW(),
    temperature_celsius DECIMAL(5, 2),
    humidity_percent DECIMAL(5, 2),
    location VARCHAR(255),
    is_within_range BOOLEAN DEFAULT true,
    alert_sent BOOLEAN DEFAULT false
);

SELECT create_hypertable('cold_chain_monitoring', 'recorded_at', if_not_exists => TRUE);
