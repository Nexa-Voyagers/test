-- ============================================================================
-- SCHOOL MANAGEMENT SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Target: CBSE, ICSE, UP Board, and State Board Schools
-- Features: Student Information System, Academic Management, Fee Management,
--           Attendance, Exams, Library, Transport, Hostel, LMS, Parent Portal
-- Tier: Enterprise (Multi-branch) + Standard (Single school)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "timescaledb"; -- For analytics

-- ============================================================================
-- SCHOOL HIERARCHY & CONFIGURATION
-- ============================================================================

CREATE TABLE school_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_name VARCHAR(255) NOT NULL,
    trust_name VARCHAR(255),
    registration_number VARCHAR(100) UNIQUE,
    pan_number VARCHAR(20),
    gstin VARCHAR(20),

    -- Centralized features (Enterprise tier)
    centralized_admissions BOOLEAN DEFAULT false,
    centralized_fee_management BOOLEAN DEFAULT false,
    centralized_hr BOOLEAN DEFAULT true,

    -- Contact
    head_office_address TEXT,
    location GEOGRAPHY(POINT),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website VARCHAR(255),

    -- Branding
    logo_url VARCHAR(500),
    primary_color VARCHAR(10) DEFAULT '#1E3A8A',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES school_groups(id),

    -- Basic Info
    school_name VARCHAR(255) NOT NULL,
    school_code VARCHAR(50) UNIQUE NOT NULL,
    affiliation_board VARCHAR(50) NOT NULL, -- CBSE, ICSE, UP_BOARD, STATE_BOARD
    affiliation_number VARCHAR(100),
    udise_code VARCHAR(50) UNIQUE, -- Unified District Information System for Education

    -- School Type
    school_level VARCHAR(50)[], -- PRE_PRIMARY, PRIMARY, MIDDLE, SECONDARY, SENIOR_SECONDARY
    school_category VARCHAR(50), -- CO_ED, BOYS, GIRLS
    school_type VARCHAR(50) DEFAULT 'PRIVATE', -- PRIVATE, GOVERNMENT, AIDED

    -- Location
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),
    location GEOGRAPHY(POINT),

    -- Contact
    principal_name VARCHAR(255),
    principal_email VARCHAR(255),
    principal_phone VARCHAR(20),
    office_email VARCHAR(255),
    office_phone VARCHAR(20),
    emergency_phone VARCHAR(20),

    -- Academic
    establishment_year INTEGER,
    medium_of_instruction VARCHAR(50)[], -- ENGLISH, HINDI, BOTH
    has_pre_primary BOOLEAN DEFAULT false,
    has_hostel BOOLEAN DEFAULT false,
    has_transport BOOLEAN DEFAULT false,
    has_library BOOLEAN DEFAULT true,
    has_sports_facilities BOOLEAN DEFAULT true,
    has_computer_lab BOOLEAN DEFAULT true,
    has_science_lab BOOLEAN DEFAULT true,

    -- Capacity
    total_capacity INTEGER,
    current_strength INTEGER DEFAULT 0,

    -- Financial
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    fee_payment_modes TEXT[], -- CASH, CHEQUE, ONLINE, UPI, CARD

    -- System
    academic_year_start_month INTEGER DEFAULT 4, -- April
    working_days_per_week INTEGER DEFAULT 6,

    -- Compliance
    fire_safety_certificate_valid_till DATE,
    building_safety_certificate_valid_till DATE,

    logo_url VARCHAR(500),
    website VARCHAR(255),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- ACADEMIC STRUCTURE
-- ============================================================================

CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    year_name VARCHAR(50) NOT NULL, -- 2024-2025
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    -- Terms/Sessions
    total_terms INTEGER DEFAULT 2, -- Quarterly, Semester, Annual

    is_current BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(school_id, year_name)
);

CREATE TABLE academic_terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,

    term_name VARCHAR(50) NOT NULL, -- Term 1, Semester 1, Q1
    term_number INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    -- Exam schedule
    exam_start_date DATE,
    exam_end_date DATE,
    result_date DATE,

    is_current BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(academic_year_id, term_number)
);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    class_name VARCHAR(50) NOT NULL, -- Nursery, LKG, UKG, 1-12
    class_code VARCHAR(20) NOT NULL,
    class_level VARCHAR(50), -- PRE_PRIMARY, PRIMARY, MIDDLE, SECONDARY, SENIOR_SECONDARY
    class_order INTEGER NOT NULL, -- For sorting

    -- Curriculum
    board VARCHAR(50), -- CBSE, ICSE, UP_BOARD
    stream VARCHAR(50), -- For 11-12: SCIENCE, COMMERCE, ARTS, VOCATIONAL

    -- Capacity
    max_students_per_section INTEGER DEFAULT 40,

    -- Fees
    annual_tuition_fee DECIMAL(10, 2) DEFAULT 0,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(school_id, class_code)
);

CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,

    section_name VARCHAR(10) NOT NULL, -- A, B, C, etc.

    -- Class Teacher
    class_teacher_id UUID, -- Will reference teachers table

    -- Room
    room_number VARCHAR(50),
    floor_number INTEGER,
    capacity INTEGER DEFAULT 40,
    current_strength INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(class_id, academic_year_id, section_name)
);

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    subject_name VARCHAR(255) NOT NULL,
    subject_code VARCHAR(50) NOT NULL,

    -- Type
    subject_category VARCHAR(50), -- LANGUAGE, SCIENCE, MATHEMATICS, SOCIAL_SCIENCE, ARTS, PHYSICAL_EDUCATION, CO_CURRICULAR
    is_compulsory BOOLEAN DEFAULT true,
    is_elective BOOLEAN DEFAULT false,

    -- Academic
    theory_marks DECIMAL(5, 2) DEFAULT 100,
    practical_marks DECIMAL(5, 2) DEFAULT 0,
    total_marks DECIMAL(5, 2) DEFAULT 100,
    passing_marks DECIMAL(5, 2) DEFAULT 33,

    -- Teaching
    periods_per_week INTEGER DEFAULT 5,

    description TEXT,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(school_id, subject_code)
);

CREATE TABLE class_subject_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,

    is_compulsory BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(class_id, subject_id, academic_year_id)
);

