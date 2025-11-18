-- ============================================================================
-- FOOD PRODUCTION & DISTRIBUTION - COMPREHENSIVE DEMO DATA
-- Varanasi Empire Solution
-- ============================================================================

-- Insert production units (2-3 units)
INSERT INTO production_units (unit_name, unit_code, unit_type, fssai_license_number, address, city, capacity_per_day, is_active)
VALUES
('Varanasi Central Processing Unit', 'CPU-001', 'MANUFACTURING', 'FSSAI-UP09-2020-12345', '145 Industrial Area, Varanasi', 'Varanasi', 5000.00, true),
('Lucknow Fresh Foods Unit', 'CPU-002', 'PROCESSING', 'FSSAI-UP09-2021-54321', '221 Food Park, Lucknow', 'Lucknow', 3000.00, true),
('Kanpur Packaging Unit', 'CPU-003', 'PACKAGING', 'FSSAI-UP09-2021-98765', '456 Industrial Zone, Kanpur', 'Kanpur', 2000.00, true);

-- Insert products (15-20 products)
INSERT INTO products (product_code, product_name, product_category, unit_of_measure, shelf_life_days, storage_temperature, manufacturing_cost, selling_price, is_active)
VALUES
('PROD-001', 'Organic Wheat Flour', 'Dry Goods', 'KG', 365, 'Room Temperature', 45.00, 65.00, true),
('PROD-002', 'Refined Sunflower Oil', 'Oils & Ghee', 'LITER', 180, 'Room Temperature', 180.00, 220.00, true),
('PROD-003', 'Spice Blend Mix', 'Spices', 'KG', 365, 'Cool & Dry', 120.00, 180.00, true),
('PROD-004', 'Organic Rice Flakes', 'Cereals', 'KG', 365, 'Room Temperature', 55.00, 85.00, true),
('PROD-005', 'Desi Ghee (Pure)', 'Oils & Ghee', 'KG', 360, 'Cool Place', 900.00, 1200.00, true),
('PROD-006', 'Honey Raw', 'Condiments', 'KG', 730, 'Room Temperature', 250.00, 350.00, true),
('PROD-007', 'Pickled Vegetables', 'Preserves', 'KG', 180, 'Room Temperature', 80.00, 120.00, true),
('PROD-008', 'Organic Moong Dal', 'Pulses', 'KG', 365, 'Room Temperature', 65.00, 95.00, true),
('PROD-009', 'Mango Pulp', 'Beverages', 'LITER', 90, '0-4°C', 85.00, 130.00, true),
('PROD-010', 'Tomato Sauce', 'Condiments', 'KG', 270, 'Room Temperature', 45.00, 75.00, true),
('PROD-011', 'Pappad (Dry)', 'Snacks', 'KG', 365, 'Cool & Dry', 120.00, 180.00, true),
('PROD-012', 'Mixed Nuts', 'Snacks', 'KG', 180, 'Cool & Dry', 350.00, 450.00, true),
('PROD-013', 'Paneer (Fresh)', 'Dairy', 'KG', 7, '0-4°C', 180.00, 280.00, true),
('PROD-014', 'Yogurt Plain', 'Dairy', 'LITER', 14, '0-4°C', 40.00, 60.00, true),
('PROD-015', 'Butter (Unsalted)', 'Dairy', 'KG', 30, '0-4°C', 320.00, 420.00, true),
('PROD-016', 'Ready Mix Cake', 'Baking', 'KG', 180, 'Room Temperature', 65.00, 95.00, true),
('PROD-017', 'Vegetable Soup Mix', 'Soups', 'KG', 270, 'Room Temperature', 75.00, 110.00, true),
('PROD-018', 'Instant Noodles', 'Snacks', 'PACK', 360, 'Room Temperature', 15.00, 25.00, true),
('PROD-019', 'Organic Jaggery', 'Sweeteners', 'KG', 365, 'Room Temperature', 65.00, 95.00, true),
('PROD-020', 'Roasted Chickpeas', 'Snacks', 'KG', 180, 'Cool & Dry', 85.00, 130.00, true);

