-- HEALTH & WELLNESS CENTER - Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE wellness_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_name VARCHAR(255) NOT NULL,
    center_type VARCHAR(100), -- SPA, WELLNESS, PHYSIOTHERAPY, YOGA
    address TEXT,
    city VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE therapists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID REFERENCES wellness_centers(id),
    therapist_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20),
    specialization TEXT[], -- MASSAGE, PHYSIOTHERAPY, YOGA, ACUPUNCTURE
    certification VARCHAR(255),
    years_of_experience INTEGER,
    hourly_rate DECIMAL(8, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE service_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID REFERENCES wellness_centers(id),
    service_code VARCHAR(50) UNIQUE NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_category VARCHAR(100),
    duration_minutes INTEGER,
    price DECIMAL(8, 2),
    description TEXT,
    benefits TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    medical_conditions TEXT,
    allergies TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID REFERENCES wellness_centers(id),
    client_id UUID REFERENCES clients(id),
    service_id UUID REFERENCES service_catalog(id),
    therapist_id UUID REFERENCES therapists(id),
    appointment_number VARCHAR(50) UNIQUE NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER,
    service_amount DECIMAL(8, 2),
    appointment_status VARCHAR(50) DEFAULT 'SCHEDULED',
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE treatment_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID REFERENCES wellness_centers(id),
    package_name VARCHAR(255) NOT NULL,
    package_duration_days INTEGER,
    number_of_sessions INTEGER,
    total_price DECIMAL(10, 2),
    services_included JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE package_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    package_id UUID REFERENCES treatment_packages(id),
    subscription_number VARCHAR(50) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_sessions INTEGER,
    completed_sessions INTEGER DEFAULT 0,
    amount_paid DECIMAL(10, 2),
    subscription_status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,
    amount_paid DECIMAL(8, 2),
    payment_mode VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
