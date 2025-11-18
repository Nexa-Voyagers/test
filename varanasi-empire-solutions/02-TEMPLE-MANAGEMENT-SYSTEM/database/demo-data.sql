-- ============================================================================
-- TEMPLE MANAGEMENT SYSTEM - COMPREHENSIVE DEMO DATA
-- Version: 1.0.0
-- ============================================================================
-- This script generates realistic demo data for the Temple Management System
-- with complete workflows for darshan bookings, pooja services, donations, etc.
-- ============================================================================

-- Ensure helper functions are available
CREATE SCHEMA IF NOT EXISTS demo_helpers;

-- ============================================================================
-- TEMPLE TRUSTS (Enterprise Level)
-- ============================================================================

INSERT INTO temple_trusts (
    trust_name, trust_legal_name, registration_number, registration_year,
    trust_deed_number, trust_type, pan_number, gstin, contact_email, contact_phone,
    head_office_address, chairman_name, secretary_name, website, is_active
) VALUES
(
    'Kashi Shiva Trust', 'Kashi Shiva Puja Samiti', 'REG-2010-001', 2010,
    'DEED-2010-VP-001', 'RELIGIOUS_TRUST', demo_helpers.generate_pan_number(), demo_helpers.generate_gst_number(),
    'info@kashishiva.org', demo_helpers.generate_phone_number(),
    '123 Maidagin Lane, Varanasi, Uttar Pradesh 221001',
    'Pandit Rajesh Sharma', 'Swami Anand Nath',
    'www.kashishiva.org', TRUE
),
(
    'Sankat Mochan Foundation', 'Sankat Mochan Hanuman Temple Trust', 'REG-2005-002', 2005,
    'DEED-2005-HP-001', 'RELIGIOUS_TRUST', demo_helpers.generate_pan_number(), demo_helpers.generate_gst_number(),
    'contact@sankatmochan.org', demo_helpers.generate_phone_number(),
    '456 Assi Ghat, Varanasi, Uttar Pradesh 221001',
    'Padma Bhushan Keshav Prasad', 'Dr. Vinay Prasad',
    'www.sankatmochan.org', TRUE
),
(
    'Prayagraj Confluence Trust', 'Triveni Confluence Temple Management', 'REG-2008-003', 2008,
    'DEED-2008-AP-001', 'CHARITABLE_TRUST', demo_helpers.generate_pan_number(), demo_helpers.generate_gst_number(),
    'admin@prayagrajtemple.org', demo_helpers.generate_phone_number(),
    '789 Allahabad Road, Prayagraj, Uttar Pradesh 211001',
    'Dr. Ashok Kumar Singh', 'Prof. Meera Gupta',
    'www.prayagrajtemple.org', TRUE
);

-- ============================================================================
-- TEMPLES (Multiple in each trust for realistic data)
-- ============================================================================

WITH trust_data AS (
    SELECT id FROM temple_trusts WHERE trust_name = 'Kashi Shiva Trust'
)
INSERT INTO temples (
    trust_id, temple_name, temple_code, temple_type, deity_type,
    address, city, district, pincode, location,
    morning_opening_time, morning_closing_time, evening_opening_time, evening_closing_time,
    daily_darshan_capacity, services_offered, has_prasad_counter,
    has_donation_counter, has_accommodation, online_darshan_booking,
    online_donation_enabled, head_priest_name, temple_phone, temple_email,
    is_active
) VALUES
(
    (SELECT id FROM trust_data), 'Kashi Vishwanath Temple', 'KVT-001', 'MAIN_TEMPLE', 'SHIVA',
    '123 Maidagin, Gali Kashi Vishwanath, Varanasi', 'Varanasi', 'Varanasi', '221001',
    ST_GeomFromText('POINT(82.9789 25.3209)'),
    '05:00'::TIME, '12:00'::TIME, '16:00'::TIME, '21:00'::TIME,
    5000, ARRAY['DARSHAN', 'POOJA', 'ABHISHEK', 'AARTI', 'PRASAD'],
    TRUE, TRUE, FALSE, TRUE, TRUE,
    'Pandit Rajesh Sharma', demo_helpers.generate_phone_number(), 'info@kashishiva.org',
    TRUE
),
(
    (SELECT id FROM trust_data), 'Annapurna Temple', 'APT-002', 'ATTACHED_SHRINE', 'DEVI',
    '456 Vishwanath Gali, Varanasi', 'Varanasi', 'Varanasi', '221001',
    ST_GeomFromText('POINT(82.9795 25.3215)'),
    '06:00'::TIME, '12:30'::TIME, '16:30'::TIME, '21:30'::TIME,
    2000, ARRAY['DARSHAN', 'POOJA', 'PRASAD', 'ANNADAAN'],
    TRUE, TRUE, FALSE, TRUE, TRUE,
    'Pandit Vikram Singh', demo_helpers.generate_phone_number(), 'annapurna@kashishiva.org',
    TRUE
);

