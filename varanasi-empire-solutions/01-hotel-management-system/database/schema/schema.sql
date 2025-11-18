-- HOTEL MANAGEMENT SYSTEM - DATABASE SCHEMA
-- Version: 1.0.0
-- Database: PostgreSQL 15+
-- Author: Nexavoyagers Development Team

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================================================
-- PROPERTY MANAGEMENT
-- ============================================================================

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL, -- hotel, guest_house, hostel, resort
    star_rating INTEGER CHECK (star_rating BETWEEN 1 AND 5),

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100) DEFAULT 'Varanasi',
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Contact
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    whatsapp VARCHAR(20),

    -- Policies
    check_in_time TIME DEFAULT '14:00:00',
    check_out_time TIME DEFAULT '11:00:00',
    cancellation_policy TEXT,
    child_policy TEXT,
    pet_policy TEXT,

    -- Settings
    currency VARCHAR(3) DEFAULT 'INR',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    default_language VARCHAR(5) DEFAULT 'hi',

    -- Media
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),

    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE property_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    amenity_type VARCHAR(50) NOT NULL, -- wifi, parking, restaurant, spa, etc.
    amenity_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_free BOOLEAN DEFAULT true,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ROOM MANAGEMENT
-- ============================================================================

CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- Deluxe, Suite, Dormitory
    slug VARCHAR(100) NOT NULL,
    description TEXT,

    -- Capacity
    max_adults INTEGER NOT NULL DEFAULT 2,
    max_children INTEGER DEFAULT 1,
    max_occupancy INTEGER NOT NULL DEFAULT 3,

    -- Size & details
    size_sqft INTEGER,
    bed_type VARCHAR(50), -- king, queen, twin, bunk
    bed_count INTEGER DEFAULT 1,

    -- Pricing
    base_price DECIMAL(10, 2) NOT NULL,
    extra_adult_charge DECIMAL(10, 2) DEFAULT 0,
    extra_child_charge DECIMAL(10, 2) DEFAULT 0,

    -- View & floor
    view_type VARCHAR(50), -- river, garden, city
    floor_preference VARCHAR(50), -- ground, first, top

    -- Status
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(property_id, slug)
);

CREATE TABLE room_type_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_type_id UUID REFERENCES room_types(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_type VARCHAR(50) DEFAULT 'gallery', -- gallery, 360, thumbnail
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE room_type_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_type_id UUID REFERENCES room_types(id) ON DELETE CASCADE,
    amenity_name VARCHAR(100) NOT NULL,
    amenity_icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    room_type_id UUID REFERENCES room_types(id),
    room_number VARCHAR(20) NOT NULL,
    floor INTEGER,

    -- Status
    status VARCHAR(50) DEFAULT 'available', -- available, occupied, maintenance, blocked, dirty
    is_active BOOLEAN DEFAULT true,

    -- Notes
    notes TEXT,
    last_maintenance_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(property_id, room_number)
);

-- ============================================================================
-- GUEST MANAGEMENT
-- ============================================================================

CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    nationality VARCHAR(100),

    -- ID Proof
    id_proof_type VARCHAR(50), -- passport, aadhar, license, pan
    id_proof_number VARCHAR(100),
    id_proof_image_url VARCHAR(500),

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(10),

    -- Preferences
    preferred_room_type UUID REFERENCES room_types(id),
    preferred_floor VARCHAR(50),
    dietary_requirements TEXT,
    special_requests TEXT,
    language_preference VARCHAR(10) DEFAULT 'hi',

    -- Loyalty
    loyalty_tier VARCHAR(50) DEFAULT 'silver', -- silver, gold, platinum
    loyalty_points INTEGER DEFAULT 0,
    total_stays INTEGER DEFAULT 0,
    total_nights INTEGER DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2),

    -- Status
    is_vip BOOLEAN DEFAULT false,
    is_blacklisted BOOLEAN DEFAULT false,
    blacklist_reason TEXT,

    -- Marketing
    marketing_consent BOOLEAN DEFAULT false,
    email_consent BOOLEAN DEFAULT true,
    sms_consent BOOLEAN DEFAULT true,
    whatsapp_consent BOOLEAN DEFAULT true,

    -- Metadata
    source VARCHAR(100), -- website, ota, walk-in, referral
    referred_by UUID REFERENCES guests(id),
    tags TEXT[], -- business_traveler, honeymoon, family, etc.

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_stay_date DATE
);

