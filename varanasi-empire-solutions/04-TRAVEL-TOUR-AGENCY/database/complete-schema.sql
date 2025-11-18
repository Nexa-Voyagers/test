-- ============================================================================
-- TRAVEL & TOUR AGENCY MANAGEMENT SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Target: Tour Operators, Travel Agencies, Pilgrimage Tour Organizers (UP Focus)
-- Features: Tour Packages, Booking Management, Itinerary, Visa Assistance,
--           Transport Fleet, Hotel Booking, Flight/Train Booking, Guide Management
-- Special Focus: Kashi-Ayodhya-Prayagraj circuits, Buddhist tours, Char Dham
-- Tier: Enterprise (Multi-branch agency) + Standard (Single office)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- ============================================================================
-- AGENCY HIERARCHY & CONFIGURATION
-- ============================================================================

CREATE TABLE travel_agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),

    -- Registration & Licenses
    registration_number VARCHAR(100),
    iata_code VARCHAR(20), -- International Air Transport Association
    pan_number VARCHAR(20),
    gstin VARCHAR(20),
    tourism_license_number VARCHAR(100),
    tourism_license_valid_till DATE,

    -- Head Office
    head_office_address TEXT,
    location GEOGRAPHY(POINT),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website VARCHAR(255),

    -- Business Type
    agency_type VARCHAR(50)[], -- B2B, B2C, CORPORATE, MICE (Meetings, Incentives, Conferences, Exhibitions)
    specialization TEXT[], -- PILGRIMAGE, ADVENTURE, HONEYMOON, CORPORATE, EDUCATIONAL, MEDICAL

    -- Services Offered
    services_offered TEXT[], -- TOUR_PACKAGES, HOTEL_BOOKING, FLIGHT_BOOKING, TRAIN_BOOKING, VISA_ASSISTANCE, PASSPORT_SERVICE, TRAVEL_INSURANCE, FOREX

    -- Fleet
    has_own_fleet BOOLEAN DEFAULT false,
    total_vehicles INTEGER DEFAULT 0,

    -- Banking
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    upi_id VARCHAR(100),

    -- Online Presence
    online_booking_enabled BOOLEAN DEFAULT true,
    payment_gateway VARCHAR(50), -- RAZORPAY, PAYTM, CCAvenue

    logo_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE agency_branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),

    branch_name VARCHAR(255) NOT NULL,
    branch_code VARCHAR(50) UNIQUE NOT NULL,

    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),
    location GEOGRAPHY(POINT),

    branch_manager_name VARCHAR(255),
    branch_phone VARCHAR(20),
    branch_email VARCHAR(255),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- STAFF & GUIDE MANAGEMENT
-- ============================================================================

CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),
    branch_id UUID REFERENCES agency_branches(id),

    employee_code VARCHAR(50) UNIQUE NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,

    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,

    -- Employment
    designation VARCHAR(100) NOT NULL, -- MANAGER, TOUR_CONSULTANT, TOUR_COORDINATOR, ACCOUNTANT, DRIVER, GUIDE
    department VARCHAR(100), -- SALES, OPERATIONS, ACCOUNTS, TRANSPORT

    date_of_joining DATE NOT NULL,
    employment_type VARCHAR(50),

    -- Salary
    monthly_salary DECIMAL(10, 2),
    commission_percentage DECIMAL(5, 2) DEFAULT 0, -- For sales staff

    -- Banking
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),

    -- System Access
    system_username VARCHAR(100) UNIQUE,
    system_password_hash VARCHAR(255),
    system_role VARCHAR(50), -- ADMIN, MANAGER, CONSULTANT, ACCOUNTS

    photo_url VARCHAR(500),

    employment_status VARCHAR(50) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_staff_employee_code ON staff(employee_code);

CREATE TABLE tour_guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),

    guide_code VARCHAR(50) UNIQUE NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,

    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,

    -- Guide License
    guide_license_number VARCHAR(100),
    license_issuing_authority VARCHAR(255),
    license_valid_till DATE,

    -- Languages
    languages_known TEXT[], -- HINDI, ENGLISH, FRENCH, GERMAN, JAPANESE, CHINESE, etc.

    -- Specialization
    specialization TEXT[], -- HISTORICAL, RELIGIOUS, ADVENTURE, WILDLIFE
    destinations_expertise TEXT[], -- VARANASI, AGRA, JAIPUR, AYODHYA, etc.

    -- Experience
    years_of_experience INTEGER,
    total_tours_conducted INTEGER DEFAULT 0,

    -- Availability
    guide_type VARCHAR(50), -- FULL_TIME, FREELANCE
    currently_available BOOLEAN DEFAULT true,

    -- Ratings
    average_rating DECIMAL(3, 2),
    total_reviews INTEGER DEFAULT 0,

    -- Fees
    daily_rate DECIMAL(8, 2),

    photo_url VARCHAR(500),

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tour_guides_code ON tour_guides(guide_code);