WITH trust_data AS (
    SELECT id FROM temple_trusts WHERE trust_name = 'Sankat Mochan Foundation'
)
INSERT INTO temples (
    trust_id, temple_name, temple_code, temple_type, deity_type,
    address, city, district, pincode, location,
    morning_opening_time, morning_closing_time, evening_opening_time, evening_closing_time,
    daily_darshan_capacity, services_offered, has_prasad_counter,
    has_donation_counter, has_accommodation, online_darshan_booking,
    online_donation_enabled, head_priest_name, temple_phone, temple_email,
    is_active
) VALUES
(
    (SELECT id FROM trust_data), 'Sankat Mochan Hanuman Temple', 'SMT-001', 'MAIN_TEMPLE', 'HANUMAN',
    '456 Assi Ghat, Varanasi', 'Varanasi', 'Varanasi', '221005',
    ST_GeomFromText('POINT(82.9920 25.3055)'),
    '06:00'::TIME, '12:00'::TIME, '17:00'::TIME, '21:00'::TIME,
    3000, ARRAY['DARSHAN', 'POOJA', 'ABHISHEK', 'PRASAD'],
    TRUE, TRUE, FALSE, TRUE, TRUE,
    'Swami Anand Nath', demo_helpers.generate_phone_number(), 'contact@sankatmochan.org',
    TRUE
);

WITH trust_data AS (
    SELECT id FROM temple_trusts WHERE trust_name = 'Prayagraj Confluence Trust'
)
INSERT INTO temples (
    trust_id, temple_name, temple_code, temple_type, deity_type,
    address, city, district, pincode, location,
    morning_opening_time, morning_closing_time, evening_opening_time, evening_closing_time,
    daily_darshan_capacity, services_offered, has_prasad_counter,
    has_donation_counter, has_accommodation, online_darshan_booking,
    online_donation_enabled, head_priest_name, temple_phone, temple_email,
    is_active
) VALUES
(
    (SELECT id FROM trust_data), 'Triveni Temple Prayagraj', 'TTP-001', 'MAIN_TEMPLE', 'VISHNU',
    '789 Allahabad Road, Prayagraj', 'Prayagraj', 'Prayagraj', '211001',
    ST_GeomFromText('POINT(81.8463 25.4358)'),
    '05:30'::TIME, '12:30'::TIME, '16:00'::TIME, '20:30'::TIME,
    4000, ARRAY['DARSHAN', 'POOJA', 'ABHISHEK', 'AARTI', 'PRASAD', 'ACCOMMODATION'],
    TRUE, TRUE, TRUE, TRUE, TRUE,
    'Prof. Arun Mishra', demo_helpers.generate_phone_number(), 'admin@prayagrajtemple.org',
    TRUE
);

-- ============================================================================
-- DEITIES (Associated with temples)
-- ============================================================================

