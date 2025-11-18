-- ============================================================================
-- JEWELLERY STORE MANAGEMENT SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Target: Gold, Silver, Platinum, Diamond, Gemstone Retail & Manufacturing
-- Features: Live Rate Integration, Hallmark Tracking, Making Charges, Schemes,
--           Custom Design, Repairs, Purity Testing, Multi-location, GST Billing
-- Tier: Enterprise (Multi-store chain) + Standard (Single store)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- ============================================================================
-- STORE HIERARCHY & CONFIGURATION
-- ============================================================================

CREATE TABLE jewellery_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255) NOT NULL,

    -- Registration
    company_legal_name VARCHAR(255),
    registration_number VARCHAR(100),
    pan_number VARCHAR(20),
    gstin VARCHAR(20),
    bis_license_number VARCHAR(100), -- Bureau of Indian Standards for Hallmark

    -- Centralized features (Enterprise tier)
    centralized_inventory BOOLEAN DEFAULT false,
    centralized_pricing BOOLEAN DEFAULT true,
    centralized_rate_updates BOOLEAN DEFAULT true,

    -- Contact
    head_office_address TEXT,
    location GEOGRAPHY(POINT),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website VARCHAR(255),

    -- Branding
    logo_url VARCHAR(500),
    primary_color VARCHAR(10) DEFAULT '#FFD700', -- Gold color

    -- ERP Integration
    tally_integration BOOLEAN DEFAULT false,
    tally_company_name VARCHAR(255),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES jewellery_groups(id),

    -- Basic Info
    store_name VARCHAR(255) NOT NULL,
    store_code VARCHAR(50) UNIQUE NOT NULL,
    store_type VARCHAR(50) DEFAULT 'RETAIL', -- RETAIL, MANUFACTURING, BOTH

    -- Location
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),
    location GEOGRAPHY(POINT),
    landmark VARCHAR(255),

    -- Contact
    manager_name VARCHAR(255),
    manager_phone VARCHAR(20),
    store_email VARCHAR(255),
    store_phone VARCHAR(20),

    -- Business Details
    gstin VARCHAR(20),
    bis_license_number VARCHAR(100),
    establishment_year INTEGER,

    -- Store Type
    has_gold BOOLEAN DEFAULT true,
    has_silver BOOLEAN DEFAULT true,
    has_diamond BOOLEAN DEFAULT true,
    has_platinum BOOLEAN DEFAULT false,
    has_gemstones BOOLEAN DEFAULT true,
    has_custom_design BOOLEAN DEFAULT true,
    has_repair_service BOOLEAN DEFAULT true,

    -- Banking
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    upi_id VARCHAR(100),

    -- Payment Modes Accepted
    accepts_cash BOOLEAN DEFAULT true,
    accepts_card BOOLEAN DEFAULT true,
    accepts_upi BOOLEAN DEFAULT true,
    accepts_old_gold_exchange BOOLEAN DEFAULT true,
    accepts_schemes BOOLEAN DEFAULT true,

    -- Operating Hours
    opening_time TIME DEFAULT '10:00',
    closing_time TIME DEFAULT '20:00',
    weekly_off VARCHAR(20)[], -- Array of days

    logo_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- METAL RATES MANAGEMENT (Live Rate Integration)
-- ============================================================================

CREATE TABLE metal_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metal_name VARCHAR(50) UNIQUE NOT NULL, -- GOLD, SILVER, PLATINUM
    metal_symbol VARCHAR(10) NOT NULL, -- Au, Ag, Pt
    base_unit VARCHAR(20) DEFAULT 'GRAM', -- GRAM, TOLA, OUNCE

    -- GST (Gold/Silver = 3%, Diamond = 0.25%)
    gst_rate DECIMAL(5, 2) DEFAULT 3.0,

    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert standard metals
INSERT INTO metal_types (metal_name, metal_symbol, gst_rate, display_order) VALUES
('GOLD', 'Au', 3.0, 1),
('SILVER', 'Ag', 3.0, 2),
('PLATINUM', 'Pt', 3.0, 3);

CREATE TABLE metal_purities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metal_type_id UUID REFERENCES metal_types(id),

    purity_name VARCHAR(50) NOT NULL, -- 24K, 22K, 18K, 14K for Gold; 999, 925 for Silver
    purity_percentage DECIMAL(5, 2) NOT NULL,
    purity_code VARCHAR(20),

    -- BIS Hallmark
    bis_hallmark_code VARCHAR(50),

    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(metal_type_id, purity_name)
);

-- Insert standard purities
INSERT INTO metal_purities (metal_type_id, purity_name, purity_percentage, display_order) VALUES
((SELECT id FROM metal_types WHERE metal_name = 'GOLD'), '24K', 99.9, 1),
((SELECT id FROM metal_types WHERE metal_name = 'GOLD'), '22K', 91.67, 2),
((SELECT id FROM metal_types WHERE metal_name = 'GOLD'), '18K', 75.0, 3),
((SELECT id FROM metal_types WHERE metal_name = 'GOLD'), '14K', 58.5, 4),
((SELECT id FROM metal_types WHERE metal_name = 'SILVER'), '999', 99.9, 1),
((SELECT id FROM metal_types WHERE metal_name = 'SILVER'), '925', 92.5, 2),
((SELECT id FROM metal_types WHERE metal_name = 'SILVER'), '900', 90.0, 3);

CREATE TABLE live_metal_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metal_type_id UUID REFERENCES metal_types(id),
    purity_id UUID REFERENCES metal_purities(id),
    store_id UUID REFERENCES stores(id),

    -- Rates (per gram)
    buying_rate DECIMAL(10, 2) NOT NULL,
    selling_rate DECIMAL(10, 2) NOT NULL,

    -- Source
    rate_source VARCHAR(100), -- MANUAL, IBJA, MCX, INDIA_BULLION, API
    api_reference_id VARCHAR(255),

    -- Validity
    effective_from TIMESTAMP DEFAULT NOW(),
    effective_till TIMESTAMP,
    is_current BOOLEAN DEFAULT true,

    -- Audit
    updated_by UUID, -- staff_id
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_live_rates_current ON live_metal_rates(metal_type_id, purity_id, is_current);
CREATE INDEX idx_live_rates_store ON live_metal_rates(store_id, is_current);

