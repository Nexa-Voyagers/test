-- ============================================================================
-- HOTEL & HOSPITALITY MANAGEMENT SYSTEM - COMPREHENSIVE DEMO DATA
-- Version: 1.0.0
-- ============================================================================
-- This script populates realistic sample data for hotel management features
-- including: hotel groups, properties, rooms, guests, bookings, services,
-- housekeeping, and amenities.
--
-- Sample Data:
-- - 2 hotel groups
-- - 5 properties with different star ratings
-- - 50+ rooms (various categories: deluxe, suite, standard)
-- - 20+ bookings (past, current, future)
-- - Guest profiles
-- - Room service orders
-- - Housekeeping assignments
-- - Facilities and amenities
-- ============================================================================

-- ============================================================================
-- 1. HOTEL GROUPS
-- ============================================================================

-- Note: Assuming hotel_groups table exists from schema
-- If not, the inserts will need the table created first

INSERT INTO hotel_groups (group_name, group_code, headquarters_address, total_properties,
                          central_inventory_enabled, central_pricing_enabled, central_reporting_enabled,
                          email, phone, website)
VALUES
-- Group 1: Heritage Hotel Chain
(
    'Varanasi Heritage Hotel Group',
    'VHHG',
    '42 Assi Ghat, Varanasi, Uttar Pradesh 221001',
    3,
    true,
    true,
    true,
    'admin@varanasi-heritage-hotels.com',
    '+919876543210',
    'www.varanasi-heritage-hotels.com'
),
-- Group 2: North India Hospitality
(
    'North India Hospitality Corporation',
    'NIHC',
    'Unit 205, Imperial Plaza, Lucknow, Uttar Pradesh 226001',
    2,
    true,
    false,
    true,
    'contact@nihc-hotels.com',
    '+919988776655',
    'www.nihc-hotels.com'
);

-- ============================================================================
-- 2. PROPERTIES (Hotels)
-- ============================================================================

INSERT INTO properties (group_id, property_name, property_code, property_type, star_rating,
                       address_line1, address_line2, city, state, pincode, latitude, longitude,
                       phone, email, website, total_rooms, guest_rooms, occupied_rooms,
                       general_manager, check_in_time, check_out_time, currency, gst_number,
                       is_active, created_at)
VALUES
-- Group 1 Properties
(
    (SELECT id FROM hotel_groups WHERE group_code = 'VHHG'),
    'Ganges Riverside Palace',
    'VHHG-GRP-001',
    'heritage',
    5.0,
    '42 Assi Ghat, Varanasi',
    'Overlooking River Ganges',
    'Varanasi',
    'Uttar Pradesh',
    '221001',
    25.3209,
    82.9789,
    '+919876543210',
    'info@ganges-palace.com',
    'www.ganges-palace.com',
    120,
    100,
    0,
    'Rajesh Kumar',
    '14:00',
    '11:00',
    'INR',
    '09AABCU1234G1Z0',
    true,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM hotel_groups WHERE group_code = 'VHHG'),
    'Lucknow Grand Hotel',
    'VHHG-LGH-002',
    'boutique',
    4.5,
    '123 Hazratganj Street, Lucknow',
    'Near Charbagh Railway Station',
    'Lucknow',
    'Uttar Pradesh',
    '226001',
    26.8467,
    80.9462,
    '+919876543211',
    'info@lucknow-grand.com',
    'www.lucknow-grand.com',
    85,
    75,
    0,
    'Amit Singh',
    '14:00',
    '11:00',
    'INR',
    '09AABCU1234G1Z1',
    true,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM hotel_groups WHERE group_code = 'VHHG'),
    'Taj View Resort',
    'VHHG-TVR-003',
    'resort',
    4.0,
    '456 Taj East Gate Road, Agra',
    'Walking Distance from Taj Mahal',
    'Agra',
    'Uttar Pradesh',
    '282001',
    27.1756,
    78.0081,
    '+919876543212',
    'reservations@taj-view.com',
    'www.taj-view.com',
    150,
    130,
    0,
    'Vikram Patel',
    '14:00',
    '12:00',
    'INR',
    '09AABCU1234G1Z2',
    true,
    CURRENT_TIMESTAMP
),
-- Group 2 Properties
(
    (SELECT id FROM hotel_groups WHERE group_code = 'NIHC'),
    'Kanpur Business Hotel',
    'NIHC-KBH-004',
    'business',
    3.5,
    '789 Old Court Road, Kanpur',
    'Corporate Business District',
    'Kanpur',
    'Uttar Pradesh',
    '208001',
    26.4500,
    80.3300,
    '+919988776655',
    'info@kanpur-business.com',
    'www.kanpur-business.com',
    60,
    50,
    0,
    'Sanjeev Mishra',
    '15:00',
    '11:00',
    'INR',
    '09AACPL5678H1Z5',
    true,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM hotel_groups WHERE group_code = 'NIHC'),
    'Allahabad Comfort Inn',
    'NIHC-ACI-005',
    'budget',
    3.0,
    '234 Civil Lines, Prayagraj',
    'Near Triveni Sangam',
    'Prayagraj',
    'Uttar Pradesh',
    '211001',
    25.4358,
    81.8463,
    '+919988776656',
    'bookings@allahabad-comfort.com',
    'www.allahabad-comfort.com',
    45,
    40,
    0,
    'Mahesh Sharma',
    '15:00',
    '10:00',
    'INR',
    '09AACPL5678H1Z6',
    true,
    CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. ROOM CATEGORIES