INSERT INTO deities (
    temple_id, deity_name, deity_type, deity_form, shrine_location,
    daily_pooja_times, special_days, is_active
)
SELECT
    id, 'Kashi Vishwanath', 'MAIN', 'SHIVA_LINGA', 'GARBHAGRIHA',
    ARRAY['05:00'::TIME, '08:00'::TIME, '12:00'::TIME, '17:00'::TIME, '21:00'::TIME],
    ARRAY['MONDAY', 'SHIVRATRI', 'SAWAN_SOMVAR'],
    TRUE
FROM temples WHERE temple_code = 'KVT-001'
UNION ALL
SELECT
    id, 'Maa Annapurna', 'MAIN', 'DEVI_MURTI', 'GARBHAGRIHA',
    ARRAY['06:00'::TIME, '12:00'::TIME, '18:00'::TIME],
    ARRAY['NAVRATRI', 'DUSSEHRA'],
    TRUE
FROM temples WHERE temple_code = 'APT-002'
UNION ALL
SELECT
    id, 'Hanuman', 'MAIN', 'HANUMAN_IDOL', 'GARBHAGRIHA',
    ARRAY['06:00'::TIME, '10:00'::TIME, '17:00'::TIME, '21:00'::TIME],
    ARRAY['TUESDAY', 'SATURDAY', 'HANUMAN_JAYANTI'],
    TRUE
FROM temples WHERE temple_code = 'SMT-001'
UNION ALL
SELECT
    id, 'Triveni Confluence', 'MAIN', 'SHIVA_LINGA', 'GARBHAGRIHA',
    ARRAY['05:30'::TIME, '08:30'::TIME, '12:00'::TIME, '17:00'::TIME, '20:30'::TIME],
    ARRAY['MAKAR_SANKRANTI', 'PRAYAGRAJ_KUMBH'],
    TRUE
FROM temples WHERE temple_code = 'TTP-001';

-- ============================================================================
-- DEVOTEES (50+ records across temples)
-- ============================================================================

INSERT INTO devotees (
    temple_id, devotee_code, first_name, last_name, gender,
    date_of_birth, phone, email, address, city, district, pincode,
    devotee_category, is_active
)
SELECT
    t.id,
    'DEV-' || t.temple_code || '-' || LPAD((ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY RANDOM()))::TEXT, 4, '0'),
    demo_helpers.get_random_male_name() || ' ' || (CASE WHEN RANDOM() > 0.7 THEN demo_helpers.get_random_male_name() ELSE '' END),
    demo_helpers.get_random_female_name(),
    (CASE WHEN RANDOM() > 0.5 THEN 'MALE' ELSE 'FEMALE' END),
    CURRENT_DATE - (INTERVAL '1 day' * (FLOOR(18 + RANDOM() * 60)::INT * 365)),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    demo_helpers.generate_address(t.city),
    t.city, t.district, demo_helpers.generate_pincode(t.city),
    (ARRAY['REGULAR', 'VIP', 'LIFETIME_MEMBER', 'PATRON'])[FLOOR(RANDOM() * 4 + 1)::INT],
    TRUE
FROM temples t
CROSS JOIN LATERAL (SELECT * FROM (SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
    UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13) x) nums;

-- ============================================================================
-- DARSHAN TYPES (Free, VIP, etc.)
-- ============================================================================

INSERT INTO darshan_types (
    temple_id, darshan_name, darshan_type, slots_per_day, devotees_per_slot,
    ticket_price, advance_booking_days, skip_queue, priority_level, is_active
)
SELECT
    id,
    'General Darshan',
    'GENERAL',
    8, 50, 0, 7, FALSE, 1, TRUE
FROM temples
UNION ALL
SELECT
    id,
    'VIP Darshan',
    'VIP',
    4, 20, 251, 7, TRUE, 2, TRUE
FROM temples
UNION ALL
SELECT
    id,
    'Senior Citizen Darshan',
    'SENIOR_CITIZEN',
    2, 30, 51, 7, TRUE, 2, TRUE
FROM temples
UNION ALL
SELECT
    id,
    'Special Darshan (Festival)',
    'SPECIAL',
    6, 100, 501, 14, TRUE, 3, TRUE
