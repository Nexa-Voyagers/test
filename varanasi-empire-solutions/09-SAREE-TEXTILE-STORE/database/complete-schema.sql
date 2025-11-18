-- SAREE & TEXTILE STORE MANAGEMENT - Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- Store Management
CREATE TABLE textile_stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name VARCHAR(255) NOT NULL,
    store_code VARCHAR(50) UNIQUE NOT NULL,
    store_type VARCHAR(50), -- RETAIL, WHOLESALE, BOTH
    gstin VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    specialization TEXT[], -- BANARASI_SAREE, SILK, COTTON, WEDDING, DAILY_WEAR
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Weavers/Manufacturers
CREATE TABLE weavers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    weaver_code VARCHAR(50) UNIQUE NOT NULL,
    weaver_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    specialization TEXT[], -- BANARASI_BROCADE, KATAN, ORGANZA, etc.
    years_of_experience INTEGER,
    quality_rating DECIMAL(2, 1),
    total_orders INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Product Categories
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(255) NOT NULL,
    parent_category_id UUID REFERENCES product_categories(id),
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Products (Sarees, Fabrics, etc.)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES textile_stores(id),
    category_id UUID REFERENCES product_categories(id),
    weaver_id UUID REFERENCES weavers(id),
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_type VARCHAR(100), -- SAREE, DRESS_MATERIAL, FABRIC, LEHENGA, DUPATTA
    -- Fabric Details
    fabric_type VARCHAR(100), -- SILK, COTTON, GEORGETTE, CHIFFON, BANARASI, KATAN
    weave_type VARCHAR(100), -- BANARASI_BROCADE, JAMDANI, BANDHANI, HANDLOOM
    design_pattern VARCHAR(255), -- FLORAL, PAISLEY, GEOMETRIC, TRADITIONAL
    border_type VARCHAR(100),
    pallu_design VARCHAR(255),
    -- Measurements
    length_meters DECIMAL(5, 2),
    width_meters DECIMAL(5, 2),
    weight_grams DECIMAL(8, 2),
    -- Color
    primary_color VARCHAR(50),
    secondary_colors TEXT[],
    -- Work/Embellishments
    work_type TEXT[], -- ZARI, EMBROIDERY, SEQUINS, STONE_WORK, HAND_PAINTED
    has_blouse_piece BOOLEAN DEFAULT false,
    blouse_fabric_length DECIMAL(4, 2),
    -- Occasion
    occasion TEXT[], -- WEDDING, FESTIVAL, PARTY, DAILY_WEAR, OFFICE_WEAR
    suitable_for_season TEXT[], -- SUMMER, WINTER, MONSOON, ALL_SEASON
    -- Pricing
    purchase_price DECIMAL(10, 2),
    wholesale_price DECIMAL(10, 2),
    retail_price DECIMAL(10, 2),
    mrp DECIMAL(10, 2),
    -- Care Instructions
    wash_care VARCHAR(255),
    special_care_instructions TEXT,
    -- Stock
    current_stock INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 1,
    -- Media
    primary_image_url VARCHAR(500),
    images_urls TEXT[],
    video_url VARCHAR(500),
    -- Features
    is_handloom BOOLEAN DEFAULT false,
    is_pure_silk BOOLEAN DEFAULT false,
    is_handwoven BOOLEAN DEFAULT false,
    is_eco_friendly BOOLEAN DEFAULT false,
    has_gi_tag BOOLEAN DEFAULT false, -- Geographical Indication
    gi_tag_name VARCHAR(255),
    -- SEO
    tags TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_fabric ON products(fabric_type);
CREATE INDEX idx_products_price ON products(retail_price);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    customer_type VARCHAR(50) DEFAULT 'RETAIL', -- RETAIL, WHOLESALE, BOUTIQUE, DESIGNER
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    gstin VARCHAR(20),
    credit_limit DECIMAL(10, 2) DEFAULT 0,
    outstanding_balance DECIMAL(10, 2) DEFAULT 0,
    total_purchases DECIMAL(12, 2) DEFAULT 0,
    loyalty_tier VARCHAR(50) DEFAULT 'SILVER', -- SILVER, GOLD, PLATINUM
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Sales
CREATE TABLE sales_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES textile_stores(id),
    customer_id UUID REFERENCES customers(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date TIMESTAMP DEFAULT NOW(),
    invoice_type VARCHAR(50) DEFAULT 'RETAIL', -- RETAIL, WHOLESALE
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    cgst_amount DECIMAL(10, 2) DEFAULT 0,
    sgst_amount DECIMAL(10, 2) DEFAULT 0,
    round_off DECIMAL(5, 2) DEFAULT 0,
    grand_total DECIMAL(12, 2) NOT NULL,
    payment_mode VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'PAID',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES sales_invoices(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2),
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES textile_stores(id),
    weaver_id UUID REFERENCES weavers(id),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    po_date DATE NOT NULL,
    expected_delivery_date DATE,
    total_amount DECIMAL(12, 2),
    advance_paid DECIMAL(10, 2) DEFAULT 0,
    balance_amount DECIMAL(10, 2),
    po_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Custom Orders (Boutique/Designer orders)
CREATE TABLE custom_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES textile_stores(id),
    customer_id UUID REFERENCES customers(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date DATE NOT NULL,
    product_type VARCHAR(100),
    fabric_preference VARCHAR(255),
    color_preference VARCHAR(255),
    design_requirements TEXT,
    measurements JSONB,
    reference_images_urls TEXT[],
    estimated_price DECIMAL(10, 2),
    advance_amount DECIMAL(10, 2),
    expected_delivery_date DATE,
    assigned_to_weaver_id UUID REFERENCES weavers(id),
    order_status VARCHAR(50) DEFAULT 'DESIGN_PENDING',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics
CREATE TABLE daily_sales_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES textile_stores(id),
    summary_date DATE NOT NULL,
    total_invoices INTEGER DEFAULT 0,
    total_items_sold INTEGER DEFAULT 0,
    gross_revenue DECIMAL(12, 2) DEFAULT 0,
    net_revenue DECIMAL(12, 2) DEFAULT 0,
    retail_sales DECIMAL(10, 2) DEFAULT 0,
    wholesale_sales DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(store_id, summary_date)
);

SELECT create_hypertable('daily_sales_summary', 'created_at', if_not_exists => TRUE);