-- ============================================================================
-- STUDENTS & PARENTS
-- ============================================================================

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    -- Student IDs
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    roll_number VARCHAR(50),
    sr_number VARCHAR(50), -- School Register Number

    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    aadhar_number VARCHAR(20) UNIQUE,

    -- Category
    category VARCHAR(50), -- GENERAL, OBC, SC, ST, EWS
    religion VARCHAR(50),
    caste VARCHAR(100),
    nationality VARCHAR(50) DEFAULT 'Indian',
    mother_tongue VARCHAR(50),

    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),

    -- Address
    current_address TEXT,
    permanent_address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),

    -- Academic
    admission_date DATE NOT NULL,
    admission_class VARCHAR(50),
    current_class_id UUID REFERENCES classes(id),
    current_section_id UUID REFERENCES sections(id),

    -- Previous School
    previous_school_name VARCHAR(255),
    previous_school_board VARCHAR(50),
    previous_class VARCHAR(50),
    tc_number VARCHAR(50), -- Transfer Certificate
    tc_date DATE,
    tc_file_url VARCHAR(500),

    -- Medical
    has_medical_conditions BOOLEAN DEFAULT false,
    medical_conditions TEXT,
    allergies TEXT,
    current_medications TEXT,

    -- Transport
    uses_transport BOOLEAN DEFAULT false,
    route_id UUID, -- Will reference transport_routes
    pickup_point VARCHAR(255),

    -- Hostel
    is_hosteller BOOLEAN DEFAULT false,
    hostel_id UUID, -- Will reference hostels
    room_number VARCHAR(50),

    -- Documents
    birth_certificate_url VARCHAR(500),
    aadhar_card_url VARCHAR(500),
    photo_url VARCHAR(500),
    previous_marksheet_url VARCHAR(500),

    -- Financial
    fee_concession_type VARCHAR(50), -- FULL, PARTIAL, SIBLING, STAFF_WARD, SCHOLARSHIP
    fee_concession_percent DECIMAL(5, 2) DEFAULT 0,
    fee_concession_amount DECIMAL(10, 2) DEFAULT 0,

    -- Status
    student_status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, PASSED_OUT, TC_ISSUED, SUSPENDED, EXPELLED
    leaving_date DATE,
    leaving_reason TEXT,

    -- System
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_students_admission_number ON students(admission_number);
CREATE INDEX idx_students_school_class ON students(school_id, current_class_id);
CREATE INDEX idx_students_status ON students(student_status);

CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    relation VARCHAR(50) NOT NULL, -- FATHER, MOTHER, GUARDIAN

    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    aadhar_number VARCHAR(20) UNIQUE,

    -- Professional
    occupation VARCHAR(255),
    designation VARCHAR(255),
    organization VARCHAR(255),
    annual_income DECIMAL(12, 2),
    office_address TEXT,

    -- Education
    qualification VARCHAR(100),

    -- Address (same as student usually)
    address TEXT,

    -- Portal Access
    portal_username VARCHAR(100) UNIQUE,
    portal_password_hash VARCHAR(255),
    is_primary_contact BOOLEAN DEFAULT false,
    can_pickup_student BOOLEAN DEFAULT true,

    photo_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE student_parent_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,

    relation VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    is_emergency_contact BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(student_id, parent_id)
);

CREATE TABLE student_siblings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    sibling_id UUID REFERENCES students(id) ON DELETE CASCADE,

    relation VARCHAR(50) DEFAULT 'SIBLING',

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(student_id, sibling_id),
    CHECK (student_id != sibling_id)
);

-- ============================================================================
-- TEACHERS & STAFF
-- ============================================================================

CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    -- Employee IDs
    employee_code VARCHAR(50) UNIQUE NOT NULL,

    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    aadhar_number VARCHAR(20) UNIQUE,
    pan_number VARCHAR(20),

    -- Contact
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),

    -- Address
    current_address TEXT,
    permanent_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),

    -- Employment
    staff_type VARCHAR(50) NOT NULL, -- TEACHING, NON_TEACHING, ADMINISTRATIVE
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    date_of_joining DATE NOT NULL,
    employment_type VARCHAR(50), -- PERMANENT, CONTRACT, TEMPORARY, PROBATION

    -- Salary
    basic_salary DECIMAL(10, 2),
    allowances JSONB, -- HRA, DA, TA, etc.
    total_salary DECIMAL(10, 2),

    -- Bank Details
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),

    -- Qualifications (for teachers)
    highest_qualification VARCHAR(100),
    specialization VARCHAR(255),
    teaching_experience_years INTEGER,
    qualifications JSONB, -- Array of degrees
    certifications JSONB, -- Array of certifications

    -- Documents
    photo_url VARCHAR(500),
    resume_url VARCHAR(500),
    aadhar_card_url VARCHAR(500),
    pan_card_url VARCHAR(500),
    qualification_documents_url TEXT[],

    -- System Access
    system_username VARCHAR(100) UNIQUE,
    system_password_hash VARCHAR(255),
    system_role VARCHAR(50), -- SUPER_ADMIN, ADMIN, TEACHER, ACCOUNTANT, LIBRARIAN, etc.

    -- Status
    employment_status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, ON_LEAVE, SUSPENDED, RESIGNED, TERMINATED
    leaving_date DATE,
    leaving_reason TEXT,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_staff_employee_code ON staff(employee_code);
CREATE INDEX idx_staff_school ON staff(school_id);
CREATE INDEX idx_staff_type ON staff(staff_type);

CREATE TABLE teacher_subject_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,

    is_primary_teacher BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(teacher_id, subject_id, academic_year_id)
);

CREATE TABLE teacher_class_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,

    is_class_teacher BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(teacher_id, section_id, subject_id)
);

-- Update sections table foreign key
ALTER TABLE sections ADD CONSTRAINT fk_sections_class_teacher
    FOREIGN KEY (class_teacher_id) REFERENCES staff(id);

-- ============================================================================
-- ATTENDANCE MANAGEMENT
-- ============================================================================

CREATE TABLE student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,

    attendance_date DATE NOT NULL,

    -- Status
    status VARCHAR(50) NOT NULL, -- PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE, HOLIDAY
    check_in_time TIME,
    check_out_time TIME,

    -- Leave details
    leave_type VARCHAR(50), -- SICK, CASUAL, EMERGENCY
    leave_reason TEXT,
    is_leave_approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES staff(id),

    -- Remarks
    remarks TEXT,
    marked_by UUID REFERENCES staff(id),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(student_id, attendance_date)
);

