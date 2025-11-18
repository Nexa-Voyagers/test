-- PHARMACY MANAGEMENT SYSTEM - Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- Pharmacy Chain
CREATE TABLE pharmacy_chains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chain_name VARCHAR(255) NOT NULL,
    drug_license_number VARCHAR(100) UNIQUE,
    gstin VARCHAR(20),
    pan_number VARCHAR(20),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chain_id UUID REFERENCES pharmacy_chains(id),
    pharmacy_code VARCHAR(50) UNIQUE NOT NULL,
    pharmacy_name VARCHAR(255) NOT NULL,
    drug_license_number VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),
    location GEOGRAPHY(POINT),
    pharmacist_name VARCHAR(255) NOT NULL,
    pharmacist_reg_number VARCHAR(100),
    phone VARCHAR(20),
    opening_time TIME DEFAULT '08:00',
    closing_time TIME DEFAULT '22:00',
    is_24x7 BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Drug Database
CREATE TABLE drug_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(255) NOT NULL,
    schedule VARCHAR(50), -- H, H1, X, G, etc.
    requires_prescription BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE drugs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drug_code VARCHAR(50) UNIQUE NOT NULL,
    generic_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255),
    manufacturer VARCHAR(255),
    category_id UUID REFERENCES drug_categories(id),
    drug_schedule VARCHAR(50), -- H, H1, X, G
    composition TEXT,
    dosage_form VARCHAR(100), -- TABLET, CAPSULE, SYRUP, INJECTION, CREAM
    strength VARCHAR(100), -- 500mg, 10ml, etc.
    pack_size VARCHAR(50), -- 10 tablets, 100ml
    unit_of_measure VARCHAR(20), -- STRIP, BOTTLE, TUBE
    requires_prescription BOOLEAN DEFAULT false,
    is_refrigerated BOOLEAN DEFAULT false,
    hsn_code VARCHAR(20),
    gst_rate DECIMAL(5, 2) DEFAULT 12.0,
    mrp DECIMAL(10, 2) NOT NULL,
    purchase_price DECIMAL(10, 2),
    margin_percentage DECIMAL(5, 2),
    therapeutic_use TEXT,
    side_effects TEXT,
    contraindications TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_drugs_generic ON drugs(generic_name);
CREATE INDEX idx_drugs_brand ON drugs(brand_name);
CREATE INDEX idx_drugs_code ON drugs(drug_code);

-- Inventory
CREATE TABLE pharmacy_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id),
    drug_id UUID REFERENCES drugs(id),
    batch_number VARCHAR(100) NOT NULL,
    manufacturing_date DATE,
    expiry_date DATE NOT NULL,
    quantity_in_stock INTEGER NOT NULL DEFAULT 0,
    purchase_price DECIMAL(10, 2),
    mrp DECIMAL(10, 2),
    supplier_name VARCHAR(255),
    supplier_invoice_number VARCHAR(100),
    purchase_date DATE,
    rack_number VARCHAR(50),
    shelf_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(pharmacy_id, drug_id, batch_number)
);

CREATE INDEX idx_inventory_expiry ON pharmacy_inventory(expiry_date);
CREATE INDEX idx_inventory_pharmacy ON pharmacy_inventory(pharmacy_id);

