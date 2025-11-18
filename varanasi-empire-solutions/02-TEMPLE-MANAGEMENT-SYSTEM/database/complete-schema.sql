-- ============================================================================
-- TEMPLE MANAGEMENT SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Target: Hindu Temples, Religious Trusts, Pilgrimage Centers in Uttar Pradesh
-- Features: Darshan Booking, Pooja Services, Donations, Prasad, Festival Management,
--           Priest Management, Accommodation, Annadaan, Hundi, Online Services
-- Tier: Enterprise (Multi-temple trust) + Standard (Single temple)
-- Special Focus: Kashi Vishwanath, Ram Mandir Ayodhya, Vindhyachal, etc.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- ============================================================================
-- TEMPLE TRUST HIERARCHY
-- ============================================================================

CREATE TABLE temple_trusts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trust_name VARCHAR(255) NOT NULL,
    trust_legal_name VARCHAR(255),

    -- Registration
    registration_number VARCHAR(100),
    registration_year INTEGER,
    trust_deed_number VARCHAR(100),
    trust_type VARCHAR(50), -- RELIGIOUS_TRUST, CHARITABLE_TRUST, SOCIETY

    -- Tax Exemptions
    pan_number VARCHAR(20),
    80g_certificate_number VARCHAR(100), -- For tax exemption on donations
    80g_valid_till DATE,
    fcra_registration_number VARCHAR(100), -- Foreign Contribution Regulation Act
    gstin VARCHAR(20),

    -- Head Office
    head_office_address TEXT,
    location GEOGRAPHY(POINT),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website VARCHAR(255),

    -- Trust Management
    total_temples_managed INTEGER DEFAULT 1,
    chairman_name VARCHAR(255),
    secretary_name VARCHAR(255),
    trustee_details JSONB, -- [{name, designation, phone, email}]

    -- Banking
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    upi_id VARCHAR(100),

    -- Digital Presence
    youtube_channel VARCHAR(255), -- For live darshan
    facebook_page VARCHAR(255),
    twitter_handle VARCHAR(100),

    logo_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE temples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trust_id UUID REFERENCES temple_trusts(id),

    -- Basic Info
    temple_name VARCHAR(255) NOT NULL,
    temple_code VARCHAR(50) UNIQUE NOT NULL,
    temple_name_hindi VARCHAR(255),
    temple_name_sanskrit VARCHAR(255),

    -- Classification
    temple_type VARCHAR(50), -- MAIN_TEMPLE, SUB_TEMPLE, ATTACHED_SHRINE
    deity_type VARCHAR(50), -- SHIVA, VISHNU, DEVI, GANESHA, HANUMAN, OTHER
    historical_significance TEXT,
    temple_age_years INTEGER,

    -- Location
    address TEXT NOT NULL,
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),
    location GEOGRAPHY(POINT),
    nearest_railway_station VARCHAR(255),
    nearest_airport VARCHAR(255),
    distance_from_station_km DECIMAL(6, 2),

    -- Timings
    morning_opening_time TIME DEFAULT '05:00',
    morning_closing_time TIME DEFAULT '12:00',
    evening_opening_time TIME DEFAULT '16:00',
    evening_closing_time TIME DEFAULT '21:00',
    weekly_closed_days VARCHAR(20)[], -- Usually empty for temples

    -- Capacity
    daily_darshan_capacity INTEGER,
    special_darshan_capacity INTEGER,
    vip_darshan_capacity INTEGER,
    avg_darshan_time_minutes INTEGER DEFAULT 15,

    -- Facilities
    has_prasad_counter BOOLEAN DEFAULT true,
    has_donation_counter BOOLEAN DEFAULT true,
    has_accommodation BOOLEAN DEFAULT false,
    has_annadaan BOOLEAN DEFAULT false,
    has_parking BOOLEAN DEFAULT false,
    has_shoe_stand BOOLEAN DEFAULT true,
    has_cloakroom BOOLEAN DEFAULT false,
    has_wheelchair_facility BOOLEAN DEFAULT false,
    has_live_darshan BOOLEAN DEFAULT false,

    -- Services Offered
    services_offered TEXT[], -- DARSHAN, POOJA, ABHISHEK, AARTI, PRASAD, ACCOMMODATION, ANNADAAN

    -- Online Features
    online_darshan_booking BOOLEAN DEFAULT false,
    online_donation_enabled BOOLEAN DEFAULT true,
    online_prasad_delivery BOOLEAN DEFAULT false,
    live_darshan_stream_url VARCHAR(500),

    -- Contact
    head_priest_name VARCHAR(255),
    temple_phone VARCHAR(20),
    temple_email VARCHAR(255),

    -- Images
    primary_image_url VARCHAR(500),
    gallery_images_urls TEXT[],
    video_url VARCHAR(500),

    -- Heritage Status
    is_heritage_site BOOLEAN DEFAULT false,
    asi_protected BOOLEAN DEFAULT false, -- Archaeological Survey of India
    unesco_site BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_temples_code ON temples(temple_code);
CREATE INDEX idx_temples_location ON temples USING gist(location);