-- Convert to hypertable for rate history
SELECT create_hypertable('live_metal_rates', 'created_at', if_not_exists => TRUE);

-- ============================================================================
-- PRODUCT CATALOG
-- ============================================================================

CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),

    category_name VARCHAR(255) NOT NULL,
    category_code VARCHAR(50),
    parent_category_id UUID REFERENCES product_categories(id),

    -- Display
    category_image_url VARCHAR(500),
    display_order INTEGER,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(store_id, category_code)
);

-- Standard categories: Rings, Necklaces, Earrings, Bangles, Bracelets, Chains, Pendants, Nose Pins, Anklets, etc.

CREATE TABLE product_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),
    category_id UUID REFERENCES product_categories(id),

    design_name VARCHAR(255) NOT NULL,
    design_code VARCHAR(100) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE,

    -- Design Details
    metal_type_id UUID REFERENCES metal_types(id),
    purity_id UUID REFERENCES metal_purities(id),
    design_type VARCHAR(50), -- TRADITIONAL, MODERN, ANTIQUE, TEMPLE, BRIDAL, CASUAL

    -- Physical Properties
    approx_gross_weight DECIMAL(10, 3), -- in grams
    approx_net_weight DECIMAL(10, 3),
    approx_stone_weight DECIMAL(10, 3),

    -- Diamond/Stone Details
    has_diamond BOOLEAN DEFAULT false,
    diamond_quality VARCHAR(50), -- VVS, VS, SI, etc.
    diamond_color VARCHAR(50), -- D, E, F, G, H, etc.
    diamond_cut VARCHAR(50), -- EXCELLENT, VERY_GOOD, GOOD
    approx_diamond_carats DECIMAL(8, 3),

    has_gemstones BOOLEAN DEFAULT false,
    gemstone_types TEXT[], -- Ruby, Emerald, Sapphire, etc.

    -- Making & Pricing
    making_charge_type VARCHAR(50) DEFAULT 'PER_GRAM', -- PER_GRAM, FIXED, PERCENTAGE
    making_charge_value DECIMAL(10, 2) NOT NULL,
    wastage_percentage DECIMAL(5, 2) DEFAULT 0,

    -- Additional charges
    stone_charge DECIMAL(10, 2) DEFAULT 0,
    other_charges DECIMAL(10, 2) DEFAULT 0,

    -- Description
    description TEXT,
    occasions TEXT[], -- Wedding, Engagement, Festival, Daily Wear

    -- Images
    primary_image_url VARCHAR(500),
    additional_images_urls TEXT[],

    -- BIS Hallmark
    is_hallmarked BOOLEAN DEFAULT false,
    hallmark_unique_id VARCHAR(100),

    -- Inventory
    is_stock_item BOOLEAN DEFAULT true, -- false for made-to-order

    -- Status
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_product_designs_sku ON product_designs(sku);
CREATE INDEX idx_product_designs_category ON product_designs(category_id);
CREATE INDEX idx_product_designs_metal ON product_designs(metal_type_id, purity_id);

-- ============================================================================
-- INVENTORY MANAGEMENT
-- ============================================================================

CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),
    design_id UUID REFERENCES product_designs(id),

    -- Unique Identification
    item_code VARCHAR(100) UNIQUE NOT NULL, -- Barcode/RFID
    tag_number VARCHAR(100),
    huid_number VARCHAR(100), -- Hallmark Unique Identification (BIS)

    -- Physical Properties
    gross_weight DECIMAL(10, 3) NOT NULL, -- in grams
    net_weight DECIMAL(10, 3) NOT NULL,
    stone_weight DECIMAL(10, 3) DEFAULT 0,
    diamond_weight DECIMAL(8, 3) DEFAULT 0, -- in carats

    -- Metal Details
    metal_type_id UUID REFERENCES metal_types(id),
    purity_id UUID REFERENCES metal_purities(id),
    purity_tested BOOLEAN DEFAULT false,
    purity_test_date DATE,

    -- Making & Costing
    making_charges DECIMAL(10, 2) NOT NULL,
    wastage_charges DECIMAL(10, 2) DEFAULT 0,
    stone_charges DECIMAL(10, 2) DEFAULT 0,
    other_charges DECIMAL(10, 2) DEFAULT 0,

    -- Pricing (at the time of stock entry)
    metal_rate_at_purchase DECIMAL(10, 2),
    purchase_price DECIMAL(10, 2) NOT NULL,
    mrp DECIMAL(10, 2),

    -- Size (for rings, bangles)
    size_value VARCHAR(20),

    -- BIS Hallmark
    is_hallmarked BOOLEAN DEFAULT false,
    hallmark_center VARCHAR(255),
    hallmark_date DATE,
    hallmark_certificate_url VARCHAR(500),

    -- Supplier Details
    supplier_id UUID, -- Will reference suppliers table
    purchase_date DATE,
    purchase_invoice_number VARCHAR(100),

    -- Status
    item_status VARCHAR(50) DEFAULT 'IN_STOCK', -- IN_STOCK, SOLD, RESERVED, IN_REPAIR, MELTED
    location_in_store VARCHAR(100), -- Showcase A, Vault, Display Window
    reserved_for_customer_id UUID,
    sold_date DATE,
    sold_invoice_id UUID,

    -- Images (actual item photos)
    item_images_urls TEXT[],

    -- Audit
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_inventory_items_store ON inventory_items(store_id);
CREATE INDEX idx_inventory_items_status ON inventory_items(item_status);
CREATE INDEX idx_inventory_items_tag ON inventory_items(tag_number);
CREATE INDEX idx_inventory_items_huid ON inventory_items(huid_number);

