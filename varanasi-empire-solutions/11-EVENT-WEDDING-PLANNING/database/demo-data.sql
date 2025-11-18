-- ============================================================================
-- EVENT & WEDDING PLANNING - Comprehensive Demo Data
-- Varanasi Focus: Wedding Events, Corporate Functions, Vendor Management
-- ============================================================================

SET search_path TO public, demo_helpers;

-- ============================================================================
-- EVENT COMPANIES (2-3 event planning companies)
-- ============================================================================
INSERT INTO event_companies (company_name, gstin, address, city, phone, email, specialization, is_active) VALUES
('Varanasi Grand Events', '09AAEFG1234A1Z5', '45 Laxmi Nagar, Event Management Complex, Varanasi', 'Varanasi', '9876543700', 'info@varanasi-grand-events.in', ARRAY['WEDDING', 'CORPORATE', 'ANNIVERSARY'], true),
('Lucknow Celebrations Limited', '09AAGFS5678B1Z5', '123 Hazratganj, Lucknow Wedding District', 'Lucknow', '9876543701', 'contact@lucknow-celebrations.in', ARRAY['WEDDING', 'BIRTHDAY', 'CONFERENCE'], true),
('Agra Moments Event Management', '09AABFG9012C1Z5', 'Taj Park Lane, Agra Event Hub', 'Agra', '9876543702', 'events@agra-moments.in', ARRAY['WEDDING', 'CORPORATE', 'ANNIVERSARY', 'SOCIAL'], true);

-- ============================================================================
-- VENDOR CATEGORIES
-- ============================================================================
INSERT INTO vendor_categories (category_name, created_at) VALUES
('Catering & Food', '2024-01-01'),
('Decoration & Florals', '2024-01-01'),
('Photography & Videography', '2024-01-01'),
('Venues', '2024-01-01'),
('Entertainment', '2024-01-01'),
('Transportation', '2024-01-01'),
('Bridal & Makeup', '2024-01-01'),
('Music & DJ', '2024-01-01'),
('Invitation & Design', '2024-01-01'),
('Wedding Attire', '2024-01-01');