-- ============================================================================
-- DEITY MANAGEMENT
-- ============================================================================

CREATE TABLE deities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    -- Deity Details
    deity_name VARCHAR(255) NOT NULL,
    deity_name_hindi VARCHAR(255),
    deity_name_sanskrit VARCHAR(255),
    deity_type VARCHAR(50) NOT NULL, -- MAIN, PARIVAR (family), UPADEVATA (sub-deity)

    -- Description
    deity_form VARCHAR(100), -- SHIVA_LINGA, VISHNU_IDOL, DEVI_MURTI, etc.
    deity_appearance TEXT,
    historical_significance TEXT,

    -- Location within temple
    shrine_location VARCHAR(100), -- GARBHAGRIHA, MANDAP, PRADAKSHINA, etc.

    -- Rituals
    daily_pooja_times TIME[],
    special_days TEXT[], -- MONDAY, SHIVRATRI, JANMASHTAMI, etc.

    deity_image_url VARCHAR(500),

    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- DEVOTEE MANAGEMENT
-- ============================================================================

CREATE TABLE devotees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    -- Personal Info
    devotee_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    gotra VARCHAR(100), -- Hindu lineage
    nakshatra VARCHAR(50), -- Birth star

    date_of_birth DATE,
    gender VARCHAR(20),

    -- Contact
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp_number VARCHAR(20),

    -- Address
    address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),

    -- ID Proof
    aadhar_number VARCHAR(20),
    pan_number VARCHAR(20),

    -- Devotee Category
    devotee_category VARCHAR(50) DEFAULT 'REGULAR',
    -- REGULAR, VIP, LIFETIME_MEMBER, TRUSTEE, PATRON, FOREIGN

    -- Statistics
    total_visits INTEGER DEFAULT 0,
    total_donations DECIMAL(12, 2) DEFAULT 0,
    total_poojas_booked INTEGER DEFAULT 0,
    last_visit_date DATE,
    first_visit_date DATE,

    -- Portal Access
    portal_username VARCHAR(100) UNIQUE,
    portal_password_hash VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,

    -- Preferences
    preferred_language VARCHAR(50) DEFAULT 'Hindi',
    sms_notifications BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    whatsapp_notifications BOOLEAN DEFAULT true,

    photo_url VARCHAR(500),

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_devotees_phone ON devotees(phone);
CREATE INDEX idx_devotees_code ON devotees(devotee_code);

-- ============================================================================
-- DARSHAN BOOKING & QUEUE MANAGEMENT
-- ============================================================================

CREATE TABLE darshan_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    darshan_name VARCHAR(255) NOT NULL,
    darshan_name_hindi VARCHAR(255),
    darshan_type VARCHAR(50) NOT NULL, -- GENERAL, VIP, SPECIAL, SENIOR_CITIZEN, DIVYANG, FREE

    -- Capacity & Timing
    slots_per_day INTEGER,
    devotees_per_slot INTEGER DEFAULT 50,
    duration_per_slot_minutes INTEGER DEFAULT 30,

    -- Pricing
    ticket_price DECIMAL(8, 2) NOT NULL DEFAULT 0,
    online_booking_enabled BOOLEAN DEFAULT true,
    advance_booking_days INTEGER DEFAULT 30,

    -- Priority
    skip_queue BOOLEAN DEFAULT false,
    priority_level INTEGER DEFAULT 1,

    description TEXT,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE darshan_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),
    darshan_type_id UUID REFERENCES darshan_types(id),

    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL,

    -- Capacity
    total_capacity INTEGER NOT NULL,
    booked_count INTEGER DEFAULT 0,
    available_count INTEGER,
    walk_in_reserved INTEGER DEFAULT 0,

    -- Status
    slot_status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, FULLY_BOOKED, CLOSED, CANCELLED

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(temple_id, darshan_type_id, slot_date, slot_time)
);

CREATE INDEX idx_darshan_slots_date ON darshan_slots(temple_id, slot_date);