FROM temples;

-- ============================================================================
-- DARSHAN SLOTS (For next 30 days)
-- ============================================================================

INSERT INTO darshan_slots (
    temple_id, darshan_type_id, slot_date, slot_time,
    total_capacity, available_count, slot_status
)
SELECT
    dt.temple_id,
    dt.id,
    CURRENT_DATE + (INTERVAL '1 day' * (days.day)),
    (CASE
        WHEN times.time_slot = 1 THEN '06:00'::TIME
        WHEN times.time_slot = 2 THEN '08:00'::TIME
        WHEN times.time_slot = 3 THEN '10:00'::TIME
        WHEN times.time_slot = 4 THEN '12:00'::TIME
        WHEN times.time_slot = 5 THEN '14:00'::TIME
        WHEN times.time_slot = 6 THEN '16:00'::TIME
        WHEN times.time_slot = 7 THEN '18:00'::TIME
        ELSE '20:00'::TIME
    END),
    dt.devotees_per_slot,
    dt.devotees_per_slot,
    'OPEN'
FROM darshan_types dt
CROSS JOIN (SELECT GENERATE_SERIES(0, 29) AS day) days
CROSS JOIN (SELECT GENERATE_SERIES(1, 8) AS time_slot) times
WHERE dt.darshan_type = 'GENERAL';

-- ============================================================================
-- POOJA SERVICES (With pricing)
-- ============================================================================

INSERT INTO pooja_services (
    temple_id, deity_id, pooja_name, pooja_type,
    duration_minutes, max_devotees_allowed, base_price,
    online_booking_enabled, advance_booking_days, slots_per_day, is_active
)
SELECT
    d.temple_id,
    d.id,
    CASE
        WHEN RANDOM() > 0.6 THEN 'Rudrabhishek'
        WHEN RANDOM() > 0.3 THEN 'Satyanarayan Katha'
        ELSE 'Abhishek Pooja'
    END,
    CASE
        WHEN RANDOM() > 0.6 THEN 'RUDRABHISHEK'
        WHEN RANDOM() > 0.3 THEN 'SATYANARAYAN_KATHA'
        ELSE 'ABHISHEK'
    END,
    CASE WHEN RANDOM() > 0.5 THEN 60 ELSE 90 END,
    CASE WHEN RANDOM() > 0.5 THEN 5 ELSE 10 END,
    CASE WHEN RANDOM() > 0.6 THEN 1001 WHEN RANDOM() > 0.3 THEN 2101 ELSE 5001 END,
    TRUE, 30, 5, TRUE
FROM deities d
WHERE d.deity_type = 'MAIN'
LIMIT 30;

-- ============================================================================
-- DARSHAN BOOKINGS (30+ records)
-- ============================================================================

INSERT INTO darshan_bookings (
    temple_id, devotee_id, darshan_type_id, slot_id,
    booking_number, darshan_date, slot_time,
    total_devotees, adult_count, booking_type,
    ticket_price, total_amount, payment_status, booking_status, is_active
)
SELECT
    dev.temple_id,
    dev.id,
    dt.id,
    ds.id,
    'DB-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    ds.slot_date,
    ds.slot_time,
    FLOOR(1 + RANDOM() * 4)::INT,
    FLOOR(1 + RANDOM() * 4)::INT,
    (ARRAY['ONLINE', 'COUNTER', 'PHONE'])[FLOOR(RANDOM() * 3 + 1)::INT],
    dt.ticket_price,
    (dt.ticket_price * FLOOR(1 + RANDOM() * 4)),
    'PAID',
    'CONFIRMED',
    TRUE
FROM devotees dev
CROSS JOIN LATERAL (
    SELECT dt.* FROM darshan_types dt
    WHERE dt.temple_id = dev.temple_id
    ORDER BY RANDOM() LIMIT 1
) dt
CROSS JOIN LATERAL (
    SELECT ds.* FROM darshan_slots ds
    WHERE ds.temple_id = dev.temple_id
      AND ds.darshan_type_id = dt.id
      AND ds.slot_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      AND ds.available_count > 0
    ORDER BY RANDOM() LIMIT 1
) ds
WHERE ROW_NUMBER() OVER (PARTITION BY dev.id ORDER BY RANDOM()) <= 2;

