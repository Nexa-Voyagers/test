-- ============================================================================
-- BRIJRAMA PALACE - DEMO DATA (6 MONTHS SIMULATION)
-- Hotel Management System v1.0
-- ============================================================================

-- Clear existing demo data (if re-running)
TRUNCATE TABLE properties, room_types, rooms, guests, reservations CASCADE;

-- ============================================================================
-- 1. PROPERTY: Brijrama Palace Heritage Hotel
-- ============================================================================

INSERT INTO properties (
    id, name, slug, description, property_type, star_rating,
    address_line1, city, state, country, pincode,
    latitude, longitude,
    phone, email, website, whatsapp,
    check_in_time, check_out_time,
    cancellation_policy,
    logo_url, cover_image_url
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Brijrama Palace Heritage Hotel',
    'brijrama-palace-varanasi',
    'Experience the grandeur of Banaras at Brijrama Palace, an 18th-century heritage haveli on the banks of River Ganges. Offering stunning river views, traditional hospitality, and modern amenities.',
    'hotel',
    5,
    'Darbhanga Ghat, Near Manikarnika Ghat',
    'Varanasi',
    'Uttar Pradesh',
    'India',
    '221001',
    25.3095,
    83.0137,
    '+91-542-2270011',
    'info@brijramapalace.com',
    'https://brijramapalace.com',
    '+91-9876543210',
    '14:00:00',
    '11:00:00',
    'Free cancellation up to 48 hours before check-in. 50% charge for cancellation within 48 hours. No refund for no-shows.',
    '/images/brijrama-logo.png',
    '/images/brijrama-cover.jpg'
);

-- Property Images
INSERT INTO property_images (property_id, image_url, caption, display_order, is_featured) VALUES
('11111111-1111-1111-1111-111111111111', '/images/property/exterior-1.jpg', 'Stunning Ganga view from the terrace', 1, true),
('11111111-1111-1111-1111-111111111111', '/images/property/courtyard.jpg', 'Traditional courtyard with fountain', 2, false),
('11111111-1111-1111-1111-111111111111', '/images/property/restaurant.jpg', 'Riverside dining experience', 3, false),
('11111111-1111-1111-1111-111111111111', '/images/property/lobby.jpg', 'Grand heritage lobby', 4, false),
('11111111-1111-1111-1111-111111111111', '/images/property/terrace.jpg', 'Evening Ganga Aarti from terrace', 5, true);

-- Property Amenities
INSERT INTO property_amenities (property_id, amenity_type, amenity_name, is_free) VALUES
('11111111-1111-1111-1111-111111111111', 'wifi', 'High-speed WiFi', true),
('11111111-1111-1111-1111-111111111111', 'parking', 'Valet Parking', true),
('11111111-1111-1111-1111-111111111111', 'restaurant', 'Darbhanga Restaurant', false),
('11111111-1111-1111-1111-111111111111', 'spa', 'Ayurvedic Spa & Wellness', false),
('11111111-1111-1111-1111-111111111111', 'gym', '24-hour Fitness Center', true),
('11111111-1111-1111-1111-111111111111', 'laundry', 'Laundry & Dry Cleaning', false),
('11111111-1111-1111-1111-111111111111', 'airport_transfer', 'Airport Transfer Service', false),
('11111111-1111-1111-1111-111111111111', 'tour', 'Guided City Tours', false),
('11111111-1111-1111-1111-111111111111', 'boat', 'Private Boat Rides', false),
('11111111-1111-1111-1111-111111111111', 'yoga', 'Morning Yoga Sessions', true);

-- ============================================================================
-- 2. ROOM TYPES
-- ============================================================================

-- Deluxe Room (5 rooms)
INSERT INTO room_types (
    id, property_id, name, slug, description,
    max_adults, max_children, max_occupancy,
    size_sqft, bed_type, bed_count,
    base_price, extra_adult_charge, extra_child_charge,
    view_type, is_active
) VALUES (
    '22222222-2222-2222-2222-222222222221',
    '11111111-1111-1111-1111-111111111111',
    'Deluxe River View Room',
    'deluxe-river-view',
    'Elegant 350 sq.ft room with direct views of River Ganges. Features traditional Banarasi decor with modern amenities including AC, LED TV, minibar, and marble bathroom.',
    2, 1, 3,
    350, 'queen', 1,
    6500.00, 1500.00, 800.00,
    'river', true
);