CREATE TABLE guest_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'general', -- general, complaint, compliment, request
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- RESERVATION MANAGEMENT
-- ============================================================================

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    guest_id UUID REFERENCES guests(id),

    -- Booking Details
    booking_reference VARCHAR(20) UNIQUE NOT NULL, -- BRP-2025-001
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights INTEGER NOT NULL,

    -- Guest Count
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER DEFAULT 0,
    infants INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(50) DEFAULT 'confirmed', -- pending, confirmed, checked_in, checked_out, cancelled, no_show
    booking_source VARCHAR(100), -- website, booking.com, airbnb, walk-in, phone, whatsapp

    -- Pricing
    room_charges DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    extra_charges DECIMAL(10, 2) DEFAULT 0, -- laundry, food, etc.
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    balance_amount DECIMAL(10, 2) DEFAULT 0,

    -- Special
    special_requests TEXT,
    guest_notes TEXT,
    internal_notes TEXT,
    arrival_time TIME,
    departure_time TIME,

    -- Assigned Rooms (can have multiple rooms)
    -- See reservation_rooms table

    -- Dates
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    checked_in_at TIMESTAMP,
    checked_out_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (check_out_date > check_in_date)
);

CREATE TABLE reservation_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id),
    room_type_id UUID REFERENCES room_types(id),
    rate_plan_id UUID REFERENCES rate_plans(id),

    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,

    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,

    room_charge DECIMAL(10, 2) NOT NULL,
    extra_charges DECIMAL(10, 2) DEFAULT 0,

    status VARCHAR(50) DEFAULT 'confirmed',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservation_guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES guests(id),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- RATE MANAGEMENT
-- ============================================================================

CREATE TABLE rate_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    room_type_id UUID REFERENCES room_types(id),

    name VARCHAR(100) NOT NULL, -- Standard, Early Bird, Last Minute, Corporate
    code VARCHAR(50) NOT NULL,
    description TEXT,

    -- Pricing
    rate_type VARCHAR(50) DEFAULT 'fixed', -- fixed, percentage
    base_rate DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2),

    -- Validity
    valid_from DATE,
    valid_to DATE,

    -- Days of week
    monday BOOLEAN DEFAULT true,
    tuesday BOOLEAN DEFAULT true,
    wednesday BOOLEAN DEFAULT true,
    thursday BOOLEAN DEFAULT true,
    friday BOOLEAN DEFAULT true,
    saturday BOOLEAN DEFAULT true,
    sunday BOOLEAN DEFAULT true,

    -- Conditions
    min_nights INTEGER DEFAULT 1,
    max_nights INTEGER,
    min_advance_booking INTEGER, -- days
    max_advance_booking INTEGER,

    -- Meal plan
    includes_breakfast BOOLEAN DEFAULT false,
    includes_lunch BOOLEAN DEFAULT false,
    includes_dinner BOOLEAN DEFAULT false,

    -- Cancellation
    is_refundable BOOLEAN DEFAULT true,
    cancellation_policy TEXT,

    -- Status
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0, -- higher priority shows first

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(property_id, code)
);

CREATE TABLE seasonal_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    room_type_id UUID REFERENCES room_types(id),

    name VARCHAR(100) NOT NULL, -- Dev Deepawali, Maha Shivratri, Summer Discount
    rate_date DATE NOT NULL,
    rate DECIMAL(10, 2) NOT NULL,

    min_nights INTEGER DEFAULT 1,
    max_occupancy INTEGER,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(property_id, room_type_id, rate_date)
);

CREATE TABLE dynamic_pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,

    rule_name VARCHAR(100) NOT NULL,
    rule_type VARCHAR(50), -- occupancy_based, demand_based, competitor_based

    -- Triggers
    occupancy_threshold INTEGER, -- If occupancy > 80%, increase price
    price_change_percentage DECIMAL(5, 2),

    -- Limits
    min_price DECIMAL(10, 2),
    max_price DECIMAL(10, 2),

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CHANNEL MANAGER (OTA INTEGRATION)
-- ============================================================================

CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,

    channel_name VARCHAR(100) NOT NULL, -- Booking.com, Airbnb, MakeMyTrip
    channel_code VARCHAR(50) NOT NULL,

    -- API Credentials
    api_key TEXT,
    api_secret TEXT,
    property_code VARCHAR(100), -- Property ID on OTA platform

    -- Settings
    commission_percentage DECIMAL(5, 2),
    auto_sync BOOLEAN DEFAULT true,
    sync_inventory BOOLEAN DEFAULT true,
    sync_rates BOOLEAN DEFAULT true,
    sync_bookings BOOLEAN DEFAULT true,

    -- Status
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(property_id, channel_code)
);