-- ============================================================================
-- VENDORS (20+ vendors across different categories)
-- ============================================================================
INSERT INTO vendors (vendor_code, vendor_name, category_id, contact_person, phone, email, address, city, services_offered, rating, base_price, is_active) VALUES
-- Catering
('VEND001', 'Spice Route Catering', (SELECT id FROM vendor_categories WHERE category_name = 'Catering & Food'), 'Rajesh Kumar', '9876543750', 'chef@spice-route.in', 'Katra, Varanasi', 'Varanasi', ARRAY['North Indian', 'South Indian', 'Continental', 'Chinese'], 4.8, 500.00, true),
('VEND002', 'Royal Feast Catering', (SELECT id FROM vendor_categories WHERE category_name = 'Catering & Food'), 'Anil Verma', '9876543751', 'orders@royal-feast.in', 'Lakshmapuri, Varanasi', 'Varanasi', ARRAY['Mughlai', 'Vegetarian', 'Seafood', 'Desserts'], 4.7, 550.00, true),
('VEND003', 'Lucknow Food Extravaganza', (SELECT id FROM vendor_categories WHERE category_name = 'Catering & Food'), 'Priya Singh', '9876543752', 'info@lucknow-food.in', 'Hazratganj, Lucknow', 'Lucknow', ARRAY['Awadhi Cuisine', 'Biryani', 'Kebabs', 'International'], 4.9, 600.00, true),
-- Decoration
('VEND004', 'Floral Dreams Decoration', (SELECT id FROM vendor_categories WHERE category_name = 'Decoration & Florals'), 'Meera Patel', '9876543753', 'flowers@floral-dreams.in', 'Assi, Varanasi', 'Varanasi', ARRAY['Flower Arrangements', 'Stage Decoration', 'Entrance Gate Design'], 4.8, 15000.00, true),
('VEND005', 'Golden Threads Decoration', (SELECT id FROM vendor_categories WHERE category_name = 'Decoration & Florals'), 'Sneha Sharma', '9876543754', 'design@golden-threads.in', 'Civil Lines, Lucknow', 'Lucknow', ARRAY['Wedding Decor', 'Theme Decoration', 'Tent Arrangement'], 4.9, 18000.00, true),
('VEND006', 'Taj Floral Studio', (SELECT id FROM vendor_categories WHERE category_name = 'Decoration & Florals'), 'Arjun Kumar', '9876543755', 'flowers@taj-floral.in', 'Tajganj, Agra', 'Agra', ARRAY['Wedding Flowers', 'Garland Making', 'Mandap Decoration'], 4.7, 16000.00, true),
-- Photography & Videography
('VEND007', 'Eternal Moments Photography', (SELECT id FROM vendor_categories WHERE category_name = 'Photography & Videography'), 'Vikram Singh', '9876543756', 'captures@eternal-moments.in', 'Bandholaav, Varanasi', 'Varanasi', ARRAY['Wedding Photography', '4K Videography', 'Drone Shots', 'Album Printing'], 4.9, 35000.00, true),
('VEND008', 'Lens & Light Studio', (SELECT id FROM vendor_categories WHERE category_name = 'Photography & Videography'), 'Arun Gupta', '9876543757', 'studio@lens-light.in', 'Saket, Lucknow', 'Lucknow', ARRAY['Professional Photography', 'Cinematography', 'Pre-wedding Shoots'], 4.8, 40000.00, true),
('VEND009', 'Heritage Captures', (SELECT id FROM vendor_categories WHERE category_name = 'Photography & Videography'), 'Deepak Yadav', '9876543758', 'heritage@captures.in', 'Fatehabad Road, Agra', 'Agra', ARRAY['Event Photography', 'Videography', 'Editing Services'], 4.7, 32000.00, true),
-- Venues
('VEND010', 'Ghat View Banquet', (SELECT id FROM vendor_categories WHERE category_name = 'Venues'), 'Rajesh Mishra', '9876543759', 'booking@ghat-view.in', 'Dashashwamedh Ghat, Varanasi', 'Varanasi', ARRAY['Wedding Venue', 'Reception Hall', 'Capacity 500-1000'], 4.8, 80000.00, true),
('VEND011', 'Ganges Palace Venue', (SELECT id FROM vendor_categories WHERE category_name = 'Venues'), 'Priya Verma', '9876543760', 'events@ganges-palace.in', 'Maidagin, Varanasi', 'Varanasi', ARRAY['Indoor & Outdoor', 'Wedding Functions', 'Capacity 1000-2000'], 4.9, 100000.00, true),
('VEND012', 'Lucknow Grand Hall', (SELECT id FROM vendor_categories WHERE category_name = 'Venues'), 'Ashok Kumar', '9876543761', 'halls@lucknow-grand.in', 'Gomti Nagar, Lucknow', 'Lucknow', ARRAY['Banquet Hall', 'Conference Room', 'Capacity 800-1500'], 4.7, 90000.00, true),
-- Entertainment
('VEND013', 'Shahi Nights Entertainment', (SELECT id FROM vendor_categories WHERE category_name = 'Entertainment'), 'Suresh Singh', '9876543762', 'book@shahi-nights.in', 'Assi, Varanasi', 'Varanasi', ARRAY['Live Band', 'Dancers', 'Mehendi Program'], 4.8, 25000.00, true),
('VEND014', 'Harmony DJ Services', (SELECT id FROM vendor_categories WHERE category_name = 'Music & DJ'), 'Nikhil Sharma', '9876543763', 'music@harmony-dj.in', 'Cantonment, Lucknow', 'Lucknow', ARRAY['DJ Services', 'Sound System', 'Lighting'], 4.6, 12000.00, true),
-- Photography
('VEND015', 'Bridal Beauty Studio', (SELECT id FROM vendor_categories WHERE category_name = 'Bridal & Makeup'), 'Neha Singh', '9876543764', 'makeup@bridal-beauty.in', 'Lakshmapuri, Varanasi', 'Varanasi', ARRAY['Bridal Makeup', 'Hair Styling', 'Mehendi Design'], 4.9, 8000.00, true),
('VEND016', 'Glamour Faces Makeup', (SELECT id FROM vendor_categories WHERE category_name = 'Bridal & Makeup'), 'Divya Patel', '9876543765', 'beauty@glamour-faces.in', 'Naubasta, Lucknow', 'Lucknow', ARRAY['Professional Makeup', 'Bridal Package', 'Party Makeup'], 4.7, 7500.00, true),
-- Transportation
('VEND017', 'Royal Carriages Transport', (SELECT id FROM vendor_categories WHERE category_name = 'Transportation'), 'Rajesh Yadav', '9876543766', 'cars@royal-carriages.in', 'Cantonment, Varanasi', 'Varanasi', ARRAY['Luxury Cars', 'Buses', 'Wedding Convoy'], 4.8, 3000.00, true),
('VEND018', 'Elite Travel Solutions', (SELECT id FROM vendor_categories WHERE category_name = 'Transportation'), 'Arun Singh', '9876543767', 'transport@elite-travel.in', 'Aliganj, Lucknow', 'Lucknow', ARRAY['Premium Vehicles', 'Coach Service', 'Airport Transfer'], 4.6, 3500.00, true),
-- Invitations & Design
('VEND019', 'Design & Print Studio', (SELECT id FROM vendor_categories WHERE category_name = 'Invitation & Design'), 'Priya Gupta', '9876543768', 'design@print-studio.in', 'Chowk, Varanasi', 'Varanasi', ARRAY['Invitation Cards', 'Wedding Prints', 'Custom Design'], 4.7, 500.00, true),
('VEND020', 'Creative Invitations Plus', (SELECT id FROM vendor_categories WHERE category_name = 'Invitation & Design'), 'Sneha Sharma', '9876543769', 'creative@invitations.in', 'Hazratganj, Lucknow', 'Lucknow', ARRAY['Digital Invitations', 'Printing', 'Card Design'], 4.8, 600.00, true);