-- ============================================================================

-- Create room categories for each property
DO $$
DECLARE
    v_property_id UUID;
BEGIN
    FOR v_property_id IN SELECT id FROM properties LOOP
        INSERT INTO room_categories (property_id, category_name, category_code, description,
                                     base_rate, max_occupancy, amenities, is_active)
        VALUES
        (
            v_property_id,
            'Standard Room',
            'STD',
            'Comfortable room with basic amenities',
            3500.00,
            2,
            ARRAY['AC', 'WiFi', 'TV', 'Attached Bathroom'],
            true
        ),
        (
            v_property_id,
            'Deluxe Room',
            'DLX',
            'Spacious room with premium furnishings',
            5500.00,
            3,
            ARRAY['AC', 'WiFi', 'TV', 'Bathrobe', 'Mini Bar', 'Writing Desk'],
            true
        ),
        (
            v_property_id,
            'Suite Room',
            'STE',
            'Luxury suite with living area',
            8500.00,
            4,
            ARRAY['AC', 'WiFi', 'TV', 'Bathrobe', 'Minibar', 'Lounge Area', 'Jacuzzi'],
            true
        );
    END LOOP;
END $$;

-- ============================================================================
-- 4. ROOMS (50+ rooms across properties)
-- ============================================================================

DO $$
DECLARE
    v_property_id UUID;
    v_category_id UUID;
    v_floor INT;
    v_room_num INT;
    v_room_count INT;
BEGIN
    FOR v_property_id IN SELECT id FROM properties LOOP
        -- Create rooms for each category
        FOR v_category_id IN SELECT id FROM room_categories WHERE property_id = v_property_id LOOP
            FOR v_room_num IN 1..12 LOOP
                v_floor := FLOOR(v_room_num / 4) + 1;
                INSERT INTO rooms (property_id, category_id, room_number, room_type, floor_number,
                                  status, is_smoking_allowed, is_active)
                VALUES
                (
                    v_property_id,
                    v_category_id,
                    LPAD(v_floor::TEXT, 2, '0') || LPAD(v_room_num::TEXT, 2, '0'),
                    'STANDARD',
                    v_floor,
                    'AVAILABLE',
                    false,
                    true
                );
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- ============================================================================
-- 5. GUESTS (Customer Profiles)
-- ============================================================================

INSERT INTO guests (first_name, last_name, email, phone, date_of_birth, gender,
                   nationality, identification_type, identification_number, company_name,
                   preferred_language, special_requests, is_vip, loyalty_member)
