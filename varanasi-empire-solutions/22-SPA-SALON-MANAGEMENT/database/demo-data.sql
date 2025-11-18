-- ============================================================================
-- SPA & SALON MANAGEMENT - COMPREHENSIVE DEMO DATA
-- Varanasi Empire Solution
-- ============================================================================

-- Insert salons (2-3 salons)
INSERT INTO salons (salon_name, salon_type, address, city, phone, email, opening_time, closing_time, weekly_off, is_active)
VALUES
('Varanasi Beauty Spa', 'UNISEX', '145 Beauty Lane, Varanasi', 'Varanasi', '9876544301', 'info@varanasibeutyspa.com', '10:00', '20:00', '{"Sunday"}', true),
('Lucknow Premium Salon', 'LADIES', '221 Fashion Avenue, Lucknow', 'Lucknow', '9876544302', 'contact@lucknowsalon.in', '09:00', '21:00', '{"Monday"}', true),
('Kanpur Gents Hub', 'GENTS', '456 Grooming Center, Kanpur', 'Kanpur', '9876544303', 'service@kanpurgents.com', '10:00', '20:00', '{"Sunday"}', true);

-- Insert service categories
INSERT INTO service_categories (category_name, display_order)
VALUES
('Haircut & Styling', 1),
('Hair Treatment', 2),
('Coloring & Highlights', 3),
('Facial & Skincare', 4),
('Massage & Spa', 5),
('Nail Services', 6),
('Makeup', 7),
('Threading & Waxing', 8),
('Body Care', 9),
('Wellness', 10);

-- Insert services (20+ services)
INSERT INTO services (salon_id, category_id, service_code, service_name, gender_preference, duration_minutes, price, description, is_active)
SELECT
  s.id,
  sc.id,
  'SVC-' || LPAD(ROW_NUMBER() OVER (ORDER BY s.id, sv.rn)::TEXT, 4, '0'),
  sv.service_name,
  sv.gender_pref,
  sv.duration,
  sv.price,
  sv.description,
  true
FROM salons s
CROSS JOIN service_categories sc
CROSS JOIN (
  SELECT 'Basic Haircut' as service_name, 'UNISEX' as gender_pref, 30 as duration, 300.00 as price, 'Standard haircut with styling' as description, 1 as rn
  UNION ALL SELECT 'Premium Haircut', 'UNISEX', 45, 600.00, 'Expert styling and grooming', 2
  UNION ALL SELECT 'Hair Spa Treatment', 'UNISEX', 60, 800.00, 'Deep conditioning treatment', 3
  UNION ALL SELECT 'Hair Coloring', 'UNISEX', 90, 1500.00, 'Full head coloring service', 4
  UNION ALL SELECT 'Highlights', 'FEMALE', 120, 2000.00, 'Partial highlights and toning', 5
  UNION ALL SELECT 'Facial - Basic', 'FEMALE', 45, 800.00, 'Cleansing and moisturizing', 6
  UNION ALL SELECT 'Facial - Premium', 'FEMALE', 60, 1500.00, 'Advanced facial with treatments', 7
  UNION ALL SELECT 'Anti-Aging Facial', 'FEMALE', 75, 2000.00, 'Wrinkle reduction treatment', 8
  UNION ALL SELECT 'Full Body Massage', 'UNISEX', 60, 1200.00, 'Relaxation massage', 9
  UNION ALL SELECT 'Swedish Massage', 'UNISEX', 60, 1500.00, 'Deep tissue massage', 10
  UNION ALL SELECT 'Manicure', 'FEMALE', 30, 500.00, 'Nails care and polish', 11
  UNION ALL SELECT 'Pedicure', 'FEMALE', 45, 700.00, 'Foot care and polish', 12
  UNION ALL SELECT 'Threading', 'FEMALE', 15, 100.00, 'Eyebrow and facial threading', 13
  UNION ALL SELECT 'Waxing - Full Body', 'FEMALE', 60, 1000.00, 'Full body hair removal', 14
  UNION ALL SELECT 'Makeup - Party', 'FEMALE', 45, 1200.00, 'Special occasion makeup', 15
  UNION ALL SELECT 'Makeup - Bridal', 'FEMALE', 90, 3000.00, 'Bridal makeup service', 16
  UNION ALL SELECT 'Beard Grooming', 'MALE', 30, 400.00, 'Beard trim and styling', 17
  UNION ALL SELECT 'Shaving', 'MALE', 20, 200.00, 'Professional shaving service', 18
  UNION ALL SELECT 'Spa Package', 'FEMALE', 120, 3000.00, 'Complete spa experience', 19
  UNION ALL SELECT 'Wellness Session', 'UNISEX', 90, 2000.00, 'Holistic wellness treatment', 20
) sv
WHERE (sv.gender_pref = sc.category_name OR sv.gender_pref = 'UNISEX');

