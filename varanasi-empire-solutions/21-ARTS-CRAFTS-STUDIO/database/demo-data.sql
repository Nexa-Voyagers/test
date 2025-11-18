-- ============================================================================
-- ARTS & CRAFTS STUDIO - COMPREHENSIVE DEMO DATA
-- Varanasi Empire Solution
-- ============================================================================

-- Insert studios (2-3 studios)
INSERT INTO studios (studio_name, address, city, phone, email, specialization, total_capacity, is_active)
VALUES
('Varanasi Arts & Crafts Academy', '145 Artist Lane, Varanasi', 'Varanasi', '9876544201', 'info@varanasiartsacademy.com', '{"PAINTING", "POTTERY", "SCULPTURE", "HANDICRAFTS"}', 200, true),
('Lucknow Creative Studio', '221 Creative Hub, Lucknow', 'Lucknow', '9876544202', 'contact@lucknowcreative.in', '{"PAINTING", "POTTERY", "SCULPTURE"}', 150, true),
('Kanpur Art School', '456 Art District, Kanpur', 'Kanpur', '9876544203', 'school@kanpurart.com', '{"PAINTING", "HANDICRAFTS"}', 120, true);

-- Insert instructors (15+ instructors)
INSERT INTO instructors (studio_id, instructor_code, first_name, last_name, phone, email, specialization, qualification, years_of_experience, hourly_rate, is_active)
WITH instr_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 18)
)
SELECT
  CASE WHEN id.rn <= 6 THEN (SELECT id FROM studios WHERE studio_name = 'Varanasi Arts & Crafts Academy')
       WHEN id.rn <= 12 THEN (SELECT id FROM studios WHERE studio_name = 'Lucknow Creative Studio')
       ELSE (SELECT id FROM studios WHERE studio_name = 'Kanpur Art School') END,
  'INSTR-' || LPAD(id.rn::TEXT, 4, '0'),
  (ARRAY['Rajesh', 'Priya', 'Arun', 'Deepika', 'Vikram', 'Meera', 'Suresh', 'Neha', 'Amit', 'Kavita',
         'Yogesh', 'Divya', 'Hemant', 'Geeta', 'Ramesh', 'Sunita', 'Anita', 'Seema'])[id.rn],
  (ARRAY['Singh', 'Kumar', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Mishra', 'Yadav', 'Pandey', 'Rao',
         'Nair', 'Iyer', 'Dey', 'Das', 'Roy', 'Reddy', 'Chopra', 'Malhotra'])[id.rn],
  '987654' || LPAD((4400 + id.rn)::TEXT, 4, '0'),
  'instructor' || id.rn || '@email.com',
  (ARRAY['{"PAINTING"}', '{"POTTERY"}', '{"SCULPTURE"}', '{"PAINTING", "POTTERY"}', '{"POTTERY", "SCULPTURE"}', '{"HANDICRAFTS"}'])[1 + FLOOR(RANDOM() * 6)::INT]::TEXT[],
  (ARRAY['BFA - Painting', 'BFA - Sculpture', 'BFA - Pottery', 'MA - Fine Arts', 'Diploma in Crafts', 'Certified Art Teacher'])[1 + FLOOR(RANDOM() * 6)::INT],
  FLOOR(RANDOM() * 25 + 3)::INT,
  FLOOR(RANDOM() * 800 + 400)::DECIMAL(8,2),
  true
FROM instr_data id;

-- Insert courses (15+ courses)
INSERT INTO courses (studio_id, course_code, course_name, course_type, art_form, duration_weeks, sessions_per_week, total_sessions, class_size, course_fee, material_fee, is_active)
SELECT
  st.id,
  'CRS-' || LPAD(ROW_NUMBER() OVER (ORDER BY st.id, c.rn)::TEXT, 4, '0'),
  c.course_name,
  c.course_type,
  c.art_form,
  c.duration,
  c.sessions_per_week,
  c.duration * c.sessions_per_week,
  c.class_size,
  c.course_fee,
  c.material_fee,
  true