VALUES
-- Indian Guests
(
    'Rajesh',
    'Kumar',
    'rajesh.kumar@gmail.com',
    '9876543210',
    '1975-05-15',
    'MALE',
    'India',
    'PASSPORT',
    'F1234567',
    'TCS',
    'Hindi',
    'Late breakfast preferred',
    false,
    true
),
(
    'Priya',
    'Singh',
    'priya.singh@hotmail.com',
    '9876543211',
    '1982-08-22',
    'FEMALE',
    'India',
    'AADHAR',
    '123456789012',
    'ICICI Bank',
    'English',
    'Non-vegetarian meals',
    true,
    true
),
(
    'Vikram',
    'Patel',
    'vikram.patel@outlook.com',
    '9876543212',
    '1988-11-10',
    'MALE',
    'India',
    'PASSPORT',
    'G2345678',
    'Infosys',
    'Gujarati',
    'Business center access required',
    false,
    false
),
(
    'Sunita',
    'Sharma',
    'sunita.sharma@gmail.com',
    '9876543213',
    '1990-03-28',
    'FEMALE',
    'India',
    'DRIVING_LICENSE',
    'DL-2024-001',
    'Freelancer',
    'Hindi',
    'Ground floor room preferred',
    false,
    true
),
(
    'Arun',
    'Verma',
    'arun.verma@rediffmail.com',
    '9876543214',
    '1980-07-12',
    'MALE',
    'India',
    'PASSPORT',
    'H3456789',
    'McKinsey',
    'English',
    'High floor preferred',
    true,
    true
),
-- International Guests
(
    'John',
    'Anderson',
    'john.anderson@example.com',
    '+16175551234',
    '1975-02-14',
    'MALE',
    'United States',
    'PASSPORT',
    'US12345678',
    'IBM',
    'English',
    'Early breakfast',
    false,
    false
),
(
    'Sarah',
    'Thompson',
    'sarah.thompson@example.co.uk',
    '+442071838750',
    '1985-09-08',
    'FEMALE',
    'United Kingdom',
    'PASSPORT',
    'GB98765432',
    'Oxford University',
    'English',
    'WiFi business class required',
    false,
    false
),
(
    'Marie',
    'Dupont',
    'marie.dupont@example.fr',
    '+33123456789',
    '1980-06-20',
    'FEMALE',
    'France',
    'PASSPORT',
    'FR12345678',
    'Michelin',
    'French',
    'Wine selection requested',
    true,
    true
),
(
    'Hans',
    'Mueller',
    'hans.mueller@example.de',
    '+491234567890',
    '1978-04-05',
    'MALE',
    'Germany',
    'PASSPORT',
    'DE87654321',
    'Siemens',
    'German',
    'Punctual service required',
    false,
    false
),
(
    'Yuki',
    'Tanaka',
    'yuki.tanaka@example.jp',
    '+81312345678',
    '1992-12-16',
    'FEMALE',
    'Japan',
    'PASSPORT',
    'JP11223344',
    'Sony Corporation',
    'Japanese',
    'Vegetarian meals preferred',
    false,
    true
);

-- ============================================================================
-- 6. BOOKINGS (20+ bookings with various statuses)
-- ============================================================================

DO $$
DECLARE
    v_property_id UUID;
    v_guest_id UUID;
    v_room_id UUID;
    v_booking_count INT := 0;
    v_check_in_date DATE;
    v_check_out_date DATE;
