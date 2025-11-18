-- EDUCATIONAL INSTITUTE (COACHING/TRAINING) - Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- Institute Management
CREATE TABLE institutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_name VARCHAR(255) NOT NULL,
    institute_code VARCHAR(50) UNIQUE NOT NULL,
    institute_type VARCHAR(100), -- COACHING_CENTER, VOCATIONAL_TRAINING, SKILL_DEVELOPMENT, LANGUAGE_SCHOOL
    specialization TEXT[], -- IIT_JEE, NEET, CA, UPSC, SPOKEN_ENGLISH, COMPUTER_COURSES
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    total_capacity INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id UUID REFERENCES institutes(id),
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    course_type VARCHAR(100), -- REGULAR, CRASH_COURSE, WEEKEND, ONLINE, HYBRID
    course_category VARCHAR(100), -- ACADEMIC, COMPETITIVE_EXAM, SKILL_DEVELOPMENT, LANGUAGE
    target_exam VARCHAR(255), -- IIT_JEE, NEET, UPSC, CA_FOUNDATION, etc.
    duration_months INTEGER,
    total_hours INTEGER,
    class_frequency VARCHAR(100), -- DAILY, ALTERNATE_DAYS, WEEKEND
    batch_size INTEGER DEFAULT 30,
    prerequisites TEXT,
    syllabus TEXT,
    course_fee DECIMAL(10, 2) NOT NULL,
    registration_fee DECIMAL(8, 2),
    study_material_fee DECIMAL(8, 2),
    is_online_available BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Batches
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id),
    batch_code VARCHAR(50) UNIQUE NOT NULL,
    batch_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    class_timings VARCHAR(100), -- 6AM-8AM, 5PM-7PM
    class_days TEXT[], -- MONDAY, WEDNESDAY, FRIDAY
    max_students INTEGER DEFAULT 30,
    enrolled_students INTEGER DEFAULT 0,
    available_seats INTEGER,
    batch_status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, FULL, IN_PROGRESS, COMPLETED
    created_at TIMESTAMP DEFAULT NOW()
);

-- Faculty
CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id UUID REFERENCES institutes(id),
    faculty_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    qualification VARCHAR(255),
    specialization TEXT[],
    years_of_experience INTEGER,
    subjects_taught TEXT[],
    hourly_rate DECIMAL(8, 2),
    faculty_type VARCHAR(50), -- FULL_TIME, PART_TIME, VISITING
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id UUID REFERENCES institutes(id),
    student_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    parent_name VARCHAR(255),
    parent_phone VARCHAR(20),
    educational_qualification VARCHAR(255),
    current_school_college VARCHAR(255),
    target_exam VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Enrollments
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    batch_id UUID REFERENCES batches(id),
    enrollment_number VARCHAR(50) UNIQUE NOT NULL,
    enrollment_date DATE NOT NULL,
    course_fee DECIMAL(10, 2),
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_fee DECIMAL(10, 2),
    fee_paid DECIMAL(10, 2) DEFAULT 0,
    balance_fee DECIMAL(10, 2),
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    enrollment_status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Attendance
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES enrollments(id),
    attendance_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL, -- PRESENT, ABSENT, LATE, ON_LEAVE
    marked_by UUID REFERENCES faculty(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(enrollment_id, attendance_date)
);

-- Tests/Assessments
CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id UUID REFERENCES batches(id),
    test_name VARCHAR(255) NOT NULL,
    test_type VARCHAR(50), -- WEEKLY, MONTHLY, MOCK_TEST, FINAL
    test_date DATE NOT NULL,
    total_marks DECIMAL(6, 2),
    duration_minutes INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID REFERENCES tests(id),
    student_id UUID REFERENCES students(id),
    marks_obtained DECIMAL(6, 2),
    percentage DECIMAL(5, 2),
    rank INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Fee Payments
CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES enrollments(id),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,
    amount_paid DECIMAL(10, 2),
    payment_mode VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