-- ============================================================================
-- POOJA BOOKINGS (20+ records)
-- ============================================================================

INSERT INTO pooja_bookings (
    temple_id, devotee_id, pooja_service_id,
    booking_number, pooja_date, pooja_time,
    devotee_name, devotee_gotra, pooja_purpose,
    pooja_price, total_amount, payment_status, pooja_status, is_active
)
SELECT
    ps.temple_id,
    dev.id,
    ps.id,
    'PB-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    CURRENT_DATE + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)::INT),
    (CASE
        WHEN RANDOM() > 0.7 THEN '06:00'::TIME
        WHEN RANDOM() > 0.4 THEN '10:00'::TIME
        ELSE '17:00'::TIME
    END),
    dev.first_name || ' ' || dev.last_name,
    'Bharadwaj',
    (ARRAY['HEALTH', 'PROSPERITY', 'EDUCATION', 'MARRIAGE', 'LONGEVITY'])[FLOOR(RANDOM() * 5 + 1)::INT],
    ps.base_price,
    ps.base_price + FLOOR(RANDOM() * 1000),
    'PAID',
    (ARRAY['BOOKED', 'COMPLETED'])[FLOOR(RANDOM() * 2 + 1)::INT],
    TRUE
FROM devotees dev
CROSS JOIN LATERAL (
    SELECT ps.* FROM pooja_services ps
    WHERE ps.temple_id = dev.temple_id
    ORDER BY RANDOM() LIMIT 1
) ps
WHERE ROW_NUMBER() OVER (PARTITION BY dev.id ORDER BY RANDOM()) <= 2;

-- ============================================================================
-- DONATION CATEGORIES
-- ============================================================================

INSERT INTO donation_categories (
    temple_id, category_name, category_code, donation_purpose,
    suggested_amounts, minimum_amount, is_80g_eligible, is_active
)
SELECT
    t.id,
    'General Donation',
    'GENERAL',
    'GENERAL',
    ARRAY[101.00, 251.00, 501.00, 1001.00, 2101.00],
    1.00,
    TRUE,
    TRUE
FROM temples t
UNION ALL
SELECT
    t.id,
    'Annadaan (Food Service)',
    'ANNADAAN',
    'ANNADAAN',
    ARRAY[501.00, 1001.00, 2101.00, 5001.00],
    100.00,
    TRUE,
    TRUE
FROM temples t
UNION ALL
SELECT
    t.id,
    'Temple Maintenance',
    'MAINTENANCE',
    'CONSTRUCTION',
    ARRAY[2101.00, 5001.00, 10001.00, 25001.00],
    1000.00,
    TRUE,
    TRUE
FROM temples t;

-- ============================================================================
-- DONATIONS (Multiple records across temples)
-- ============================================================================

INSERT INTO donations (
    temple_id, devotee_id, category_id,
    receipt_number, donation_date, donor_name, donor_phone,
    donation_type, donation_amount, payment_mode,
    donation_purpose, is_anonymous, is_active
)
SELECT
    dev.temple_id,
    dev.id,
    (SELECT id FROM donation_categories dc
     WHERE dc.temple_id = dev.temple_id
     ORDER BY RANDOM() LIMIT 1),
    'RCP-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 60)::INT),
    dev.first_name || ' ' || dev.last_name,
    dev.phone,
    (ARRAY['CASH', 'ONLINE', 'UPI', 'CARD'])[FLOOR(RANDOM() * 4 + 1)::INT],
    (ARRAY[101, 251, 501, 1001, 2101, 5001])[FLOOR(RANDOM() * 6 + 1)::INT]::DECIMAL,
    (ARRAY['CASH', 'ONLINE', 'UPI', 'CARD'])[FLOOR(RANDOM() * 4 + 1)::INT],
    'GENERAL',
    RANDOM() > 0.9,
    TRUE