CREATE INDEX idx_student_attendance_date ON student_attendance(attendance_date);
CREATE INDEX idx_student_attendance_student ON student_attendance(student_id, attendance_date);

CREATE TABLE staff_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    attendance_date DATE NOT NULL,

    -- Status
    status VARCHAR(50) NOT NULL, -- PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE, HOLIDAY, WEEKEND
    check_in_time TIME,
    check_out_time TIME,
    total_hours DECIMAL(4, 2),

    -- Leave details
    leave_type VARCHAR(50), -- SICK, CASUAL, EARNED, MATERNITY, PATERNITY
    leave_reason TEXT,
    is_leave_approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES staff(id),

    remarks TEXT,
    marked_by UUID REFERENCES staff(id),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(staff_id, attendance_date)
);

CREATE INDEX idx_staff_attendance_date ON staff_attendance(attendance_date);
CREATE INDEX idx_staff_attendance_staff ON staff_attendance(staff_id, attendance_date);

-- ============================================================================
-- TIMETABLE MANAGEMENT
-- ============================================================================

CREATE TABLE timetable_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    template_name VARCHAR(255) NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,

    -- Timing
    school_start_time TIME NOT NULL,
    school_end_time TIME NOT NULL,
    period_duration_minutes INTEGER DEFAULT 40,
    break_duration_minutes INTEGER DEFAULT 15,
    lunch_break_duration_minutes INTEGER DEFAULT 30,
    total_periods_per_day INTEGER DEFAULT 8,

    -- Days
    working_days VARCHAR(20)[] DEFAULT ARRAY['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE period_timings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES timetable_templates(id) ON DELETE CASCADE,

    period_number INTEGER NOT NULL,
    period_type VARCHAR(50) DEFAULT 'REGULAR', -- REGULAR, BREAK, LUNCH, ASSEMBLY
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(template_id, period_number)
);

CREATE TABLE class_timetable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    template_id UUID REFERENCES timetable_templates(id) ON DELETE CASCADE,

    day_of_week VARCHAR(20) NOT NULL, -- MONDAY, TUESDAY, etc.
    period_number INTEGER NOT NULL,

    subject_id UUID REFERENCES subjects(id),
    teacher_id UUID REFERENCES staff(id),
    room_number VARCHAR(50),

    is_substitution BOOLEAN DEFAULT false,
    original_teacher_id UUID REFERENCES staff(id),
    substitution_reason TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(section_id, day_of_week, period_number)
);

-- ============================================================================
-- EXAMINATION & ASSESSMENT
-- ============================================================================

CREATE TABLE exam_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    exam_type_name VARCHAR(100) NOT NULL, -- Unit Test, Monthly Test, Mid-Term, Final
    exam_code VARCHAR(50) NOT NULL,
    weightage_percent DECIMAL(5, 2) DEFAULT 0, -- For final grade calculation

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(school_id, exam_code)
);

CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    academic_term_id UUID REFERENCES academic_terms(id),
    exam_type_id UUID REFERENCES exam_types(id) ON DELETE CASCADE,

    exam_name VARCHAR(255) NOT NULL,

    -- Date Range
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    -- Result
    result_date DATE,
    result_published BOOLEAN DEFAULT false,
    result_published_at TIMESTAMP,

    -- Grading
    grading_system VARCHAR(50) DEFAULT 'PERCENTAGE', -- PERCENTAGE, CGPA, GRADE
    passing_percentage DECIMAL(5, 2) DEFAULT 33,

    remarks TEXT,

    created_by UUID REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE exam_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,

    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,

    room_number VARCHAR(50),
    max_marks DECIMAL(6, 2) NOT NULL,
    passing_marks DECIMAL(6, 2) NOT NULL,

    -- Supervision
    invigilator_1_id UUID REFERENCES staff(id),
    invigilator_2_id UUID REFERENCES staff(id),

    instructions TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(exam_id, class_id, subject_id)
);

CREATE TABLE exam_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_schedule_id UUID REFERENCES exam_schedule(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,

    -- Marks
    theory_marks_obtained DECIMAL(6, 2) DEFAULT 0,
    practical_marks_obtained DECIMAL(6, 2) DEFAULT 0,
    total_marks_obtained DECIMAL(6, 2) NOT NULL,
    max_marks DECIMAL(6, 2) NOT NULL,
    percentage DECIMAL(5, 2),

    -- Grade
    grade VARCHAR(5), -- A+, A, B+, B, C, D, E
    grade_points DECIMAL(4, 2),

    -- Status
    is_absent BOOLEAN DEFAULT false,
    is_pass BOOLEAN DEFAULT false,

    remarks TEXT,

    -- Entry
    entered_by UUID REFERENCES staff(id),
    verified_by UUID REFERENCES staff(id),
    is_verified BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(exam_schedule_id, student_id)
);

CREATE INDEX idx_exam_marks_student ON exam_marks(student_id);
CREATE INDEX idx_exam_marks_exam ON exam_marks(exam_schedule_id);

CREATE TABLE grade_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    grade VARCHAR(5) NOT NULL,
    min_percentage DECIMAL(5, 2) NOT NULL,
    max_percentage DECIMAL(5, 2) NOT NULL,
    grade_points DECIMAL(4, 2),
    description VARCHAR(100),

    display_order INTEGER,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(school_id, grade)
);

CREATE TABLE report_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    academic_term_id UUID REFERENCES academic_terms(id),

    -- Overall Performance
    total_marks_obtained DECIMAL(10, 2),
    total_max_marks DECIMAL(10, 2),
    overall_percentage DECIMAL(5, 2),
    overall_grade VARCHAR(5),
    cgpa DECIMAL(4, 2),

    -- Ranking
    class_rank INTEGER,
    total_students INTEGER,

    -- Attendance
    total_working_days INTEGER,
    days_present INTEGER,
    attendance_percentage DECIMAL(5, 2),

    -- Remarks
    class_teacher_remarks TEXT,
    principal_remarks TEXT,

    -- Promotion
    is_promoted BOOLEAN DEFAULT false,
    promoted_to_class_id UUID REFERENCES classes(id),

    -- Generation
    generated_at TIMESTAMP DEFAULT NOW(),
    generated_by UUID REFERENCES staff(id),
    report_card_pdf_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- FEE MANAGEMENT
