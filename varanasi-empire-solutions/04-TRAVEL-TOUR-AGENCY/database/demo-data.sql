-- ============================================================================
-- TRAVEL & TOUR AGENCY MANAGEMENT - COMPREHENSIVE DEMO DATA
-- Version: 1.0.0
-- ============================================================================
-- Comprehensive demo data for travel agencies with complete booking workflows
-- ============================================================================

-- ============================================================================
-- TRAVEL AGENCIES
-- ============================================================================

INSERT INTO travel_agencies (
    agency_name, legal_name, registration_number, pan_number, gstin,
    contact_email, contact_phone, website,
    specialization, services_offered, has_own_fleet, total_vehicles,
    online_booking_enabled, is_active
) VALUES
(
    'Kashi Tours & Travels', 'Kashi Tours Private Limited', 'REG-2012-001',
    demo_helpers.generate_pan_number(), demo_helpers.generate_gst_number(),
    'info@kashitours.com', demo_helpers.generate_phone_number(), 'www.kashitours.com',
    ARRAY['PILGRIMAGE', 'HERITAGE'],
    ARRAY['TOUR_PACKAGES', 'HOTEL_BOOKING', 'TRANSPORT', 'VISA_ASSISTANCE'],
    TRUE, 15, TRUE, TRUE
),
(
    'Lucknow Expeditions', 'Lucknow Expeditions Ltd', 'REG-2015-002',
    demo_helpers.generate_pan_number(), demo_helpers.generate_gst_number(),
    'contact@lucknowexp.com', demo_helpers.generate_phone_number(), 'www.lucknowexp.com',
    ARRAY['ADVENTURE', 'CULTURAL'],
    ARRAY['TOUR_PACKAGES', 'FLIGHT_BOOKING', 'TRAIN_BOOKING', 'TRAVEL_INSURANCE'],
    FALSE, 0, TRUE, TRUE
),
(
    'Prayagraj Pilgrimage Tours', 'Prayagraj Pilgrimage Tours Inc', 'REG-2010-003',
    demo_helpers.generate_pan_number(), demo_helpers.generate_gst_number(),
    'admin@prayagrajtours.com', demo_helpers.generate_phone_number(), 'www.prayagrajtours.com',
    ARRAY['PILGRIMAGE'],
    ARRAY['TOUR_PACKAGES', 'HOTEL_BOOKING', 'TRANSPORT', 'VISA_ASSISTANCE'],
    TRUE, 20, TRUE, TRUE
);

-- ============================================================================
-- AGENCY BRANCHES
-- ============================================================================

INSERT INTO agency_branches (
    agency_id, branch_name, branch_code, city, state, pincode,
    branch_manager_name, branch_phone, branch_email, is_active
)
SELECT
    id,
    agency_name || ' - Varanasi',
    (CASE WHEN agency_name = 'Kashi Tours & Travels' THEN 'KT-VNS'
          WHEN agency_name = 'Lucknow Expeditions' THEN 'LE-VNS'
          ELSE 'PPT-VNS' END),
    'Varanasi', 'Uttar Pradesh', '221001',
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    LOWER(REPLACE(agency_name, ' ', '_')) || '@branch.com',
    TRUE
FROM travel_agencies
UNION ALL
SELECT
    id,
    agency_name || ' - Lucknow',
    (CASE WHEN agency_name = 'Kashi Tours & Travels' THEN 'KT-LKO'
          WHEN agency_name = 'Lucknow Expeditions' THEN 'LE-LKO'
          ELSE 'PPT-LKO' END),
    'Lucknow', 'Uttar Pradesh', '226001',
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    LOWER(REPLACE(agency_name, ' ', '_')) || '@branch.com',
    TRUE
FROM travel_agencies;

-- ============================================================================
-- STAFF (Tour consultants, coordinators, accountants)
-- ============================================================================

