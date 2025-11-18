-- SPA & SALON MANAGEMENT - Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

CREATE TABLE salons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_name VARCHAR(255) NOT NULL,
    salon_type VARCHAR(100), -- UNISEX, LADIES, GENTS, SPA
    address TEXT,
    city VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    opening_time TIME DEFAULT '10:00',
    closing_time TIME DEFAULT '20:00',
    weekly_off VARCHAR(20)[],
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(255) NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id),
    category_id UUID REFERENCES service_categories(id),
    service_code VARCHAR(50) UNIQUE NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    gender_preference VARCHAR(50), -- MALE, FEMALE, UNISEX
    duration_minutes INTEGER NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id),
    staff_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(100), -- HAIR_STYLIST, BEAUTICIAN, MASSAGE_THERAPIST, NAIL_TECHNICIAN
    gender VARCHAR(20),
    specialization TEXT[],
    years_of_experience INTEGER,
    commission_percentage DECIMAL(5, 2) DEFAULT 30.0,
    working_days TEXT[],
    shift_start_time TIME,
    shift_end_time TIME,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20),
    anniversary_date DATE,
    address TEXT,
    skin_type VARCHAR(50),
    hair_type VARCHAR(50),
    allergies TEXT,
    preferred_stylist_id UUID REFERENCES staff(id),
    total_visits INTEGER DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_customers_phone ON customers(phone);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id),
    customer_id UUID REFERENCES customers(id),
    staff_id UUID REFERENCES staff(id),
    appointment_number VARCHAR(50) UNIQUE NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    estimated_duration_minutes INTEGER,
    appointment_status VARCHAR(50) DEFAULT 'SCHEDULED',
    booking_source VARCHAR(50) DEFAULT 'WALK_IN', -- WALK_IN, PHONE, ONLINE
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);

CREATE TABLE appointment_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id),
    service_id UUID REFERENCES services(id),
    staff_id UUID REFERENCES staff(id),
    service_price DECIMAL(8, 2),
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    final_price DECIMAL(8, 2),
    service_status VARCHAR(50) DEFAULT 'PENDING',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id),
    customer_id UUID REFERENCES customers(id),
    appointment_id UUID REFERENCES appointments(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date TIMESTAMP DEFAULT NOW(),
    subtotal DECIMAL(10, 2),
    discount_amount DECIMAL(8, 2) DEFAULT 0,
    cgst_amount DECIMAL(8, 2) DEFAULT 0,
    sgst_amount DECIMAL(8, 2) DEFAULT 0,
    round_off DECIMAL(5, 2) DEFAULT 0,
    grand_total DECIMAL(10, 2),
    payment_mode VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'PAID',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id),
    product_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(100), -- SHAMPOO, CONDITIONER, SERUM, CREAM, TOOLS
    brand VARCHAR(100),
    unit VARCHAR(50),
    current_stock DECIMAL(10, 2) DEFAULT 0,
    min_stock_level DECIMAL(10, 2),
    purchase_price DECIMAL(8, 2),
    retail_price DECIMAL(8, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE product_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id),
    product_id UUID REFERENCES products_inventory(id),
    quantity DECIMAL(6, 2),
    unit_price DECIMAL(8, 2),
    total_price DECIMAL(8, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE membership_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id),
    plan_name VARCHAR(255) NOT NULL,
    validity_months INTEGER,
    plan_fee DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2),
    free_services INTEGER,
    benefits TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE customer_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    plan_id UUID REFERENCES membership_plans(id),
    membership_number VARCHAR(50) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount_paid DECIMAL(10, 2),
    free_services_used INTEGER DEFAULT 0,
    membership_status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE staff_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id),
    invoice_id UUID REFERENCES invoices(id),
    service_amount DECIMAL(8, 2),
    commission_percentage DECIMAL(5, 2),
    commission_amount DECIMAL(8, 2),
    commission_date DATE NOT NULL,
    payout_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE daily_sales_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id),
    summary_date DATE NOT NULL,
    total_appointments INTEGER DEFAULT 0,
    walk_in_customers INTEGER DEFAULT 0,
    total_services DECIMAL(10, 2) DEFAULT 0,
    total_products DECIMAL(10, 2) DEFAULT 0,
    gross_revenue DECIMAL(10, 2) DEFAULT 0,
    discounts DECIMAL(8, 2) DEFAULT 0,
    net_revenue DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(salon_id, summary_date)
);

SELECT create_hypertable('daily_sales_summary', 'created_at', if_not_exists => TRUE);

-- Views
CREATE VIEW v_todays_appointments AS
SELECT
    a.appointment_number,
    c.customer_code,
    c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
    c.phone,
    a.appointment_time,
    s.first_name || ' ' || s.last_name as staff_name,
    a.appointment_status
FROM appointments a
JOIN customers c ON a.customer_id = c.id
JOIN staff s ON a.staff_id = s.id
WHERE a.appointment_date = CURRENT_DATE
ORDER BY a.appointment_time;
