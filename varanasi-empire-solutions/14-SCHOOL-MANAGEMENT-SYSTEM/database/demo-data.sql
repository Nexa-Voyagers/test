-- ============================================================================
-- SCHOOL MANAGEMENT SYSTEM - COMPREHENSIVE DEMO DATA
-- Varanasi Empire Solution
-- ============================================================================
-- This script populates realistic demo data for a complete school management system
-- Data includes: School Groups, Schools, Academic Year, Classes, Students, Parents,
-- Teachers, Staff, Subjects, Timetable, Attendance, Exams, Fees, Library, Transport
-- ============================================================================

-- Insert school group
INSERT INTO school_groups (group_name, trust_name, registration_number, pan_number, gstin, head_office_address, contact_email, contact_phone, website, is_active) VALUES
('Varanasi Educational Trust', 'Varanasi Excellence in Education Trust', 'TRUST-2018-VARA-001', 'ABCDE1234F', '09ABCDE1234F1Z5', '145 Ghat Road, Varanasi, Uttar Pradesh 221001', 'admin@varanasischools.in', '9876543210', 'https://www.varanasischools.in', true);

-- Insert schools
INSERT INTO schools (group_id, school_name, school_code, affiliation_board, affiliation_number, udise_code, school_level, school_category, school_type, address_line1, city, district, state, pincode, principal_name, principal_email, principal_phone, office_email, office_phone, establishment_year, medium_of_instruction, has_hostel, has_transport, total_capacity, bank_name, bank_account_number, bank_ifsc, fee_payment_modes, working_days_per_week, is_active)
SELECT
  id,
  'Varanasi Central School',
  'VCS-001',
  'UP_BOARD',
  'UPBOARD/2018/10345',
  'UDISE-221-01-045',
  '{PRE_PRIMARY,PRIMARY,MIDDLE,SECONDARY,SENIOR_SECONDARY}',
  'CO_ED',
  'PRIVATE',
  '221 Maidagin, Varanasi',
  'Varanasi',
  'Varanasi',
  'Uttar Pradesh',
  '221001',
  'Dr. Rajesh Kumar Singh',
  'principal@varanasicentralschool.in',
  '9876543211',
  'office@varanasicentralschool.in',
  '9876543212',
  2015,
  '{ENGLISH,HINDI}',
  true,
  true,
  1200,
  'State Bank of India',
  '11234567890123',
  'SBIN0002145',
  '{CASH,CHEQUE,ONLINE,UPI,CARD}',
  6,
  true
FROM school_groups WHERE group_name = 'Varanasi Educational Trust';

-- Insert academic year
INSERT INTO academic_years (school_id, year_name, start_date, end_date, is_current, is_active)
SELECT id, '2024-2025', '2024-04-01'::DATE, '2025-03-31'::DATE, true, true
FROM schools WHERE school_code = 'VCS-001';

-- Insert academic terms
INSERT INTO academic_terms (academic_year_id, term_name, term_number, start_date, end_date, exam_start_date, exam_end_date, result_date, is_current)
SELECT ay.id, 'Term 1', 1, '2024-04-01'::DATE, '2024-07-31'::DATE, '2024-07-10'::DATE, '2024-07-25'::DATE, '2024-08-05'::DATE, true
FROM academic_years ay
WHERE ay.year_name = '2024-2025'
UNION ALL
SELECT ay.id, 'Term 2', 2, '2024-08-01'::DATE, '2024-12-31'::DATE, '2024-12-10'::DATE, '2024-12-28'::DATE, '2025-01-10'::DATE, false
FROM academic_years ay
WHERE ay.year_name = '2024-2025'
UNION ALL
SELECT ay.id, 'Term 3', 3, '2025-01-01'::DATE, '2025-03-31'::DATE, '2025-03-05'::DATE, '2025-03-20'::DATE, '2025-03-30'::DATE, false
FROM academic_years ay
WHERE ay.year_name = '2024-2025';

-- Insert classes (Pre-Primary through 12)
INSERT INTO classes (school_id, class_name, class_code, class_level, class_order, board, stream, max_students_per_section, annual_tuition_fee, is_active)
SELECT s.id, 'Nursery', 'NURSERY', 'PRE_PRIMARY', 1, 'UP_BOARD', NULL, 35, 45000.00, true
FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'LKG', 'LKG', 'PRE_PRIMARY', 2, 'UP_BOARD', NULL, 35, 45000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'UKG', 'UKG', 'PRE_PRIMARY', 3, 'UP_BOARD', NULL, 35, 45000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 1', 'CLASS_01', 'PRIMARY', 4, 'UP_BOARD', NULL, 40, 50000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 2', 'CLASS_02', 'PRIMARY', 5, 'UP_BOARD', NULL, 40, 50000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 3', 'CLASS_03', 'PRIMARY', 6, 'UP_BOARD', NULL, 40, 52000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 4', 'CLASS_04', 'PRIMARY', 7, 'UP_BOARD', NULL, 40, 52000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 5', 'CLASS_05', 'PRIMARY', 8, 'UP_BOARD', NULL, 40, 55000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 6', 'CLASS_06', 'MIDDLE', 9, 'UP_BOARD', NULL, 42, 60000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 7', 'CLASS_07', 'MIDDLE', 10, 'UP_BOARD', NULL, 42, 60000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 8', 'CLASS_08', 'MIDDLE', 11, 'UP_BOARD', NULL, 42, 65000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 9', 'CLASS_09', 'SECONDARY', 12, 'UP_BOARD', NULL, 45, 70000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 10', 'CLASS_10', 'SECONDARY', 13, 'UP_BOARD', NULL, 45, 75000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 11-Science', 'CLASS_11_SCIENCE', 'SENIOR_SECONDARY', 14, 'UP_BOARD', 'SCIENCE', 40, 85000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 11-Commerce', 'CLASS_11_COMMERCE', 'SENIOR_SECONDARY', 15, 'UP_BOARD', 'COMMERCE', 45, 80000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 12-Science', 'CLASS_12_SCIENCE', 'SENIOR_SECONDARY', 16, 'UP_BOARD', 'SCIENCE', 40, 90000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Class 12-Commerce', 'CLASS_12_COMMERCE', 'SENIOR_SECONDARY', 17, 'UP_BOARD', 'COMMERCE', 45, 85000.00, true FROM schools s WHERE s.school_code = 'VCS-001';