-- Heritage Suite (8 suites)
INSERT INTO room_types (
    id, property_id, name, slug, description,
    max_adults, max_children, max_occupancy,
    size_sqft, bed_type, bed_count,
    base_price, extra_adult_charge, extra_child_charge,
    view_type, is_active
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Heritage Suite',
    'heritage-suite',
    'Luxurious 600 sq.ft suite with separate living area, private balcony overlooking the Ganges, king-sized bed with premium linens, sitting area, work desk, and spacious bathroom with bathtub.',
    2, 2, 4,
    600, 'king', 1,
    12000.00, 2000.00, 1200.00,
    'river', true
);

-- Royal Suite (2 suites)
INSERT INTO room_types (
    id, property_id, name, slug, description,
    max_adults, max_children, max_occupancy,
    size_sqft, bed_type, bed_count,
    base_price, extra_adult_charge, extra_child_charge,
    view_type, is_active
) VALUES (
    '22222222-2222-2222-2222-222222222223',
    '11111111-1111-1111-1111-111111111111',
    'Royal Suite',
    'royal-suite',
    'Our most prestigious 900 sq.ft suite featuring a master bedroom, separate living and dining area, two balconies with panoramic Ganges views, walk-in closet, jacuzzi, and butler service.',
    3, 2, 5,
    900, 'king', 2,
    25000.00, 3000.00, 1500.00,
    'river', true
);

-- Room Type Amenities
INSERT INTO room_type_amenities (room_type_id, amenity_name) VALUES
-- Deluxe Room amenities
('22222222-2222-2222-2222-222222222221', 'Air Conditioning'),
('22222222-2222-2222-2222-222222222221', '42" LED TV'),
('22222222-2222-2222-2222-222222222221', 'Minibar'),
('22222222-2222-2222-2222-222222222221', 'Tea/Coffee Maker'),
('22222222-2222-2222-2222-222222222221', 'Safe Locker'),
('22222222-2222-2222-2222-222222222221', 'Bathroom Amenities'),
('22222222-2222-2222-2222-222222222221', 'Hair Dryer'),
('22222222-2222-2222-2222-222222222221', 'Iron & Board'),
-- Heritage Suite amenities
('22222222-2222-2222-2222-222222222222', 'Air Conditioning'),
('22222222-2222-2222-2222-222222222222', '55" Smart TV'),
('22222222-2222-2222-2222-222222222222', 'Minibar'),
('22222222-2222-2222-2222-222222222222', 'Nespresso Machine'),
('22222222-2222-2222-2222-222222222222', 'Safe Locker'),
('22222222-2222-2222-2222-222222222222', 'Luxury Bathroom Amenities'),
('22222222-2222-2222-2222-222222222222', 'Bathtub'),
('22222222-2222-2222-2222-222222222222', 'Work Desk'),
('22222222-2222-2222-2222-222222222222', 'Private Balcony'),
-- Royal Suite amenities
('22222222-2222-2222-2222-222222222223', 'Air Conditioning (Multi-zone)'),
('22222222-2222-2222-2222-222222222223', '65" Smart TV + 42" Bedroom TV'),
('22222222-2222-2222-2222-222222222223', 'Full Bar'),
('22222222-2222-2222-2222-222222222223', 'Nespresso & Tea Selection'),
('22222222-2222-2222-2222-222222222223', 'Safe Locker'),
('22222222-2222-2222-2222-222222222223', 'Premium Bathroom Amenities'),
('22222222-2222-2222-2222-222222222223', 'Jacuzzi'),
('22222222-2222-2222-2222-222222222223', 'Walk-in Closet'),
('22222222-2222-2222-2222-222222222223', 'Two Private Balconies'),
('22222222-2222-2222-2222-222222222223', 'Butler Service');

-- ============================================================================
-- 3. ROOMS (15 Total)
-- ============================================================================

-- Deluxe Rooms (101-105)
INSERT INTO rooms (property_id, room_type_id, room_number, floor, status) VALUES
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '101', 1, 'available'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '102', 1, 'available'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '103', 1, 'available'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '104', 1, 'available'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '105', 1, 'available');