INSERT INTO staff (
    agency_id, branch_id, employee_code, first_name, last_name,
    phone, email, designation, department,
    date_of_joining, monthly_salary, system_username, is_active
)
SELECT
    ta.id,
    ab.id,
    'STF-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 5, '0'),
    demo_helpers.get_random_male_name(),
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    (ARRAY['MANAGER', 'TOUR_CONSULTANT', 'TOUR_COORDINATOR', 'ACCOUNTANT'])[FLOOR(RANDOM() * 4 + 1)::INT],
    (ARRAY['SALES', 'OPERATIONS', 'ACCOUNTS'])[FLOOR(RANDOM() * 3 + 1)::INT],
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 2000)::INT),
    FLOOR(25000 + RANDOM() * 40000),
    'staff_' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 4, '0'),
    TRUE
FROM travel_agencies ta
CROSS JOIN agency_branches ab
WHERE ab.agency_id = ta.id
CROSS JOIN GENERATE_SERIES(1, 3);

-- ============================================================================
-- TOUR GUIDES
-- ============================================================================

INSERT INTO tour_guides (
    agency_id, guide_code, first_name, last_name, phone, email,
    guide_license_number, languages_known, specialization,
    destinations_expertise, years_of_experience, guide_type,
    daily_rate, is_active
)
SELECT
    ta.id,
    'GD-' || ta.agency_name || '-' || LPAD(ROW_NUMBER() OVER (PARTITION BY ta.id ORDER BY RANDOM())::TEXT, 3, '0'),
    demo_helpers.get_random_male_name(),
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    'GLN-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
    (ARRAY[
        ARRAY['HINDI', 'ENGLISH'],
        ARRAY['HINDI', 'ENGLISH', 'FRENCH'],
        ARRAY['HINDI', 'ENGLISH', 'GERMAN'],
        ARRAY['HINDI', 'ENGLISH', 'SPANISH']
    ])[FLOOR(RANDOM() * 4 + 1)::INT],
    (ARRAY['HISTORICAL', 'RELIGIOUS', 'ADVENTURE'])[FLOOR(RANDOM() * 3 + 1)::INT],
    ARRAY['VARANASI', 'AGRA', 'AYODHYA', 'PRAYAGRAJ'],
    FLOOR(2 + RANDOM() * 20)::INT,
    'FREELANCE',
    FLOOR(1000 + RANDOM() * 3000),
    TRUE
FROM travel_agencies ta
CROSS JOIN GENERATE_SERIES(1, 5);

-- ============================================================================
-- DESTINATIONS
-- ============================================================================

INSERT INTO destinations (
    agency_id, destination_name, destination_type, city, state, country,
    category, description, attractions, best_time_to_visit,
    is_active
)
SELECT
    ta.id,
    (ARRAY['Varanasi', 'Agra', 'Ayodhya', 'Prayagraj', 'Mathura', 'Vrindavan', 'Lucknow', 'Jaipur'])[FLOOR(RANDOM() * 8 + 1)::INT],
    'CITY',
    (ARRAY['Varanasi', 'Agra', 'Ayodhya', 'Prayagraj', 'Mathura', 'Vrindavan', 'Lucknow', 'Jaipur'])[FLOOR(RANDOM() * 8 + 1)::INT],
    'Uttar Pradesh',
    'India',
    (ARRAY['PILGRIMAGE', 'HERITAGE', 'CULTURAL'])[FLOOR(RANDOM() * 3 + 1)::INT],
    'Ancient city with rich cultural heritage',
    ARRAY['Temple', 'Ghat', 'Historic Monument', 'Museum'],
    'October to March',
    TRUE
FROM travel_agencies ta
CROSS JOIN GENERATE_SERIES(1, 3);

-- ============================================================================
-- TOUR PACKAGES (20+ pilgrimage and heritage packages)
-- ============================================================================