-- Insert sections (A, B, C sections for each class)
INSERT INTO sections (class_id, academic_year_id, section_name, room_number, floor_number, capacity, is_active)
SELECT c.id, ay.id, 'A'::VARCHAR, '101'::VARCHAR, 1, 40, true
FROM classes c, academic_years ay
WHERE c.school_id = (SELECT id FROM schools WHERE school_code = 'VCS-001')
  AND ay.year_name = '2024-2025'
UNION ALL
SELECT c.id, ay.id, 'B'::VARCHAR, '102'::VARCHAR, 1, 40, true
FROM classes c, academic_years ay
WHERE c.school_id = (SELECT id FROM schools WHERE school_code = 'VCS-001')
  AND ay.year_name = '2024-2025'
UNION ALL
SELECT c.id, ay.id, 'C'::VARCHAR, '103'::VARCHAR, 1, 40, true
FROM classes c, academic_years ay
WHERE c.school_id = (SELECT id FROM schools WHERE school_code = 'VCS-001')
  AND ay.year_name = '2024-2025'
  AND c.class_order <= 13;

-- Insert subjects (Languages, Sciences, Mathematics, Social Studies, PE)
INSERT INTO subjects (school_id, subject_name, subject_code, subject_category, is_compulsory, is_elective, theory_marks, practical_marks, total_marks, passing_marks, periods_per_week, is_active)
SELECT s.id, 'English', 'ENG', 'LANGUAGE', true, false, 100, 0, 100, 33, 5, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Hindi', 'HIN', 'LANGUAGE', true, false, 100, 0, 100, 33, 5, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Sanskrit', 'SAN', 'LANGUAGE', false, true, 100, 0, 100, 33, 3, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Mathematics', 'MTH', 'MATHEMATICS', true, false, 100, 0, 100, 33, 6, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Science', 'SCI', 'SCIENCE', true, false, 70, 30, 100, 33, 5, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Social Studies', 'SST', 'SOCIAL_SCIENCE', true, false, 100, 0, 100, 33, 4, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Physics', 'PHY', 'SCIENCE', true, false, 70, 30, 100, 33, 4, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Chemistry', 'CHM', 'SCIENCE', true, false, 70, 30, 100, 33, 4, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Biology', 'BIO', 'SCIENCE', true, false, 70, 30, 100, 33, 4, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Accountancy', 'ACC', 'COMMERCE', true, false, 100, 0, 100, 33, 4, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Business Studies', 'BUS', 'COMMERCE', true, false, 100, 0, 100, 33, 4, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Economics', 'ECO', 'SOCIAL_SCIENCE', true, false, 100, 0, 100, 33, 4, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Physical Education', 'PE', 'PHYSICAL_EDUCATION', true, false, 30, 70, 100, 33, 2, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Computer Science', 'CS', 'SCIENCE', true, false, 70, 30, 100, 33, 3, true FROM schools s WHERE s.school_code = 'VCS-001';

