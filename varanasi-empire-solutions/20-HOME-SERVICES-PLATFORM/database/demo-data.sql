-- ============================================================================
-- HOME SERVICES PLATFORM - COMPREHENSIVE DEMO DATA
-- Varanasi Empire Solution
-- ============================================================================

-- Insert platform operators (1-2 operators)
INSERT INTO platform_operators (platform_name, gstin, address, city, phone, email, commission_percentage, is_active)
VALUES
('Varanasi Home Services Network', '09ABCDE1234F1Z5', '145 Tech Park, Varanasi', 'Varanasi', '9876544101', 'platform@varanasihomeservices.com', 15.0, true),
('Northern India Service Hub', '09BCDEF2345G1Z5', '221 Business Center, Lucknow', 'Lucknow', '9876544102', 'contact@northernservices.in', 15.0, true);

-- Insert service categories
INSERT INTO service_categories (category_name, display_order, is_active)
VALUES
('Plumbing', 1, true),
('Electrical', 2, true),
('Carpentry', 3, true),
('Cleaning', 4, true),
('Home Maintenance', 5, true),
('Painting', 6, true),
('Appliance Repair', 7, true),
('AC Services', 8, true),
('Garden Services', 9, true),
('Pest Control', 10, true);

-- Insert services (20-25 services)
INSERT INTO services (category_id, service_name, service_code, description, base_price, unit, estimated_duration_minutes, is_active)
SELECT
  sc.id,
  s.service_name,
  s.service_code,
  s.description,
  s.base_price,
  s.unit,
  s.duration,
  true
FROM service_categories sc
CROSS JOIN (
  SELECT 'Pipe Repair' as service_name, 'SVC-PLUMB-001' as service_code, 'Fix leaking pipes and connections' as description, 500.00 as base_price, 'PER_VISIT' as unit, 30 as duration
  UNION ALL SELECT 'Tap Installation', 'SVC-PLUMB-002', 'Install new taps and faucets', 800.00, 'PER_UNIT', 45
  UNION ALL SELECT 'Electrical Wiring', 'SVC-ELEC-001', 'Fix electrical wiring issues', 600.00, 'PER_VISIT', 60
  UNION ALL SELECT 'Light Fixture Install', 'SVC-ELEC-002', 'Install ceiling fans, lights, etc', 1000.00, 'PER_UNIT', 45
  UNION ALL SELECT 'Wooden Door Repair', 'SVC-CARP-001', 'Repair or replace wooden doors', 1200.00, 'PER_VISIT', 60
  UNION ALL SELECT 'Furniture Assembly', 'SVC-CARP-002', 'Assemble furniture from scratch', 800.00, 'PER_JOB', 90
  UNION ALL SELECT 'House Cleaning', 'SVC-CLEAN-001', 'Deep cleaning for entire house', 2000.00, 'PER_SQ_FT', 180
  UNION ALL SELECT 'Kitchen Cleaning', 'SVC-CLEAN-002', 'Specialized kitchen cleaning', 1500.00, 'PER_VISIT', 120
  UNION ALL SELECT 'Wall Painting', 'SVC-PAINT-001', 'Interior wall painting', 1500.00, 'PER_SQ_FT', 240
  UNION ALL SELECT 'AC Service & Repair', 'SVC-AC-001', 'Annual AC maintenance and repair', 800.00, 'PER_UNIT', 60
  UNION ALL SELECT 'Washing Machine Repair', 'SVC-APPL-001', 'Fix washing machine issues', 600.00, 'PER_VISIT', 45
  UNION ALL SELECT 'TV Repair', 'SVC-APPL-002', 'Television repair services', 500.00, 'PER_VISIT', 45
) s;