-- ============================================================================
-- CLIENTS (25+ clients)
-- ============================================================================
INSERT INTO clients (client_code, first_name, last_name, phone, email, address, city, budget_min, budget_max, created_at) VALUES
('CLI001', 'Rajesh', 'Sharma', '9876543800', 'rajesh.sharma@email.com', 'Flat 301, Heritage Heights, Varanasi', 'Varanasi', 500000.00, 1500000.00, '2024-09-01'),
('CLI002', 'Priya', 'Singh', '9876543801', 'priya.singh@email.com', 'House 45, Ascot Gardens, Varanasi', 'Varanasi', 750000.00, 2000000.00, '2024-09-02'),
('CLI003', 'Amit', 'Verma', '9876543802', 'amit.verma@email.com', 'Apartment 12, Lucknow Heights, Lucknow', 'Lucknow', 600000.00, 1800000.00, '2024-09-03'),
('CLI004', 'Anjali', 'Patel', '9876543803', 'anjali.patel@email.com', 'Flat 205, Taj Enclave, Agra', 'Agra', 1000000.00, 2500000.00, '2024-09-04'),
('CLI005', 'Vikram', 'Pandey', '9876543804', 'vikram.pandey@email.com', 'House 78, Cantonment, Varanasi', 'Varanasi', 700000.00, 1900000.00, '2024-09-05'),
('CLI006', 'Neha', 'Gupta', '9876543805', 'neha.gupta@email.com', 'Apartment 8, Gomti Vihar, Lucknow', 'Lucknow', 550000.00, 1600000.00, '2024-09-06'),
('CLI007', 'Arjun', 'Singh', '9876543806', 'arjun.singh@email.com', 'Villa 5, Scholar Nagar, Varanasi', 'Varanasi', 800000.00, 2200000.00, '2024-09-07'),
('CLI008', 'Divya', 'Kumar', '9876543807', 'divya.kumar@email.com', 'Flat 102, Medical Gardens, Agra', 'Agra', 650000.00, 1700000.00, '2024-09-08'),
('CLI009', 'Suresh', 'Mishra', '9876543808', 'suresh.mishra@email.com', 'House 156, Saket, Lucknow', 'Lucknow', 900000.00, 2400000.00, '2024-09-09'),
('CLI010', 'Meera', 'Sharma', '9876543809', 'meera.sharma@email.com', 'Apartment 15, Riverside, Varanasi', 'Varanasi', 500000.00, 1400000.00, '2024-09-10'),
('CLI011', 'Rohit', 'Yadav', '9876543810', 'rohit.yadav@email.com', 'House 234, Green Park, Lucknow', 'Lucknow', 700000.00, 2000000.00, '2024-09-11'),
('CLI012', 'Pooja', 'Desai', '9876543811', 'pooja.desai@email.com', 'Flat 401, Premium Plaza, Agra', 'Agra', 1200000.00, 3000000.00, '2024-09-12'),
('CLI013', 'Kavya', 'Singh', '9876543812', 'kavya.singh@email.com', 'Apartment 7, Heritage Complex, Varanasi', 'Varanasi', 600000.00, 1700000.00, '2024-09-13'),
('CLI014', 'Ashok', 'Trivedi', '9876543813', 'ashok.trivedi@email.com', 'House 89, Civil Lines, Lucknow', 'Lucknow', 800000.00, 2100000.00, '2024-09-14'),
('CLI015', 'Sunita', 'Patel', '9876543814', 'sunita.patel@email.com', 'Villa 8, Exclusive Homes, Agra', 'Agra', 900000.00, 2300000.00, '2024-09-15'),
('CLI016', 'Deepak', 'Singh', '9876543815', 'deepak.singh@email.com', 'Flat 206, Garden View, Varanasi', 'Varanasi', 550000.00, 1550000.00, '2024-09-16'),
('CLI017', 'Richa', 'Saxena', '9876543816', 'richa.saxena@email.com', 'Apartment 11, Nagar Vihar, Lucknow', 'Lucknow', 650000.00, 1850000.00, '2024-09-17'),
('CLI018', 'Sanjeev', 'Agarwal', '9876543817', 'sanjeev.agarwal@email.com', 'House 145, Sadar Bazar, Agra', 'Agra', 700000.00, 1900000.00, '2024-09-18'),
('CLI019', 'Nidhi', 'Kumar', '9876543818', 'nidhi.kumar@email.com', 'Flat 303, Elegance Towers, Varanasi', 'Varanasi', 1000000.00, 2800000.00, '2024-09-19'),
('CLI020', 'Varun', 'Sharma', '9876543819', 'varun.sharma@email.com', 'Villa 12, Golden Park, Lucknow', 'Lucknow', 850000.00, 2200000.00, '2024-09-20'),
('CLI021', 'Shreya', 'Singh', '9876543820', 'shreya.singh@email.com', 'Apartment 9, Manor Residency, Agra', 'Agra', 750000.00, 2000000.00, '2024-09-21'),
('CLI022', 'Aditya', 'Patel', '9876543821', 'aditya.patel@email.com', 'House 201, Aliganj, Lucknow', 'Lucknow', 600000.00, 1600000.00, '2024-09-22'),
('CLI023', 'Disha', 'Verma', '9876543822', 'disha.verma@email.com', 'Flat 105, Shiva Residency, Varanasi', 'Varanasi', 800000.00, 2100000.00, '2024-09-23'),
('CLI024', 'Ravi', 'Mishra', '9876543823', 'ravi.mishra@email.com', 'Apartment 14, Premium Circle, Lucknow', 'Lucknow', 1100000.00, 2900000.00, '2024-09-24'),
('CLI025', 'Sakshi', 'Gupta', '9876543824', 'sakshi.gupta@email.com', 'Villa 10, Super Luxury, Agra', 'Agra', 1500000.00, 3500000.00, '2024-09-25');