-- ============================================================================
-- CUSTOMER MANAGEMENT
-- ============================================================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),

    customer_code VARCHAR(50) UNIQUE NOT NULL,
    customer_type VARCHAR(50) NOT NULL, -- INDIVIDUAL, CORPORATE, TRAVEL_AGENT (B2B)

    -- Personal/Company Info
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),

    date_of_birth DATE,
    anniversary_date DATE,
    gender VARCHAR(20),

    -- Contact
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp_number VARCHAR(20),

    -- Address
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),

    -- Travel Documents
    passport_number VARCHAR(50),
    passport_issue_date DATE,
    passport_expiry_date DATE,
    passport_issue_country VARCHAR(100),
    aadhar_number VARCHAR(20),
    pan_number VARCHAR(20),

    -- Preferences
    preferred_destinations TEXT[],
    preferred_travel_class VARCHAR(50), -- ECONOMY, BUSINESS, FIRST
    preferred_accommodation VARCHAR(50), -- BUDGET, STANDARD, DELUXE, LUXURY
    dietary_preferences TEXT[], -- VEG, NON_VEG, JAIN, VEGAN
    special_requirements TEXT,

    -- Financial
    credit_limit DECIMAL(10, 2) DEFAULT 0, -- For B2B agents
    outstanding_balance DECIMAL(10, 2) DEFAULT 0,

    -- Statistics
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    last_booking_date DATE,
    last_travel_date DATE,

    -- Marketing
    marketing_source VARCHAR(100), -- WALK_IN, REFERRAL, ONLINE, ADVERTISEMENT, SOCIAL_MEDIA
    referred_by_customer_id UUID REFERENCES customers(id),

    -- Portal Access
    portal_username VARCHAR(100) UNIQUE,
    portal_password_hash VARCHAR(255),

    photo_url VARCHAR(500),

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_customers_code ON customers(customer_code);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

CREATE TABLE traveler_companions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_customer_id UUID REFERENCES customers(id),

    -- Companion Details
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,

    relation VARCHAR(50), -- SPOUSE, CHILD, PARENT, FRIEND, COLLEAGUE

    date_of_birth DATE,
    gender VARCHAR(20),
    age INTEGER,

    phone VARCHAR(20),
    email VARCHAR(255),

    -- Travel Documents
    passport_number VARCHAR(50),
    passport_expiry_date DATE,
    aadhar_number VARCHAR(20),

    -- Medical
    medical_conditions TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),

    photo_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- DESTINATIONS & TOUR PACKAGES
-- ============================================================================

CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),

    destination_name VARCHAR(255) NOT NULL,
    destination_type VARCHAR(50), -- CITY, STATE, COUNTRY, REGION, PILGRIMAGE_CIRCUIT

    -- Location
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    location GEOGRAPHY(POINT),

    -- Classification
    category VARCHAR(50), -- PILGRIMAGE, HERITAGE, ADVENTURE, BEACH, HILL_STATION, WILDLIFE

    -- Description
    description TEXT,
    best_time_to_visit VARCHAR(100),
    attractions TEXT[],

    -- Travel Info
    nearest_airport VARCHAR(255),
    nearest_railway_station VARCHAR(255),

    -- Media
    primary_image_url VARCHAR(500),
    gallery_images_urls TEXT[],
    video_url VARCHAR(500),

    is_popular BOOLEAN DEFAULT false,
    display_order INTEGER,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tour_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),

    -- Package Details
    package_code VARCHAR(50) UNIQUE NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    package_tagline VARCHAR(500),

    -- Type
    package_type VARCHAR(50) NOT NULL, -- DOMESTIC, INTERNATIONAL, PILGRIMAGE, ADVENTURE, HONEYMOON, CORPORATE, EDUCATIONAL
    tour_category VARCHAR(50), -- FIXED_DEPARTURE, CUSTOMIZED, GROUP, PRIVATE

    -- Duration
    duration_days INTEGER NOT NULL,
    duration_nights INTEGER NOT NULL,

    -- Destinations Covered
    destinations_covered UUID[], -- Array of destination_ids
    start_city VARCHAR(100),
    end_city VARCHAR(100),

    -- Itinerary Overview
    highlights TEXT[],
    inclusions TEXT[],
    exclusions TEXT[],

    -- Difficulty (for adventure tours)
    difficulty_level VARCHAR(50), -- EASY, MODERATE, CHALLENGING, DIFFICULT

    -- Pricing
    pricing_type VARCHAR(50) DEFAULT 'PER_PERSON', -- PER_PERSON, PER_COUPLE, PER_GROUP
    base_price DECIMAL(10, 2) NOT NULL,
    child_price DECIMAL(10, 2),

    -- Price variations
    price_per_person_twin_sharing DECIMAL(10, 2),
    price_per_person_single_occupancy DECIMAL(10, 2),
    price_per_person_triple_sharing DECIMAL(10, 2),

    -- Group Size
    min_group_size INTEGER DEFAULT 1,
    max_group_size INTEGER DEFAULT 50,

    -- Seasonality
    available_months INTEGER[], -- Array of month numbers [1-12]
    peak_season_months INTEGER[],

    -- Services Included
    includes_accommodation BOOLEAN DEFAULT true,
    includes_meals BOOLEAN DEFAULT true,
    meal_plan VARCHAR(50), -- CP, MAP, AP, EP (Continental Plan, Modified American Plan, etc.)
    includes_transport BOOLEAN DEFAULT true,
    includes_sightseeing BOOLEAN DEFAULT true,
    includes_guide BOOLEAN DEFAULT true,

    -- Requirements
    requires_passport BOOLEAN DEFAULT false,
    requires_visa BOOLEAN DEFAULT false,
    fitness_level_required VARCHAR(50),
    age_restrictions TEXT,

    -- Policy
    cancellation_policy TEXT,
    payment_terms TEXT,

    -- Booking
    advance_booking_days INTEGER DEFAULT 7,
    online_booking_enabled BOOLEAN DEFAULT true,

    -- Media
    package_image_url VARCHAR(500),
    gallery_images_urls TEXT[],
    brochure_pdf_url VARCHAR(500),
    video_url VARCHAR(500),

    -- SEO
    seo_keywords TEXT[],
    meta_description TEXT,

    -- Popularity
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    total_bookings INTEGER DEFAULT 0,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_tour_packages_code ON tour_packages(package_code);
CREATE INDEX idx_tour_packages_type ON tour_packages(package_type);

