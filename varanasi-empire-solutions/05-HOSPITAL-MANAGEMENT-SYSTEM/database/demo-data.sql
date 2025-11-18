-- ============================================================================
-- HOSPITAL INFORMATION SYSTEM - COMPREHENSIVE DEMO DATA
-- Version: 1.0.0
-- ============================================================================
-- This script populates realistic sample data for hospital management features
-- including: departments, doctors, nurses, patients, appointments, admissions,
-- lab tests, pharmacy inventory, and billing.
--
-- Sample Data:
-- - Hospital departments (OPD, IPD, Emergency, ICU)
-- - 20+ doctors with specializations
-- - 15+ nurses
-- - 30+ patients
-- - 25+ appointments and consultations
-- - IPD admissions
-- - Lab test results
-- - Pharmacy inventory
-- - Billing records
-- ============================================================================

-- ============================================================================
-- 1. HOSPITAL SETUP
-- ============================================================================

-- Note: Assuming hospital table exists from schema
-- If not, create it first

INSERT INTO hospitals (hospital_name, hospital_code, hospital_type, address_line1, address_line2,
                      city, state, pincode, latitude, longitude, phone, email, website,
                      registration_number, total_beds, icu_beds, hdu_beds, gst_number, is_active)
VALUES
(
    'Varanasi Medical & Research Institute',
    'VMRI',
    'multi_specialty',
    '42 Assi Ghat, Varanasi',
    'Near Shitala Temple',
    'Varanasi',
    'Uttar Pradesh',
    '221001',
    25.3209,
    82.9789,
    '+919876543210',
    'info@vmri.com',
    'www.vmri.com',
    'REG-UP-001',
    500,
    50,
    30,
    '09AABCU1234G1Z0',
    true
),
(
    'Lucknow Central Hospital',
    'LCH',
    'government',
    '123 Hazratganj Street, Lucknow',
    'Near Charbagh Railway Station',
    'Lucknow',
    'Uttar Pradesh',
    '226001',
    26.8467,
    80.9462,
    '+919876543211',
    'admin@lucknow-hospital.gov.in',
    'www.lucknow-hospital.gov.in',
    'REG-UP-002',
    800,
    80,
    40,
    '09AACPL5678H1Z5',
    true
);

-- ============================================================================
-- 2. DEPARTMENTS
-- ============================================================================

INSERT INTO departments (hospital_id, department_name, department_code, description, head_doctor_name,
                        is_operational, created_at)
VALUES
-- For VMRI
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Out Patient Department',
    'OPD',
    'Outpatient consultation and treatment',
    'Dr. Rajesh Kumar',
    true,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'In Patient Department',
    'IPD',
    'Inpatient care and ward management',
    'Dr. Priya Singh',
    true,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Emergency & Trauma',
    'EMG',
    '24/7 emergency care and trauma services',
    'Dr. Vikram Patel',
    true,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Intensive Care Unit',
    'ICU',
    'Critical care management',
    'Dr. Sunita Sharma',
    true,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Cardiology',
    'CARD',
    'Heart and cardiovascular diseases',
    'Dr. Arun Mishra',
    true,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Orthopedics',
    'ORTHO',
    'Bone and joint surgery',
    'Dr. Mahesh Singh',
    true,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'General Surgery',
    'SURG',
    'General surgical procedures',
    'Dr. Deepti Verma',
    true,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Laboratory',
    'LAB',
    'Diagnostic and pathology services',
    'Dr. Kavya Gupta',
    true,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Pharmacy',
    'PHARM',
    'Medication and pharmaceutical services',
    'Mr. Harish Rao',
    true,
    CURRENT_TIMESTAMP
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Nursing',
    'NURS',
    'Nursing and patient care support',
    'Mrs. Anjali Singh',
    true,
    CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. DOCTORS
-- ============================================================================

INSERT INTO doctors (hospital_id, doctor_name, doctor_code, specialization, qualification,
                    registration_number, phone, email, availability_from, availability_to,
                    consultation_fee, is_active, joining_date)