-- ============================================================================
-- EVENTS (15+ events)
-- ============================================================================
INSERT INTO events (company_id, client_id, event_number, event_name, event_type, event_date, event_time, expected_guests, bride_name, groom_name, wedding_date, mehendi_date, sangeet_date, reception_date, venue_name, venue_address, venue_city, venue_capacity, total_budget, estimated_cost, event_status, created_at) VALUES
-- Wedding Events
((SELECT id FROM event_companies WHERE company_name = 'Varanasi Grand Events'), (SELECT id FROM clients WHERE client_code = 'CLI001'), 'EVT001', 'Sharma-Singh Wedding', 'WEDDING', '2024-12-15', '19:00:00', 800, 'Priya', 'Rajesh', '2024-12-15', '2024-12-10', '2024-12-11', '2024-12-16', 'Ghat View Banquet', 'Dashashwamedh Ghat Area', 'Varanasi', 1000, 1200000.00, 1180000.00, 'CONFIRMED', '2024-09-01'),
((SELECT id FROM event_companies WHERE company_name = 'Varanasi Grand Events'), (SELECT id FROM clients WHERE client_code = 'CLI002'), 'EVT002', 'Singh-Patel Grand Wedding', 'WEDDING', '2025-01-20', '18:30:00', 1200, 'Anjali', 'Amit', '2025-01-20', '2025-01-15', '2025-01-16', '2025-01-21', 'Ganges Palace Venue', 'Maidagin, Varanasi', 'Varanasi', 1500, 1800000.00, 1750000.00, 'PLANNING', '2024-09-02'),
((SELECT id FROM event_companies WHERE company_name = 'Lucknow Celebrations Limited'), (SELECT id FROM clients WHERE client_code = 'CLI003'), 'EVT003', 'Verma-Mishra Wedding Extravaganza', 'WEDDING', '2024-12-28', '19:30:00', 900, 'Neha', 'Vikram', '2024-12-28', '2024-12-23', '2024-12-24', '2024-12-29', 'Lucknow Grand Hall', 'Gomti Nagar, Lucknow', 'Lucknow', 1200, 1600000.00, 1550000.00, 'CONFIRMED', '2024-09-03'),
((SELECT id FROM event_companies WHERE company_name = 'Agra Moments Event Management'), (SELECT id FROM clients WHERE client_code = 'CLI004'), 'EVT004', 'Patel Royal Wedding', 'WEDDING', '2025-02-10', '19:00:00', 1500, 'Divya', 'Arjun', '2025-02-10', '2025-02-05', '2025-02-06', '2025-02-11', 'Heritage Palace Agra', 'Fatehabad Road, Agra', 'Agra', 2000, 2200000.00, 2150000.00, 'PLANNING', '2024-09-04'),
((SELECT id FROM event_companies WHERE company_name = 'Varanasi Grand Events'), (SELECT id FROM clients WHERE client_code = 'CLI005'), 'EVT005', 'Pandey Celebration 2024', 'WEDDING', '2025-01-05', '18:00:00', 700, 'Meera', 'Suresh', '2025-01-05', '2025-01-01', '2025-01-02', '2025-01-06', 'Ghat View Banquet', 'Dashashwamedh Ghat Area', 'Varanasi', 800, 950000.00, 920000.00, 'PLANNING', '2024-09-05'),
((SELECT id FROM event_companies WHERE company_name = 'Lucknow Celebrations Limited'), (SELECT id FROM clients WHERE client_code = 'CLI006'), 'EVT006', 'Gupta-Kumar Wedding', 'WEDDING', '2025-03-15', '19:30:00', 650, 'Pooja', 'Rohit', '2025-03-15', '2025-03-10', '2025-03-11', '2025-03-16', 'Lucknow Grand Hall', 'Gomti Nagar, Lucknow', 'Lucknow', 900, 850000.00, 820000.00, 'PLANNING', '2024-09-06'),
-- Corporate Events
((SELECT id FROM event_companies WHERE company_name = 'Varanasi Grand Events'), (SELECT id FROM clients WHERE client_code = 'CLI009'), 'EVT007', 'Tech Innovation Summit 2024', 'CORPORATE_EVENT', '2024-12-05', '09:00:00', 400, NULL, NULL, NULL, NULL, NULL, NULL, 'Ghat View Banquet', 'Dashashwamedh Ghat Area', 'Varanasi', 500, 500000.00, 480000.00, 'CONFIRMED', '2024-10-01'),
((SELECT id FROM event_companies WHERE company_name = 'Lucknow Celebrations Limited'), (SELECT id FROM clients WHERE client_code = 'CLI012'), 'EVT008', 'Annual Business Conference', 'CORPORATE_EVENT', '2024-12-18', '08:30:00', 350, NULL, NULL, NULL, NULL, NULL, NULL, 'Lucknow Grand Hall', 'Gomti Nagar, Lucknow', 'Lucknow', 400, 450000.00, 430000.00, 'CONFIRMED', '2024-10-02'),
((SELECT id FROM event_companies WHERE company_name = 'Agra Moments Event Management'), (SELECT id FROM clients WHERE client_code = 'CLI015'), 'EVT009', 'Taj Tourism Conference', 'CORPORATE_EVENT', '2025-01-30', '09:30:00', 300, NULL, NULL, NULL, NULL, NULL, NULL, 'Heritage Palace Agra', 'Fatehabad Road, Agra', 'Agra', 350, 350000.00, 330000.00, 'PLANNING', '2024-10-03'),
-- Birthday Celebrations
((SELECT id FROM event_companies WHERE company_name = 'Varanasi Grand Events'), (SELECT id FROM clients WHERE client_code = 'CLI007'), 'EVT010', '40th Birthday Grand Celebration', 'BIRTHDAY', '2024-12-10', '18:00:00', 200, NULL, NULL, NULL, NULL, NULL, NULL, 'Ghat View Banquet', 'Dashashwamedh Ghat Area', 'Varanasi', 300, 300000.00, 280000.00, 'CONFIRMED', '2024-10-10'),
((SELECT id FROM event_companies WHERE company_name = 'Lucknow Celebrations Limited'), (SELECT id FROM clients WHERE client_code = 'CLI011'), 'EVT011', '50th Birthday Bash', 'BIRTHDAY', '2024-12-20', '19:00:00', 250, NULL, NULL, NULL, NULL, NULL, NULL, 'Lucknow Grand Hall', 'Gomti Nagar, Lucknow', 'Lucknow', 350, 350000.00, 330000.00, 'CONFIRMED', '2024-10-11'),
-- Social Events
((SELECT id FROM event_companies WHERE company_name = 'Agra Moments Event Management'), (SELECT id FROM clients WHERE client_code = 'CLI019'), 'EVT012', 'Charity Gala 2024', 'SOCIAL', '2025-02-28', '19:30:00', 500, NULL, NULL, NULL, NULL, NULL, NULL, 'Heritage Palace Agra', 'Fatehabad Road, Agra', 'Agra', 600, 600000.00, 580000.00, 'PLANNING', '2024-10-20'),
((SELECT id FROM event_companies WHERE company_name = 'Varanasi Grand Events'), (SELECT id FROM clients WHERE client_code = 'CLI008'), 'EVT013', 'Anniversary Celebration 25 Years', 'ANNIVERSARY', '2024-12-12', '18:30:00', 150, NULL, NULL, NULL, NULL, NULL, NULL, 'Ghat View Banquet', 'Dashashwamedh Ghat Area', 'Varanasi', 200, 250000.00, 240000.00, 'CONFIRMED', '2024-10-15'),
((SELECT id FROM event_companies WHERE company_name = 'Lucknow Celebrations Limited'), (SELECT id FROM clients WHERE client_code = 'CLI014'), 'EVT014', 'Golden Jubilee Family Reunion', 'SOCIAL', '2025-01-10', '17:00:00', 300, NULL, NULL, NULL, NULL, NULL, NULL, 'Lucknow Grand Hall', 'Gomti Nagar, Lucknow', 'Lucknow', 400, 400000.00, 380000.00, 'PLANNING', '2024-10-16'),
((SELECT id FROM event_companies WHERE company_name = 'Agra Moments Event Management'), (SELECT id FROM clients WHERE client_code = 'CLI025'), 'EVT015', 'Premium Corporate Gala Dinner', 'CORPORATE_EVENT', '2025-03-20', '19:00:00', 400, NULL, NULL, NULL, NULL, NULL, NULL, 'Heritage Palace Agra', 'Fatehabad Road, Agra', 'Agra', 500, 750000.00, 720000.00, 'PLANNING', '2024-10-25');