CREATE TABLE package_itinerary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID REFERENCES tour_packages(id) ON DELETE CASCADE,

    day_number INTEGER NOT NULL,
    day_title VARCHAR(255) NOT NULL,
    day_description TEXT NOT NULL,

    -- Activities
    morning_activity TEXT,
    afternoon_activity TEXT,
    evening_activity TEXT,

    -- Meals
    breakfast_included BOOLEAN DEFAULT true,
    lunch_included BOOLEAN DEFAULT false,
    dinner_included BOOLEAN DEFAULT true,

    -- Accommodation
    overnight_stay VARCHAR(255),
    accommodation_category VARCHAR(50), -- 3_STAR, 4_STAR, 5_STAR, DELUXE, BUDGET

    -- Distance
    distance_covered_km DECIMAL(6, 2),

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(package_id, day_number)
);

CREATE TABLE package_departures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID REFERENCES tour_packages(id),

    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,

    -- Pricing (can vary by departure)
    price_per_person DECIMAL(10, 2) NOT NULL,

    -- Availability
    total_seats INTEGER NOT NULL,
    booked_seats INTEGER DEFAULT 0,
    available_seats INTEGER,

    -- Status
    departure_status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, GUARANTEED, FILLING_FAST, FULLY_BOOKED, CANCELLED

    -- Special Notes
    special_notes TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(package_id, departure_date)
);

CREATE INDEX idx_package_departures_date ON package_departures(departure_date);

-- ============================================================================
-- BOOKING MANAGEMENT
-- ============================================================================

CREATE TABLE tour_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),
    branch_id UUID REFERENCES agency_branches(id),
    customer_id UUID REFERENCES customers(id),
    package_id UUID REFERENCES tour_packages(id),
    departure_id UUID REFERENCES package_departures(id),

    -- Booking Details
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    booking_date TIMESTAMP DEFAULT NOW(),
    booking_type VARCHAR(50) DEFAULT 'ONLINE', -- ONLINE, WALK_IN, PHONE, B2B

    -- Travel Dates
    travel_start_date DATE NOT NULL,
    travel_end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,

    -- Travelers
    total_travelers INTEGER NOT NULL,
    adult_count INTEGER NOT NULL,
    child_count INTEGER DEFAULT 0,
    infant_count INTEGER DEFAULT 0,

    traveler_details JSONB NOT NULL, -- [{name, age, gender, passport, ...}, ...]

    -- Accommodation
    room_preference VARCHAR(50), -- TWIN_SHARING, SINGLE, TRIPLE
    special_accommodation_requests TEXT,

    -- Pricing
    base_package_cost DECIMAL(12, 2) NOT NULL,
    additional_services_cost DECIMAL(10, 2) DEFAULT 0,
    gst_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,

    -- Payment Status
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, ADVANCE_PAID, PARTIALLY_PAID, FULLY_PAID, REFUND_INITIATED, REFUNDED

    advance_amount DECIMAL(10, 2) DEFAULT 0,
    amount_paid DECIMAL(12, 2) DEFAULT 0,
    balance_amount DECIMAL(12, 2),

    -- Payment Schedule
    advance_due_date DATE,
    final_payment_due_date DATE,

    -- Booking Status
    booking_status VARCHAR(50) DEFAULT 'CONFIRMED',
    -- CONFIRMED, OPTION (tentative), CANCELLED, IN_PROGRESS, COMPLETED

    -- Assignment
    tour_consultant_id UUID REFERENCES staff(id),
    tour_coordinator_id UUID REFERENCES staff(id),
    assigned_guide_id UUID REFERENCES tour_guides(id),

    -- Special Requirements
    dietary_requirements TEXT,
    medical_requirements TEXT,
    special_requests TEXT,

    -- Confirmation
    confirmation_sent BOOLEAN DEFAULT false,
    confirmation_sent_at TIMESTAMP,
    voucher_generated BOOLEAN DEFAULT false,
    voucher_pdf_url VARCHAR(500),

    -- Cancellation
    is_cancelled BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMP,
    cancelled_by UUID,
    cancellation_reason TEXT,
    cancellation_charges DECIMAL(10, 2),
    refund_amount DECIMAL(10, 2),
    refund_processed BOOLEAN DEFAULT false,

    -- Reviews
    customer_feedback TEXT,
    customer_rating DECIMAL(2, 1),
    reviewed_at TIMESTAMP,

    remarks TEXT,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tour_bookings_number ON tour_bookings(booking_number);
