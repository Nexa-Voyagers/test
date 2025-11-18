-- ============================================================================
-- RESTAURANT & FOOD SERVICE MANAGEMENT SYSTEM - COMPLETE DATABASE SCHEMA
-- Version: 2.0.0
-- Optimized for: Fine Dining, QSR, Cloud Kitchens, Multi-location Restaurants
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- RESTAURANT HIERARCHY & ORGANIZATION
-- ============================================================================

CREATE TABLE restaurant_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_name VARCHAR(255) NOT NULL,
    group_code VARCHAR(50) UNIQUE NOT NULL,

    -- Corporate Details
    legal_entity_name VARCHAR(255),
    gst_number VARCHAR(20),
    pan_number VARCHAR(15),
    fssai_license VARCHAR(20),

    -- Contact
    corporate_address TEXT,
    corporate_email VARCHAR(255),
    corporate_phone VARCHAR(20),

    -- Multi-location Settings
    centralized_inventory BOOLEAN DEFAULT false,
    centralized_menu BOOLEAN DEFAULT false,
    centralized_pricing BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES restaurant_groups(id),

    -- Basic Info
    restaurant_name VARCHAR(255) NOT NULL,
    restaurant_code VARCHAR(50) UNIQUE NOT NULL,
    restaurant_type VARCHAR(50), -- fine_dining, casual_dining, qsr, cloud_kitchen, cafe
    cuisine_types TEXT[], -- north_indian, south_indian, chinese, italian, etc.

    -- Location
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOGRAPHY(POINT),

    -- Contact
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),

    -- Operational
    opening_time TIME DEFAULT '10:00:00',
    closing_time TIME DEFAULT '23:00:00',
    seating_capacity INTEGER,
    total_tables INTEGER,

    -- Services
    has_dine_in BOOLEAN DEFAULT true,
    has_takeaway BOOLEAN DEFAULT true,
    has_delivery BOOLEAN DEFAULT false,
    has_catering BOOLEAN DEFAULT false,

    -- Compliance
    fssai_license VARCHAR(20),
    gst_number VARCHAR(20),

    -- Settings
    default_currency VARCHAR(3) DEFAULT 'INR',
    tax_rate_cgst DECIMAL(5, 2) DEFAULT 2.5,
    tax_rate_sgst DECIMAL(5, 2) DEFAULT 2.5,
    service_charge_percent DECIMAL(5, 2) DEFAULT 0,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MENU MANAGEMENT
-- ============================================================================

CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,

    category_name VARCHAR(100) NOT NULL,
    category_code VARCHAR(50),
    description TEXT,

    parent_category_id UUID REFERENCES menu_categories(id),

    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id),

    -- Item Details
    item_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(50) UNIQUE,
    description TEXT,
    short_description VARCHAR(500),

    -- Pricing
    base_price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2), -- For profitability analysis

    -- Variants (sizes, flavors)
    has_variants BOOLEAN DEFAULT false,

    -- Classification
    cuisine_type VARCHAR(50),
    course_type VARCHAR(50), -- starter, main, dessert, beverage

    food_type VARCHAR(20) DEFAULT 'VEG', -- VEG, NON_VEG, VEGAN, JAIN, HALAL
    spice_level VARCHAR(20), -- MILD, MEDIUM, HOT, EXTRA_HOT

    -- Dietary Info
    is_gluten_free BOOLEAN DEFAULT false,
    is_dairy_free BOOLEAN DEFAULT false,
    allergens TEXT[],

    -- Preparation
    preparation_time_minutes INTEGER DEFAULT 15,
    cooking_station VARCHAR(50), -- KITCHEN_HOT, KITCHEN_COLD, BAR, TANDOOR

    -- Availability
    available_for_dine_in BOOLEAN DEFAULT true,
    available_for_takeaway BOOLEAN DEFAULT true,
    available_for_delivery BOOLEAN DEFAULT true,

    -- Stock Management
    track_inventory BOOLEAN DEFAULT false,
    current_stock INTEGER,
    low_stock_threshold INTEGER,

    -- Marketing
    is_featured BOOLEAN DEFAULT false,
    is_chef_special BOOLEAN DEFAULT false,
    is_seasonal BOOLEAN DEFAULT false,

    -- Media
    image_url VARCHAR(500),
    images JSONB[], -- Additional images

    -- Status
    is_available BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,

    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_name ON menu_items USING gin (to_tsvector('english', item_name));