BEGIN
    -- Create bookings for various properties and guests
    FOR v_property_id IN SELECT id FROM properties LIMIT 3 LOOP
        FOR v_guest_id IN SELECT id FROM guests LIMIT 5 LOOP
            v_booking_count := v_booking_count + 1;

            -- Vary check-in dates
            IF v_booking_count % 4 = 0 THEN
                v_check_in_date := CURRENT_DATE - INTERVAL '15 days';
                v_check_out_date := v_check_in_date + INTERVAL '5 days';
            ELSIF v_booking_count % 4 = 1 THEN
                v_check_in_date := CURRENT_DATE - INTERVAL '5 days';
                v_check_out_date := v_check_in_date + INTERVAL '3 days';
            ELSIF v_booking_count % 4 = 2 THEN
                v_check_in_date := CURRENT_DATE + INTERVAL '10 days';
                v_check_out_date := v_check_in_date + INTERVAL '2 days';
            ELSE
                v_check_in_date := CURRENT_DATE;
                v_check_out_date := CURRENT_DATE + INTERVAL '7 days';
            END IF;

            -- Get random room
            SELECT id INTO v_room_id FROM rooms WHERE property_id = v_property_id LIMIT 1;

            INSERT INTO bookings (property_id, guest_id, room_id, check_in_date, check_out_date,
                                 number_of_guests, number_of_nights, room_rate_per_night,
                                 total_amount, booking_status, payment_status, booking_date,
                                 special_requests, confirmed_at)
            VALUES
            (
                v_property_id,
                v_guest_id,
                v_room_id,
                v_check_in_date,
                v_check_out_date,
                CASE WHEN v_booking_count % 3 = 0 THEN 1 ELSE 2 END,
                EXTRACT(DAY FROM v_check_out_date - v_check_in_date)::INT,
                CASE WHEN v_booking_count % 2 = 0 THEN 3500.00 ELSE 5500.00 END,
                (EXTRACT(DAY FROM v_check_out_date - v_check_in_date)::INT * (CASE WHEN v_booking_count % 2 = 0 THEN 3500.00 ELSE 5500.00 END))::DECIMAL(12,2),
                CASE
                    WHEN v_booking_count <= 5 THEN 'CHECKED_OUT'
                    WHEN v_booking_count <= 10 THEN 'CHECKED_IN'
                    WHEN v_booking_count <= 15 THEN 'CONFIRMED'
                    ELSE 'PENDING'
                END,
                CASE WHEN v_booking_count <= 15 THEN 'PAID' ELSE 'PENDING' END,
                CURRENT_DATE - INTERVAL '1 day' * (v_booking_count % 30),
                CASE
                    WHEN v_booking_count % 4 = 0 THEN 'Late check-out needed'
                    WHEN v_booking_count % 4 = 1 THEN 'Room with view preferred'
                    WHEN v_booking_count % 4 = 2 THEN 'Welcome gifts for couple'
                    ELSE NULL
                END,
                CASE WHEN v_booking_count > 5 THEN CURRENT_TIMESTAMP ELSE NULL END
            );

            EXIT WHEN v_booking_count >= 25;
        END LOOP;
        EXIT WHEN v_booking_count >= 25;
    END LOOP;
END $$;

-- ============================================================================
-- 7. ROOM SERVICE ORDERS
-- ============================================================================

-- Create room service orders for checked-in guests
DO $$
DECLARE
    v_booking_id UUID;
    v_item_count INT;
BEGIN
    FOR v_booking_id IN SELECT id FROM bookings WHERE booking_status = 'CHECKED_IN' LIMIT 5 LOOP
        FOR v_item_count IN 1..3 LOOP
            INSERT INTO room_service_orders (booking_id, order_date, order_time, status,
                                            item_name, quantity, rate, amount, special_instructions,
                                            delivery_time, created_at)
            VALUES
            (
                v_booking_id,
                CURRENT_DATE,
                CURRENT_TIME - INTERVAL '3 hours' * v_item_count,
                CASE v_item_count WHEN 1 THEN 'DELIVERED' WHEN 2 THEN 'CONFIRMED' ELSE 'PENDING' END,
                CASE v_item_count
                    WHEN 1 THEN 'Biryani - Chicken (Full Plate)'
                    WHEN 2 THEN 'Paneer Butter Masala with Naan'
                    ELSE 'Fresh Juice - Orange'
                END,
                CASE v_item_count WHEN 1 THEN 1 WHEN 2 THEN 1 ELSE 2 END,
                CASE v_item_count
                    WHEN 1 THEN 450.00
                    WHEN 2 THEN 350.00
                    ELSE 80.00
                END,
                CASE v_item_count
                    WHEN 1 THEN 450.00
                    WHEN 2 THEN 350.00
                    ELSE 160.00
                END::DECIMAL(10,2),
                CASE v_item_count WHEN 1 THEN 'Extra spice' ELSE NULL END,
                CASE v_item_count WHEN 1 THEN CURRENT_TIMESTAMP - INTERVAL '45 minutes' ELSE NULL END,
                CURRENT_TIMESTAMP - INTERVAL '3 hours' * v_item_count
            );
        END LOOP;
    END LOOP;