CREATE INDEX idx_tour_bookings_customer ON tour_bookings(customer_id);
CREATE INDEX idx_tour_bookings_dates ON tour_bookings(travel_start_date, travel_end_date);
CREATE INDEX idx_tour_bookings_status ON tour_bookings(booking_status);

CREATE TABLE booking_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES tour_bookings(id),
    customer_id UUID REFERENCES customers(id),

    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,

    payment_type VARCHAR(50) NOT NULL, -- ADVANCE, INSTALLMENT, FINAL, ADDITIONAL

    amount_paid DECIMAL(10, 2) NOT NULL,

    -- Payment Method
    payment_mode VARCHAR(50) NOT NULL, -- CASH, CARD, CHEQUE, NEFT, UPI, ONLINE
    transaction_id VARCHAR(255),

    -- Card Details
    card_last_4_digits VARCHAR(4),

    -- Cheque Details
    cheque_number VARCHAR(50),
    cheque_date DATE,
    bank_name VARCHAR(255),

    -- Payment Gateway
    payment_gateway VARCHAR(50),
    gateway_order_id VARCHAR(255),
    gateway_payment_id VARCHAR(255),

    remarks TEXT,

    collected_by UUID REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_booking_payments_booking ON booking_payments(booking_id);

-- ============================================================================
-- SUPPLIER MANAGEMENT
-- ============================================================================

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),

    supplier_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_type VARCHAR(50) NOT NULL, -- HOTEL, AIRLINE, TRANSPORT, DMC (Destination Management Company), ACTIVITY_PROVIDER

    -- Contact
    contact_person VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    website VARCHAR(255),

    -- Address
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),

    -- Business Details
    gstin VARCHAR(20),
    pan_number VARCHAR(20),

    -- Banking
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),

    -- Credit Terms
    credit_period_days INTEGER DEFAULT 0,
    credit_limit DECIMAL(10, 2) DEFAULT 0,

    -- Commission
    commission_percentage DECIMAL(5, 2) DEFAULT 0,

    -- Rating
    supplier_rating DECIMAL(2, 1),

    -- Contract
    contract_start_date DATE,
    contract_end_date DATE,
    contract_document_url VARCHAR(500),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX idx_suppliers_type ON suppliers(supplier_type);

CREATE TABLE hotel_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id),

    hotel_name VARCHAR(255) NOT NULL,
    hotel_category VARCHAR(50), -- 2_STAR, 3_STAR, 4_STAR, 5_STAR, BUDGET, HERITAGE

    -- Location
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100),
    address TEXT,
    location GEOGRAPHY(POINT),

    -- Contact
    hotel_phone VARCHAR(20),
    hotel_email VARCHAR(255),

    -- Room Types Available
    room_types JSONB, -- [{type: "Deluxe", rate: 3000, available: 10}, ...]

    -- Facilities
    facilities TEXT[],

    -- Meal Plans Available
    meal_plans VARCHAR(50)[], -- EP, CP, MAP, AP

    -- Commission
    commission_percentage DECIMAL(5, 2),

    -- Rating
    hotel_rating DECIMAL(2, 1),

    images_urls TEXT[],

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- TRANSPORT FLEET MANAGEMENT
-- ============================================================================

