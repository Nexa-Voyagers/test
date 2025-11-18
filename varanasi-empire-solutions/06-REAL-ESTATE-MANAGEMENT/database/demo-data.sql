-- ============================================================================
-- REAL ESTATE MANAGEMENT SYSTEM - COMPREHENSIVE DEMO DATA
-- Version: 1.0.0
-- ============================================================================
-- UP RERA compliant real estate demo data with property listings, deals, etc.
-- ============================================================================

-- ============================================================================
-- REAL ESTATE AGENCIES
-- ============================================================================

INSERT INTO agencies (
    agency_name, rera_registration_number, pan_number, gstin,
    head_office_address, contact_email, contact_phone, website, is_active
) VALUES
(
    'Vaishnavi Estates Pvt Ltd',
    'UP-RERA-2020-001',
    demo_helpers.generate_pan_number(),
    demo_helpers.generate_gst_number(),
    '123 Godowlia, Varanasi, Uttar Pradesh 221001',
    'contact@vaishnaviestates.com',
    demo_helpers.generate_phone_number(),
    'www.vaishnaviestates.com',
    TRUE
),
(
    'Ramayana Properties Lucknow',
    'UP-RERA-2018-002',
    demo_helpers.generate_pan_number(),
    demo_helpers.generate_gst_number(),
    '456 Hazratganj, Lucknow, Uttar Pradesh 226001',
    'info@ramayanaprop.com',
    demo_helpers.generate_phone_number(),
    'www.ramayanaprop.com',
    TRUE
),
(
    'Ashoka Realtors Prayagraj',
    'UP-RERA-2019-003',
    demo_helpers.generate_pan_number(),
    demo_helpers.generate_gst_number(),
    '789 Civil Lines, Prayagraj, Uttar Pradesh 211001',
    'admin@ashokareal.com',
    demo_helpers.generate_phone_number(),
    'www.ashokareal.com',
    TRUE
);

-- ============================================================================
-- AGENTS
-- ============================================================================

INSERT INTO agents (
    agency_id, agent_code, first_name, last_name, phone, email,
    rera_agent_id, commission_percentage, is_active
)
SELECT
    id,
    'AG-' || LPAD(ROW_NUMBER() OVER (PARTITION BY id ORDER BY RANDOM())::TEXT, 4, '0'),
    demo_helpers.get_random_male_name(),
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    'RA-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
    FLOOR(1 + RANDOM() * 3)::DECIMAL(5, 2),
    TRUE
FROM agencies
CROSS JOIN GENERATE_SERIES(1, 5);

-- ============================================================================
-- PROPERTY OWNERS
-- ============================================================================

INSERT INTO property_owners (
    owner_code, owner_type, first_name, last_name, phone, email,
    aadhar_number, pan_number, city, state, is_active
)
SELECT
    'OWN-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 5, '0'),
    (ARRAY['INDIVIDUAL', 'BUILDER', 'DEVELOPER'])[FLOOR(RANDOM() * 3 + 1)::INT],
    demo_helpers.get_random_male_name(),
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    demo_helpers.generate_aadhaar_number(),
    demo_helpers.generate_pan_number(),
    (ARRAY['Varanasi', 'Lucknow', 'Agra', 'Kanpur', 'Prayagraj'])[FLOOR(RANDOM() * 5 + 1)::INT],
    'Uttar Pradesh',
    TRUE
FROM GENERATE_SERIES(1, 15);

-- ============================================================================
-- PROPERTIES (30+ listings across multiple cities)
-- ============================================================================