CREATE TABLE channel_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID REFERENCES channels(id),
    reservation_id UUID REFERENCES reservations(id),

    channel_booking_id VARCHAR(255) NOT NULL, -- Booking ID from OTA
    channel_booking_reference VARCHAR(255),

    commission_amount DECIMAL(10, 2),
    net_amount DECIMAL(10, 2), -- After commission

    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(channel_id, channel_booking_id)
);

-- ============================================================================
-- FRONT DESK OPERATIONS
-- ============================================================================

CREATE TABLE check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID REFERENCES reservations(id),
    guest_id UUID REFERENCES guests(id),
    room_id UUID REFERENCES rooms(id),

    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_checkout_time TIMESTAMP,

    -- ID Verification
    id_verified BOOLEAN DEFAULT false,
    id_verified_by UUID REFERENCES users(id),

    -- Room Key
    key_number VARCHAR(50),
    key_issued_at TIMESTAMP,

    -- Special
    welcome_drink_served BOOLEAN DEFAULT false,
    luggage_assistance BOOLEAN DEFAULT false,

    notes TEXT,
    checked_in_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE check_outs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID REFERENCES reservations(id),
    guest_id UUID REFERENCES guests(id),

    check_out_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Billing
    final_bill_amount DECIMAL(10, 2),
    payment_status VARCHAR(50), -- paid, partial, pending

    -- Room Condition
    room_condition VARCHAR(50), -- good, damaged
    damage_notes TEXT,
    damage_charges DECIMAL(10, 2) DEFAULT 0,

    -- Feedback
    feedback_collected BOOLEAN DEFAULT false,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    feedback_text TEXT,

    checked_out_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- HOUSEKEEPING MANAGEMENT
-- ============================================================================

CREATE TABLE housekeeping_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    room_id UUID REFERENCES rooms(id),

    task_type VARCHAR(50) DEFAULT 'cleaning', -- cleaning, maintenance, inspection
    task_date DATE NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal', -- high, normal, low

    -- Assignment
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP,

    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, verified
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),

    -- Quality Check
    cleaning_checklist JSONB, -- {windows: true, bathroom: true, bed: true}
    quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),

    -- Issues
    issues_found TEXT,
    maintenance_required BOOLEAN DEFAULT false,

    notes TEXT,
    before_image_url VARCHAR(500),
    after_image_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    room_id UUID REFERENCES rooms(id),

    issue_type VARCHAR(100) NOT NULL, -- plumbing, electrical, ac, furniture
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium', -- critical, high, medium, low

    -- Assignment
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP,

    -- Status
    status VARCHAR(50) DEFAULT 'open', -- open, in_progress, resolved, closed
    resolved_at TIMESTAMP,
    resolution_notes TEXT,

    -- Cost
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),

    reported_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lost_and_found (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    room_id UUID REFERENCES rooms(id),
    guest_id UUID REFERENCES guests(id),

    item_description TEXT NOT NULL,
    item_category VARCHAR(100), -- electronics, clothing, documents, jewelry
    found_date DATE NOT NULL,
    found_location VARCHAR(255),

    -- Storage
    storage_location VARCHAR(255),

    -- Status
    status VARCHAR(50) DEFAULT 'unclaimed', -- unclaimed, claimed, disposed
    claimed_by UUID REFERENCES guests(id),
    claimed_at TIMESTAMP,

    -- Images
    image_url VARCHAR(500),

    found_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- BILLING & PAYMENTS
-- ============================================================================

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    reservation_id UUID REFERENCES reservations(id),
    guest_id UUID REFERENCES guests(id),

    invoice_number VARCHAR(50) UNIQUE NOT NULL, -- INV-2025-001
    invoice_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,

    -- Amounts
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    balance_amount DECIMAL(10, 2) NOT NULL,

    -- Tax Details (GST)
    cgst_percentage DECIMAL(5, 2) DEFAULT 6.00,
    sgst_percentage DECIMAL(5, 2) DEFAULT 6.00,
    cgst_amount DECIMAL(10, 2) DEFAULT 0,
    sgst_amount DECIMAL(10, 2) DEFAULT 0,

    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, partial, paid

    -- Notes
    notes TEXT,
    terms_and_conditions TEXT,

    -- Files
    pdf_url VARCHAR(500),

    sent_at TIMESTAMP,
    paid_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,

    item_type VARCHAR(50) NOT NULL, -- room_charge, food, laundry, extra_bed, etc.
    description TEXT NOT NULL,

    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    tax_percentage DECIMAL(5, 2) DEFAULT 12.00,

    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,

    service_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    reservation_id UUID REFERENCES reservations(id),
    invoice_id UUID REFERENCES invoices(id),
    guest_id UUID REFERENCES guests(id),

    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Amount
    amount DECIMAL(10, 2) NOT NULL,

    -- Payment Method
    payment_method VARCHAR(50) NOT NULL, -- cash, card, upi, net_banking, wallet
    payment_gateway VARCHAR(50), -- razorpay, paytm, phonepe
    transaction_id VARCHAR(255),

    -- Card Details (if applicable)
    card_last4 VARCHAR(4),
    card_brand VARCHAR(50),

    -- UPI Details
    upi_id VARCHAR(255),

    -- Status
    status VARCHAR(50) DEFAULT 'success', -- success, pending, failed, refunded

    -- Refund
    refund_amount DECIMAL(10, 2) DEFAULT 0,
    refunded_at TIMESTAMP,
    refund_reason TEXT,

    -- Notes
    notes TEXT,

    collected_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- GUEST COMMUNICATION
-- ============================================================================

CREATE TABLE message_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),

    template_name VARCHAR(100) NOT NULL,
    template_code VARCHAR(50) NOT NULL,
    template_type VARCHAR(50), -- email, sms, whatsapp

    trigger_type VARCHAR(50), -- booking_confirmation, pre_arrival, check_in, etc.
    trigger_timing INTEGER, -- Send X days before/after event

    -- Content
    subject VARCHAR(255), -- For email
    body TEXT NOT NULL,

    -- Variables supported: {{guest_name}}, {{check_in_date}}, {{room_number}}, etc.

    -- Language
    language VARCHAR(10) DEFAULT 'hi',

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(property_id, template_code, language)
);

