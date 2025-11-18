-- ============================================================================
-- REAL ESTATE MANAGEMENT SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Target: Real Estate Agencies, Property Dealers, Builders (UP RERA Compliant)
-- Features: Property Listing, Lead Management, Site Visits, Documentation,
--           Commission Tracking, UP RERA Integration, EMI Calculator
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- Agency & Staff
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_name VARCHAR(255) NOT NULL,
    rera_registration_number VARCHAR(100) UNIQUE,
    pan_number VARCHAR(20),
    gstin VARCHAR(20),
    head_office_address TEXT,
    location GEOGRAPHY(POINT),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id),
    agent_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    rera_agent_id VARCHAR(100),
    designation VARCHAR(100),
    commission_percentage DECIMAL(5, 2) DEFAULT 1.0,
    total_deals_closed INTEGER DEFAULT 0,
    total_commission_earned DECIMAL(12, 2) DEFAULT 0,
    system_username VARCHAR(100) UNIQUE,
    system_password_hash VARCHAR(255),
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Property Owners/Builders
CREATE TABLE property_owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_code VARCHAR(50) UNIQUE NOT NULL,
    owner_type VARCHAR(50) NOT NULL, -- INDIVIDUAL, BUILDER, DEVELOPER, INVESTOR
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    pan_number VARCHAR(20),
    aadhar_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    rera_registration_number VARCHAR(100),
    gst IN VARCHAR(20),
    total_properties_listed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id),
    owner_id UUID REFERENCES property_owners(id),
    listing_agent_id UUID REFERENCES agents(id),
    
    property_code VARCHAR(50) UNIQUE NOT NULL,
    property_type VARCHAR(50) NOT NULL, -- RESIDENTIAL, COMMERCIAL, INDUSTRIAL, AGRICULTURAL, PLOT
    property_subtype VARCHAR(100), -- APARTMENT, VILLA, OFFICE, SHOP, WAREHOUSE, FARM_HOUSE
    
    transaction_type VARCHAR(50) NOT NULL, -- SALE, RENT, LEASE, PG
    
    -- Location
    property_title VARCHAR(500) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    locality VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),
    location GEOGRAPHY(POINT),
    google_maps_url VARCHAR(500),
    
    -- Property Details
    carpet_area_sqft DECIMAL(10, 2),
    built_up_area_sqft DECIMAL(10, 2),
    plot_area_sqft DECIMAL(10, 2),
    
    bedrooms INTEGER,
    bathrooms INTEGER,
    balconies INTEGER,
    floor_number INTEGER,
    total_floors INTEGER,
    
    facing_direction VARCHAR(50), -- NORTH, SOUTH, EAST, WEST, NORTH_EAST, etc.
    furnishing_status VARCHAR(50), -- UNFURNISHED, SEMI_FURNISHED, FULLY_FURNISHED
    
    property_age_years INTEGER,
    possession_status VARCHAR(50), -- READY_TO_MOVE, UNDER_CONSTRUCTION, UPCOMING
    possession_date DATE,
    
    -- Pricing
    expected_price DECIMAL(15, 2) NOT NULL,
    price_per_sqft DECIMAL(10, 2),
    monthly_rent DECIMAL(10, 2),
    security_deposit DECIMAL(10, 2),
    maintenance_charges DECIMAL(8, 2),
    
    negotiable BOOLEAN DEFAULT true,
    
    -- Features & Amenities
    amenities TEXT[], -- PARKING, LIFT, GYM, SWIMMING_POOL, GARDEN, SECURITY, POWER_BACKUP
    additional_rooms TEXT[], -- SERVANT_ROOM, STUDY_ROOM, POOJA_ROOM, STORE_ROOM
    
    -- Legal
    rera_approved BOOLEAN DEFAULT false,
    rera_project_id VARCHAR(100),
    ownership_type VARCHAR(50), -- FREEHOLD, LEASEHOLD, CO_OPERATIVE
    approved_by TEXT[], -- DDA, NOIDA_AUTHORITY, LUCKNOW_DEVELOPMENT_AUTHORITY
    
    -- Listing
    listing_date DATE DEFAULT CURRENT_DATE,
    listing_expiry_date DATE,
    is_featured BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    verification_date DATE,
    
    -- Media
    primary_image_url VARCHAR(500),
    images_urls TEXT[],
    video_url VARCHAR(500),
    virtual_tour_url VARCHAR(500),
    brochure_url VARCHAR(500),
    
    -- Status
    property_status VARCHAR(50) DEFAULT 'AVAILABLE',
    -- AVAILABLE, UNDER_NEGOTIATION, SOLD, RENTED, ON_HOLD, WITHDRAWN
    
    description TEXT,
    
    total_views INTEGER DEFAULT 0,
    total_enquiries INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_properties_type ON properties(property_type, transaction_type);