INSERT INTO properties (
    agency_id, owner_id, listing_agent_id, property_code, property_type,
    property_subtype, transaction_type, property_title, address_line1,
    locality, city, district, pincode, location,
    carpet_area_sqft, bedrooms, bathrooms, floor_number, total_floors,
    facing_direction, furnishing_status, possession_status,
    expected_price, price_per_sqft, negotiable,
    amenities, rera_approved, ownership_type,
    listing_date, is_featured, is_verified,
    property_status, total_views, total_enquiries, is_active
)
SELECT
    a.id,
    po.id,
    (SELECT id FROM agents ag WHERE ag.agency_id = a.id ORDER BY RANDOM() LIMIT 1),
    'PROP-' || LPAD(ROW_NUMBER() OVER (PARTITION BY a.id ORDER BY RANDOM())::TEXT, 5, '0'),
    (ARRAY['RESIDENTIAL', 'COMMERCIAL'])[FLOOR(RANDOM() * 2 + 1)::INT],
    (ARRAY['APARTMENT', 'VILLA', 'OFFICE', 'SHOP'])[FLOOR(RANDOM() * 4 + 1)::INT],
    (ARRAY['SALE', 'RENT'])[FLOOR(RANDOM() * 2 + 1)::INT],
    (CASE WHEN RANDOM() > 0.5 THEN '2 BHK Apartment' ELSE '3 BHK Villa' END) || ' in ' || a.agency_name,
    FLOOR(100 + RANDOM() * 900)::TEXT || ' ' || 'Maidagin Road',
    (ARRAY['Godowlia', 'Assi Ghat', 'Sigra', 'Lanka', 'Jaitpura'])[FLOOR(RANDOM() * 5 + 1)::INT],
    (ARRAY['Varanasi', 'Lucknow', 'Agra'])[FLOOR(RANDOM() * 3 + 1)::INT],
    (ARRAY['Varanasi', 'Lucknow', 'Agra'])[FLOOR(RANDOM() * 3 + 1)::INT],
    (ARRAY['221001', '226001', '282001'])[FLOOR(RANDOM() * 3 + 1)::INT],
    CASE
        WHEN a.agency_name LIKE '%Vaishnavi%' THEN ST_GeomFromText('POINT(82.9789 25.3209)')
        WHEN a.agency_name LIKE '%Ramayana%' THEN ST_GeomFromText('POINT(80.9462 26.8467)')
        ELSE ST_GeomFromText('POINT(81.8463 25.4358)')
    END,
    FLOOR(800 + RANDOM() * 3200)::DECIMAL(10, 2),
    FLOOR(2 + RANDOM() * 3)::INT,
    FLOOR(1 + RANDOM() * 3)::INT,
    FLOOR(RANDOM() * 15)::INT,
    FLOOR(5 + RANDOM() * 25)::INT,
    (ARRAY['NORTH', 'SOUTH', 'EAST', 'WEST'])[FLOOR(RANDOM() * 4 + 1)::INT],
    (ARRAY['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED'])[FLOOR(RANDOM() * 3 + 1)::INT],
    (ARRAY['READY_TO_MOVE', 'UNDER_CONSTRUCTION'])[FLOOR(RANDOM() * 2 + 1)::INT],
    FLOOR(3000000 + RANDOM() * 10000000)::DECIMAL(15, 2),
    FLOOR(3000 + RANDOM() * 7000)::DECIMAL(10, 2),
    TRUE,
    ARRAY['PARKING', 'LIFT', 'SECURITY', 'POWER_BACKUP', 'WATER_SUPPLY'],
    TRUE,
    'FREEHOLD',
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 90)::INT),
    RANDOM() > 0.7,
    TRUE,
    'AVAILABLE',
    FLOOR(100 + RANDOM() * 1000)::INT,
    FLOOR(10 + RANDOM() * 50)::INT,
    TRUE
FROM agencies a
CROSS JOIN property_owners po
WHERE po.city = a.agency_name LIKE '%Varanasi%' OR po.city LIKE '%Lucknow%'
LIMIT 35;

-- ============================================================================
-- CUSTOMERS (BUYERS/RENTERS)
-- ============================================================================