-- ============================================================================
-- CUSTOMER MANAGEMENT
-- ============================================================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),

    -- Customer IDs
    customer_code VARCHAR(50) UNIQUE NOT NULL,

    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(20),
    date_of_birth DATE,
    anniversary_date DATE,

    -- Contact
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp_number VARCHAR(20),

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),

    -- KYC
    aadhar_number VARCHAR(20),
    pan_number VARCHAR(20),
    aadhar_card_url VARCHAR(500),
    pan_card_url VARCHAR(500),

    -- Customer Segments
    customer_type VARCHAR(50) DEFAULT 'RETAIL', -- RETAIL, WHOLESALE, VIP, CORPORATE
    loyalty_tier VARCHAR(50) DEFAULT 'SILVER', -- SILVER, GOLD, PLATINUM, DIAMOND

    -- Preferences
    preferred_metal VARCHAR(50), -- GOLD, SILVER, PLATINUM
    preferred_style TEXT[], -- TRADITIONAL, MODERN, ANTIQUE, etc.
    preferred_occasions TEXT[], -- WEDDING, FESTIVAL, DAILY_WEAR

    -- Financial
    credit_limit DECIMAL(10, 2) DEFAULT 0,
    outstanding_balance DECIMAL(10, 2) DEFAULT 0,

    -- Statistics
    total_purchases DECIMAL(12, 2) DEFAULT 0,
    total_purchases_count INTEGER DEFAULT 0,
    last_purchase_date DATE,
    first_purchase_date DATE,

    -- Marketing Preferences
    sms_notifications BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    whatsapp_notifications BOOLEAN DEFAULT true,

    -- Portal Access (for scheme tracking, order status)
    portal_username VARCHAR(100) UNIQUE,
    portal_password_hash VARCHAR(255),

    customer_photo_url VARCHAR(500),

    -- Referral
    referred_by_customer_id UUID REFERENCES customers(id),
    referral_code VARCHAR(50) UNIQUE,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_code ON customers(customer_code);
CREATE INDEX idx_customers_store ON customers(store_id);

-- ============================================================================
-- GOLD SAVING SCHEMES
-- ============================================================================

CREATE TABLE scheme_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),

    scheme_name VARCHAR(255) NOT NULL,
    scheme_code VARCHAR(50) UNIQUE NOT NULL,

    -- Duration
    duration_months INTEGER NOT NULL, -- Usually 11 or 12 months
    total_installments INTEGER NOT NULL,

    -- Benefits
    bonus_type VARCHAR(50) NOT NULL, -- FIXED_AMOUNT, PERCENTAGE, ONE_MONTH_FREE
    bonus_amount DECIMAL(10, 2) DEFAULT 0,
    bonus_percentage DECIMAL(5, 2) DEFAULT 0,

    -- Installment
    min_installment_amount DECIMAL(10, 2) NOT NULL,
    installment_frequency VARCHAR(50) DEFAULT 'MONTHLY', -- MONTHLY, WEEKLY

    -- Terms
    allow_advance_payment BOOLEAN DEFAULT true,
    allow_missed_payments BOOLEAN DEFAULT false,
    max_missed_payments INTEGER DEFAULT 0,
    penalty_for_early_closure DECIMAL(10, 2) DEFAULT 0,

    -- Redemption
    redemption_value_calculation VARCHAR(50) DEFAULT 'TOTAL_PAID_PLUS_BONUS',
    can_redeem_cash BOOLEAN DEFAULT false,
    can_redeem_gold BOOLEAN DEFAULT true,
    making_charges_on_redemption BOOLEAN DEFAULT true,

    description TEXT,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scheme_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    scheme_plan_id UUID REFERENCES scheme_plans(id),
    store_id UUID REFERENCES stores(id),

    enrollment_number VARCHAR(50) UNIQUE NOT NULL,
    enrollment_date DATE NOT NULL,

    -- Installment Details
    monthly_installment_amount DECIMAL(10, 2) NOT NULL,
    total_installments INTEGER NOT NULL,
    installments_paid INTEGER DEFAULT 0,
    installments_remaining INTEGER,

    -- Financial Tracking
    total_amount_to_pay DECIMAL(10, 2) NOT NULL,
    total_amount_paid DECIMAL(10, 2) DEFAULT 0,
    bonus_amount DECIMAL(10, 2) DEFAULT 0,
    total_value DECIMAL(10, 2), -- Paid + Bonus

    -- Schedule
    next_due_date DATE,
    maturity_date DATE NOT NULL,

    -- Status
    scheme_status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, CLOSED, DEFAULTED
    completed_date DATE,
    is_redeemed BOOLEAN DEFAULT false,
    redeemed_date DATE,
    redemption_invoice_id UUID,

    remarks TEXT,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scheme_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES scheme_enrollments(id),
    customer_id UUID REFERENCES customers(id),

    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,
    installment_number INTEGER NOT NULL,

    amount_paid DECIMAL(10, 2) NOT NULL,

    -- Payment Method
    payment_mode VARCHAR(50) NOT NULL, -- CASH, CARD, UPI, CHEQUE
    transaction_id VARCHAR(255),
    cheque_number VARCHAR(50),
    upi_ref_id VARCHAR(100),

    is_advance_payment BOOLEAN DEFAULT false,
    is_late_payment BOOLEAN DEFAULT false,
    late_fee DECIMAL(10, 2) DEFAULT 0,

    remarks TEXT,

    collected_by UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scheme_payments_enrollment ON scheme_payments(enrollment_id);

-- ============================================================================
-- CUSTOM DESIGN ORDERS
-- ============================================================================