INSERT INTO tour_packages (
    agency_id, package_code, package_name, package_tagline, package_type,
    duration_days, duration_nights, start_city, end_city,
    highlights, inclusions, base_price, price_per_person_twin_sharing,
    min_group_size, max_group_size, available_months,
    includes_accommodation, includes_meals, includes_transport, includes_guide,
    online_booking_enabled, is_active
)
SELECT
    ta.id,
    'PKG-' || LPAD(ROW_NUMBER() OVER (PARTITION BY ta.id ORDER BY RANDOM())::TEXT, 4, '0'),
    (ARRAY[
        'Golden Triangle: Delhi-Agra-Jaipur',
        'Kashi-Ayodhya Pilgrimage Circuit',
        'Holy Ganges - Varanasi Spiritual Sojourn',
        'Prayagraj Confluence Heritage Tour',
        'Mathura-Vrindavan Krishna Circuit',
        'Awadh Heritage Tour - Lucknow Special'
    ])[FLOOR(RANDOM() * 6 + 1)::INT],
    'Experience the spiritual essence of North India',
    (ARRAY['PILGRIMAGE', 'HERITAGE', 'CULTURAL', 'ADVENTURE'])[FLOOR(RANDOM() * 4 + 1)::INT],
    FLOOR(3 + RANDOM() * 7)::INT,
    FLOOR(2 + RANDOM() * 6)::INT,
    'Varanasi',
    (ARRAY['Agra', 'Ayodhya', 'Prayagraj', 'Jaipur'])[FLOOR(RANDOM() * 4 + 1)::INT],
    ARRAY['Temple visits', 'Ghat walks', 'Local experiences', 'Cultural immersion'],
    ARRAY['Hotel accommodation', 'Breakfast & Dinner', 'Transport', 'Guide service'],
    FLOOR(15000 + RANDOM() * 35000),
    FLOOR(15000 + RANDOM() * 35000),
    2, 30,
    ARRAY[10, 11, 12, 1, 2, 3],
    TRUE, TRUE, TRUE, TRUE, TRUE, TRUE
FROM travel_agencies ta
CROSS JOIN GENERATE_SERIES(1, 5);

-- ============================================================================
-- PACKAGE ITINERARIES
-- ============================================================================

INSERT INTO package_itinerary (
    package_id, day_number, day_title, day_description,
    morning_activity, afternoon_activity, evening_activity,
    breakfast_included, lunch_included, dinner_included,
    overnight_stay, accommodation_category
)
SELECT
    tp.id,
    days.day,
    'Day ' || days.day,
    'Experience the culture and heritage of the destination',
    'Visit local temples and historical sites',
    'Explore markets and local attractions',
    'Attend evening aarti ceremonies',
    TRUE, RANDOM() > 0.5, TRUE,
    (ARRAY['4_STAR', '3_STAR', 'STANDARD', 'BUDGET'])[FLOOR(RANDOM() * 4 + 1)::INT],
    (ARRAY['4_STAR', '3_STAR', 'STANDARD', 'BUDGET'])[FLOOR(RANDOM() * 4 + 1)::INT]
FROM tour_packages tp
CROSS JOIN (SELECT GENERATE_SERIES(1, tp.duration_days) AS day) days;

-- ============================================================================
-- PACKAGE DEPARTURES (Multiple departure dates)
-- ============================================================================

INSERT INTO package_departures (
    package_id, departure_date, return_date, price_per_person,
    total_seats, available_seats, departure_status
)
SELECT
    tp.id,
    CURRENT_DATE + (INTERVAL '1 day' * FLOOR(RANDOM() * 90)::INT),
    CURRENT_DATE + (INTERVAL '1 day' * (FLOOR(RANDOM() * 90)::INT + tp.duration_days)),
    tp.price_per_person_twin_sharing,
    30,
    FLOOR(10 + RANDOM() * 25)::INT,
    (ARRAY['OPEN', 'GUARANTEED', 'FILLING_FAST'])[FLOOR(RANDOM() * 3 + 1)::INT]
FROM tour_packages tp
CROSS JOIN GENERATE_SERIES(1, 4);

-- ============================================================================
-- CUSTOMERS (30+ diverse customer profiles)
-- ============================================================================

INSERT INTO customers (
    agency_id, customer_code, customer_type, first_name, last_name,
    phone, email, date_of_birth,
    passport_number, passport_expiry_date, aadhar_number,
    preferred_destinations, preferred_accommodation,
    dietary_preferences, total_bookings, total_spent, marketing_source,
    is_active
)
SELECT
    ta.id,
    'CUST-' || LPAD(ROW_NUMBER() OVER (PARTITION BY ta.id ORDER BY RANDOM())::TEXT, 5, '0'),
    'INDIVIDUAL',
    demo_helpers.get_random_male_name(),
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    CURRENT_DATE - (INTERVAL '1 day' * (FLOOR(18 + RANDOM() * 60)::INT * 365)),
    'A' || LPAD(FLOOR(RANDOM() * 9999999)::TEXT, 8, '0'),
    CURRENT_DATE + (INTERVAL '1 day' * FLOOR(RANDOM() * 3650)::INT),
    demo_helpers.generate_aadhaar_number(),
    ARRAY['Varanasi', 'Agra', 'Ayodhya', 'Prayagraj'],
    (ARRAY['BUDGET', 'STANDARD', 'DELUXE', 'LUXURY'])[FLOOR(RANDOM() * 4 + 1)::INT],
    ARRAY['VEG', 'NON_VEG'],
    0, 0,
    (ARRAY['ONLINE', 'WALK_IN', 'REFERRAL', 'SOCIAL_MEDIA'])[FLOOR(RANDOM() * 4 + 1)::INT],
    TRUE