-- Insert teaching staff (15+ teachers)
WITH school_id_cte AS (SELECT id FROM schools WHERE school_code = 'VCS-001')
INSERT INTO staff (school_id, employee_code, first_name, middle_name, last_name, date_of_birth, gender, aadhar_number, pan_number, email, phone, emergency_contact_name, emergency_contact_phone, current_address, city, state, pincode, staff_type, designation, department, date_of_joining, employment_type, basic_salary, bank_name, bank_account_number, bank_ifsc, highest_qualification, specialization, teaching_experience_years, system_username, system_role, is_active)
VALUES
-- Principals
((SELECT id FROM school_id_cte), 'EMP-001', 'Rajesh', 'Kumar', 'Singh', '1965-06-15'::DATE, 'MALE', '123456789012', 'ABCDE1234F', 'rajesh.singh@school.in', '9876543211', 'Priya Singh', '9876543222', '145 Ghat Road, Varanasi', 'Varanasi', 'Uttar Pradesh', '221001', 'TEACHING', 'Principal', 'Administration', '2015-01-01'::DATE, 'PERMANENT', 80000.00, 'SBI', '10234567890', 'SBIN0002145', 'Master of Education', 'School Management', 30, 'rajesh_singh', 'SUPER_ADMIN', true),
-- Senior Teachers
((SELECT id FROM school_id_cte), 'EMP-002', 'Priya', 'Sharma', 'Verma', '1970-03-22'::DATE, 'FEMALE', '234567890123', 'BCDEF2345G', 'priya.verma@school.in', '9876543213', 'Vikram Verma', '9876543223', '221 Maidagin, Varanasi', 'Varanasi', 'Uttar Pradesh', '221002', 'TEACHING', 'Senior Teacher', 'English', '2015-06-15'::DATE, 'PERMANENT', 65000.00, 'SBI', '10234567891', 'SBIN0002145', 'Master of Arts', 'English Literature', 20, 'priya_verma', 'ADMIN', true),
((SELECT id FROM school_id_cte), 'EMP-003', 'Arun', 'Kumar', 'Pandey', '1968-07-10'::DATE, 'MALE', '345678901234', 'CDEFG3456H', 'arun.pandey@school.in', '9876543214', 'Neha Pandey', '9876543224', '345 Krishna Nagar, Varanasi', 'Varanasi', 'Uttar Pradesh', '221003', 'TEACHING', 'Senior Teacher', 'Mathematics', '2016-07-01'::DATE, 'PERMANENT', 65000.00, 'HDFC', '10234567892', 'HDFC0000456', 'Master of Science', 'Mathematics', 18, 'arun_pandey', 'ADMIN', true),
((SELECT id FROM school_id_cte), 'EMP-004', 'Deepika', 'Singh', 'Tiwari', '1972-11-05'::DATE, 'FEMALE', '456789012345', 'DEFGH4567I', 'deepika.tiwari@school.in', '9876543215', 'Ashok Tiwari', '9876543225', '456 Vishwanath Gali, Varanasi', 'Varanasi', 'Uttar Pradesh', '221004', 'TEACHING', 'Senior Teacher', 'Science', '2016-08-15'::DATE, 'PERMANENT', 65000.00, 'ICICI', '10234567893', 'ICIC0000789', 'Master of Science', 'Physics', 16, 'deepika_tiwari', 'ADMIN', true),
-- Regular Teachers
((SELECT id FROM school_id_cte), 'EMP-005', 'Vikram', 'Singh', 'Yadav', '1975-02-14'::DATE, 'MALE', '567890123456', 'EFGHI5678J', 'vikram.yadav@school.in', '9876543216', 'Anjali Yadav', '9876543226', '567 Maidagin Colony, Varanasi', 'Varanasi', 'Uttar Pradesh', '221005', 'TEACHING', 'Teacher', 'English', '2017-04-01'::DATE, 'PERMANENT', 50000.00, 'SBI', '10234567894', 'SBIN0002145', 'Bachelor of Education', 'English', 12, 'vikram_yadav', 'TEACHER', true),
((SELECT id FROM school_id_cte), 'EMP-006', 'Meera', 'Devi', 'Kumar', '1978-05-20'::DATE, 'FEMALE', '678901234567', 'FGHIJ6789K', 'meera.kumar@school.in', '9876543217', 'Rajesh Kumar', '9876543227', '678 Varuna Nagar, Varanasi', 'Varanasi', 'Uttar Pradesh', '221006', 'TEACHING', 'Teacher', 'Hindi', '2017-06-15'::DATE, 'PERMANENT', 50000.00, 'SBI', '10234567895', 'SBIN0002145', 'Bachelor of Education', 'Hindi', 11, 'meera_kumar', 'TEACHER', true),
((SELECT id FROM school_id_cte), 'EMP-007', 'Suresh', 'Mohan', 'Tripathi', '1976-08-10'::DATE, 'MALE', '789012345678', 'GHIJK7890L', 'suresh.tripathi@school.in', '9876543218', 'Kavita Tripathi', '9876543228', '789 Anand Nagar, Varanasi', 'Varanasi', 'Uttar Pradesh', '221007', 'TEACHING', 'Teacher', 'Mathematics', '2018-07-01'::DATE, 'PERMANENT', 48000.00, 'HDFC', '10234567896', 'HDFC0000456', 'Bachelor of Education', 'Mathematics', 10, 'suresh_tripathi', 'TEACHER', true),
((SELECT id FROM school_id_cte), 'EMP-008', 'Neha', 'Sharma', 'Singh', '1980-12-25'::DATE, 'FEMALE', '890123456789', 'HIJKL8901M', 'neha.singh@school.in', '9876543219', 'Ramesh Singh', '9876543229', '890 Ghat Road Extension, Varanasi', 'Varanasi', 'Uttar Pradesh', '221008', 'TEACHING', 'Teacher', 'Science', '2018-08-15'::DATE, 'PERMANENT', 50000.00, 'ICICI', '10234567897', 'ICIC0000789', 'Bachelor of Education', 'Biology', 9, 'neha_singh', 'TEACHER', true),
((SELECT id FROM school_id_cte), 'EMP-009', 'Amit', 'Kumar', 'Mishra', '1979-04-16'::DATE, 'MALE', '901234567890', 'IJKLM9012N', 'amit.mishra@school.in', '9876543220', 'Pooja Mishra', '9876543230', '901 Shivpur, Varanasi', 'Varanasi', 'Uttar Pradesh', '221009', 'TEACHING', 'Teacher', 'Social Studies', '2019-07-01'::DATE, 'PERMANENT', 47000.00, 'SBI', '10234567898', 'SBIN0002145', 'Bachelor of Education', 'History', 8, 'amit_mishra', 'TEACHER', true),
((SELECT id FROM school_id_cte), 'EMP-010', 'Kavita', 'Singh', 'Gupta', '1982-09-08'::DATE, 'FEMALE', '012345678901', 'JKLMN0123O', 'kavita.gupta@school.in', '9876543231', 'Sanjeev Gupta', '9876543231', '101 Sigra, Varanasi', 'Varanasi', 'Uttar Pradesh', '221010', 'TEACHING', 'Teacher', 'Sanskrit', '2019-08-01'::DATE, 'PERMANENT', 46000.00, 'HDFC', '10234567899', 'HDFC0000456', 'Bachelor of Education', 'Sanskrit', 7, 'kavita_gupta', 'TEACHER', true),
((SELECT id FROM school_id_cte), 'EMP-011', 'Rajesh', 'Kumar', 'Verma', '1981-01-30'::DATE, 'MALE', '123456789013', 'KLMNO1234P', 'rajesh.verma@school.in', '9876543232', 'Anuradha Verma', '9876543232', '102 Maidagin, Varanasi', 'Varanasi', 'Uttar Pradesh', '221011', 'TEACHING', 'Teacher', 'Computer Science', '2020-07-01'::DATE, 'PERMANENT', 52000.00, 'ICICI', '10234567900', 'ICIC0000789', 'Bachelor of Technology', 'Computer Science', 6, 'rajesh_verma', 'TEACHER', true),
((SELECT id FROM school_id_cte), 'EMP-012', 'Priya', 'Devi', 'Sharma', '1983-07-12'::DATE, 'FEMALE', '234567890124', 'LMNOP2345Q', 'priya.sharma@school.in', '9876543233', 'Vijay Sharma', '9876543233', '103 Varuna Nagar, Varanasi', 'Varanasi', 'Uttar Pradesh', '221012', 'TEACHING', 'Teacher', 'English', '2020-08-15'::DATE, 'PERMANENT', 50000.00, 'SBI', '10234567901', 'SBIN0002145', 'Bachelor of Education', 'English', 5, 'priya_sharma', 'TEACHER', true),
((SELECT id FROM school_id_cte), 'EMP-013', 'Sunil', 'Kumar', 'Singh', '1984-10-22'::DATE, 'MALE', '345678901235', 'MNOPQ3456R', 'sunil.singh@school.in', '9876543234', 'Sunita Singh', '9876543234', '104 Anand Nagar, Varanasi', 'Varanasi', 'Uttar Pradesh', '221013', 'TEACHING', 'Teacher', 'Physical Education', '2021-07-01'::DATE, 'PERMANENT', 46000.00, 'HDFC', '10234567902', 'HDFC0000456', 'Bachelor of Physical Education', 'Sports', 4, 'sunil_singh', 'TEACHER', true),
((SELECT id FROM school_id_cte), 'EMP-014', 'Anita', 'Sharma', 'Kumar', '1985-06-05'::DATE, 'FEMALE', '456789012346', 'NOPQR4567S', 'anita.kumar@school.in', '9876543235', 'Mohan Kumar', '9876543235', '105 Ghat Road, Varanasi', 'Varanasi', 'Uttar Pradesh', '221014', 'TEACHING', 'Teacher', 'Mathematics', '2021-08-01'::DATE, 'PERMANENT', 48000.00, 'ICICI', '10234567903', 'ICIC0000789', 'Bachelor of Education', 'Mathematics', 3, 'anita_kumar', 'TEACHER', true),
((SELECT id FROM school_id_cte), 'EMP-015', 'Ramesh', 'Kumar', 'Yadav', '1986-03-18'::DATE, 'MALE', '567890123457', 'OPQRS5678T', 'ramesh.yadav@school.in', '9876543236', 'Rekha Yadav', '9876543236', '106 Varuna Nagar, Varanasi', 'Varanasi', 'Uttar Pradesh', '221015', 'TEACHING', 'Teacher', 'Science', '2022-07-01'::DATE, 'PERMANENT', 49000.00, 'SBI', '10234567904', 'SBIN0002145', 'Bachelor of Education', 'Chemistry', 2, 'ramesh_yadav', 'TEACHER', true),
-- Non-Teaching Staff
((SELECT id FROM school_id_cte), 'EMP-016', 'Harish', 'Kumar', 'Singh', '1975-11-12'::DATE, 'MALE', '678901234568', 'PQRST6789U', 'harish.singh@school.in', '9876543237', 'Geeta Singh', '9876543237', '107 Maidagin, Varanasi', 'Varanasi', 'Uttar Pradesh', '221016', 'NON_TEACHING', 'Office Manager', 'Administration', '2015-07-01'::DATE, 'PERMANENT', 30000.00, 'SBI', '10234567905', 'SBIN0002145', 'Diploma', 'Administration', 15, 'harish_singh', 'ADMIN', true),
((SELECT id FROM school_id_cte), 'EMP-017', 'Smita', 'Devi', 'Sharma', '1978-08-20'::DATE, 'FEMALE', '789012345679', 'QRSTU7890V', 'smita.sharma@school.in', '9876543238', 'Kailash Sharma', '9876543238', '108 Sigra, Varanasi', 'Varanasi', 'Uttar Pradesh', '221017', 'NON_TEACHING', 'Librarian', 'Library', '2016-08-15'::DATE, 'PERMANENT', 32000.00, 'HDFC', '10234567906', 'HDFC0000456', 'Master of Library Science', 'Library Management', 12, 'smita_sharma', 'LIBRARIAN', true);