VALUES
-- Cardiologists
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Dr. Arun Mishra',
    'DOC-VMRI-001',
    'Cardiology',
    'MBBS, MD (Internal Medicine), DM (Cardiology)',
    'GMC-REG-001',
    '+919876543220',
    'arun.mishra@vmri.com',
    '09:00',
    '18:00',
    1500.00,
    true,
    '2018-01-15'
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Dr. Rakesh Sharma',
    'DOC-VMRI-002',
    'Cardiology',
    'MBBS, MD (Cardiology)',
    'GMC-REG-002',
    '+919876543221',
    'rakesh.sharma@vmri.com',
    '10:00',
    '17:00',
    1200.00,
    true,
    '2019-03-20'
),
-- General Surgeons
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Dr. Deepti Verma',
    'DOC-VMRI-003',
    'General Surgery',
    'MBBS, MS (Surgery)',
    'GMC-REG-003',
    '+919876543222',
    'deepti.verma@vmri.com',
    '08:00',
    '17:00',
    1000.00,
    true,
    '2017-06-10'
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Dr. Sanjay Singh',
    'DOC-VMRI-004',
    'General Surgery',
    'MBBS, MS (Surgery)',
    'GMC-REG-004',
    '+919876543223',
    'sanjay.singh@vmri.com',
    '09:30',
    '17:30',
    1000.00,
    true,
    '2018-08-15'
),
-- Orthopedists
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Dr. Mahesh Singh',
    'DOC-VMRI-005',
    'Orthopedics',
    'MBBS, MS (Orthopedics)',
    'GMC-REG-005',
    '+919876543224',
    'mahesh.singh@vmri.com',
    '09:00',
    '16:00',
    900.00,
    true,
    '2016-02-01'
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Dr. Vikram Patel',
    'DOC-VMRI-006',
    'Orthopedics',
    'MBBS, MS (Orthopedics)',
    'GMC-REG-006',
    '+919876543225',
    'vikram.patel@vmri.com',
    '10:00',
    '17:00',
    900.00,
    true,
    '2019-01-10'
),
-- Physicians/Internists
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Dr. Priya Singh',
    'DOC-VMRI-007',
    'Internal Medicine',
    'MBBS, MD (Internal Medicine)',
    'GMC-REG-007',
    '+919876543226',
    'priya.singh@vmri.com',
    '08:30',
    '17:30',
    800.00,
    true,
    '2018-04-15'
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Dr. Sunita Sharma',
    'DOC-VMRI-008',
    'Internal Medicine',
    'MBBS, MD (Internal Medicine), MNAMS',
    'GMC-REG-008',
    '+919876543227',
    'sunita.sharma@vmri.com',
    '09:00',
    '18:00',
    800.00,
    true,
    '2017-07-20'
),
-- ENT Specialist
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Dr. Rajesh Kumar',
    'DOC-VMRI-009',
    'ENT',
    'MBBS, MS (ENT)',
    'GMC-REG-009',
    '+919876543228',
    'rajesh.kumar@vmri.com',
    '10:00',
    '16:00',
    750.00,
    true,
    '2015-09-12'
),
-- Pediatrician
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Dr. Anjali Verma',
    'DOC-VMRI-010',
    'Pediatrics',
    'MBBS, MD (Pediatrics)',
    'GMC-REG-010',
    '+919876543229',
    'anjali.verma@vmri.com',
    '09:00',
    '17:00',
    700.00,
    true,
    '2019-02-18'
),
-- Emergency Medicine
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Dr. Vikram Mishra',
    'DOC-VMRI-011',
    'Emergency Medicine',
    'MBBS, MD (Emergency Medicine)',
    'GMC-REG-011',
    '+919876543230',
    'vikram.mishra@vmri.com',
    '00:00',
    '23:59',
    600.00,
    true,
    '2020-01-10'
),
-- Radiologist
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Dr. Ashish Gupta',
    'DOC-VMRI-012',
    'Radiology',
    'MBBS, MD (Radiology)',
    'GMC-REG-012',
    '+919876543231',
    'ashish.gupta@vmri.com',
    '09:00',
    '17:00',
    500.00,
    true,
    '2018-05-22'
);