-- Item Variants (Size, Flavor, etc.)
CREATE TABLE menu_item_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,

    variant_name VARCHAR(100) NOT NULL, -- Small, Medium, Large / Extra Cheese
    variant_type VARCHAR(50), -- SIZE, FLAVOR, TOPPING

    price_adjustment DECIMAL(10, 2) DEFAULT 0, -- Additional price

    is_default BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipe & Ingredients (for inventory management)
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,

    recipe_name VARCHAR(255),
    instructions TEXT,

    yield_quantity DECIMAL(10, 2),
    yield_unit VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory_items(id),

    quantity DECIMAL(10, 3) NOT NULL,
    unit VARCHAR(20) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE & FLOOR MANAGEMENT
-- ============================================================================

CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,

    floor_name VARCHAR(100) NOT NULL,
    floor_number INTEGER,

    total_tables INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    floor_id UUID REFERENCES floors(id),

    table_number VARCHAR(20) NOT NULL,
    table_name VARCHAR(100),

    seating_capacity INTEGER DEFAULT 4,
    table_type VARCHAR(50) DEFAULT 'REGULAR', -- REGULAR, VIP, OUTDOOR, BAR

    -- Position (for floor map)
    position_x INTEGER,
    position_y INTEGER,

    -- Status
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    -- AVAILABLE, OCCUPIED, RESERVED, CLEANING, OUT_OF_SERVICE

    -- Current Session
    current_order_id UUID REFERENCES orders(id),
    occupied_since TIMESTAMP,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(restaurant_id, table_number)
);

CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);
CREATE INDEX idx_tables_status ON tables(status);

-- Table Reservations
CREATE TABLE table_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id),
    table_id UUID REFERENCES tables(id),
    customer_id UUID REFERENCES customers(id),

    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,

    party_size INTEGER NOT NULL,

    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),

    special_requests TEXT,
    occasion VARCHAR(50), -- birthday, anniversary, business

    status VARCHAR(50) DEFAULT 'CONFIRMED',
    -- CONFIRMED, ARRIVED, SEATED, CANCELLED, NO_SHOW

    arrived_at TIMESTAMP,
    seated_at TIMESTAMP,

    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CUSTOMER MANAGEMENT
-- ============================================================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,

    -- Address (for delivery)
    addresses JSONB[], -- [{line1, line2, city, pincode, is_default}]

    -- Preferences
    food_preferences TEXT[], -- vegetarian, vegan, jain, halal
    allergens TEXT[],
    spice_preference VARCHAR(20),

    -- History
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    last_order_date DATE,
    first_order_date DATE,

    -- Loyalty
    loyalty_points INTEGER DEFAULT 0,
    loyalty_tier VARCHAR(50) DEFAULT 'SILVER',

    -- Marketing
    marketing_consent BOOLEAN DEFAULT false,
    whatsapp_consent BOOLEAN DEFAULT true,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

-- ============================================================================
-- ORDER MANAGEMENT (POS)
-- ============================================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id),

    -- Order Identification
    order_number VARCHAR(30) UNIQUE NOT NULL, -- ORD-LKO-20251118-001
    token_number INTEGER, -- For display in kitchen

    -- Order Type
    order_type VARCHAR(50) NOT NULL,
    -- DINE_IN, TAKEAWAY, DELIVERY, DRIVE_THROUGH

    -- Customer
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),

    -- Dine-in Specific
    table_id UUID REFERENCES tables(id),
    floor_id UUID REFERENCES floors(id),
    guest_count INTEGER,

    -- Delivery Specific
    delivery_address JSONB,
    delivery_instructions TEXT,
    delivery_partner VARCHAR(100), -- own_fleet, swiggy, zomato
    delivery_charge DECIMAL(8, 2) DEFAULT 0,

    -- Order Details
    order_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Status
    order_status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, CONFIRMED, PREPARING, READY, SERVED, COMPLETED, CANCELLED

    -- Timing
    confirmed_at TIMESTAMP,
    preparing_started_at TIMESTAMP,
    ready_at TIMESTAMP,
    served_at TIMESTAMP,
    completed_at TIMESTAMP,

    -- Billing
    subtotal DECIMAL(10, 2) NOT NULL,

    discount_amount DECIMAL(10, 2) DEFAULT 0,
    discount_reason TEXT,

    cgst_amount DECIMAL(10, 2) DEFAULT 0,
    sgst_amount DECIMAL(10, 2) DEFAULT 0,
    service_charge_amount DECIMAL(10, 2) DEFAULT 0,

    packaging_charge DECIMAL(8, 2) DEFAULT 0,

    total_amount DECIMAL(10, 2) NOT NULL,

    -- Payment
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, PARTIAL, PAID, REFUNDED

    paid_amount DECIMAL(10, 2) DEFAULT 0,
    balance_amount DECIMAL(10, 2),

    -- Staff
    waiter_id UUID REFERENCES users(id),
    captain_id UUID REFERENCES users(id),
    cashier_id UUID REFERENCES users(id),

    -- Notes
    special_instructions TEXT,
    internal_notes TEXT,

    -- Cancellation
    cancelled_at TIMESTAMP,
    cancelled_by UUID REFERENCES users(id),
    cancellation_reason TEXT,

    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_datetime ON orders(order_datetime);