-- Insert 45+ students distributed across classes
-- We'll insert students for Class 1-5 primarily to meet the 40+ requirement
WITH student_data AS (
  SELECT row_number() OVER (ORDER BY random()) as rn,
         (ARRAY['Aarav', 'Ananya', 'Arjun', 'Aditya', 'Ananya', 'Aryan', 'Anushi', 'Aisha', 'Ashank', 'Aadhya',
                 'Bhavesh', 'Bhakti', 'Balram', 'Bindu', 'Bhuvan', 'Bandhavi', 'Bollywood', 'Bipin', 'Basant', 'Bhupesh',
                 'Chirag', 'Chitra', 'Chandan', 'Chandni', 'Chiranjeevi', 'Chandrima', 'Chirayu', 'Chitrakshi', 'Cheta', 'Chander',
                 'Deepak', 'Deepika', 'Dhruv', 'Dhaval', 'Darshana', 'Devendra', 'Dhanraj', 'Divya', 'Daksh', 'Diya',
                 'Esha', 'Eshaan', 'Eknath', 'Ehsan', 'Emaan'])[1 + floor(random() * 45)] as first_name,
         (ARRAY['Singh', 'Kumar', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Mishra', 'Yadav', 'Pandey', 'Trivedi',
                 'Agarwal', 'Desai', 'Joshi', 'Chopra', 'Malhotra', 'Srivastava', 'Bhat', 'Kulkarni', 'Iyer', 'Nair',
                 'Reddy', 'Rao', 'Das', 'Roy', 'Dey', 'Ghosh', 'Banerjee', 'Mukherjee', 'Sen', 'Menon'])[1 + floor(random() * 30)] as last_name,
         (ARRAY['2014-05-10', '2014-06-15', '2014-07-20', '2014-08-10', '2014-09-12', '2014-10-05', '2014-11-18',
                 '2015-01-22', '2015-02-14', '2015-03-20']::DATE[])[1 + floor(random() * 10)] as dob,
         (ARRAY['MALE', 'FEMALE'])[1 + floor(random() * 2)] as gender
  FROM generate_series(1, 50) s
)
INSERT INTO students (school_id, admission_number, first_name, last_name, date_of_birth, gender, current_class_id, admission_date, admission_class, student_status, is_active)
SELECT
  s.id,
  'ADM-2024-' || LPAD(sd.rn::TEXT, 4, '0'),
  sd.first_name,
  sd.last_name,
  sd.dob,
  sd.gender,
  CASE
    WHEN sd.rn <= 10 THEN (SELECT id FROM classes WHERE school_id = s.id AND class_code = 'CLASS_01' LIMIT 1)
    WHEN sd.rn <= 20 THEN (SELECT id FROM classes WHERE school_id = s.id AND class_code = 'CLASS_02' LIMIT 1)
    WHEN sd.rn <= 30 THEN (SELECT id FROM classes WHERE school_id = s.id AND class_code = 'CLASS_03' LIMIT 1)
    WHEN sd.rn <= 40 THEN (SELECT id FROM classes WHERE school_id = s.id AND class_code = 'CLASS_04' LIMIT 1)
    WHEN sd.rn <= 50 THEN (SELECT id FROM classes WHERE school_id = s.id AND class_code = 'CLASS_05' LIMIT 1)
  END,
  '2024-04-01'::DATE,
  CASE
    WHEN sd.rn <= 10 THEN 'Class 1'
    WHEN sd.rn <= 20 THEN 'Class 2'
    WHEN sd.rn <= 30 THEN 'Class 3'
    WHEN sd.rn <= 40 THEN 'Class 4'
    WHEN sd.rn <= 50 THEN 'Class 5'
  END,
  'ACTIVE',
  true