-- ============================================================================

CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,

    structure_name VARCHAR(255) NOT NULL,

    -- Annual Fees
    tuition_fee DECIMAL(10, 2) DEFAULT 0,
    admission_fee DECIMAL(10, 2) DEFAULT 0,
    annual_fee DECIMAL(10, 2) DEFAULT 0,
    exam_fee DECIMAL(10, 2) DEFAULT 0,
    computer_fee DECIMAL(10, 2) DEFAULT 0,
    library_fee DECIMAL(10, 2) DEFAULT 0,
    sports_fee DECIMAL(10, 2) DEFAULT 0,
    activity_fee DECIMAL(10, 2) DEFAULT 0,
    maintenance_fee DECIMAL(10, 2) DEFAULT 0,
    development_fee DECIMAL(10, 2) DEFAULT 0,

    -- Optional
    transport_fee DECIMAL(10, 2) DEFAULT 0,
    hostel_fee DECIMAL(10, 2) DEFAULT 0,

    total_annual_fee DECIMAL(10, 2) NOT NULL,

    -- Installments
    payment_frequency VARCHAR(50) DEFAULT 'ANNUAL', -- ANNUAL, SEMI_ANNUAL, QUARTERLY, MONTHLY
    number_of_installments INTEGER DEFAULT 1,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(school_id, academic_year_id, class_id)
);

CREATE TABLE fee_installments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fee_structure_id UUID REFERENCES fee_structures(id) ON DELETE CASCADE,

    installment_number INTEGER NOT NULL,
    installment_name VARCHAR(100) NOT NULL, -- Q1, Q2, April, May
    due_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,

    late_fee_applicable BOOLEAN DEFAULT true,
    late_fee_amount DECIMAL(10, 2) DEFAULT 100,
    late_fee_grace_days INTEGER DEFAULT 7,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(fee_structure_id, installment_number)
);

CREATE TABLE student_fee_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id UUID REFERENCES fee_structures(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,

    -- Adjustments
    base_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    discount_reason TEXT,
    additional_charges DECIMAL(10, 2) DEFAULT 0,
    additional_charges_reason TEXT,

    final_amount DECIMAL(10, 2) NOT NULL,

    assigned_at TIMESTAMP DEFAULT NOW(),
    assigned_by UUID REFERENCES staff(id)
);

CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,

    -- Receipt
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,

    -- Amount
    installment_id UUID REFERENCES fee_installments(id),
    fee_amount DECIMAL(10, 2) NOT NULL,
    late_fee_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Payment Method
    payment_mode VARCHAR(50) NOT NULL, -- CASH, CHEQUE, ONLINE, UPI, CARD
    transaction_id VARCHAR(255),
    cheque_number VARCHAR(50),
    cheque_date DATE,
    bank_name VARCHAR(255),

    -- Payment Gateway (if online)
    payment_gateway VARCHAR(50), -- RAZORPAY, PAYTM, PHONEPE
    gateway_order_id VARCHAR(255),
    gateway_payment_id VARCHAR(255),

    -- Status
    payment_status VARCHAR(50) DEFAULT 'SUCCESS', -- SUCCESS, PENDING, FAILED, REFUNDED

    remarks TEXT,

    -- Entry
    collected_by UUID REFERENCES staff(id),
    verified_by UUID REFERENCES staff(id),

    -- Receipt
    receipt_pdf_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fee_payments_student ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_receipt ON fee_payments(receipt_number);
CREATE INDEX idx_fee_payments_date ON fee_payments(payment_date);

CREATE TABLE fee_defaulters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,

    total_fee DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    pending_amount DECIMAL(10, 2) NOT NULL,
    late_fee_amount DECIMAL(10, 2) DEFAULT 0,

    overdue_since DATE,
    last_payment_date DATE,

    reminder_sent_count INTEGER DEFAULT 0,
    last_reminder_sent_at TIMESTAMP,

    -- Actions taken
    is_defaulter_notice_sent BOOLEAN DEFAULT false,
    defaulter_notice_sent_at TIMESTAMP,
    is_suspended BOOLEAN DEFAULT false,
    suspended_at TIMESTAMP,

    remarks TEXT,

    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- LIBRARY MANAGEMENT
-- ============================================================================

CREATE TABLE library_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    -- Book Details
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    isbn VARCHAR(20) UNIQUE,

    -- Author
    author VARCHAR(255) NOT NULL,
    co_authors TEXT[],

    -- Publication
    publisher VARCHAR(255),
    edition VARCHAR(50),
    publication_year INTEGER,
    language VARCHAR(50) DEFAULT 'English',

    -- Classification
    category VARCHAR(100), -- FICTION, NON_FICTION, REFERENCE, TEXTBOOK
    subject VARCHAR(255),
    dewey_decimal VARCHAR(20),

    -- Physical
    total_copies INTEGER NOT NULL DEFAULT 1,
    available_copies INTEGER NOT NULL DEFAULT 1,
    rack_number VARCHAR(50),
    shelf_number VARCHAR(50),

    -- Pricing
    purchase_price DECIMAL(10, 2),
    purchase_date DATE,
    supplier VARCHAR(255),

    -- Condition
    condition VARCHAR(50) DEFAULT 'GOOD', -- EXCELLENT, GOOD, FAIR, POOR, DAMAGED

    -- Book Details
    total_pages INTEGER,
    description TEXT,
    cover_image_url VARCHAR(500),

    is_reference_only BOOLEAN DEFAULT false,
    is_available_for_issue BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_library_books_isbn ON library_books(isbn);
CREATE INDEX idx_library_books_title ON library_books USING gin(to_tsvector('english', title));