FROM travel_agencies ta
CROSS JOIN GENERATE_SERIES(1, 10);

-- ============================================================================
-- TOUR BOOKINGS (25+ bookings across all agencies)
-- ============================================================================

INSERT INTO tour_bookings (
    agency_id, customer_id, package_id, departure_id,
    booking_number, booking_date, booking_type,
    travel_start_date, travel_end_date, total_days,
    total_travelers, adult_count, child_count,
    base_package_cost, gst_amount, total_amount,
    payment_status, advance_amount, amount_paid, balance_amount,
    booking_status, is_active
)
SELECT
    c.agency_id,
    c.id,
    tp.id,
    pd.id,
    'BK-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 60)::INT),
    (ARRAY['ONLINE', 'WALK_IN', 'PHONE'])[FLOOR(RANDOM() * 3 + 1)::INT],
    pd.departure_date,
    pd.return_date,
    tp.duration_days,
    FLOOR(1 + RANDOM() * 4)::INT,
    FLOOR(1 + RANDOM() * 4)::INT,
    FLOOR(RANDOM() * 2)::INT,
    (pd.price_per_person * FLOOR(1 + RANDOM() * 4))::DECIMAL(12, 2),
    ((pd.price_per_person * FLOOR(1 + RANDOM() * 4)) * 0.18)::DECIMAL(10, 2),
    ((pd.price_per_person * FLOOR(1 + RANDOM() * 4)) * 1.18)::DECIMAL(12, 2),
    (ARRAY['PENDING', 'ADVANCE_PAID', 'PARTIALLY_PAID', 'FULLY_PAID'])[FLOOR(RANDOM() * 4 + 1)::INT],
    ((pd.price_per_person * FLOOR(1 + RANDOM() * 4)) * 0.30)::DECIMAL(10, 2),
    ((pd.price_per_person * FLOOR(1 + RANDOM() * 4)) * (0.30 + RANDOM() * 0.70))::DECIMAL(12, 2),
    ((pd.price_per_person * FLOOR(1 + RANDOM() * 4)) * 1.18 * (1 - RANDOM() * 0.70))::DECIMAL(12, 2),
    (ARRAY['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'])[FLOOR(RANDOM() * 3 + 1)::INT],
    TRUE
FROM customers c
CROSS JOIN LATERAL (
    SELECT tp.* FROM tour_packages tp
    WHERE tp.agency_id = c.agency_id
    ORDER BY RANDOM() LIMIT 1
) tp
CROSS JOIN LATERAL (
    SELECT pd.* FROM package_departures pd
    WHERE pd.package_id = tp.id
      AND pd.departure_date > CURRENT_DATE - INTERVAL '60 days'
    ORDER BY RANDOM() LIMIT 1
) pd
WHERE ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY RANDOM()) <= 3;

-- ============================================================================
-- BOOKING PAYMENTS (Payment records)
-- ============================================================================

INSERT INTO booking_payments (
    booking_id, customer_id, receipt_number, payment_date,
    payment_type, amount_paid, payment_mode, transaction_id, collected_by
)
SELECT
    tb.id,
    tb.customer_id,
    'RCP-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    tb.booking_date + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)::INT),
    (ARRAY['ADVANCE', 'INSTALLMENT', 'FINAL'])[FLOOR(RANDOM() * 3 + 1)::INT],
    FLOOR(RANDOM() * tb.total_amount * 0.5)::DECIMAL(10, 2),
    (ARRAY['CASH', 'CARD', 'UPI', 'NEFT'])[FLOOR(RANDOM() * 4 + 1)::INT],
    'TXN-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
    (SELECT id FROM staff WHERE agency_id = tb.agency_id ORDER BY RANDOM() LIMIT 1)