-- ============================================================================
-- 4. NURSES
-- ============================================================================

INSERT INTO nurses (hospital_id, nurse_name, nurse_code, nursing_qualification, registration_number,
                   department_id, phone, email, shift_type, is_active, joining_date)
SELECT
    h.id,
    nurse_data.nurse_name,
    nurse_data.nurse_code,
    nurse_data.nursing_qualification,
    nurse_data.registration_number,
    d.id,
    '+91' || LPAD(FLOOR(6000000000 + RANDOM() * 4000000000)::TEXT, 10, '0'),
    LOWER(nurse_data.nurse_code || '@vmri.com'),
    nurse_data.shift_type,
    true,
    CURRENT_DATE - INTERVAL '1 year' + INTERVAL '1 day' * FLOOR(RANDOM() * 730)
FROM hospitals h
CROSS JOIN departments d
CROSS JOIN (VALUES
    ('Mrs. Priya Singh', 'NURS-001', 'BSc Nursing', 'NCC-REG-001', 'DAY'),
    ('Ms. Sunita Sharma', 'NURS-002', 'BSc Nursing', 'NCC-REG-002', 'NIGHT'),
    ('Mrs. Anjali Patel', 'NURS-003', 'GNM (General Nursing)', 'NCC-REG-003', 'DAY'),
    ('Ms. Kavya Mishra', 'NURS-004', 'BSc Nursing', 'NCC-REG-004', 'NIGHT'),
    ('Mrs. Deepti Verma', 'NURS-005', 'BSc Nursing', 'NCC-REG-005', 'DAY'),
    ('Ms. Isha Gupta', 'NURS-006', 'GNM (General Nursing)', 'NCC-REG-006', 'ROTATING')
) AS nurse_data(nurse_name, nurse_code, nursing_qualification, registration_number, shift_type)
WHERE h.hospital_code = 'VMRI'
AND (d.department_name IN ('In Patient Department', 'Intensive Care Unit', 'Emergency & Trauma'))
LIMIT 15;

-- ============================================================================
-- 5. PATIENTS
-- ============================================================================

INSERT INTO patients (hospital_id, patient_id, first_name, middle_name, last_name, father_husband_name,
                     date_of_birth, gender, blood_group, phone, email, address_line1, address_line2,
                     city, state, pincode, nationality, marital_status, occupation, is_active)
VALUES
-- Sample Patients (30+)
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'HOSP-VMRI-2025-001001',
    'Rajesh',
    NULL,
    'Kumar',
    'Late Hari Singh',
    '1965-05-15',
    'MALE',
    'O+',
    '9876543210',
    'rajesh.kumar65@gmail.com',
    '42 Assi Ghat',
    'Near Shitala Temple',
    'Varanasi',
    'Uttar Pradesh',
    '221001',
    'Indian',
    'MARRIED',
    'Retired Teacher',
    true
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'HOSP-VMRI-2025-001002',
    'Priya',
    NULL,
    'Singh',
    'Vikram Singh',
    '1975-08-22',
    'FEMALE',
    'B+',
    '9876543211',
    'priya.singh75@hotmail.com',
    '178 Mint Street',
    'Old City',
    'Varanasi',
    'Uttar Pradesh',
    '221002',
    'Indian',
    'MARRIED',
    'Housewife',
    true
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'HOSP-VMRI-2025-001003',
    'Vikram',
    'Kumar',
    'Patel',
    'Ramesh Patel',
    '1985-11-10',
    'MALE',
    'A+',
    '9876543212',
    'vikram.patel85@outlook.com',
    '234 Chauk Road',
    'Cantonment',
    'Varanasi',
    'Uttar Pradesh',
    '221002',
    'Indian',
    'MARRIED',
    'Engineer',
    true
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'HOSP-VMRI-2025-001004',
    'Sunita',
    NULL,
    'Sharma',
    'Arun Kumar',
    '1990-03-28',
    'FEMALE',
    'AB+',
    '9876543213',
    'sunita.sharma90@gmail.com',
    '456 Industrial Area',
    'Rajatalab',
    'Varanasi',
    'Uttar Pradesh',
    '221005',
    'Indian',
    'SINGLE',
    'Software Developer',
    true
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'HOSP-VMRI-2025-001005',
    'Arun',
    'Mohan',
    'Verma',
    'Mohan Verma',
    '1980-07-12',
    'MALE',
    'O-',
    '9876543214',
    'arun.verma80@rediffmail.com',
    '789 Sardar Patel Marg',
    'Civil Lines',
    'Varanasi',
    'Uttar Pradesh',
    '221011',
    'Indian',
    'MARRIED',
    'Business',
    true
);