CREATE TABLE darshan_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),
    devotee_id UUID REFERENCES devotees(id),
    darshan_type_id UUID REFERENCES darshan_types(id),
    slot_id UUID REFERENCES darshan_slots(id),

    -- Booking Details
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    booking_date TIMESTAMP DEFAULT NOW(),
    booking_type VARCHAR(50) DEFAULT 'ONLINE', -- ONLINE, COUNTER, PHONE

    -- Darshan Date & Time
    darshan_date DATE NOT NULL,
    slot_time TIME NOT NULL,

    -- Devotees Count
    total_devotees INTEGER DEFAULT 1,
    adult_count INTEGER DEFAULT 1,
    child_count INTEGER DEFAULT 0,
    senior_citizen_count INTEGER DEFAULT 0,

    -- Devotee Names (for family bookings)
    devotee_names JSONB, -- [{name, age, relation}, ...]

    -- Pricing
    ticket_price DECIMAL(8, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Payment
    payment_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PAID, FAILED, REFUNDED
    payment_mode VARCHAR(50), -- CASH, CARD, UPI, ONLINE
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP,

    -- Check-in
    is_checked_in BOOLEAN DEFAULT false,
    check_in_time TIMESTAMP,
    check_in_gate VARCHAR(50),

    -- Status
    booking_status VARCHAR(50) DEFAULT 'CONFIRMED',
    -- CONFIRMED, CHECKED_IN, COMPLETED, CANCELLED, NO_SHOW

    -- QR Code for entry
    qr_code_url VARCHAR(500),

    -- Cancellation
    cancelled_at TIMESTAMP,
    cancelled_by UUID,
    cancellation_reason TEXT,
    refund_amount DECIMAL(10, 2),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_darshan_bookings_devotee ON darshan_bookings(devotee_id);
CREATE INDEX idx_darshan_bookings_date ON darshan_bookings(darshan_date);
CREATE INDEX idx_darshan_bookings_number ON darshan_bookings(booking_number);

-- ============================================================================
-- POOJA & SEVA MANAGEMENT
-- ============================================================================

CREATE TABLE pooja_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),
    deity_id UUID REFERENCES deities(id),

    -- Pooja Details
    pooja_name VARCHAR(255) NOT NULL,
    pooja_name_hindi VARCHAR(255),
    pooja_name_sanskrit VARCHAR(255),
    pooja_category VARCHAR(100), -- NITYA (daily), NAIMITTIKA (occasional), KAMYA (desire-based)

    -- Type
    pooja_type VARCHAR(100), -- ABHISHEK, ARCHANA, HAVAN, RUDRABHISHEK, SATYANARAYAN_KATHA, etc.

    -- Duration & Requirements
    duration_minutes INTEGER NOT NULL,
    requires_devotee_presence BOOLEAN DEFAULT false,
    max_devotees_allowed INTEGER DEFAULT 1,

    -- Materials Required
    samagri_included BOOLEAN DEFAULT true,
    samagri_list TEXT[],

    -- Priest Required
    priest_required BOOLEAN DEFAULT true,
    min_priests_required INTEGER DEFAULT 1,

    -- Pricing
    base_price DECIMAL(10, 2) NOT NULL,
    dakshina_included BOOLEAN DEFAULT true,
    prasad_included BOOLEAN DEFAULT true,

    -- Booking
    online_booking_enabled BOOLEAN DEFAULT true,
    advance_booking_days INTEGER DEFAULT 60,
    slots_per_day INTEGER DEFAULT 10,

    -- Benefits (for website)
    benefits TEXT,
    procedure TEXT,

    -- Media
    image_url VARCHAR(500),
    video_url VARCHAR(500),

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pooja_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),
    devotee_id UUID REFERENCES devotees(id),
    pooja_service_id UUID REFERENCES pooja_services(id),

    -- Booking Details
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    booking_date TIMESTAMP DEFAULT NOW(),

    -- Pooja Schedule
    pooja_date DATE NOT NULL,
    pooja_time TIME,

    -- Devotee Details (for sankalp)
    devotee_name VARCHAR(255) NOT NULL,
    devotee_gotra VARCHAR(100),
    devotee_nakshatra VARCHAR(50),
    family_members JSONB, -- For family poojas

    -- Purpose/Wish
    pooja_purpose TEXT, -- HEALTH, PROSPERITY, EDUCATION, MARRIAGE, etc.
    special_instructions TEXT,

    -- Pricing
    pooja_price DECIMAL(10, 2) NOT NULL,
    dakshina_amount DECIMAL(10, 2) DEFAULT 0,
    additional_items_cost DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Payment
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    payment_mode VARCHAR(50),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP,

    -- Priest Assignment
    assigned_priest_id UUID, -- Will reference priests table

    -- Execution
    pooja_status VARCHAR(50) DEFAULT 'BOOKED',
    -- BOOKED, IN_PROGRESS, COMPLETED, CANCELLED
    started_at TIMESTAMP,
    completed_at TIMESTAMP,

    -- Prasad Delivery
    prasad_delivery_required BOOLEAN DEFAULT false,
    delivery_address TEXT,
    delivery_status VARCHAR(50), -- PENDING, DISPATCHED, DELIVERED
    courier_tracking_number VARCHAR(100),

    -- Media (photos/videos of pooja)
    pooja_photos_urls TEXT[],
    pooja_video_url VARCHAR(500),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pooja_bookings_devotee ON pooja_bookings(devotee_id);
CREATE INDEX idx_pooja_bookings_date ON pooja_bookings(pooja_date);
CREATE INDEX idx_pooja_bookings_number ON pooja_bookings(booking_number);

-- ============================================================================
-- DONATION MANAGEMENT
-- ============================================================================

