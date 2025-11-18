-- ============================================================================
-- EDUCATIONAL INSTITUTE (COACHING/TRAINING) - Comprehensive Demo Data
-- Varanasi Focus: IIT JEE, NEET, UPSC, Banking, Competitive Exams
-- ============================================================================

SET search_path TO public, demo_helpers;

-- ============================================================================
-- INSTITUTES (2-3 Coaching Centers)
-- ============================================================================
INSERT INTO institutes (institute_name, institute_code, institute_type, specialization, address, city, state, phone, email, website, total_capacity, is_active) VALUES
('Varanasi IIT Academy', 'INST001', 'COACHING_CENTER', ARRAY['IIT_JEE', 'NEET', 'ADVANCED_PHYSICS'], '45 Azad Chowk, Varanasi Coaching Complex', 'Varanasi', 'Uttar Pradesh', '9876543400', 'contact@varanasi-iit.in', 'www.varanasi-iit-academy.com', 400, true),
('Brahmagupta Competitive Exam Coaching', 'INST002', 'COACHING_CENTER', ARRAY['UPSC', 'SSC', 'BANKING_PO', 'RAILWAYS'], '123 Kautilya Marg, Lucknow Business District', 'Lucknow', 'Uttar Pradesh', '9876543401', 'info@brahmagupta-coaching.in', 'www.brahmagupta-coaching.com', 350, true),
('Aryabhata Neet Excellence Center', 'INST003', 'COACHING_CENTER', ARRAY['NEET', 'MEDICAL_ENTRANCE', 'BIOLOGY_SPECIALIST'], 'Medical Training Hub, Agra Medical District', 'Agra', 'Uttar Pradesh', '9876543402', 'neet@aryabhata-excellence.in', 'www.aryabhata-neet.com', 300, true);

-- ============================================================================
-- COURSES (15+ courses)
-- ============================================================================
INSERT INTO courses (institute_id, course_code, course_name, course_type, course_category, target_exam, duration_months, total_hours, class_frequency, batch_size, prerequisites, syllabus, course_fee, registration_fee, study_material_fee, is_online_available, is_active) VALUES
-- IIT JEE Courses
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'JEE-001', 'IIT JEE Main Intensive - Physics', 'REGULAR', 'COMPETITIVE_EXAM', 'IIT_JEE', 12, 480, 'DAILY', 35, 'Class 11 Mathematics & Physics', 'Complete Physics syllabus as per JEE Main', 45000.00, 2000.00, 3000.00, true, true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'JEE-002', 'IIT JEE Main Intensive - Chemistry', 'REGULAR', 'COMPETITIVE_EXAM', 'IIT_JEE', 12, 480, 'DAILY', 35, 'Class 11 Chemistry basics', 'Organic, Inorganic & Physical Chemistry', 45000.00, 2000.00, 3000.00, true, true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'JEE-003', 'IIT JEE Main Intensive - Mathematics', 'REGULAR', 'COMPETITIVE_EXAM', 'IIT_JEE', 12, 480, 'DAILY', 35, 'Class 11 Mathematics', 'Calculus, Algebra, Trigonometry, Vectors', 45000.00, 2000.00, 3000.00, true, true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'JEE-004', 'IIT JEE Advanced Preparation', 'CRASH_COURSE', 'COMPETITIVE_EXAM', 'IIT_JEE', 6, 240, 'ALTERNATE_DAYS', 25, 'IIT JEE Main Pass', 'Advanced level problem solving', 35000.00, 1500.00, 2000.00, false, true),
-- NEET Courses
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'NEET-001', 'NEET Biology Complete Course', 'REGULAR', 'COMPETITIVE_EXAM', 'NEET', 12, 400, 'DAILY', 40, 'Class 12 Biology pass', 'Botany & Zoology complete syllabus', 50000.00, 2500.00, 4000.00, true, true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'NEET-002', 'NEET Chemistry Complete Course', 'REGULAR', 'COMPETITIVE_EXAM', 'NEET', 12, 400, 'DAILY', 40, 'Class 12 Chemistry pass', 'Organic, Inorganic & Physical Chemistry', 50000.00, 2500.00, 4000.00, true, true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'NEET-003', 'NEET Physics Complete Course', 'REGULAR', 'COMPETITIVE_EXAM', 'NEET', 12, 400, 'DAILY', 40, 'Class 12 Physics pass', 'Mechanics, Optics, Modern Physics', 50000.00, 2500.00, 4000.00, true, true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'NEET-004', 'NEET Revision & Mock Tests', 'CRASH_COURSE', 'COMPETITIVE_EXAM', 'NEET', 4, 120, 'WEEKEND', 50, 'NEET syllabus knowledge', 'Revision with weekly mock tests', 15000.00, 1000.00, 1500.00, true, true),
-- UPSC Courses
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'UPSC-001', 'UPSC IAS Prelims Comprehensive', 'REGULAR', 'COMPETITIVE_EXAM', 'UPSC', 12, 360, 'ALTERNATE_DAYS', 30, 'Graduation', 'GS Paper I & II complete coverage', 60000.00, 3000.00, 5000.00, true, true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'UPSC-002', 'UPSC Mains Essay Writing', 'REGULAR', 'COMPETITIVE_EXAM', 'UPSC', 6, 180, 'ALTERNATE_DAYS', 25, 'IAS Prelims cleared', 'Essay & Optional subject guidance', 40000.00, 2000.00, 3000.00, false, true),
-- SSC Courses
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'SSC-001', 'SSC CGL Complete Preparation', 'REGULAR', 'COMPETITIVE_EXAM', 'SSC', 6, 240, 'DAILY', 35, 'Class 12 pass', 'Quantitative Aptitude, Reasoning, GA', 25000.00, 1500.00, 2000.00, true, true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'SSC-002', 'SSC CHSL Fast Track', 'CRASH_COURSE', 'COMPETITIVE_EXAM', 'SSC', 4, 160, 'DAILY', 40, 'Class 10 pass', 'CHSL exam pattern specific training', 18000.00, 1000.00, 1500.00, true, true),
-- Banking Courses
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'BANK-001', 'Bank PO/Clerk Comprehensive', 'REGULAR', 'COMPETITIVE_EXAM', 'BANKING_PO', 4, 160, 'ALTERNATE_DAYS', 35, 'Graduation', 'Quantitative Aptitude, Reasoning, GA', 20000.00, 1200.00, 1500.00, true, true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'BANK-002', 'Banking Specialization Advanced', 'WEEKEND', 'COMPETITIVE_EXAM', 'BANKING_SPECIALIST', 8, 200, 'WEEKEND', 30, 'Banking basics knowledge', 'Advanced banking concepts and current affairs', 28000.00, 1500.00, 2000.00, true, true),
-- Railways Courses
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'RLY-001', 'Railway RRB NTPC Preparation', 'REGULAR', 'COMPETITIVE_EXAM', 'RAILWAYS', 4, 160, 'DAILY', 40, 'Class 12 pass', 'Mathematics, Reasoning, GA for Railway exams', 16000.00, 1000.00, 1200.00, true, true);