CREATE TABLE library_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    member_type VARCHAR(50) NOT NULL, -- STUDENT, TEACHER, STAFF
    member_id UUID NOT NULL, -- student_id or staff_id

    membership_number VARCHAR(50) UNIQUE NOT NULL,
    membership_start_date DATE NOT NULL,
    membership_end_date DATE,

    -- Limits
    max_books_allowed INTEGER DEFAULT 2,
    max_issue_days INTEGER DEFAULT 14,

    -- Deposit
    security_deposit DECIMAL(10, 2) DEFAULT 0,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE library_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID REFERENCES library_books(id) ON DELETE CASCADE,
    member_id UUID REFERENCES library_members(id) ON DELETE CASCADE,

    transaction_type VARCHAR(50) NOT NULL, -- ISSUE, RETURN, RENEW, LOST, DAMAGED

    -- Issue
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,

    -- Return
    return_date DATE,
    days_overdue INTEGER DEFAULT 0,

    -- Fine
    fine_amount DECIMAL(10, 2) DEFAULT 0,
    fine_paid BOOLEAN DEFAULT false,
    fine_paid_date DATE,

    -- Condition
    condition_at_issue VARCHAR(50) DEFAULT 'GOOD',
    condition_at_return VARCHAR(50),

    remarks TEXT,

    issued_by UUID REFERENCES staff(id),
    returned_to UUID REFERENCES staff(id),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_library_transactions_member ON library_transactions(member_id);
CREATE INDEX idx_library_transactions_book ON library_transactions(book_id);
CREATE INDEX idx_library_transactions_dates ON library_transactions(issue_date, due_date);

-- ============================================================================
-- TRANSPORT MANAGEMENT
-- ============================================================================

CREATE TABLE transport_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL, -- BUS, VAN, CAR
    vehicle_model VARCHAR(100),

    -- Capacity
    seating_capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,

    -- Ownership
    ownership_type VARCHAR(50), -- OWNED, LEASED, CONTRACTED

    -- Driver
    driver_name VARCHAR(255) NOT NULL,
    driver_phone VARCHAR(20) NOT NULL,
    driver_license_number VARCHAR(50),
    driver_license_expiry DATE,

    -- Conductor (if any)
    has_conductor BOOLEAN DEFAULT false,
    conductor_name VARCHAR(255),
    conductor_phone VARCHAR(20),

    -- Documents
    registration_number VARCHAR(50),
    registration_expiry DATE,
    insurance_number VARCHAR(100),
    insurance_expiry DATE,
    fitness_certificate_expiry DATE,
    permit_expiry DATE,
    pollution_certificate_expiry DATE,

    -- GPS Tracking
    gps_device_id VARCHAR(100),
    has_gps_tracking BOOLEAN DEFAULT false,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transport_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    route_name VARCHAR(255) NOT NULL,
    route_number VARCHAR(50) UNIQUE NOT NULL,

    vehicle_id UUID REFERENCES transport_vehicles(id),

    -- Route Details
    start_point VARCHAR(255) NOT NULL,
    end_point VARCHAR(255) NOT NULL,
    total_distance_km DECIMAL(6, 2),
    estimated_duration_minutes INTEGER,

    -- Timings
    morning_start_time TIME,
    morning_end_time TIME,
    evening_start_time TIME,
    evening_end_time TIME,

    -- Fee
    monthly_fee DECIMAL(10, 2) NOT NULL,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transport_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID REFERENCES transport_routes(id) ON DELETE CASCADE,

    stop_name VARCHAR(255) NOT NULL,
    stop_order INTEGER NOT NULL,

    location GEOGRAPHY(POINT),
    address TEXT,
    landmark VARCHAR(255),

    -- Timings
    morning_pickup_time TIME,
    evening_drop_time TIME,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(route_id, stop_order)
);

CREATE TABLE student_transport (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    route_id UUID REFERENCES transport_routes(id),
    stop_id UUID REFERENCES transport_stops(id),

    -- Dates
    start_date DATE NOT NULL,
    end_date DATE,

    -- Preferences
    pickup_required BOOLEAN DEFAULT true,
    drop_required BOOLEAN DEFAULT true,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- HOSTEL MANAGEMENT
-- ============================================================================

CREATE TABLE hostels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    hostel_name VARCHAR(255) NOT NULL,
    hostel_type VARCHAR(50) NOT NULL, -- BOYS, GIRLS

    address TEXT,
    warden_name VARCHAR(255) NOT NULL,
    warden_phone VARCHAR(20) NOT NULL,
    warden_email VARCHAR(255),

    -- Capacity
    total_capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,

    -- Facilities
    facilities TEXT[],

    -- Fee
    monthly_fee DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2),

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hostel_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE,

    room_number VARCHAR(50) NOT NULL,
    floor_number INTEGER,
    room_type VARCHAR(50), -- SINGLE, DOUBLE, TRIPLE, DORMITORY

    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,

    -- Amenities
    has_attached_bathroom BOOLEAN DEFAULT false,
    has_ac BOOLEAN DEFAULT false,
    has_wifi BOOLEAN DEFAULT false,

    monthly_fee DECIMAL(10, 2),

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(hostel_id, room_number)
);

CREATE TABLE hostel_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    room_id UUID REFERENCES hostel_rooms(id),

    admission_date DATE NOT NULL,
    leaving_date DATE,

    bed_number VARCHAR(10),

    -- Emergency Contact (can be different from parent)
    local_guardian_name VARCHAR(255),
    local_guardian_phone VARCHAR(20),
    local_guardian_address TEXT,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Update students table foreign keys
ALTER TABLE students ADD CONSTRAINT fk_students_hostel
    FOREIGN KEY (hostel_id) REFERENCES hostels(id);

ALTER TABLE students ADD CONSTRAINT fk_students_transport_route
    FOREIGN KEY (route_id) REFERENCES transport_routes(id);