-- Insert service providers (30+ providers)
INSERT INTO service_providers (provider_code, first_name, last_name, phone, email, date_of_birth, address, city, pincode, aadhar_number, pan_number, services_offered, specialization, years_of_experience, background_verified, documents_verified, average_rating, total_jobs_completed, bank_account_number, bank_ifsc, is_available, provider_status, is_active)
WITH prov_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 35)
)
SELECT
  'PROV-' || LPAD(pd.rn::TEXT, 4, '0'),
  (ARRAY['Rajesh', 'Priya', 'Arun', 'Deepika', 'Vikram', 'Meera', 'Suresh', 'Neha', 'Amit', 'Kavita',
         'Yogesh', 'Divya', 'Hemant', 'Geeta', 'Ramesh', 'Sunita', 'Anita', 'Seema', 'Rekha', 'Pooja',
         'Arjun', 'Aryan', 'Aditya', 'Aarav', 'Bhavesh', 'Chetan', 'Chirag', 'Chandra', 'Devendra', 'Dinesh',
         'Eshan', 'Faisal', 'Gaurav', 'Hemant', 'Imran'])[pd.rn],
  (ARRAY['Singh', 'Kumar', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Mishra', 'Yadav', 'Pandey', 'Rao',
         'Nair', 'Iyer', 'Dey', 'Das', 'Roy', 'Reddy', 'Chopra', 'Malhotra', 'Arora', 'Bhat',
         'Kulkarni', 'Desai', 'Joshi', 'Tripathi', 'Srivastava', 'Saxena', 'Mittal', 'Garg', 'Goyal', 'Agarwal',
         'Chaudhary', 'Trivedi', 'Banerjee', 'Mukherjee', 'Ghosh'])[pd.rn],
  '987654' || LPAD((4200 + pd.rn)::TEXT, 4, '0'),
  'provider' || pd.rn || '@email.com',
  CURRENT_DATE - (FLOOR(RANDOM() * 20000 + 7300)::INT),
  'House No ' || pd.rn || ', ' || (ARRAY['Ghat Road', 'Maidagin', 'Krishna Nagar', 'Vishwanath Gali', 'Varuna Nagar'])[1 + FLOOR(RANDOM() * 5)::INT] || ', Varanasi',
  'Varanasi',
  '221001',
  LPAD(FLOOR(RANDOM() * 999999999999)::TEXT, 12, '0'),
  'ABCDE' || LPAD(pd.rn::TEXT, 4, '0') || 'F',
  (ARRAY['{1,2}', '{3,4}', '{5,6}', '{7,8}', '{9,10}', '{11,12}'])[1 + FLOOR(RANDOM() * 6)::INT]::UUID[],
  (ARRAY['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Painting'])[1 + FLOOR(RANDOM() * 5)::INT],
  FLOOR(RANDOM() * 15 + 2)::INT,
  (RANDOM() > 0.2),
  (RANDOM() > 0.15),
  FLOOR(RANDOM() * 20 + 35)::DECIMAL(2,1) / 10,
  FLOOR(RANDOM() * 500 + 50)::INT,
  '10234567' || LPAD(pd.rn::TEXT, 3, '0'),
  'SBIN0002145',
  (RANDOM() > 0.1),
  (ARRAY['ACTIVE', 'ACTIVE', 'INACTIVE'])[1 + FLOOR(RANDOM() * 3)::INT],
  true
FROM prov_data pd;

-- Insert customers (40+ customers)
INSERT INTO customers (customer_code, first_name, last_name, phone, email, date_of_birth, gender, portal_username, total_bookings, total_spent, is_active)
WITH cust_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 45)
)
SELECT
  'CUST-' || LPAD(cd.rn::TEXT, 4, '0'),
  (ARRAY['Rajesh', 'Priya', 'Arun', 'Deepika', 'Vikram', 'Meera', 'Suresh', 'Neha', 'Amit', 'Kavita',
         'Yogesh', 'Divya', 'Hemant', 'Geeta', 'Ramesh', 'Sunita', 'Anita', 'Seema', 'Rekha', 'Pooja',
         'Arjun', 'Aryan', 'Aditya', 'Aarav', 'Bhavesh', 'Chetan', 'Chirag', 'Chandra', 'Devendra', 'Dinesh',
         'Eshan', 'Faisal', 'Gaurav', 'Hemant', 'Imran', 'Jagdish', 'Kailash', 'Lavesh', 'Mahesh', 'Naveen',
         'Omkar', 'Prakash', 'Pushkar', 'Rahul', 'Sandeep'])[cd.rn],
  (ARRAY['Singh', 'Kumar', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Mishra', 'Yadav', 'Pandey', 'Rao',
         'Nair', 'Iyer', 'Dey', 'Das', 'Roy', 'Reddy', 'Chopra', 'Malhotra', 'Arora', 'Bhat',
         'Kulkarni', 'Desai', 'Joshi', 'Tripathi', 'Srivastava', 'Saxena', 'Mittal', 'Garg', 'Goyal', 'Agarwal',
         'Chaudhary', 'Trivedi', 'Banerjee', 'Mukherjee', 'Ghosh', 'Sen', 'Menon', 'Kapoor', 'Tiwari', 'Daga',
         'Shrivastava', 'Taneja', 'Dubey', 'Sethi', 'Baweja'])[cd.rn],
  '987654' || LPAD((4300 + cd.rn)::TEXT, 4, '0'),
  'customer' || cd.rn || '@email.com',
  CURRENT_DATE - (FLOOR(RANDOM() * 20000 + 7300)::INT),
  (ARRAY['MALE', 'FEMALE'])[1 + FLOOR(RANDOM() * 2)::INT],
  'cust_' || LPAD(cd.rn::TEXT, 4, '0'),
  FLOOR(RANDOM() * 50 + 5)::INT,
  FLOOR(RANDOM() * 50000 + 5000)::DECIMAL(12,2),
  true