CREATE TABLE donation_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    category_name VARCHAR(255) NOT NULL,
    category_name_hindi VARCHAR(255),
    category_code VARCHAR(50) UNIQUE NOT NULL,

    -- Purpose
    donation_purpose VARCHAR(100), -- GENERAL, SEVA, ANNADAAN, CONSTRUCTION, FESTIVAL, EDUCATION, MEDICAL

    -- Suggested Amounts
    suggested_amounts DECIMAL(10, 2)[],
    minimum_amount DECIMAL(10, 2) DEFAULT 1,
    allows_custom_amount BOOLEAN DEFAULT true,

    -- 80G Tax Exemption
    is_80g_eligible BOOLEAN DEFAULT true,

    -- Utilization
    utilization_report_frequency VARCHAR(50), -- MONTHLY, QUARTERLY, ANNUAL

    description TEXT,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),
    devotee_id UUID REFERENCES devotees(id),
    category_id UUID REFERENCES donation_categories(id),

    -- Donation Details
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    donation_date DATE NOT NULL,

    -- Donor Details (for receipt)
    donor_name VARCHAR(255) NOT NULL,
    donor_pan_number VARCHAR(20),
    donor_address TEXT,
    donor_phone VARCHAR(20),
    donor_email VARCHAR(255),

    -- Donation Type
    donation_type VARCHAR(50) NOT NULL, -- CASH, CHEQUE, ONLINE, UPI, CARD, DD, KIND

    -- Amount
    donation_amount DECIMAL(12, 2) NOT NULL,

    -- Payment Details
    payment_mode VARCHAR(50),
    transaction_id VARCHAR(255),
    transaction_date TIMESTAMP,

    -- Cheque/DD Details
    cheque_number VARCHAR(50),
    cheque_date DATE,
    bank_name VARCHAR(255),
    cheque_status VARCHAR(50), -- PENDING, CLEARED, BOUNCED

    -- Payment Gateway
    payment_gateway VARCHAR(50), -- RAZORPAY, PAYTM, PHONEPE
    gateway_order_id VARCHAR(255),
    gateway_payment_id VARCHAR(255),

    -- Kind Donation (non-monetary)
    is_kind_donation BOOLEAN DEFAULT false,
    kind_donation_details TEXT,
    estimated_value DECIMAL(10, 2),

    -- 80G Certificate
    is_80g_certificate_required BOOLEAN DEFAULT false,
    is_80g_issued BOOLEAN DEFAULT false,
    certificate_number VARCHAR(100),
    certificate_issued_date DATE,
    certificate_url VARCHAR(500),

    -- Purpose/Wish
    donation_purpose TEXT,

    -- Hundi/Collection Box
    is_hundi_donation BOOLEAN DEFAULT false,
    hundi_id UUID, -- Will reference hundi_boxes table

    -- Acknowledgement
    acknowledgement_sent BOOLEAN DEFAULT false,
    acknowledgement_sent_at TIMESTAMP,

    -- Anonymous
    is_anonymous BOOLEAN DEFAULT false,

    remarks TEXT,

    collected_by UUID, -- staff_id
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_donations_devotee ON donations(devotee_id);
CREATE INDEX idx_donations_date ON donations(donation_date);
CREATE INDEX idx_donations_receipt ON donations(receipt_number);

CREATE TABLE hundi_boxes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    hundi_code VARCHAR(50) UNIQUE NOT NULL,
    hundi_name VARCHAR(255) NOT NULL,
    hundi_location VARCHAR(255) NOT NULL, -- MAIN_GATE, SANCTUM, TEMPLE_HALL, etc.

    hundi_type VARCHAR(50) DEFAULT 'GENERAL', -- GENERAL, SPECIAL_PURPOSE, FOREIGN_CURRENCY

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hundi_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),
    hundi_id UUID REFERENCES hundi_boxes(id),

    collection_number VARCHAR(50) UNIQUE NOT NULL,
    collection_date DATE NOT NULL,
    collection_time TIMESTAMP DEFAULT NOW(),

    -- Opening Committee
    committee_members JSONB NOT NULL, -- [{name, designation, signature}, ...] - Usually 3-4 members

    -- Cash Collection
    total_cash_amount DECIMAL(12, 2) DEFAULT 0,
    cash_denomination_wise JSONB, -- {2000: 10, 500: 50, 200: 100, ...}

    -- Coins
    total_coins_amount DECIMAL(10, 2) DEFAULT 0,

    -- Foreign Currency
    foreign_currency_details JSONB, -- [{currency: "USD", amount: 100, inr_value: 8000}, ...]
    total_foreign_currency_inr DECIMAL(10, 2) DEFAULT 0,

    -- Cheques/DDs
    cheques_received INTEGER DEFAULT 0,
    total_cheques_amount DECIMAL(10, 2) DEFAULT 0,

    -- Jewelry/Gold/Silver
    gold_received_grams DECIMAL(8, 3) DEFAULT 0,
    silver_received_grams DECIMAL(8, 3) DEFAULT 0,
    jewelry_items_count INTEGER DEFAULT 0,
    estimated_jewelry_value DECIMAL(12, 2) DEFAULT 0,

    -- Other Items
    other_items TEXT[],

    -- Total Value
    total_collection_value DECIMAL(12, 2) NOT NULL,

    -- Bank Deposit
    deposited_to_bank BOOLEAN DEFAULT false,
    deposit_date DATE,
    deposit_slip_number VARCHAR(100),

    -- Documentation
    opening_video_url VARCHAR(500),
    collection_report_url VARCHAR(500),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hundi_collections_date ON hundi_collections(collection_date);