-- ============================================================================
-- BATCHES (10+ batches)
-- ============================================================================
INSERT INTO batches (course_id, batch_code, batch_name, start_date, end_date, class_timings, class_days, max_students, enrolled_students, available_seats, batch_status, created_at) VALUES
-- IIT Academy Batches
((SELECT id FROM courses WHERE course_code = 'JEE-001'), 'BATCH-JEE-001', 'JEE Physics - Morning Batch 2024', '2024-09-01', '2025-08-31', '6:00 AM - 8:00 AM', ARRAY['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'], 35, 33, 2, 'IN_PROGRESS', '2024-09-01'),
((SELECT id FROM courses WHERE course_code = 'JEE-002'), 'BATCH-JEE-002', 'JEE Chemistry - Evening Batch 2024', '2024-09-01', '2025-08-31', '5:00 PM - 7:00 PM', ARRAY['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'], 35, 31, 4, 'IN_PROGRESS', '2024-09-01'),
((SELECT id FROM courses WHERE course_code = 'JEE-003'), 'BATCH-JEE-003', 'JEE Mathematics - Morning Batch 2024', '2024-09-01', '2025-08-31', '7:00 AM - 9:00 AM', ARRAY['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'], 35, 32, 3, 'IN_PROGRESS', '2024-09-01'),
((SELECT id FROM courses WHERE course_code = 'JEE-004'), 'BATCH-ADV-001', 'IIT JEE Advanced - Weekend Batch', '2024-10-01', '2025-03-31', '9:00 AM - 1:00 PM', ARRAY['SATURDAY', 'SUNDAY'], 25, 22, 3, 'IN_PROGRESS', '2024-10-01'),
-- NEET Excellence Batches
((SELECT id FROM courses WHERE course_code = 'NEET-001'), 'BATCH-NEET-001', 'NEET Biology - Morning Intensive', '2024-08-15', '2025-07-31', '6:00 AM - 8:30 AM', ARRAY['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'], 40, 38, 2, 'IN_PROGRESS', '2024-08-15'),
((SELECT id FROM courses WHERE course_code = 'NEET-002'), 'BATCH-NEET-002', 'NEET Chemistry - Evening Batch', '2024-08-15', '2025-07-31', '4:00 PM - 6:30 PM', ARRAY['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'], 40, 36, 4, 'IN_PROGRESS', '2024-08-15'),
((SELECT id FROM courses WHERE course_code = 'NEET-003'), 'BATCH-NEET-003', 'NEET Physics - Afternoon Batch', '2024-08-15', '2025-07-31', '2:00 PM - 4:30 PM', ARRAY['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'], 40, 37, 3, 'IN_PROGRESS', '2024-08-15'),
((SELECT id FROM courses WHERE course_code = 'NEET-004'), 'BATCH-NEET-REV', 'NEET Revision & Mocks 2024', '2024-11-01', '2025-04-30', '9:00 AM - 12:00 PM', ARRAY['SATURDAY', 'SUNDAY'], 50, 45, 5, 'IN_PROGRESS', '2024-11-01'),
-- UPSC/SSC/Banking Batches
((SELECT id FROM courses WHERE course_code = 'UPSC-001'), 'BATCH-UPSC-001', 'UPSC IAS Prelims 2025 Batch', '2024-10-01', '2025-05-31', '4:00 PM - 6:30 PM', ARRAY['MONDAY', 'WEDNESDAY', 'FRIDAY', 'SATURDAY'], 30, 28, 2, 'IN_PROGRESS', '2024-10-01'),
((SELECT id FROM courses WHERE course_code = 'SSC-001'), 'BATCH-SSC-001', 'SSC CGL 2024-25 Regular Batch', '2024-11-01', '2025-04-30', '5:00 PM - 7:00 PM', ARRAY['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], 35, 32, 3, 'IN_PROGRESS', '2024-11-01');

-- ============================================================================
-- FACULTY (15+ faculty members)
-- ============================================================================
INSERT INTO faculty (institute_id, faculty_code, first_name, last_name, phone, email, qualification, specialization, years_of_experience, subjects_taught, hourly_rate, faculty_type, is_active) VALUES
-- Varanasi IIT Academy Faculty
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'FAC001', 'Dr. Rajesh', 'Kumar Singh', '9876543500', 'rajesh.physics@varanasi-iit.in', 'PhD Physics, IIT Delhi', ARRAY['MECHANICS', 'THERMODYNAMICS', 'QUANTUM_MECHANICS'], 18, ARRAY['Physics', 'Advanced Physics'], 800.00, 'FULL_TIME', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'FAC002', 'Prof. Aniruddha', 'Chatterjee', '9876543501', 'aniruddha.chemistry@varanasi-iit.in', 'M.Sc Chemistry, Delhi University', ARRAY['ORGANIC_CHEMISTRY', 'INORGANIC_CHEMISTRY'], 15, ARRAY['Chemistry', 'Practical Chemistry'], 750.00, 'FULL_TIME', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'FAC003', 'Prof. Vikram', 'Sharma', '9876543502', 'vikram.maths@varanasi-iit.in', 'M.Tech Mathematics, NIT Allahabad', ARRAY['CALCULUS', 'ALGEBRA', 'COORDINATE_GEOMETRY'], 14, ARRAY['Mathematics', 'Problem Solving'], 700.00, 'FULL_TIME', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'FAC004', 'Ms. Priya', 'Mishra', '9876543503', 'priya.doubts@varanasi-iit.in', 'B.Tech Physics, IIT Bombay', ARRAY['ELECTROMAGNETISM', 'MODERN_PHYSICS'], 8, ARRAY['Physics Lab', 'Doubt Sessions'], 400.00, 'PART_TIME', true),
-- Brahmagupta Academy Faculty (UPSC/SSC/Banking)
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'FAC005', 'Prof. Arun', 'Tiwari', '9876543504', 'arun.ga@brahmagupta.in', 'M.A History, Delhi University', ARRAY['UPSC_GS', 'CURRENT_AFFAIRS', 'HISTORY'], 20, ARRAY['General Studies', 'Current Affairs'], 900.00, 'FULL_TIME', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'FAC006', 'Prof. Neelam', 'Verma', '9876543505', 'neelam.reasoning@brahmagupta.in', 'M.A Psychology, Lucknow University', ARRAY['REASONING', 'VERBAL_ABILITY', 'ANALYTICAL'], 12, ARRAY['Reasoning', 'Logical Analysis'], 550.00, 'FULL_TIME', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'FAC007', 'Mr. Sanjeev', 'Pandey', '9876543506', 'sanjeev.quant@brahmagupta.in', 'M.Sc Mathematics, Allahabad University', ARRAY['QUANTITATIVE_APTITUDE', 'DATA_INTERPRETATION'], 16, ARRAY['Mathematics', 'Data Interpretation'], 700.00, 'FULL_TIME', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'FAC008', 'Ms. Kavya', 'Sharma', '9876543507', 'kavya.banking@brahmagupta.in', 'M.Com, Delhi University', ARRAY['BANKING_SECTOR', 'FINANCE_ECONOMICS'], 9, ARRAY['Banking', 'Finance'], 450.00, 'PART_TIME', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'FAC009', 'Prof. Deepak', 'Singh', '9876543508', 'deepak.english@brahmagupta.in', 'M.A English, Lucknow University', ARRAY['ENGLISH_GRAMMAR', 'VOCABULARY', 'WRITING'], 11, ARRAY['English', 'Communication Skills'], 500.00, 'PART_TIME', true),
-- Aryabhata NEET Center Faculty
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'FAC010', 'Dr. Swati', 'Sharma', '9876543509', 'swati.biology@aryabhata-neet.in', 'PhD Botany, Agra University', ARRAY['BOTANY', 'PLANT_PHYSIOLOGY', 'GENETICS'], 17, ARRAY['Biology', 'Botany', 'Genetics'], 850.00, 'FULL_TIME', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'FAC011', 'Prof. Ashok', 'Kumar', '9876543510', 'ashok.zoology@aryabhata-neet.in', 'M.Sc Zoology, Agra University', ARRAY['ZOOLOGY', 'ANIMAL_PHYSIOLOGY', 'ECOLOGY'], 14, ARRAY['Zoology', 'Animal Physiology'], 750.00, 'FULL_TIME', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'FAC012', 'Ms. Disha', 'Patel', '9876543511', 'disha.chemistry@aryabhata-neet.in', 'B.Sc Chemistry, Agra University', ARRAY['ORGANIC_CHEMISTRY', 'BIOCHEMISTRY'], 6, ARRAY['Chemistry', 'Practical Chemistry'], 350.00, 'PART_TIME', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'FAC013', 'Prof. Rakesh', 'Gupta', '9876543512', 'rakesh.physics@aryabhata-neet.in', 'M.Sc Physics, Delhi University', ARRAY['MECHANICS', 'OPTICS', 'THERMAL_PHYSICS'], 13, ARRAY['Physics', 'Practical Physics'], 700.00, 'FULL_TIME', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'FAC014', 'Ms. Anjali', 'Singh', '9876543513', 'anjali.support@varanasi-iit.in', 'B.Tech Mechanical, NIT Allahabad', ARRAY['DOUBT_SUPPORT', 'MENTORING'], 5, ARRAY['Doubt Sessions', 'Mentoring'], 300.00, 'PART_TIME', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'FAC015', 'Mr. Rohit', 'Yadav', '9876543514', 'rohit.mentor@aryabhata-neet.in', 'B.Sc Life Sciences, Agra University', ARRAY['GUIDANCE', 'CAREER_COUNSELING'], 4, ARRAY['Mentoring', 'Career Counseling'], 250.00, 'PART_TIME', true);