CREATE TABLE transport_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),

    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL, -- CAR, TEMPO_TRAVELLER, MINI_BUS, BUS, LUXURY_COACH
    vehicle_model VARCHAR(100),
    vehicle_make VARCHAR(100),
    year_of_manufacture INTEGER,

    -- Capacity
    seating_capacity INTEGER NOT NULL,

    -- Ownership
    ownership_type VARCHAR(50), -- OWNED, LEASED, VENDOR

    -- Driver
    driver_name VARCHAR(255),
    driver_phone VARCHAR(20),
    driver_license_number VARCHAR(50),
    driver_license_expiry DATE,

    -- Documents
    registration_number VARCHAR(50),
    registration_expiry DATE,
    insurance_number VARCHAR(100),
    insurance_expiry DATE,
    permit_number VARCHAR(100),
    permit_expiry DATE,
    pollution_certificate_expiry DATE,
    fitness_certificate_expiry DATE,

    -- Maintenance
    last_service_date DATE,
    next_service_due_date DATE,
    last_service_km INTEGER,
    current_km INTEGER,

    -- GPS Tracking
    gps_device_id VARCHAR(100),
    has_gps_tracking BOOLEAN DEFAULT false,

    -- Facilities
    has_ac BOOLEAN DEFAULT true,
    has_music_system BOOLEAN DEFAULT true,
    has_charging_points BOOLEAN DEFAULT false,
    has_wifi BOOLEAN DEFAULT false,
    has_washroom BOOLEAN DEFAULT false,

    -- Rates
    per_day_rate DECIMAL(8, 2),
    per_km_rate DECIMAL(6, 2),

    -- Status
    vehicle_status VARCHAR(50) DEFAULT 'AVAILABLE', -- AVAILABLE, ON_TRIP, MAINTENANCE, OUT_OF_SERVICE

    vehicle_images_urls TEXT[],

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_vehicles_number ON transport_vehicles(vehicle_number);
CREATE INDEX idx_vehicles_status ON transport_vehicles(vehicle_status);

CREATE TABLE transport_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_booking_id UUID REFERENCES tour_bookings(id),
    vehicle_id UUID REFERENCES transport_vehicles(id),

    booking_number VARCHAR(50) UNIQUE NOT NULL,

    -- Trip Details
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    dropoff_date DATE NOT NULL,
    dropoff_time TIME,

    pickup_location TEXT NOT NULL,
    dropoff_location TEXT NOT NULL,

    estimated_distance_km DECIMAL(8, 2),
    actual_distance_km DECIMAL(8, 2),

    -- Driver
    driver_name VARCHAR(255),
    driver_phone VARCHAR(20),

    -- Passengers
    passenger_count INTEGER,
    passenger_names TEXT[],

    -- Billing
    vehicle_charges DECIMAL(10, 2) NOT NULL,
    driver_allowance DECIMAL(6, 2) DEFAULT 0,
    toll_charges DECIMAL(6, 2) DEFAULT 0,
    parking_charges DECIMAL(6, 2) DEFAULT 0,
    other_charges DECIMAL(6, 2) DEFAULT 0,
    total_charges DECIMAL(10, 2) NOT NULL,

    -- Status
    trip_status VARCHAR(50) DEFAULT 'SCHEDULED',
    -- SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED

    -- Trip Start/End
    trip_started_at TIMESTAMP,
    trip_ended_at TIMESTAMP,

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- VISA ASSISTANCE
-- ============================================================================

CREATE TABLE visa_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),
    customer_id UUID REFERENCES customers(id),
    tour_booking_id UUID REFERENCES tour_bookings(id),

    application_number VARCHAR(50) UNIQUE NOT NULL,
    application_date DATE NOT NULL,

    -- Applicant Details
    applicant_name VARCHAR(255) NOT NULL,
    passport_number VARCHAR(50) NOT NULL,
    nationality VARCHAR(100),

    -- Visa Details
    visa_country VARCHAR(100) NOT NULL,
    visa_type VARCHAR(100) NOT NULL, -- TOURIST, BUSINESS, TRANSIT, MEDICAL
    visa_category VARCHAR(50),

    -- Travel Dates
    intended_travel_date DATE NOT NULL,
    intended_return_date DATE,
    duration_of_stay INTEGER,

    -- Application Details
    embassy_location VARCHAR(255),
    appointment_date DATE,
    appointment_time TIME,

    -- Documents
    documents_required TEXT[],
    documents_submitted TEXT[],
    photo_url VARCHAR(500),
    passport_copy_url VARCHAR(500),
    other_documents_urls TEXT[],

    -- Processing
    submission_date DATE,
    tracking_number VARCHAR(100),
    expected_approval_date DATE,

    -- Status
    application_status VARCHAR(50) DEFAULT 'DOCUMENTS_COLLECTION',
    -- DOCUMENTS_COLLECTION, READY_TO_SUBMIT, SUBMITTED, IN_PROCESS, APPROVED, REJECTED, PASSPORT_RETURNED

    approval_date DATE,
    visa_number VARCHAR(100),
    visa_valid_from DATE,
    visa_valid_till DATE,

    rejection_reason TEXT,

    -- Fees
    visa_fee DECIMAL(10, 2),
    service_charge DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),

    -- Payment
    payment_status VARCHAR(50) DEFAULT 'PENDING',

    remarks TEXT,

    assigned_to UUID REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_visa_applications_customer ON visa_applications(customer_id);