-- ============================================================================
-- PRASAD MANAGEMENT
-- ============================================================================

CREATE TABLE prasad_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    -- Item Details
    prasad_name VARCHAR(255) NOT NULL,
    prasad_name_hindi VARCHAR(255),
    prasad_type VARCHAR(100), -- LADOO, PEDA, CHARANAMRIT, FRUIT, TULSI, VIBHUTI, FLOWERS

    -- Description
    ingredients TEXT[],
    description TEXT,
    shelf_life_days INTEGER,

    -- Packaging
    package_size VARCHAR(50), -- 250g, 500g, 1kg, etc.

    -- Pricing
    price DECIMAL(8, 2) NOT NULL,
    preparation_cost DECIMAL(8, 2),

    -- Availability
    daily_preparation_quantity INTEGER,
    current_stock INTEGER DEFAULT 0,
    min_stock_level INTEGER,

    -- Deity Specific
    offered_to_deity_id UUID REFERENCES deities(id),

    -- Online Ordering
    online_ordering_enabled BOOLEAN DEFAULT true,
    home_delivery_available BOOLEAN DEFAULT true,
    courier_charges DECIMAL(6, 2) DEFAULT 0,

    image_url VARCHAR(500),

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE prasad_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),
    devotee_id UUID REFERENCES devotees(id),

    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date TIMESTAMP DEFAULT NOW(),
    order_type VARCHAR(50) DEFAULT 'ONLINE', -- ONLINE, COUNTER

    -- Amounts
    subtotal DECIMAL(10, 2) NOT NULL,
    courier_charges DECIMAL(6, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Payment
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    payment_mode VARCHAR(50),
    transaction_id VARCHAR(255),

    -- Delivery
    delivery_required BOOLEAN DEFAULT true,
    delivery_address TEXT,
    delivery_city VARCHAR(100),
    delivery_state VARCHAR(100),
    delivery_pincode VARCHAR(10),
    delivery_phone VARCHAR(20),

    -- Order Status
    order_status VARCHAR(50) DEFAULT 'PLACED',
    -- PLACED, PREPARED, PACKED, DISPATCHED, DELIVERED, CANCELLED

    dispatch_date DATE,
    delivered_date DATE,
    courier_name VARCHAR(100),
    tracking_number VARCHAR(100),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE prasad_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES prasad_orders(id) ON DELETE CASCADE,
    prasad_item_id UUID REFERENCES prasad_items(id),

    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(8, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,

    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- FESTIVAL & EVENT MANAGEMENT
-- ============================================================================

CREATE TABLE festivals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    -- Festival Details
    festival_name VARCHAR(255) NOT NULL,
    festival_name_hindi VARCHAR(255),
    festival_type VARCHAR(50), -- MAJOR, MINOR, MONTHLY, ANNUAL

    -- Date (can be fixed or calculated based on Hindu calendar)
    is_fixed_date BOOLEAN DEFAULT false,
    fixed_date DATE,
    tithi VARCHAR(100), -- Hindu lunar day
    paksha VARCHAR(50), -- SHUKLA, KRISHNA
    month_hindu VARCHAR(50), -- CHAITRA, VAISHAKHA, etc.

    -- Description
    significance TEXT,
    rituals_performed TEXT[],

    -- Special Arrangements
    special_darshan_timings TEXT,
    extended_hours BOOLEAN DEFAULT false,
    special_prasad VARCHAR(255),

    -- Crowd Management
    expected_crowd_count INTEGER,
    requires_booking BOOLEAN DEFAULT false,

    image_url VARCHAR(500),

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE festival_celebrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),
    festival_id UUID REFERENCES festivals(id),

    -- Year & Date
    celebration_year INTEGER NOT NULL,
    celebration_date DATE NOT NULL,
    celebration_start_date DATE,
    celebration_end_date DATE,

    -- Schedule
    event_schedule JSONB, -- [{time, event_name, description}, ...]

    -- Special Arrangements
    special_poojas JSONB,
    special_prasad_distribution BOOLEAN DEFAULT false,
    annadaan_arrangements BOOLEAN DEFAULT false,

    -- Volunteers
    volunteers_required INTEGER,
    volunteers_registered INTEGER DEFAULT 0,

    -- Budget
    estimated_budget DECIMAL(12, 2),
    actual_expenses DECIMAL(12, 2) DEFAULT 0,

    -- Attendance
    total_devotees_attended INTEGER,

    -- Status
    status VARCHAR(50) DEFAULT 'PLANNED', -- PLANNED, ONGOING, COMPLETED

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- PRIEST & STAFF MANAGEMENT
-- ============================================================================

CREATE TABLE priests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    priest_code VARCHAR(50) UNIQUE NOT NULL,

    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    priest_name_hindi VARCHAR(255),

    date_of_birth DATE,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),

    address TEXT,

    -- Vedic Qualifications
    gotra VARCHAR(100),
    shakha VARCHAR(100), -- Vedic school
    vedic_education TEXT[],
    years_of_experience INTEGER,

    -- Specialization
    pooja_specialization TEXT[], -- RUDRABHISHEK, SATYANARAYAN_KATHA, VEDIC_RITUALS, etc.
    languages_known TEXT[], -- SANSKRIT, HINDI, ENGLISH

    -- Designation
    designation VARCHAR(100), -- HEAD_PRIEST, ASSISTANT_PRIEST, PUJARI

    -- Employment
    date_of_joining DATE NOT NULL,
    employment_type VARCHAR(50), -- PERMANENT, CONTRACT, VISITING

    -- Salary
    monthly_salary DECIMAL(10, 2),
    dakshina_sharing_percentage DECIMAL(5, 2) DEFAULT 0,

    -- Bank Details
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),

    -- Availability
    working_days VARCHAR(20)[], -- Days of week
    available_from TIME DEFAULT '06:00',
    available_till TIME DEFAULT '20:00',

    -- Statistics
    total_poojas_conducted INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2),

    photo_url VARCHAR(500),

    employment_status VARCHAR(50) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_priests_code ON priests(priest_code);