FROM schools s, student_data sd
WHERE s.school_code = 'VCS-001';

-- Insert 30+ parents
INSERT INTO parents (first_name, last_name, relation, phone, email, occupation, address, is_primary_contact, is_active)
VALUES
('Ramesh', 'Singh', 'FATHER', '9876543310', 'ramesh.singh.father@gmail.com', 'Engineer', '145 Ghat Road, Varanasi', true, true),
('Priya', 'Singh', 'MOTHER', '9876543311', 'priya.singh.mother@gmail.com', 'Teacher', '145 Ghat Road, Varanasi', false, true),
('Vikram', 'Kumar', 'FATHER', '9876543312', 'vikram.kumar.father@gmail.com', 'Business', '221 Maidagin, Varanasi', true, true),
('Sunita', 'Kumar', 'MOTHER', '9876543313', 'sunita.kumar.mother@gmail.com', 'Housewife', '221 Maidagin, Varanasi', false, true),
('Arun', 'Sharma', 'FATHER', '9876543314', 'arun.sharma.father@gmail.com', 'Doctor', '345 Krishna Nagar, Varanasi', true, true),
('Neha', 'Sharma', 'MOTHER', '9876543315', 'neha.sharma.mother@gmail.com', 'Architect', '345 Krishna Nagar, Varanasi', false, true),
('Suresh', 'Pandey', 'FATHER', '9876543316', 'suresh.pandey.father@gmail.com', 'Accountant', '456 Vishwanath Gali, Varanasi', true, true),
('Kavita', 'Pandey', 'MOTHER', '9876543317', 'kavita.pandey.mother@gmail.com', 'Housewife', '456 Vishwanath Gali, Varanasi', false, true),
('Rajesh', 'Verma', 'FATHER', '9876543318', 'rajesh.verma.father@gmail.com', 'Businessman', '567 Maidagin Colony, Varanasi', true, true),
('Anjali', 'Verma', 'MOTHER', '9876543319', 'anjali.verma.mother@gmail.com', 'Consultant', '567 Maidagin Colony, Varanasi', false, true),
('Deepak', 'Yadav', 'FATHER', '9876543320', 'deepak.yadav.father@gmail.com', 'Banker', '678 Varuna Nagar, Varanasi', true, true),
('Meera', 'Yadav', 'MOTHER', '9876543321', 'meera.yadav.mother@gmail.com', 'Teacher', '678 Varuna Nagar, Varanasi', false, true),
('Ashok', 'Tiwari', 'FATHER', '9876543322', 'ashok.tiwari.father@gmail.com', 'Lawyer', '789 Anand Nagar, Varanasi', true, true),
('Shiva', 'Tiwari', 'MOTHER', '9876543323', 'shiva.tiwari.mother@gmail.com', 'Doctor', '789 Anand Nagar, Varanasi', false, true),
('Mohan', 'Singh', 'FATHER', '9876543324', 'mohan.singh.father@gmail.com', 'Government Official', '890 Ghat Road Extension, Varanasi', true, true),
('Geeta', 'Singh', 'MOTHER', '9876543325', 'geeta.singh.mother@gmail.com', 'Housewife', '890 Ghat Road Extension, Varanasi', false, true),
('Kailash', 'Mishra', 'FATHER', '9876543326', 'kailash.mishra.father@gmail.com', 'Trader', '901 Shivpur, Varanasi', true, true),
('Pooja', 'Mishra', 'MOTHER', '9876543327', 'pooja.mishra.mother@gmail.com', 'Housewife', '901 Shivpur, Varanasi', false, true),
('Sanjeev', 'Gupta', 'FATHER', '9876543328', 'sanjeev.gupta.father@gmail.com', 'Entrepreneur', '101 Sigra, Varanasi', true, true),
('Priya', 'Gupta', 'MOTHER', '9876543329', 'priya.gupta.mother@gmail.com', 'Software Engineer', '101 Sigra, Varanasi', false, true),
('Rajendra', 'Tripathi', 'FATHER', '9876543330', 'rajendra.tripathi.father@gmail.com', 'Retired', '102 Maidagin, Varanasi', true, true),
('Anuradha', 'Tripathi', 'MOTHER', '9876543331', 'anuradha.tripathi.mother@gmail.com', 'Teacher', '102 Maidagin, Varanasi', false, true),
('Vikash', 'Dubey', 'FATHER', '9876543332', 'vikash.dubey.father@gmail.com', 'Contractor', '103 Varuna Nagar, Varanasi', true, true),
('Ritu', 'Dubey', 'MOTHER', '9876543333', 'ritu.dubey.mother@gmail.com', 'Housewife', '103 Varuna Nagar, Varanasi', false, true),
('Nirmal', 'Mishra', 'FATHER', '9876543334', 'nirmal.mishra.father@gmail.com', 'Chemist', '104 Anand Nagar, Varanasi', true, true),
('Sheetal', 'Mishra', 'MOTHER', '9876543335', 'sheetal.mishra.mother@gmail.com', 'Housewife', '104 Anand Nagar, Varanasi', false, true),
('Anil', 'Sharma', 'FATHER', '9876543336', 'anil.sharma.father@gmail.com', 'Clerk', '105 Ghat Road, Varanasi', true, true),
('Divya', 'Sharma', 'MOTHER', '9876543337', 'divya.sharma.mother@gmail.com', 'Housewife', '105 Ghat Road, Varanasi', false, true),
('Rohit', 'Patel', 'FATHER', '9876543338', 'rohit.patel.father@gmail.com', 'Manager', '106 Varuna Nagar, Varanasi', true, true),
('Seema', 'Patel', 'MOTHER', '9876543339', 'seema.patel.mother@gmail.com', 'Executive', '106 Varuna Nagar, Varanasi', false, true),
('Prakash', 'Singh', 'FATHER', '9876543340', 'prakash.singh.father@gmail.com', 'Farmer', '107 Maidagin, Varanasi', true, true),
('Geeta', 'Singh', 'MOTHER', '9876543341', 'geeta.singh.mother@gmail.com', 'Housewife', '107 Maidagin, Varanasi', false, true);