-- ============================================================================
-- EVENT VENDOR BOOKINGS (30+ vendor bookings)
-- ============================================================================
INSERT INTO event_vendors (event_id, vendor_id, service_description, quoted_price, final_price, advance_paid, balance_amount, payment_status, booking_status, created_at) VALUES
-- EVT001 - Sharma-Singh Wedding Vendors
((SELECT id FROM events WHERE event_number = 'EVT001'), (SELECT id FROM vendors WHERE vendor_code = 'VEND001'), 'Catering for 800 guests - North Indian Cuisine', 400000.00, 395000.00, 150000.00, 245000.00, 'PARTIAL', 'CONFIRMED', '2024-09-05'),
((SELECT id FROM events WHERE event_number = 'EVT001'), (SELECT id FROM vendors WHERE vendor_code = 'VEND004'), 'Complete Decoration - Stage & Entrance', 180000.00, 175000.00, 80000.00, 95000.00, 'PARTIAL', 'CONFIRMED', '2024-09-06'),
((SELECT id FROM events WHERE event_number = 'EVT001'), (SELECT id FROM vendors WHERE vendor_code = 'VEND007'), 'Wedding Photography & 4K Videography', 80000.00, 78000.00, 40000.00, 38000.00, 'PARTIAL', 'CONFIRMED', '2024-09-07'),
((SELECT id FROM events WHERE event_number = 'EVT001'), (SELECT id FROM vendors WHERE vendor_code = 'VEND013'), 'Live Band & Entertainment', 60000.00, 58000.00, 20000.00, 38000.00, 'PARTIAL', 'CONFIRMED', '2024-09-08'),
((SELECT id FROM events WHERE event_number = 'EVT001'), (SELECT id FROM vendors WHERE vendor_code = 'VEND015'), 'Bridal Makeup & Styling', 25000.00, 24000.00, 12000.00, 12000.00, 'PARTIAL', 'CONFIRMED', '2024-09-09'),
((SELECT id FROM events WHERE event_number = 'EVT001'), (SELECT id FROM vendors WHERE vendor_code = 'VEND017'), 'Wedding Car Convoy - 8 Luxury Cars', 36000.00, 35000.00, 15000.00, 20000.00, 'PARTIAL', 'CONFIRMED', '2024-09-10'),
-- EVT002 - Singh-Patel Wedding Vendors
((SELECT id FROM events WHERE event_number = 'EVT002'), (SELECT id FROM vendors WHERE vendor_code = 'VEND003'), 'Catering for 1200 guests - Mughlai Feast', 600000.00, 590000.00, 0.00, 590000.00, 'PENDING', 'CONFIRMED', '2024-09-11'),
((SELECT id FROM events WHERE event_number = 'EVT002'), (SELECT id FROM vendors WHERE vendor_code = 'VEND005'), 'Complete Theme Decoration - Golden Theme', 250000.00, 245000.00, 100000.00, 145000.00, 'PARTIAL', 'CONFIRMED', '2024-09-12'),
((SELECT id FROM events WHERE event_number = 'EVT002'), (SELECT id FROM vendors WHERE vendor_code = 'VEND008'), 'Professional Photography & Videography', 100000.00, 98000.00, 50000.00, 48000.00, 'PARTIAL', 'CONFIRMED', '2024-09-13'),
((SELECT id FROM events WHERE event_number = 'EVT002'), (SELECT id FROM vendors WHERE vendor_code = 'VEND014'), 'DJ & Sound System Services', 40000.00, 39000.00, 0.00, 39000.00, 'PENDING', 'CONFIRMED', '2024-09-14'),
((SELECT id FROM events WHERE event_number = 'EVT002'), (SELECT id FROM vendors WHERE vendor_code = 'VEND016'), 'Professional Bridal & Makeup Team', 30000.00, 29000.00, 10000.00, 19000.00, 'PARTIAL', 'CONFIRMED', '2024-09-15'),
-- EVT003 - Verma-Mishra Wedding Vendors
((SELECT id FROM events WHERE event_number = 'EVT003'), (SELECT id FROM vendors WHERE vendor_code = 'VEND002'), 'Catering for 900 guests - Vegetarian & Seafood', 480000.00, 475000.00, 200000.00, 275000.00, 'PARTIAL', 'CONFIRMED', '2024-09-16'),
((SELECT id FROM events WHERE event_number = 'EVT003'), (SELECT id FROM vendors WHERE vendor_code = 'VEND006'), 'Wedding Flowers & Mandap Decoration', 200000.00, 198000.00, 80000.00, 118000.00, 'PARTIAL', 'CONFIRMED', '2024-09-17'),
((SELECT id FROM events WHERE event_number = 'EVT003'), (SELECT id FROM vendors WHERE vendor_code = 'VEND009'), 'Event Photography & Videography', 85000.00, 84000.00, 42000.00, 42000.00, 'PARTIAL', 'CONFIRMED', '2024-09-18'),
((SELECT id FROM events WHERE event_number = 'EVT003'), (SELECT id FROM vendors WHERE vendor_code = 'VEND018'), 'Transportation - 6 Premium Vehicles', 30000.00, 29000.00, 10000.00, 19000.00, 'PARTIAL', 'CONFIRMED', '2024-09-19'),
-- EVT004 - Patel Royal Wedding Vendors
((SELECT id FROM events WHERE event_number = 'EVT004'), (SELECT id FROM vendors WHERE vendor_code = 'VEND003'), 'Catering for 1500 guests - Premium Awadhi Cuisine', 750000.00, 740000.00, 300000.00, 440000.00, 'PARTIAL', 'CONFIRMED', '2024-09-20'),
((SELECT id FROM events WHERE event_number = 'EVT004'), (SELECT id FROM vendors WHERE vendor_code = 'VEND005'), 'Complete Decoration - Royal Theme', 300000.00, 295000.00, 120000.00, 175000.00, 'PARTIAL', 'CONFIRMED', '2024-09-21'),
((SELECT id FROM events WHERE event_number = 'EVT004'), (SELECT id FROM vendors WHERE vendor_code = 'VEND008'), 'Cinema Quality Videography', 120000.00, 118000.00, 60000.00, 58000.00, 'PARTIAL', 'CONFIRMED', '2024-09-22'),
((SELECT id FROM events WHERE event_number = 'EVT004'), (SELECT id FROM vendors WHERE vendor_code = 'VEND013'), 'Live Orchestra & Entertainment', 80000.00, 78000.00, 30000.00, 48000.00, 'PARTIAL', 'CONFIRMED', '2024-09-23'),
((SELECT id FROM events WHERE event_number = 'EVT004'), (SELECT id FROM vendors WHERE vendor_code = 'VEND020'), 'Luxury Invitations & Printing', 15000.00, 14500.00, 7000.00, 7500.00, 'PARTIAL', 'CONFIRMED', '2024-09-24'),
-- EVT005 - Pandey Wedding Vendors
((SELECT id FROM events WHERE event_number = 'EVT005'), (SELECT id FROM vendors WHERE vendor_code = 'VEND001'), 'Catering for 700 guests', 350000.00, 345000.00, 150000.00, 195000.00, 'PARTIAL', 'CONFIRMED', '2024-09-25'),
((SELECT id FROM events WHERE event_number = 'EVT005'), (SELECT id FROM vendors WHERE vendor_code = 'VEND004'), 'Decoration Services', 160000.00, 155000.00, 70000.00, 85000.00, 'PARTIAL', 'CONFIRMED', '2024-09-26'),
((SELECT id FROM events WHERE event_number = 'EVT005'), (SELECT id FROM vendors WHERE vendor_code = 'VEND007'), 'Photography Services', 70000.00, 68000.00, 30000.00, 38000.00, 'PARTIAL', 'CONFIRMED', '2024-09-27'),
-- EVT007 - Corporate Event Vendors
((SELECT id FROM events WHERE event_number = 'EVT007'), (SELECT id FROM vendors WHERE vendor_code = 'VEND002'), 'Catering for 400 guests - Corporate Meal', 150000.00, 148000.00, 70000.00, 78000.00, 'PARTIAL', 'CONFIRMED', '2024-10-05'),
((SELECT id FROM events WHERE event_number = 'EVT007'), (SELECT id FROM vendors WHERE vendor_code = 'VEND014'), 'Sound System & DJ', 25000.00, 24000.00, 10000.00, 14000.00, 'PARTIAL', 'CONFIRMED', '2024-10-06'),
((SELECT id FROM events WHERE event_number = 'EVT007'), (SELECT id FROM vendors WHERE vendor_code = 'VEND019'), 'Event Printing & Invitations', 8000.00, 7800.00, 3000.00, 4800.00, 'PARTIAL', 'CONFIRMED', '2024-10-07'),
-- EVT010 - Birthday Celebration Vendors
((SELECT id FROM events WHERE event_number = 'EVT010'), (SELECT id FROM vendors WHERE vendor_code = 'VEND001'), 'Catering for 200 guests - Celebration Meal', 80000.00, 79000.00, 35000.00, 44000.00, 'PARTIAL', 'CONFIRMED', '2024-10-15'),
((SELECT id FROM events WHERE event_number = 'EVT010'), (SELECT id FROM vendors WHERE vendor_code = 'VEND004'), 'Decoration - Birthday Theme', 45000.00, 44000.00, 20000.00, 24000.00, 'PARTIAL', 'CONFIRMED', '2024-10-16'),
((SELECT id FROM events WHERE event_number = 'EVT010'), (SELECT id FROM vendors WHERE vendor_code = 'VEND014'), 'DJ Services', 15000.00, 14500.00, 7000.00, 7500.00, 'PARTIAL', 'CONFIRMED', '2024-10-17');