FROM devotees dev
WHERE ROW_NUMBER() OVER (PARTITION BY dev.temple_id ORDER BY RANDOM()) <= 15;

-- ============================================================================
-- HUNDI BOXES (Collection boxes at different locations)
-- ============================================================================

INSERT INTO hundi_boxes (
    temple_id, hundi_code, hundi_name, hundi_location,
    hundi_type, is_active
)
SELECT
    t.id,
    'HB-' || t.temple_code || '-001',
    'Main Hundi',
    'SANCTUM',
    'GENERAL',
    TRUE
FROM temples t
UNION ALL
SELECT
    t.id,
    'HB-' || t.temple_code || '-002',
    'Annadaan Fund',
    'MAIN_GATE',
    'SPECIAL_PURPOSE',
    TRUE
FROM temples t
WHERE t.temple_type = 'MAIN_TEMPLE';

-- ============================================================================
-- PRASAD ITEMS (With inventory)
-- ============================================================================

INSERT INTO prasad_items (
    temple_id, prasad_name, prasad_type, ingredients,
    price, daily_preparation_quantity, current_stock, min_stock_level,
    online_ordering_enabled, is_active
)
SELECT
    t.id,
    (ARRAY['Kaju Ladoo', 'Peda', 'Khir', 'Charanamrit', 'Tulsi'])[FLOOR(RANDOM() * 5 + 1)::INT],
    (ARRAY['LADOO', 'PEDA', 'KHIR', 'CHARANAMRIT', 'TULSI'])[FLOOR(RANDOM() * 5 + 1)::INT],
    ARRAY['Kaju', 'Sugar', 'Ghee', 'Cardamom'],
    CASE WHEN RANDOM() > 0.5 THEN 51 ELSE 101 END,
    CASE WHEN RANDOM() > 0.5 THEN 500 ELSE 1000 END,
    FLOOR(100 + RANDOM() * 400)::INT,
    50,
    TRUE,
    TRUE
FROM temples t
CROSS JOIN GENERATE_SERIES(1, 3);

-- ============================================================================
-- PRASAD ORDERS (Online orders)
-- ============================================================================

INSERT INTO prasad_orders (
    temple_id, devotee_id, order_number, order_type,
    subtotal, total_amount, payment_status, order_status, is_active
)
SELECT
    dev.temple_id,
    dev.id,
    'PO-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    'ONLINE',
    FLOOR(100 + RANDOM() * 500),
    FLOOR(100 + RANDOM() * 500) + FLOOR(RANDOM() * 100),
    'PAID',
    (ARRAY['PLACED', 'PREPARED', 'DISPATCHED', 'DELIVERED'])[FLOOR(RANDOM() * 4 + 1)::INT],
    TRUE
FROM devotees dev
WHERE ROW_NUMBER() OVER (PARTITION BY dev.temple_id ORDER BY RANDOM()) <= 8;

-- ============================================================================
-- PRIESTS (Temple staff)
-- ============================================================================

INSERT INTO priests (
    temple_id, priest_code, first_name, last_name, phone, email,
    designation, date_of_joining, employment_type,
    monthly_salary, years_of_experience, is_active
)
SELECT
    t.id,
    'PRIEST-' || t.temple_code || '-' || LPAD(ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY RANDOM())::TEXT, 3, '0'),
    demo_helpers.get_random_male_name(),
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    (ARRAY['HEAD_PRIEST', 'ASSISTANT_PRIEST', 'PUJARI'])[FLOOR(RANDOM() * 3 + 1)::INT],
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 5000)::INT),
    'PERMANENT',
    CASE WHEN RANDOM() > 0.5 THEN 25000 ELSE 40000 END,
    FLOOR(5 + RANDOM() * 35)::INT,
    TRUE
FROM temples t
CROSS JOIN GENERATE_SERIES(1, 3);