CREATE INDEX idx_properties_location ON properties USING gist(location);
CREATE INDEX idx_properties_city ON properties(city, locality);
CREATE INDEX idx_properties_price ON properties(expected_price);

-- Customers/Buyers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Preferences
    looking_for VARCHAR(50), -- BUY, RENT, LEASE
    property_type_preference VARCHAR(50)[],
    budget_min DECIMAL(15, 2),
    budget_max DECIMAL(15, 2),
    preferred_locations TEXT[],
    bedroom_preference VARCHAR(20),
    
    -- Financing
    financing_required BOOLEAN DEFAULT false,
    pre_approved_loan_amount DECIMAL(15, 2),
    bank_name VARCHAR(255),
    
    customer_source VARCHAR(100), -- WALK_IN, WEBSITE, PHONE, REFERRAL, 99ACRES, MAGICBRICKS
    
    assigned_agent_id UUID REFERENCES agents(id),
    
    total_site_visits INTEGER DEFAULT 0,
    total_offers_made INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_customers_phone ON customers(phone);

-- Enquiries & Leads
CREATE TABLE enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    customer_id UUID REFERENCES customers(id),
    
    enquiry_number VARCHAR(50) UNIQUE NOT NULL,
    enquiry_date TIMESTAMP DEFAULT NOW(),
    enquiry_source VARCHAR(100), -- WEBSITE, PHONE, WALK_IN, PORTAL
    
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    
    enquiry_message TEXT,
    
    -- Assignment
    assigned_to_agent_id UUID REFERENCES agents(id),
    
    -- Status
    enquiry_status VARCHAR(50) DEFAULT 'NEW',
    -- NEW, CONTACTED, SITE_VISIT_SCHEDULED, INTERESTED, NOT_INTERESTED, CONVERTED, LOST
    
    -- Follow-up
    next_follow_up_date DATE,
    follow_up_count INTEGER DEFAULT 0,
    
    -- Conversion
    converted_to_deal BOOLEAN DEFAULT false,
    deal_id UUID,
    
    remarks TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_enquiries_property ON enquiries(property_id);
CREATE INDEX idx_enquiries_status ON enquiries(enquiry_status);

-- Site Visits
CREATE TABLE site_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    customer_id UUID REFERENCES customers(id),
    enquiry_id UUID REFERENCES enquiries(id),
    
    visit_number VARCHAR(50) UNIQUE NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    
    accompanied_by_agent_id UUID REFERENCES agents(id),
    
    -- Status
    visit_status VARCHAR(50) DEFAULT 'SCHEDULED',
    -- SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
    
    actual_visit_date DATE,
    actual_visit_time TIME,
    
    -- Feedback
    customer_feedback TEXT,
    customer_interest_level VARCHAR(50), -- VERY_INTERESTED, INTERESTED, NEUTRAL, NOT_INTERESTED
    agent_remarks TEXT,
    
    -- Follow-up
    follow_up_required BOOLEAN DEFAULT true,
    follow_up_date DATE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_site_visits_date ON site_visits(scheduled_date);

-- Deals/Transactions
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id),
    property_id UUID REFERENCES properties(id),
    seller_id UUID REFERENCES property_owners(id),
    buyer_id UUID REFERENCES customers(id),
    
    deal_number VARCHAR(50) UNIQUE NOT NULL,
    deal_date DATE NOT NULL,
    deal_type VARCHAR(50) NOT NULL, -- SALE, RENT, LEASE
    
    -- Pricing
    agreed_price DECIMAL(15, 2) NOT NULL,
    token_amount DECIMAL(10, 2) DEFAULT 0,
    advance_amount DECIMAL(10, 2) DEFAULT 0,
    
    -- Commission
    commission_type VARCHAR(50) DEFAULT 'PERCENTAGE', -- PERCENTAGE, FIXED
    commission_percentage DECIMAL(5, 2),
    commission_amount DECIMAL(10, 2) NOT NULL,
    commission_split JSONB, -- [{agent_id, percentage, amount}, ...]
    
    -- Payment to Owner
    payable_to_owner DECIMAL(15, 2),
    amount_paid_to_owner DECIMAL(15, 2) DEFAULT 0,
    balance_to_owner DECIMAL(15, 2),
    
    -- Deal Status
    deal_status VARCHAR(50) DEFAULT 'AGREEMENT_PENDING',
    -- AGREEMENT_PENDING, AGREEMENT_SIGNED, DOCUMENTATION, REGISTRY_PENDING, REGISTRY_DONE, COMPLETED, CANCELLED
    
    -- Documentation
    agreement_date DATE,
    agreement_document_url VARCHAR(500),
    registry_date DATE,
    registry_document_url VARCHAR(500),
    
    -- Agents Involved
    listing_agent_id UUID REFERENCES agents(id),
    closing_agent_id UUID REFERENCES agents(id),
    
    remarks TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deals_property ON deals(property_id);
