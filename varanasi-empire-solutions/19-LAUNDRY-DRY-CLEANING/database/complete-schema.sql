-- LAUNDRY & DRY CLEANING - Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE laundry_shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    phone VARCHAR(20),
    services_offered TEXT[], -- WASHING, DRY_CLEANING, IRONING, STAIN_REMOVAL
    has_pickup_delivery BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE service_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES laundry_shops(id),
    item_name VARCHAR(255) NOT NULL,
    item_category VARCHAR(100), -- SHIRT, PANT, SAREE, BLANKET, CURTAIN
    service_type VARCHAR(50) NOT NULL, -- WASH, DRY_CLEAN, IRON, WASH_IRON
    price DECIMAL(8, 2) NOT NULL,
    express_price DECIMAL(8, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES laundry_shops(id),
    customer_id UUID REFERENCES customers(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date TIMESTAMP DEFAULT NOW(),
    pickup_date DATE,
    promised_delivery_date DATE NOT NULL,
    actual_delivery_date DATE,
    order_type VARCHAR(50) DEFAULT 'WALK_IN', -- WALK_IN, PICKUP, DELIVERY
    total_items INTEGER,
    subtotal DECIMAL(10, 2),
    discount DECIMAL(8, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2),
    payment_mode VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    order_status VARCHAR(50) DEFAULT 'RECEIVED',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_delivery_date ON orders(promised_delivery_date);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    pricing_id UUID REFERENCES service_pricing(id),
    item_name VARCHAR(255),
    service_type VARCHAR(50),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(8, 2),
    total_price DECIMAL(8, 2),
    is_express BOOLEAN DEFAULT false,
    has_stains BOOLEAN DEFAULT false,
    stain_details TEXT,
    special_instructions TEXT,
    item_status VARCHAR(50) DEFAULT 'RECEIVED',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE delivery_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_date DATE NOT NULL,
    delivery_person_name VARCHAR(255),
    delivery_person_phone VARCHAR(20),
    route_status VARCHAR(50) DEFAULT 'PLANNED',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE route_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES delivery_routes(id),
    order_id UUID REFERENCES orders(id),
    sequence_number INTEGER,
    pickup_delivery VARCHAR(50), -- PICKUP, DELIVERY
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP
);

CREATE TABLE membership_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES laundry_shops(id),
    plan_name VARCHAR(255),
    monthly_fee DECIMAL(8, 2),
    discount_percentage DECIMAL(5, 2),
    free_pickups_per_month INTEGER,
    benefits TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE customer_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    plan_id UUID REFERENCES membership_plans(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    membership_status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW()
);