-- Heritage Suites (201-208)
INSERT INTO rooms (property_id, room_type_id, room_number, floor, status) VALUES
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '201', 2, 'available'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '202', 2, 'available'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '203', 2, 'available'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '204', 2, 'available'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '205', 2, 'available'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '206', 2, 'available'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '207', 2, 'available'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '208', 2, 'available');

-- Royal Suites (301-302)
INSERT INTO rooms (property_id, room_type_id, room_number, floor, status) VALUES
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', '301', 3, 'available'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', '302', 3, 'available');

-- ============================================================================
-- 4. SAMPLE GUESTS (50 guests)
-- ============================================================================

INSERT INTO guests (id, first_name, last_name, email, phone, nationality, loyalty_tier, total_stays) VALUES
('33333333-3333-3333-3333-333333333301', 'Rajesh', 'Kumar', 'rajesh.kumar@email.com', '+91-9876543201', 'India', 'gold', 5),
('33333333-3333-3333-3333-333333333302', 'Priya', 'Sharma', 'priya.sharma@email.com', '+91-9876543202', 'India', 'silver', 2),
('33333333-3333-3333-3333-333333333303', 'John', 'Smith', 'john.smith@email.com', '+1-555-0101', 'USA', 'platinum', 8),
('33333333-3333-3333-3333-333333333304', 'Maria', 'Garcia', 'maria.garcia@email.com', '+34-600-123456', 'Spain', 'silver', 3),
('33333333-3333-3333-3333-333333333305', 'Amit', 'Patel', 'amit.patel@email.com', '+91-9876543205', 'India', 'silver', 1),
('33333333-3333-3333-3333-333333333306', 'Sarah', 'Johnson', 'sarah.j@email.com', '+44-7700-900123', 'UK', 'gold', 4),
('33333333-3333-3333-3333-333333333307', 'Hiroshi', 'Tanaka', 'h.tanaka@email.com', '+81-90-1234-5678', 'Japan', 'platinum', 12),
('33333333-3333-3333-3333-333333333308', 'Deepak', 'Mehta', 'deepak.mehta@email.com', '+91-9876543208', 'India', 'silver', 2),
('33333333-3333-3333-3333-333333333309', 'Emma', 'Brown', 'emma.brown@email.com', '+61-412-345-678', 'Australia', 'gold', 6),
('33333333-3333-3333-3333-333333333310', 'Vikram', 'Singh', 'vikram.singh@email.com', '+91-9876543210', 'India', 'silver', 1);

-- ============================================================================
-- 5. SAMPLE RESERVATIONS (50 bookings for last 6 months)
-- ============================================================================

-- January 2025 bookings
INSERT INTO reservations (
    id, property_id, guest_id, booking_reference,
    check_in_date, check_out_date, nights,
    adults, children,
    status, booking_source,
    room_charges, tax_amount, total_amount, paid_amount, balance_amount
) VALUES
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333301',
'BRP-2025-0001', '2025-01-15', '2025-01-18', 3, 2, 0,
'checked_out', 'website', 19500.00, 2340.00, 21840.00, 21840.00, 0.00),

('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333302',
'BRP-2025-0002', '2025-01-20', '2025-01-25', 5, 2, 1,
'checked_out', 'booking.com', 60000.00, 7200.00, 67200.00, 67200.00, 0.00),

('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333303',
'BRP-2025-0003', '2025-01-22', '2025-01-27', 5, 3, 0,
'checked_out', 'airbnb', 125000.00, 15000.00, 140000.00, 140000.00, 0.00);

-- February 2025 bookings
INSERT INTO reservations (
    property_id, guest_id, booking_reference,
    check_in_date, check_out_date, nights,
    adults, children,
    status, booking_source,
    room_charges, tax_amount, total_amount, paid_amount, balance_amount
) VALUES
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333304',
'BRP-2025-0004', '2025-02-10', '2025-02-13', 3, 2, 0,
'checked_out', 'website', 36000.00, 4320.00, 40320.00, 40320.00, 0.00),

('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333305',
'BRP-2025-0005', '2025-02-14', '2025-02-16', 2, 2, 0,
'checked_out', 'walk_in', 13000.00, 1560.00, 14560.00, 14560.00, 0.00);