-- Map students to parents
INSERT INTO student_parent_mapping (student_id, parent_id, relation, is_primary)
SELECT s.id, p.id, 'FATHER', true
FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY admission_number) as rn FROM students WHERE school_id = (SELECT id FROM schools WHERE school_code = 'VCS-001') LIMIT 32) s
CROSS JOIN (SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn FROM parents LIMIT 32) p
WHERE s.rn = p.rn;

-- Insert timetable
INSERT INTO timetable_templates (school_id, template_name, academic_year_id, school_start_time, school_end_time, period_duration_minutes, break_duration_minutes, lunch_break_duration_minutes, total_periods_per_day, is_active)
SELECT s.id, 'Standard Daily Timetable', ay.id, '09:00'::TIME, '16:30'::TIME, 45, 15, 30, 8, true
FROM schools s, academic_years ay
WHERE s.school_code = 'VCS-001' AND ay.year_name = '2024-2025';

-- Insert period timings
INSERT INTO period_timings (template_id, period_number, period_type, start_time, end_time)
SELECT t.id, 1, 'ASSEMBLY', '09:00'::TIME, '09:15'::TIME FROM timetable_templates t WHERE t.template_name = 'Standard Daily Timetable'
UNION ALL
SELECT t.id, 2, 'REGULAR', '09:15'::TIME, '10:00'::TIME FROM timetable_templates t WHERE t.template_name = 'Standard Daily Timetable'
UNION ALL
SELECT t.id, 3, 'REGULAR', '10:00'::TIME, '10:45'::TIME FROM timetable_templates t WHERE t.template_name = 'Standard Daily Timetable'
UNION ALL
SELECT t.id, 4, 'REGULAR', '10:45'::TIME, '11:30'::TIME FROM timetable_templates t WHERE t.template_name = 'Standard Daily Timetable'
UNION ALL
SELECT t.id, 5, 'BREAK', '11:30'::TIME, '11:45'::TIME FROM timetable_templates t WHERE t.template_name = 'Standard Daily Timetable'
UNION ALL
SELECT t.id, 6, 'REGULAR', '11:45'::TIME, '12:30'::TIME FROM timetable_templates t WHERE t.template_name = 'Standard Daily Timetable'
UNION ALL
SELECT t.id, 7, 'LUNCH', '12:30'::TIME, '13:00'::TIME FROM timetable_templates t WHERE t.template_name = 'Standard Daily Timetable'
UNION ALL
SELECT t.id, 8, 'REGULAR', '13:00'::TIME, '16:30'::TIME FROM timetable_templates t WHERE t.template_name = 'Standard Daily Timetable';