-- Insert staff (15+ staff members)
INSERT INTO staff (salon_id, staff_code, first_name, last_name, phone, role, gender, specialization, years_of_experience, commission_percentage, working_days, shift_start_time, shift_end_time, is_active)
WITH staff_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 20)
)
SELECT
  CASE WHEN sd.rn <= 7 THEN (SELECT id FROM salons WHERE salon_name = 'Varanasi Beauty Spa')
       WHEN sd.rn <= 14 THEN (SELECT id FROM salons WHERE salon_name = 'Lucknow Premium Salon')
       ELSE (SELECT id FROM salons WHERE salon_name = 'Kanpur Gents Hub') END,
  'STAFF-' || LPAD(sd.rn::TEXT, 4, '0'),
  (ARRAY['Rajesh', 'Priya', 'Arun', 'Deepika', 'Vikram', 'Meera', 'Suresh', 'Neha', 'Amit', 'Kavita',
         'Yogesh', 'Divya', 'Hemant', 'Geeta', 'Ramesh', 'Sunita', 'Anita', 'Seema', 'Rekha', 'Pooja'])[sd.rn],
  (ARRAY['Singh', 'Kumar', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Mishra', 'Yadav', 'Pandey', 'Rao',
         'Nair', 'Iyer', 'Dey', 'Das', 'Roy', 'Reddy', 'Chopra', 'Malhotra', 'Arora', 'Bhat'])[sd.rn],
  '987654' || LPAD((4400 + sd.rn)::TEXT, 4, '0'),
  (ARRAY['HAIR_STYLIST', 'BEAUTICIAN', 'MASSAGE_THERAPIST', 'NAIL_TECHNICIAN', 'MAKEUP_ARTIST'])[1 + FLOOR(RANDOM() * 5)::INT],
  (ARRAY['MALE', 'FEMALE', 'FEMALE', 'FEMALE', 'FEMALE'])[1 + FLOOR(RANDOM() * 5)::INT],
  (ARRAY['{"Coloring", "Styling"}', '{"Facial", "Makeup"}', '{"Massage", "Spa"}', '{"Nail Art"}', '{"Bridal Makeup"}'])[1 + FLOOR(RANDOM() * 5)::INT]::TEXT[],
  FLOOR(RANDOM() * 12 + 1)::INT,
  FLOOR(RANDOM() * 20 + 25)::DECIMAL(5,2),
  '{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}'::TEXT[],
  '10:00'::TIME,
  '20:00'::TIME,
  true
FROM staff_data sd;