END $$;

-- ============================================================================
-- 8. HOUSEKEEPING ASSIGNMENTS
-- ============================================================================

-- Assign rooms to housekeeping staff
DO $$
DECLARE
    v_room_id UUID;
    v_assignment_count INT := 0;
BEGIN
    FOR v_room_id IN SELECT id FROM rooms WHERE status IN ('AVAILABLE', 'CLEANING') LIMIT 15 LOOP
        v_assignment_count := v_assignment_count + 1;
        INSERT INTO housekeeping_assignments (room_id, assigned_date, assigned_time, status,
                                             assigned_to_staff_name, estimated_completion_time,
                                             completed_at, notes)
        VALUES
        (
            v_room_id,
            CURRENT_DATE,
            CURRENT_TIME,
            CASE v_assignment_count % 3 WHEN 0 THEN 'COMPLETED' WHEN 1 THEN 'IN_PROGRESS' ELSE 'PENDING' END,
            'Housekeeping Staff - ' || (v_assignment_count % 5 + 1),
            CURRENT_TIME + INTERVAL '2 hours',
            CASE WHEN v_assignment_count % 3 = 0 THEN CURRENT_TIMESTAMP - INTERVAL '30 minutes' ELSE NULL END,
            CASE v_assignment_count % 4
                WHEN 0 THEN 'Standard cleaning completed'
                WHEN 1 THEN 'Waiting for inspection'
                WHEN 2 THEN 'Deep cleaning scheduled'
                ELSE NULL
            END
        );
    END LOOP;
END $$;

-- ============================================================================
-- 9. AMENITIES & FACILITIES
-- ============================================================================

INSERT INTO amenities (property_id, amenity_name, amenity_category, description, is_complimentary, is_available)
SELECT
    p.id,
    amenity_name,
    amenity_category,
    description,
    is_complimentary,
    true
FROM properties p
CROSS JOIN (VALUES
    ('WiFi Internet', 'Communication', 'High-speed WiFi in all areas', true),
    ('Swimming Pool', 'Recreation', 'Olympic-size heated swimming pool', true),
    ('Fitness Center', 'Health', '24-hour fitness center with equipment', true),
    ('Spa & Wellness', 'Health', 'Professional spa and wellness center', false),
    ('Restaurant & Bar', 'Dining', 'Multi-cuisine restaurant and lounge bar', false),
    ('Conference Halls', 'Business', 'State-of-the-art conference facilities', false),
    ('Valet Parking', 'Parking', 'Complimentary valet parking service', true),
    ('Concierge Service', 'Service', '24-hour concierge desk', true),
    ('Room Service', 'Service', '24-hour room service', true),
    ('Business Center', 'Business', 'Full business center with computers', true),
    ('Travel Desk', 'Service', 'Travel and tour bookings assistance', true),
    ('Kids Play Area', 'Recreation', 'Supervised kids activity center', false),
    ('Laundry Service', 'Service', 'Express laundry and dry cleaning', false),
    ('Medical Assistance', 'Health', 'On-call doctor and medical support', true),
    ('Library', 'Recreation', 'Well-stocked library with reading materials', true)
) AS amenities(amenity_name, amenity_category, description, is_complimentary);

-- ============================================================================
-- 10. HOTEL STAFF
-- ============================================================================

INSERT INTO staff (property_id, first_name, last_name, email, phone, position,
                   department, joining_date, salary, is_active)
SELECT
    p.id,
    staff_data.first_name,
    staff_data.last_name,
    LOWER(staff_data.first_name || '.' || staff_data.last_name || '@' || REPLACE(LOWER(p.property_name), ' ', '')) || '.com',
    '+91' || LPAD(FLOOR(6000000000 + RANDOM() * 4000000000)::TEXT, 10, '0'),
    staff_data.position,
    staff_data.department,
    CURRENT_DATE - INTERVAL '1 year' + INTERVAL '1 day' * FLOOR(RANDOM() * 365),
    staff_data.salary::DECIMAL(10,2),
    true
