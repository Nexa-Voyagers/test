-- ARTS & CRAFTS STUDIO - Complete Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE studios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    specialization TEXT[], -- PAINTING, POTTERY, SCULPTURE, HANDICRAFTS
    total_capacity INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE instructors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id),
    instructor_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    specialization TEXT[],
    qualification VARCHAR(255),
    years_of_experience INTEGER,
    hourly_rate DECIMAL(8, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id),
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    course_type VARCHAR(100), -- BEGINNER, INTERMEDIATE, ADVANCED, KIDS
    art_form VARCHAR(100), -- PAINTING, POTTERY, SCULPTURE, CRAFT
    duration_weeks INTEGER,
    sessions_per_week INTEGER,
    total_sessions INTEGER,
    class_size INTEGER DEFAULT 10,
    course_fee DECIMAL(10, 2),
    material_fee DECIMAL(8, 2),
    course_description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id),
    instructor_id UUID REFERENCES instructors(id),
    batch_code VARCHAR(50) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    class_days TEXT[],
    class_time VARCHAR(100),
    max_students INTEGER,
    enrolled_students INTEGER DEFAULT 0,
    batch_status VARCHAR(50) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id),
    student_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    date_of_birth DATE,
    parent_name VARCHAR(255),
    parent_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    batch_id UUID REFERENCES batches(id),
    enrollment_number VARCHAR(50) UNIQUE NOT NULL,
    enrollment_date DATE NOT NULL,
    course_fee DECIMAL(10, 2),
    material_fee DECIMAL(8, 2),
    total_fee DECIMAL(10, 2),
    fee_paid DECIMAL(10, 2) DEFAULT 0,
    balance_fee DECIMAL(10, 2),
    enrollment_status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE materials_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id),
    material_name VARCHAR(255) NOT NULL,
    material_category VARCHAR(100), -- PAINT, BRUSH, CANVAS, CLAY, TOOLS
    unit VARCHAR(50),
    current_stock DECIMAL(10, 2) DEFAULT 0,
    min_stock_level DECIMAL(10, 2),
    unit_cost DECIMAL(8, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id),
    student_id UUID REFERENCES students(id),
    artwork_title VARCHAR(255),
    art_form VARCHAR(100),
    dimensions VARCHAR(100),
    materials_used TEXT[],
    completion_date DATE,
    artwork_image_url VARCHAR(500),
    is_for_sale BOOLEAN DEFAULT false,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE gallery_exhibitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studio_id UUID REFERENCES studios(id),
    exhibition_name VARCHAR(255) NOT NULL,
    exhibition_date DATE NOT NULL,
    venue VARCHAR(255),
    artworks_displayed UUID[],
    created_at TIMESTAMP DEFAULT NOW()
);