FROM studios st
CROSS JOIN (
  SELECT 'Watercolor Painting - Beginner' as course_name, 'BEGINNER' as course_type, 'PAINTING' as art_form, 8 as duration, 2 as sessions_per_week, 12 as class_size, 4000.00 as course_fee, 1500.00 as material_fee, 1 as rn
  UNION ALL SELECT 'Watercolor Painting - Advanced', 'ADVANCED', 'PAINTING', 12, 3, 10, 8000.00, 2000.00, 2
  UNION ALL SELECT 'Oil Painting', 'INTERMEDIATE', 'PAINTING', 10, 2, 8, 6000.00, 3000.00, 3
  UNION ALL SELECT 'Pottery Basics', 'BEGINNER', 'POTTERY', 8, 2, 6, 5000.00, 2000.00, 4
  UNION ALL SELECT 'Ceramic Art', 'INTERMEDIATE', 'POTTERY', 12, 3, 8, 8000.00, 2500.00, 5
  UNION ALL SELECT 'Sculpting - Clay', 'BEGINNER', 'SCULPTURE', 10, 2, 10, 7000.00, 2500.00, 6
  UNION ALL SELECT 'Stone Sculpture', 'ADVANCED', 'SCULPTURE', 16, 3, 6, 12000.00, 3000.00, 7
  UNION ALL SELECT 'Traditional Handicrafts', 'BEGINNER', 'HANDICRAFTS', 8, 2, 12, 3500.00, 1500.00, 8
  UNION ALL SELECT 'Kids Painting - 6-10 years', 'KIDS', 'PAINTING', 8, 2, 15, 2500.00, 1000.00, 9
  UNION ALL SELECT 'Kids Pottery - 8-12 years', 'KIDS', 'POTTERY', 8, 2, 12, 3000.00, 1200.00, 10
  UNION ALL SELECT 'Digital Art', 'BEGINNER', 'PAINTING', 6, 2, 10, 4000.00, 500.00, 11
  UNION ALL SELECT 'Mixed Media Art', 'INTERMEDIATE', 'PAINTING', 10, 2, 8, 6500.00, 2000.00, 12
  UNION ALL SELECT 'Portrait Painting', 'INTERMEDIATE', 'PAINTING', 12, 2, 8, 7000.00, 1500.00, 13
  UNION ALL SELECT 'Jewelry Making', 'BEGINNER', 'HANDICRAFTS', 6, 2, 8, 4500.00, 1800.00, 14
  UNION ALL SELECT 'Embroidery Art', 'BEGINNER', 'HANDICRAFTS', 10, 2, 10, 3500.00, 1200.00, 15
) c;

-- Insert batches (20-25 batches)
INSERT INTO batches (course_id, instructor_id, batch_code, start_date, end_date, class_days, class_time, max_students, enrolled_students, batch_status)
WITH batch_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 25)
)
SELECT
  (SELECT id FROM courses ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM instructors ORDER BY RANDOM() LIMIT 1),
  'BATCH-' || LPAD(bd.rn::TEXT, 5, '0'),
  CURRENT_DATE + (FLOOR(RANDOM() * 60)::INT),
  CURRENT_DATE + (FLOOR(RANDOM() * 60 + 120)::INT),
  (ARRAY['{"Monday", "Wednesday"}', '{"Tuesday", "Thursday"}', '{"Saturday", "Sunday"}', '{"Monday", "Wednesday", "Friday"}'])[1 + FLOOR(RANDOM() * 4)::INT]::TEXT[],
  (ARRAY['09:00', '11:00', '14:00', '16:00'])[1 + FLOOR(RANDOM() * 4)::INT]::VARCHAR,
  (ARRAY[8, 10, 12, 15])[1 + FLOOR(RANDOM() * 4)::INT],
  FLOOR(RANDOM() * 8 + 3)::INT,
  (ARRAY['OPEN', 'OPEN', 'RUNNING', 'COMPLETED'])[1 + FLOOR(RANDOM() * 4)::INT]
FROM batch_data bd;

-- Insert students (30+ students)
INSERT INTO students (studio_id, student_code, first_name, last_name, phone, email, date_of_birth, parent_name, parent_phone, is_active)
WITH stud_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 35)
)
SELECT
  CASE WHEN sd.rn <= 12 THEN (SELECT id FROM studios WHERE studio_name = 'Varanasi Arts & Crafts Academy')
       WHEN sd.rn <= 24 THEN (SELECT id FROM studios WHERE studio_name = 'Lucknow Creative Studio')
       ELSE (SELECT id FROM studios WHERE studio_name = 'Kanpur Art School') END,
  'STU-' || LPAD(sd.rn::TEXT, 4, '0'),
  (ARRAY['Rajesh', 'Priya', 'Arun', 'Deepika', 'Vikram', 'Meera', 'Suresh', 'Neha', 'Amit', 'Kavita',
         'Yogesh', 'Divya', 'Hemant', 'Geeta', 'Ramesh', 'Sunita', 'Anita', 'Seema', 'Rekha', 'Pooja',
         'Arjun', 'Aryan', 'Aditya', 'Aarav', 'Bhavesh', 'Chetan', 'Chirag', 'Chandra', 'Devendra', 'Dinesh',
         'Eshan', 'Faisal', 'Gaurav', 'Hemant', 'Imran'])[sd.rn],
  (ARRAY['Singh', 'Kumar', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Mishra', 'Yadav', 'Pandey', 'Rao',
         'Nair', 'Iyer', 'Dey', 'Das', 'Roy', 'Reddy', 'Chopra', 'Malhotra', 'Arora', 'Bhat',
         'Kulkarni', 'Desai', 'Joshi', 'Tripathi', 'Srivastava', 'Saxena', 'Mittal', 'Garg', 'Goyal', 'Agarwal',
         'Chaudhary', 'Trivedi', 'Banerjee', 'Mukherjee', 'Ghosh'])[sd.rn],
  '987654' || LPAD((4500 + sd.rn)::TEXT, 4, '0'),
  'student' || sd.rn || '@email.com',
  CURRENT_DATE - (FLOOR(RANDOM() * 18000 + 4000)::INT),
  (ARRAY['Rajesh Singh', 'Priya Sharma', 'Arun Kumar', 'Deepika Verma'])[1 + FLOOR(RANDOM() * 4)::INT],
  '987654' || LPAD((4600 + sd.rn)::TEXT, 4, '0'),
  true
