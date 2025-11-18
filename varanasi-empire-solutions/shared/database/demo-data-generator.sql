-- ============================================================================
-- VARANASI EMPIRE SOLUTIONS - GENERIC DEMO DATA GENERATOR
-- Helper Functions & Procedures for All Solutions
-- Version: 1.0.0
-- ============================================================================
-- This script provides reusable functions and procedures for generating
-- realistic demo data across all 22 business solutions.
--
-- Features:
-- - Random Indian names and addresses
-- - UP-specific locations (Varanasi, Lucknow, Agra, Kanpur, etc.)
-- - Indian phone numbers (10-digit format)
-- - GST calculations
-- - Realistic timestamps
-- - Business data patterns
-- ============================================================================

-- Create schema for helper functions
CREATE SCHEMA IF NOT EXISTS demo_helpers;

-- ============================================================================
-- DATA GENERATION HELPER FUNCTIONS
-- ============================================================================

-- Function to generate random Indian phone numbers (10-digit format)
CREATE OR REPLACE FUNCTION demo_helpers.generate_phone_number()
RETURNS VARCHAR(10) AS $$
BEGIN
    RETURN LPAD((FLOOR(6 + RANDOM() * 4)::INT)::TEXT, 1, '') ||
           LPAD((FLOOR(RANDOM() * 10000000000)::BIGINT % 1000000000)::TEXT, 9, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate random email
CREATE OR REPLACE FUNCTION demo_helpers.generate_email(name_prefix VARCHAR)
RETURNS VARCHAR(255) AS $$
DECLARE
    domains TEXT[] := ARRAY['gmail.com', 'yahoo.com', 'outlook.com', 'rediffmail.com', 'hotmail.com'];
BEGIN
    RETURN LOWER(name_prefix) || FLOOR(RANDOM() * 9999)::TEXT || '@' || domains[1 + FLOOR(RANDOM() * ARRAY_LENGTH(domains, 1))];
END;
$$ LANGUAGE plpgsql;

-- Function to generate random GST number
CREATE OR REPLACE FUNCTION demo_helpers.generate_gst_number()
RETURNS VARCHAR(20) AS $$
DECLARE
    state_code VARCHAR(2);
    taxpayer_num VARCHAR(10);
BEGIN
    -- UP GST state code is 09
    state_code := '09';
    taxpayer_num := LPAD(FLOOR(RANDOM() * 9999999999)::BIGINT % 9999999999 + 1000000000, 10, '0');
    RETURN state_code || taxpayer_num || '1Z5';
END;
$$ LANGUAGE plpgsql;

-- Function to generate random PAN number
CREATE OR REPLACE FUNCTION demo_helpers.generate_pan_number()
RETURNS VARCHAR(15) AS $$
BEGIN
    RETURN SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ', FLOOR(1 + RANDOM() * 26)::INT, 1) ||
           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ', FLOOR(1 + RANDOM() * 26)::INT, 1) ||
           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ', FLOOR(1 + RANDOM() * 26)::INT, 1) ||
           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ', FLOOR(1 + RANDOM() * 26)::INT, 1) ||
           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ', FLOOR(1 + RANDOM() * 26)::INT, 1) ||
           LPAD(FLOOR(RANDOM() * 9999999)::TEXT, 7, '0') ||
           SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ', FLOOR(1 + RANDOM() * 26)::INT, 1);
END;
$$ LANGUAGE plpgsql;

-- Function to generate random Aadhaar (12-digit)
CREATE OR REPLACE FUNCTION demo_helpers.generate_aadhaar_number()
RETURNS VARCHAR(12) AS $$
BEGIN
    RETURN LPAD(FLOOR(RANDOM() * 999999999999)::BIGINT % 999999999999 + 1, 12, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- LOCATION DATA HELPERS
-- ============================================================================

-- UP Cities and districts
CREATE TABLE IF NOT EXISTS demo_helpers.up_locations (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(100),
    district VARCHAR(100),
    pincode_prefix VARCHAR(3),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_major_city BOOLEAN
);

DELETE FROM demo_helpers.up_locations;
INSERT INTO demo_helpers.up_locations (city_name, district, pincode_prefix, latitude, longitude, is_major_city) VALUES
-- Major cities
('Varanasi', 'Varanasi', '221', 25.3209, 82.9789, TRUE),
('Lucknow', 'Lucknow', '226', 26.8467, 80.9462, TRUE),
('Agra', 'Agra', '282', 27.1767, 78.0081, TRUE),
('Kanpur', 'Kanpur', '208', 26.4499, 80.3319, TRUE),
('Meerut', 'Meerut', '250', 28.9845, 77.7064, TRUE),
('Allahabad', 'Prayagraj', '211', 25.4358, 81.8463, TRUE),

-- Tier 2 cities
('Ghaziabad', 'Ghaziabad', '201', 28.6692, 77.4538, FALSE),
('Noida', 'Gautam Budh Nagar', '201', 28.5921, 77.3854, FALSE),
('Mathura', 'Mathura', '281', 27.4924, 77.6737, FALSE),
('Vrindavan', 'Mathura', '281', 27.5769, 77.2789, FALSE),
('Jhansi', 'Jhansi', '284', 25.4484, 78.5685, FALSE),
('Gwalior', 'Gwalior', '474', 26.2183, 78.1629, FALSE),
('Bareilly', 'Bareilly', '243', 28.3670, 79.4304, FALSE),
('Moradabad', 'Moradabad', '244', 28.8386, 79.2033, FALSE),
('Saharanpur', 'Saharanpur', '247', 29.9667, 77.5500, FALSE),
('Aligarh', 'Aligarh', '202', 27.8974, 77.8974, FALSE);

-- Function to get random UP location
CREATE OR REPLACE FUNCTION demo_helpers.get_random_location()
RETURNS TABLE(city_name VARCHAR, district VARCHAR, pincode_prefix VARCHAR, latitude DECIMAL, longitude DECIMAL) AS $$
BEGIN
    RETURN QUERY
    SELECT l.city_name, l.district, l.pincode_prefix, l.latitude, l.longitude
    FROM demo_helpers.up_locations l
    ORDER BY RANDOM()
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- NAMES GENERATORS - INDIAN NAMES
-- ============================================================================

CREATE TABLE IF NOT EXISTS demo_helpers.first_names_male (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS demo_helpers.first_names_female (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS demo_helpers.last_names (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

DELETE FROM demo_helpers.first_names_male;
INSERT INTO demo_helpers.first_names_male (name) VALUES
('Rajesh'), ('Amit'), ('Vikram'), ('Arun'), ('Sanjay'),
('Manoj'), ('Suresh'), ('Rohan'), ('Arjun'), ('Karan'),
('Nitin'), ('Deepak'), ('Anand'), ('Harsh'), ('Gaurav'),
('Ashok'), ('Ravi'), ('Santosh'), ('Naresh'), ('Bhavesh'),
('Yogesh'), ('Pradeep'), ('Akshay'), ('Varun'), ('Inder'),
('Praveen'), ('Shailesh'), ('Umesh'), ('Jagdish'), ('Mahesh'),
('Rakesh'), ('Devendra'), ('Sanjeev'), ('Vishal'), ('Sachin'),
('Abhishek'), ('Ajay'), ('Anubhav'), ('Arpit'), ('Ashish'),
('Gautam'), ('Harish'), ('Hemant'), ('Jaideep'), ('Jatin');

DELETE FROM demo_helpers.first_names_female;
INSERT INTO demo_helpers.first_names_female (name) VALUES
('Priya'), ('Anjali'), ('Neha'), ('Sneha'), ('Pooja'),
('Divya'), ('Sheetal'), ('Kavya'), ('Isha'), ('Meera'),
('Radha'), ('Savita'), ('Anita'), ('Sapna'), ('Sunita'),
('Richa'), ('Nikita'), ('Swati'), ('Tanvi'), ('Usha'),
('Vandana'), ('Deepti'), ('Seema'), ('Amrita'), ('Arpita'),
('Bhavna'), ('Chanchal'), ('Disha'), ('Eka'), ('Farida'),
('Gauri'), ('Harshita'), ('Indu'), ('Jagdish'), ('Jaya'),
('Kalpana'), ('Lalita'), ('Madhavi'), ('Namita'), ('Parvati'),
('Renu'), ('Sharma'), ('Tara'), ('Uma'), ('Veda');

DELETE FROM demo_helpers.last_names;
INSERT INTO demo_helpers.last_names (name) VALUES
('Singh'), ('Kumar'), ('Sharma'), ('Patel'), ('Gupta'),
('Verma'), ('Rao'), ('Nair'), ('Reddy'), ('Mishra'),
('Pandey'), ('Yadav'), ('Trivedi'), ('Chaudhary'), ('Agarwal'),
('Desai'), ('Joshi'), ('Iyer'), ('Menon'), ('Srivastava'),
('Bhat'), ('Kulkarni'), ('Rao'), ('Ghosh'), ('Banerjee'),
('Das'), ('Dey'), ('Roy'), ('Sen'), ('Mukherjee'),
('Kapoor'), ('Malhotra'), ('Chopra'), ('Bhatia'), ('Sethi'),
('Taneja'), ('Ahuja'), ('Garg'), ('Goyal'), ('Sharma'),
('Saxena'), ('Mittal'), ('Arora'), ('Daga'), ('Jain');

-- Function to generate random Indian male name
CREATE OR REPLACE FUNCTION demo_helpers.get_random_male_name()
RETURNS VARCHAR(100) AS $$
DECLARE
    first_name VARCHAR(50);
    last_name VARCHAR(50);
BEGIN
    SELECT name INTO first_name FROM demo_helpers.first_names_male ORDER BY RANDOM() LIMIT 1;
    SELECT name INTO last_name FROM demo_helpers.last_names ORDER BY RANDOM() LIMIT 1;
    RETURN first_name || ' ' || last_name;
END;
$$ LANGUAGE plpgsql;

-- Function to generate random Indian female name
CREATE OR REPLACE FUNCTION demo_helpers.get_random_female_name()
RETURNS VARCHAR(100) AS $$
DECLARE
    first_name VARCHAR(50);
    last_name VARCHAR(50);
BEGIN
    SELECT name INTO first_name FROM demo_helpers.first_names_female ORDER BY RANDOM() LIMIT 1;
    SELECT name INTO last_name FROM demo_helpers.last_names ORDER BY RANDOM() LIMIT 1;
    RETURN first_name || ' ' || last_name;
END;
$$ LANGUAGE plpgsql;

-- Function to generate random name (can be male or female)
CREATE OR REPLACE FUNCTION demo_helpers.get_random_name()
RETURNS VARCHAR(100) AS $$
BEGIN
    CASE FLOOR(RANDOM() * 2)
        WHEN 0 THEN RETURN demo_helpers.get_random_male_name();
        ELSE RETURN demo_helpers.get_random_female_name();
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STREET ADDRESSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS demo_helpers.street_prefixes (
    id SERIAL PRIMARY KEY,
    prefix VARCHAR(50)
);

DELETE FROM demo_helpers.street_prefixes;
INSERT INTO demo_helpers.street_prefixes (prefix) VALUES
('Raja'), ('Mahatma'), ('Netaji'), ('Gopal'), ('Ashoka'),
('Tilak'), ('Kali'), ('Bhagat'), ('Raj'), ('Mohan'),
('Raviwar'), ('Somwar'), ('Mangalwar'), ('Budhwar'), ('Guruwar'),
('Shukravar'), ('Shanivar'), ('Vikhyat'), ('Vyaspuri'), ('Anand'),
('Durga'), ('Krishna'), ('Radha'), ('Shiva'), ('Parvati');

-- Function to generate random address
CREATE OR REPLACE FUNCTION demo_helpers.generate_address(city VARCHAR)
RETURNS TEXT AS $$
DECLARE
    address_line1 TEXT;
    street_no INT;
    street_type VARCHAR(20);
    area VARCHAR(100);
BEGIN
    street_no := FLOOR(1 + RANDOM() * 500)::INT;
    street_type := CASE FLOOR(RANDOM() * 4)
        WHEN 0 THEN 'Road'
        WHEN 1 THEN 'Street'
        WHEN 2 THEN 'Lane'
        ELSE 'Marg'
    END;

    -- Generate area-like name
    area := CASE FLOOR(RANDOM() * 5)
        WHEN 0 THEN 'Nagar'
        WHEN 1 THEN 'Puri'
        WHEN 2 THEN 'Vihar'
        WHEN 3 THEN 'Colony'
        ELSE 'Garden'
    END;

    address_line1 := street_no || ' ' || 'Gupta' || ' ' || street_type || ', ' || area || ', ' || city;
    RETURN address_line1;
END;
$$ LANGUAGE plpgsql;

-- Function to generate pincode based on city
CREATE OR REPLACE FUNCTION demo_helpers.generate_pincode(city VARCHAR)
RETURNS VARCHAR(10) AS $$
DECLARE
    prefix VARCHAR(3);
BEGIN
    SELECT pincode_prefix INTO prefix FROM demo_helpers.up_locations
    WHERE city_name = city LIMIT 1;

    IF prefix IS NULL THEN
        prefix := '226'; -- Default to Lucknow
    END IF;

    RETURN prefix || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- BUSINESS DATA GENERATORS
-- ============================================================================

-- Function to generate business registration number
CREATE OR REPLACE FUNCTION demo_helpers.generate_business_reg_number(prefix VARCHAR)
RETURNS VARCHAR(50) AS $$
BEGIN
    RETURN prefix || '-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' ||
           LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to calculate GST on amount
CREATE OR REPLACE FUNCTION demo_helpers.calculate_gst(amount DECIMAL, gst_rate DECIMAL DEFAULT 18.0)
RETURNS DECIMAL AS $$
BEGIN
    RETURN (amount * gst_rate / 100)::DECIMAL(10, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to generate realistic order number
CREATE OR REPLACE FUNCTION demo_helpers.generate_order_number(location_code VARCHAR)
RETURNS VARCHAR(30) AS $$
BEGIN
    RETURN 'ORD-' || location_code || '-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' ||
           LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION demo_helpers.generate_invoice_number(prefix VARCHAR)
RETURNS VARCHAR(50) AS $$
BEGIN
    RETURN prefix || '/' || TO_CHAR(CURRENT_DATE, 'YYYY') || '/' ||
           LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to get random past date within last X days
CREATE OR REPLACE FUNCTION demo_helpers.get_random_past_date(days_back INT DEFAULT 30)
RETURNS DATE AS $$
BEGIN
    RETURN CURRENT_DATE - (FLOOR(RANDOM() * days_back)::INT);
END;
$$ LANGUAGE plpgsql;

-- Function to get random past timestamp within last X days
CREATE OR REPLACE FUNCTION demo_helpers.get_random_past_timestamp(days_back INT DEFAULT 30)
RETURNS TIMESTAMP AS $$
BEGIN
    RETURN CURRENT_TIMESTAMP - (FLOOR(RANDOM() * days_back * 24 * 60)::INT || ' minutes')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- BULK INSERT HELPER FUNCTIONS
-- ============================================================================

-- Function to generate random decimal price between min and max
CREATE OR REPLACE FUNCTION demo_helpers.generate_price(min_price DECIMAL, max_price DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    RETURN (min_price + RANDOM() * (max_price - min_price))::DECIMAL(10, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to generate random quantity
CREATE OR REPLACE FUNCTION demo_helpers.generate_quantity(min_qty INT DEFAULT 1, max_qty INT DEFAULT 10)
RETURNS INT AS $$
BEGIN
    RETURN FLOOR(min_qty + RANDOM() * (max_qty - min_qty + 1))::INT;
END;
$$ LANGUAGE plpgsql;

-- Function to generate random percentage
CREATE OR REPLACE FUNCTION demo_helpers.generate_percentage(min_pct DECIMAL DEFAULT 0, max_pct DECIMAL DEFAULT 100)
RETURNS DECIMAL AS $$
BEGIN
    RETURN (min_pct + RANDOM() * (max_pct - min_pct))::DECIMAL(5, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to generate random status from array
CREATE OR REPLACE FUNCTION demo_helpers.get_random_status(statuses TEXT[])
RETURNS VARCHAR AS $$
BEGIN
    RETURN statuses[1 + FLOOR(RANDOM() * ARRAY_LENGTH(statuses, 1))::INT];
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to format Indian currency
CREATE OR REPLACE FUNCTION demo_helpers.format_inr(amount DECIMAL)
RETURNS VARCHAR AS $$
BEGIN
    RETURN '₹' || TO_CHAR(amount, '9,99,99,999.00');
END;
$$ LANGUAGE plpgsql;

-- Function to get age from date of birth
CREATE OR REPLACE FUNCTION demo_helpers.calculate_age(dob DATE)
RETURNS INT AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(dob))::INT;
END;
$$ LANGUAGE plpgsql;

-- Function to check if day is weekend
CREATE OR REPLACE FUNCTION demo_helpers.is_weekend(day DATE)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXTRACT(DOW FROM day) IN (0, 6);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- END OF DEMO DATA GENERATOR
-- ============================================================================

-- Summary
SELECT 'Demo Data Generator initialized successfully!' AS status;
SELECT COUNT(*) AS "UP Locations" FROM demo_helpers.up_locations;
SELECT COUNT(*) AS "Male Names" FROM demo_helpers.first_names_male;
SELECT COUNT(*) AS "Female Names" FROM demo_helpers.first_names_female;
SELECT COUNT(*) AS "Last Names" FROM demo_helpers.last_names;