-- ============================================================================
-- TEMPLE STAFF (Admin, security, maintenance)
-- ============================================================================

INSERT INTO temple_staff (
    temple_id, employee_code, first_name, last_name, phone, email,
    designation, department, date_of_joining,
    monthly_salary, system_username, is_active
)
SELECT
    t.id,
    'STAFF-' || t.temple_code || '-' || LPAD(ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY RANDOM())::TEXT, 3, '0'),
    demo_helpers.get_random_male_name(),
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    (ARRAY['MANAGER', 'ACCOUNTANT', 'SECURITY', 'CLEANER', 'GARDENER'])[FLOOR(RANDOM() * 5 + 1)::INT],
    (ARRAY['ADMINISTRATION', 'ACCOUNTS', 'SECURITY', 'MAINTENANCE'])[FLOOR(RANDOM() * 4 + 1)::INT],
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 3000)::INT),
    FLOOR(15000 + RANDOM() * 25000),
    'staff_' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 4, '0'),
    TRUE
FROM temples t
CROSS JOIN GENERATE_SERIES(1, 4);

-- ============================================================================
-- FESTIVAL DATA
-- ============================================================================

INSERT INTO festivals (
    temple_id, festival_name, festival_type,
    is_fixed_date, fixed_date, significance,
    special_darshan_timings, extended_hours, expected_crowd_count,
    is_active
)
SELECT
    t.id,
    'Maha Shivaratri',
    'MAJOR',
    FALSE, NULL,
    'Celebrates Shiva with all-night vigil and prayers',
    'All darshan types open extended hours',
    TRUE,
    50000,
    TRUE
FROM temples t WHERE t.deity_type = 'SHIVA'
UNION ALL
SELECT
    t.id,
    'Diwali',
    'MAJOR',
    TRUE, '2025-11-01'::DATE,
    'Festival of lights celebrated across all temples',
    'Special extended hours with additional darshan slots',
    TRUE,
    30000,
    TRUE
FROM temples t
UNION ALL
SELECT
    t.id,
    'Navratri',
    'MAJOR',
    TRUE, '2025-10-02'::DATE,
    'Nine days of Goddess worship',
    'Daily special poojas and evening aartis',
    FALSE,
    20000,
    TRUE
FROM temples t
WHERE t.deity_type = 'DEVI';

-- ============================================================================
-- DAILY TEMPLE SUMMARY (Analytics)
-- ============================================================================

INSERT INTO daily_temple_summary (
    temple_id, summary_date,
    total_devotees_visited, darshan_bookings,
    darshan_revenue, pooja_revenue, donation_revenue, prasad_revenue,
    total_revenue, total_poojas_conducted
)
SELECT
    t.id,
    CURRENT_DATE - (INTERVAL '1 day' * days.day),
    FLOOR(500 + RANDOM() * 3000),
    FLOOR(100 + RANDOM() * 500),
    FLOOR(RANDOM() * 5000),
    FLOOR(RANDOM() * 10000),
    FLOOR(RANDOM() * 25000),
    FLOOR(RANDOM() * 5000),
    FLOOR(RANDOM() * 50000),
    FLOOR(RANDOM() * 20)
FROM temples t
CROSS JOIN (SELECT GENERATE_SERIES(0, 30) AS day) days;

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT
    (SELECT COUNT(*) FROM temple_trusts) as "Total Trusts",
    (SELECT COUNT(*) FROM temples) as "Total Temples",
    (SELECT COUNT(*) FROM devotees) as "Total Devotees",
    (SELECT COUNT(*) FROM darshan_bookings) as "Darshan Bookings",
    (SELECT COUNT(*) FROM pooja_bookings) as "Pooja Bookings",
    (SELECT COUNT(*) FROM donations) as "Donations",
    (SELECT SUM(donation_amount) FROM donations) as "Total Donations",
    (SELECT COUNT(*) FROM priests) as "Priests",
    (SELECT COUNT(*) FROM temple_staff) as "Staff Members"
    AS "Temple Management System Demo Data Summary";