-- ============================================================================
-- COMMUNICATION & NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    notification_title VARCHAR(255) NOT NULL,
    notification_message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- ANNOUNCEMENT, ALERT, REMINDER, EVENT

    -- Target Audience
    target_audience VARCHAR(50) NOT NULL, -- ALL, STUDENTS, PARENTS, TEACHERS, STAFF, CLASS_SPECIFIC
    target_class_id UUID REFERENCES classes(id),
    target_section_id UUID REFERENCES sections(id),

    -- Priority
    priority VARCHAR(50) DEFAULT 'NORMAL', -- URGENT, HIGH, NORMAL, LOW

    -- Channels
    send_push BOOLEAN DEFAULT true,
    send_sms BOOLEAN DEFAULT false,
    send_email BOOLEAN DEFAULT false,
    send_whatsapp BOOLEAN DEFAULT false,

    -- Attachments
    attachment_urls TEXT[],

    -- Scheduling
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP,

    -- Status
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, SENT, FAILED

    created_by UUID REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notification_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,

    recipient_type VARCHAR(50) NOT NULL, -- STUDENT, PARENT, STAFF
    recipient_id UUID NOT NULL,

    -- Delivery Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,

    sms_sent BOOLEAN DEFAULT false,
    email_sent BOOLEAN DEFAULT false,
    whatsapp_sent BOOLEAN DEFAULT false,
    push_sent BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE parent_teacher_meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    meeting_title VARCHAR(255) NOT NULL,
    meeting_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    -- Scope
    meeting_type VARCHAR(50), -- GENERAL, CLASS_SPECIFIC, INDIVIDUAL
    class_id UUID REFERENCES classes(id),

    agenda TEXT,

    created_by UUID REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ptm_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES parent_teacher_meetings(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES staff(id),

    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 15,

    status VARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELLED, NO_SHOW

    teacher_remarks TEXT,
    parent_remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- LEARNING MANAGEMENT SYSTEM (LMS)
-- ============================================================================

CREATE TABLE lms_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id),
    class_id UUID REFERENCES classes(id),
    teacher_id UUID REFERENCES staff(id),
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,

    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,

    -- Thumbnail
    thumbnail_url VARCHAR(500),

    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lms_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES lms_courses(id) ON DELETE CASCADE,

    module_name VARCHAR(255) NOT NULL,
    module_order INTEGER NOT NULL,
    description TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(course_id, module_order)
);

CREATE TABLE lms_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES lms_modules(id) ON DELETE CASCADE,

    lesson_title VARCHAR(255) NOT NULL,
    lesson_order INTEGER NOT NULL,
    lesson_type VARCHAR(50) NOT NULL, -- VIDEO, DOCUMENT, QUIZ, ASSIGNMENT, LIVE_CLASS

    -- Content
    content TEXT,
    video_url VARCHAR(500),
    document_urls TEXT[],
    duration_minutes INTEGER,

    -- Quiz/Assignment
    quiz_id UUID, -- Will reference lms_quizzes
    assignment_id UUID, -- Will reference lms_assignments

    is_published BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(module_id, lesson_order)
);

CREATE TABLE lms_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lms_lessons(id) ON DELETE CASCADE,
    course_id UUID REFERENCES lms_courses(id),

    assignment_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    -- Dates
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,

    -- Grading
    max_marks DECIMAL(6, 2) NOT NULL,

    -- Attachments
    attachment_urls TEXT[],

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lms_assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES lms_assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,

    submission_text TEXT,
    submission_file_urls TEXT[],

    submitted_at TIMESTAMP DEFAULT NOW(),
    is_late BOOLEAN DEFAULT false,

    -- Grading
    marks_obtained DECIMAL(6, 2),
    teacher_feedback TEXT,
    graded_by UUID REFERENCES staff(id),
    graded_at TIMESTAMP,

    status VARCHAR(50) DEFAULT 'SUBMITTED', -- SUBMITTED, GRADED, RESUBMIT_REQUIRED

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lms_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lms_lessons(id) ON DELETE CASCADE,
    course_id UUID REFERENCES lms_courses(id),

    quiz_title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Settings
    duration_minutes INTEGER NOT NULL,
    total_marks DECIMAL(6, 2) NOT NULL,
    passing_marks DECIMAL(6, 2) NOT NULL,

    -- Attempts
    max_attempts INTEGER DEFAULT 1,

    -- Randomization
    randomize_questions BOOLEAN DEFAULT false,

    -- Schedule
    available_from TIMESTAMP,
    available_till TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lms_quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES lms_quizzes(id) ON DELETE CASCADE,

    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- MCQ, TRUE_FALSE, SHORT_ANSWER, ESSAY
    question_order INTEGER NOT NULL,

    -- Options (for MCQ)
    options JSONB, -- [{option: "A", text: "...", is_correct: true}, ...]

    -- Answer
    correct_answer TEXT,

    marks DECIMAL(5, 2) NOT NULL,

    explanation TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(quiz_id, question_order)
);

CREATE TABLE lms_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES lms_quizzes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,

    attempt_number INTEGER NOT NULL,

    started_at TIMESTAMP DEFAULT NOW(),
    submitted_at TIMESTAMP,
    duration_seconds INTEGER,

    -- Score
    marks_obtained DECIMAL(6, 2),
    total_marks DECIMAL(6, 2),
    percentage DECIMAL(5, 2),
    is_pass BOOLEAN DEFAULT false,

    answers JSONB, -- [{question_id: "", answer: "", is_correct: true}, ...]

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(quiz_id, student_id, attempt_number)
);

CREATE TABLE lms_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES lms_courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lms_lessons(id) ON DELETE CASCADE,

    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,

    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP DEFAULT NOW(),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(student_id, lesson_id)
);

-- ============================================================================
-- EVENTS & ACTIVITIES
-- ============================================================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- ACADEMIC, SPORTS, CULTURAL, EXTRA_CURRICULAR, HOLIDAY, PTM
    description TEXT,

    -- Date & Time
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,

    -- Location
    venue VARCHAR(255),

    -- Participants
    target_audience VARCHAR(50)[], -- STUDENTS, PARENTS, TEACHERS, ALL
    target_classes UUID[], -- Array of class_ids

    -- Registration
    requires_registration BOOLEAN DEFAULT false,
    registration_start_date DATE,
    registration_end_date DATE,
    max_participants INTEGER,

    -- Attachments
    poster_url VARCHAR(500),
    attachments TEXT[],

    -- Status
    status VARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, ONGOING, COMPLETED, CANCELLED

    created_by UUID REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,

    registered_at TIMESTAMP DEFAULT NOW(),
    attendance_status VARCHAR(50) DEFAULT 'REGISTERED', -- REGISTERED, PRESENT, ABSENT

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sports_houses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    house_name VARCHAR(100) NOT NULL,
    house_color VARCHAR(50),
    house_motto VARCHAR(255),

    captain_student_id UUID REFERENCES students(id),
    vice_captain_student_id UUID REFERENCES students(id),

    house_master_id UUID REFERENCES staff(id),

    points_earned INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE student_house_allocation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    house_id UUID REFERENCES sports_houses(id),
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,

    allocated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(student_id, academic_year_id)
);

