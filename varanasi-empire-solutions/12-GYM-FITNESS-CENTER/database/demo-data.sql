-- ============================================================================
-- GYM & FITNESS CENTER - Comprehensive Demo Data
-- Varanasi Focus: Fitness, Wellness, Personal Training
-- ============================================================================

SET search_path TO public, demo_helpers;

-- ============================================================================
-- GYMS (2-3 gym locations)
-- ============================================================================
INSERT INTO gyms (gym_name, address, city, phone, total_capacity, is_active) VALUES
('FitZone Varanasi - Main Branch', '45 Cantonment Road, Fitness Complex, Varanasi', 'Varanasi', '9876543900', 300, true),
('FitZone Lucknow - Premium Center', '123 Sahara Center, Gomti Nagar, Lucknow', 'Lucknow', '9876543901', 400, true),
('FitZone Agra - Sports Hub', 'Fatehabad Road, Sports District, Agra', 'Agra', '9876543902', 250, true);

-- ============================================================================
-- MEMBERSHIP PLANS (15+ membership plans)
-- ============================================================================
INSERT INTO membership_plans (gym_id, plan_name, duration_months, plan_fee, registration_fee, benefits, is_active) VALUES
-- Varanasi Main Branch Plans
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'Monthly Basic', 1, 1500.00, 500.00, ARRAY['Gym Access 6AM-10PM', 'Locker Facility'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'Quarterly Plus', 3, 4000.00, 500.00, ARRAY['Gym Access 24/7', 'Locker Facility', 'One Induction Session'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'Annual Premium', 12, 12000.00, 1000.00, ARRAY['Gym Access 24/7', 'Locker Facility', 'Monthly Body Composition Analysis', 'Guest Passes (5)'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'Personal Training - 8 Sessions', 1, 8000.00, 0.00, ARRAY['8 Personal Training Sessions', 'Form Correction', 'Nutrition Guidance'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'Personal Training - 16 Sessions', 2, 14000.00, 0.00, ARRAY['16 Personal Training Sessions', 'Form Correction', 'Monthly Review'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'Diet & Fitness Combo', 3, 8000.00, 500.00, ARRAY['Gym Access 24/7', 'Quarterly Diet Plan', 'Body Metrics Tracking'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'Couple Plan - 6 Months', 6, 10000.00, 800.00, ARRAY['Access for 2 People', 'Locker Facility', 'Partner Workout Sessions'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'Student Special', 12, 6000.00, 500.00, ARRAY['24/7 Access', 'Locker Facility', 'Discount on PT Sessions'], true),
-- Lucknow Premium Center Plans
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'Premium Monthly', 1, 2500.00, 1000.00, ARRAY['24/7 Access', 'Premium Locker', 'Sauna Access', 'Monthly Assessment'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'Premium Quarterly', 3, 6500.00, 1000.00, ARRAY['24/7 Access', 'Premium Locker', 'Sauna & Steam', 'Quarterly Review'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'Elite Annual', 12, 20000.00, 2000.00, ARRAY['24/7 Access', 'VIP Locker', 'Sauna/Steam/Spa', 'Monthly Trainer', 'Guest Passes (10)'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'Corporate Membership', 12, 15000.00, 1500.00, ARRAY['Access for Employee', 'Corporate Rates', 'Health Seminars', 'Discount on PT'], true),
-- Agra Sports Hub Plans
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'Basic Monthly', 1, 1200.00, 400.00, ARRAY['Gym Access 6AM-10PM', 'Locker Facility'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'Quarterly Standard', 3, 3200.00, 400.00, ARRAY['24/7 Access', 'Locker Facility', 'Fitness Assessment'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'Annual Gold', 12, 10000.00, 800.00, ARRAY['24/7 Access', 'Locker Facility', 'Monthly Assessment', 'Guest Passes (3)'], true);

-- ============================================================================
-- MEMBERS (40+ members)
-- ============================================================================
INSERT INTO members (gym_id, member_code, first_name, last_name, phone, email, date_of_birth, gender, address, emergency_contact_name, emergency_contact_phone, medical_conditions, fitness_goals, is_active) VALUES
-- Varanasi Members
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM001', 'Rajesh', 'Sharma', '9876544000', 'rajesh.fitness@email.com', '1990-05-15', 'MALE', 'Flat 201, Heritage Heights, Varanasi', 'Priya Sharma', '9876544100', NULL, ARRAY['Weight Loss', 'Muscle Building'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM002', 'Priya', 'Singh', '9876544001', 'priya.fitness@email.com', '1992-08-22', 'FEMALE', 'House 45, Ashok Vihar, Varanasi', 'Amar Singh', '9876544101', NULL, ARRAY['Toning', 'Flexibility'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM003', 'Amit', 'Verma', '9876544002', 'amit.fitness@email.com', '1988-03-10', 'MALE', 'Apartment 12, Scholar Colony, Varanasi', 'Seema Verma', '9876544102', NULL, ARRAY['Strength Training', 'Athletic Build'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM004', 'Anjali', 'Patel', '9876544003', 'anjali.fitness@email.com', '1995-11-30', 'FEMALE', 'Flat 105, Garden View, Varanasi', 'Rajesh Patel', '9876544103', NULL, ARRAY['Weight Loss', 'Stamina Building'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM005', 'Vikram', 'Pandey', '9876544004', 'vikram.fitness@email.com', '1987-07-14', 'MALE', 'House 78, Cantonment, Varanasi', 'Kavya Pandey', '9876544104', NULL, ARRAY['Muscle Building', 'Power Lifting'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM006', 'Neha', 'Gupta', '9876544005', 'neha.fitness@email.com', '1993-09-18', 'FEMALE', 'Apartment 8, Govind Vihar, Varanasi', 'Ashok Gupta', '9876544105', NULL, ARRAY['Weight Loss', 'Cardio Training'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM007', 'Arjun', 'Singh', '9876544006', 'arjun.fitness@email.com', '1989-02-21', 'MALE', 'Villa 5, Elite Colony, Varanasi', 'Meera Singh', '9876544106', NULL, ARRAY['Cross Training', 'Endurance'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM008', 'Divya', 'Kumar', '9876544007', 'divya.fitness@email.com', '1994-06-12', 'FEMALE', 'Flat 302, Medical Gardens, Varanasi', 'Rajendra Kumar', '9876544107', NULL, ARRAY['Yoga', 'Flexibility Training'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM009', 'Suresh', 'Mishra', '9876544008', 'suresh.fitness@email.com', '1986-04-28', 'MALE', 'House 156, Saket Nagar, Varanasi', 'Sunita Mishra', '9876544108', NULL, ARRAY['Muscle Building', 'Body Recomposition'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM010', 'Meera', 'Sharma', '9876544009', 'meera.fitness@email.com', '1991-10-05', 'FEMALE', 'Apartment 9, Heritage Enclave, Varanasi', 'Vikram Sharma', '9876544109', 'Thyroid', ARRAY['Weight Management', 'Energy Boost'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM011', 'Sameer', 'Joshi', '9876544010', 'sameer.fitness@email.com', '1988-08-17', 'MALE', 'House 201, Scholar Nagar, Varanasi', 'Anjali Joshi', '9876544110', NULL, ARRAY['Weight Loss', 'Fitness Maintenance'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM012', 'Pooja', 'Mishra', '9876544011', 'pooja.fitness@email.com', '1993-12-01', 'FEMALE', 'Apartment 15, Happy Homes, Varanasi', 'Surendra Mishra', '9876544111', NULL, ARRAY['Toning', 'Weight Loss'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM013', 'Rohit', 'Desai', '9876544012', 'rohit.fitness@email.com', '1990-05-11', 'MALE', 'Flat 401, Riverside Towers, Varanasi', 'Rajesh Desai', '9876544112', NULL, ARRAY['Strength', 'Athletic Performance'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM014', 'Sneha', 'Kulkarni', '9876544013', 'sneha.fitness@email.com', '1994-09-14', 'FEMALE', 'Apartment 10, Health Residency, Varanasi', 'Amit Kulkarni', '9876544113', NULL, ARRAY['Cardio', 'Weight Loss'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM015', 'Vinay', 'Singh', '9876544014', 'vinay.fitness@email.com', '1987-03-25', 'MALE', 'House 89, Science Nagar, Varanasi', 'Kavya Singh', '9876544114', 'Lower Back Pain', ARRAY['Core Strength', 'Rehabilitation'], true),
-- Lucknow Members
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'MEM016', 'Rajeev', 'Kumar', '9876544015', 'rajeev.fitness@email.com', '1989-01-19', 'MALE', 'Flat 201, IAS Complex, Lucknow', 'Seema Kumar', '9876544115', NULL, ARRAY['Weight Loss', 'Muscle Building'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'MEM017', 'Anjali', 'Singh', '9876544016', 'anjali.fitness@email.com', '1991-08-15', 'FEMALE', 'Apartment 12, Premium Heights, Lucknow', 'Amar Singh', '9876544116', NULL, ARRAY['Toning', 'Weight Loss'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'MEM018', 'Praveen', 'Sharma', '9876544017', 'praveen.fitness@email.com', '1988-03-10', 'MALE', 'House 78, Civil Lines, Lucknow', 'Suresh Sharma', '9876544117', NULL, ARRAY['Strength Training', 'Muscle Building'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'MEM019', 'Neha', 'Gupta', '9876544018', 'neha.lko@email.com', '1993-07-22', 'FEMALE', 'Flat 205, Gomti Heights, Lucknow', 'Ashok Gupta', '9876544118', NULL, ARRAY['Weight Loss', 'Stamina'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'MEM020', 'Rohit', 'Yadav', '9876544019', 'rohit.lko@email.com', '1990-01-08', 'MALE', 'Apartment 8, Railway Heights, Lucknow', 'Harpal Yadav', '9876544119', NULL, ARRAY['Fitness Maintenance', 'Strength'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'MEM021', 'Seema', 'Verma', '9876544020', 'seema.lko@email.com', '1992-11-30', 'FEMALE', 'House 156, Saket, Lucknow', 'Rajesh Verma', '9876544120', NULL, ARRAY['Weight Loss', 'Toning'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'MEM022', 'Vivek', 'Yadav', '9876544021', 'vivek.lko@email.com', '1987-09-12', 'MALE', 'Flat 301, Corporate Plaza, Lucknow', 'Rajendra Yadav', '9876544121', NULL, ARRAY['Muscle Building', 'Cross Training'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'MEM023', 'Pooja', 'Patel', '9876544022', 'pooja.lko@email.com', '1994-04-19', 'FEMALE', 'Apartment 6, Modern Plaza, Lucknow', 'Vikram Patel', '9876544122', NULL, ARRAY['Cardio', 'Weight Loss'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'MEM024', 'Gaurav', 'Kapoor', '9876544023', 'gaurav.lko@email.com', '1989-06-05', 'MALE', 'House 234, Aliganj, Lucknow', 'Rajesh Kapoor', '9876544123', NULL, ARRAY['Strength', 'Athletic Build'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'MEM025', 'Divya', 'Saxena', '9876544024', 'divya.lko@email.com', '1993-02-14', 'FEMALE', 'Flat 401, UPSC Center, Lucknow', 'Mahesh Saxena', '9876544124', NULL, ARRAY['Weight Loss', 'Flexibility'], true),
-- Agra Members
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'MEM026', 'Arjun', 'Trivedi', '9876544025', 'arjun.agra@email.com', '1988-10-28', 'MALE', 'Apartment 10, Premium Plaza, Agra', 'Rajesh Trivedi', '9876544125', NULL, ARRAY['Strength Training', 'Muscle Building'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'MEM027', 'Nikita', 'Agarwal', '9876544026', 'nikita.agra@email.com', '1994-08-17', 'FEMALE', 'House 89, Health District, Agra', 'Anil Agarwal', '9876544126', NULL, ARRAY['Weight Loss', 'Toning'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'MEM028', 'Akshay', 'Joshi', '9876544027', 'akshay.agra@email.com', '1989-04-11', 'MALE', 'Flat 107, Sports Complex, Agra', 'Vikram Joshi', '9876544127', NULL, ARRAY['Muscle Building', 'Power Lifting'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'MEM029', 'Riya', 'Desai', '9876544028', 'riya.agra@email.com', '1995-07-26', 'FEMALE', 'Apartment 14, Fitness Vihar, Agra', 'Anand Desai', '9876544128', NULL, ARRAY['Cardio', 'Weight Loss'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'MEM030', 'Srishti', 'Bhat', '9876544029', 'srishti.agra@email.com', '1993-09-03', 'FEMALE', 'House 145, Health Park, Agra', 'Rajesh Bhat', '9876544129', 'Knee Issues', ARRAY['Low Impact Cardio', 'Strength'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'MEM031', 'Nikhil', 'Menon', '9876544030', 'nikhil.agra@email.com', '1990-05-21', 'MALE', 'Flat 208, Wellness Center, Agra', 'Suresh Menon', '9876544130', NULL, ARRAY['Fitness Maintenance', 'Strength'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'MEM032', 'Manish', 'Kulkarni', '9876544031', 'manish.agra@email.com', '1987-12-09', 'MALE', 'Apartment 5, Sports Hub, Agra', 'Hari Kulkarni', '9876544131', NULL, ARRAY['Muscle Building', 'Cross Training'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'MEM033', 'Tina', 'Srivastava', '9876544032', 'tina.agra@email.com', '1994-03-16', 'FEMALE', 'House 302, Fit Circle, Agra', 'Rajesh Srivastava', '9876544132', NULL, ARRAY['Weight Loss', 'Toning'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'MEM034', 'Vishal', 'Nair', '9876544033', 'vishal.agra@email.com', '1988-06-20', 'MALE', 'Flat 402, Training Complex, Agra', 'Suresh Nair', '9876544133', NULL, ARRAY['Strength', 'Athletic Build'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'MEM035', 'Kavya', 'Iyer', '9876544034', 'kavya.agra@email.com', '1992-11-16', 'FEMALE', 'House 167, Wellness Lane, Agra', 'Nagarajan Iyer', '9876544134', NULL, ARRAY['Yoga', 'Flexibility'], true);

-- Additional members (continuing...)
INSERT INTO members (gym_id, member_code, first_name, last_name, phone, email, date_of_birth, gender, address, emergency_contact_name, emergency_contact_phone, medical_conditions, fitness_goals, is_active) VALUES
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM036', 'Isha', 'Patel', '9876544035', 'isha.fitness@email.com', '1995-01-19', 'FEMALE', 'House 234, Health Vihar, Varanasi', 'Ramesh Patel', '9876544135', NULL, ARRAY['Weight Loss', 'Stamina Building'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM037', 'Karan', 'Singh', '9876544036', 'karan.fitness@email.com', '1991-06-08', 'MALE', 'Apartment 7, Research Park, Varanasi', 'Rajendra Singh', '9876544136', NULL, ARRAY['Strength Training', 'Muscle Building'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM038', 'Rupa', 'Desai', '9876544037', 'rupa.fitness@email.com', '1993-09-14', 'FEMALE', 'Flat 102, Science Complex, Varanasi', 'Amit Desai', '9876544137', NULL, ARRAY['Weight Loss', 'Cardio'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'MEM039', 'Anil', 'Singh', '9876544038', 'anil.fitness@email.com', '1986-03-25', 'MALE', 'House 89, Park Avenue, Varanasi', 'Rajendra Singh', '9876544138', 'Diabetes', ARRAY['Weight Management', 'Cardio'], true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'MEM040', 'Ravi', 'Mishra', '9876544039', 'ravi.lko@email.com', '1989-10-13', 'MALE', 'Apartment 14, Corporate Circle, Lucknow', 'Rajendra Mishra', '9876544139', NULL, ARRAY['Weight Loss', 'Muscle Building'], true);

-- ============================================================================
-- TRAINERS (10+ trainers)
-- ============================================================================
INSERT INTO trainers (gym_id, trainer_code, first_name, last_name, phone, specialization, certification, hourly_rate, is_active) VALUES
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'TRNER001', 'Vikram', 'Singh', '9876544200', ARRAY['Weight Training', 'Strength & Conditioning'], 'ISSA CFT, Level 1 Strength Coach', 500.00, true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'TRNER002', 'Priya', 'Sharma', '9876544201', ARRAY['Weight Loss', 'Cardio Training'], 'ACE Personal Trainer, Pilates Certified', 450.00, true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'TRNER003', 'Arjun', 'Verma', '9876544202', ARRAY['CrossFit', 'Functional Training'], 'CrossFit Level 2, Functional Movement Screen', 550.00, true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'TRNER004', 'Neha', 'Gupta', '9876544203', ARRAY['Yoga', 'Flexibility Training'], 'RYT 200, Yoga Alliance Certified', 350.00, true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Varanasi - Main Branch'), 'TRNER005', 'Rohit', 'Pandey', '9876544204', ARRAY['Rehabilitation', 'Core Training'], 'Corrective Exercise Specialist, Physical Therapy Aide', 480.00, true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'TRNER006', 'Anil', 'Kumar', '9876544205', ARRAY['Muscle Building', 'Power Lifting'], 'ISSF Weight Training Coach, ISSA CFT', 600.00, true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'TRNER007', 'Deepa', 'Singh', '9876544206', ARRAY['Weight Loss', 'Circuit Training'], 'ACE Certified, NASM Weight Loss Specialist', 500.00, true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Lucknow - Premium Center'), 'TRNER008', 'Suresh', 'Joshi', '9876544207', ARRAY['Athletic Training', 'Performance Enhancement'], 'CSCS, Olympic Lifting Coach', 700.00, true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'TRNER009', 'Kavya', 'Sharma', '9876544208', ARRAY['Weight Training', 'Nutrition Coaching'], 'ISSA CFT, Nutrition Specialist', 450.00, true),
((SELECT id FROM gyms WHERE gym_name = 'FitZone Agra - Sports Hub'), 'TRNER010', 'Rajesh', 'Mishra', '9876544209', ARRAY['General Fitness', 'Beginner Training'], 'ACE Personal Trainer, CPR Certified', 400.00, true);

-- ============================================================================
-- MEMBERSHIPS (40+ memberships)
-- ============================================================================
INSERT INTO memberships (member_id, plan_id, membership_number, start_date, end_date, total_fee, discount, final_fee, payment_status, membership_status, created_at) VALUES
-- Varanasi Members Memberships
((SELECT id FROM members WHERE member_code = 'MEM001'), (SELECT id FROM membership_plans WHERE plan_name = 'Annual Premium'), 'MEM-001-001', '2024-11-01', '2025-10-31', 12000.00, 500.00, 11500.00, 'PAID', 'ACTIVE', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM002'), (SELECT id FROM membership_plans WHERE plan_name = 'Quarterly Plus'), 'MEM-002-001', '2024-11-01', '2025-01-31', 4000.00, 200.00, 3800.00, 'PAID', 'ACTIVE', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM003'), (SELECT id FROM membership_plans WHERE plan_name = 'Annual Premium'), 'MEM-003-001', '2024-10-15', '2025-10-14', 12000.00, 0.00, 12000.00, 'PAID', 'ACTIVE', '2024-10-15'),
((SELECT id FROM members WHERE member_code = 'MEM004'), (SELECT id FROM membership_plans WHERE plan_name = 'Monthly Basic'), 'MEM-004-001', '2024-11-05', '2024-12-05', 1500.00, 0.00, 1500.00, 'PAID', 'ACTIVE', '2024-11-05'),
((SELECT id FROM members WHERE member_code = 'MEM005'), (SELECT id FROM membership_plans WHERE plan_name = 'Personal Training - 16 Sessions'), 'MEM-005-001', '2024-10-20', '2024-12-20', 14000.00, 500.00, 13500.00, 'PAID', 'ACTIVE', '2024-10-20'),
((SELECT id FROM members WHERE member_code = 'MEM006'), (SELECT id FROM membership_plans WHERE plan_name = 'Diet & Fitness Combo'), 'MEM-006-001', '2024-11-01', '2025-01-31', 8000.00, 300.00, 7700.00, 'PARTIAL', 'ACTIVE', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM007'), (SELECT id FROM membership_plans WHERE plan_name = 'Annual Premium'), 'MEM-007-001', '2024-09-01', '2025-08-31', 12000.00, 1000.00, 11000.00, 'PAID', 'ACTIVE', '2024-09-01'),
((SELECT id FROM members WHERE member_code = 'MEM008'), (SELECT id FROM membership_plans WHERE plan_name = 'Couple Plan - 6 Months'), 'MEM-008-001', '2024-10-01', '2025-03-31', 10000.00, 500.00, 9500.00, 'PAID', 'ACTIVE', '2024-10-01'),
((SELECT id FROM members WHERE member_code = 'MEM009'), (SELECT id FROM membership_plans WHERE plan_name = 'Personal Training - 8 Sessions'), 'MEM-009-001', '2024-11-10', '2024-12-10', 8000.00, 0.00, 8000.00, 'PENDING', 'ACTIVE', '2024-11-10'),
((SELECT id FROM members WHERE member_code = 'MEM010'), (SELECT id FROM membership_plans WHERE plan_name = 'Quarterly Plus'), 'MEM-010-001', '2024-11-01', '2025-01-31', 4000.00, 200.00, 3800.00, 'PAID', 'ACTIVE', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM011'), (SELECT id FROM membership_plans WHERE plan_name = 'Annual Premium'), 'MEM-011-001', '2024-08-15', '2025-08-14', 12000.00, 500.00, 11500.00, 'PAID', 'ACTIVE', '2024-08-15'),
((SELECT id FROM members WHERE member_code = 'MEM012'), (SELECT id FROM membership_plans WHERE plan_name = 'Student Special'), 'MEM-012-001', '2024-09-01', '2025-08-31', 6000.00, 300.00, 5700.00, 'PAID', 'ACTIVE', '2024-09-01'),
((SELECT id FROM members WHERE member_code = 'MEM013'), (SELECT id FROM membership_plans WHERE plan_name = 'Monthly Basic'), 'MEM-013-001', '2024-11-15', '2024-12-15', 1500.00, 0.00, 1500.00, 'PAID', 'ACTIVE', '2024-11-15'),
((SELECT id FROM members WHERE member_code = 'MEM014'), (SELECT id FROM membership_plans WHERE plan_name = 'Quarterly Plus'), 'MEM-014-001', '2024-10-01', '2024-12-31', 4000.00, 200.00, 3800.00, 'PAID', 'ACTIVE', '2024-10-01'),
((SELECT id FROM members WHERE member_code = 'MEM015'), (SELECT id FROM membership_plans WHERE plan_name = 'Diet & Fitness Combo'), 'MEM-015-001', '2024-11-05', '2025-02-05', 8000.00, 400.00, 7600.00, 'PARTIAL', 'ACTIVE', '2024-11-05'),
-- Lucknow Members Memberships
((SELECT id FROM members WHERE member_code = 'MEM016'), (SELECT id FROM membership_plans WHERE plan_name = 'Elite Annual'), 'MEM-016-001', '2024-10-01', '2025-09-30', 20000.00, 1000.00, 19000.00, 'PAID', 'ACTIVE', '2024-10-01'),
((SELECT id FROM members WHERE member_code = 'MEM017'), (SELECT id FROM membership_plans WHERE plan_name = 'Premium Quarterly'), 'MEM-017-001', '2024-11-01', '2025-01-31', 6500.00, 300.00, 6200.00, 'PAID', 'ACTIVE', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM018'), (SELECT id FROM membership_plans WHERE plan_name = 'Premium Monthly'), 'MEM-018-001', '2024-11-10', '2024-12-10', 2500.00, 100.00, 2400.00, 'PAID', 'ACTIVE', '2024-11-10'),
((SELECT id FROM members WHERE member_code = 'MEM019'), (SELECT id FROM membership_plans WHERE plan_name = 'Premium Quarterly'), 'MEM-019-001', '2024-10-15', '2025-01-14', 6500.00, 200.00, 6300.00, 'PARTIAL', 'ACTIVE', '2024-10-15'),
((SELECT id FROM members WHERE member_code = 'MEM020'), (SELECT id FROM membership_plans WHERE plan_name = 'Corporate Membership'), 'MEM-020-001', '2024-09-01', '2025-08-31', 15000.00, 500.00, 14500.00, 'PAID', 'ACTIVE', '2024-09-01'),
((SELECT id FROM members WHERE member_code = 'MEM021'), (SELECT id FROM membership_plans WHERE plan_name = 'Premium Monthly'), 'MEM-021-001', '2024-11-01', '2024-12-01', 2500.00, 0.00, 2500.00, 'PAID', 'ACTIVE', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM022'), (SELECT id FROM membership_plans WHERE plan_name = 'Elite Annual'), 'MEM-022-001', '2024-08-01', '2025-07-31', 20000.00, 1500.00, 18500.00, 'PAID', 'ACTIVE', '2024-08-01'),
((SELECT id FROM members WHERE member_code = 'MEM023'), (SELECT id FROM membership_plans WHERE plan_name = 'Premium Quarterly'), 'MEM-023-001', '2024-11-05', '2025-02-04', 6500.00, 250.00, 6250.00, 'PAID', 'ACTIVE', '2024-11-05'),
((SELECT id FROM members WHERE member_code = 'MEM024'), (SELECT id FROM membership_plans WHERE plan_name = 'Premium Monthly'), 'MEM-024-001', '2024-11-15', '2024-12-15', 2500.00, 100.00, 2400.00, 'PAID', 'ACTIVE', '2024-11-15'),
((SELECT id FROM members WHERE member_code = 'MEM025'), (SELECT id FROM membership_plans WHERE plan_name = 'Premium Quarterly'), 'MEM-025-001', '2024-10-01', '2024-12-31', 6500.00, 300.00, 6200.00, 'PAID', 'ACTIVE', '2024-10-01'),
-- Agra Members Memberships
((SELECT id FROM members WHERE member_code = 'MEM026'), (SELECT id FROM membership_plans WHERE plan_name = 'Annual Gold'), 'MEM-026-001', '2024-09-01', '2025-08-31', 10000.00, 500.00, 9500.00, 'PAID', 'ACTIVE', '2024-09-01'),
((SELECT id FROM members WHERE member_code = 'MEM027'), (SELECT id FROM membership_plans WHERE plan_name = 'Quarterly Standard'), 'MEM-027-001', '2024-11-01', '2025-01-31', 3200.00, 150.00, 3050.00, 'PAID', 'ACTIVE', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM028'), (SELECT id FROM membership_plans WHERE plan_name = 'Annual Gold'), 'MEM-028-001', '2024-10-15', '2025-10-14', 10000.00, 0.00, 10000.00, 'PAID', 'ACTIVE', '2024-10-15'),
((SELECT id FROM members WHERE member_code = 'MEM029'), (SELECT id FROM membership_plans WHERE plan_name = 'Basic Monthly'), 'MEM-029-001', '2024-11-10', '2024-12-10', 1200.00, 0.00, 1200.00, 'PAID', 'ACTIVE', '2024-11-10'),
((SELECT id FROM members WHERE member_code = 'MEM030'), (SELECT id FROM membership_plans WHERE plan_name = 'Quarterly Standard'), 'MEM-030-001', '2024-10-20', '2025-01-19', 3200.00, 200.00, 3000.00, 'PARTIAL', 'ACTIVE', '2024-10-20'),
((SELECT id FROM members WHERE member_code = 'MEM031'), (SELECT id FROM membership_plans WHERE plan_name = 'Annual Gold'), 'MEM-031-001', '2024-08-01', '2025-07-31', 10000.00, 500.00, 9500.00, 'PAID', 'ACTIVE', '2024-08-01'),
((SELECT id FROM members WHERE member_code = 'MEM032'), (SELECT id FROM membership_plans WHERE plan_name = 'Basic Monthly'), 'MEM-032-001', '2024-11-01', '2024-12-01', 1200.00, 0.00, 1200.00, 'PAID', 'ACTIVE', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM033'), (SELECT id FROM membership_plans WHERE plan_name = 'Quarterly Standard'), 'MEM-033-001', '2024-11-05', '2025-02-04', 3200.00, 150.00, 3050.00, 'PAID', 'ACTIVE', '2024-11-05'),
((SELECT id FROM members WHERE member_code = 'MEM034'), (SELECT id FROM membership_plans WHERE plan_name = 'Annual Gold'), 'MEM-034-001', '2024-09-15', '2025-09-14', 10000.00, 1000.00, 9000.00, 'PAID', 'ACTIVE', '2024-09-15'),
((SELECT id FROM members WHERE member_code = 'MEM035'), (SELECT id FROM membership_plans WHERE plan_name = 'Quarterly Standard'), 'MEM-035-001', '2024-10-01', '2024-12-31', 3200.00, 200.00, 3000.00, 'PAID', 'ACTIVE', '2024-10-01'),
((SELECT id FROM members WHERE member_code = 'MEM036'), (SELECT id FROM membership_plans WHERE plan_name = 'Annual Gold'), 'MEM-036-001', '2024-11-01', '2025-10-31', 10000.00, 500.00, 9500.00, 'PAID', 'ACTIVE', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM037'), (SELECT id FROM membership_plans WHERE plan_name = 'Basic Monthly'), 'MEM-037-001', '2024-11-15', '2024-12-15', 1200.00, 0.00, 1200.00, 'PAID', 'ACTIVE', '2024-11-15'),
((SELECT id FROM members WHERE member_code = 'MEM038'), (SELECT id FROM membership_plans WHERE plan_name = 'Quarterly Standard'), 'MEM-038-001', '2024-10-10', '2025-01-09', 3200.00, 200.00, 3000.00, 'PARTIAL', 'ACTIVE', '2024-10-10'),
((SELECT id FROM members WHERE member_code = 'MEM039'), (SELECT id FROM membership_plans WHERE plan_name = 'Annual Gold'), 'MEM-039-001', '2024-09-01', '2025-08-31', 10000.00, 1000.00, 9000.00, 'PAID', 'ACTIVE', '2024-09-01'),
((SELECT id FROM members WHERE member_code = 'MEM040'), (SELECT id FROM membership_plans WHERE plan_name = 'Quarterly Standard'), 'MEM-040-001', '2024-11-01', '2025-01-31', 3200.00, 150.00, 3050.00, 'PAID', 'ACTIVE', '2024-11-01');

-- ============================================================================
-- ATTENDANCE RECORDS (30+ attendance records)
-- ============================================================================
INSERT INTO attendance (member_id, check_in_time, check_out_time, created_at) VALUES
-- Varanasi Members Attendance
((SELECT id FROM members WHERE member_code = 'MEM001'), '2024-11-01 06:30:00', '2024-11-01 07:45:00', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM001'), '2024-11-02 06:25:00', '2024-11-02 07:50:00', '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM002'), '2024-11-01 17:15:00', '2024-11-01 18:30:00', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM002'), '2024-11-03 17:20:00', '2024-11-03 18:45:00', '2024-11-03'),
((SELECT id FROM members WHERE member_code = 'MEM003'), '2024-11-01 06:00:00', '2024-11-01 07:30:00', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM003'), '2024-11-02 06:05:00', '2024-11-02 07:35:00', '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM004'), '2024-11-05 17:00:00', '2024-11-05 18:00:00', '2024-11-05'),
((SELECT id FROM members WHERE member_code = 'MEM005'), '2024-11-01 07:15:00', '2024-11-01 08:45:00', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM006'), '2024-11-01 18:00:00', '2024-11-01 19:15:00', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM007'), '2024-11-02 06:30:00', '2024-11-02 08:00:00', '2024-11-02'),
-- Lucknow Members Attendance
((SELECT id FROM members WHERE member_code = 'MEM016'), '2024-11-01 06:00:00', '2024-11-01 07:30:00', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM016'), '2024-11-02 06:15:00', '2024-11-02 07:45:00', '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM017'), '2024-11-01 19:00:00', '2024-11-01 20:15:00', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM017'), '2024-11-03 19:10:00', '2024-11-03 20:30:00', '2024-11-03'),
((SELECT id FROM members WHERE member_code = 'MEM018'), '2024-11-10 06:30:00', '2024-11-10 08:00:00', '2024-11-10'),
((SELECT id FROM members WHERE member_code = 'MEM018'), '2024-11-12 06:25:00', '2024-11-12 07:50:00', '2024-11-12'),
((SELECT id FROM members WHERE member_code = 'MEM019'), '2024-11-01 17:30:00', '2024-11-01 18:45:00', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM020'), '2024-11-02 06:00:00', '2024-11-02 07:30:00', '2024-11-02'),
-- Agra Members Attendance
((SELECT id FROM members WHERE member_code = 'MEM026'), '2024-11-01 06:30:00', '2024-11-01 07:45:00', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM026'), '2024-11-03 06:25:00', '2024-11-03 07:50:00', '2024-11-03'),
((SELECT id FROM members WHERE member_code = 'MEM027'), '2024-11-02 17:00:00', '2024-11-02 18:15:00', '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM028'), '2024-11-01 07:00:00', '2024-11-01 08:30:00', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM029'), '2024-11-10 18:00:00', '2024-11-10 19:00:00', '2024-11-10'),
((SELECT id FROM members WHERE member_code = 'MEM030'), '2024-11-01 17:15:00', '2024-11-01 18:30:00', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM031'), '2024-11-02 06:00:00', '2024-11-02 07:30:00', '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM032'), '2024-11-01 17:30:00', '2024-11-01 18:45:00', '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM033'), '2024-11-05 18:00:00', '2024-11-05 19:15:00', '2024-11-05'),
((SELECT id FROM members WHERE member_code = 'MEM034'), '2024-11-03 06:30:00', '2024-11-03 08:00:00', '2024-11-03'),
((SELECT id FROM members WHERE member_code = 'MEM040'), '2024-11-01 19:00:00', '2024-11-01 20:00:00', '2024-11-01');

-- ============================================================================
-- BODY MEASUREMENTS (25+ measurements)
-- ============================================================================
INSERT INTO body_measurements (member_id, measurement_date, weight_kg, height_cm, bmi, body_fat_percentage, muscle_mass_kg, chest_cm, waist_cm, hips_cm, biceps_cm, measured_by, created_at) VALUES
((SELECT id FROM members WHERE member_code = 'MEM001'), '2024-11-01', 82.50, 178.00, 26.05, 22.5, 58.50, 102.00, 88.00, 95.00, 34.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM002'), '2024-11-01', 62.00, 168.00, 21.97, 24.0, 46.00, 88.00, 72.00, 92.00, 28.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER002'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM003'), '2024-11-02', 85.00, 180.00, 26.23, 20.0, 65.00, 108.00, 90.00, 98.00, 36.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM004'), '2024-11-05', 58.50, 166.00, 21.23, 26.0, 42.00, 84.00, 68.00, 88.00, 26.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER002'), '2024-11-05'),
((SELECT id FROM members WHERE member_code = 'MEM005'), '2024-11-01', 88.00, 182.00, 26.57, 18.5, 72.00, 112.00, 92.00, 100.00, 38.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM006'), '2024-11-01', 65.00, 170.00, 22.49, 25.0, 49.00, 90.00, 74.00, 94.00, 29.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER002'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM007'), '2024-11-02', 80.00, 176.00, 25.82, 21.0, 62.00, 100.00, 86.00, 94.00, 33.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM008'), '2024-11-01', 60.00, 164.00, 22.30, 27.0, 44.00, 82.00, 70.00, 90.00, 27.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER004'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM009'), '2024-11-03', 86.00, 180.00, 26.54, 23.0, 65.00, 110.00, 91.00, 99.00, 37.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), '2024-11-03'),
((SELECT id FROM members WHERE member_code = 'MEM010'), '2024-11-01', 64.00, 168.00, 22.68, 26.5, 47.00, 88.00, 73.00, 93.00, 28.50, (SELECT id FROM trainers WHERE trainer_code = 'TRNER002'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM016'), '2024-11-01', 78.00, 176.00, 25.20, 19.5, 62.00, 98.00, 84.00, 92.00, 32.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER006'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM017'), '2024-11-01', 61.00, 166.00, 22.13, 23.0, 46.50, 86.00, 71.00, 91.00, 27.50, (SELECT id FROM trainers WHERE trainer_code = 'TRNER007'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM018'), '2024-11-10', 84.00, 179.00, 26.23, 22.0, 65.00, 106.00, 89.00, 97.00, 35.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER006'), '2024-11-10'),
((SELECT id FROM members WHERE member_code = 'MEM019'), '2024-11-01', 63.00, 167.00, 22.59, 25.0, 47.50, 87.00, 72.00, 92.00, 28.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER007'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM020'), '2024-11-02', 82.00, 177.00, 26.16, 24.0, 62.00, 104.00, 87.00, 96.00, 34.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER006'), '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM026'), '2024-11-01', 79.00, 175.00, 25.78, 20.0, 63.00, 100.00, 85.00, 93.00, 33.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER009'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM027'), '2024-11-01', 62.00, 165.00, 22.77, 26.0, 46.00, 86.00, 71.00, 90.00, 28.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER010'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM028'), '2024-11-10', 83.50, 178.00, 26.38, 21.5, 65.00, 105.00, 88.50, 96.50, 35.50, (SELECT id FROM trainers WHERE trainer_code = 'TRNER009'), '2024-11-10'),
((SELECT id FROM members WHERE member_code = 'MEM029'), '2024-11-10', 61.00, 166.00, 22.13, 24.0, 46.00, 85.00, 70.00, 89.00, 27.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER010'), '2024-11-10'),
((SELECT id FROM members WHERE member_code = 'MEM030'), '2024-11-01', 70.00, 172.00, 23.67, 28.0, 50.00, 92.00, 78.00, 95.00, 30.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER009'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM031'), '2024-11-02', 81.00, 177.00, 25.86, 21.0, 64.00, 102.00, 86.00, 95.00, 34.00, (SELECT id FROM trainers WHERE trainer_code = 'TRNER010'), '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM032'), '2024-11-01', 87.00, 181.00, 26.56, 23.5, 66.00, 111.00, 92.00, 100.00, 37.50, (SELECT id FROM trainers WHERE trainer_code = 'TRNER009'), '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM033'), '2024-11-05', 64.00, 169.00, 22.41, 25.0, 48.00, 89.00, 73.00, 93.00, 28.50, (SELECT id FROM trainers WHERE trainer_code = 'TRNER010'), '2024-11-05'),
((SELECT id FROM members WHERE member_code = 'MEM034'), '2024-11-03', 80.00, 176.00, 25.82, 19.0, 64.00, 100.00, 84.00, 94.00, 33.50, (SELECT id FROM trainers WHERE trainer_code = 'TRNER009'), '2024-11-03'),
((SELECT id FROM members WHERE member_code = 'MEM035'), '2024-11-01', 59.00, 163.00, 22.20, 28.0, 42.00, 81.00, 68.00, 88.00, 25.50, (SELECT id FROM trainers WHERE trainer_code = 'TRNER010'), '2024-11-01');

-- ============================================================================
-- DIET PLANS (15+ diet plans)
-- ============================================================================
INSERT INTO diet_plans (member_id, created_by, plan_name, start_date, end_date, daily_calorie_target, meal_plan, created_at) VALUES
((SELECT id FROM members WHERE member_code = 'MEM001'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), 'Weight Loss Plan - 2000 Cal', '2024-11-01', '2024-11-30', 2000, '{"breakfast": "Oats with almonds, egg whites", "lunch": "Grilled chicken breast with veggies", "snack": "Protein shake", "dinner": "Fish with brown rice"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM002'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER002'), 'Toning Diet - 1800 Cal', '2024-11-01', '2024-11-30', 1800, '{"breakfast": "Greek yogurt with berries", "lunch": "Turkey breast with quinoa", "snack": "Almonds & apple", "dinner": "Lean beef with vegetables"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM003'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), 'Muscle Building - 3500 Cal', '2024-11-02', '2024-12-02', 3500, '{"breakfast": "Pancakes with peanut butter & banana", "lunch": "Chicken with pasta", "snack": "Protein shake with oats", "dinner": "Beef steak with sweet potato"}'::jsonb, '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM004'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER002'), 'Weight Loss - 1700 Cal', '2024-11-05', '2024-12-05', 1700, '{"breakfast": "Egg white omelet with vegetables", "lunch": "Grilled fish with salad", "snack": "Cucumber & hummus", "dinner": "Chicken soup with vegetables"}'::jsonb, '2024-11-05'),
((SELECT id FROM members WHERE member_code = 'MEM005'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), 'Power Building - 3800 Cal', '2024-11-01', '2024-12-01', 3800, '{"breakfast": "Eggs with whole wheat bread & avocado", "lunch": "Chicken with rice & broccoli", "snack": "Peanut butter with banana", "dinner": "Salmon with potato"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM006'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER002'), 'Fat Loss - 1900 Cal', '2024-11-01', '2024-11-30', 1900, '{"breakfast": "Oatmeal with berries", "lunch": "Turkey breast with sweet potato", "snack": "Protein bar", "dinner": "Tilapia with green beans"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM007'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), 'Endurance Diet - 3200 Cal', '2024-11-02', '2024-12-02', 3200, '{"breakfast": "Granola with yogurt & honey", "lunch": "Grilled chicken with pasta", "snack": "Mix nuts & dried fruits", "dinner": "Lean meat with brown rice"}'::jsonb, '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM008'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER004'), 'Flexibility - 2100 Cal', '2024-11-01', '2024-11-30', 2100, '{"breakfast": "Smoothie bowl with granola", "lunch": "Vegetable stir fry with tofu", "snack": "Fruit salad", "dinner": "Baked fish with roasted vegetables"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM016'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER006'), 'Athletic Build - 3400 Cal', '2024-11-01', '2024-12-01', 3400, '{"breakfast": "Eggs with toast & almonds", "lunch": "Chicken with rice", "snack": "Protein shake", "dinner": "Beef with sweet potato & broccoli"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM017'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER007'), 'Weight Loss - 1750 Cal', '2024-11-01', '2024-11-30', 1750, '{"breakfast": "Egg whites with vegetables", "lunch": "Chicken salad", "snack": "Greek yogurt", "dinner": "Fish with steamed vegetables"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM019'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER007'), 'Toning - 1850 Cal', '2024-11-01', '2024-11-30', 1850, '{"breakfast": "Oats with protein powder & berries", "lunch": "Turkey with quinoa salad", "snack": "Almonds & banana", "dinner": "Salmon with vegetables"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM026'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER009'), 'Athletic - 3300 Cal', '2024-11-01', '2024-12-01', 3300, '{"breakfast": "Pancakes with jam & almonds", "lunch": "Chicken breast with pasta", "snack": "Protein bar & fruit", "dinner": "Beef with brown rice & vegetables"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM027'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER010'), 'Weight Loss - 1800 Cal', '2024-11-01', '2024-11-30', 1800, '{"breakfast": "Egg white omelet with toast", "lunch": "Grilled chicken with salad", "snack": "Fruit & almonds", "dinner": "Fish with green vegetables"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM029'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER010'), 'Cardio - 2200 Cal', '2024-11-10', '2024-12-10', 2200, '{"breakfast": "Oatmeal with banana & honey", "lunch": "Chicken with sweet potato", "snack": "Protein shake", "dinner": "Turkey with vegetables"}'::jsonb, '2024-11-10'),
((SELECT id FROM members WHERE member_code = 'MEM032'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER009'), 'Muscle - 3700 Cal', '2024-11-01', '2024-12-01', 3700, '{"breakfast": "Eggs with whole wheat bread & butter", "lunch": "Beef with rice & broccoli", "snack": "Peanut butter shake", "dinner": "Salmon with potato"}'::jsonb, '2024-11-01');

-- ============================================================================
-- WORKOUT PLANS (20+ workout plans)
-- ============================================================================
INSERT INTO workout_plans (member_id, created_by, plan_name, start_date, end_date, workout_schedule, created_at) VALUES
((SELECT id FROM members WHERE member_code = 'MEM001'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), 'Weight Loss Cardio - 8 Weeks', '2024-11-01', '2024-12-26', '{"monday": "Treadmill 45min moderate cardio", "tuesday": "Cycling 40min", "wednesday": "Rest", "thursday": "HIIT 30min", "friday": "Elliptical 40min", "saturday": "Swimming 45min", "sunday": "Yoga 30min"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM002'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER002'), 'Toning Full Body - 6 Weeks', '2024-11-01', '2024-12-12', '{"monday": "Chest & Triceps", "tuesday": "Cardio 30min", "wednesday": "Back & Biceps", "thursday": "Rest", "friday": "Legs & Core", "saturday": "Full Body Circuit", "sunday": "Yoga & Stretching"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM003'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), 'Strength Building - 12 Weeks', '2024-11-02', '2025-01-24', '{"monday": "Bench Press & Accessories 5x5", "tuesday": "Squats & Accessories 5x5", "wednesday": "Rest", "thursday": "Deadlift & Accessories 3x5", "friday": "Upper Body Strength", "saturday": "Lower Body Hypertrophy", "sunday": "Rest"}'::jsonb, '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM004'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER002'), 'Women Weight Loss - 8 Weeks', '2024-11-05', '2024-12-31', '{"monday": "Cardio Mix 40min", "tuesday": "Lower Body Toning", "wednesday": "Cardio 35min", "thursday": "Upper Body Toning", "friday": "HIIT 25min", "saturday": "Full Body Circuit", "sunday": "Yoga & Rest"}'::jsonb, '2024-11-05'),
((SELECT id FROM members WHERE member_code = 'MEM005'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), 'Power Lifting - 16 Weeks', '2024-11-01', '2025-02-28', '{"monday": "Squat Day - 3x3 heavy", "tuesday": "Bench Press - 3x3 heavy", "wednesday": "Deadlift - 3x1 heavy", "thursday": "Accessory Upper", "friday": "Accessory Lower", "saturday": "Conditioning", "sunday": "Rest"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM006'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER002'), 'Fat Loss Plan - 10 Weeks', '2024-11-01', '2025-01-09', '{"monday": "Treadmill HIIT 30min", "tuesday": "Total Body Strength", "wednesday": "Cycling 40min", "thursday": "Upper Body Circuit", "friday": "Elliptical 35min", "saturday": "Lower Body Circuit", "sunday": "Rest Day"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM007'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER001'), 'Endurance Training - 12 Weeks', '2024-11-02', '2025-01-24', '{"monday": "Long run 60min easy", "tuesday": "Strength training 45min", "wednesday": "Cycling 50min moderate", "thursday": "Tempo run 40min", "friday": "Strength & Core", "saturday": "Long cardio 60-90min", "sunday": "Rest & Recovery"}'::jsonb, '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM008'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER004'), 'Yoga & Flexibility - 8 Weeks', '2024-11-01', '2024-12-26', '{"monday": "Hatha Yoga 60min", "tuesday": "Pilates 50min", "wednesday": "Stretching & Breathing", "thursday": "Power Yoga 60min", "friday": "Yin Yoga 60min", "saturday": "Full Body Flexibility", "sunday": "Rest & Meditation"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM016'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER006'), 'Elite Athletic - 12 Weeks', '2024-11-01', '2025-01-24', '{"monday": "Explosive Strength", "tuesday": "Speed & Agility", "wednesday": "Power Conditioning", "thursday": "Sport Specific", "friday": "Strength & Speed", "saturday": "High Intensity", "sunday": "Recovery & Mobility"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM017'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER007'), 'Circuit Training - 8 Weeks', '2024-11-01', '2024-12-26', '{"monday": "Upper Body Circuit", "tuesday": "Cardio Circuit", "wednesday": "Lower Body Circuit", "thursday": "Full Body Circuit", "friday": "HIIT Circuit", "saturday": "Boxing Circuit", "sunday": "Rest"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM018'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER006'), 'Strength & Muscle - 14 Weeks', '2024-11-10', '2025-02-21', '{"monday": "Push Day Heavy", "tuesday": "Pull Day Heavy", "wednesday": "Rest", "thursday": "Leg Day Heavy", "friday": "Push Hypertrophy", "saturday": "Pull Hypertrophy", "sunday": "Leg Hypertrophy"}'::jsonb, '2024-11-10'),
((SELECT id FROM members WHERE member_code = 'MEM019'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER007'), 'Women Toning - 10 Weeks', '2024-11-01', '2025-01-09', '{"monday": "Cardio & Core 40min", "tuesday": "Glute & Leg Focus", "wednesday": "Cardio 30min", "thursday": "Upper Body Toning", "friday": "HIIT 25min", "saturday": "Full Body Workout", "sunday": "Yoga"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM020'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER006'), 'Maintenance Program', '2024-11-02', '2025-05-02', '{"monday": "Cardio 30min", "tuesday": "Strength 45min", "wednesday": "Rest", "thursday": "Cardio 30min", "friday": "Strength 45min", "saturday": "Sports or Active", "sunday": "Rest"}'::jsonb, '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM026'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER009'), 'Lean Muscle - 12 Weeks', '2024-11-01', '2025-01-24', '{"monday": "Upper Power", "tuesday": "Lower Power", "wednesday": "Active Recovery", "thursday": "Upper Hypertrophy", "friday": "Lower Hypertrophy", "saturday": "Full Body", "sunday": "Rest"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM027'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER010'), 'Cardio Intensive - 6 Weeks', '2024-11-01', '2024-12-12', '{"monday": "Treadmill 40min", "tuesday": "Strength 30min", "wednesday": "Cycling 45min", "thursday": "Strength 30min", "friday": "HIIT 25min", "saturday": "Long Cardio 60min", "sunday": "Rest"}'::jsonb, '2024-11-01'),
((SELECT id FROM members WHERE member_code = 'MEM028'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER009'), 'Advanced Strength - 16 Weeks', '2024-11-10', '2025-03-21', '{"monday": "Squat Strength", "tuesday": "Bench Strength", "wednesday": "Deadlift", "thursday": "Accessory Upper", "friday": "Accessory Lower", "saturday": "Conditioning", "sunday": "Rest"}'::jsonb, '2024-11-10'),
((SELECT id FROM members WHERE member_code = 'MEM031'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER010'), 'Complete Fitness - 12 Weeks', '2024-11-02', '2025-01-24', '{"monday": "Full Body Strength", "tuesday": "Cardio 40min", "wednesday": "Upper Body", "thursday": "Cardio 35min", "friday": "Lower Body", "saturday": "Full Body Circuit", "sunday": "Rest & Recovery"}'::jsonb, '2024-11-02'),
((SELECT id FROM members WHERE member_code = 'MEM034'), (SELECT id FROM trainers WHERE trainer_code = 'TRNER009'), 'Core & Strength - 10 Weeks', '2024-11-03', '2025-01-10', '{"monday": "Core Intensive 45min", "tuesday": "Full Body Strength", "wednesday": "Core & Cardio", "thursday": "Upper Strength", "friday": "Lower Strength", "saturday": "Total Body", "sunday": "Rest"}'::jsonb, '2024-11-03');

-- Summary
SELECT 'Gym & Fitness Center Demo Data Loaded Successfully!' AS status;
SELECT COUNT(*) AS total_gyms FROM gyms;
SELECT COUNT(*) AS total_membership_plans FROM membership_plans;
SELECT COUNT(*) AS total_members FROM members;
SELECT COUNT(*) AS total_trainers FROM trainers;
SELECT COUNT(*) AS total_memberships FROM memberships;
SELECT COUNT(*) AS total_attendance FROM attendance;
SELECT COUNT(*) AS total_body_measurements FROM body_measurements;
SELECT COUNT(*) AS total_diet_plans FROM diet_plans;
SELECT COUNT(*) AS total_workout_plans FROM workout_plans;