INSERT INTO customers (
    customer_code, first_name, last_name, phone, email,
    looking_for, property_type_preference, budget_min, budget_max,
    preferred_locations, financing_required, bank_name,
    assigned_agent_id, customer_source, is_active
)
SELECT
    'CUST-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 5, '0'),
    demo_helpers.get_random_male_name(),
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    (ARRAY['BUY', 'RENT'])[FLOOR(RANDOM() * 2 + 1)::INT],
    ARRAY[(ARRAY['RESIDENTIAL', 'COMMERCIAL'])[FLOOR(RANDOM() * 2 + 1)::INT]],
    FLOOR(2000000 + RANDOM() * 5000000)::DECIMAL(15, 2),
    FLOOR(5000000 + RANDOM() * 15000000)::DECIMAL(15, 2),
    ARRAY['Varanasi', 'Lucknow', 'Agra'],
    RANDOM() > 0.4,
    (ARRAY['SBI', 'HDFC', 'ICICI', 'Axis Bank'])[FLOOR(RANDOM() * 4 + 1)::INT],
    (SELECT id FROM agents ORDER BY RANDOM() LIMIT 1),
    (ARRAY['WALK_IN', 'ONLINE', 'WEBSITE', 'REFERRAL'])[FLOOR(RANDOM() * 4 + 1)::INT],
    TRUE
FROM GENERATE_SERIES(1, 25);

-- ============================================================================
-- ENQUIRIES
-- ============================================================================

INSERT INTO enquiries (
    property_id, customer_id, enquiry_number, enquiry_date,
    customer_name, customer_phone, customer_email, enquiry_message,
    assigned_to_agent_id, enquiry_status, follow_up_count, is_active
)
SELECT
    p.id,
    c.id,
    'ENQ-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 45)::INT),
    c.first_name || ' ' || c.last_name,
    c.phone,
    c.email,
    'Interested in property details and site visit',
    c.assigned_agent_id,
    (ARRAY['NEW', 'CONTACTED', 'INTERESTED', 'NOT_INTERESTED'])[FLOOR(RANDOM() * 4 + 1)::INT],
    FLOOR(RANDOM() * 3)::INT,
    TRUE
FROM properties p
CROSS JOIN customers c
WHERE ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY RANDOM()) <= 2;

-- ============================================================================
-- SITE VISITS
-- ============================================================================

INSERT INTO site_visits (
    property_id, customer_id, visit_number, scheduled_date,
    scheduled_time, accompanied_by_agent_id, visit_status,
    customer_feedback, customer_interest_level, is_active
)
SELECT
    p.id,
    c.id,
    'VISIT-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 5, '0'),
    CURRENT_DATE + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)::INT),
    (CASE
        WHEN RANDOM() > 0.6 THEN '10:00'::TIME
        WHEN RANDOM() > 0.3 THEN '14:00'::TIME
        ELSE '17:00'::TIME
    END),
    (SELECT id FROM agents WHERE agency_id = p.agency_id ORDER BY RANDOM() LIMIT 1),
    (ARRAY['SCHEDULED', 'COMPLETED', 'CANCELLED'])[FLOOR(RANDOM() * 3 + 1)::INT],
    'Good property, needs consideration',
    (ARRAY['VERY_INTERESTED', 'INTERESTED', 'NEUTRAL', 'NOT_INTERESTED'])[FLOOR(RANDOM() * 4 + 1)::INT],
    TRUE
FROM properties p
CROSS JOIN customers c
WHERE ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY RANDOM()) <= 2;

-- ============================================================================
-- DEALS (Completed transactions)
-- ============================================================================

