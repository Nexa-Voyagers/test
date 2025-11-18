-- PROFESSIONAL SERVICES HUB (Legal/Consulting) - Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

CREATE TABLE service_firms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_name VARCHAR(255) NOT NULL,
    firm_type VARCHAR(100), -- LEGAL, CONSULTING, ADVISORY, AUDIT
    registration_number VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES service_firms(id),
    professional_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    designation VARCHAR(100),
    specialization TEXT[],
    bar_council_number VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    hourly_rate DECIMAL(8, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_code VARCHAR(50) UNIQUE NOT NULL,
    client_type VARCHAR(50), -- INDIVIDUAL, CORPORATE
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES service_firms(id),
    client_id UUID REFERENCES clients(id),
    case_number VARCHAR(50) UNIQUE NOT NULL,
    case_title VARCHAR(500),
    case_type VARCHAR(100),
    court_name VARCHAR(255),
    case_status VARCHAR(50) DEFAULT 'OPEN',
    filing_date DATE,
    next_hearing_date DATE,
    assigned_to UUID REFERENCES professionals(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE case_hearings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id),
    hearing_date DATE NOT NULL,
    hearing_time TIME,
    court_name VARCHAR(255),
    judge_name VARCHAR(255),
    outcome TEXT,
    next_hearing_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id),
    client_id UUID REFERENCES clients(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    total_amount DECIMAL(10, 2),
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id),
    document_name VARCHAR(255),
    document_type VARCHAR(100),
    document_url VARCHAR(500),
    uploaded_at TIMESTAMP DEFAULT NOW()
);