CREATE INDEX idx_orders_table ON orders(table_id);

-- Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),

    item_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(50),

    -- Variant
    variant_id UUID REFERENCES menu_item_variants(id),
    variant_name VARCHAR(100),

    -- Quantity
    quantity INTEGER NOT NULL DEFAULT 1,

    -- Pricing
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,

    -- Customizations
    customizations TEXT[], -- Extra cheese, No onions, etc.
    special_instructions TEXT,

    -- Kitchen Status
    kot_status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, SENT_TO_KITCHEN, PREPARING, READY, SERVED

    kot_printed_at TIMESTAMP,
    preparation_started_at TIMESTAMP,
    ready_at TIMESTAMP,
    served_at TIMESTAMP,

    -- Cooking Station
    cooking_station VARCHAR(50),

    -- Cancellation
    is_cancelled BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_status ON order_items(kot_status);

-- KOT (Kitchen Order Ticket) Log
CREATE TABLE kot_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),

    kot_number VARCHAR(30) NOT NULL,
    cooking_station VARCHAR(50),

    items JSONB, -- Array of items in this KOT

    printed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    printed_by UUID REFERENCES users(id),

    completed_at TIMESTAMP
);

-- ============================================================================
-- PAYMENT MANAGEMENT
-- ============================================================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id),
    order_id UUID REFERENCES orders(id),

    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    payment_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    amount DECIMAL(10, 2) NOT NULL,

    payment_method VARCHAR(50) NOT NULL,
    -- CASH, CARD, UPI, WALLET, ONLINE

    -- Card Details (if applicable)
    card_type VARCHAR(20), -- VISA, MASTERCARD, AMEX
    card_last4 VARCHAR(4),

    -- Digital Payment
    upi_transaction_id VARCHAR(255),
    payment_gateway VARCHAR(50), -- razorpay, paytm, phonepe
    gateway_transaction_id VARCHAR(255),

    -- Status
    payment_status VARCHAR(50) DEFAULT 'SUCCESS',
    -- SUCCESS, PENDING, FAILED, REFUNDED

    refund_amount DECIMAL(10, 2) DEFAULT 0,
    refunded_at TIMESTAMP,
    refund_reason TEXT,

    collected_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INVENTORY MANAGEMENT
-- ============================================================================

CREATE TABLE inventory_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) NOT NULL,
    parent_category_id UUID REFERENCES inventory_categories(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id),
    category_id UUID REFERENCES inventory_categories(id),

    item_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(50) UNIQUE,

    description TEXT,

    -- Measurement
    base_unit VARCHAR(20) NOT NULL, -- kg, liter, piece

    -- Stock
    current_stock DECIMAL(10, 3) DEFAULT 0,
    min_stock_level DECIMAL(10, 3) DEFAULT 0,
    max_stock_level DECIMAL(10, 3),

    -- Pricing
    avg_cost_price DECIMAL(10, 2),

    -- Supplier
    primary_supplier_id UUID REFERENCES suppliers(id),

    -- Perishable
    is_perishable BOOLEAN DEFAULT false,
    shelf_life_days INTEGER,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Transactions