FROM tour_bookings tb
WHERE ROW_NUMBER() OVER (PARTITION BY tb.id ORDER BY RANDOM()) <= 2;

-- ============================================================================
-- SUPPLIERS (Hotels, transport, etc.)
-- ============================================================================

INSERT INTO suppliers (
    agency_id, supplier_code, supplier_name, supplier_type,
    contact_person, phone, email, gstin, city, state,
    commission_percentage, is_active
)
SELECT
    ta.id,
    'SUP-' || LPAD(ROW_NUMBER() OVER (PARTITION BY ta.id ORDER BY RANDOM())::TEXT, 4, '0'),
    (ARRAY['Hotel Grand', 'Taj Residency', 'Fort View', 'Heritage Inn', 'Ramayana Tours'])[FLOOR(RANDOM() * 5 + 1)::INT],
    (ARRAY['HOTEL', 'TRANSPORT', 'DMC'])[FLOOR(RANDOM() * 3 + 1)::INT],
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    demo_helpers.generate_gst_number(),
    (ARRAY['Varanasi', 'Agra', 'Ayodhya', 'Lucknow', 'Prayagraj'])[FLOOR(RANDOM() * 5 + 1)::INT],
    'Uttar Pradesh',
    FLOOR(5 + RANDOM() * 15)::DECIMAL(5, 2),
    TRUE
FROM travel_agencies ta
CROSS JOIN GENERATE_SERIES(1, 5);

-- ============================================================================
-- HOTEL INVENTORY
-- ============================================================================

INSERT INTO hotel_inventory (
    supplier_id, hotel_name, hotel_category, city, state,
    hotel_phone, hotel_email, room_types, facilities,
    commission_percentage, hotel_rating, is_active
)
SELECT
    s.id,
    s.supplier_name,
    (ARRAY['3_STAR', '4_STAR', '5_STAR', 'BUDGET'])[FLOOR(RANDOM() * 4 + 1)::INT],
    s.city,
    s.state,
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(s.supplier_name),
    JSONB '[]'::JSONB,
    ARRAY['AC', 'WiFi', 'Restaurant', 'Parking', 'Room Service'],
    s.commission_percentage,
    (3.0 + RANDOM() * 2.0)::DECIMAL(2, 1),
    TRUE
FROM suppliers s
WHERE s.supplier_type = 'HOTEL'
LIMIT 20;

-- ============================================================================
-- TRANSPORT VEHICLES
-- ============================================================================

INSERT INTO transport_vehicles (
    agency_id, vehicle_number, vehicle_type, vehicle_model,
    seating_capacity, driver_name, driver_phone, driver_license_number,
    per_day_rate, per_km_rate, vehicle_status, has_ac, has_music_system,
    is_active
)
SELECT
    ta.id,
    'UP' || LPAD(FLOOR(RANDOM() * 99)::TEXT, 2, '0') || 'AB' || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0'),
    (ARRAY['TEMPO_TRAVELLER', 'MINI_BUS', 'BUS', 'LUXURY_COACH'])[FLOOR(RANDOM() * 4 + 1)::INT],
    (ARRAY['Toyota Innova', 'Mahindra XUV', 'Skoda Octavia', 'Kia Carens'])[FLOOR(RANDOM() * 4 + 1)::INT],
    (ARRAY[8, 12, 17, 35])[FLOOR(RANDOM() * 4 + 1)::INT],
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    'DL-' || LPAD(FLOOR(RANDOM() * 9999999)::TEXT, 7, '0'),
    FLOOR(2000 + RANDOM() * 5000),
    FLOOR(15 + RANDOM() * 35)::DECIMAL(6, 2),
    (ARRAY['AVAILABLE', 'ON_TRIP', 'MAINTENANCE'])[FLOOR(RANDOM() * 3 + 1)::INT],
    TRUE, TRUE, TRUE
FROM travel_agencies ta
CROSS JOIN GENERATE_SERIES(1, 5);