-- Insert production batches (40-50 batches)
INSERT INTO production_batches (unit_id, product_id, batch_number, production_date, expiry_date, quantity_produced, quality_status, approved_by)
WITH unit_ids AS (
  SELECT id, unit_code FROM production_units
)
SELECT
  (SELECT id FROM unit_ids WHERE unit_code = 'CPU-001'),
  p.id,
  'BATCH-' || LPAD(ROW_NUMBER() OVER (ORDER BY p.id)::TEXT, 4, '0'),
  CURRENT_DATE - (ROW_NUMBER() OVER (ORDER BY p.id) * 2),
  (CURRENT_DATE - (ROW_NUMBER() OVER (ORDER BY p.id) * 2)) + INTERVAL '90 days',
  FLOOR(RANDOM() * 1000 + 100),
  'APPROVED',
  'Rajesh Kumar'
FROM products p
LIMIT 20
UNION ALL
SELECT
  (SELECT id FROM unit_ids WHERE unit_code = 'CPU-002'),
  p.id,
  'BATCH-' || LPAD((20 + ROW_NUMBER() OVER (ORDER BY p.id))::TEXT, 4, '0'),
  CURRENT_DATE - ((ROW_NUMBER() OVER (ORDER BY p.id) + 20) * 2),
  (CURRENT_DATE - ((ROW_NUMBER() OVER (ORDER BY p.id) + 20) * 2)) + INTERVAL '60 days',
  FLOOR(RANDOM() * 800 + 100),
  'APPROVED',
  'Priya Singh'
FROM products p
LIMIT 20
UNION ALL
SELECT
  (SELECT id FROM unit_ids WHERE unit_code = 'CPU-003'),
  p.id,
  'BATCH-' || LPAD((40 + ROW_NUMBER() OVER (ORDER BY p.id))::TEXT, 4, '0'),
  CURRENT_DATE - ((ROW_NUMBER() OVER (ORDER BY p.id) + 40) * 2),
  (CURRENT_DATE - ((ROW_NUMBER() OVER (ORDER BY p.id) + 40) * 2)) + INTERVAL '180 days',
  FLOOR(RANDOM() * 500 + 100),
  'APPROVED',
  'Vikram Sharma'
FROM products p
LIMIT 10;

-- Insert quality checks (50+ records)
INSERT INTO quality_checks (batch_id, check_date, check_type, check_result, parameters_tested, checked_by)
SELECT
  b.id,
  CURRENT_TIMESTAMP - (ROW_NUMBER() OVER (ORDER BY b.id) * INTERVAL '12 hours'),
  (ARRAY['Visual Inspection', 'Taste Test', 'Microbial Check', 'pH Test', 'Texture Check'])[1 + FLOOR(RANDOM() * 5)::INT],
  (ARRAY['PASS', 'PASS', 'PASS', 'PASS', 'PASS', 'RETEST'])[1 + FLOOR(RANDOM() * 6)::INT],
  JSONB_BUILD_OBJECT(
    'temperature_check', FLOOR(RANDOM() * 5 + 20),
    'moisture_level', FLOOR(RANDOM() * 30 + 5),
    'microbial_count', FLOOR(RANDOM() * 100),
    'color_check', 'Standard'
  ),
  (ARRAY['Rajesh Kumar', 'Priya Singh', 'Vikram Sharma', 'Neha Verma', 'Arun Singh'])[1 + FLOOR(RANDOM() * 5)::INT]
FROM production_batches b
ORDER BY RANDOM();