CREATE TABLE stock_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id),
    inventory_item_id UUID REFERENCES inventory_items(id),

    transaction_type VARCHAR(50) NOT NULL,
    -- PURCHASE, CONSUMPTION, WASTAGE, TRANSFER, ADJUSTMENT

    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    quantity DECIMAL(10, 3) NOT NULL,
    unit VARCHAR(20),

    -- Before/After Stock
    stock_before DECIMAL(10, 3),
    stock_after DECIMAL(10, 3),

    -- Cost
    unit_cost DECIMAL(10, 2),
    total_cost DECIMAL(10, 2),

    -- Reference
    reference_id UUID, -- Purchase order ID, Order ID, etc.
    reference_type VARCHAR(50),

    notes TEXT,

    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SUPPLIER & PROCUREMENT
-- ============================================================================

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    supplier_name VARCHAR(255) NOT NULL,
    supplier_code VARCHAR(50) UNIQUE,

    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),

    address TEXT,
    gst_number VARCHAR(20),

    -- Payment Terms
    payment_terms VARCHAR(100), -- NET_30, NET_60, COD
    credit_limit DECIMAL(12, 2),

    -- Category
    supplier_category VARCHAR(100), -- vegetables, dairy, meat, dry_goods

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id),
    supplier_id UUID REFERENCES suppliers(id),

    po_number VARCHAR(30) UNIQUE NOT NULL,
    po_date DATE DEFAULT CURRENT_DATE,

    expected_delivery_date DATE,

    -- Status
    status VARCHAR(50) DEFAULT 'DRAFT',
    -- DRAFT, SENT, CONFIRMED, PARTIALLY_RECEIVED, RECEIVED, CANCELLED

    -- Totals
    subtotal DECIMAL(12, 2),
    tax_amount DECIMAL(12, 2),
    total_amount DECIMAL(12, 2),

    -- Payment
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    paid_amount DECIMAL(12, 2) DEFAULT 0,

    notes TEXT,

    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory_items(id),

    quantity DECIMAL(10, 3) NOT NULL,
    unit VARCHAR(20),

    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,

    received_quantity DECIMAL(10, 3) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ONLINE ORDERING (0% Commission)
-- ============================================================================

CREATE TABLE online_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),

    -- Online Order Specific
    order_source VARCHAR(50), -- WEBSITE, MOBILE_APP, WHATSAPP

    -- Delivery
    delivery_type VARCHAR(50), -- HOME_DELIVERY, SELF_PICKUP
    delivery_time_slot VARCHAR(50),

    -- Tracking
    order_tracking_link VARCHAR(500),
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,

    -- Customer Feedback
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- OTA INTEGRATION (Swiggy, Zomato)
-- ============================================================================

CREATE TABLE delivery_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id),

    partner_name VARCHAR(100) NOT NULL, -- swiggy, zomato, own_fleet

    -- API Credentials
    api_endpoint VARCHAR(500),
    api_key TEXT,
    restaurant_id_on_platform VARCHAR(100),

    -- Commission
    commission_percent DECIMAL(5, 2),

    -- Auto Import
    auto_import_orders BOOLEAN DEFAULT false,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE imported_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_partner_id UUID REFERENCES delivery_partners(id),
    order_id UUID REFERENCES orders(id),

    external_order_id VARCHAR(255) NOT NULL,

    commission_amount DECIMAL(10, 2),
    net_amount DECIMAL(10, 2),

    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- STAFF & USER MANAGEMENT
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id),

    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),

    -- Authentication
    password_hash TEXT NOT NULL,

    -- Role
    role VARCHAR(50) NOT NULL,
    -- OWNER, MANAGER, CAPTAIN, WAITER, CHEF, CASHIER, DELIVERY_BOY

    permissions JSONB,

    -- Employment
    employee_id VARCHAR(50),
    joining_date DATE,
    salary DECIMAL(10, 2),

    -- Performance
    total_orders_handled INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2),

    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ANALYTICS & REPORTING
-- ============================================================================