CREATE TABLE custom_design_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),
    customer_id UUID REFERENCES customers(id),

    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date DATE NOT NULL,

    -- Design Details
    product_category_id UUID REFERENCES product_categories(id),
    design_reference_id UUID REFERENCES product_designs(id), -- If based on existing design

    -- Metal Specifications
    metal_type_id UUID REFERENCES metal_types(id),
    purity_id UUID REFERENCES metal_purities(id),
    estimated_weight DECIMAL(10, 3),

    -- Customization
    has_diamond BOOLEAN DEFAULT false,
    diamond_specifications TEXT,
    has_gemstones BOOLEAN DEFAULT false,
    gemstone_specifications TEXT,

    size_required VARCHAR(20),

    -- Customer Requirements
    design_description TEXT NOT NULL,
    reference_images_urls TEXT[],
    special_instructions TEXT,

    -- Pricing
    estimated_making_charges DECIMAL(10, 2),
    estimated_stone_charges DECIMAL(10, 2),
    estimated_total_price DECIMAL(10, 2),
    advance_amount DECIMAL(10, 2) DEFAULT 0,
    advance_payment_id UUID,

    -- Timeline
    expected_delivery_date DATE,
    actual_delivery_date DATE,

    -- Production
    assigned_to_artisan_id UUID, -- Will reference staff
    production_status VARCHAR(50) DEFAULT 'DESIGN_PENDING',
    -- DESIGN_PENDING, DESIGN_APPROVED, IN_PRODUCTION, QUALITY_CHECK, READY, DELIVERED

    -- Approval
    design_sketch_url VARCHAR(500),
    design_approved_by_customer BOOLEAN DEFAULT false,
    design_approval_date DATE,

    -- Status
    order_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED

    remarks TEXT,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_custom_orders_customer ON custom_design_orders(customer_id);
CREATE INDEX idx_custom_orders_status ON custom_design_orders(order_status);

-- ============================================================================
-- SALES & INVOICING
-- ============================================================================

CREATE TABLE sales_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),
    customer_id UUID REFERENCES customers(id),

    -- Invoice Details
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    invoice_type VARCHAR(50) DEFAULT 'RETAIL', -- RETAIL, WHOLESALE, SCHEME_REDEMPTION, EXCHANGE

    -- Amounts
    subtotal_amount DECIMAL(12, 2) NOT NULL,

    -- Metal value
    metal_value DECIMAL(12, 2) DEFAULT 0,
    making_charges DECIMAL(12, 2) DEFAULT 0,
    stone_charges DECIMAL(12, 2) DEFAULT 0,
    wastage_charges DECIMAL(12, 2) DEFAULT 0,
    other_charges DECIMAL(12, 2) DEFAULT 0,

    -- Discounts
    discount_type VARCHAR(50), -- PERCENTAGE, FIXED, LOYALTY, SPECIAL_OFFER
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    discount_reason TEXT,

    -- GST
    cgst_amount DECIMAL(10, 2) DEFAULT 0,
    sgst_amount DECIMAL(10, 2) DEFAULT 0,
    igst_amount DECIMAL(10, 2) DEFAULT 0,
    total_gst DECIMAL(10, 2) DEFAULT 0,

    -- Rounding
    round_off DECIMAL(5, 2) DEFAULT 0,

    -- Grand Total
    grand_total DECIMAL(12, 2) NOT NULL,

    -- Old Gold Exchange
    has_old_gold_exchange BOOLEAN DEFAULT false,
    old_gold_weight DECIMAL(10, 3) DEFAULT 0,
    old_gold_purity_percentage DECIMAL(5, 2) DEFAULT 0,
    old_gold_rate_applied DECIMAL(10, 2) DEFAULT 0,
    old_gold_value DECIMAL(10, 2) DEFAULT 0,
    old_gold_deduction DECIMAL(10, 2) DEFAULT 0, -- Value after deduction

    -- Scheme Redemption
    is_scheme_redemption BOOLEAN DEFAULT false,
    scheme_enrollment_id UUID REFERENCES scheme_enrollments(id),
    scheme_value_redeemed DECIMAL(10, 2) DEFAULT 0,

    -- Net Payable
    net_payable_amount DECIMAL(12, 2) NOT NULL,

    -- Payment Details
    payment_status VARCHAR(50) DEFAULT 'PAID', -- PAID, PARTIAL, PENDING, CREDIT

    -- Invoice Generation
    invoice_pdf_url VARCHAR(500),
    e_invoice_generated BOOLEAN DEFAULT false,
    e_invoice_irn VARCHAR(100), -- Invoice Reference Number for GST e-invoice
    e_invoice_ack_number VARCHAR(100),
    e_invoice_ack_date TIMESTAMP,

    -- Sales Person
    sales_person_id UUID, -- staff_id
    commission_percentage DECIMAL(5, 2) DEFAULT 0,
    commission_amount DECIMAL(10, 2) DEFAULT 0,

    remarks TEXT,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_cancelled BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMP,
    cancelled_by UUID,
    cancellation_reason TEXT
);

CREATE INDEX idx_sales_invoices_number ON sales_invoices(invoice_number);
CREATE INDEX idx_sales_invoices_customer ON sales_invoices(customer_id);
CREATE INDEX idx_sales_invoices_date ON sales_invoices(invoice_date);
CREATE INDEX idx_sales_invoices_store ON sales_invoices(store_id);

CREATE TABLE sales_invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES sales_invoices(id) ON DELETE CASCADE,

    -- Item Reference
    inventory_item_id UUID REFERENCES inventory_items(id),
    design_id UUID REFERENCES product_designs(id),

    -- Item Details (snapshot at time of sale)
    item_code VARCHAR(100),
    item_description TEXT NOT NULL,
    huid_number VARCHAR(100),

    -- Metal
    metal_type VARCHAR(50),
    purity VARCHAR(50),
    gross_weight DECIMAL(10, 3),
    net_weight DECIMAL(10, 3),
    stone_weight DECIMAL(10, 3),
    diamond_weight DECIMAL(8, 3),

    -- Rate at time of sale
    metal_rate DECIMAL(10, 2) NOT NULL,

    -- Charges
    making_charges DECIMAL(10, 2) DEFAULT 0,
    wastage_charges DECIMAL(10, 2) DEFAULT 0,
    stone_charges DECIMAL(10, 2) DEFAULT 0,
    other_charges DECIMAL(10, 2) DEFAULT 0,

    -- Pricing
    item_value DECIMAL(10, 2) NOT NULL,
    gst_percentage DECIMAL(5, 2) DEFAULT 3.0,
    gst_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invoice_items_invoice ON sales_invoice_items(invoice_id);

