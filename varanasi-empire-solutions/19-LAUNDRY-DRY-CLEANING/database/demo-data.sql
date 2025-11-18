-- ============================================================================
-- LAUNDRY & DRY CLEANING - COMPREHENSIVE DEMO DATA
-- Varanasi Empire Solution
-- ============================================================================

-- Insert laundry shops (2-3 shops)
INSERT INTO laundry_shops (shop_name, address, city, phone, services_offered, has_pickup_delivery, is_active)
VALUES
('Varanasi Express Laundry', '145 Main Street, Varanasi', 'Varanasi', '9876544001', '{"WASHING", "DRY_CLEANING", "IRONING", "STAIN_REMOVAL"}', true, true),
('Lucknow Premium Laundry', '221 Market Road, Lucknow', 'Lucknow', '9876544002', '{"WASHING", "DRY_CLEANING", "IRONING"}', true, true),
('Kanpur Quick Wash', '456 Business District, Kanpur', 'Kanpur', '9876544003', '{"WASHING", "IRONING", "STAIN_REMOVAL"}', false, true);

-- Insert customers (40+ customers)
INSERT INTO customers (customer_code, first_name, last_name, phone, email, address, delivery_address, is_active)
WITH cust_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 45)
)
SELECT
  'CUST-' || LPAD(cd.rn::TEXT, 4, '0'),
  (ARRAY['Rajesh', 'Priya', 'Arun', 'Deepika', 'Vikram', 'Meera', 'Suresh', 'Neha', 'Amit', 'Kavita',
         'Yogesh', 'Divya', 'Hemant', 'Geeta', 'Ramesh', 'Sunita', 'Anita', 'Seema', 'Rekha', 'Pooja',
         'Arjun', 'Aryan', 'Aditya', 'Aarav', 'Bhavesh', 'Chetan', 'Chirag', 'Chandra', 'Devendra', 'Dinesh',
         'Eshan', 'Faisal', 'Gaurav', 'Hemant', 'Imran', 'Jagdish', 'Kailash', 'Lavesh', 'Mahesh', 'Naveen',
         'Omkar', 'Prakash', 'Pushkar', 'Rahul', 'Sandeep'])[cd.rn],
  (ARRAY['Singh', 'Kumar', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Mishra', 'Yadav', 'Pandey', 'Rao',
         'Nair', 'Iyer', 'Dey', 'Das', 'Roy', 'Reddy', 'Chopra', 'Malhotra', 'Arora', 'Bhat',
         'Kulkarni', 'Desai', 'Joshi', 'Tripathi', 'Srivastava', 'Saxena', 'Mittal', 'Garg', 'Goyal', 'Agarwal',
         'Chaudhary', 'Trivedi', 'Banerjee', 'Mukherjee', 'Ghosh', 'Sen', 'Menon', 'Kapoor', 'Tiwari', 'Daga',
         'Shrivastava', 'Taneja', 'Dubey', 'Sethi', 'Baweja'])[cd.rn],
  '987654' || LPAD((4000 + cd.rn)::TEXT, 4, '0'),
  'customer' || cd.rn || '@email.com',
  FLOOR(cd.rn) || ' ' || (ARRAY['Ghat Road', 'Maidagin', 'Krishna Nagar', 'Vishwanath Gali', 'Varuna Nagar', 'Anand Nagar'])[1 + FLOOR(RANDOM() * 6)::INT] || ', Varanasi',
  FLOOR(cd.rn) || ' ' || (ARRAY['Ghat Road', 'Maidagin', 'Krishna Nagar', 'Vishwanath Gali', 'Varuna Nagar', 'Anand Nagar'])[1 + FLOOR(RANDOM() * 6)::INT] || ', Varanasi',
  true
FROM cust_data cd;

-- Insert service pricing (15-20 pricing records)
INSERT INTO service_pricing (shop_id, item_name, item_category, service_type, price, express_price, is_active)
SELECT
  ls.id,
  sp.item_name,
  sp.item_category,
  sp.service_type,
  sp.price,
  sp.express_price,
  true