CREATE TABLE temple_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    employee_code VARCHAR(50) UNIQUE NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,

    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,

    -- Employment
    designation VARCHAR(100) NOT NULL, -- MANAGER, ACCOUNTANT, SECURITY, CLEANER, GARDENER, etc.
    department VARCHAR(100), -- ADMINISTRATION, ACCOUNTS, SECURITY, MAINTENANCE, KITCHEN

    date_of_joining DATE NOT NULL,
    employment_type VARCHAR(50),

    monthly_salary DECIMAL(10, 2),

    -- Bank Details
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),

    -- System Access
    system_username VARCHAR(100) UNIQUE,
    system_password_hash VARCHAR(255),
    system_role VARCHAR(50), -- ADMIN, MANAGER, ACCOUNTANT, RECEPTIONIST

    photo_url VARCHAR(500),

    employment_status VARCHAR(50) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- ACCOMMODATION (DHARAMSHALA) MANAGEMENT
-- ============================================================================

CREATE TABLE dharamshalas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    dharamshala_name VARCHAR(255) NOT NULL,
    address TEXT,

    total_rooms INTEGER NOT NULL,
    total_beds INTEGER NOT NULL,

    -- Facilities
    facilities TEXT[], -- AC, FAN, GEYSER, TV, WIFI, etc.

    dharamshala_type VARCHAR(50) DEFAULT 'STANDARD', -- FREE, STANDARD, DELUXE, VIP

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dharamshala_id UUID REFERENCES dharamshalas(id),

    room_number VARCHAR(50) NOT NULL,
    floor_number INTEGER,
    room_type VARCHAR(50), -- SINGLE, DOUBLE, TRIPLE, DORMITORY

    bed_capacity INTEGER NOT NULL,

    -- Amenities
    has_ac BOOLEAN DEFAULT false,
    has_geyser BOOLEAN DEFAULT false,
    has_tv BOOLEAN DEFAULT false,
    has_attached_bathroom BOOLEAN DEFAULT true,

    -- Pricing
    daily_rent DECIMAL(8, 2) NOT NULL,

    -- Status
    room_status VARCHAR(50) DEFAULT 'AVAILABLE', -- AVAILABLE, OCCUPIED, MAINTENANCE, BLOCKED

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(dharamshala_id, room_number)
);

CREATE TABLE accommodation_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),
    devotee_id UUID REFERENCES devotees(id),
    room_id UUID REFERENCES rooms(id),

    booking_number VARCHAR(50) UNIQUE NOT NULL,
    booking_date TIMESTAMP DEFAULT NOW(),

    -- Stay Details
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    total_guests INTEGER NOT NULL,

    -- Guest Details
    primary_guest_name VARCHAR(255) NOT NULL,
    primary_guest_phone VARCHAR(20) NOT NULL,
    id_proof_type VARCHAR(50), -- AADHAR, PAN, DRIVING_LICENSE, PASSPORT
    id_proof_number VARCHAR(100),
    id_proof_url VARCHAR(500),

    -- Pricing
    daily_rent DECIMAL(8, 2) NOT NULL,
    total_rent DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(8, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Payment
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    payment_mode VARCHAR(50),
    transaction_id VARCHAR(255),

    -- Check-in/out
    actual_check_in_time TIMESTAMP,
    actual_check_out_time TIMESTAMP,

    -- Status
    booking_status VARCHAR(50) DEFAULT 'CONFIRMED',
    -- CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_accommodation_bookings_dates ON accommodation_bookings(check_in_date, check_out_date);

-- ============================================================================
-- ANNADAAN (FOOD DISTRIBUTION) MANAGEMENT
-- ============================================================================

CREATE TABLE annadaan_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    schedule_name VARCHAR(255) NOT NULL,
    schedule_type VARCHAR(50) NOT NULL, -- DAILY, FESTIVAL, SPECIAL_OCCASION

    -- Timing
    meal_type VARCHAR(50) NOT NULL, -- BREAKFAST, LUNCH, DINNER
    serving_start_time TIME NOT NULL,
    serving_end_time TIME NOT NULL,

    -- Capacity
    daily_capacity INTEGER, -- Number of people

    -- Menu
    menu_items TEXT[],

    -- Days
    applicable_days VARCHAR(20)[], -- Days of week

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE annadaan_distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),
    schedule_id UUID REFERENCES annadaan_schedules(id),

    distribution_date DATE NOT NULL,
    meal_type VARCHAR(50) NOT NULL,

    -- Count
    total_people_served INTEGER DEFAULT 0,

    -- Cost
    per_meal_cost DECIMAL(6, 2),
    total_cost DECIMAL(10, 2),

    -- Sponsored By
    is_sponsored BOOLEAN DEFAULT false,
    sponsor_devotee_id UUID REFERENCES devotees(id),
    sponsor_name VARCHAR(255),
    sponsor_amount DECIMAL(10, 2),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INVENTORY MANAGEMENT (Pooja Materials)