CREATE TABLE sales_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES sales_invoices(id),
    customer_id UUID REFERENCES customers(id),

    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,

    amount_paid DECIMAL(12, 2) NOT NULL,

    -- Payment Method
    payment_mode VARCHAR(50) NOT NULL, -- CASH, CARD, UPI, CHEQUE, NEFT, OLD_GOLD

    -- Card
    card_type VARCHAR(50), -- CREDIT, DEBIT
    card_last_4_digits VARCHAR(4),
    card_transaction_id VARCHAR(255),

    -- UPI
    upi_ref_id VARCHAR(100),
    upi_app VARCHAR(50), -- GPAY, PHONEPE, PAYTM, BHIM

    -- Cheque
    cheque_number VARCHAR(50),
    cheque_date DATE,
    bank_name VARCHAR(255),
    cheque_status VARCHAR(50), -- PENDING, CLEARED, BOUNCED

    -- Online Transfer
    transaction_ref_number VARCHAR(255),

    -- Payment Gateway
    payment_gateway VARCHAR(50), -- RAZORPAY, PAYTM, PHONEPE
    gateway_order_id VARCHAR(255),
    gateway_payment_id VARCHAR(255),

    remarks TEXT,

    collected_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sales_payments_invoice ON sales_payments(invoice_id);
CREATE INDEX idx_sales_payments_receipt ON sales_payments(receipt_number);

-- ============================================================================
-- OLD GOLD PURCHASE & EXCHANGE
-- ============================================================================

CREATE TABLE old_gold_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),
    customer_id UUID REFERENCES customers(id),

    entry_number VARCHAR(50) UNIQUE NOT NULL,
    entry_date DATE NOT NULL,
    entry_type VARCHAR(50) NOT NULL, -- EXCHANGE, PURCHASE

    -- Metal Details
    metal_type VARCHAR(50) NOT NULL, -- GOLD, SILVER
    item_description TEXT NOT NULL,

    -- Weight
    gross_weight DECIMAL(10, 3) NOT NULL,
    stone_weight DECIMAL(10, 3) DEFAULT 0,
    net_weight DECIMAL(10, 3) NOT NULL,

    -- Purity
    declared_purity VARCHAR(50),
    tested_purity_percentage DECIMAL(5, 2) NOT NULL,
    purity_test_method VARCHAR(50), -- ACID_TEST, XRF, FIRE_ASSAY
    tested_by UUID, -- staff_id

    -- Valuation
    applicable_rate DECIMAL(10, 2) NOT NULL,
    base_value DECIMAL(10, 2) NOT NULL,
    deduction_percentage DECIMAL(5, 2) DEFAULT 0, -- Usually 5-10% deduction
    deduction_amount DECIMAL(10, 2) DEFAULT 0,
    final_value DECIMAL(10, 2) NOT NULL,

    -- Linked Transaction
    linked_invoice_id UUID REFERENCES sales_invoices(id), -- If part of exchange
    is_direct_purchase BOOLEAN DEFAULT false,

    -- If direct purchase (not exchange)
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    payment_mode VARCHAR(50),
    payment_reference VARCHAR(255),

    -- Item Photos
    item_photos_urls TEXT[],

    -- Status
    item_status VARCHAR(50) DEFAULT 'RECEIVED', -- RECEIVED, TESTED, VALUED, MELTED, SOLD
    melted_date DATE,
    melted_batch_number VARCHAR(100),

    remarks TEXT,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_old_gold_entries_customer ON old_gold_entries(customer_id);
CREATE INDEX idx_old_gold_entries_date ON old_gold_entries(entry_date);

-- ============================================================================
-- REPAIR & ALTERATION SERVICES
-- ============================================================================

CREATE TABLE repair_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),
    customer_id UUID REFERENCES customers(id),

    job_number VARCHAR(50) UNIQUE NOT NULL,
    job_date DATE NOT NULL,

    -- Item Details
    item_description TEXT NOT NULL,
    metal_type VARCHAR(50),
    approximate_weight DECIMAL(10, 3),

    -- Service Type
    service_type VARCHAR(50)[] NOT NULL, -- REPAIR, RESIZE, POLISH, RHODIUM_PLATING, STONE_FIXING, CHAIN_LINK_REPAIR

    -- Problem Description
    issue_description TEXT NOT NULL,
    item_photos_urls TEXT[],

    -- Estimate
    estimated_charges DECIMAL(10, 2),
    estimated_delivery_date DATE,
    advance_amount DECIMAL(10, 2) DEFAULT 0,

    -- Assignment
    assigned_to_artisan_id UUID, -- staff_id
    work_started_date DATE,

    -- Completion
    actual_completion_date DATE,
    actual_charges DECIMAL(10, 2),
    additional_work_done TEXT,

    -- Quality Check
    quality_checked BOOLEAN DEFAULT false,
    quality_checked_by UUID,
    quality_check_date DATE,
    quality_remarks TEXT,

    -- Delivery
    delivered_date DATE,
    delivered_to VARCHAR(255),
    delivery_acknowledgement_url VARCHAR(500),

    -- Status
    job_status VARCHAR(50) DEFAULT 'RECEIVED',
    -- RECEIVED, WORK_IN_PROGRESS, COMPLETED, QUALITY_CHECK, READY_FOR_DELIVERY, DELIVERED

    -- Payment
    payment_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, ADVANCE_PAID, PAID

    remarks TEXT,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_repair_jobs_customer ON repair_jobs(customer_id);