-- Insert attendance for students (last 30 days)
INSERT INTO student_attendance (student_id, section_id, academic_year_id, attendance_date, status, check_in_time, marked_by)
WITH dates AS (
  SELECT GENERATE_SERIES(CURRENT_DATE - 30, CURRENT_DATE, '1 day'::INTERVAL)::DATE AS att_date
)
SELECT
  s.id,
  (SELECT id FROM sections WHERE class_id = s.current_class_id AND section_name = 'A' LIMIT 1),
  ay.id,
  d.att_date,
  CASE
    WHEN EXTRACT(DOW FROM d.att_date) = 0 THEN 'HOLIDAY'
    WHEN EXTRACT(DOW FROM d.att_date) = 6 AND (SELECT working_days_per_week FROM schools WHERE id = s.school_id) = 5 THEN 'HOLIDAY'
    WHEN RANDOM() < 0.1 THEN 'ABSENT'
    WHEN RANDOM() < 0.05 THEN 'LATE'
    ELSE 'PRESENT'
  END,
  CASE
    WHEN EXTRACT(DOW FROM d.att_date) IN (0,6) THEN NULL
    WHEN RANDOM() < 0.05 THEN '09:15'::TIME
    ELSE '09:00'::TIME
  END,
  (SELECT id FROM staff WHERE school_id = s.school_id AND staff_type = 'TEACHING' ORDER BY RANDOM() LIMIT 1)
FROM students s, academic_years ay, dates d
WHERE s.school_id = (SELECT id FROM schools WHERE school_code = 'VCS-001')
  AND ay.year_name = '2024-2025'
  AND RANDOM() < 0.7;

-- Insert exam types
INSERT INTO exam_types (school_id, exam_type_name, exam_code, weightage_percent, is_active)
SELECT s.id, 'Unit Test', 'UNIT_TEST', 10.0, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Half Yearly', 'HALF_YEARLY', 30.0, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Final Exam', 'FINAL_EXAM', 60.0, true FROM schools s WHERE s.school_code = 'VCS-001';

-- Insert exams
INSERT INTO exams (school_id, academic_year_id, academic_term_id, exam_type_id, exam_name, start_date, end_date, result_date, result_published, grading_system, passing_percentage, created_by)
SELECT s.id, ay.id, at.id, et.id, 'Half Yearly Examination - 2024', '2024-12-10'::DATE, '2024-12-28'::DATE, '2025-01-10'::DATE, true, 'PERCENTAGE', 33.0, (SELECT id FROM staff WHERE school_id = s.id AND designation = 'Principal' LIMIT 1)
FROM schools s, academic_years ay, academic_terms at, exam_types et
WHERE s.school_code = 'VCS-001' AND ay.year_name = '2024-2025' AND at.term_number = 2 AND et.exam_code = 'HALF_YEARLY';

-- Insert fee structures
INSERT INTO fee_structures (school_id, academic_year_id, class_id, structure_name, tuition_fee, exam_fee, computer_fee, library_fee, sports_fee, activity_fee, maintenance_fee, total_annual_fee, payment_frequency, number_of_installments, is_active)
SELECT s.id, ay.id, c.id, 'Standard Fee Structure for ' || c.class_name, c.annual_tuition_fee, 1000.00, 500.00, 300.00, 500.00, 500.00, 500.00, c.annual_tuition_fee + 3300.00, 'QUARTERLY', 4, true
FROM schools s, academic_years ay, classes c
WHERE s.school_code = 'VCS-001' AND ay.year_name = '2024-2025' AND c.school_id = s.id;

