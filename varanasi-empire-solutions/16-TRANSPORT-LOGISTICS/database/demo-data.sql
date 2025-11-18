-- ============================================================================
-- TRANSPORT & LOGISTICS - COMPREHENSIVE DEMO DATA
-- Varanasi Empire Solution
-- ============================================================================

-- Insert transport companies (2-3 companies)
INSERT INTO transport_companies (company_name, gstin, pan_number, address, phone, email, total_vehicles, is_active)
VALUES
('Varanasi Express Logistics', '09ABCDE1234F1Z5', 'ABCDE1234F', '145 Industrial Area, Varanasi', '9876543601', 'info@varanaslogistics.com', 35, true),
('Northern Route Carriers', '09BCDEF2345G1Z5', 'BCDEF2345G', '221 Market Road, Lucknow', '9876543602', 'contact@northernroute.com', 28, true),
('Uttar Pradesh Transport Network', '09CDEFG3456H1Z5', 'CDEFG3456H', '456 Trade Zone, Kanpur', '9876543603', 'support@upnetwork.com', 42, true);

-- Insert vehicles (30+ vehicles)
INSERT INTO vehicles (company_id, vehicle_number, vehicle_type, vehicle_model, capacity_tons, ownership_type, driver_name, driver_phone, driver_license_number, driver_license_expiry, registration_expiry, insurance_expiry, permit_expiry, fitness_certificate_expiry, last_service_date, gps_device_id, has_gps_tracking, vehicle_status, is_active)
WITH company_ids AS (
  SELECT id, company_name FROM transport_companies
),
driver_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn,
         (ARRAY['UP-01-AB-0001', 'UP-01-AB-0002', 'UP-01-AB-0003', 'UP-01-AB-0004', 'UP-01-AB-0005', 'UP-01-AB-0006',
                 'UP-01-AB-0007', 'UP-01-AB-0008', 'UP-01-AB-0009', 'UP-01-AB-0010', 'UP-01-AB-0011', 'UP-01-AB-0012',
                 'UP-01-AC-0013', 'UP-01-AC-0014', 'UP-01-AC-0015', 'UP-01-AC-0016', 'UP-01-AC-0017', 'UP-01-AC-0018',
                 'UP-01-AC-0019', 'UP-01-AC-0020', 'UP-01-AC-0021', 'UP-01-AC-0022', 'UP-01-AC-0023', 'UP-01-AC-0024',
                 'UP-01-AD-0025', 'UP-01-AD-0026', 'UP-01-AD-0027', 'UP-01-AD-0028', 'UP-01-AD-0029', 'UP-01-AD-0030',
                 'UP-01-AD-0031', 'UP-01-AD-0032', 'UP-01-AD-0033', 'UP-01-AD-0034', 'UP-01-AD-0035', 'UP-01-AD-0036'])[rn] as vehicle_no,
         (ARRAY['Rajesh Singh', 'Vikram Kumar', 'Arun Sharma', 'Suresh Yadav', 'Deepak Mishra', 'Amit Pandey',
                 'Bhavesh Patel', 'Chirag Verma', 'Devendra Singh', 'Harsh Gupta', 'Inder Kumar', 'Jaideep Rao',
                 'Karan Singh', 'Lokesh Pandey', 'Manish Sharma', 'Nitin Yadav', 'Omkar Mishra', 'Prakash Kumar',
                 'Rajesh Verma', 'Sandeep Singh', 'Tushar Patel', 'Umesh Yadav', 'Vikram Singh', 'Warun Kumar',
                 'Yogesh Sharma', 'Zarina Khan', 'Aarav Patel', 'Bhavna Singh', 'Chetan Yadav', 'Dinesh Kumar',
                 'Eshan Sharma', 'Faisal Siddiqui', 'Gaurav Singh', 'Hemant Pandey', 'Imran Khan', 'Jagdish Mishra'])[rn] as driver_name,
         '987654' || LPAD(rn::TEXT, 4, '0') as driver_phone
  FROM generate_series(1, 36) s(i)
)
SELECT
  CASE
    WHEN dd.rn <= 12 THEN (SELECT id FROM company_ids WHERE company_name = 'Varanasi Express Logistics')
    WHEN dd.rn <= 24 THEN (SELECT id FROM company_ids WHERE company_name = 'Northern Route Carriers')
    ELSE (SELECT id FROM company_ids WHERE company_name = 'Uttar Pradesh Transport Network')
  END,
  dd.vehicle_no,
  (ARRAY['TRUCK', 'TRUCK', 'TRUCK', 'TEMPO', 'MINI_TRUCK', 'CONTAINER'])[1 + FLOOR(RANDOM() * 6)::INT],
  (ARRAY['Tata 407', 'Tata 709', 'Ashok Leyland AL-30', 'Mahindra Bolero Pik-up', 'Force Tempo Traveller', 'Isuzu D-Max'])[1 + FLOOR(RANDOM() * 6)::INT],
  CASE
    WHEN (ARRAY['TRUCK', 'TRUCK', 'TRUCK', 'TEMPO', 'MINI_TRUCK', 'CONTAINER'])[1 + FLOOR(RANDOM() * 6)::INT] = 'TRUCK' THEN FLOOR(RANDOM() * 8 + 5)::DECIMAL(6,2)
    WHEN (ARRAY['TRUCK', 'TRUCK', 'TRUCK', 'TEMPO', 'MINI_TRUCK', 'CONTAINER'])[1 + FLOOR(RANDOM() * 6)::INT] = 'TEMPO' THEN FLOOR(RANDOM() * 2 + 3)::DECIMAL(6,2)
    ELSE FLOOR(RANDOM() * 4 + 2)::DECIMAL(6,2)
  END,
  (ARRAY['OWNED', 'OWNED', 'LEASED'])[1 + FLOOR(RANDOM() * 3)::INT],
  dd.driver_name,
  dd.driver_phone,
  'DL-UP-' || LPAD((1000 + dd.rn)::TEXT, 5, '0'),
  CURRENT_DATE + (365 + FLOOR(RANDOM() * 365)::INT)::INTERVAL,
  CURRENT_DATE + (30 + FLOOR(RANDOM() * 365)::INT)::INTERVAL,
  CURRENT_DATE + (60 + FLOOR(RANDOM() * 365)::INT)::INTERVAL,
  CURRENT_DATE + (90 + FLOOR(RANDOM() * 365)::INT)::INTERVAL,
  CURRENT_DATE + (120 + FLOOR(RANDOM() * 365)::INT)::INTERVAL,
  CURRENT_DATE - FLOOR(RANDOM() * 30)::INT,
  'GPS-' || LPAD(dd.rn::TEXT, 4, '0'),
  (RANDOM() > 0.2),
  (ARRAY['AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'IN_USE', 'MAINTENANCE'])[1 + FLOOR(RANDOM() * 6)::INT],
  true
FROM driver_data dd;

-- Insert customers (20+ customers)
INSERT INTO customers (customer_code, customer_type, first_name, last_name, company_name, phone, email, gstin, address, city, is_active)
VALUES
('CUST-001', 'CORPORATE', NULL, NULL, 'Varanasi Cotton Mills', '9876543701', 'logistics@cotton.in', '09ABCD1234E1Z5', '145 Industrial Area, Varanasi', 'Varanasi', true),
('CUST-002', 'CORPORATE', NULL, NULL, 'Lucknow Food Products', '9876543702', 'supply@lfp.com', '09BCDE2345F1Z5', '221 Trade Center, Lucknow', 'Lucknow', true),
('CUST-003', 'CORPORATE', NULL, NULL, 'Kanpur Textiles Ltd', '9876543703', 'procurement@kantex.in', '09CDEF3456G1Z5', '456 Market Road, Kanpur', 'Kanpur', true),
('CUST-004', 'INDIVIDUAL', 'Rajesh', 'Patel', NULL, '9876543704', 'rajesh@email.com', NULL, '101 Ghat Road, Varanasi', 'Varanasi', true),
('CUST-005', 'CORPORATE', NULL, NULL, 'UP Spices Export', '9876543705', 'export@upspices.in', '09DEFG4567H1Z5', '567 Export Zone, Agra', 'Agra', true),
('CUST-006', 'CORPORATE', NULL, NULL, 'Jaunpur Paper Industries', '9876543706', 'distribution@jpaper.com', '09EFGH5678I1Z5', '789 Industrial Park, Jaunpur', 'Jaunpur', true),
('CUST-007', 'INDIVIDUAL', 'Vikram', 'Singh', NULL, '9876543707', 'vikram@email.com', NULL, '102 Maidagin, Varanasi', 'Varanasi', true),
('CUST-008', 'CORPORATE', NULL, NULL, 'Allahabad Pharmaceuticals', '9876543708', 'supply@apharma.com', '09FGHI6789J1Z5', '890 Medical Zone, Allahabad', 'Allahabad', true),
('CUST-009', 'CORPORATE', NULL, NULL, 'Ghazipur Dairy Cooperative', '9876543709', 'logistics@gdcoop.in', '09GHIJ7890K1Z5', '101 Dairy Complex, Ghazipur', 'Ghazipur', true),
('CUST-010', 'INDIVIDUAL', 'Arun', 'Kumar', NULL, '9876543710', 'arun@email.com', NULL, '103 Sigra, Varanasi', 'Varanasi', true),
('CUST-011', 'CORPORATE', NULL, NULL, 'Varanasi Handicrafts Exports', '9876543711', 'shipping@vhcrafts.in', '09HIJK8901L1Z5', '104 Craft Village, Varanasi', 'Varanasi', true),
('CUST-012', 'CORPORATE', NULL, NULL, 'Northern Steel Industries', '9876543712', 'supply@nsteel.com', '09IJKL9012M1Z5', '105 Steel Complex, Kanpur', 'Kanpur', true),
('CUST-013', 'INDIVIDUAL', 'Deepak', 'Sharma', NULL, '9876543713', 'deepak@email.com', NULL, '106 Varuna Nagar, Varanasi', 'Varanasi', true),
('CUST-014', 'CORPORATE', NULL, NULL, 'Lucknow Apparel Ltd', '9876543714', 'orders@lapparel.com', '09JKLM0123N1Z5', '107 Fashion Hub, Lucknow', 'Lucknow', true),
('CUST-015', 'CORPORATE', NULL, NULL, 'Agra Marble Exports', '9876543715', 'dispatch@amarble.in', '09KLMN1234O1Z5', '108 Stone Quarry, Agra', 'Agra', true),
('CUST-016', 'INDIVIDUAL', 'Suresh', 'Yadav', NULL, '9876543716', 'suresh@email.com', NULL, '109 Anand Nagar, Varanasi', 'Varanasi', true),
('CUST-017', 'CORPORATE', NULL, NULL, 'UP Beverages Inc', '9876543717', 'supply@upbev.com', '09LMNO2345P1Z5', '110 Beverage Plant, Lucknow', 'Lucknow', true),
('CUST-018', 'CORPORATE', NULL, NULL, 'Varanasi Brocade Industries', '9876543718', 'export@vbrocade.in', '09MNOP3456Q1Z5', '111 Silk Zone, Varanasi', 'Varanasi', true),
('CUST-019', 'INDIVIDUAL', 'Neha', 'Patel', NULL, '9876543719', 'neha@email.com', NULL, '112 Ghat Extension, Varanasi', 'Varanasi', true),
('CUST-020', 'CORPORATE', NULL, NULL, 'Meerut Engineering Works', '9876543720', 'logistics@meereng.com', '09NOPQ4567R1Z5', '113 Engineering Zone, Meerut', 'Meerut', true);

-- Insert consignments (40-50 shipments)
INSERT INTO consignments (company_id, customer_id, consignment_number, booking_date, pickup_location, pickup_city, pickup_pincode, delivery_location, delivery_city, delivery_pincode, goods_description, number_of_packages, total_weight_kg, declared_value, packaging_type, freight_charges, loading_charges, unloading_charges, gst_amount, total_amount, payment_mode, payment_status, expected_delivery_date, current_status, current_location)
WITH consign_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn
  FROM generate_series(1, 50) s
)
SELECT
  (SELECT id FROM transport_companies ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM customers ORDER BY RANDOM() LIMIT 1),
  'CONS-' || LPAD(cd.rn::TEXT, 6, '0'),
  CURRENT_TIMESTAMP - (cd.rn * INTERVAL '12 hours'),
  '145 ' || (ARRAY['Industrial Area', 'Market Road', 'Trade Zone', 'Export Center', 'Warehouse'])[1 + FLOOR(RANDOM() * 5)::INT] || ', Varanasi',
  'Varanasi',
  '221001',
  '221 ' || (ARRAY['Industrial Park', 'Business District', 'Shipping Center', 'Distribution Hub', 'Logistics Zone'])[1 + FLOOR(RANDOM() * 5)::INT] || ', ' || (ARRAY['Lucknow', 'Kanpur', 'Agra', 'Allahabad'])[1 + FLOOR(RANDOM() * 4)::INT],
  (ARRAY['Lucknow', 'Kanpur', 'Agra', 'Allahabad'])[1 + FLOOR(RANDOM() * 4)::INT],
  CASE WHEN (ARRAY['Lucknow', 'Kanpur', 'Agra', 'Allahabad'])[1 + FLOOR(RANDOM() * 4)::INT] = 'Lucknow' THEN '226001'
       WHEN (ARRAY['Lucknow', 'Kanpur', 'Agra', 'Allahabad'])[1 + FLOOR(RANDOM() * 4)::INT] = 'Kanpur' THEN '208001'
       WHEN (ARRAY['Lucknow', 'Kanpur', 'Agra', 'Allahabad'])[1 + FLOOR(RANDOM() * 4)::INT] = 'Agra' THEN '282001'
       ELSE '211001' END,
  (ARRAY['Textiles & Garments', 'Agricultural Products', 'Industrial Equipment', 'Electronics', 'Food & Beverages', 'Handicrafts', 'Chemicals', 'Raw Materials'])[1 + FLOOR(RANDOM() * 8)::INT],
  FLOOR(RANDOM() * 100 + 10)::INT,
  FLOOR(RANDOM() * 5000 + 500)::DECIMAL(10,2),
  FLOOR(RANDOM() * 500000 + 100000)::DECIMAL(12,2),
  (ARRAY['Carton Box', 'Wooden Crate', 'Plastic Container', 'Bags', 'Pallets'])[1 + FLOOR(RANDOM() * 5)::INT],
  FLOOR(RANDOM() * 2000 + 500)::DECIMAL(10,2),
  FLOOR(RANDOM() * 500 + 100)::DECIMAL(8,2),
  FLOOR(RANDOM() * 500 + 100)::DECIMAL(8,2),
  (FLOOR(RANDOM() * 2000 + 500) * 0.18)::DECIMAL(10,2),
  (FLOOR(RANDOM() * 2000 + 500) + FLOOR(RANDOM() * 500 + 100) + FLOOR(RANDOM() * 500 + 100) + (FLOOR(RANDOM() * 2000 + 500) * 0.18))::DECIMAL(10,2),
  (ARRAY['TO_PAY', 'TO_PAY', 'PAID'])[1 + FLOOR(RANDOM() * 3)::INT],
  (ARRAY['PENDING', 'PENDING', 'PAID'])[1 + FLOOR(RANDOM() * 3)::INT],
  CURRENT_DATE + (FLOOR(RANDOM() * 5) + 2)::INTERVAL,
  (ARRAY['BOOKED', 'IN_TRANSIT', 'DELIVERED', 'DELIVERED'])[1 + FLOOR(RANDOM() * 4)::INT],
  (ARRAY['Varanasi', 'En Route - Lucknow Highway', 'En Route - Kanpur Highway', 'Lucknow Distribution Center', 'Delivered'])[1 + FLOOR(RANDOM() * 5)::INT]
FROM consign_data cd;

-- Insert trips
INSERT INTO trips (vehicle_id, trip_number, trip_date, from_location, to_location, distance_km, trip_status)
SELECT
  v.id,
  'TRIP-' || LPAD(ROW_NUMBER() OVER (ORDER BY v.id)::TEXT, 6, '0'),
  CURRENT_DATE - (ROW_NUMBER() OVER (ORDER BY v.id) * 1),
  (ARRAY['Varanasi', 'Lucknow', 'Kanpur', 'Agra'])[1 + FLOOR(RANDOM() * 4)::INT],
  (ARRAY['Lucknow', 'Kanpur', 'Agra', 'Allahabad'])[1 + FLOOR(RANDOM() * 4)::INT],
  FLOOR(RANDOM() * 200 + 50)::DECIMAL(8,2),
  (ARRAY['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'COMPLETED'])[1 + FLOOR(RANDOM() * 4)::INT]
FROM vehicles v
LIMIT 50;

-- Insert vehicle expenses (fuel, maintenance, toll)
INSERT INTO vehicle_expenses (vehicle_id, expense_date, expense_type, amount, description)
SELECT
  v.id,
  CURRENT_DATE - (ROW_NUMBER() OVER (ORDER BY v.id) * 2),
  (ARRAY['FUEL', 'FUEL', 'MAINTENANCE', 'TOLL', 'PERMIT'])[1 + FLOOR(RANDOM() * 5)::INT],
  CASE
    WHEN (ARRAY['FUEL', 'FUEL', 'MAINTENANCE', 'TOLL', 'PERMIT'])[1 + FLOOR(RANDOM() * 5)::INT] = 'FUEL' THEN FLOOR(RANDOM() * 3000 + 1000)::DECIMAL(10,2)
    WHEN (ARRAY['FUEL', 'FUEL', 'MAINTENANCE', 'TOLL', 'PERMIT'])[1 + FLOOR(RANDOM() * 5)::INT] = 'MAINTENANCE' THEN FLOOR(RANDOM() * 5000 + 1000)::DECIMAL(10,2)
    WHEN (ARRAY['FUEL', 'FUEL', 'MAINTENANCE', 'TOLL', 'PERMIT'])[1 + FLOOR(RANDOM() * 5)::INT] = 'TOLL' THEN FLOOR(RANDOM() * 500 + 100)::DECIMAL(10,2)
    ELSE FLOOR(RANDOM() * 2000 + 500)::DECIMAL(10,2)
  END,
  'Routine expense'
FROM vehicles v
WHERE RANDOM() < 0.8;

-- Summary
SELECT 'Transport & Logistics Demo Data Loaded Successfully!' AS Status;
SELECT COUNT(*) AS "Total Vehicles" FROM vehicles;
SELECT COUNT(*) AS "Total Consignments" FROM consignments;
SELECT COUNT(*) AS "Total Trips" FROM trips;
SELECT COUNT(*) AS "Total Vehicle Expenses" FROM vehicle_expenses;