CREATE INDEX idx_repair_jobs_status ON repair_jobs(job_status);

-- ============================================================================
-- SUPPLIER & PURCHASE MANAGEMENT
-- ============================================================================

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),

    supplier_name VARCHAR(255) NOT NULL,
    supplier_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_type VARCHAR(50), -- MANUFACTURER, WHOLESALER, ARTISAN, DIAMOND_MERCHANT

    -- Contact
    contact_person VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp_number VARCHAR(20),

    -- Address
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),

    -- Business Details
    gstin VARCHAR(20),
    pan_number VARCHAR(20),
    business_nature TEXT,

    -- Banking
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    upi_id VARCHAR(100),

    -- Credit Terms
    credit_period_days INTEGER DEFAULT 0,
    credit_limit DECIMAL(12, 2) DEFAULT 0,

    -- Statistics
    total_purchases DECIMAL(12, 2) DEFAULT 0,
    outstanding_amount DECIMAL(12, 2) DEFAULT 0,

    -- Rating
    supplier_rating DECIMAL(2, 1), -- Out of 5

    remarks TEXT,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_suppliers_code ON suppliers(supplier_code);

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),
    supplier_id UUID REFERENCES suppliers(id),

    -- PO Details
    po_number VARCHAR(50) UNIQUE NOT NULL,
    po_date DATE NOT NULL,
    expected_delivery_date DATE,

    -- Items ordered (JSON for flexibility)
    items_ordered JSONB NOT NULL,
    -- [{design_code: "", metal: "", purity: "", weight: "", making_charge: "", quantity: 1, ...}]

    -- Amounts
    subtotal_amount DECIMAL(12, 2) NOT NULL,
    cgst_amount DECIMAL(10, 2) DEFAULT 0,
    sgst_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,

    -- Terms
    payment_terms VARCHAR(50), -- ADVANCE, CREDIT, COD
    advance_percentage DECIMAL(5, 2) DEFAULT 0,
    advance_amount DECIMAL(10, 2) DEFAULT 0,

    -- Status
    po_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, CONFIRMED, PARTIALLY_RECEIVED, RECEIVED, CANCELLED

    special_instructions TEXT,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE purchase_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),
    supplier_id UUID REFERENCES suppliers(id),
    po_id UUID REFERENCES purchase_orders(id),

    -- Invoice Details
    supplier_invoice_number VARCHAR(100) NOT NULL,
    our_receipt_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,

    -- Amounts
    subtotal_amount DECIMAL(12, 2) NOT NULL,
    cgst_amount DECIMAL(10, 2) DEFAULT 0,
    sgst_amount DECIMAL(10, 2) DEFAULT 0,
    igst_amount DECIMAL(10, 2) DEFAULT 0,
    total_gst DECIMAL(10, 2) DEFAULT 0,
    round_off DECIMAL(5, 2) DEFAULT 0,
    grand_total DECIMAL(12, 2) NOT NULL,

    -- Payment
    payment_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PARTIAL, PAID
    amount_paid DECIMAL(12, 2) DEFAULT 0,
    balance_amount DECIMAL(12, 2),
    payment_due_date DATE,

    -- Documents
    invoice_pdf_url VARCHAR(500),

    remarks TEXT,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE supplier_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id),
    purchase_invoice_id UUID REFERENCES purchase_invoices(id),

    payment_voucher_number VARCHAR(50) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,

    amount_paid DECIMAL(12, 2) NOT NULL,

    payment_mode VARCHAR(50) NOT NULL, -- CASH, CHEQUE, NEFT, RTGS, UPI
    transaction_reference VARCHAR(255),

    cheque_number VARCHAR(50),
    cheque_date DATE,
    bank_name VARCHAR(255),

    remarks TEXT,

    paid_by UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- STAFF & USERS
-- ============================================================================

CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),

    employee_code VARCHAR(50) UNIQUE NOT NULL,

    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),

    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),

    address TEXT,

    -- Employment
    designation VARCHAR(100) NOT NULL, -- MANAGER, SALES_PERSON, CASHIER, GOLDSMITH, SECURITY, ACCOUNTANT
    date_of_joining DATE NOT NULL,
    employment_type VARCHAR(50), -- PERMANENT, CONTRACT, TEMPORARY

    -- Salary
    basic_salary DECIMAL(10, 2),

    -- Commission (for sales persons)
    commission_applicable BOOLEAN DEFAULT false,
    commission_percentage DECIMAL(5, 2) DEFAULT 0,

    -- Banking
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),

    -- System Access
    system_username VARCHAR(100) UNIQUE,
    system_password_hash VARCHAR(255),
    system_role VARCHAR(50), -- ADMIN, MANAGER, SALES, CASHIER, GOLDSMITH, ACCOUNTANT

    -- Permissions
    can_create_invoice BOOLEAN DEFAULT false,
    can_give_discount BOOLEAN DEFAULT false,
    max_discount_percentage DECIMAL(5, 2) DEFAULT 0,
    can_accept_old_gold BOOLEAN DEFAULT false,
    can_test_purity BOOLEAN DEFAULT false,
    can_modify_rates BOOLEAN DEFAULT false,
    can_access_reports BOOLEAN DEFAULT false,

    photo_url VARCHAR(500),

    employment_status VARCHAR(50) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_staff_employee_code ON staff(employee_code);
CREATE INDEX idx_staff_store ON staff(store_id);

-- ============================================================================
-- ANALYTICS & REPORTS (TimescaleDB)
-- ============================================================================