CREATE INDEX idx_visa_applications_status ON visa_applications(application_status);

-- ============================================================================
-- QUERIES & QUOTATIONS
-- ============================================================================

CREATE TABLE tour_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),
    customer_id UUID REFERENCES customers(id),

    query_number VARCHAR(50) UNIQUE NOT NULL,
    query_date TIMESTAMP DEFAULT NOW(),
    query_source VARCHAR(50), -- WEBSITE, PHONE, EMAIL, WALK_IN, REFERRAL

    -- Customer Details (if not registered)
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),

    -- Query Details
    destination VARCHAR(255),
    travel_date_from DATE,
    travel_date_to DATE,
    duration_days INTEGER,
    number_of_travelers INTEGER,
    budget_range VARCHAR(100),

    query_details TEXT NOT NULL,
    special_requirements TEXT,

    -- Assignment
    assigned_to UUID REFERENCES staff(id),

    -- Status
    query_status VARCHAR(50) DEFAULT 'NEW',
    -- NEW, CONTACTED, QUOTATION_SENT, NEGOTIATION, CONVERTED, LOST, FOLLOW_UP_REQUIRED

    -- Follow-up
    next_follow_up_date DATE,
    follow_up_count INTEGER DEFAULT 0,

    -- Conversion
    converted_to_booking_id UUID REFERENCES tour_bookings(id),
    conversion_date DATE,

    -- Lost Reason
    lost_reason VARCHAR(100),
    lost_details TEXT,

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tour_queries_customer ON tour_queries(customer_id);
CREATE INDEX idx_tour_queries_status ON tour_queries(query_status);

CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),
    query_id UUID REFERENCES tour_queries(id),
    customer_id UUID REFERENCES customers(id),

    quotation_number VARCHAR(50) UNIQUE NOT NULL,
    quotation_date DATE NOT NULL,

    -- Tour Details
    tour_name VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    duration VARCHAR(100),
    travel_date_from DATE,
    travel_date_to DATE,

    -- Travelers
    number_of_adults INTEGER NOT NULL,
    number_of_children INTEGER DEFAULT 0,

    -- Itinerary
    itinerary_details JSONB, -- Day-wise breakdown

    -- Pricing Breakdown
    accommodation_cost DECIMAL(10, 2) DEFAULT 0,
    meals_cost DECIMAL(10, 2) DEFAULT 0,
    transport_cost DECIMAL(10, 2) DEFAULT 0,
    sightseeing_cost DECIMAL(10, 2) DEFAULT 0,
    guide_cost DECIMAL(10, 2) DEFAULT 0,
    other_costs DECIMAL(10, 2) DEFAULT 0,

    subtotal DECIMAL(10, 2) NOT NULL,
    gst_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Per Person Cost
    cost_per_person DECIMAL(10, 2),

    -- Inclusions & Exclusions
    inclusions TEXT[],
    exclusions TEXT[],

    -- Terms & Conditions
    payment_terms TEXT,
    cancellation_policy TEXT,
    terms_and_conditions TEXT,

    -- Validity
    valid_till DATE NOT NULL,

    -- Status
    quotation_status VARCHAR(50) DEFAULT 'SENT',
    -- DRAFT, SENT, VIEWED, ACCEPTED, REJECTED, EXPIRED, REVISED

    sent_at TIMESTAMP,
    viewed_at TIMESTAMP,
    accepted_at TIMESTAMP,
    rejected_at TIMESTAMP,

    -- PDF
    quotation_pdf_url VARCHAR(500),

    -- Follow-up
    follow_up_required BOOLEAN DEFAULT true,
    follow_up_date DATE,

    -- Conversion
    converted_to_booking BOOLEAN DEFAULT false,
    booking_id UUID REFERENCES tour_bookings(id),

    remarks TEXT,

    prepared_by UUID REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quotations_customer ON quotations(customer_id);
CREATE INDEX idx_quotations_status ON quotations(quotation_status);

-- ============================================================================
-- INSURANCE
-- ============================================================================