FROM properties p
CROSS JOIN (VALUES
    ('Rajesh', 'Singh', 'General Manager', 'Management', 150000),
    ('Amit', 'Kumar', 'Front Office Manager', 'Front Office', 80000),
    ('Priya', 'Gupta', 'Housekeeping Manager', 'Housekeeping', 65000),
    ('Vikram', 'Sharma', 'Chef', 'Food & Beverage', 70000),
    ('Sunita', 'Verma', 'Reception', 'Front Office', 35000),
    ('Arun', 'Mishra', 'Room Attendant', 'Housekeeping', 25000),
    ('Deepti', 'Patel', 'Spa Therapist', 'Wellness', 45000),
    ('Mahesh', 'Singh', 'Security Officer', 'Security', 30000)
) AS staff_data(first_name, last_name, position, department, salary);

-- ============================================================================
-- 11. INVOICES & BILLING
-- ============================================================================

INSERT INTO invoices (property_id, booking_id, invoice_number, invoice_date, room_charges,
                      food_beverage_charges, other_charges, total_amount, tax_amount,
                      grand_total, payment_method, payment_date, notes)
SELECT
    b.property_id,
    b.id,
    'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(ROW_NUMBER() OVER (ORDER BY b.id)::TEXT, 6, '0'),
    CURRENT_DATE,
    b.total_amount::DECIMAL(10,2),
    (RANDOM() * 5000)::DECIMAL(10,2),
    (RANDOM() * 2000)::DECIMAL(10,2),
    (b.total_amount + (RANDOM() * 5000) + (RANDOM() * 2000))::DECIMAL(12,2),
    ((b.total_amount + (RANDOM() * 5000) + (RANDOM() * 2000)) * 0.18)::DECIMAL(10,2),
    ((b.total_amount + (RANDOM() * 5000) + (RANDOM() * 2000)) * 1.18)::DECIMAL(12,2),
    CASE WHEN ROW_NUMBER() OVER (ORDER BY b.id) % 3 = 0 THEN 'CREDIT_CARD'
         WHEN ROW_NUMBER() OVER (ORDER BY b.id) % 3 = 1 THEN 'CASH'
         ELSE 'UPI'
    END,
    CASE WHEN b.booking_status IN ('CHECKED_OUT', 'COMPLETED') THEN CURRENT_DATE ELSE NULL END,
    'Standard billing'
FROM bookings b
WHERE b.booking_status IN ('CHECKED_OUT', 'CHECKED_IN', 'CONFIRMED')
LIMIT 15;

-- ============================================================================
-- 12. DAILY OCCUPANCY SUMMARY
-- ============================================================================

INSERT INTO daily_occupancy_summary (property_id, summary_date, total_rooms, occupied_rooms,
                                     available_rooms, maintenance_rooms, occupancy_percentage,
                                     average_room_rate, total_revenue)
SELECT
    p.id,
    CURRENT_DATE - INTERVAL '1 day' * (row_number() OVER (ORDER BY p.id) - 1),
    p.total_rooms,
    FLOOR(p.total_rooms * (0.6 + RANDOM() * 0.35))::INT,
    CEIL(p.total_rooms * 0.1)::INT,
    FLOOR(p.total_rooms * 0.05)::INT,
    (FLOOR(p.total_rooms * (0.6 + RANDOM() * 0.35)) * 100.0 / p.total_rooms)::DECIMAL(5,2),
    (4000.00 + RANDOM() * 2000)::DECIMAL(10,2),
    ((4000.00 + RANDOM() * 2000) * FLOOR(p.total_rooms * (0.6 + RANDOM() * 0.35)))::DECIMAL(12,2)
FROM properties p
LIMIT 20;

-- ============================================================================
-- VERIFICATION & SUMMARY
-- ============================================================================

SELECT 'Hotel Management Demo Data Complete!' AS status;
SELECT COUNT(*) AS "Total Properties" FROM properties;
SELECT COUNT(*) AS "Total Rooms" FROM rooms;
SELECT COUNT(*) AS "Total Guests" FROM guests;
SELECT COUNT(*) AS "Total Bookings" FROM bookings;
SELECT COUNT(*) AS "Total Amenities" FROM amenities;
SELECT COUNT(*) AS "Total Staff" FROM staff;