CREATE TABLE daily_sales_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),

    summary_date DATE NOT NULL,

    -- Sales Count
    total_invoices INTEGER DEFAULT 0,
    total_items_sold INTEGER DEFAULT 0,

    -- Revenue
    gross_revenue DECIMAL(12, 2) DEFAULT 0,
    total_discounts DECIMAL(12, 2) DEFAULT 0,
    net_revenue DECIMAL(12, 2) DEFAULT 0,

    -- Metal Sales
    total_gold_weight_sold DECIMAL(10, 3) DEFAULT 0,
    total_silver_weight_sold DECIMAL(10, 3) DEFAULT 0,
    gold_revenue DECIMAL(12, 2) DEFAULT 0,
    silver_revenue DECIMAL(12, 2) DEFAULT 0,

    -- Making Charges
    total_making_charges DECIMAL(12, 2) DEFAULT 0,

    -- Old Gold
    old_gold_exchanges INTEGER DEFAULT 0,
    old_gold_weight_received DECIMAL(10, 3) DEFAULT 0,
    old_gold_value DECIMAL(12, 2) DEFAULT 0,

    -- Schemes
    scheme_enrollments INTEGER DEFAULT 0,
    scheme_payments_received DECIMAL(10, 2) DEFAULT 0,
    scheme_redemptions INTEGER DEFAULT 0,

    -- Repair Jobs
    repair_jobs_received INTEGER DEFAULT 0,
    repair_revenue DECIMAL(10, 2) DEFAULT 0,

    -- Customers
    unique_customers INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(store_id, summary_date)
);

SELECT create_hypertable('daily_sales_summary', 'created_at', if_not_exists => TRUE);

CREATE TABLE hourly_footfall (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),

    recorded_at TIMESTAMP NOT NULL,
    hour_of_day INTEGER NOT NULL,

    footfall_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0, -- Visitors who made purchase
    conversion_rate DECIMAL(5, 2),

    created_at TIMESTAMP DEFAULT NOW()
);

SELECT create_hypertable('hourly_footfall', 'created_at', if_not_exists => TRUE);

CREATE TABLE metal_rate_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metal_type VARCHAR(50) NOT NULL,
    purity VARCHAR(50) NOT NULL,

    date DATE NOT NULL,
    opening_rate DECIMAL(10, 2),
    high_rate DECIMAL(10, 2),
    low_rate DECIMAL(10, 2),
    closing_rate DECIMAL(10, 2),

    source VARCHAR(100),

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(metal_type, purity, date)
);

SELECT create_hypertable('metal_rate_history', 'created_at', if_not_exists => TRUE);

-- ============================================================================
-- SYSTEM AUDIT & LOGS
-- ============================================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),

    user_id UUID,
    user_type VARCHAR(50),

    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,

    action_description TEXT,
    old_values JSONB,
    new_values JSONB,

    ip_address VARCHAR(50),
    user_agent TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
SELECT create_hypertable('audit_logs', 'created_at', if_not_exists => TRUE);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Current stock summary by metal and purity
CREATE VIEW v_current_stock_summary AS
SELECT
    s.store_id,
    mt.metal_name,
    mp.purity_name,
    COUNT(*) as total_items,
    SUM(ii.net_weight) as total_net_weight,
    SUM(ii.gross_weight) as total_gross_weight,
    AVG(ii.making_charges) as avg_making_charges
FROM inventory_items ii
JOIN metal_types mt ON ii.metal_type_id = mt.id
JOIN metal_purities mp ON ii.purity_id = mp.id
JOIN stores s ON ii.store_id = s.id
WHERE ii.item_status = 'IN_STOCK'
GROUP BY s.store_id, mt.metal_name, mp.purity_name
ORDER BY mt.display_order, mp.display_order;

-- Today's sales summary
CREATE VIEW v_todays_sales AS
SELECT
    si.store_id,
    COUNT(*) as total_invoices,
    SUM(si.grand_total) as gross_revenue,
    SUM(si.discount_amount) as total_discounts,
    SUM(si.net_payable_amount) as net_revenue,
    COUNT(DISTINCT si.customer_id) as unique_customers
FROM sales_invoices si
WHERE si.invoice_date = CURRENT_DATE
  AND si.is_cancelled = false
GROUP BY si.store_id;

-- Active scheme enrollments
CREATE VIEW v_active_schemes AS
SELECT
    se.id,
    se.enrollment_number,
    c.customer_code,
    c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
    c.phone,
    sp.scheme_name,
    se.monthly_installment_amount,
    se.total_installments,
    se.installments_paid,
    se.installments_remaining,
    se.next_due_date,
    se.maturity_date,
    se.total_amount_paid,
    se.total_value
FROM scheme_enrollments se
JOIN customers c ON se.customer_id = c.id
JOIN scheme_plans sp ON se.scheme_plan_id = sp.id
WHERE se.scheme_status = 'ACTIVE'
ORDER BY se.next_due_date;

-- Customer purchase history
CREATE VIEW v_customer_purchase_history AS
SELECT
    c.id as customer_id,
    c.customer_code,
    c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
    c.phone,
    COUNT(si.id) as total_purchases,
    SUM(si.grand_total) as lifetime_value,
    MAX(si.invoice_date) as last_purchase_date,
    MIN(si.invoice_date) as first_purchase_date
FROM customers c
LEFT JOIN sales_invoices si ON c.id = si.customer_id AND si.is_cancelled = false
GROUP BY c.id, c.customer_code, c.first_name, c.last_name, c.phone;

-- Pending repair jobs
CREATE VIEW v_pending_repair_jobs AS
SELECT
    rj.job_number,
    c.customer_code,
    c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
    c.phone,
    rj.item_description,
    rj.service_type,
    rj.job_date,
    rj.estimated_delivery_date,
    rj.job_status,
    CURRENT_DATE - rj.estimated_delivery_date as days_overdue,
    rj.estimated_charges
FROM repair_jobs rj
JOIN customers c ON rj.customer_id = c.id
WHERE rj.job_status NOT IN ('DELIVERED')
ORDER BY rj.estimated_delivery_date;