FROM laundry_shops ls
CROSS JOIN (
  SELECT 'Shirt' as item_name, 'SHIRT' as item_category, 'WASH' as service_type, 50.00 as price, 75.00 as express_price
  UNION ALL SELECT 'Shirt', 'SHIRT', 'DRY_CLEAN', 120.00, 150.00
  UNION ALL SELECT 'Shirt', 'SHIRT', 'WASH_IRON', 80.00, 110.00
  UNION ALL SELECT 'Pant', 'PANT', 'WASH', 60.00, 90.00
  UNION ALL SELECT 'Pant', 'PANT', 'DRY_CLEAN', 150.00, 180.00
  UNION ALL SELECT 'Pant', 'PANT', 'WASH_IRON', 100.00, 130.00
  UNION ALL SELECT 'Saree', 'SAREE', 'WASH', 100.00, 150.00
  UNION ALL SELECT 'Saree', 'SAREE', 'DRY_CLEAN', 250.00, 300.00
  UNION ALL SELECT 'Blanket', 'BLANKET', 'WASH', 200.00, 250.00
  UNION ALL SELECT 'Blanket', 'BLANKET', 'DRY_CLEAN', 350.00, 400.00
  UNION ALL SELECT 'Curtain', 'CURTAIN', 'WASH', 150.00, 200.00
  UNION ALL SELECT 'Curtain', 'CURTAIN', 'DRY_CLEAN', 250.00, 300.00
  UNION ALL SELECT 'T-Shirt', 'SHIRT', 'WASH', 40.00, 60.00
  UNION ALL SELECT 'Suit', 'PANT', 'DRY_CLEAN', 400.00, 500.00
  UNION ALL SELECT 'Jacket', 'SHIRT', 'DRY_CLEAN', 300.00, 400.00
  UNION ALL SELECT 'Dress', 'SAREE', 'DRY_CLEAN', 250.00, 300.00
) sp;

-- Insert orders (40-50 orders)
INSERT INTO orders (shop_id, customer_id, order_number, pickup_date, promised_delivery_date, total_items, subtotal, discount, total_amount, payment_mode, payment_status, order_status)
WITH ord_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 48)
)
SELECT
  CASE WHEN od.rn <= 16 THEN (SELECT id FROM laundry_shops WHERE shop_name = 'Varanasi Express Laundry')
       WHEN od.rn <= 32 THEN (SELECT id FROM laundry_shops WHERE shop_name = 'Lucknow Premium Laundry')
       ELSE (SELECT id FROM laundry_shops WHERE shop_name = 'Kanpur Quick Wash') END,
  (SELECT id FROM customers ORDER BY RANDOM() LIMIT 1),
  'ORD-' || LPAD(od.rn::TEXT, 6, '0'),
  CURRENT_DATE - (FLOOR(RANDOM() * 7)::INT),
  CURRENT_DATE + (FLOOR(RANDOM() * 7 + 2)::INT),
  FLOOR(RANDOM() * 30 + 5)::INT,
  FLOOR(RANDOM() * 3000 + 300)::DECIMAL(10,2),
  CASE WHEN RANDOM() > 0.8 THEN FLOOR(RANDOM() * 200 + 50)::DECIMAL(8,2) ELSE 0.00 END,
  FLOOR(RANDOM() * 3000 + 300)::DECIMAL(10,2),
  (ARRAY['CASH', 'UPI', 'CARD'])[1 + FLOOR(RANDOM() * 3)::INT],
  (ARRAY['PENDING', 'PENDING', 'PAID'])[1 + FLOOR(RANDOM() * 3)::INT],
  (ARRAY['RECEIVED', 'WASHING', 'DRYING', 'IRONING', 'READY', 'DELIVERED'])[1 + FLOOR(RANDOM() * 6)::INT]
FROM ord_data od;

-- Insert order items (80-100 order items)
INSERT INTO order_items (order_id, item_name, service_type, quantity, unit_price, total_price, has_stains, special_instructions, item_status)
WITH item_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn,
         (SELECT id FROM orders ORDER BY RANDOM() LIMIT 1) as ord_id
  FROM generate_series(1, 95) s
)
SELECT
  id_data.ord_id,
  (ARRAY['Shirt', 'Pant', 'Saree', 'Blanket', 'Curtain', 'T-Shirt', 'Suit', 'Jacket', 'Dress', 'Shorts'])[1 + FLOOR(RANDOM() * 10)::INT],
  (ARRAY['WASH', 'DRY_CLEAN', 'WASH_IRON'])[1 + FLOOR(RANDOM() * 3)::INT],
  FLOOR(RANDOM() * 5 + 1)::INT,
  FLOOR(RANDOM() * 200 + 50)::DECIMAL(8,2),
  (FLOOR(RANDOM() * 5 + 1) * (FLOOR(RANDOM() * 200 + 50)))::DECIMAL(8,2),
  RANDOM() > 0.85,
  CASE WHEN RANDOM() > 0.8 THEN (ARRAY['Gentle wash', 'Extra stain removal', 'Handle with care', 'No bleach', 'Use cold water'])[1 + FLOOR(RANDOM() * 5)::INT] ELSE NULL END,
  (ARRAY['RECEIVED', 'WASHING', 'READY', 'DELIVERED'])[1 + FLOOR(RANDOM() * 4)::INT]