FROM cust_data cd;

-- Insert bookings (40-50 bookings)
INSERT INTO bookings (customer_id, service_id, provider_id, booking_number, booking_date, service_address, service_city, scheduled_date, scheduled_time, estimated_duration_minutes, service_charge, platform_fee, gst_amount, total_amount, payment_mode, payment_status, provider_earning, platform_commission, booking_status, customer_notes)
WITH book_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 50)
)
SELECT
  (SELECT id FROM customers ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM services ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM service_providers WHERE is_available = true ORDER BY RANDOM() LIMIT 1),
  'BKG-' || LPAD(bd.rn::TEXT, 6, '0'),
  CURRENT_TIMESTAMP - (FLOOR(RANDOM() * 30)::INT || ' days')::INTERVAL,
  'House ' || LPAD(bd.rn::TEXT, 3, '0') || ', ' || (ARRAY['Ghat Road', 'Maidagin', 'Krishna Nagar', 'Vishwanath Gali', 'Varuna Nagar'])[1 + FLOOR(RANDOM() * 5)::INT] || ', Varanasi',
  'Varanasi',
  CURRENT_DATE + (FLOOR(RANDOM() * 10)::INT),
  (ARRAY['09:00', '10:00', '14:00', '15:00', '16:00'])[1 + FLOOR(RANDOM() * 5)::INT]::TIME,
  (ARRAY[30, 45, 60, 90, 120])[1 + FLOOR(RANDOM() * 5)::INT],
  FLOOR(RANDOM() * 2000 + 500)::DECIMAL(8,2),
  FLOOR(RANDOM() * 200 + 50)::DECIMAL(6,2),
  ((FLOOR(RANDOM() * 2000 + 500) + FLOOR(RANDOM() * 200 + 50)) * 0.18)::DECIMAL(6,2),
  (FLOOR(RANDOM() * 2000 + 500) + FLOOR(RANDOM() * 200 + 50) + ((FLOOR(RANDOM() * 2000 + 500) + FLOOR(RANDOM() * 200 + 50)) * 0.18))::DECIMAL(8,2),
  (ARRAY['CASH', 'ONLINE', 'UPI'])[1 + FLOOR(RANDOM() * 3)::INT],
  (ARRAY['PENDING', 'PAID', 'PAID'])[1 + FLOOR(RANDOM() * 3)::INT],
  (FLOOR(RANDOM() * 2000 + 500) * 0.85)::DECIMAL(8,2),
  (FLOOR(RANDOM() * 200 + 50) + ((FLOOR(RANDOM() * 2000 + 500) + FLOOR(RANDOM() * 200 + 50)) * 0.18))::DECIMAL(6,2),
  (ARRAY['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'COMPLETED'])[1 + FLOOR(RANDOM() * 5)::INT],
  CASE WHEN RANDOM() > 0.7 THEN 'Please call before arriving' ELSE NULL END
FROM book_data bd;

-- Insert reviews and ratings (25-30 reviews)
INSERT INTO reviews_ratings (booking_id, customer_id, provider_id, rating, review_text, review_date)
SELECT
  b.id,
  b.customer_id,
  b.provider_id,
  FLOOR(RANDOM() * 5 + 1)::DECIMAL(2,1),
  (ARRAY['Excellent service!', 'Good work, would recommend', 'Very professional', 'Satisfied with work', 'Could be better'])[1 + FLOOR(RANDOM() * 5)::INT],
  CURRENT_TIMESTAMP - (FLOOR(RANDOM() * 20)::INT || ' days')::INTERVAL
FROM bookings b
WHERE b.booking_status = 'COMPLETED'
LIMIT 30;

-- Summary
SELECT 'Home Services Platform Demo Data Loaded Successfully!' AS Status;
SELECT COUNT(*) AS "Total Customers" FROM customers;
SELECT COUNT(*) AS "Total Service Providers" FROM service_providers WHERE is_active = true;
SELECT COUNT(*) AS "Total Bookings" FROM bookings;
SELECT COUNT(*) AS "Total Reviews" FROM reviews_ratings;
