-- ============================================================================
-- HEALTH & WELLNESS CENTER - COMPREHENSIVE DEMO DATA
-- Varanasi Empire Solution
-- ============================================================================

-- Insert wellness centers (2-3 centers)
INSERT INTO wellness_centers (center_name, center_type, address, city, phone, email, is_active)
VALUES
('Varanasi Wellness & Yoga Center', 'WELLNESS', '145 Riverfront Wellness Park, Varanasi', 'Varanasi', '9876543901', 'contact@varanasiwellness.com', true),
('Lucknow Health & Spa', 'SPA', '221 Spa Avenue, Lucknow', 'Lucknow', '9876543902', 'info@lucknowspa.in', true),
('Kanpur Fitness & Wellness', 'WELLNESS', '456 Fitness Plaza, Kanpur', 'Kanpur', '9876543903', 'health@kanpurfit.com', true);

-- Insert therapists (15+ therapists)
INSERT INTO therapists (center_id, therapist_code, first_name, last_name, phone, specialization, certification, years_of_experience, hourly_rate, is_active)
SELECT
  CASE WHEN t.rn <= 6 THEN (SELECT id FROM wellness_centers WHERE center_name = 'Varanasi Wellness & Yoga Center')
       WHEN t.rn <= 11 THEN (SELECT id FROM wellness_centers WHERE center_name = 'Lucknow Health & Spa')
       ELSE (SELECT id FROM wellness_centers WHERE center_name = 'Kanpur Fitness & Wellness') END,
  'THER-' || LPAD(t.rn::TEXT, 4, '0'),
  (ARRAY['Rajesh', 'Priya', 'Arun', 'Deepika', 'Vikram', 'Meera', 'Suresh', 'Neha', 'Amit', 'Kavita', 'Yogesh', 'Divya', 'Hemant', 'Geeta', 'Ramesh'])[t.rn],
  (ARRAY['Singh', 'Kumar', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Mishra', 'Yadav', 'Pandey', 'Rao', 'Nair', 'Iyer', 'Dey', 'Das', 'Roy'])[t.rn],
  '987654' || LPAD((9000 + t.rn)::TEXT, 4, '0'),
  (ARRAY['{MASSAGE, YOGA}', '{YOGA, MEDITATION}', '{MASSAGE, PHYSIOTHERAPY}', '{PHYSIOTHERAPY, YOGA}', '{ACUPUNCTURE, MASSAGE}', '{YOGA, NUTRITION}'])[1 + FLOOR(RANDOM() * 6)::INT]::TEXT[],
  (ARRAY['Certified Massage Therapist', 'Yoga Instructor - 200 hours', 'Physiotherapist - BPT', 'Sports Massage Specialist', 'Nutrition Specialist', 'Ayurveda Therapist'])[1 + FLOOR(RANDOM() * 6)::INT],
  FLOOR(RANDOM() * 15 + 2)::INT,
  FLOOR(RANDOM() * 1000 + 500)::DECIMAL(8,2),
  true
FROM (SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 18) s) t;

-- Insert service catalog (20+ services)
INSERT INTO service_catalog (center_id, service_code, service_name, service_category, duration_minutes, price, benefits, is_active)
SELECT
  wc.id,
  'SVC-' || LPAD(ROW_NUMBER() OVER (ORDER BY wc.id, s.rn)::TEXT, 4, '0'),
  s.service_name,
  s.service_category,
  s.duration,
  s.price,
  s.benefits,
  true
FROM wellness_centers wc
CROSS JOIN (
  SELECT 1 as rn, 'Swedish Massage' as service_name, 'Massage' as service_category, 60 as duration, 800.00 as price, '{"Pain Relief", "Relaxation"}'::TEXT[] as benefits
  UNION ALL SELECT 2, 'Deep Tissue Massage', 'Massage', 90, 1200.00, '{"Muscle Recovery", "Tension Relief"}'
  UNION ALL SELECT 3, 'Aromatherapy Massage', 'Massage', 60, 1000.00, '{"Stress Relief", "Sleep Improvement"}'
  UNION ALL SELECT 4, 'Yoga - Beginner', 'Yoga', 60, 500.00, '{"Flexibility", "Strength Building"}'
  UNION ALL SELECT 5, 'Yoga - Advanced', 'Yoga', 90, 750.00, '{"Mental Clarity", "Core Strength"}'
  UNION ALL SELECT 6, 'Meditation - Basic', 'Meditation', 45, 300.00, '{"Stress Relief", "Focus"}'
  UNION ALL SELECT 7, 'Meditation - Extended', 'Meditation', 90, 600.00, '{"Deep Relaxation", "Mind Control"}'
  UNION ALL SELECT 8, 'Facial Treatment', 'Spa', 60, 1500.00, '{"Skin Glow", "Anti-Aging"}'
  UNION ALL SELECT 9, 'Body Scrub', 'Spa', 45, 1200.00, '{"Exfoliation", "Skin Renewal"}'
  UNION ALL SELECT 10, 'Sauna Session', 'Spa', 30, 300.00, '{"Detoxification", "Relaxation"}'
  UNION ALL SELECT 11, 'Physiotherapy - Basic', 'Physiotherapy', 45, 600.00, '{"Injury Recovery", "Pain Management"}'
  UNION ALL SELECT 12, 'Acupuncture', 'Therapy', 60, 1000.00, '{"Pain Relief", "Energy Balance"}'
  UNION ALL SELECT 13, 'Nutrition Consultation', 'Nutrition', 60, 1200.00, '{"Diet Planning", "Health Goals"}'
  UNION ALL SELECT 14, 'Personal Training - 1 hour', 'Fitness', 60, 800.00, '{"Strength", "Endurance"}'
  UNION ALL SELECT 15, 'Group Fitness Class', 'Fitness', 60, 300.00, '{"Community", "Motivation"}'
  UNION ALL SELECT 16, 'Reflexology', 'Therapy', 45, 700.00, '{"Relaxation", "Balance"}'
  UNION ALL SELECT 17, 'Ayurveda Treatment', 'Therapy', 90, 1500.00, '{"Holistic Healing", "Energy Restoration"}'
  UNION ALL SELECT 18, 'Steam Bath', 'Spa', 30, 250.00, '{"Detox", "Circulation"}'
  UNION ALL SELECT 19, 'Wellness Assessment', 'Assessment', 90, 1000.00, '{"Health Evaluation", "Personalized Plan"}'
  UNION ALL SELECT 20, 'Group Meditation - Evening', 'Meditation', 45, 250.00, '{"Peace", "Community"}'
) s;

-- Insert clients (40+ members)
INSERT INTO clients (client_code, first_name, last_name, phone, email, date_of_birth, gender, address, medical_conditions, is_active)
WITH members AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 42)
)
SELECT
  'MEM-' || LPAD(m.rn::TEXT, 4, '0'),
  (ARRAY['Rajesh', 'Priya', 'Arun', 'Deepika', 'Vikram', 'Meera', 'Suresh', 'Neha', 'Amit', 'Kavita',
         'Yogesh', 'Divya', 'Hemant', 'Geeta', 'Ramesh', 'Sunita', 'Anita', 'Seema', 'Rekha', 'Pooja',
         'Arjun', 'Aryan', 'Aditya', 'Aarav', 'Bhavesh', 'Chetan', 'Chirag', 'Chandra', 'Devendra', 'Dinesh',
         'Eshan', 'Faisal', 'Gaurav', 'Hemant', 'Imran', 'Jagdish', 'Kailash', 'Lavesh', 'Mahesh', 'Naveen',
         'Omkar', 'Prakash'])[m.rn],
  (ARRAY['Singh', 'Kumar', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Mishra', 'Yadav', 'Pandey', 'Rao',
         'Nair', 'Iyer', 'Dey', 'Das', 'Roy', 'Reddy', 'Chopra', 'Malhotra', 'Arora', 'Bhat',
         'Kulkarni', 'Desai', 'Joshi', 'Tripathi', 'Srivastava', 'Saxena', 'Mittal', 'Garg', 'Goyal', 'Agarwal',
         'Chaudhary', 'Trivedi', 'Banerjee', 'Mukherjee', 'Ghosh', 'Sen', 'Menon', 'Kapoor', 'Tiwari', 'Daga',
         'Shrivastava', 'Taneja'])[m.rn],
  '987654' || LPAD((9100 + m.rn)::TEXT, 4, '0'),
  'member' || m.rn || '@email.com',
  CURRENT_DATE - (FLOOR(RANDOM() * 25000 + 7300)::INT),
  (ARRAY['MALE', 'FEMALE'])[1 + FLOOR(RANDOM() * 2)::INT],
  FLOOR(m.rn) || ' ' || (ARRAY['Ghat Road', 'Maidagin', 'Krishna Nagar', 'Vishwanath Gali', 'Varuna Nagar'])[1 + FLOOR(RANDOM() * 5)::INT] || ', Varanasi',
  CASE WHEN RANDOM() > 0.7 THEN (ARRAY['Diabetes', 'Hypertension', 'Arthritis', 'Asthma', 'Back Pain'])[1 + FLOOR(RANDOM() * 5)::INT] ELSE NULL END,
  true