FROM (
  SELECT id_data.rn, id_data.ord_id
  FROM item_data id_data
) id_data;

-- Insert delivery routes (5-7 delivery routes)
INSERT INTO delivery_routes (route_date, delivery_person_name, delivery_person_phone, route_status)
SELECT
  CURRENT_DATE + (FLOOR(RANDOM() * 14)::INT),
  (ARRAY['Rajesh', 'Priya', 'Arun', 'Deepika', 'Vikram', 'Meera', 'Suresh'])[1 + FLOOR(RANDOM() * 7)::INT] || ' ' || (ARRAY['Singh', 'Kumar', 'Sharma', 'Patel'])[1 + FLOOR(RANDOM() * 4)::INT],
  '987654' || LPAD((4100 + FLOOR(RANDOM() * 20))::TEXT, 4, '0'),
  (ARRAY['PLANNED', 'IN_PROGRESS', 'COMPLETED'])[1 + FLOOR(RANDOM() * 3)::INT]
FROM generate_series(1, 7) s;

-- Insert route orders
INSERT INTO route_orders (route_id, order_id, sequence_number, pickup_delivery, is_completed)
WITH route_order_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn,
         (SELECT id FROM delivery_routes ORDER BY RANDOM() LIMIT 1) as route_id,
         (SELECT id FROM orders ORDER BY RANDOM() LIMIT 1) as order_id
  FROM generate_series(1, 50) s
)
SELECT
  rod.route_id,
  rod.order_id,
  FLOOR(RANDOM() * 10 + 1)::INT,
  (ARRAY['PICKUP', 'DELIVERY'])[1 + FLOOR(RANDOM() * 2)::INT],
  RANDOM() > 0.3
FROM route_order_data rod;

-- Insert membership plans
INSERT INTO membership_plans (shop_id, plan_name, monthly_fee, discount_percentage, free_pickups_per_month, benefits, is_active)
SELECT
  ls.id,
  mp.plan_name,
  mp.monthly_fee,
  mp.discount_percentage,
  mp.free_pickups,
  mp.benefits,
  true
FROM laundry_shops ls
CROSS JOIN (
  SELECT 'Silver Plan' as plan_name, 499.00 as monthly_fee, 5.0 as discount_percentage, 2 as free_pickups, '{"5% Discount", "Free Pickup", "Express Service Available"}'::TEXT[] as benefits
  UNION ALL SELECT 'Gold Plan', 999.00, 10.0, 4, '{"10% Discount", "Free Pickup & Delivery", "Priority Service", "Monthly Report"}'
  UNION ALL SELECT 'Platinum Plan', 1999.00, 15.0, 8, '{"15% Discount", "Unlimited Pickups", "VIP Treatment", "Free Stain Removal", "24-Hour Service"}'
) mp;

-- Insert customer memberships (15-20 memberships)
INSERT INTO customer_memberships (customer_id, plan_id, start_date, end_date, membership_status)
WITH mem_data AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 20)
)
SELECT
  (SELECT id FROM customers ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM membership_plans ORDER BY RANDOM() LIMIT 1),
  CURRENT_DATE - (FLOOR(RANDOM() * 60)::INT),
  CURRENT_DATE + (FLOOR(RANDOM() * 60)::INT),
  (ARRAY['ACTIVE', 'ACTIVE', 'ACTIVE', 'EXPIRED'])[1 + FLOOR(RANDOM() * 4)::INT]
FROM mem_data md;

-- Summary
SELECT 'Laundry & Dry Cleaning Demo Data Loaded Successfully!' AS Status;
SELECT COUNT(*) AS "Total Customers" FROM customers;
SELECT COUNT(*) AS "Total Orders" FROM orders;
SELECT COUNT(*) AS "Total Order Items" FROM order_items;
SELECT COUNT(*) AS "Active Memberships" FROM customer_memberships WHERE membership_status = 'ACTIVE';