-- Supplier outstanding payments
CREATE VIEW v_supplier_outstanding AS
SELECT
    s.supplier_code,
    s.supplier_name,
    s.phone,
    COUNT(pi.id) as pending_invoices,
    SUM(pi.balance_amount) as total_outstanding,
    MIN(pi.payment_due_date) as oldest_due_date
FROM suppliers s
JOIN purchase_invoices pi ON s.id = pi.supplier_id
WHERE pi.payment_status IN ('PENDING', 'PARTIAL')
GROUP BY s.id, s.supplier_code, s.supplier_name, s.phone
HAVING SUM(pi.balance_amount) > 0
ORDER BY total_outstanding DESC;

-- Low stock alert (designs with less than 2 items)
CREATE VIEW v_low_stock_designs AS
SELECT
    pd.design_code,
    pd.design_name,
    pc.category_name,
    mt.metal_name,
    mp.purity_name,
    COUNT(ii.id) as current_stock
FROM product_designs pd
JOIN product_categories pc ON pd.category_id = pc.id
JOIN metal_types mt ON pd.metal_type_id = mt.id
JOIN metal_purities mp ON pd.purity_id = mp.id
LEFT JOIN inventory_items ii ON pd.id = ii.design_id AND ii.item_status = 'IN_STOCK'
WHERE pd.is_stock_item = true
GROUP BY pd.design_code, pd.design_name, pc.category_name, mt.metal_name, mp.purity_name
HAVING COUNT(ii.id) < 2
ORDER BY current_stock ASC;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update inventory item status when sold
CREATE OR REPLACE FUNCTION update_inventory_item_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.inventory_item_id IS NOT NULL THEN
        UPDATE inventory_items
        SET item_status = 'SOLD',
            sold_date = (SELECT invoice_date FROM sales_invoices WHERE id = NEW.invoice_id),
            sold_invoice_id = NEW.invoice_id
        WHERE id = NEW.inventory_item_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_on_sale
AFTER INSERT ON sales_invoice_items
FOR EACH ROW
EXECUTE FUNCTION update_inventory_item_on_sale();

-- Auto-update customer statistics
CREATE OR REPLACE FUNCTION update_customer_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE customers
        SET total_purchases = COALESCE(total_purchases, 0) + NEW.grand_total,
            total_purchases_count = COALESCE(total_purchases_count, 0) + 1,
            last_purchase_date = NEW.invoice_date,
            first_purchase_date = COALESCE(first_purchase_date, NEW.invoice_date)
        WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_statistics
AFTER INSERT ON sales_invoices
FOR EACH ROW
EXECUTE FUNCTION update_customer_statistics();

-- Auto-update scheme enrollment on payment
CREATE OR REPLACE FUNCTION update_scheme_on_payment()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE scheme_enrollments
    SET installments_paid = installments_paid + 1,
        total_amount_paid = total_amount_paid + NEW.amount_paid,
        installments_remaining = total_installments - (installments_paid + 1),
        next_due_date = CASE
            WHEN (installments_paid + 1) < total_installments
            THEN next_due_date + INTERVAL '1 month'
            ELSE NULL
        END,
        scheme_status = CASE
            WHEN (installments_paid + 1) >= total_installments
            THEN 'COMPLETED'
            ELSE scheme_status
        END,
        completed_date = CASE
            WHEN (installments_paid + 1) >= total_installments
            THEN NEW.payment_date
            ELSE NULL
        END
    WHERE id = NEW.enrollment_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_scheme_on_payment
AFTER INSERT ON scheme_payments
FOR EACH ROW
EXECUTE FUNCTION update_scheme_on_payment();

-- Auto-update current rate flag
CREATE OR REPLACE FUNCTION update_metal_rate_current_flag()
RETURNS TRIGGER AS $$
BEGIN
    -- Set all previous rates to not current
    UPDATE live_metal_rates
    SET is_current = false
    WHERE metal_type_id = NEW.metal_type_id
      AND purity_id = NEW.purity_id
      AND store_id = NEW.store_id
      AND id != NEW.id;

    -- Ensure new rate is marked as current
    NEW.is_current := true;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_metal_rate_current
BEFORE INSERT ON live_metal_rates
FOR EACH ROW
EXECUTE FUNCTION update_metal_rate_current_flag();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_inventory_updated_at BEFORE UPDATE ON inventory_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_inventory_design ON inventory_items(design_id);
CREATE INDEX idx_inventory_metal_purity ON inventory_items(metal_type_id, purity_id);
CREATE INDEX idx_sales_invoices_customer_date ON sales_invoices(customer_id, invoice_date);
CREATE INDEX idx_scheme_enrollments_status ON scheme_enrollments(scheme_status);
CREATE INDEX idx_custom_orders_status_date ON custom_design_orders(order_status, order_date);

-- Text search
CREATE INDEX idx_customers_name_search ON customers USING gin(to_tsvector('english', first_name || ' ' || COALESCE(last_name, '')));
CREATE INDEX idx_product_designs_name_search ON product_designs USING gin(to_tsvector('english', design_name));

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE stores IS 'Jewellery store locations with multi-store chain support';
COMMENT ON TABLE live_metal_rates IS 'Real-time gold/silver/platinum rates with history tracking';
COMMENT ON TABLE inventory_items IS 'Individual jewellery pieces with unique HUID and BIS hallmark';
COMMENT ON TABLE scheme_enrollments IS 'Gold saving scheme enrollments with installment tracking';
COMMENT ON TABLE custom_design_orders IS 'Made-to-order custom jewellery with customer specifications';
COMMENT ON TABLE sales_invoices IS 'Sales billing with old gold exchange and scheme redemption';
COMMENT ON TABLE old_gold_entries IS 'Old gold acceptance with purity testing and valuation';
COMMENT ON TABLE repair_jobs IS 'Jewellery repair and alteration service tracking';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