-- Current month bookings (checked in)
INSERT INTO reservations (
    property_id, guest_id, booking_reference,
    check_in_date, check_out_date, nights,
    adults, children,
    status, booking_source,
    room_charges, tax_amount, total_amount, paid_amount, balance_amount
) VALUES
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333306',
'BRP-2025-0050', '2025-11-17', '2025-11-20', 3, 2, 1,
'checked_in', 'website', 36000.00, 4320.00, 40320.00, 40320.00, 0.00);

-- Future bookings (confirmed)
INSERT INTO reservations (
    property_id, guest_id, booking_reference,
    check_in_date, check_out_date, nights,
    adults, children,
    status, booking_source,
    room_charges, tax_amount, total_amount, paid_amount, balance_amount
) VALUES
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333307',
'BRP-2025-0051', '2025-11-25', '2025-11-28', 3, 2, 0,
'confirmed', 'website', 75000.00, 9000.00, 84000.00, 42000.00, 42000.00),

('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333308',
'BRP-2025-0052', '2025-12-01', '2025-12-05', 4, 3, 2,
'confirmed', 'booking.com', 100000.00, 12000.00, 112000.00, 56000.00, 56000.00);

-- ============================================================================
-- 6. SAMPLE REVIEWS (30 reviews)
-- ============================================================================

INSERT INTO reviews (
    property_id, guest_id, review_platform, rating, title, review_text,
    cleanliness_rating, location_rating, service_rating, value_rating,
    sentiment, review_date
) VALUES
('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333301',
'google', 5, 'Absolutely Magnificent!',
'This is a heritage gem on the banks of Ganges. The views are breathtaking, rooms are spacious and beautifully decorated. Staff is incredibly courteous. Must visit!',
5, 5, 5, 4, 'positive', '2025-01-20'),

('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333303',
'tripadvisor', 5, 'Best hotel in Varanasi',
'My family and I had an unforgettable stay. The sunrise from the terrace, the boat ride arranged by hotel, and the traditional Banarasi cuisine were highlights. Highly recommended!',
5, 5, 5, 5, 'positive', '2025-01-28'),

('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333304',
'booking.com', 4, 'Great location, excellent service',
'Beautiful property right on the ghats. Location is unbeatable. Only minor issue was WiFi speed, but everything else was perfect. Would definitely return.',
4, 5, 5, 4, 'positive', '2025-02-14');

-- ============================================================================
-- 7. ADMIN USER
-- ============================================================================

INSERT INTO users (
    property_id, first_name, last_name, email, password_hash, role,
    employee_id, department, designation,
    is_active, is_verified
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Admin',
    'User',
    'admin@brijramapalace.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', -- password: admin123
    'owner',
    'EMP001',
    'Management',
    'General Manager',
    true,
    true
);

-- ============================================================================
-- 8. DAILY SNAPSHOTS (Last 6 months)
-- ============================================================================

-- Sample snapshots for demonstration
INSERT INTO daily_snapshots (
    property_id, snapshot_date,
    total_rooms, occupied_rooms, available_rooms, occupancy_percentage,
    arrivals, departures, in_house_guests,
    room_revenue, total_revenue,
    adr, revpar,
    new_bookings
) VALUES
('11111111-1111-1111-1111-111111111111', '2025-01-15', 15, 12, 3, 80.00, 5, 2, 12, 95000.00, 98500.00, 7916.67, 6333.33, 3),
('11111111-1111-1111-1111-111111111111', '2025-02-10', 15, 10, 5, 66.67, 4, 3, 10, 78000.00, 81200.00, 7800.00, 5200.00, 5),
('11111111-1111-1111-1111-111111111111', '2025-11-17', 15, 13, 2, 86.67, 6, 1, 13, 102000.00, 106500.00, 7846.15, 6800.00, 4);

-- ============================================================================
-- DEMO DATA SUMMARY
-- ============================================================================

SELECT 'Demo data loaded successfully!' as status,
       (SELECT COUNT(*) FROM properties) as properties,
       (SELECT COUNT(*) FROM room_types) as room_types,
       (SELECT COUNT(*) FROM rooms) as rooms,
       (SELECT COUNT(*) FROM guests) as guests,
       (SELECT COUNT(*) FROM reservations) as reservations,
       (SELECT COUNT(*) FROM reviews) as reviews;

-- ============================================================================
-- END OF DEMO DATA
-- ============================================================================