CREATE INDEX idx_deals_date ON deals(deal_date);

-- Commission Payments
CREATE TABLE commission_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id),
    agent_id UUID REFERENCES agents(id),
    
    payment_date DATE NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    
    payment_mode VARCHAR(50),
    transaction_id VARCHAR(255),
    
    remarks TEXT,
    
    paid_by UUID REFERENCES agents(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics
CREATE TABLE daily_property_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id),
    summary_date DATE NOT NULL,
    
    new_listings INTEGER DEFAULT 0,
    total_enquiries INTEGER DEFAULT 0,
    site_visits INTEGER DEFAULT 0,
    deals_closed INTEGER DEFAULT 0,
    total_deal_value DECIMAL(15, 2) DEFAULT 0,
    total_commission DECIMAL(12, 2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(agency_id, summary_date)
);

SELECT create_hypertable('daily_property_summary', 'created_at', if_not_exists => TRUE);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES agencies(id),
    user_id UUID,
    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    action_description TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_agency ON audit_logs(agency_id, created_at);
SELECT create_hypertable('audit_logs', 'created_at', if_not_exists => TRUE);

-- Triggers
CREATE OR REPLACE FUNCTION update_property_status_on_deal()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deal_status IN ('REGISTRY_DONE', 'COMPLETED') THEN
        UPDATE properties
        SET property_status = CASE
            WHEN NEW.deal_type = 'SALE' THEN 'SOLD'
            WHEN NEW.deal_type IN ('RENT', 'LEASE') THEN 'RENTED'
        END
        WHERE id = NEW.property_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_property_status
AFTER INSERT OR UPDATE ON deals
FOR EACH ROW
EXECUTE FUNCTION update_property_status_on_deal();

CREATE OR REPLACE FUNCTION update_agent_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deal_status IN ('REGISTRY_DONE', 'COMPLETED') THEN
        UPDATE agents
        SET total_deals_closed = total_deals_closed + 1,
            total_commission_earned = total_commission_earned + COALESCE((
                SELECT SUM(amount) 
                FROM jsonb_to_recordset(NEW.commission_split) AS x(agent_id UUID, amount DECIMAL)
                WHERE agent_id = agents.id
            ), 0)
        WHERE id IN (NEW.listing_agent_id, NEW.closing_agent_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_agent_statistics
AFTER INSERT OR UPDATE ON deals
FOR EACH ROW
EXECUTE FUNCTION update_agent_statistics();

-- Views
CREATE VIEW v_available_properties AS
SELECT
    p.property_code,
    p.property_type,
    p.property_subtype,
    p.transaction_type,
    p.locality,
    p.city,
    p.carpet_area_sqft,
    p.bedrooms,
    p.bathrooms,
    p.expected_price,
    p.price_per_sqft,
    p.furnishing_status,
    p.possession_status,
    po.company_name as owner_name,
    a.first_name || ' ' || a.last_name as agent_name,
    a.phone as agent_phone,
    p.total_views,
    p.total_enquiries
FROM properties p
LEFT JOIN property_owners po ON p.owner_id = po.id
LEFT JOIN agents a ON p.listing_agent_id = a.id
WHERE p.property_status = 'AVAILABLE'
  AND p.is_active = true
ORDER BY p.created_at DESC;

COMMENT ON TABLE properties IS 'UP RERA compliant property listings with geolocation';
COMMENT ON TABLE deals IS 'Complete transaction tracking with commission management';
COMMENT ON TABLE site_visits IS 'Scheduled property visits with feedback tracking';