-- ============================================================================

CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    item_name VARCHAR(255) NOT NULL,
    item_category VARCHAR(100), -- POOJA_SAMAGRI, FLOWERS, FRUITS, STATIONERY, CLEANING, KITCHEN

    unit VARCHAR(50), -- KG, LITER, PIECE, PACKET, etc.

    current_stock DECIMAL(10, 2) DEFAULT 0,
    min_stock_level DECIMAL(10, 2),
    reorder_quantity DECIMAL(10, 2),

    unit_cost DECIMAL(8, 2),

    is_perishable BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),
    item_id UUID REFERENCES inventory_items(id),

    transaction_type VARCHAR(50) NOT NULL, -- PURCHASE, CONSUMPTION, WASTAGE, ADJUSTMENT
    transaction_date DATE NOT NULL,

    quantity DECIMAL(10, 2) NOT NULL,
    unit_cost DECIMAL(8, 2),
    total_cost DECIMAL(10, 2),

    -- Reference
    reference_type VARCHAR(50), -- POOJA, FESTIVAL, DAILY_USE
    reference_id UUID,

    remarks TEXT,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS & REPORTS
-- ============================================================================

CREATE TABLE daily_temple_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    summary_date DATE NOT NULL,

    -- Devotees
    total_devotees_visited INTEGER DEFAULT 0,
    darshan_bookings INTEGER DEFAULT 0,
    walk_in_devotees INTEGER DEFAULT 0,

    -- Revenue
    darshan_revenue DECIMAL(10, 2) DEFAULT 0,
    pooja_revenue DECIMAL(10, 2) DEFAULT 0,
    donation_revenue DECIMAL(12, 2) DEFAULT 0,
    prasad_revenue DECIMAL(10, 2) DEFAULT 0,
    accommodation_revenue DECIMAL(10, 2) DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,

    -- Collections
    cash_donations DECIMAL(12, 2) DEFAULT 0,
    online_donations DECIMAL(12, 2) DEFAULT 0,
    hundi_collections DECIMAL(12, 2) DEFAULT 0,

    -- Poojas
    total_poojas_conducted INTEGER DEFAULT 0,

    -- Annadaan
    people_served_annadaan INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(temple_id, summary_date)
);

SELECT create_hypertable('daily_temple_summary', 'created_at', if_not_exists => TRUE);

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id),

    user_id UUID,
    user_type VARCHAR(50),

    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,

    action_description TEXT,
    old_values JSONB,
    new_values JSONB,

    ip_address VARCHAR(50),

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_temple ON audit_logs(temple_id, created_at);
SELECT create_hypertable('audit_logs', 'created_at', if_not_exists => TRUE);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Today's darshan bookings
CREATE VIEW v_todays_darshan AS
SELECT
    db.booking_number,
    d.devotee_code,
    d.first_name || ' ' || d.last_name as devotee_name,
    d.phone,
    dt.darshan_name,
    db.slot_time,
    db.total_devotees,
    db.booking_status,
    db.payment_status
FROM darshan_bookings db
JOIN devotees d ON db.devotee_id = d.id
JOIN darshan_types dt ON db.darshan_type_id = dt.id
WHERE db.darshan_date = CURRENT_DATE
ORDER BY db.slot_time;

-- Pending pooja bookings
CREATE VIEW v_pending_poojas AS
SELECT
    pb.booking_number,
    pb.pooja_date,
    pb.pooja_time,
    d.devotee_code,
    d.first_name || ' ' || d.last_name as devotee_name,
    d.phone,
    ps.pooja_name,
    pb.total_amount,
    pb.pooja_status,
    p.first_name || ' ' || p.last_name as assigned_priest
FROM pooja_bookings pb
JOIN devotees d ON pb.devotee_id = d.id
JOIN pooja_services ps ON pb.pooja_service_id = ps.id
LEFT JOIN priests p ON pb.assigned_priest_id = p.id
WHERE pb.pooja_status IN ('BOOKED', 'IN_PROGRESS')
ORDER BY pb.pooja_date, pb.pooja_time;