-- ============================================================================
-- HOMEWORK & DIARY
-- ============================================================================

CREATE TABLE homework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES staff(id),

    homework_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,

    attachment_urls TEXT[],

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE homework_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    homework_id UUID REFERENCES homework(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,

    submission_text TEXT,
    submission_file_urls TEXT[],

    submitted_at TIMESTAMP DEFAULT NOW(),
    is_late BOOLEAN DEFAULT false,

    status VARCHAR(50) DEFAULT 'SUBMITTED', -- SUBMITTED, CHECKED, INCOMPLETE

    teacher_remarks TEXT,
    checked_by UUID REFERENCES staff(id),
    checked_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS & REPORTS (TimescaleDB)
-- ============================================================================

CREATE TABLE daily_attendance_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id),
    section_id UUID REFERENCES sections(id),

    summary_date DATE NOT NULL,

    total_students INTEGER NOT NULL,
    present_count INTEGER DEFAULT 0,
    absent_count INTEGER DEFAULT 0,
    late_count INTEGER DEFAULT 0,
    on_leave_count INTEGER DEFAULT 0,
    attendance_percentage DECIMAL(5, 2),

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(school_id, class_id, section_id, summary_date)
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('daily_attendance_summary', 'created_at', if_not_exists => TRUE);

CREATE TABLE monthly_fee_collection_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    month_year DATE NOT NULL, -- First day of month

    total_expected_collection DECIMAL(12, 2) NOT NULL,
    actual_collection DECIMAL(12, 2) DEFAULT 0,
    pending_collection DECIMAL(12, 2) NOT NULL,
    collection_percentage DECIMAL(5, 2),

    total_students INTEGER,
    paid_students INTEGER,
    defaulter_students INTEGER,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(school_id, month_year)
);

SELECT create_hypertable('monthly_fee_collection_summary', 'created_at', if_not_exists => TRUE);

CREATE TABLE academic_performance_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    exam_id UUID REFERENCES exams(id),
    class_id UUID REFERENCES classes(id),

    total_students INTEGER NOT NULL,
    students_appeared INTEGER DEFAULT 0,
    students_passed INTEGER DEFAULT 0,
    students_failed INTEGER DEFAULT 0,
    pass_percentage DECIMAL(5, 2),

    average_marks DECIMAL(6, 2),
    highest_marks DECIMAL(6, 2),
    lowest_marks DECIMAL(6, 2),

    created_at TIMESTAMP DEFAULT NOW()
);

SELECT create_hypertable('academic_performance_summary', 'created_at', if_not_exists => TRUE);

-- ============================================================================
-- SYSTEM AUDIT & LOGS
-- ============================================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,

    -- User
    user_id UUID,
    user_type VARCHAR(50), -- STAFF, PARENT, STUDENT

    -- Action
    action_type VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT, etc.
    entity_type VARCHAR(100), -- STUDENT, FEE_PAYMENT, EXAM_MARKS, etc.
    entity_id UUID,

    -- Details
    action_description TEXT,
    old_values JSONB,
    new_values JSONB,

    -- Request
    ip_address VARCHAR(50),
    user_agent TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

SELECT create_hypertable('audit_logs', 'created_at', if_not_exists => TRUE);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Current academic year active students by class
CREATE VIEW v_current_students_by_class AS
SELECT
    s.school_id,
    c.class_name,
    sec.section_name,
    COUNT(st.id) as total_students,
    COUNT(CASE WHEN st.gender = 'MALE' THEN 1 END) as male_students,
    COUNT(CASE WHEN st.gender = 'FEMALE' THEN 1 END) as female_students
FROM students st
JOIN sections sec ON st.current_section_id = sec.id
JOIN classes c ON st.current_class_id = c.id
JOIN schools s ON st.school_id = s.id
WHERE st.is_active = true
  AND st.student_status = 'ACTIVE'
GROUP BY s.school_id, c.class_name, sec.section_name, c.class_order
ORDER BY c.class_order, sec.section_name;