-- Insert customers (40+ customers)
INSERT INTO customers (salon_id, customer_code, first_name, last_name, phone, email, date_of_birth, gender, anniversary_date, address, skin_type, hair_type, total_visits, total_spent, loyalty_points, is_active)
WITH cust_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 45)
)
SELECT
  CASE WHEN cd.rn <= 15 THEN (SELECT id FROM salons WHERE salon_name = 'Varanasi Beauty Spa')
       WHEN cd.rn <= 30 THEN (SELECT id FROM salons WHERE salon_name = 'Lucknow Premium Salon')
       ELSE (SELECT id FROM salons WHERE salon_name = 'Kanpur Gents Hub') END,
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
  '987654' || LPAD((4500 + cd.rn)::TEXT, 4, '0'),
  'customer' || cd.rn || '@email.com',
  CURRENT_DATE - (FLOOR(RANDOM() * 20000 + 7300)::INT),
  (ARRAY['MALE', 'FEMALE'])[1 + FLOOR(RANDOM() * 2)::INT],
  CURRENT_DATE + (FLOOR(RANDOM() * 300)::INT),
  'House ' || cd.rn || ', ' || (ARRAY['Ghat Road', 'Maidagin', 'Krishna Nagar', 'Vishwanath Gali'])[1 + FLOOR(RANDOM() * 4)::INT] || ', Varanasi',
  (ARRAY['OILY', 'DRY', 'NORMAL', 'COMBINATION'])[1 + FLOOR(RANDOM() * 4)::INT],
  (ARRAY['STRAIGHT', 'CURLY', 'WAVY', 'FRIZZY'])[1 + FLOOR(RANDOM() * 4)::INT],
  FLOOR(RANDOM() * 50 + 5)::INT,
  FLOOR(RANDOM() * 50000 + 5000)::DECIMAL(12,2),
  FLOOR(RANDOM() * 1000 + 100)::INT,
  true
FROM cust_data cd;