-- Insert distributors (3-5 distributors)
INSERT INTO distributors (distributor_code, distributor_name, contact_person, phone, email, address, city, coverage_area, is_active)
VALUES
('DIST-001', 'Varanasi Regional Distributors', 'Rajesh Patel', '9876543501', 'rajesh@vardist.in', '145 Trade Center, Varanasi', 'Varanasi', '{"Varanasi", "Jaunpur", "Ghazipur"}', true),
('DIST-002', 'Lucknow Food Solutions', 'Priya Gupta', '9876543502', 'priya@lkofood.in', '221 Market Complex, Lucknow', 'Lucknow', '{"Lucknow", "Kanpur", "Agra"}', true),
('DIST-003', 'UP Wholesale Networks', 'Vikram Singh', '9876543503', 'vikram@upwholesale.in', '456 Industrial Hub, Kanpur', 'Kanpur', '{"Kanpur", "Meerut", "Allahabad"}', true),
('DIST-004', 'Delhi Metro Foods', 'Deepak Kumar', '9876543504', 'deepak@delhimetro.in', '789 Wholesale Market, Delhi', 'Delhi', '{"Delhi", "Ghaziabad", "Noida"}', true),
('DIST-005', 'Regional Food Hub', 'Neha Sharma', '9876543505', 'neha@regionalfood.in', '101 Distribution Center, Varanasi', 'Varanasi', '{"Varanasi", "Allahabad", "Jaunpur"}', true);

-- Insert distribution orders (40-50 orders)
INSERT INTO distribution_orders (distributor_id, order_number, order_date, delivery_date, total_amount, payment_status, order_status)
WITH dist_ids AS (
  SELECT id, distributor_code FROM distributors
)
SELECT
  d.id,
  'ORD-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
  CURRENT_DATE - (ROW_NUMBER() OVER (ORDER BY RANDOM()) * 1),
  CURRENT_DATE - (ROW_NUMBER() OVER (ORDER BY RANDOM()) * 1) + INTERVAL '5 days',
  FLOOR(RANDOM() * 500000 + 50000)::DECIMAL,
  (ARRAY['PENDING', 'PENDING', 'PENDING', 'PAID'])[1 + FLOOR(RANDOM() * 4)::INT],
  (ARRAY['PENDING', 'PROCESSING', 'DELIVERED', 'DELIVERED'])[1 + FLOOR(RANDOM() * 4)::INT]
FROM (SELECT DISTINCT id FROM distributors) d
CROSS JOIN generate_series(1, 10);

-- Insert distribution order items
INSERT INTO distribution_order_items (order_id, batch_id, quantity, unit_price, total_price)
SELECT
  o.id,
  (SELECT id FROM production_batches ORDER BY RANDOM() LIMIT 1),
  FLOOR(RANDOM() * 500 + 50),
  FLOOR(RANDOM() * 200 + 50)::DECIMAL,
  (FLOOR(RANDOM() * 500 + 50) * (FLOOR(RANDOM() * 200 + 50)))::DECIMAL
FROM distribution_orders o
LIMIT 45;

-- Insert cold chain monitoring (time series data)
INSERT INTO cold_chain_monitoring (batch_id, recorded_at, temperature_celsius, humidity_percent, location, is_within_range, alert_sent)
SELECT
  b.id,
  CURRENT_TIMESTAMP - (ROW_NUMBER() OVER (ORDER BY b.id, RANDOM()) * INTERVAL '2 hours'),
  (CASE WHEN b.production_date > CURRENT_DATE - 3 THEN FLOOR(RANDOM() * 5 + 2)::DECIMAL(5,2) ELSE FLOOR(RANDOM() * 8 + 15)::DECIMAL(5,2) END),
  FLOOR(RANDOM() * 20 + 40)::DECIMAL(5,2),
  (ARRAY['Unit-001 Freezer', 'Unit-002 Cooler', 'Unit-003 Storage', 'Transit Vehicle', 'Distributor Warehouse'])[1 + FLOOR(RANDOM() * 5)::INT],
  (RANDOM() > 0.05),
  (RANDOM() < 0.05)
FROM production_batches b
WHERE RANDOM() < 0.7;

-- Summary
SELECT 'Food Production & Distribution Demo Data Loaded Successfully!' AS Status;
SELECT COUNT(*) AS "Production Batches" FROM production_batches;
SELECT COUNT(*) AS "Distribution Orders" FROM distribution_orders;
SELECT COUNT(*) AS "Quality Checks" FROM quality_checks;
SELECT COUNT(*) AS "Cold Chain Records" FROM cold_chain_monitoring;