-- Insert more patients (bulk insert from similar data)
DO $$
DECLARE
    v_patient_count INT := 6;
    v_first_names TEXT[] := ARRAY['Mahesh', 'Deepti', 'Harsh', 'Anjali', 'Naveen', 'Pooja', 'Rohan', 'Neha', 'Sandeep', 'Isha', 'Ashok', 'Meera', 'Sanjay', 'Divya', 'Karan', 'Priya', 'Nitin', 'Swati', 'Vikash', 'Tara', 'Ravi', 'Sheetal', 'Akshay', 'Kavya'];
    v_last_names TEXT[] := ARRAY['Singh', 'Kumar', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Rao', 'Mishra', 'Pandey', 'Yadav'];
    v_hospitals_id UUID;
BEGIN
    SELECT id INTO v_hospitals_id FROM hospitals WHERE hospital_code = 'VMRI';

    FOR v_patient_count IN 6..30 LOOP
        INSERT INTO patients (hospital_id, patient_id, first_name, last_name, father_husband_name,
                             date_of_birth, gender, blood_group, phone, email, address_line1, city, state, pincode,
                             nationality, marital_status, is_active)
        VALUES
        (
            v_hospitals_id,
            'HOSP-VMRI-2025-' || LPAD(v_patient_count::TEXT, 6, '0'),
            v_first_names[1 + FLOOR(RANDOM() * ARRAY_LENGTH(v_first_names, 1))::INT],
            v_last_names[1 + FLOOR(RANDOM() * ARRAY_LENGTH(v_last_names, 1))::INT],
            'Father/Husband Name',
            CURRENT_DATE - INTERVAL '1 day' * FLOOR(10000 + RANDOM() * 15000),
            CASE WHEN RANDOM() > 0.5 THEN 'MALE' ELSE 'FEMALE' END,
            ARRAY['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'][1 + FLOOR(RANDOM() * 8)::INT],
            '9876543' || LPAD(v_patient_count::TEXT, 3, '0'),
            LOWER('patient' || v_patient_count || '@gmail.com'),
            v_patient_count || ' Medical Street',
            'Varanasi',
            'Uttar Pradesh',
            '221001',
            'Indian',
            ARRAY['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED'][1 + FLOOR(RANDOM() * 4)::INT],
            true
        );
    END LOOP;
END $$;

-- ============================================================================
-- 6. APPOINTMENTS & CONSULTATIONS
-- ============================================================================

INSERT INTO appointments (hospital_id, patient_id, doctor_id, appointment_date, appointment_time,
                         appointment_type, status, reason_for_visit, consultation_notes,
                         created_at, scheduled_at)
SELECT
    h.id,
    p.id,
    d.id,
    CURRENT_DATE + INTERVAL '1 day' * (ROW_NUMBER() OVER (ORDER BY p.id) % 15),
    CASE WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 4 = 0 THEN '09:00'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 4 = 1 THEN '11:30'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 4 = 2 THEN '14:00'
         ELSE '16:00'
    END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 3 = 0 THEN 'FOLLOW_UP'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 3 = 1 THEN 'FIRST_TIME'
         ELSE 'EMERGENCY'
    END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY p.id) <= 5 THEN 'COMPLETED'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) <= 15 THEN 'CONFIRMED'
         ELSE 'PENDING'
    END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 5 = 0 THEN 'Chest pain and breathlessness'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 5 = 1 THEN 'Joint pain in knee'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 5 = 2 THEN 'Abdominal pain'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 5 = 3 THEN 'Regular checkup'
         ELSE 'Fever and cough'
    END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY p.id) <= 5 THEN 'Patient evaluated, prescribed medication'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) <= 10 THEN 'Further tests recommended'
         ELSE NULL
    END,
    CURRENT_TIMESTAMP - INTERVAL '1 day' * (30 - ROW_NUMBER() OVER (ORDER BY p.id)),
    CURRENT_TIMESTAMP - INTERVAL '1 day' * (30 - ROW_NUMBER() OVER (ORDER BY p.id))