FROM members m;

-- Insert appointments (40+ appointments)
INSERT INTO appointments (center_id, client_id, service_id, therapist_id, appointment_number, appointment_date, appointment_time, duration_minutes, service_amount, appointment_status, payment_status)
WITH appt_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 45)
)
SELECT
  (SELECT id FROM wellness_centers ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM clients ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM service_catalog ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM therapists ORDER BY RANDOM() LIMIT 1),
  'APPT-' || LPAD(ad.rn::TEXT, 5, '0'),
  CURRENT_DATE + (FLOOR(RANDOM() * 30)::INT),
  (ARRAY['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'])[1 + FLOOR(RANDOM() * 8)::INT]::TIME,
  (ARRAY[30, 45, 60, 90])[1 + FLOOR(RANDOM() * 4)::INT],
  FLOOR(RANDOM() * 1500 + 300)::DECIMAL(8,2),
  (ARRAY['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])[1 + FLOOR(RANDOM() * 4)::INT],
  (ARRAY['PENDING', 'PENDING', 'PAID'])[1 + FLOOR(RANDOM() * 3)::INT]
FROM appt_data ad;

-- Insert treatment packages
INSERT INTO treatment_packages (center_id, package_name, package_duration_days, number_of_sessions, total_price, services_included, is_active)
SELECT
  wc.id,
  p.package_name,
  p.duration_days,
  p.sessions,
  p.price,
  p.services,
  true
FROM wellness_centers wc
CROSS JOIN (
  SELECT 'Beginner Yoga Package' as package_name, 30 as duration_days, 12 as sessions, 3600.00 as price, '{"Yoga - Beginner": 12}'::JSONB as services
  UNION ALL SELECT '7-Day Detox Retreat', 7, 14, 8000.00, '{"Yoga": 7, "Meditation": 7, "Steam Bath": 7}'
  UNION ALL SELECT 'Spa Luxury Package', 60, 4, 5000.00, '{"Facial Treatment": 1, "Body Scrub": 1, "Massage": 2}'
  UNION ALL SELECT 'Stress Relief Package', 45, 8, 4000.00, '{"Massage": 4, "Meditation": 4}'
  UNION ALL SELECT 'Fitness Transformation', 90, 24, 12000.00, '{"Personal Training": 12, "Group Fitness": 12}'
  UNION ALL SELECT 'Wellness Mastery', 120, 30, 15000.00, '{"Yoga": 10, "Meditation": 10, "Nutrition": 10}'
) p;

-- Insert package subscriptions (20+ subscriptions)
INSERT INTO package_subscriptions (client_id, package_id, subscription_number, start_date, end_date, total_sessions, completed_sessions, amount_paid, subscription_status)
WITH subs_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 25)
)
SELECT
  (SELECT id FROM clients ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM treatment_packages ORDER BY RANDOM() LIMIT 1),
  'SUB-' || LPAD(sd.rn::TEXT, 5, '0'),
  CURRENT_DATE - (FLOOR(RANDOM() * 60)::INT),
  CURRENT_DATE + (FLOOR(RANDOM() * 60)::INT),
  (ARRAY[12, 14, 24, 30])[1 + FLOOR(RANDOM() * 4)::INT],
  FLOOR(RANDOM() * 15 + 3)::INT,
  FLOOR(RANDOM() * 15000 + 3000)::DECIMAL(10,2),
  (ARRAY['ACTIVE', 'ACTIVE', 'COMPLETED', 'EXPIRED'])[1 + FLOOR(RANDOM() * 4)::INT]
FROM subs_data sd;

-- Insert payments
INSERT INTO payments (appointment_id, receipt_number, payment_date, amount_paid, payment_mode)
SELECT
  a.id,
  'RCP-' || LPAD(ROW_NUMBER() OVER (ORDER BY a.id)::TEXT, 5, '0'),
  CURRENT_DATE - (FLOOR(RANDOM() * 15)::INT),
  a.service_amount,
  (ARRAY['CASH', 'CARD', 'UPI'])[1 + FLOOR(RANDOM() * 3)::INT]
FROM appointments a
WHERE a.appointment_status = 'COMPLETED'
LIMIT 35;

-- Summary
SELECT 'Health & Wellness Center Demo Data Loaded Successfully!' AS Status;
SELECT COUNT(*) AS "Total Members" FROM clients;
SELECT COUNT(*) AS "Total Therapists" FROM therapists;
SELECT COUNT(*) AS "Total Appointments" FROM appointments;
SELECT COUNT(*) AS "Active Subscriptions" FROM package_subscriptions WHERE subscription_status = 'ACTIVE';