-- ============================================================================
-- TOUR QUERIES (Lead management)
-- ============================================================================

INSERT INTO tour_queries (
    agency_id, query_number, query_date, query_source,
    customer_name, customer_phone, customer_email,
    destination, travel_date_from, travel_date_to,
    number_of_travelers, query_details, query_status, is_active
)
SELECT
    ta.id,
    'QRY-' || LPAD(ROW_NUMBER() OVER (PARTITION BY ta.id ORDER BY RANDOM())::TEXT, 5, '0'),
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 30)::INT),
    (ARRAY['WEBSITE', 'PHONE', 'EMAIL', 'WALK_IN'])[FLOOR(RANDOM() * 4 + 1)::INT],
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    (ARRAY['Varanasi', 'Agra', 'Ayodhya', 'Prayagraj'])[FLOOR(RANDOM() * 4 + 1)::INT],
    CURRENT_DATE + (INTERVAL '1 day' * FLOOR(RANDOM() * 90)::INT),
    CURRENT_DATE + (INTERVAL '1 day' * (FLOOR(RANDOM() * 90)::INT + 5)),
    FLOOR(2 + RANDOM() * 6)::INT,
    'Inquiry about pilgrimage tour packages',
    (ARRAY['NEW', 'CONTACTED', 'QUOTATION_SENT', 'NEGOTIATION'])[FLOOR(RANDOM() * 4 + 1)::INT],
    TRUE
FROM travel_agencies ta
CROSS JOIN GENERATE_SERIES(1, 8);

-- ============================================================================
-- VISA APPLICATIONS
-- ============================================================================

INSERT INTO visa_applications (
    agency_id, customer_id, application_number, application_date,
    applicant_name, passport_number, visa_country, visa_type,
    intended_travel_date, duration_of_stay, application_status,
    approval_date, visa_number, is_active
)
SELECT
    ta.id,
    c.id,
    'VISA-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 60)::INT),
    c.first_name || ' ' || c.last_name,
    c.passport_number,
    (ARRAY['THAILAND', 'NEPAL', 'BHUTAN'])[FLOOR(RANDOM() * 3 + 1)::INT],
    'TOURIST',
    CURRENT_DATE + (INTERVAL '1 day' * FLOOR(RANDOM() * 90)::INT),
    FLOOR(7 + RANDOM() * 28)::INT,
    (ARRAY['DOCUMENTS_COLLECTION', 'SUBMITTED', 'APPROVED', 'REJECTED'])[FLOOR(RANDOM() * 4 + 1)::INT],
    CURRENT_DATE + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)::INT),
    'VISA-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
    TRUE
FROM travel_agencies ta
CROSS JOIN customers c
WHERE c.agency_id = ta.id
  AND ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY RANDOM()) <= 1
LIMIT 10;

-- ============================================================================
-- DAILY BOOKING SUMMARY
-- ============================================================================

INSERT INTO daily_booking_summary (
    agency_id, summary_date,
    total_bookings, new_queries, quotations_sent,
    total_revenue, payment_collected, total_travelers
)
SELECT
    ta.id,
    CURRENT_DATE - (INTERVAL '1 day' * days.day),
    FLOOR(RANDOM() * 10),
    FLOOR(RANDOM() * 15),
    FLOOR(RANDOM() * 8),
    FLOOR(RANDOM() * 100000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 50000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 50)
FROM travel_agencies ta
CROSS JOIN (SELECT GENERATE_SERIES(0, 60) AS day) days;

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT
    (SELECT COUNT(*) FROM travel_agencies) as "Total Agencies",
    (SELECT COUNT(*) FROM agency_branches) as "Total Branches",
    (SELECT COUNT(*) FROM customers) as "Total Customers",
    (SELECT COUNT(*) FROM tour_packages) as "Tour Packages",
    (SELECT COUNT(*) FROM tour_bookings) as "Tour Bookings",
    (SELECT COUNT(*) FROM tour_guides) as "Tour Guides",
    (SELECT COUNT(*) FROM suppliers) as "Suppliers",
    (SELECT COUNT(*) FROM staff) as "Staff Members",
    (SELECT SUM(total_amount) FROM tour_bookings) as "Total Booking Revenue"
    AS "Travel & Tour Agency Demo Data Summary";