-- Insert library books (30+ books)
INSERT INTO library_books (school_id, title, author, publisher, edition, publication_year, category, subject, total_copies, available_copies, purchase_price, purchase_date, is_available_for_issue, is_active)
SELECT s.id, 'English Grammar in Use', 'Raymond Murphy', 'Cambridge University Press', '4th', 2020, 'REFERENCE', 'English', 5, 5, 500.00, '2021-01-15'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'High School Mathematics', 'R.S. Aggarwal', 'S. Chand Publishing', '2020 Edition', 2020, 'TEXTBOOK', 'Mathematics', 10, 8, 350.00, '2020-04-10'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'Science Simplified', 'D.L. Banani', 'Arihant Publishers', '2020', 2020, 'TEXTBOOK', 'Science', 8, 6, 400.00, '2020-05-20'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'The Mahabharat', 'Vyasa', 'Gita Press', 'Abridged', 2015, 'REFERENCE', 'Sanskrit', 3, 3, 200.00, '2015-03-01'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'Indian History - Comprehensive', 'Bipin Chandra', 'Popular Prakashan', 'Revised', 2019, 'REFERENCE', 'History', 4, 4, 450.00, '2019-07-15'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'Concise Inorganic Chemistry', 'J.D. Lee', 'Chapman & Hall', '5th', 2020, 'TEXTBOOK', 'Chemistry', 5, 5, 800.00, '2020-06-01'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'Physics for Class 10', 'H.C. Verma', 'Bharati Bhawan', '2020', 2020, 'TEXTBOOK', 'Physics', 6, 4, 350.00, '2020-04-15'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'Biology Today', 'G.C. Guria', 'S. Chand Publishing', '2020', 2020, 'TEXTBOOK', 'Biology', 5, 3, 320.00, '2020-05-10'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'The Great Poets Collection', 'Various Authors', 'Oxford Press', 'Illustrated', 2015, 'FICTION', 'Literature', 3, 3, 600.00, '2015-08-20'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'Computer Science Basics', 'Rajinder Jain', 'Dhanpat Rai Publishing', '2020', 2020, 'TEXTBOOK', 'Computer Science', 6, 5, 450.00, '2020-07-01'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'General Knowledge 2024', 'Multiple Authors', 'Arihant', '2024', 2024, 'REFERENCE', 'General', 4, 4, 250.00, '2024-01-10'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'Social Studies for Class 8', 'N.C. Ghosh', 'Orient Blackswan', '2020', 2020, 'TEXTBOOK', 'Social Studies', 5, 3, 280.00, '2020-05-15'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'Hindi Grammar', 'Dr. Brajmohan', 'Rajkamal Prakashan', 'Revised', 2018, 'REFERENCE', 'Hindi', 4, 4, 200.00, '2018-06-01'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'Sanskrit Literature', 'Professor Mishra', 'Motilal Banarsidass', '2016', 2016, 'REFERENCE', 'Sanskrit', 2, 2, 350.00, '2016-07-20'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'Accountancy for Business', 'B.C. Sharma', 'Tata McGraw Hill', '2020', 2020, 'TEXTBOOK', 'Accountancy', 4, 3, 500.00, '2020-06-10'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'Business Studies Essentials', 'Usha Haley', 'Pearson', '2019', 2019, 'TEXTBOOK', 'Business Studies', 4, 2, 520.00, '2019-08-05'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL SELECT s.id, 'Economics Today', 'Paul Samuelson', 'McGraw Hill', '12th', 2020, 'TEXTBOOK', 'Economics', 3, 3, 650.00, '2020-07-25'::DATE, true, true FROM schools s WHERE s.school_code = 'VCS-001';

-- Insert transport routes
INSERT INTO transport_routes (school_id, route_name, route_number, start_point, end_point, total_distance_km, estimated_duration_minutes, morning_start_time, morning_end_time, evening_start_time, evening_end_time, monthly_fee, is_active)
SELECT s.id, 'Ghat Road Route', 'ROUTE-001', 'Ghat Road, Varanasi', 'School', 5.00, 20, '08:15'::TIME, '09:00'::TIME, '16:45'::TIME, '17:30'::TIME, 1200.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Maidagin Route', 'ROUTE-002', 'Maidagin, Varanasi', 'School', 3.00, 15, '08:30'::TIME, '09:00'::TIME, '16:45'::TIME, '17:15'::TIME, 1000.00, true FROM schools s WHERE s.school_code = 'VCS-001'
UNION ALL
SELECT s.id, 'Sigra Route', 'ROUTE-003', 'Sigra, Varanasi', 'School', 7.00, 25, '08:00'::TIME, '09:00'::TIME, '16:45'::TIME, '17:45'::TIME, 1500.00, true FROM schools s WHERE s.school_code = 'VCS-001';

-- Insert fee payments
INSERT INTO fee_payments (student_id, academic_year_id, receipt_number, payment_date, fee_amount, total_amount, payment_mode, payment_status, collected_by, is_active)
SELECT
  s.id,
  ay.id,
  'RCP-2024-' || LPAD(ROW_NUMBER() OVER (ORDER BY s.id)::TEXT, 5, '0'),
  '2024-04-15'::DATE + (ROW_NUMBER() OVER (ORDER BY s.id) * 2)::INTEGER,
  45000.00,
  45000.00,
  (ARRAY['CASH', 'CHEQUE', 'ONLINE', 'UPI'])[1 + FLOOR(RANDOM() * 4)::INT],
  'SUCCESS',
  (SELECT id FROM staff WHERE school_id = s.school_id AND staff_type = 'NON_TEACHING' ORDER BY RANDOM() LIMIT 1),
  true
FROM students s, academic_years ay
WHERE s.school_id = (SELECT id FROM schools WHERE school_code = 'VCS-001')
  AND ay.year_name = '2024-2025'
  AND RANDOM() < 0.85;

COMMIT;

-- Summary statistics
SELECT 'School Management System Demo Data Loaded Successfully!' AS Status;
SELECT COUNT(*) AS "Total Students" FROM students WHERE school_id = (SELECT id FROM schools WHERE school_code = 'VCS-001');
SELECT COUNT(*) AS "Total Staff" FROM staff WHERE school_id = (SELECT id FROM schools WHERE school_code = 'VCS-001');
SELECT COUNT(*) AS "Total Library Books" FROM library_books WHERE school_id = (SELECT id FROM schools WHERE school_code = 'VCS-001');
SELECT COUNT(*) AS "Total Fee Payments" FROM fee_payments WHERE student_id IN (SELECT id FROM students WHERE school_id = (SELECT id FROM schools WHERE school_code = 'VCS-001'));
SELECT COUNT(*) AS "Total Attendance Records" FROM student_attendance WHERE student_id IN (SELECT id FROM students WHERE school_id = (SELECT id FROM schools WHERE school_code = 'VCS-001'));