CREATE TABLE travel_insurance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),
    booking_id UUID REFERENCES tour_bookings(id),
    customer_id UUID REFERENCES customers(id),

    policy_number VARCHAR(100) UNIQUE NOT NULL,
    insurance_company VARCHAR(255) NOT NULL,

    -- Insured Person
    insured_name VARCHAR(255) NOT NULL,
    insured_age INTEGER,
    insured_phone VARCHAR(20),

    -- Coverage
    policy_type VARCHAR(50), -- DOMESTIC, INTERNATIONAL, SCHENGEN
    coverage_amount DECIMAL(12, 2) NOT NULL,

    -- Coverage Details
    medical_coverage DECIMAL(12, 2),
    baggage_loss_coverage DECIMAL(10, 2),
    trip_cancellation_coverage DECIMAL(10, 2),
    personal_accident_coverage DECIMAL(12, 2),

    -- Duration
    policy_start_date DATE NOT NULL,
    policy_end_date DATE NOT NULL,

    -- Premium
    premium_amount DECIMAL(8, 2) NOT NULL,
    service_charge DECIMAL(6, 2) DEFAULT 0,
    total_amount DECIMAL(8, 2) NOT NULL,

    -- Payment
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    payment_date DATE,

    -- Documents
    policy_document_url VARCHAR(500),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- EXPENSE TRACKING
-- ============================================================================

CREATE TABLE tour_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),
    tour_booking_id UUID REFERENCES tour_bookings(id),

    expense_date DATE NOT NULL,
    expense_category VARCHAR(100) NOT NULL, -- ACCOMMODATION, MEALS, TRANSPORT, SIGHTSEEING, GUIDE, TIPS, PERMITS, OTHER

    expense_description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,

    -- Payment
    paid_to VARCHAR(255),
    payment_mode VARCHAR(50),

    -- Receipt
    receipt_number VARCHAR(100),
    receipt_url VARCHAR(500),

    remarks TEXT,

    recorded_by UUID REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS & REPORTS
-- ============================================================================

CREATE TABLE daily_booking_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),

    summary_date DATE NOT NULL,

    -- Bookings
    total_bookings INTEGER DEFAULT 0,
    new_queries INTEGER DEFAULT 0,
    quotations_sent INTEGER DEFAULT 0,

    -- Revenue
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    domestic_revenue DECIMAL(12, 2) DEFAULT 0,
    international_revenue DECIMAL(12, 2) DEFAULT 0,
    payment_collected DECIMAL(12, 2) DEFAULT 0,

    -- Travelers
    total_travelers INTEGER DEFAULT 0,

    -- Packages
    domestic_packages_sold INTEGER DEFAULT 0,
    international_packages_sold INTEGER DEFAULT 0,
    pilgrimage_packages_sold INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(agency_id, summary_date)
);

SELECT create_hypertable('daily_booking_summary', 'created_at', if_not_exists => TRUE);

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES travel_agencies(id),

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

CREATE INDEX idx_audit_logs_agency ON audit_logs(agency_id, created_at);
SELECT create_hypertable('audit_logs', 'created_at', if_not_exists => TRUE);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Today's departures
CREATE VIEW v_todays_departures AS
SELECT
    tb.booking_number,
    c.customer_code,
    c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
    c.phone,
    tp.package_name,
    tb.travel_start_date,
    tb.total_travelers,
    tb.booking_status,
    tb.payment_status,
    s.first_name || ' ' || s.last_name as tour_consultant
FROM tour_bookings tb
JOIN customers c ON tb.customer_id = c.id
JOIN tour_packages tp ON tb.package_id = tp.id
LEFT JOIN staff s ON tb.tour_consultant_id = s.id
WHERE tb.travel_start_date = CURRENT_DATE
  AND tb.booking_status NOT IN ('CANCELLED')
ORDER BY tb.travel_start_date;

-- Pending payments
CREATE VIEW v_pending_payments AS
SELECT
    tb.booking_number,
    c.customer_code,
    c.first_name || ' ' || COALESCE(c.last_name, '') as customer_name,
    c.phone,
    tp.package_name,
    tb.total_amount,
    tb.amount_paid,
    tb.balance_amount,
    tb.final_payment_due_date,
    tb.travel_start_date
FROM tour_bookings tb
JOIN customers c ON tb.customer_id = c.id
JOIN tour_packages tp ON tb.package_id = tp.id
WHERE tb.payment_status NOT IN ('FULLY_PAID', 'REFUNDED')
  AND tb.booking_status NOT IN ('CANCELLED')
ORDER BY tb.final_payment_due_date;

-- Popular packages
CREATE VIEW v_popular_packages AS
SELECT
    tp.package_code,
    tp.package_name,
    tp.package_type,
    tp.duration_days,
    tp.base_price,
    COUNT(tb.id) as total_bookings,
    AVG(tb.customer_rating) as average_rating,
    SUM(tb.total_amount) as total_revenue