INSERT INTO deals (
    agency_id, property_id, seller_id, buyer_id,
    deal_number, deal_date, deal_type,
    agreed_price, token_amount, advance_amount,
    commission_percentage, commission_amount,
    listing_agent_id, deal_status, is_active
)
SELECT
    p.agency_id,
    p.id,
    p.owner_id,
    c.id,
    'DEAL-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 120)::INT),
    p.transaction_type,
    FLOOR(p.expected_price * (0.8 + RANDOM() * 0.2))::DECIMAL(15, 2),
    FLOOR(p.expected_price * (0.05 + RANDOM() * 0.05))::DECIMAL(10, 2),
    FLOOR(p.expected_price * (0.10 + RANDOM() * 0.15))::DECIMAL(10, 2),
    FLOOR(RANDOM() * 3 + 1)::DECIMAL(5, 2),
    FLOOR(p.expected_price * (0.01 + RANDOM() * 0.03))::DECIMAL(10, 2),
    p.listing_agent_id,
    (ARRAY['AGREEMENT_PENDING', 'AGREEMENT_SIGNED', 'DOCUMENTATION', 'COMPLETED'])[FLOOR(RANDOM() * 4 + 1)::INT],
    TRUE
FROM properties p
CROSS JOIN customers c
WHERE p.transaction_type = 'SALE'
  AND ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) = 1
LIMIT 15;

-- ============================================================================
-- COMMISSION PAYMENTS
-- ============================================================================

INSERT INTO commission_payments (
    deal_id, agent_id, payment_date, commission_amount,
    payment_mode, transaction_id, paid_by, is_active
)
SELECT
    d.id,
    d.listing_agent_id,
    d.deal_date + (INTERVAL '1 day' * FLOOR(RANDOM() * 60)::INT),
    d.commission_amount,
    (ARRAY['CASH', 'CHEQUE', 'BANK_TRANSFER'])[FLOOR(RANDOM() * 3 + 1)::INT],
    'TXN-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
    d.listing_agent_id,
    TRUE
FROM deals d
WHERE ROW_NUMBER() OVER (PARTITION BY d.id ORDER BY RANDOM()) = 1;

-- ============================================================================
-- DAILY PROPERTY SUMMARY
-- ============================================================================

INSERT INTO daily_property_summary (
    agency_id, summary_date,
    new_listings, total_enquiries, site_visits, deals_closed,
    total_deal_value, total_commission
)
SELECT
    a.id,
    CURRENT_DATE - (INTERVAL '1 day' * days.day),
    FLOOR(RANDOM() * 5)::INT,
    FLOOR(RANDOM() * 15)::INT,
    FLOOR(RANDOM() * 10)::INT,
    FLOOR(RANDOM() * 3)::INT,
    FLOOR(RANDOM() * 50000000)::DECIMAL(15, 2),
    FLOOR(RANDOM() * 500000)::DECIMAL(12, 2)
FROM agencies a
CROSS JOIN (SELECT GENERATE_SERIES(0, 90) AS day) days;

-- ============================================================================
-- AUDIT LOGS (Sample entries)
-- ============================================================================

INSERT INTO audit_logs (
    agency_id, user_id, action_type, entity_type, entity_id,
    action_description, created_at
)
SELECT
    p.agency_id,
    NULL,
    'CREATE',
    'PROPERTY',
    p.id,
    'Property ' || p.property_code || ' created',
    p.created_at
FROM properties p
CROSS JOIN GENERATE_SERIES(1, 1);

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT
    (SELECT COUNT(*) FROM agencies) as "Total Agencies",
    (SELECT COUNT(*) FROM agents) as "Total Agents",
    (SELECT COUNT(*) FROM properties) as "Total Properties",
    (SELECT COUNT(*) FROM customers) as "Total Customers",
    (SELECT COUNT(*) FROM enquiries) as "Total Enquiries",
    (SELECT COUNT(*) FROM site_visits) as "Site Visits",
    (SELECT COUNT(*) FROM deals) as "Completed Deals",
    (SELECT SUM(agreed_price) FROM deals) as "Total Deal Value",
    (SELECT SUM(total_commission) FROM daily_property_summary) as "Total Commission Earned"
    AS "Real Estate Management Demo Data Summary";