-- Today's attendance summary
CREATE VIEW v_todays_attendance AS
SELECT
    sa.section_id,
    c.class_name,
    sec.section_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN sa.status = 'PRESENT' THEN 1 END) as present_count,
    COUNT(CASE WHEN sa.status = 'ABSENT' THEN 1 END) as absent_count,
    COUNT(CASE WHEN sa.status = 'LATE' THEN 1 END) as late_count,
    COUNT(CASE WHEN sa.status = 'ON_LEAVE' THEN 1 END) as on_leave_count,
    ROUND(COUNT(CASE WHEN sa.status = 'PRESENT' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL * 100, 2) as attendance_percentage
FROM student_attendance sa
JOIN sections sec ON sa.section_id = sec.id
JOIN classes c ON sec.class_id = c.id
WHERE sa.attendance_date = CURRENT_DATE
GROUP BY sa.section_id, c.class_name, sec.section_name;

-- Fee defaulters list
CREATE VIEW v_fee_defaulters AS
SELECT
    fd.student_id,
    s.admission_number,
    s.first_name || ' ' || s.last_name as student_name,
    c.class_name,
    sec.section_name,
    fd.total_fee,
    fd.paid_amount,
    fd.pending_amount,
    fd.late_fee_amount,
    fd.overdue_since,
    p.phone as parent_phone,
    p.email as parent_email
FROM fee_defaulters fd
JOIN students s ON fd.student_id = s.id
JOIN classes c ON s.current_class_id = c.id
JOIN sections sec ON s.current_section_id = sec.id
LEFT JOIN student_parent_mapping spm ON s.id = spm.student_id AND spm.is_primary = true
LEFT JOIN parents p ON spm.parent_id = p.id
WHERE fd.pending_amount > 0
ORDER BY fd.overdue_since ASC;

-- Teacher workload (classes taught)
CREATE VIEW v_teacher_workload AS
SELECT
    s.id as teacher_id,
    s.employee_code,
    s.first_name || ' ' || s.last_name as teacher_name,
    COUNT(DISTINCT tcm.section_id) as total_sections,
    COUNT(DISTINCT tcm.subject_id) as total_subjects,
    COUNT(DISTINCT CASE WHEN tcm.is_class_teacher THEN tcm.section_id END) as class_teacher_sections
FROM staff s
JOIN teacher_class_mapping tcm ON s.id = tcm.teacher_id
WHERE s.staff_type = 'TEACHING'
  AND s.is_active = true
GROUP BY s.id, s.employee_code, s.first_name, s.last_name;

-- Library overdue books
CREATE VIEW v_library_overdue_books AS
SELECT
    lt.id as transaction_id,
    lb.title as book_title,
    lb.isbn,
    lm.membership_number,
    CASE
        WHEN lm.member_type = 'STUDENT' THEN (SELECT first_name || ' ' || last_name FROM students WHERE id = lm.member_id)
        WHEN lm.member_type = 'TEACHER' THEN (SELECT first_name || ' ' || last_name FROM staff WHERE id = lm.member_id)
    END as member_name,
    lt.issue_date,
    lt.due_date,
    CURRENT_DATE - lt.due_date as days_overdue,
    lt.fine_amount
FROM library_transactions lt
JOIN library_books lb ON lt.book_id = lb.id
JOIN library_members lm ON lt.member_id = lm.id
WHERE lt.return_date IS NULL
  AND lt.due_date < CURRENT_DATE
  AND lt.transaction_type = 'ISSUE'
ORDER BY lt.due_date ASC;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update section current strength when student is assigned
CREATE OR REPLACE FUNCTION update_section_strength()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE sections
        SET current_strength = (
            SELECT COUNT(*)
            FROM students
            WHERE current_section_id = NEW.current_section_id
              AND is_active = true
              AND student_status = 'ACTIVE'
        )
        WHERE id = NEW.current_section_id;
    END IF;

    IF TG_OP = 'DELETE' THEN
        UPDATE sections
        SET current_strength = (
            SELECT COUNT(*)
            FROM students
            WHERE current_section_id = OLD.current_section_id
              AND is_active = true
              AND student_status = 'ACTIVE'
        )
        WHERE id = OLD.current_section_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_section_strength
AFTER INSERT OR UPDATE OR DELETE ON students
FOR EACH ROW
EXECUTE FUNCTION update_section_strength();

-- Auto-update library book available copies
CREATE OR REPLACE FUNCTION update_library_book_copies()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.transaction_type = 'ISSUE' THEN
        UPDATE library_books
        SET available_copies = available_copies - 1
        WHERE id = NEW.book_id;
    END IF;

    IF TG_OP = 'UPDATE' AND NEW.return_date IS NOT NULL AND OLD.return_date IS NULL THEN
        UPDATE library_books
        SET available_copies = available_copies + 1
        WHERE id = NEW.book_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_library_book_copies
AFTER INSERT OR UPDATE ON library_transactions
FOR EACH ROW
EXECUTE FUNCTION update_library_book_copies();

-- Auto-update vehicle occupancy
CREATE OR REPLACE FUNCTION update_vehicle_occupancy()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE transport_vehicles
        SET current_occupancy = (
            SELECT COUNT(*)
            FROM student_transport st
            JOIN transport_routes tr ON st.route_id = tr.id
            WHERE tr.vehicle_id = (
                SELECT vehicle_id FROM transport_routes WHERE id = NEW.route_id
            )
            AND st.is_active = true
        )
        WHERE id = (SELECT vehicle_id FROM transport_routes WHERE id = NEW.route_id);
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vehicle_occupancy
AFTER INSERT OR UPDATE ON student_transport
FOR EACH ROW
EXECUTE FUNCTION update_vehicle_occupancy();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER trigger_schools_updated_at BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_fee_payments_updated_at BEFORE UPDATE ON fee_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Frequently queried relationships
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_class_section ON students(current_class_id, current_section_id);
CREATE INDEX idx_sections_class_year ON sections(class_id, academic_year_id);
CREATE INDEX idx_exam_marks_student_exam ON exam_marks(student_id, exam_schedule_id);
CREATE INDEX idx_fee_payments_student_year ON fee_payments(student_id, academic_year_id);
CREATE INDEX idx_staff_school_type ON staff(school_id, staff_type);
CREATE INDEX idx_library_transactions_dates ON library_transactions(issue_date, due_date, return_date);

-- Text search indexes
CREATE INDEX idx_students_name_search ON students USING gin(to_tsvector('english', first_name || ' ' || last_name));
CREATE INDEX idx_staff_name_search ON staff USING gin(to_tsvector('english', first_name || ' ' || last_name));

-- ============================================================================
-- SAMPLE DATA FOR GRADE DEFINITIONS
-- ============================================================================

-- CBSE Grading System (for classes 9-12)
INSERT INTO grade_definitions (school_id, grade, min_percentage, max_percentage, grade_points, description, display_order) VALUES
-- Will be inserted during school setup with actual school_id
-- ('{school_id}', 'A1', 91, 100, 10.0, 'Outstanding', 1),
-- ('{school_id}', 'A2', 81, 90, 9.0, 'Excellent', 2),
-- ('{school_id}', 'B1', 71, 80, 8.0, 'Very Good', 3),
-- ('{school_id}', 'B2', 61, 70, 7.0, 'Good', 4),
-- ('{school_id}', 'C1', 51, 60, 6.0, 'Fair', 5),
-- ('{school_id}', 'C2', 41, 50, 5.0, 'Average', 6),
-- ('{school_id}', 'D', 33, 40, 4.0, 'Pass', 7),
-- ('{school_id}', 'E', 0, 32, 0.0, 'Needs Improvement', 8);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE schools IS 'Master table for school branches with multi-location support';
COMMENT ON TABLE students IS 'Complete student information with academic, medical, transport details';
COMMENT ON TABLE staff IS 'Teaching and non-teaching staff with HR details';
COMMENT ON TABLE exam_marks IS 'Student marks with theory/practical split and grading';
COMMENT ON TABLE fee_payments IS 'Fee collection with multiple payment modes and gateway integration';
COMMENT ON TABLE library_transactions IS 'Library book issue/return with fine calculation';
COMMENT ON TABLE student_attendance IS 'Daily attendance with leave management';
COMMENT ON TABLE lms_courses IS 'Online learning courses with video, documents, quizzes';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