FROM stud_data sd;

-- Insert enrollments (30-35 enrollments)
INSERT INTO enrollments (student_id, batch_id, enrollment_number, enrollment_date, course_fee, material_fee, total_fee, fee_paid, balance_fee, enrollment_status)
WITH enrol_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 33)
)
SELECT
  (SELECT id FROM students ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM batches ORDER BY RANDOM() LIMIT 1),
  'ENR-' || LPAD(ed.rn::TEXT, 5, '0'),
  CURRENT_DATE - (FLOOR(RANDOM() * 60)::INT),
  FLOOR(RANDOM() * 8000 + 2500)::DECIMAL(10,2),
  FLOOR(RANDOM() * 3000 + 500)::DECIMAL(8,2),
  (FLOOR(RANDOM() * 8000 + 2500) + FLOOR(RANDOM() * 3000 + 500))::DECIMAL(10,2),
  FLOOR(RANDOM() * 8000 + 2000)::DECIMAL(10,2),
  (FLOOR(RANDOM() * 8000 + 2500) + FLOOR(RANDOM() * 3000 + 500)) - FLOOR(RANDOM() * 8000 + 2000),
  (ARRAY['ACTIVE', 'COMPLETED', 'ON_HOLD'])[1 + FLOOR(RANDOM() * 3)::INT]
FROM enrol_data ed;

-- Insert materials inventory
INSERT INTO materials_inventory (studio_id, material_name, material_category, unit, current_stock, min_stock_level, unit_cost, is_active)
SELECT
  st.id,
  m.material_name,
  m.material_category,
  m.unit,
  FLOOR(RANDOM() * 100 + 10)::DECIMAL(10,2),
  20.00,
  m.unit_cost,
  true
FROM studios st
CROSS JOIN (
  SELECT 'Acrylic Paint Set' as material_name, 'PAINT' as material_category, 'SET' as unit, 250.00 as unit_cost
  UNION ALL SELECT 'Watercolor Paint', 'PAINT', 'BOX', 180.00
  UNION ALL SELECT 'Oil Paint Tubes', 'PAINT', 'PACK', 450.00
  UNION ALL SELECT 'Canvas Sheets', 'CANVAS', 'PACK', 80.00
  UNION ALL SELECT 'Art Paper Pad', 'PAPER', 'PAD', 120.00
  UNION ALL SELECT 'Clay - 10kg bag', 'CLAY', 'BAG', 150.00
  UNION ALL SELECT 'Sculpting Tools Set', 'TOOLS', 'SET', 500.00
  UNION ALL SELECT 'Brush Set - Assorted', 'BRUSH', 'SET', 200.00
  UNION ALL SELECT 'Palette Knife', 'TOOLS', 'PIECE', 80.00
  UNION ALL SELECT 'Sketch Pencils', 'PENCIL', 'SET', 150.00
) m;

-- Insert artworks (30+ artworks)
INSERT INTO artworks (studio_id, student_id, artwork_title, art_form, completion_date, is_for_sale, price)
WITH artwork_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 32)
)
SELECT
  (SELECT studio_id FROM students ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM students ORDER BY RANDOM() LIMIT 1),
  'Artwork ' || aw.rn,
  (ARRAY['PAINTING', 'POTTERY', 'SCULPTURE', 'CRAFT'])[1 + FLOOR(RANDOM() * 4)::INT],
  CURRENT_DATE - (FLOOR(RANDOM() * 90)::INT),
  RANDOM() > 0.7,
  CASE WHEN RANDOM() > 0.7 THEN FLOOR(RANDOM() * 50000 + 5000)::DECIMAL(10,2) ELSE NULL END
FROM artwork_data aw;

-- Insert gallery exhibitions
INSERT INTO gallery_exhibitions (studio_id, exhibition_name, exhibition_date, venue)
SELECT
  st.id,
  'Student Showcase - ' || TO_CHAR(CURRENT_DATE + (FLOOR(RANDOM() * 180)::INT), 'Month YYYY'),
  CURRENT_DATE + (FLOOR(RANDOM() * 180)::INT),
  (ARRAY['Varanasi Art Gallery', 'Cultural Center', 'Community Hall', 'School Auditorium'])[1 + FLOOR(RANDOM() * 4)::INT]
FROM studios st;

-- Summary
SELECT 'Arts & Crafts Studio Demo Data Loaded Successfully!' AS Status;
SELECT COUNT(*) AS "Total Students" FROM students;
SELECT COUNT(*) AS "Total Instructors" FROM instructors;
SELECT COUNT(*) AS "Total Courses" FROM courses;
SELECT COUNT(*) AS "Active Enrollments" FROM enrollments WHERE enrollment_status = 'ACTIVE';