-- ============================================================================
-- STUDENTS (40+ students)
-- ============================================================================
INSERT INTO students (institute_id, student_code, first_name, last_name, phone, email, date_of_birth, gender, address, city, parent_name, parent_phone, educational_qualification, current_school_college, target_exam, is_active) VALUES
-- IIT Academy Students
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU001', 'Arjun', 'Mishra', '9876543600', 'arjun.mishra@student.in', '2007-05-15', 'MALE', 'Flat 201, Tulsi Nagar, Varanasi', 'Varanasi', 'Rajesh Mishra', '9876543650', '12th Pass', 'Delhi Public School, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU002', 'Shreya', 'Sharma', '9876543601', 'shreya.sharma@student.in', '2007-08-22', 'FEMALE', 'Apartment 5, Scholar Colony, Varanasi', 'Varanasi', 'Dr. Suresh Sharma', '9876543651', '12th Pass', 'Kendriya Vidyalaya, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU003', 'Rohan', 'Singh', '9876543602', 'rohan.singh@student.in', '2007-03-10', 'MALE', 'House 42, Ashok Vihar, Varanasi', 'Varanasi', 'Captain Amar Singh', '9876543652', '12th Pass', 'St. Mary School, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU004', 'Priyanka', 'Verma', '9876543603', 'priyanka.verma@student.in', '2007-11-30', 'FEMALE', 'Flat 102, Govind Vihar, Varanasi', 'Varanasi', 'Ashok Verma', '9876543653', '12th Pass', 'Gyan Niketan School, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU005', 'Aditya', 'Patel', '9876543604', 'aditya.patel@student.in', '2007-07-14', 'MALE', 'Villa 7, Heritage Gardens, Varanasi', 'Varanasi', 'Vijaykumar Patel', '9876543654', '12th Pass', 'Rani Durgavati Academy, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU006', 'Diya', 'Yadav', '9876543605', 'diya.yadav@student.in', '2007-09-18', 'FEMALE', 'Apartment 12, Green Heights, Varanasi', 'Varanasi', 'Rajendra Yadav', '9876543655', '12th Pass', 'Sunrise School, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU007', 'Vedant', 'Gupta', '9876543606', 'vedant.gupta@student.in', '2007-02-21', 'MALE', 'House 189, Nandi Nagar, Varanasi', 'Varanasi', 'Anil Gupta', '9876543656', '12th Pass', 'City Public School, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU008', 'Neha', 'Joshi', '9876543607', 'neha.joshi@student.in', '2007-06-12', 'FEMALE', 'Apartment 8, Society Street, Varanasi', 'Varanasi', 'Vikram Joshi', '9876543657', '12th Pass', 'Modern School, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU009', 'Karan', 'Singh', '9876543608', 'karan.singh@student.in', '2007-04-28', 'MALE', 'Flat 304, Riverside Towers, Varanasi', 'Varanasi', 'Colonel Harpal Singh', '9876543658', '12th Pass', 'St. Andrew School, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU010', 'Meera', 'Sharma', '9876543609', 'meera.sharma@student.in', '2007-10-05', 'FEMALE', 'Villa 5, Heritage Enclave, Varanasi', 'Varanasi', 'Dr. Rajesh Sharma', '9876543659', '12th Pass', 'Gyan Ganga School, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU011', 'Sameer', 'Kumar', '9876543610', 'sameer.kumar@student.in', '2007-08-17', 'MALE', 'House 156, Scholar Nagar, Varanasi', 'Varanasi', 'Mahesh Kumar', '9876543660', '12th Pass', 'Progressive School, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU012', 'Pooja', 'Mishra', '9876543611', 'pooja.mishra@student.in', '2007-12-01', 'FEMALE', 'Apartment 15, Happy Homes, Varanasi', 'Varanasi', 'Surendra Mishra', '9876543661', '12th Pass', 'Rajkumar School, Varanasi', 'IIT_JEE', true),
-- NEET Students
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'STU013', 'Isha', 'Patel', '9876543612', 'isha.patel@student.in', '2007-01-19', 'FEMALE', 'House 234, Medical Vihar, Agra', 'Agra', 'Ramesh Patel', '9876543662', '12th Pass', 'St. Joseph School, Agra', 'NEET', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'STU014', 'Rohit', 'Desai', '9876543613', 'rohit.desai@student.in', '2007-06-08', 'MALE', 'Apartment 7, Medical Complex, Agra', 'Agra', 'Dr. Anand Desai', '9876543663', '12th Pass', 'Central School, Agra', 'NEET', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'STU015', 'Sneha', 'Kulkarni', '9876543614', 'sneha.kulkarni@student.in', '2007-09-14', 'FEMALE', 'Flat 102, Health Residency, Agra', 'Agra', 'Amit Kulkarni', '9876543664', '12th Pass', 'Greenwood School, Agra', 'NEET', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'STU016', 'Vinay', 'Singh', '9876543615', 'vinay.singh@student.in', '2007-03-25', 'MALE', 'House 89, Science Nagar, Agra', 'Agra', 'Rajendra Singh', '9876543665', '12th Pass', 'Jain School, Agra', 'NEET', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'STU017', 'Divya', 'Gupta', '9876543616', 'divya.gupta@student.in', '2007-07-30', 'FEMALE', 'Apartment 11, Medical Hills, Agra', 'Agra', 'Vikram Gupta', '9876543666', '12th Pass', 'Vidya Vihar, Agra', 'NEET', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'STU018', 'Ashish', 'Rao', '9876543617', 'ashish.rao@student.in', '2007-05-11', 'MALE', 'Flat 203, Wellness Apartments, Agra', 'Agra', 'Dr. Hari Rao', '9876543667', '12th Pass', 'Cambridge School, Agra', 'NEET', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'STU019', 'Kavya', 'Iyer', '9876543618', 'kavya.iyer@student.in', '2007-11-16', 'FEMALE', 'House 167, Bio Science Colony, Agra', 'Agra', 'Suresh Iyer', '9876543668', '12th Pass', 'Heritage School, Agra', 'NEET', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'STU020', 'Nikhil', 'Verma', '9876543619', 'nikhil.verma@student.in', '2007-08-03', 'MALE', 'Apartment 9, Medical District, Agra', 'Agra', 'Rajesh Verma', '9876543669', '12th Pass', 'New Age School, Agra', 'NEET', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'STU021', 'Priya', 'Nair', '9876543620', 'priya.nair@student.in', '2007-02-27', 'FEMALE', 'Flat 305, Health Vihar, Agra', 'Agra', 'Nagarajan Nair', '9876543670', '12th Pass', 'Rise School, Agra', 'NEET', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'STU022', 'Sanjay', 'Chakraborty', '9876543621', 'sanjay.chakraborty@student.in', '2007-10-13', 'MALE', 'House 201, Research Park, Agra', 'Agra', 'Sourav Chakraborty', '9876543671', '12th Pass', 'Spark School, Agra', 'NEET', true),
-- UPSC/SSC/Banking Students
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU023', 'Rajeev', 'Kumar', '9876543622', 'rajeev.kumar@student.in', '1995-05-20', 'MALE', 'Flat 401, IAS Complex, Lucknow', 'Lucknow', 'Rajendra Kumar', '9876543672', 'Graduation', 'Lucknow University', 'UPSC', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU024', 'Anjali', 'Singh', '9876543623', 'anjali.singh@student.in', '1996-08-15', 'FEMALE', 'Apartment 12, Civil Service Vihar, Lucknow', 'Lucknow', 'Amar Singh', '9876543673', 'Graduation', 'Delhi University', 'UPSC', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU025', 'Praveen', 'Sharma', '9876543624', 'praveen.sharma@student.in', '1997-03-10', 'MALE', 'House 78, SSC Vihar, Lucknow', 'Lucknow', 'Suresh Sharma', '9876543674', '12th Pass', 'City School, Lucknow', 'SSC', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU026', 'Neha', 'Gupta', '9876543625', 'neha.gupta@student.in', '1998-07-22', 'FEMALE', 'Flat 205, Banking Vihar, Lucknow', 'Lucknow', 'Ashok Gupta', '9876543675', 'Graduation', 'Lucknow University', 'BANKING_PO', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU027', 'Rohit', 'Singh', '9876543626', 'rohit.singh@student.in', '1999-01-08', 'MALE', 'Apartment 8, Railway Vihar, Lucknow', 'Lucknow', 'Harpal Singh', '9876543676', '12th Pass', 'Rail School, Lucknow', 'RAILWAYS', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU028', 'Seema', 'Verma', '9876543627', 'seema.verma@student.in', '1996-11-30', 'FEMALE', 'House 156, Competitive Exam, Lucknow', 'Lucknow', 'Rajesh Verma', '9876543677', 'Graduation', 'Allahabad University', 'UPSC', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU029', 'Vivek', 'Yadav', '9876543628', 'vivek.yadav@student.in', '1997-09-12', 'MALE', 'Flat 301, Civil Services, Lucknow', 'Lucknow', 'Rajendra Yadav', '9876543678', 'Graduation', 'Banaras Hindu University', 'UPSC', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU030', 'Pooja', 'Patel', '9876543629', 'pooja.patel@student.in', '1998-04-19', 'FEMALE', 'Apartment 6, SSC Coaching, Lucknow', 'Lucknow', 'Vikram Patel', '9876543679', '12th Pass', 'CBSE School, Lucknow', 'SSC', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU031', 'Gaurav', 'Kapoor', '9876543630', 'gaurav.kapoor@student.in', '1999-06-05', 'MALE', 'House 234, Banking Exam, Lucknow', 'Lucknow', 'Rajesh Kapoor', '9876543680', 'Graduation', 'Delhi University', 'BANKING_PO', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU032', 'Divya', 'Saxena', '9876543631', 'divya.saxena@student.in', '1997-02-14', 'FEMALE', 'Flat 401, UPSC Center, Lucknow', 'Lucknow', 'Mahesh Saxena', '9876543681', 'Graduation', 'Lucknow University', 'UPSC', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU033', 'Arjun', 'Trivedi', '9876543632', 'arjun.trivedi@student.in', '1996-10-28', 'MALE', 'Apartment 10, IAS Coaching, Lucknow', 'Lucknow', 'Rajesh Trivedi', '9876543682', 'Graduation', 'Kanpur University', 'UPSC', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU034', 'Nikita', 'Agarwal', '9876543633', 'nikita.agarwal@student.in', '1998-08-17', 'FEMALE', 'House 89, Banking Prep, Lucknow', 'Lucknow', 'Anil Agarwal', '9876543683', 'Graduation', 'Delhi University', 'BANKING_PO', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU035', 'Akshay', 'Joshi', '9876543634', 'akshay.joshi@student.in', '2007-04-11', 'MALE', 'Flat 107, IIT Prep, Varanasi', 'Varanasi', 'Vikram Joshi', '9876543684', '12th Pass', 'IIT Coaching, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST001'), 'STU036', 'Riya', 'Desai', '9876543635', 'riya.desai@student.in', '2007-07-26', 'FEMALE', 'Apartment 14, Scholar Vihar, Varanasi', 'Varanasi', 'Anand Desai', '9876543685', '12th Pass', 'Coaching Center, Varanasi', 'IIT_JEE', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'STU037', 'Srishti', 'Bhat', '9876543636', 'srishti.bhat@student.in', '2007-09-03', 'FEMALE', 'House 145, Medical Vihar, Agra', 'Agra', 'Rajesh Bhat', '9876543686', '12th Pass', 'Medical School, Agra', 'NEET', true),
((SELECT id FROM institutes WHERE institute_code = 'INST003'), 'STU038', 'Nikhil', 'Menon', '9876543637', 'nikhil.menon@student.in', '2007-05-21', 'MALE', 'Flat 208, NEET Center, Agra', 'Agra', 'Suresh Menon', '9876543687', '12th Pass', 'Science School, Agra', 'NEET', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU039', 'Manish', 'Kulkarni', '9876543638', 'manish.kulkarni@student.in', '1997-12-09', 'MALE', 'Apartment 5, Exam Prep, Lucknow', 'Lucknow', 'Hari Kulkarni', '9876543688', 'Graduation', 'Pune University', 'UPSC', true),
((SELECT id FROM institutes WHERE institute_code = 'INST002'), 'STU040', 'Tina', 'Srivastava', '9876543639', 'tina.srivastava@student.in', '1998-03-16', 'FEMALE', 'House 302, Banking Exam, Lucknow', 'Lucknow', 'Rajesh Srivastava', '9876543689', 'Graduation', 'Lucknow University', 'BANKING_PO', true);

-- ============================================================================
-- ENROLLMENTS (40+ enrollments)
-- ============================================================================
INSERT INTO enrollments (student_id, batch_id, enrollment_number, enrollment_date, course_fee, discount_amount, final_fee, fee_paid, balance_fee, payment_status, enrollment_status, created_at) VALUES
-- IIT Academy Enrollments
((SELECT id FROM students WHERE student_code = 'STU001'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-001'), 'ENR001', '2024-08-20', 45000.00, 2000.00, 43000.00, 43000.00, 0.00, 'PAID', 'ACTIVE', '2024-08-20'),
((SELECT id FROM students WHERE student_code = 'STU002'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-002'), 'ENR002', '2024-08-22', 45000.00, 1500.00, 43500.00, 21750.00, 21750.00, 'PARTIAL', 'ACTIVE', '2024-08-22'),
((SELECT id FROM students WHERE student_code = 'STU003'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-001'), 'ENR003', '2024-08-23', 45000.00, 2000.00, 43000.00, 43000.00, 0.00, 'PAID', 'ACTIVE', '2024-08-23'),
((SELECT id FROM students WHERE student_code = 'STU004'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-003'), 'ENR004', '2024-08-24', 45000.00, 0.00, 45000.00, 22500.00, 22500.00, 'PARTIAL', 'ACTIVE', '2024-08-24'),
((SELECT id FROM students WHERE student_code = 'STU005'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-002'), 'ENR005', '2024-08-25', 45000.00, 2500.00, 42500.00, 42500.00, 0.00, 'PAID', 'ACTIVE', '2024-08-25'),
((SELECT id FROM students WHERE student_code = 'STU006'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-001'), 'ENR006', '2024-08-26', 45000.00, 1500.00, 43500.00, 43500.00, 0.00, 'PAID', 'ACTIVE', '2024-08-26'),
((SELECT id FROM students WHERE student_code = 'STU007'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-003'), 'ENR007', '2024-08-27', 45000.00, 2000.00, 43000.00, 21500.00, 21500.00, 'PARTIAL', 'ACTIVE', '2024-08-27'),
((SELECT id FROM students WHERE student_code = 'STU008'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-002'), 'ENR008', '2024-08-28', 45000.00, 0.00, 45000.00, 45000.00, 0.00, 'PAID', 'ACTIVE', '2024-08-28'),
((SELECT id FROM students WHERE student_code = 'STU009'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-001'), 'ENR009', '2024-08-29', 45000.00, 1500.00, 43500.00, 43500.00, 0.00, 'PAID', 'ACTIVE', '2024-08-29'),
((SELECT id FROM students WHERE student_code = 'STU010'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-003'), 'ENR010', '2024-08-30', 45000.00, 2000.00, 43000.00, 21500.00, 21500.00, 'PARTIAL', 'ACTIVE', '2024-08-30'),
((SELECT id FROM students WHERE student_code = 'STU011'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-002'), 'ENR011', '2024-09-01', 45000.00, 2500.00, 42500.00, 42500.00, 0.00, 'PAID', 'ACTIVE', '2024-09-01'),
((SELECT id FROM students WHERE student_code = 'STU012'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-001'), 'ENR012', '2024-09-02', 45000.00, 1000.00, 44000.00, 44000.00, 0.00, 'PAID', 'ACTIVE', '2024-09-02'),
-- NEET Excellence Enrollments
((SELECT id FROM students WHERE student_code = 'STU013'), (SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-001'), 'ENR013', '2024-07-15', 50000.00, 2500.00, 47500.00, 47500.00, 0.00, 'PAID', 'ACTIVE', '2024-07-15'),
((SELECT id FROM students WHERE student_code = 'STU014'), (SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-002'), 'ENR014', '2024-07-16', 50000.00, 1500.00, 48500.00, 24250.00, 24250.00, 'PARTIAL', 'ACTIVE', '2024-07-16'),
((SELECT id FROM students WHERE student_code = 'STU015'), (SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-003'), 'ENR015', '2024-07-17', 50000.00, 2500.00, 47500.00, 47500.00, 0.00, 'PAID', 'ACTIVE', '2024-07-17'),
((SELECT id FROM students WHERE student_code = 'STU016'), (SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-001'), 'ENR016', '2024-07-18', 50000.00, 0.00, 50000.00, 25000.00, 25000.00, 'PARTIAL', 'ACTIVE', '2024-07-18'),
((SELECT id FROM students WHERE student_code = 'STU017'), (SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-002'), 'ENR017', '2024-07-19', 50000.00, 2000.00, 48000.00, 48000.00, 0.00, 'PAID', 'ACTIVE', '2024-07-19'),
((SELECT id FROM students WHERE student_code = 'STU018'), (SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-003'), 'ENR018', '2024-07-20', 50000.00, 1500.00, 48500.00, 48500.00, 0.00, 'PAID', 'ACTIVE', '2024-07-20'),
((SELECT id FROM students WHERE student_code = 'STU019'), (SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-001'), 'ENR019', '2024-07-21', 50000.00, 2500.00, 47500.00, 23750.00, 23750.00, 'PARTIAL', 'ACTIVE', '2024-07-21'),
((SELECT id FROM students WHERE student_code = 'STU020'), (SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-002'), 'ENR020', '2024-07-22', 50000.00, 0.00, 50000.00, 50000.00, 0.00, 'PAID', 'ACTIVE', '2024-07-22'),
((SELECT id FROM students WHERE student_code = 'STU021'), (SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-003'), 'ENR021', '2024-07-23', 50000.00, 1500.00, 48500.00, 48500.00, 0.00, 'PAID', 'ACTIVE', '2024-07-23'),
((SELECT id FROM students WHERE student_code = 'STU022'), (SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-001'), 'ENR022', '2024-07-24', 50000.00, 2000.00, 48000.00, 24000.00, 24000.00, 'PARTIAL', 'ACTIVE', '2024-07-24'),
-- UPSC/SSC/Banking Enrollments
((SELECT id FROM students WHERE student_code = 'STU023'), (SELECT id FROM batches WHERE batch_code = 'BATCH-UPSC-001'), 'ENR023', '2024-09-15', 60000.00, 3000.00, 57000.00, 57000.00, 0.00, 'PAID', 'ACTIVE', '2024-09-15'),
((SELECT id FROM students WHERE student_code = 'STU024'), (SELECT id FROM batches WHERE batch_code = 'BATCH-UPSC-001'), 'ENR024', '2024-09-16', 60000.00, 2000.00, 58000.00, 29000.00, 29000.00, 'PARTIAL', 'ACTIVE', '2024-09-16'),
((SELECT id FROM students WHERE student_code = 'STU025'), (SELECT id FROM batches WHERE batch_code = 'BATCH-SSC-001'), 'ENR025', '2024-10-20', 25000.00, 1500.00, 23500.00, 23500.00, 0.00, 'PAID', 'ACTIVE', '2024-10-20'),
((SELECT id FROM students WHERE student_code = 'STU026'), (SELECT id FROM batches WHERE batch_code = 'BATCH-SSC-001'), 'ENR026', '2024-10-21', 25000.00, 1000.00, 24000.00, 12000.00, 12000.00, 'PARTIAL', 'ACTIVE', '2024-10-21'),
((SELECT id FROM students WHERE student_code = 'STU027'), (SELECT id FROM batches WHERE batch_code = 'BATCH-UPSC-001'), 'ENR027', '2024-09-17', 60000.00, 3000.00, 57000.00, 57000.00, 0.00, 'PAID', 'ACTIVE', '2024-09-17'),
((SELECT id FROM students WHERE student_code = 'STU028'), (SELECT id FROM batches WHERE batch_code = 'BATCH-UPSC-001'), 'ENR028', '2024-09-18', 60000.00, 2500.00, 57500.00, 28750.00, 28750.00, 'PARTIAL', 'ACTIVE', '2024-09-18'),
((SELECT id FROM students WHERE student_code = 'STU029'), (SELECT id FROM batches WHERE batch_code = 'BATCH-SSC-001'), 'ENR029', '2024-10-22', 25000.00, 1500.00, 23500.00, 23500.00, 0.00, 'PAID', 'ACTIVE', '2024-10-22'),
((SELECT id FROM students WHERE student_code = 'STU030'), (SELECT id FROM batches WHERE batch_code = 'BATCH-UPSC-001'), 'ENR030', '2024-09-19', 60000.00, 2000.00, 58000.00, 58000.00, 0.00, 'PAID', 'ACTIVE', '2024-09-19'),
((SELECT id FROM students WHERE student_code = 'STU031'), (SELECT id FROM batches WHERE batch_code = 'BATCH-SSC-001'), 'ENR031', '2024-10-23', 25000.00, 1000.00, 24000.00, 24000.00, 0.00, 'PAID', 'ACTIVE', '2024-10-23'),
((SELECT id FROM students WHERE student_code = 'STU032'), (SELECT id FROM batches WHERE batch_code = 'BATCH-UPSC-001'), 'ENR032', '2024-09-20', 60000.00, 3000.00, 57000.00, 28500.00, 28500.00, 'PARTIAL', 'ACTIVE', '2024-09-20'),
((SELECT id FROM students WHERE student_code = 'STU033'), (SELECT id FROM batches WHERE batch_code = 'BATCH-SSC-001'), 'ENR033', '2024-10-24', 25000.00, 1500.00, 23500.00, 23500.00, 0.00, 'PAID', 'ACTIVE', '2024-10-24'),
((SELECT id FROM students WHERE student_code = 'STU034'), (SELECT id FROM batches WHERE batch_code = 'BATCH-UPSC-001'), 'ENR034', '2024-09-21', 60000.00, 2000.00, 58000.00, 58000.00, 0.00, 'PAID', 'ACTIVE', '2024-09-21'),
((SELECT id FROM students WHERE student_code = 'STU035'), (SELECT id FROM batches WHERE batch_code = 'BATCH-ADV-001'), 'ENR035', '2024-09-25', 35000.00, 1500.00, 33500.00, 33500.00, 0.00, 'PAID', 'ACTIVE', '2024-09-25'),
((SELECT id FROM students WHERE student_code = 'STU036'), (SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-003'), 'ENR036', '2024-09-01', 45000.00, 2000.00, 43000.00, 43000.00, 0.00, 'PAID', 'ACTIVE', '2024-09-01'),
((SELECT id FROM students WHERE student_code = 'STU037'), (SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-REV'), 'ENR037', '2024-10-25', 15000.00, 500.00, 14500.00, 14500.00, 0.00, 'PAID', 'ACTIVE', '2024-10-25'),
((SELECT id FROM students WHERE student_code = 'STU038'), (SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-001'), 'ENR038', '2024-07-25', 50000.00, 2500.00, 47500.00, 47500.00, 0.00, 'PAID', 'ACTIVE', '2024-07-25'),
((SELECT id FROM students WHERE student_code = 'STU039'), (SELECT id FROM batches WHERE batch_code = 'BATCH-UPSC-001'), 'ENR039', '2024-09-22', 60000.00, 3000.00, 57000.00, 57000.00, 0.00, 'PAID', 'ACTIVE', '2024-09-22'),
((SELECT id FROM students WHERE student_code = 'STU040'), (SELECT id FROM batches WHERE batch_code = 'BATCH-SSC-001'), 'ENR040', '2024-10-26', 25000.00, 1500.00, 23500.00, 11750.00, 11750.00, 'PARTIAL', 'ACTIVE', '2024-10-26');

-- ============================================================================
-- ATTENDANCE RECORDS (30+ attendance records)
-- ============================================================================
INSERT INTO attendance (enrollment_id, attendance_date, status, marked_by, created_at) VALUES
-- October-November attendance for JEE students
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR001'), '2024-11-01', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC001'), '2024-11-01 08:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR001'), '2024-11-02', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC001'), '2024-11-02 08:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR002'), '2024-11-01', 'ABSENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC002'), '2024-11-01 17:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR002'), '2024-11-02', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC002'), '2024-11-02 17:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR003'), '2024-11-01', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC001'), '2024-11-01 08:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR003'), '2024-11-02', 'LATE', (SELECT id FROM faculty WHERE faculty_code = 'FAC001'), '2024-11-02 08:45:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR004'), '2024-11-01', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC003'), '2024-11-01 07:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR004'), '2024-11-02', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC003'), '2024-11-02 07:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR005'), '2024-11-01', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC002'), '2024-11-01 17:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR005'), '2024-11-02', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC002'), '2024-11-02 17:30:00'),
-- NEET attendance
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR013'), '2024-11-01', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC010'), '2024-11-01 06:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR013'), '2024-11-02', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC010'), '2024-11-02 06:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR014'), '2024-11-01', 'ABSENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC011'), '2024-11-01 16:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR014'), '2024-11-02', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC011'), '2024-11-02 16:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR015'), '2024-11-01', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC013'), '2024-11-01 14:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR015'), '2024-11-02', 'LATE', (SELECT id FROM faculty WHERE faculty_code = 'FAC013'), '2024-11-02 14:45:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR016'), '2024-11-01', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC010'), '2024-11-01 06:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR016'), '2024-11-02', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC010'), '2024-11-02 06:30:00'),
-- UPSC/SSC attendance
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR023'), '2024-11-01', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC005'), '2024-11-01 16:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR023'), '2024-11-02', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC005'), '2024-11-02 16:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR025'), '2024-11-01', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC006'), '2024-11-01 17:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR025'), '2024-11-02', 'ABSENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC006'), '2024-11-02 17:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR027'), '2024-11-01', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC007'), '2024-11-01 16:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR027'), '2024-11-02', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC007'), '2024-11-02 16:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR029'), '2024-11-01', 'LATE', (SELECT id FROM faculty WHERE faculty_code = 'FAC007'), '2024-11-01 17:15:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR029'), '2024-11-02', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC007'), '2024-11-02 17:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR030'), '2024-11-01', 'PRESENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC005'), '2024-11-01 16:30:00'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR032'), '2024-11-01', 'ABSENT', (SELECT id FROM faculty WHERE faculty_code = 'FAC005'), '2024-11-01 16:30:00');

-- ============================================================================
-- MOCK TESTS & RESULTS (25+ test results)
-- ============================================================================
INSERT INTO tests (batch_id, test_name, test_type, test_date, total_marks, duration_minutes, created_at) VALUES
((SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-001'), 'JEE Physics Weekly Test - Week 1', 'WEEKLY', '2024-10-26', 100.00, 120, '2024-10-26'),
((SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-002'), 'JEE Chemistry Weekly Test - Week 1', 'WEEKLY', '2024-10-27', 100.00, 120, '2024-10-27'),
((SELECT id FROM batches WHERE batch_code = 'BATCH-JEE-003'), 'JEE Mathematics Weekly Test - Week 1', 'WEEKLY', '2024-10-28', 100.00, 120, '2024-10-28'),
((SELECT id FROM batches WHERE batch_code = 'BATCH-ADV-001'), 'IIT JEE Advanced Mock Test 1', 'MOCK_TEST', '2024-11-10', 300.00, 180, '2024-11-10'),
((SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-001'), 'NEET Full Length Mock Test 1', 'MOCK_TEST', '2024-11-05', 720.00, 180, '2024-11-05'),
((SELECT id FROM batches WHERE batch_code = 'BATCH-NEET-002'), 'NEET Full Length Mock Test 2', 'MOCK_TEST', '2024-11-12', 720.00, 180, '2024-11-12'),
((SELECT id FROM batches WHERE batch_code = 'BATCH-UPSC-001'), 'UPSC Prelims Practice Test 1', 'MOCK_TEST', '2024-11-03', 400.00, 120, '2024-11-03'),
((SELECT id FROM batches WHERE batch_code = 'BATCH-SSC-001'), 'SSC CGL Tier 1 Practice Test', 'MOCK_TEST', '2024-11-08', 200.00, 120, '2024-11-08');

INSERT INTO test_results (test_id, student_id, marks_obtained, percentage, rank, created_at) VALUES
-- JEE Physics Test Results
((SELECT id FROM tests WHERE test_name = 'JEE Physics Weekly Test - Week 1'), (SELECT id FROM students WHERE student_code = 'STU001'), 78.50, 78.50, 1, '2024-10-26'),
((SELECT id FROM tests WHERE test_name = 'JEE Physics Weekly Test - Week 1'), (SELECT id FROM students WHERE student_code = 'STU003'), 75.00, 75.00, 2, '2024-10-26'),
((SELECT id FROM tests WHERE test_name = 'JEE Physics Weekly Test - Week 1'), (SELECT id FROM students WHERE student_code = 'STU009'), 72.00, 72.00, 3, '2024-10-26'),
((SELECT id FROM tests WHERE test_name = 'JEE Physics Weekly Test - Week 1'), (SELECT id FROM students WHERE student_code = 'STU011'), 68.50, 68.50, 4, '2024-10-26'),
-- JEE Chemistry Test Results
((SELECT id FROM tests WHERE test_name = 'JEE Chemistry Weekly Test - Week 1'), (SELECT id FROM students WHERE student_code = 'STU002'), 81.00, 81.00, 1, '2024-10-27'),
((SELECT id FROM tests WHERE test_name = 'JEE Chemistry Weekly Test - Week 1'), (SELECT id FROM students WHERE student_code = 'STU005'), 76.00, 76.00, 2, '2024-10-27'),
((SELECT id FROM tests WHERE test_name = 'JEE Chemistry Weekly Test - Week 1'), (SELECT id FROM students WHERE student_code = 'STU008'), 73.50, 73.50, 3, '2024-10-27'),
((SELECT id FROM tests WHERE test_name = 'JEE Chemistry Weekly Test - Week 1'), (SELECT id FROM students WHERE student_code = 'STU011'), 70.00, 70.00, 4, '2024-10-27'),
-- JEE Mathematics Test Results
((SELECT id FROM tests WHERE test_name = 'JEE Mathematics Weekly Test - Week 1'), (SELECT id FROM students WHERE student_code = 'STU004'), 82.00, 82.00, 1, '2024-10-28'),
((SELECT id FROM tests WHERE test_name = 'JEE Mathematics Weekly Test - Week 1'), (SELECT id FROM students WHERE student_code = 'STU006'), 79.00, 79.00, 2, '2024-10-28'),
((SELECT id FROM tests WHERE test_name = 'JEE Mathematics Weekly Test - Week 1'), (SELECT id FROM students WHERE student_code = 'STU007'), 75.50, 75.50, 3, '2024-10-28'),
((SELECT id FROM tests WHERE test_name = 'JEE Mathematics Weekly Test - Week 1'), (SELECT id FROM students WHERE student_code = 'STU010'), 71.00, 71.00, 4, '2024-10-28'),
-- NEET Mock Test Results
((SELECT id FROM tests WHERE test_name = 'NEET Full Length Mock Test 1'), (SELECT id FROM students WHERE student_code = 'STU013'), 580.00, 80.56, 1, '2024-11-05'),
((SELECT id FROM tests WHERE test_name = 'NEET Full Length Mock Test 1'), (SELECT id FROM students WHERE student_code = 'STU015'), 562.00, 78.06, 2, '2024-11-05'),
((SELECT id FROM tests WHERE test_name = 'NEET Full Length Mock Test 1'), (SELECT id FROM students WHERE student_code = 'STU018'), 545.00, 75.69, 3, '2024-11-05'),
((SELECT id FROM tests WHERE test_name = 'NEET Full Length Mock Test 1'), (SELECT id FROM students WHERE student_code = 'STU020'), 530.00, 73.61, 4, '2024-11-05'),
-- UPSC Practice Test Results
((SELECT id FROM tests WHERE test_name = 'UPSC Prelims Practice Test 1'), (SELECT id FROM students WHERE student_code = 'STU023'), 245.00, 61.25, 1, '2024-11-03'),
((SELECT id FROM tests WHERE test_name = 'UPSC Prelims Practice Test 1'), (SELECT id FROM students WHERE student_code = 'STU024'), 228.00, 57.00, 2, '2024-11-03'),
((SELECT id FROM tests WHERE test_name = 'UPSC Prelims Practice Test 1'), (SELECT id FROM students WHERE student_code = 'STU028'), 212.00, 53.00, 3, '2024-11-03'),
((SELECT id FROM tests WHERE test_name = 'UPSC Prelims Practice Test 1'), (SELECT id FROM students WHERE student_code = 'STU030'), 198.00, 49.50, 4, '2024-11-03'),
-- SSC Practice Test Results
((SELECT id FROM tests WHERE test_name = 'SSC CGL Tier 1 Practice Test'), (SELECT id FROM students WHERE student_code = 'STU025'), 156.00, 78.00, 1, '2024-11-08'),
((SELECT id FROM tests WHERE test_name = 'SSC CGL Tier 1 Practice Test'), (SELECT id FROM students WHERE student_code = 'STU029'), 148.00, 74.00, 2, '2024-11-08'),
((SELECT id FROM tests WHERE test_name = 'SSC CGL Tier 1 Practice Test'), (SELECT id FROM students WHERE student_code = 'STU031'), 142.00, 71.00, 3, '2024-11-08'),
((SELECT id FROM tests WHERE test_name = 'SSC CGL Tier 1 Practice Test'), (SELECT id FROM students WHERE student_code = 'STU033'), 135.00, 67.50, 4, '2024-11-08');

-- ============================================================================
-- FEE PAYMENTS (25+ fee payments)
-- ============================================================================
INSERT INTO fee_payments (enrollment_id, receipt_number, payment_date, amount_paid, payment_mode, created_at) VALUES
-- JEE Students Fee Payments
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR001'), 'FEE-001', '2024-08-25', 43000.00, 'BANK_TRANSFER', '2024-08-25'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR002'), 'FEE-002', '2024-08-30', 21750.00, 'CHEQUE', '2024-08-30'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR002'), 'FEE-003', '2024-09-30', 21750.00, 'CHEQUE', '2024-09-30'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR003'), 'FEE-004', '2024-08-28', 43000.00, 'BANK_TRANSFER', '2024-08-28'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR004'), 'FEE-005', '2024-09-05', 22500.00, 'CARD', '2024-09-05'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR005'), 'FEE-006', '2024-08-30', 42500.00, 'BANK_TRANSFER', '2024-08-30'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR007'), 'FEE-007', '2024-09-10', 21500.00, 'CHEQUE', '2024-09-10'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR010'), 'FEE-008', '2024-09-15', 21500.00, 'CARD', '2024-09-15'),
-- NEET Students Fee Payments
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR013'), 'FEE-009', '2024-07-20', 47500.00, 'BANK_TRANSFER', '2024-07-20'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR014'), 'FEE-010', '2024-07-25', 24250.00, 'CHEQUE', '2024-07-25'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR014'), 'FEE-011', '2024-08-25', 24250.00, 'CHEQUE', '2024-08-25'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR015'), 'FEE-012', '2024-07-22', 47500.00, 'BANK_TRANSFER', '2024-07-22'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR016'), 'FEE-013', '2024-07-28', 25000.00, 'CARD', '2024-07-28'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR017'), 'FEE-014', '2024-07-24', 48000.00, 'BANK_TRANSFER', '2024-07-24'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR019'), 'FEE-015', '2024-07-30', 23750.00, 'CHEQUE', '2024-07-30'),
-- UPSC/SSC Students Fee Payments
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR023'), 'FEE-016', '2024-09-20', 57000.00, 'BANK_TRANSFER', '2024-09-20'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR024'), 'FEE-017', '2024-09-25', 29000.00, 'CHEQUE', '2024-09-25'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR025'), 'FEE-018', '2024-10-25', 23500.00, 'CARD', '2024-10-25'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR026'), 'FEE-019', '2024-11-01', 12000.00, 'CHEQUE', '2024-11-01'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR027'), 'FEE-020', '2024-09-22', 57000.00, 'BANK_TRANSFER', '2024-09-22'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR028'), 'FEE-021', '2024-09-28', 28750.00, 'CHEQUE', '2024-09-28'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR029'), 'FEE-022', '2024-10-28', 23500.00, 'BANK_TRANSFER', '2024-10-28'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR030'), 'FEE-023', '2024-09-24', 58000.00, 'CARD', '2024-09-24'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR031'), 'FEE-024', '2024-10-30', 24000.00, 'BANK_TRANSFER', '2024-10-30'),
((SELECT id FROM enrollments WHERE enrollment_number = 'ENR032'), 'FEE-025', '2024-10-05', 28500.00, 'CHEQUE', '2024-10-05');

-- Summary
SELECT 'Educational Institute Demo Data Loaded Successfully!' AS status;
SELECT COUNT(*) AS total_institutes FROM institutes;
SELECT COUNT(*) AS total_courses FROM courses;
SELECT COUNT(*) AS total_batches FROM batches;
SELECT COUNT(*) AS total_faculty FROM faculty;
SELECT COUNT(*) AS total_students FROM students;
SELECT COUNT(*) AS total_enrollments FROM enrollments;
SELECT COUNT(*) AS total_attendance FROM attendance;
SELECT COUNT(*) AS total_tests FROM tests;
SELECT COUNT(*) AS total_test_results FROM test_results;
SELECT COUNT(*) AS total_fee_payments FROM fee_payments;