-- ============================================================================
-- EVENT TASKS/CHECKLIST (25+ tasks)
-- ============================================================================
INSERT INTO event_tasks (event_id, task_name, task_category, due_date, assigned_to, task_status, priority, created_at) VALUES
-- EVT001 Tasks
((SELECT id FROM events WHERE event_number = 'EVT001'), 'Finalize Guest List', 'PLANNING', '2024-11-01', 'Priya Singh', 'PENDING', 'HIGH', '2024-09-05'),
((SELECT id FROM events WHERE event_number = 'EVT001'), 'Confirm Catering Order', 'VENDOR', '2024-11-15', 'Event Manager', 'IN_PROGRESS', 'HIGH', '2024-09-06'),
((SELECT id FROM events WHERE event_number = 'EVT001'), 'Prepare Decoration Theme', 'DECORATION', '2024-11-10', 'Decoration Team', 'IN_PROGRESS', 'HIGH', '2024-09-07'),
((SELECT id FROM events WHERE event_number = 'EVT001'), 'Wedding Attire Selection', 'BRIDE_GROOM', '2024-10-30', 'Bridal Team', 'PENDING', 'MEDIUM', '2024-09-08'),
((SELECT id FROM events WHERE event_number = 'EVT001'), 'Photography Session Brief', 'PHOTOGRAPHY', '2024-12-01', 'Photographer', 'PENDING', 'MEDIUM', '2024-09-09'),
((SELECT id FROM events WHERE event_number = 'EVT001'), 'Mehendi Planning', 'FUNCTIONS', '2024-12-05', 'Event Coordinator', 'IN_PROGRESS', 'HIGH', '2024-09-10'),
((SELECT id FROM events WHERE event_number = 'EVT001'), 'Sangeet Function Arrangement', 'FUNCTIONS', '2024-12-08', 'Entertainment Manager', 'PENDING', 'HIGH', '2024-09-11'),
((SELECT id FROM events WHERE event_number = 'EVT001'), 'Prepare Digital Invitations', 'INVITATIONS', '2024-11-20', 'Admin Team', 'COMPLETED', 'MEDIUM', '2024-09-12'),
((SELECT id FROM events WHERE event_number = 'EVT001'), 'Transport Arrangement Confirmation', 'LOGISTICS', '2024-12-10', 'Logistics Team', 'IN_PROGRESS', 'MEDIUM', '2024-09-13'),
((SELECT id FROM events WHERE event_number = 'EVT001'), 'Lighting Setup', 'DECORATION', '2024-12-13', 'Technical Team', 'PENDING', 'MEDIUM', '2024-09-14'),
-- EVT002 Tasks
((SELECT id FROM events WHERE event_number = 'EVT002'), 'Venue Final Inspection', 'VENUE', '2025-01-10', 'Venue Manager', 'PENDING', 'HIGH', '2024-09-11'),
((SELECT id FROM events WHERE event_number = 'EVT002'), 'Guest Accommodation Booking', 'LOGISTICS', '2024-12-15', 'Travel Coordinator', 'PENDING', 'MEDIUM', '2024-09-12'),
((SELECT id FROM events WHERE event_number = 'EVT002'), 'Wedding Shopping Final List', 'BRIDE_GROOM', '2024-12-30', 'Bride', 'PENDING', 'HIGH', '2024-09-13'),
((SELECT id FROM events WHERE event_number = 'EVT002'), 'Confirm All Vendors', 'VENDOR', '2025-01-01', 'Event Manager', 'PENDING', 'HIGH', '2024-09-14'),
((SELECT id FROM events WHERE event_number = 'EVT002'), 'Seating Arrangement Plan', 'PLANNING', '2025-01-05', 'Planner', 'PENDING', 'MEDIUM', '2024-09-15'),
-- EVT003 Tasks
((SELECT id FROM events WHERE event_number = 'EVT003'), 'Finalize Wedding Date & Venue', 'PLANNING', '2024-11-01', 'Event Coordinator', 'COMPLETED', 'HIGH', '2024-09-16'),
((SELECT id FROM events WHERE event_number = 'EVT003'), 'Book Photography Team', 'PHOTOGRAPHY', '2024-11-15', 'Event Manager', 'COMPLETED', 'HIGH', '2024-09-17'),
((SELECT id FROM events WHERE event_number = 'EVT003'), 'Send Wedding Invitations', 'INVITATIONS', '2024-11-20', 'Admin', 'COMPLETED', 'MEDIUM', '2024-09-18'),
((SELECT id FROM events WHERE event_number = 'EVT003'), 'Confirm Catering Numbers', 'VENDOR', '2024-12-15', 'Event Coordinator', 'IN_PROGRESS', 'HIGH', '2024-09-19'),
((SELECT id FROM events WHERE event_number = 'EVT003'), 'Wedding Rehearsal', 'FUNCTIONS', '2024-12-20', 'Bride & Groom', 'PENDING', 'MEDIUM', '2024-09-20'),
-- EVT007 Tasks
((SELECT id FROM events WHERE event_number = 'EVT007'), 'Conference Agenda Finalization', 'PLANNING', '2024-11-20', 'Conference Director', 'IN_PROGRESS', 'HIGH', '2024-10-05'),
((SELECT id FROM events WHERE event_number = 'EVT007'), 'Speaker Confirmations', 'SPEAKER', '2024-11-15', 'Event Manager', 'IN_PROGRESS', 'HIGH', '2024-10-06'),
((SELECT id FROM events WHERE event_number = 'EVT007'), 'AV Equipment Setup', 'TECHNICAL', '2024-12-01', 'Tech Team', 'PENDING', 'HIGH', '2024-10-07'),
((SELECT id FROM events WHERE event_number = 'EVT007'), 'Participant Registration System', 'PLANNING', '2024-11-25', 'Admin', 'PENDING', 'MEDIUM', '2024-10-08'),
((SELECT id FROM events WHERE event_number = 'EVT010'), 'Birthday Cake Order', 'CATERING', '2024-11-25', 'Event Manager', 'PENDING', 'MEDIUM', '2024-10-15'),
((SELECT id FROM events WHERE event_number = 'EVT010'), 'Decoration Setup', 'DECORATION', '2024-12-09', 'Decoration Team', 'PENDING', 'MEDIUM', '2024-10-16');