-- Today's revenue summary
CREATE VIEW v_todays_revenue AS
SELECT
    t.temple_name,
    COALESCE(SUM(CASE WHEN db.payment_status = 'PAID' THEN db.total_amount END), 0) as darshan_revenue,
    COALESCE(SUM(CASE WHEN pb.payment_status = 'PAID' THEN pb.total_amount END), 0) as pooja_revenue,
    COALESCE(SUM(don.donation_amount), 0) as donation_revenue,
    COALESCE(SUM(CASE WHEN po.payment_status = 'PAID' THEN po.total_amount END), 0) as prasad_revenue,
    COALESCE(SUM(CASE WHEN db.payment_status = 'PAID' THEN db.total_amount END), 0) +
    COALESCE(SUM(CASE WHEN pb.payment_status = 'PAID' THEN pb.total_amount END), 0) +
    COALESCE(SUM(don.donation_amount), 0) +
    COALESCE(SUM(CASE WHEN po.payment_status = 'PAID' THEN po.total_amount END), 0) as total_revenue
FROM temples t
LEFT JOIN darshan_bookings db ON t.id = db.temple_id AND DATE(db.created_at) = CURRENT_DATE
LEFT JOIN pooja_bookings pb ON t.id = pb.temple_id AND DATE(pb.created_at) = CURRENT_DATE
LEFT JOIN donations don ON t.id = don.temple_id AND don.donation_date = CURRENT_DATE
LEFT JOIN prasad_orders po ON t.id = po.temple_id AND DATE(po.created_at) = CURRENT_DATE
GROUP BY t.id, t.temple_name;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update darshan slot availability
CREATE OR REPLACE FUNCTION update_darshan_slot_availability()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE darshan_slots
    SET booked_count = (
        SELECT COUNT(*)
        FROM darshan_bookings
        WHERE slot_id = NEW.slot_id
          AND booking_status NOT IN ('CANCELLED', 'NO_SHOW')
    ),
    available_count = total_capacity - (
        SELECT COUNT(*)
        FROM darshan_bookings
        WHERE slot_id = NEW.slot_id
          AND booking_status NOT IN ('CANCELLED', 'NO_SHOW')
    ),
    slot_status = CASE
        WHEN (total_capacity - (SELECT COUNT(*) FROM darshan_bookings WHERE slot_id = NEW.slot_id AND booking_status NOT IN ('CANCELLED', 'NO_SHOW'))) = 0
        THEN 'FULLY_BOOKED'
        ELSE 'OPEN'
    END
    WHERE id = NEW.slot_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_darshan_slot
AFTER INSERT OR UPDATE ON darshan_bookings
FOR EACH ROW
EXECUTE FUNCTION update_darshan_slot_availability();

-- Update devotee statistics
CREATE OR REPLACE FUNCTION update_devotee_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'donations' AND TG_OP = 'INSERT' THEN
        UPDATE devotees
        SET total_donations = COALESCE(total_donations, 0) + NEW.donation_amount
        WHERE id = NEW.devotee_id;
    END IF;

    IF TG_TABLE_NAME = 'pooja_bookings' AND TG_OP = 'INSERT' THEN
        UPDATE devotees
        SET total_poojas_booked = COALESCE(total_poojas_booked, 0) + 1
        WHERE id = NEW.devotee_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_devotee_donations
AFTER INSERT ON donations
FOR EACH ROW
EXECUTE FUNCTION update_devotee_statistics();

CREATE TRIGGER trigger_update_devotee_poojas
AFTER INSERT ON pooja_bookings
FOR EACH ROW
EXECUTE FUNCTION update_devotee_statistics();

-- Update prasad stock
CREATE OR REPLACE FUNCTION update_prasad_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE prasad_items
        SET current_stock = current_stock - NEW.quantity
        WHERE id = NEW.prasad_item_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_prasad_stock
AFTER INSERT ON prasad_order_items
FOR EACH ROW
EXECUTE FUNCTION update_prasad_stock();

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_pooja_bookings_priest ON pooja_bookings(assigned_priest_id);
CREATE INDEX idx_pooja_bookings_status ON pooja_bookings(pooja_status);
CREATE INDEX idx_donations_category ON donations(category_id);
CREATE INDEX idx_donations_80g ON donations(is_80g_certificate_required);

-- Text search
CREATE INDEX idx_devotees_name_search ON devotees USING gin(to_tsvector('english', first_name || ' ' || last_name));
CREATE INDEX idx_pooja_services_name_search ON pooja_services USING gin(to_tsvector('english', pooja_name));

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE temples IS 'Hindu temple details with online booking and live darshan capabilities';
COMMENT ON TABLE darshan_bookings IS 'Queue-free darshan booking system with time slots';
COMMENT ON TABLE pooja_bookings IS 'Online pooja booking with priest assignment and prasad delivery';
COMMENT ON TABLE donations IS 'Donation management with 80G tax exemption certificates';
COMMENT ON TABLE hundi_collections IS 'Transparent hundi opening with committee and documentation';
COMMENT ON TABLE annadaan_distributions IS 'Free food distribution tracking for devotees';
COMMENT ON TABLE accommodation_bookings IS 'Dharamshala room booking for pilgrims';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