FROM tour_packages tp
LEFT JOIN tour_bookings tb ON tp.id = tb.package_id AND tb.booking_status NOT IN ('CANCELLED')
WHERE tp.is_active = true
GROUP BY tp.id, tp.package_code, tp.package_name, tp.package_type, tp.duration_days, tp.base_price
ORDER BY total_bookings DESC;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update departure availability
CREATE OR REPLACE FUNCTION update_departure_availability()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE package_departures
    SET booked_seats = (
        SELECT COUNT(*)
        FROM tour_bookings
        WHERE departure_id = NEW.departure_id
          AND booking_status NOT IN ('CANCELLED')
    ),
    available_seats = total_seats - (
        SELECT COUNT(*)
        FROM tour_bookings
        WHERE departure_id = NEW.departure_id
          AND booking_status NOT IN ('CANCELLED')
    ),
    departure_status = CASE
        WHEN (total_seats - (SELECT COUNT(*) FROM tour_bookings WHERE departure_id = NEW.departure_id AND booking_status NOT IN ('CANCELLED'))) = 0
        THEN 'FULLY_BOOKED'
        WHEN (total_seats - (SELECT COUNT(*) FROM tour_bookings WHERE departure_id = NEW.departure_id AND booking_status NOT IN ('CANCELLED'))) <= 5
        THEN 'FILLING_FAST'
        ELSE 'OPEN'
    END
    WHERE id = NEW.departure_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_departure_availability
AFTER INSERT OR UPDATE ON tour_bookings
FOR EACH ROW
EXECUTE FUNCTION update_departure_availability();

-- Update booking payment status
CREATE OR REPLACE FUNCTION update_booking_payment_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tour_bookings
    SET amount_paid = (
        SELECT COALESCE(SUM(amount_paid), 0)
        FROM booking_payments
        WHERE booking_id = NEW.booking_id
    ),
    balance_amount = total_amount - (
        SELECT COALESCE(SUM(amount_paid), 0)
        FROM booking_payments
        WHERE booking_id = NEW.booking_id
    ),
    payment_status = CASE
        WHEN (total_amount - (SELECT COALESCE(SUM(amount_paid), 0) FROM booking_payments WHERE booking_id = NEW.booking_id)) = 0
        THEN 'FULLY_PAID'
        WHEN (SELECT COALESCE(SUM(amount_paid), 0) FROM booking_payments WHERE booking_id = NEW.booking_id) > 0
        THEN 'PARTIALLY_PAID'
        ELSE 'PENDING'
    END
    WHERE id = NEW.booking_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_booking_payment_status
AFTER INSERT ON booking_payments
FOR EACH ROW
EXECUTE FUNCTION update_booking_payment_status();

-- Update package booking count
CREATE OR REPLACE FUNCTION update_package_booking_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.booking_status = 'CONFIRMED' THEN
        UPDATE tour_packages
        SET total_bookings = total_bookings + 1
        WHERE id = NEW.package_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_package_booking_count
AFTER INSERT ON tour_bookings
FOR EACH ROW
EXECUTE FUNCTION update_package_booking_count();

-- Update customer statistics
CREATE OR REPLACE FUNCTION update_customer_statistics()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE customers
    SET total_bookings = COALESCE(total_bookings, 0) + 1,
        total_spent = COALESCE(total_spent, 0) + NEW.total_amount,
        last_booking_date = NEW.booking_date
    WHERE id = NEW.customer_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_statistics
AFTER INSERT ON tour_bookings
FOR EACH ROW
EXECUTE FUNCTION update_customer_statistics();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tour_bookings_updated_at BEFORE UPDATE ON tour_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_tour_packages_destinations ON tour_packages USING gin(destinations_covered);
CREATE INDEX idx_tour_bookings_consultant ON tour_bookings(tour_consultant_id);
CREATE INDEX idx_quotations_valid_till ON quotations(valid_till);
CREATE INDEX idx_visa_applications_appointment ON visa_applications(appointment_date);

-- Text search
CREATE INDEX idx_customers_name_search ON customers USING gin(to_tsvector('english', COALESCE(first_name, '') || ' ' || COALESCE(last_name, '') || ' ' || COALESCE(company_name, '')));
CREATE INDEX idx_tour_packages_name_search ON tour_packages USING gin(to_tsvector('english', package_name || ' ' || COALESCE(package_tagline, '')));
CREATE INDEX idx_destinations_name_search ON destinations USING gin(to_tsvector('english', destination_name));

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE tour_packages IS 'Complete tour packages with itinerary, pricing, and departure dates';
COMMENT ON TABLE tour_bookings IS 'Tour booking management with traveler details and payment tracking';
COMMENT ON TABLE visa_applications IS 'Visa assistance tracking from application to approval';
COMMENT ON TABLE transport_vehicles IS 'Own fleet management with GPS tracking and maintenance';
COMMENT ON TABLE quotations IS 'Custom quotations with detailed pricing breakdown';
COMMENT ON TABLE hotel_inventory IS 'Supplier hotel inventory with rates and commission';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