CREATE TABLE guest_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    guest_id UUID REFERENCES guests(id),
    reservation_id UUID REFERENCES reservations(id),

    message_type VARCHAR(50) NOT NULL, -- email, sms, whatsapp
    template_id UUID REFERENCES message_templates(id),

    -- Recipient
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),

    -- Content
    subject VARCHAR(255),
    body TEXT NOT NULL,

    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, failed, opened, clicked
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    failed_at TIMESTAMP,
    error_message TEXT,

    -- External IDs
    external_message_id VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- REVIEW MANAGEMENT
-- ============================================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    guest_id UUID REFERENCES guests(id),
    reservation_id UUID REFERENCES reservations(id),

    -- Platform
    review_platform VARCHAR(50) NOT NULL, -- google, tripadvisor, booking.com, facebook
    platform_review_id VARCHAR(255),
    review_url VARCHAR(500),

    -- Review Content
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    review_text TEXT,

    -- Sub-ratings
    cleanliness_rating INTEGER CHECK (cleanliness_rating BETWEEN 1 AND 5),
    location_rating INTEGER CHECK (location_rating BETWEEN 1 AND 5),
    service_rating INTEGER CHECK (service_rating BETWEEN 1 AND 5),
    value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),

    -- Sentiment Analysis
    sentiment VARCHAR(20), -- positive, neutral, negative
    keywords TEXT[], -- automated extraction

    -- Status
    is_verified BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,

    -- Response
    has_response BOOLEAN DEFAULT false,
    response_text TEXT,
    responded_at TIMESTAMP,
    responded_by UUID REFERENCES users(id),

    -- Dates
    review_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE review_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    guest_id UUID REFERENCES guests(id),
    reservation_id UUID REFERENCES reservations(id),

    request_sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    request_platform VARCHAR(50), -- email, sms, whatsapp

    -- Status
    is_opened BOOLEAN DEFAULT false,
    opened_at TIMESTAMP,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    review_id UUID REFERENCES reviews(id),

    -- Incentive
    incentive_offered VARCHAR(255), -- ₹100 discount on next booking
    incentive_claimed BOOLEAN DEFAULT false,

    reminder_count INTEGER DEFAULT 0,
    last_reminder_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- LOYALTY PROGRAM
-- ============================================================================

CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    guest_id UUID REFERENCES guests(id),
    reservation_id UUID REFERENCES reservations(id),

    transaction_type VARCHAR(50) NOT NULL, -- earn, redeem, expire, bonus
    points INTEGER NOT NULL,
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,

    -- Details
    description TEXT,
    expiry_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loyalty_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),

    reward_name VARCHAR(100) NOT NULL,
    points_required INTEGER NOT NULL,
    reward_type VARCHAR(50), -- discount, free_night, upgrade, amenity

    discount_percentage DECIMAL(5, 2),
    discount_amount DECIMAL(10, 2),

    description TEXT,
    terms_and_conditions TEXT,

    valid_from DATE,
    valid_to DATE,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loyalty_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID REFERENCES guests(id),
    reward_id UUID REFERENCES loyalty_rewards(id),
    reservation_id UUID REFERENCES reservations(id),

    points_redeemed INTEGER NOT NULL,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(50) DEFAULT 'pending', -- pending, applied, cancelled
    applied_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- REPORTING & ANALYTICS
-- ============================================================================

CREATE TABLE daily_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),
    snapshot_date DATE NOT NULL,

    -- Occupancy
    total_rooms INTEGER NOT NULL,
    occupied_rooms INTEGER NOT NULL,
    available_rooms INTEGER NOT NULL,
    out_of_order_rooms INTEGER DEFAULT 0,
    occupancy_percentage DECIMAL(5, 2),

    -- Guests
    arrivals INTEGER DEFAULT 0,
    departures INTEGER DEFAULT 0,
    in_house_guests INTEGER DEFAULT 0,

    -- Revenue
    room_revenue DECIMAL(12, 2) DEFAULT 0,
    food_revenue DECIMAL(12, 2) DEFAULT 0,
    other_revenue DECIMAL(12, 2) DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,

    -- Metrics
    adr DECIMAL(10, 2), -- Average Daily Rate
    revpar DECIMAL(10, 2), -- Revenue Per Available Room

    -- Bookings
    new_bookings INTEGER DEFAULT 0,
    cancellations INTEGER DEFAULT 0,
    no_shows INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(property_id, snapshot_date)
);

-- ============================================================================
-- USER & STAFF MANAGEMENT
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),

    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),

    -- Authentication
    password_hash TEXT NOT NULL,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMP,

    -- Role & Permissions
    role VARCHAR(50) NOT NULL, -- owner, manager, front_desk, housekeeping, accounts
    permissions JSONB, -- {bookings: {create: true, edit: true, delete: false}}

    -- Employee Details
    employee_id VARCHAR(50),
    department VARCHAR(100),
    designation VARCHAR(100),
    joining_date DATE,

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,

    -- Settings
    language_preference VARCHAR(10) DEFAULT 'hi',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',

    -- Security
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    token TEXT NOT NULL,
    refresh_token TEXT,

    ip_address VARCHAR(50),
    user_agent TEXT,
    device_type VARCHAR(50),

    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    property_id UUID REFERENCES properties(id),

    action VARCHAR(100) NOT NULL, -- created_booking, checked_in_guest, etc.
    entity_type VARCHAR(50), -- reservation, guest, invoice
    entity_id UUID,

    description TEXT,
    old_values JSONB,
    new_values JSONB,

    ip_address VARCHAR(50),
    user_agent TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SYSTEM TABLES
-- ============================================================================

CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id),

    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json

    description TEXT,
    is_public BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(property_id, setting_key)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),

    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50), -- info, warning, error, success

    link_url VARCHAR(500),

    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Reservations
CREATE INDEX idx_reservations_property ON reservations(property_id);
CREATE INDEX idx_reservations_guest ON reservations(guest_id);
CREATE INDEX idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_source ON reservations(booking_source);
CREATE INDEX idx_reservations_reference ON reservations(booking_reference);

-- Guests
CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_phone ON guests(phone);
CREATE INDEX idx_guests_loyalty ON guests(loyalty_tier);
CREATE INDEX idx_guests_name_trgm ON guests USING gin (first_name gin_trgm_ops, last_name gin_trgm_ops);

-- Rooms
CREATE INDEX idx_rooms_property ON rooms(property_id);
CREATE INDEX idx_rooms_type ON rooms(room_type_id);
CREATE INDEX idx_rooms_status ON rooms(status);

-- Invoices
CREATE INDEX idx_invoices_property ON invoices(property_id);
CREATE INDEX idx_invoices_reservation ON invoices(reservation_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);