FROM hospitals h
CROSS JOIN patients p
CROSS JOIN doctors d
WHERE h.hospital_code = 'VMRI'
AND (d.specialization = 'Cardiology' OR d.specialization = 'Orthopedics')
LIMIT 25;

-- ============================================================================
-- 7. IPD ADMISSIONS
-- ============================================================================

INSERT INTO ipd_admissions (hospital_id, patient_id, doctor_id, admission_date, admission_time,
                           department_id, room_number, bed_number, diagnosis, status,
                           expected_discharge_date, discharge_date, discharge_summary)
SELECT
    h.id,
    p.id,
    d.id,
    CURRENT_DATE - INTERVAL '1 day' * (ROW_NUMBER() OVER (ORDER BY p.id) % 7),
    '09:00',
    dept.id,
    LPAD((ROW_NUMBER() OVER (ORDER BY p.id) / 3 + 1)::TEXT, 3, '0'),
    (ROW_NUMBER() OVER (ORDER BY p.id) % 4) + 1,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 5 = 0 THEN 'Acute Coronary Syndrome'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 5 = 1 THEN 'Fracture Femur'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 5 = 2 THEN 'Appendicitis'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 5 = 3 THEN 'Pneumonia'
         ELSE 'Hypertension Crisis'
    END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY p.id) <= 3 THEN 'DISCHARGED'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) <= 8 THEN 'ADMITTED'
         ELSE 'PENDING'
    END,
    CURRENT_DATE + INTERVAL '1 day' * (5 + ROW_NUMBER() OVER (ORDER BY p.id) % 5),
    CASE WHEN ROW_NUMBER() OVER (ORDER BY p.id) <= 3 THEN CURRENT_DATE - INTERVAL '1 day' * (ROW_NUMBER() OVER (ORDER BY p.id) - 1) ELSE NULL END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY p.id) <= 3 THEN 'Patient discharged in stable condition. Follow-up consultation recommended.' ELSE NULL END
FROM hospitals h
CROSS JOIN patients p
CROSS JOIN doctors d
CROSS JOIN departments dept
WHERE h.hospital_code = 'VMRI'
AND dept.department_name IN ('Cardiology', 'General Surgery', 'Orthopedics')
LIMIT 8;

-- ============================================================================
-- 8. LAB TESTS
-- ============================================================================

INSERT INTO lab_tests (hospital_id, patient_id, test_name, test_code, test_type, sample_type,
                      status, test_date, result_date, test_result, reference_value,
                      unit, remarks, created_at)
SELECT
    h.id,
    p.id,
    test_data.test_name,
    test_data.test_code,
    test_data.test_type,
    test_data.sample_type,
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) <= 2 THEN 'COMPLETED'
         WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) <= 4 THEN 'PENDING'
         ELSE 'PENDING'
    END,
    CURRENT_DATE - INTERVAL '1 day' * (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id)),
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id) <= 2 THEN CURRENT_DATE ELSE NULL END,
    test_data.test_result,
    test_data.reference_value,
    test_data.unit,
    CASE WHEN (200 + ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p.id)) > 200 THEN 'Within normal range' ELSE 'Requires follow-up' END,
    CURRENT_TIMESTAMP