-- ============================================================================
-- EVENT PAYMENTS (25+ payments)
-- ============================================================================
INSERT INTO event_payments (event_id, payment_date, payment_to, amount, payment_type, payment_mode, created_at) VALUES
-- EVT001 Payments
((SELECT id FROM events WHERE event_number = 'EVT001'), '2024-09-10', 'Varanasi Grand Events', 100000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-09-10'),
((SELECT id FROM events WHERE event_number = 'EVT001'), '2024-10-10', 'Varanasi Grand Events', 200000.00, 'INSTALLMENT', 'CHEQUE', '2024-10-10'),
((SELECT id FROM events WHERE event_number = 'EVT001'), '2024-11-15', 'Spice Route Catering', 150000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-11-15'),
((SELECT id FROM events WHERE event_number = 'EVT001'), '2024-11-20', 'Floral Dreams Decoration', 80000.00, 'ADVANCE', 'CARD', '2024-11-20'),
((SELECT id FROM events WHERE event_number = 'EVT001'), '2024-11-25', 'Eternal Moments Photography', 40000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-11-25'),
((SELECT id FROM events WHERE event_number = 'EVT001'), '2024-12-01', 'Shahi Nights Entertainment', 20000.00, 'ADVANCE', 'CASH', '2024-12-01'),
((SELECT id FROM events WHERE event_number = 'EVT001'), '2024-12-10', 'Bridal Beauty Studio', 12000.00, 'ADVANCE', 'CARD', '2024-12-10'),
-- EVT002 Payments
((SELECT id FROM events WHERE event_number = 'EVT002'), '2024-09-15', 'Varanasi Grand Events', 150000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-09-15'),
((SELECT id FROM events WHERE event_number = 'EVT002'), '2024-10-15', 'Varanasi Grand Events', 250000.00, 'INSTALLMENT', 'CHEQUE', '2024-10-15'),
((SELECT id FROM events WHERE event_number = 'EVT002'), '2024-11-20', 'Lucknow Food Extravaganza', 200000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-11-20'),
((SELECT id FROM events WHERE event_number = 'EVT002'), '2024-11-25', 'Golden Threads Decoration', 100000.00, 'ADVANCE', 'CARD', '2024-11-25'),
((SELECT id FROM events WHERE event_number = 'EVT002'), '2024-12-01', 'Lens & Light Studio', 50000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-12-01'),
-- EVT003 Payments
((SELECT id FROM events WHERE event_number = 'EVT003'), '2024-09-20', 'Lucknow Celebrations Limited', 120000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-09-20'),
((SELECT id FROM events WHERE event_number = 'EVT003'), '2024-10-20', 'Lucknow Celebrations Limited', 200000.00, 'INSTALLMENT', 'CHEQUE', '2024-10-20'),
((SELECT id FROM events WHERE event_number = 'EVT003'), '2024-11-15', 'Royal Feast Catering', 200000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-11-15'),
((SELECT id FROM events WHERE event_number = 'EVT003'), '2024-11-20', 'Taj Floral Studio', 80000.00, 'ADVANCE', 'CARD', '2024-11-20'),
((SELECT id FROM events WHERE event_number = 'EVT003'), '2024-12-01', 'Heritage Captures', 42000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-12-01'),
-- EVT004 Payments
((SELECT id FROM events WHERE event_number = 'EVT004'), '2024-09-25', 'Agra Moments Event Management', 200000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-09-25'),
((SELECT id FROM events WHERE event_number = 'EVT004'), '2024-10-25', 'Agra Moments Event Management', 300000.00, 'INSTALLMENT', 'CHEQUE', '2024-10-25'),
((SELECT id FROM events WHERE event_number = 'EVT004'), '2024-11-25', 'Lucknow Food Extravaganza', 300000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-11-25'),
-- EVT007 Payments
((SELECT id FROM events WHERE event_number = 'EVT007'), '2024-10-10', 'Varanasi Grand Events', 100000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-10-10'),
((SELECT id FROM events WHERE event_number = 'EVT007'), '2024-11-01', 'Royal Feast Catering', 70000.00, 'ADVANCE', 'CARD', '2024-11-01'),
((SELECT id FROM events WHERE event_number = 'EVT010'), '2024-10-20', 'Varanasi Grand Events', 80000.00, 'ADVANCE', 'BANK_TRANSFER', '2024-10-20'),
((SELECT id FROM events WHERE event_number = 'EVT010'), '2024-11-15', 'Spice Route Catering', 35000.00, 'ADVANCE', 'CARD', '2024-11-15'),
((SELECT id FROM events WHERE event_number = 'EVT010'), '2024-11-20', 'Floral Dreams Decoration', 20000.00, 'ADVANCE', 'CASH', '2024-11-20');

-- Summary
SELECT 'Event & Wedding Planning Demo Data Loaded Successfully!' AS status;
SELECT COUNT(*) AS total_companies FROM event_companies;
SELECT COUNT(*) AS total_vendors FROM vendors;
SELECT COUNT(*) AS total_clients FROM clients;
SELECT COUNT(*) AS total_events FROM events;
SELECT COUNT(*) AS total_event_vendors FROM event_vendors;
SELECT COUNT(*) AS total_tasks FROM event_tasks;
SELECT COUNT(*) AS total_payments FROM event_payments;