CREATE TABLE daily_sales_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES restaurants(id),

    summary_date DATE NOT NULL,

    -- Orders
    total_orders INTEGER DEFAULT 0,
    dine_in_orders INTEGER DEFAULT 0,
    takeaway_orders INTEGER DEFAULT 0,
    delivery_orders INTEGER DEFAULT 0,

    cancelled_orders INTEGER DEFAULT 0,

    -- Revenue
    gross_revenue DECIMAL(12, 2) DEFAULT 0,
    discounts DECIMAL(12, 2) DEFAULT 0,
    net_revenue DECIMAL(12, 2) DEFAULT 0,

    taxes_collected DECIMAL(12, 2) DEFAULT 0,

    -- Payment Methods
    cash_collected DECIMAL(12, 2) DEFAULT 0,
    card_collected DECIMAL(12, 2) DEFAULT 0,
    upi_collected DECIMAL(12, 2) DEFAULT 0,
    online_collected DECIMAL(12, 2) DEFAULT 0,

    -- Customers
    unique_customers INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,

    -- Average Metrics
    average_order_value DECIMAL(10, 2),
    average_preparation_time INTEGER, -- minutes

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(restaurant_id, summary_date)
);

-- Convert to TimescaleDB hypertable for efficient time-series queries
SELECT create_hypertable('daily_sales_summary', 'created_at', if_not_exists => TRUE);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_payments_datetime ON payments(payment_datetime);
CREATE INDEX idx_stock_transactions_date ON stock_transactions(transaction_date);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate order total automatically
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
    NEW.balance_amount = NEW.total_amount - NEW.paid_amount;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_order_balance BEFORE INSERT OR UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION calculate_order_total();

-- Update table status when order is created/completed
CREATE OR REPLACE FUNCTION update_table_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_type = 'DINE_IN' AND NEW.table_id IS NOT NULL THEN
        IF NEW.order_status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'READY') THEN
            UPDATE tables
            SET status = 'OCCUPIED',
                current_order_id = NEW.id,
                occupied_since = CURRENT_TIMESTAMP
            WHERE id = NEW.table_id;
        ELSIF NEW.order_status IN ('COMPLETED', 'CANCELLED') THEN
            UPDATE tables
            SET status = 'AVAILABLE',
                current_order_id = NULL,
                occupied_since = NULL
            WHERE id = NEW.table_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_table_on_order_change AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_table_status();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Current Day Sales View
CREATE VIEW current_day_sales AS
SELECT
    r.id as restaurant_id,
    r.restaurant_name,
    COUNT(DISTINCT o.id) as total_orders,
    COUNT(DISTINCT o.id) FILTER (WHERE o.order_type = 'DINE_IN') as dine_in_orders,
    COUNT(DISTINCT o.id) FILTER (WHERE o.order_type = 'TAKEAWAY') as takeaway_orders,
    COUNT(DISTINCT o.id) FILTER (WHERE o.order_type = 'DELIVERY') as delivery_orders,
    COALESCE(SUM(o.total_amount), 0) as total_revenue,
    COALESCE(AVG(o.total_amount), 0) as avg_order_value,
    COUNT(DISTINCT o.customer_id) as unique_customers
FROM restaurants r
LEFT JOIN orders o ON r.id = o.restaurant_id
    AND DATE(o.order_datetime) = CURRENT_DATE
    AND o.order_status != 'CANCELLED'
GROUP BY r.id, r.restaurant_name;

-- Popular Menu Items (Last 30 Days)
CREATE VIEW popular_menu_items AS
SELECT
    mi.id,
    mi.item_name,
    COUNT(oi.id) as times_ordered,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.total_price) as total_revenue
FROM menu_items mi
JOIN order_items oi ON mi.id = oi.menu_item_id
JOIN orders o ON oi.order_id = o.id
WHERE o.order_datetime >= CURRENT_DATE - INTERVAL '30 days'
    AND o.order_status != 'CANCELLED'
GROUP BY mi.id, mi.item_name
ORDER BY times_ordered DESC;

-- Low Stock Items
CREATE VIEW low_stock_items AS
SELECT
    ii.id,
    ii.item_name,
    ii.item_code,
    ii.current_stock,
    ii.min_stock_level,
    (ii.min_stock_level - ii.current_stock) as stock_deficit
FROM inventory_items ii
WHERE ii.is_active = true
    AND ii.current_stock < ii.min_stock_level
ORDER BY stock_deficit DESC;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

INSERT INTO settings (key, value, type, description) VALUES
('schema_version', '2.0.0', 'string', 'Database schema version'),
('last_migration', NOW()::text, 'string', 'Last migration timestamp');