FROM hospitals h
CROSS JOIN patients p
CROSS JOIN (VALUES
    ('Hemoglobin', 'HB', 'Hematology', 'Blood', '13.5', '11-16', 'g/dL'),
    ('Total White Blood Cells', 'TWC', 'Hematology', 'Blood', '7500', '4500-11000', 'cells/mm3'),
    ('Fasting Blood Sugar', 'FBS', 'Biochemistry', 'Blood', '95', '70-100', 'mg/dL'),
    ('Serum Creatinine', 'CREAT', 'Biochemistry', 'Blood', '1.0', '0.6-1.2', 'mg/dL'),
    ('Lipid Profile', 'LIPID', 'Biochemistry', 'Blood', '180', '<200', 'mg/dL'),
    ('Thyroid Function Test', 'TSH', 'Endocrinology', 'Blood', '2.5', '0.4-4.0', 'mIU/L')
) AS test_data(test_name, test_code, test_type, sample_type, test_result, reference_value, unit)
WHERE h.hospital_code = 'VMRI'
LIMIT 20;

-- ============================================================================
-- 9. PHARMACY INVENTORY
-- ============================================================================

INSERT INTO pharmacy_items (hospital_id, item_name, item_code, generic_name, manufacturer,
                           batch_number, expiry_date, current_stock, min_stock_level, max_stock_level,
                           unit_cost, selling_price, unit, is_active)
VALUES
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Aspirin 75mg',
    'PHARM-ASP-75',
    'Acetylsalicylic Acid',
    'Cipla',
    'BTH-2024-001',
    CURRENT_DATE + INTERVAL '1 year',
    500,
    50,
    1000,
    2.50,
    8.00,
    'tablet',
    true
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Amoxicillin 500mg',
    'PHARM-AMX-500',
    'Amoxicillin',
    'GlaxoSmithKline',
    'BTH-2024-002',
    CURRENT_DATE + INTERVAL '18 months',
    1200,
    100,
    2000,
    5.00,
    15.00,
    'capsule',
    true
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Metformin 500mg',
    'PHARM-MET-500',
    'Metformin HCl',
    'Lupin',
    'BTH-2024-003',
    CURRENT_DATE + INTERVAL '2 years',
    800,
    100,
    1500,
    1.50,
    6.00,
    'tablet',
    true
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Lisinopril 10mg',
    'PHARM-LIS-10',
    'Lisinopril',
    'Torrent',
    'BTH-2024-004',
    CURRENT_DATE + INTERVAL '2 years',
    600,
    50,
    1200,
    4.00,
    12.00,
    'tablet',
    true
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Omeprazole 20mg',
    'PHARM-OMP-20',
    'Omeprazole',
    'Dr Reddy',
    'BTH-2024-005',
    CURRENT_DATE + INTERVAL '18 months',
    700,
    75,
    1400,
    3.00,
    10.00,
    'capsule',
    true
),
(
    (SELECT id FROM hospitals WHERE hospital_code = 'VMRI'),
    'Insulin Regular',
    'PHARM-INS-REG',
    'Human Insulin',
    'Novo Nordisk',
    'BTH-2024-006',
    CURRENT_DATE + INTERVAL '6 months',
    150,
    20,
    300,
    45.00,
    120.00,
    'vial',
    true
);

-- ============================================================================
-- 10. PATIENT PRESCRIPTIONS
-- ============================================================================

INSERT INTO prescriptions (hospital_id, patient_id, doctor_id, prescription_date, medication_name,
                          dose, frequency, duration_days, quantity, instructions, is_active)