-- Payments
CREATE INDEX idx_payments_property ON payments(property_id);
CREATE INDEX idx_payments_reservation ON payments(reservation_id);
CREATE INDEX idx_payments_method ON payments(payment_method);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- Reviews
CREATE INDEX idx_reviews_property ON reviews(property_id);
CREATE INDEX idx_reviews_guest ON reviews(guest_id);
CREATE INDEX idx_reviews_platform ON reviews(review_platform);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Housekeeping
CREATE INDEX idx_housekeeping_room ON housekeeping_tasks(room_id);
CREATE INDEX idx_housekeeping_date ON housekeeping_tasks(task_date);
CREATE INDEX idx_housekeeping_status ON housekeeping_tasks(status);

-- Activity Logs
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_types_updated_at BEFORE UPDATE ON room_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate nights automatically
CREATE OR REPLACE FUNCTION calculate_reservation_nights()
RETURNS TRIGGER AS $$
BEGIN
    NEW.nights = NEW.check_out_date - NEW.check_in_date;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_nights BEFORE INSERT OR UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION calculate_reservation_nights();

-- Update balance amount automatically
CREATE OR REPLACE FUNCTION update_balance_amount()
RETURNS TRIGGER AS $$
BEGIN
    NEW.balance_amount = NEW.total_amount - NEW.paid_amount;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reservation_balance BEFORE INSERT OR UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_balance_amount();

CREATE TRIGGER update_invoice_balance BEFORE INSERT OR UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_balance_amount();

-- Update room status based on reservations
CREATE OR REPLACE FUNCTION update_room_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'checked_in' THEN
        UPDATE rooms SET status = 'occupied'
        WHERE id IN (SELECT room_id FROM reservation_rooms WHERE reservation_id = NEW.id);
    ELSIF NEW.status = 'checked_out' THEN
        UPDATE rooms SET status = 'dirty'
        WHERE id IN (SELECT room_id FROM reservation_rooms WHERE reservation_id = NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_room_on_checkin_checkout AFTER UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_room_status();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Current occupancy view
CREATE VIEW current_occupancy AS
SELECT
    p.id as property_id,
    p.name as property_name,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'available') as available_rooms,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'occupied') as occupied_rooms,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'maintenance') as maintenance_rooms,
    COUNT(DISTINCT r.id) as total_rooms,
    ROUND(
        (COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'occupied')::DECIMAL /
         NULLIF(COUNT(DISTINCT r.id), 0) * 100),
    2) as occupancy_percentage
FROM properties p
LEFT JOIN rooms r ON p.id = r.property_id AND r.is_active = true
WHERE p.is_active = true
GROUP BY p.id, p.name;

-- Today's arrivals
CREATE VIEW todays_arrivals AS
SELECT
    res.*,
    g.first_name || ' ' || COALESCE(g.last_name, '') as guest_name,
    g.phone,
    g.email
FROM reservations res
JOIN guests g ON res.guest_id = g.id
WHERE res.check_in_date = CURRENT_DATE
AND res.status IN ('confirmed', 'checked_in')
ORDER BY res.arrival_time;

-- Today's departures
CREATE VIEW todays_departures AS
SELECT
    res.*,
    g.first_name || ' ' || COALESCE(g.last_name, '') as guest_name,
    g.phone,
    g.email
FROM reservations res
JOIN guests g ON res.guest_id = g.id
WHERE res.check_out_date = CURRENT_DATE
AND res.status = 'checked_in'
ORDER BY res.departure_time;

-- Revenue summary
CREATE VIEW monthly_revenue_summary AS
SELECT
    p.id as property_id,
    p.name as property_name,
    DATE_TRUNC('month', i.invoice_date) as month,
    SUM(i.total_amount) as total_revenue,
    SUM(i.paid_amount) as collected_revenue,
    SUM(i.balance_amount) as pending_revenue,
    COUNT(DISTINCT i.id) as invoice_count
FROM properties p
LEFT JOIN invoices i ON p.id = i.property_id
GROUP BY p.id, p.name, DATE_TRUNC('month', i.invoice_date)
ORDER BY month DESC;

-- ============================================================================
-- SAMPLE DATA COMMENT
-- ============================================================================

-- Demo data (Brijrama Palace simulation) will be inserted via seeds
-- See: database/seeds/01_demo_property.sql
--      database/seeds/02_demo_guests.sql
--      database/seeds/03_demo_reservations.sql

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Schema version tracking
CREATE TABLE schema_version (
    version VARCHAR(20) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_version (version) VALUES ('1.0.0');