-- Customers/Patients
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    pincode VARCHAR(10),
    allergies TEXT[],
    chronic_conditions TEXT[],
    total_purchases DECIMAL(12, 2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_customers_phone ON customers(phone);

-- Prescriptions
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    doctor_name VARCHAR(255) NOT NULL,
    doctor_registration_number VARCHAR(100),
    hospital_name VARCHAR(255),
    prescription_date DATE NOT NULL,
    prescription_image_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID,
    verified_at TIMESTAMP,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE prescription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES prescriptions(id),
    drug_id UUID REFERENCES drugs(id),
    dosage VARCHAR(255) NOT NULL,
    frequency VARCHAR(255),
    duration_days INTEGER,
    quantity INTEGER,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sales/Billing
CREATE TABLE sales_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id),
    customer_id UUID REFERENCES customers(id),
    prescription_id UUID REFERENCES prescriptions(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date TIMESTAMP DEFAULT NOW(),
    invoice_type VARCHAR(50) DEFAULT 'RETAIL', -- RETAIL, WHOLESALE, INSURANCE
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    cgst_amount DECIMAL(10, 2) DEFAULT 0,
    sgst_amount DECIMAL(10, 2) DEFAULT 0,
    round_off DECIMAL(5, 2) DEFAULT 0,
    grand_total DECIMAL(10, 2) NOT NULL,
    payment_mode VARCHAR(50), -- CASH, CARD, UPI, INSURANCE
    payment_status VARCHAR(50) DEFAULT 'PAID',
    served_by UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES sales_invoices(id),
    drug_id UUID REFERENCES drugs(id),
    inventory_id UUID REFERENCES pharmacy_inventory(id),
    batch_number VARCHAR(100),
    quantity INTEGER NOT NULL,
    mrp DECIMAL(10, 2),
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    gst_rate DECIMAL(5, 2),
    gst_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Purchase Orders
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    gstin VARCHAR(20),
    drug_license_number VARCHAR(100),
    address TEXT,
    credit_period_days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id),
    supplier_id UUID REFERENCES suppliers(id),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    po_date DATE NOT NULL,
    expected_delivery_date DATE,
    subtotal DECIMAL(12, 2),
    gst_amount DECIMAL(10, 2),
    total_amount DECIMAL(12, 2),
    po_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID REFERENCES purchase_orders(id),
    drug_id UUID REFERENCES drugs(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stock Alerts
CREATE TABLE stock_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id),
    drug_id UUID REFERENCES drugs(id),
    alert_type VARCHAR(50), -- LOW_STOCK, EXPIRY_SOON, EXPIRED
    current_stock INTEGER,
    min_stock_level INTEGER,
    expiry_date DATE,
    days_to_expiry INTEGER,
    alert_date TIMESTAMP DEFAULT NOW(),
    is_resolved BOOLEAN DEFAULT false
);

-- Analytics
CREATE TABLE daily_sales_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id),
    summary_date DATE NOT NULL,
    total_invoices INTEGER DEFAULT 0,
    total_items_sold INTEGER DEFAULT 0,
    gross_revenue DECIMAL(12, 2) DEFAULT 0,
    total_discount DECIMAL(10, 2) DEFAULT 0,
    net_revenue DECIMAL(12, 2) DEFAULT 0,
    prescription_sales INTEGER DEFAULT 0,
    otc_sales INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(pharmacy_id, summary_date)
);

SELECT create_hypertable('daily_sales_summary', 'created_at', if_not_exists => TRUE);

-- Triggers
CREATE OR REPLACE FUNCTION update_inventory_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pharmacy_inventory
    SET quantity_in_stock = quantity_in_stock - NEW.quantity
    WHERE id = NEW.inventory_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory
AFTER INSERT ON sale_items
FOR EACH ROW
EXECUTE FUNCTION update_inventory_on_sale();

-- Views
CREATE VIEW v_expiring_drugs AS
SELECT
    p.pharmacy_name,
    d.generic_name,
    d.brand_name,
    pi.batch_number,
    pi.expiry_date,
    CURRENT_DATE - pi.expiry_date as days_to_expiry,
    pi.quantity_in_stock
FROM pharmacy_inventory pi
JOIN drugs d ON pi.drug_id = d.id
JOIN pharmacies p ON pi.pharmacy_id = p.id
WHERE pi.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days'
  AND pi.quantity_in_stock > 0
ORDER BY pi.expiry_date;

CREATE VIEW v_low_stock_drugs AS
SELECT
    p.pharmacy_name,
    d.generic_name,
    d.brand_name,
    SUM(pi.quantity_in_stock) as current_stock
FROM pharmacy_inventory pi
JOIN drugs d ON pi.drug_id = d.id
JOIN pharmacies p ON pi.pharmacy_id = p.id
WHERE pi.quantity_in_stock < 10
GROUP BY p.pharmacy_name, d.generic_name, d.brand_name
HAVING SUM(pi.quantity_in_stock) < 10;