SELECT
    h.id,
    p.id,
    d.id,
    CURRENT_DATE - INTERVAL '1 day' * (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY d.id) - 1),
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY d.id) = 1 THEN 'Aspirin 75mg'
         WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY d.id) = 2 THEN 'Metformin 500mg'
         WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY d.id) = 3 THEN 'Lisinopril 10mg'
         ELSE 'Omeprazole 20mg'
    END,
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY d.id) = 1 THEN '75mg'
         WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY d.id) = 2 THEN '500mg'
         WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY d.id) = 3 THEN '10mg'
         ELSE '20mg'
    END,
    'Once daily',
    30,
    30,
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY d.id) = 1 THEN 'Take with food'
         WHEN ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY d.id) = 2 THEN 'Before breakfast'
         ELSE 'As advised'
    END,
    true
FROM hospitals h
CROSS JOIN patients p
CROSS JOIN doctors d
WHERE h.hospital_code = 'VMRI'
LIMIT 15;

-- ============================================================================
-- 11. HOSPITAL BILLING
-- ============================================================================

INSERT INTO billing (hospital_id, patient_id, admission_id, bill_date, consultation_charges,
                    medication_charges, test_charges, procedure_charges, room_charges, total_amount,
                    payment_status, payment_method, payment_date)
SELECT
    h.id,
    p.id,
    (SELECT id FROM ipd_admissions WHERE patient_id = p.id LIMIT 1),
    CURRENT_DATE - INTERVAL '1 day' * (ROW_NUMBER() OVER (ORDER BY p.id) % 10),
    (500 + ROW_NUMBER() OVER (ORDER BY p.id) * 100)::DECIMAL(10,2),
    (2000 + ROW_NUMBER() OVER (ORDER BY p.id) * 200)::DECIMAL(10,2),
    (1500 + ROW_NUMBER() OVER (ORDER BY p.id) * 150)::DECIMAL(10,2),
    (5000 + ROW_NUMBER() OVER (ORDER BY p.id) * 500)::DECIMAL(10,2),
    (3000 + ROW_NUMBER() OVER (ORDER BY p.id) * 300)::DECIMAL(10,2),
    (12000 + ROW_NUMBER() OVER (ORDER BY p.id) * 1200)::DECIMAL(12,2),
    CASE WHEN ROW_NUMBER() OVER (ORDER BY p.id) <= 5 THEN 'PAID'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) <= 8 THEN 'PENDING'
         ELSE 'PARTIAL'
    END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 3 = 0 THEN 'CREDIT_CARD'
         WHEN ROW_NUMBER() OVER (ORDER BY p.id) % 3 = 1 THEN 'CASH'
         ELSE 'UPI'
    END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY p.id) <= 5 THEN CURRENT_DATE - INTERVAL '1 day' * (ROW_NUMBER() OVER (ORDER BY p.id) % 10) ELSE NULL END
FROM hospitals h
CROSS JOIN patients p
WHERE h.hospital_code = 'VMRI'
LIMIT 12;

-- ============================================================================
-- VERIFICATION & SUMMARY
-- ============================================================================

SELECT 'Hospital Management Demo Data Complete!' AS status;
SELECT COUNT(*) AS "Total Departments" FROM departments WHERE hospital_id = (SELECT id FROM hospitals WHERE hospital_code = 'VMRI');
SELECT COUNT(*) AS "Total Doctors" FROM doctors WHERE hospital_id = (SELECT id FROM hospitals WHERE hospital_code = 'VMRI');
SELECT COUNT(*) AS "Total Nurses" FROM nurses WHERE hospital_id = (SELECT id FROM hospitals WHERE hospital_code = 'VMRI');
SELECT COUNT(*) AS "Total Patients" FROM patients WHERE hospital_id = (SELECT id FROM hospitals WHERE hospital_code = 'VMRI');
SELECT COUNT(*) AS "Total Appointments" FROM appointments WHERE hospital_id = (SELECT id FROM hospitals WHERE hospital_code = 'VMRI');
SELECT COUNT(*) AS "Total Lab Tests" FROM lab_tests WHERE hospital_id = (SELECT id FROM hospitals WHERE hospital_code = 'VMRI');
SELECT COUNT(*) AS "Total Pharmacy Items" FROM pharmacy_items WHERE hospital_id = (SELECT id FROM hospitals WHERE hospital_code = 'VMRI');