-- Insert appointments (40+ appointments)
INSERT INTO appointments (salon_id, customer_id, staff_id, appointment_number, appointment_date, appointment_time, estimated_duration_minutes, appointment_status, booking_source, special_requests)
WITH appt_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 45)
)
SELECT
  (SELECT salon_id FROM customers ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM customers ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM staff ORDER BY RANDOM() LIMIT 1),
  'APPT-' || LPAD(ad.rn::TEXT, 5, '0'),
  CURRENT_DATE + (FLOOR(RANDOM() * 30)::INT),
  (ARRAY['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'])[1 + FLOOR(RANDOM() * 8)::INT]::TIME,
  (ARRAY[30, 45, 60, 90, 120])[1 + FLOOR(RANDOM() * 5)::INT],
  (ARRAY['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])[1 + FLOOR(RANDOM() * 4)::INT],
  (ARRAY['WALK_IN', 'PHONE', 'ONLINE', 'ONLINE'])[1 + FLOOR(RANDOM() * 4)::INT],
  CASE WHEN RANDOM() > 0.8 THEN (ARRAY['Gentle massage', 'No chemical', 'Custom color'])[1 + FLOOR(RANDOM() * 3)::INT] ELSE NULL END
FROM appt_data ad;

-- Insert appointment services
INSERT INTO appointment_services (appointment_id, service_id, staff_id, service_price, discount_percent, final_price, service_status)
SELECT
  a.id,
  (SELECT id FROM services WHERE salon_id = a.salon_id ORDER BY RANDOM() LIMIT 1),
  a.staff_id,
  FLOOR(RANDOM() * 2000 + 300)::DECIMAL(8,2),
  CASE WHEN RANDOM() > 0.8 THEN FLOOR(RANDOM() * 10 + 5)::DECIMAL(5,2) ELSE 0.00 END,
  (FLOOR(RANDOM() * 2000 + 300) - (FLOOR(RANDOM() * 2000 + 300) * CASE WHEN RANDOM() > 0.8 THEN FLOOR(RANDOM() * 10 + 5)::DECIMAL(5,2) / 100 ELSE 0.00 END))::DECIMAL(8,2),
  (ARRAY['PENDING', 'IN_PROGRESS', 'COMPLETED', 'COMPLETED'])[1 + FLOOR(RANDOM() * 4)::INT]
FROM appointments a
LIMIT 45;

-- Insert invoices
INSERT INTO invoices (salon_id, customer_id, appointment_id, invoice_number, invoice_date, subtotal, discount_amount, cgst_amount, sgst_amount, grand_total, payment_mode, payment_status)
SELECT
  a.salon_id,
  a.customer_id,
  a.id,
  'INV-' || LPAD(ROW_NUMBER() OVER (ORDER BY a.id)::TEXT, 5, '0'),
  CURRENT_DATE - (FLOOR(RANDOM() * 15)::INT),
  FLOOR(RANDOM() * 2000 + 300)::DECIMAL(10,2),
  CASE WHEN RANDOM() > 0.8 THEN FLOOR(RANDOM() * 200 + 50)::DECIMAL(8,2) ELSE 0.00 END,
  (FLOOR(RANDOM() * 2000 + 300) * 0.09)::DECIMAL(8,2),
  (FLOOR(RANDOM() * 2000 + 300) * 0.09)::DECIMAL(8,2),
  (FLOOR(RANDOM() * 2000 + 300) + (FLOOR(RANDOM() * 2000 + 300) * 0.18) + CASE WHEN RANDOM() > 0.8 THEN FLOOR(RANDOM() * 200 + 50)::DECIMAL(8,2) ELSE 0.00 END)::DECIMAL(10,2),
  (ARRAY['CASH', 'CARD', 'UPI'])[1 + FLOOR(RANDOM() * 3)::INT],
  (ARRAY['PAID', 'PAID', 'UNPAID'])[1 + FLOOR(RANDOM() * 3)::INT]
FROM appointments a
WHERE a.appointment_status = 'COMPLETED'
LIMIT 40;

-- Insert products inventory
INSERT INTO products_inventory (salon_id, product_name, product_category, brand, unit, current_stock, min_stock_level, purchase_price, retail_price, is_active)
SELECT
  s.id,
  p.product_name,
  p.product_category,
  p.brand,
  p.unit,
  FLOOR(RANDOM() * 100 + 10)::DECIMAL(10,2),
  20.00,
  p.purchase_price,
  p.retail_price,
  true
FROM salons s
CROSS JOIN (
  SELECT 'Shampoo Premium' as product_name, 'SHAMPOO' as product_category, 'International Brand' as brand, 'BOTTLE' as unit, 350.00 as purchase_price, 500.00 as retail_price
  UNION ALL SELECT 'Hair Conditioner', 'CONDITIONER', 'International Brand', 'BOTTLE', 300.00, 450.00
  UNION ALL SELECT 'Facial Serum', 'SERUM', 'Premium Brand', 'BOTTLE', 800.00, 1200.00
  UNION ALL SELECT 'Face Cream', 'CREAM', 'Local Brand', 'JAR', 200.00, 350.00
  UNION ALL SELECT 'Body Lotion', 'LOTION', 'Local Brand', 'BOTTLE', 150.00, 250.00
  UNION ALL SELECT 'Nail Polish', 'TOOLS', 'International', 'BOTTLE', 100.00, 200.00
  UNION ALL SELECT 'Massage Oil', 'OIL', 'Ayurvedic', 'BOTTLE', 150.00, 300.00
  UNION ALL SELECT 'Hair Dye', 'DYE', 'International', 'BOX', 250.00, 400.00
  UNION ALL SELECT 'Face Pack', 'PACK', 'Local', 'JAR', 120.00, 250.00
  UNION ALL SELECT 'Lip Balm', 'LIP', 'Local', 'STICK', 50.00, 100.00
) p;

-- Summary
SELECT 'Spa & Salon Management Demo Data Loaded Successfully!' AS Status;
SELECT COUNT(*) AS "Total Customers" FROM customers;
SELECT COUNT(*) AS "Total Staff" FROM staff;
SELECT COUNT(*) AS "Total Appointments" FROM appointments;
SELECT COUNT(*) AS "Total Invoices" FROM invoices;
