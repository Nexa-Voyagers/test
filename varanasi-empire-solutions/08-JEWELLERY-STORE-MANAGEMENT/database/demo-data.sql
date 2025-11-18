-- ============================================================================
-- JEWELLERY STORE MANAGEMENT SYSTEM - COMPREHENSIVE DEMO DATA
-- Version: 1.0.0
-- ============================================================================
-- Complete jewellery retail system with gold/silver rates, inventory, sales, etc.
-- ============================================================================

-- ============================================================================
-- JEWELLERY GROUPS
-- ============================================================================

INSERT INTO jewellery_groups (
    group_name, brand_name, company_legal_name, pan_number, gstin,
    bis_license_number, centralized_pricing, centralized_rate_updates,
    head_office_address, contact_email, contact_phone, website, is_active
) VALUES
(
    'Kashi Jewellers Group', 'Kashi Jewels', 'Kashi Jewellers Private Limited',
    demo_helpers.generate_pan_number(), demo_helpers.generate_gst_number(),
    'BIS-UP-2018-00001', TRUE, TRUE,
    '123 Godowlia, Varanasi, Uttar Pradesh 221001',
    'info@kashijewels.com', demo_helpers.generate_phone_number(),
    'www.kashijewels.com', TRUE
),
(
    'Lucknow Heritage Jewels', 'Aadhaar Gold', 'Lucknow Heritage Jewels Ltd',
    demo_helpers.generate_pan_number(), demo_helpers.generate_gst_number(),
    'BIS-UP-2016-00002', TRUE, TRUE,
    '456 Hazratganj, Lucknow, Uttar Pradesh 226001',
    'contact@aadhargold.com', demo_helpers.generate_phone_number(),
    'www.aadhargold.com', TRUE
),
(
    'Prayagraj Platinum House', 'Divine Jewels', 'Prayagraj Platinum House Inc',
    demo_helpers.generate_pan_number(), demo_helpers.generate_gst_number(),
    'BIS-UP-2017-00003', TRUE, TRUE,
    '789 Civil Lines, Prayagraj, Uttar Pradesh 211001',
    'admin@divinejewels.com', demo_helpers.generate_phone_number(),
    'www.divinejewels.com', TRUE
);

-- ============================================================================
-- STORES
-- ============================================================================

INSERT INTO stores (
    group_id, store_name, store_code, store_type, city, state, pincode,
    manager_name, manager_phone, store_email, store_phone,
    gstin, bis_license_number, establishment_year,
    has_gold, has_silver, has_diamond, has_custom_design, has_repair_service,
    bank_name, bank_account_number, bank_ifsc, upi_id,
    accepts_cash, accepts_card, accepts_upi, accepts_old_gold_exchange,
    accepts_schemes, opening_time, closing_time, is_active
)
SELECT
    jg.id,
    jg.brand_name || ' Store - ' || city,
    'ST-' || LPAD(ROW_NUMBER() OVER (PARTITION BY jg.id ORDER BY RANDOM())::TEXT, 3, '0'),
    'RETAIL',
    (ARRAY['Varanasi', 'Lucknow', 'Prayagraj', 'Kanpur'])[FLOOR(RANDOM() * 4 + 1)::INT],
    'Uttar Pradesh',
    (ARRAY['221001', '226001', '211001', '208001'])[FLOOR(RANDOM() * 4 + 1)::INT],
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    LOWER(REPLACE(jg.brand_name, ' ', '_')) || '@store.com',
    demo_helpers.generate_phone_number(),
    jg.gstin,
    jg.bis_license_number,
    2018,
    TRUE, TRUE, TRUE, TRUE, TRUE,
    'SBI', 'ACC-' || LPAD(FLOOR(RANDOM() * 9999999999)::TEXT, 10, '0'), 'SBIN0000001',
    jg.brand_name || '@upi',
    TRUE, TRUE, TRUE, TRUE, TRUE,
    '10:00'::TIME, '20:00'::TIME, TRUE
FROM jewellery_groups jg
CROSS JOIN GENERATE_SERIES(1, 3);

-- ============================================================================
-- METAL TYPES (Already in schema, but verify data)
-- ============================================================================

-- Data already inserted in schema creation

-- ============================================================================
-- PRODUCT CATEGORIES
-- ============================================================================

INSERT INTO product_categories (
    store_id, category_name, category_code, display_order, is_active
)
SELECT
    s.id,
    (ARRAY['Rings', 'Necklaces', 'Earrings', 'Bangles', 'Bracelets', 'Chains', 'Pendants', 'Anklets'])[FLOOR(RANDOM() * 8 + 1)::INT],
    'CAT-' || LPAD(ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY RANDOM())::TEXT, 3, '0'),
    FLOOR(RANDOM() * 10)::INT,
    TRUE
FROM stores s
CROSS JOIN GENERATE_SERIES(1, 5);

-- ============================================================================
-- PRODUCT DESIGNS (40+ SKUs with specifications)
-- ============================================================================

INSERT INTO product_designs (
    store_id, category_id, design_name, design_code, sku,
    metal_type_id, purity_id, design_type,
    approx_gross_weight, approx_net_weight, approx_stone_weight,
    has_diamond, diamond_quality, has_gemstones, gemstone_types,
    making_charge_type, making_charge_value, wastage_percentage,
    stone_charge, description, is_hallmarked, is_stock_item,
    is_featured, is_active
)
SELECT
    s.id,
    (SELECT id FROM product_categories WHERE store_id = s.id ORDER BY RANDOM() LIMIT 1),
    (ARRAY[
        'Traditional Mangalsutra', 'Wedding Necklace', 'Modern Ring',
        'Bridal Necklace Set', 'Daily Wear Earrings', 'Casual Bracelet',
        'Diamond Ring', 'Temple Design', 'Antique Pendant', 'Engagement Ring'
    ])[FLOOR(RANDOM() * 10 + 1)::INT],
    'DES-' || LPAD(ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY RANDOM())::TEXT, 4, '0'),
    'SKU-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
    (SELECT id FROM metal_types ORDER BY RANDOM() LIMIT 1),
    CASE WHEN RANDOM() > 0.5 THEN (SELECT id FROM metal_purities WHERE purity_name = '22K' LIMIT 1)
         ELSE (SELECT id FROM metal_purities WHERE purity_name = '999' LIMIT 1) END,
    (ARRAY['TRADITIONAL', 'MODERN', 'ANTIQUE', 'BRIDAL'])[FLOOR(RANDOM() * 4 + 1)::INT],
    FLOOR(10 + RANDOM() * 100)::DECIMAL(10, 3),
    FLOOR(8 + RANDOM() * 80)::DECIMAL(10, 3),
    CASE WHEN RANDOM() > 0.7 THEN FLOOR(2 + RANDOM() * 10) ELSE 0 END,
    RANDOM() > 0.6,
    (ARRAY['VVS', 'VS', 'SI'])[FLOOR(RANDOM() * 3 + 1)::INT],
    RANDOM() > 0.5,
    CASE WHEN RANDOM() > 0.7 THEN ARRAY['Ruby', 'Emerald', 'Sapphire'] ELSE NULL END,
    'PER_GRAM',
    FLOOR(150 + RANDOM() * 350)::DECIMAL(10, 2),
    FLOOR(2 + RANDOM() * 5)::DECIMAL(5, 2),
    CASE WHEN RANDOM() > 0.7 THEN FLOOR(1000 + RANDOM() * 5000) ELSE 0 END,
    'Exquisite handcrafted design with traditional appeal',
    RANDOM() > 0.4,
    TRUE,
    RANDOM() > 0.7,
    TRUE
FROM stores s
CROSS JOIN GENERATE_SERIES(1, 4);

-- ============================================================================
-- LIVE METAL RATES
-- ============================================================================

INSERT INTO live_metal_rates (
    metal_type_id, purity_id, store_id,
    buying_rate, selling_rate, rate_source,
    effective_from, is_current
)
SELECT
    mt.id, mp.id, s.id,
    FLOOR(5000 + RANDOM() * 1000)::DECIMAL(10, 2),
    FLOOR(5100 + RANDOM() * 1000)::DECIMAL(10, 2),
    'MANUAL',
    CURRENT_TIMESTAMP,
    TRUE
FROM metal_types mt
CROSS JOIN metal_purities mp
CROSS JOIN stores s
WHERE (mt.id, mp.id) NOT IN (
    SELECT metal_type_id, purity_id FROM live_metal_rates WHERE is_current = TRUE
);

-- ============================================================================
-- CUSTOMERS
-- ============================================================================

INSERT INTO customers (
    store_id, customer_code, first_name, last_name, gender,
    date_of_birth, phone, email, address, city, state, pincode,
    aadhar_number, pan_number, customer_type, loyalty_tier,
    preferred_metal, preferred_style, credit_limit,
    total_purchases, total_purchases_count,
    sms_notifications, email_notifications,
    referred_by_customer_id, referral_code, is_active
)
SELECT
    s.id,
    'CUST-' || LPAD(ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY RANDOM())::TEXT, 5, '0'),
    demo_helpers.get_random_male_name(),
    demo_helpers.get_random_male_name(),
    (ARRAY['MALE', 'FEMALE'])[FLOOR(RANDOM() * 2 + 1)::INT],
    CURRENT_DATE - (INTERVAL '1 day' * (FLOOR(25 + RANDOM() * 60)::INT * 365)),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    demo_helpers.generate_address(s.city),
    s.city, 'Uttar Pradesh', s.pincode,
    demo_helpers.generate_aadhaar_number(),
    demo_helpers.generate_pan_number(),
    'RETAIL',
    (ARRAY['SILVER', 'GOLD', 'PLATINUM'])[FLOOR(RANDOM() * 3 + 1)::INT],
    (ARRAY['GOLD', 'SILVER'])[FLOOR(RANDOM() * 2 + 1)::INT],
    (ARRAY['TRADITIONAL', 'MODERN'])[FLOOR(RANDOM() * 2 + 1)::INT],
    CASE WHEN RANDOM() > 0.7 THEN 500000 ELSE 0 END,
    0, 0, TRUE, TRUE,
    NULL, 'REF-' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0'), TRUE
FROM stores s
CROSS JOIN GENERATE_SERIES(1, 8);

-- ============================================================================
-- INVENTORY ITEMS (Individual pieces with HUID)
-- ============================================================================

INSERT INTO inventory_items (
    store_id, design_id, item_code, tag_number, huid_number,
    gross_weight, net_weight, stone_weight, diamond_weight,
    metal_type_id, purity_id, purity_tested,
    making_charges, wastage_charges, stone_charges,
    metal_rate_at_purchase, purchase_price, mrp,
    is_hallmarked, hallmark_center, hallmark_date,
    item_status, location_in_store, created_at, is_active
)
SELECT
    s.id, pd.id,
    'ITEM-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    'TAG-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
    'HUID-' || LPAD(FLOOR(RANDOM() * 9999999999)::TEXT, 10, '0'),
    pd.approx_gross_weight,
    pd.approx_net_weight,
    pd.approx_stone_weight,
    CASE WHEN pd.has_diamond THEN FLOOR(0.5 + RANDOM() * 2)::DECIMAL(8, 3) ELSE 0 END,
    pd.metal_type_id, pd.purity_id, TRUE,
    pd.making_charge_value * pd.approx_net_weight,
    pd.wastage_percentage * pd.approx_net_weight,
    pd.stone_charge,
    FLOOR(5500 + RANDOM() * 500)::DECIMAL(10, 2),
    FLOOR((pd.approx_net_weight * (5500 + RANDOM() * 500)) + pd.making_charge_value + pd.stone_charge)::DECIMAL(10, 2),
    FLOOR((pd.approx_net_weight * (5500 + RANDOM() * 500)) + pd.making_charge_value + pd.stone_charge + 5000)::DECIMAL(10, 2),
    RANDOM() > 0.3,
    'BIS Mumbai',
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 180)::INT),
    'IN_STOCK',
    (ARRAY['Showcase A', 'Showcase B', 'Vault', 'Display Window'])[FLOOR(RANDOM() * 4 + 1)::INT],
    CURRENT_TIMESTAMP - (INTERVAL '1 day' * FLOOR(RANDOM() * 90)::INT),
    TRUE
FROM stores s
CROSS JOIN LATERAL (
    SELECT pd.* FROM product_designs pd
    WHERE pd.store_id = s.id
    ORDER BY RANDOM() LIMIT 5
) pd;

-- ============================================================================
-- GOLD SAVING SCHEMES
-- ============================================================================

INSERT INTO scheme_plans (
    store_id, scheme_name, scheme_code,
    duration_months, total_installments,
    bonus_type, bonus_percentage,
    min_installment_amount, allow_advance_payment,
    can_redeem_gold, making_charges_on_redemption, is_active
)
SELECT
    s.id,
    'Gold Saving Scheme - ' || LPAD(ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY RANDOM())::TEXT, 2, '0'),
    'SCHEME-' || LPAD(ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY RANDOM())::TEXT, 4, '0'),
    12,
    12,
    'PERCENTAGE',
    FLOOR(3 + RANDOM() * 7)::DECIMAL(5, 2),
    FLOOR(5000 + RANDOM() * 15000)::DECIMAL(10, 2),
    TRUE,
    TRUE,
    TRUE,
    TRUE
FROM stores s
CROSS JOIN GENERATE_SERIES(1, 2);

-- ============================================================================
-- SCHEME ENROLLMENTS
-- ============================================================================

INSERT INTO scheme_enrollments (
    customer_id, scheme_plan_id, store_id,
    enrollment_number, enrollment_date,
    monthly_installment_amount, total_installments,
    total_amount_to_pay, next_due_date, maturity_date,
    scheme_status, is_active
)
SELECT
    c.id,
    (SELECT id FROM scheme_plans WHERE store_id = c.store_id ORDER BY RANDOM() LIMIT 1),
    c.store_id,
    'ENR-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 120)::INT),
    FLOOR(10000 + RANDOM() * 20000)::DECIMAL(10, 2),
    12,
    FLOOR((10000 + RANDOM() * 20000) * 12)::DECIMAL(10, 2),
    CURRENT_DATE + (INTERVAL '1 month'),
    CURRENT_DATE + (INTERVAL '12 months'),
    (ARRAY['ACTIVE', 'COMPLETED'])[FLOOR(RANDOM() * 2 + 1)::INT],
    TRUE
FROM customers c
WHERE ROW_NUMBER() OVER (PARTITION BY c.store_id ORDER BY RANDOM()) <= 3;

-- ============================================================================
-- SALES INVOICES
-- ============================================================================

INSERT INTO sales_invoices (
    store_id, customer_id, invoice_number, invoice_date, invoice_type,
    subtotal_amount, making_charges, stone_charges,
    discount_amount, cgst_amount, sgst_amount, round_off,
    grand_total, net_payable_amount,
    has_old_gold_exchange, old_gold_value,
    is_scheme_redemption, payment_status, is_cancelled
)
SELECT
    s.id, c.id,
    'INV-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 60)::INT),
    'RETAIL',
    FLOOR(50000 + RANDOM() * 150000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 20000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 15000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 5000)::DECIMAL(10, 2),
    FLOOR((50000 + RANDOM() * 150000 + RANDOM() * 20000) * 0.045)::DECIMAL(10, 2),
    FLOOR((50000 + RANDOM() * 150000 + RANDOM() * 20000) * 0.045)::DECIMAL(10, 2),
    FLOOR(RANDOM() * 100)::DECIMAL(5, 2),
    FLOOR((50000 + RANDOM() * 150000 + RANDOM() * 20000) * 1.09)::DECIMAL(12, 2),
    FLOOR((50000 + RANDOM() * 150000 + RANDOM() * 20000) * 1.09 - RANDOM() * 10000)::DECIMAL(12, 2),
    RANDOM() > 0.7,
    CASE WHEN RANDOM() > 0.7 THEN FLOOR(10000 + RANDOM() * 30000) ELSE 0 END,
    RANDOM() > 0.8,
    'PAID',
    FALSE
FROM stores s
CROSS JOIN customers c
WHERE c.store_id = s.id
  AND ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY RANDOM()) <= 10;

-- ============================================================================
-- SALES INVOICE ITEMS
-- ============================================================================

INSERT INTO sales_invoice_items (
    invoice_id, inventory_item_id, design_id,
    item_code, item_description,
    metal_type, purity, gross_weight, net_weight,
    metal_rate, making_charges, stone_charges,
    item_value, gst_percentage, gst_amount, total_amount
)
SELECT
    si.id,
    (SELECT id FROM inventory_items WHERE store_id = si.store_id ORDER BY RANDOM() LIMIT 1),
    (SELECT design_id FROM inventory_items WHERE store_id = si.store_id ORDER BY RANDOM() LIMIT 1),
    'ITEM-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
    'Gold Pendant',
    'Gold',
    '22K',
    FLOOR(10 + RANDOM() * 50)::DECIMAL(10, 3),
    FLOOR(8 + RANDOM() * 40)::DECIMAL(10, 3),
    FLOOR(5500 + RANDOM() * 500)::DECIMAL(10, 2),
    FLOOR(RANDOM() * 5000)::DECIMAL(10, 2),
    FLOOR(RANDOM() * 2000)::DECIMAL(10, 2),
    FLOOR(50000 + RANDOM() * 150000)::DECIMAL(10, 2),
    3.0,
    FLOOR((50000 + RANDOM() * 150000) * 0.03)::DECIMAL(10, 2),
    FLOOR((50000 + RANDOM() * 150000) * 1.03)::DECIMAL(10, 2)
FROM sales_invoices si
CROSS JOIN GENERATE_SERIES(1, 2);

-- ============================================================================
-- OLD GOLD ENTRIES
-- ============================================================================

INSERT INTO old_gold_entries (
    store_id, customer_id, entry_number, entry_date,
    entry_type, metal_type, item_description,
    gross_weight, net_weight, tested_purity_percentage,
    purity_test_method, applicable_rate,
    base_value, deduction_percentage, deduction_amount, final_value,
    item_status, is_active
)
SELECT
    s.id, c.id,
    'OG-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 60)::INT),
    (ARRAY['EXCHANGE', 'PURCHASE'])[FLOOR(RANDOM() * 2 + 1)::INT],
    (ARRAY['GOLD', 'SILVER'])[FLOOR(RANDOM() * 2 + 1)::INT],
    'Old Jewellery',
    FLOOR(10 + RANDOM() * 50)::DECIMAL(10, 3),
    FLOOR(8 + RANDOM() * 40)::DECIMAL(10, 3),
    FLOOR(75 + RANDOM() * 20)::DECIMAL(5, 2),
    'XRF',
    FLOOR(5500 + RANDOM() * 500)::DECIMAL(10, 2),
    FLOOR((8 + RANDOM() * 40) * (5500 + RANDOM() * 500))::DECIMAL(10, 2),
    FLOOR(5 + RANDOM() * 10)::DECIMAL(5, 2),
    FLOOR((8 + RANDOM() * 40) * (5500 + RANDOM() * 500) * (0.05 + RANDOM() * 0.10))::DECIMAL(10, 2),
    FLOOR((8 + RANDOM() * 40) * (5500 + RANDOM() * 500) * (1 - (0.05 + RANDOM() * 0.10)))::DECIMAL(10, 2),
    'MELTED',
    TRUE
FROM stores s
CROSS JOIN customers c
WHERE c.store_id = s.id
  AND ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY RANDOM()) <= 5;

-- ============================================================================
-- REPAIR JOBS
-- ============================================================================

INSERT INTO repair_jobs (
    store_id, customer_id, job_number, job_date,
    item_description, metal_type, approximate_weight,
    service_type, issue_description,
    estimated_charges, estimated_delivery_date,
    job_status, payment_status, is_active
)
SELECT
    s.id, c.id,
    'RJ-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 30)::INT),
    (ARRAY['Gold Ring', 'Silver Necklace', 'Diamond Ring', 'Bangle'])[FLOOR(RANDOM() * 4 + 1)::INT],
    (ARRAY['GOLD', 'SILVER'])[FLOOR(RANDOM() * 2 + 1)::INT],
    FLOOR(5 + RANDOM() * 50)::DECIMAL(10, 3),
    ARRAY[(ARRAY['REPAIR', 'RESIZE', 'POLISH', 'STONE_FIXING'])[FLOOR(RANDOM() * 4 + 1)::INT]],
    'Item needs restoration',
    FLOOR(500 + RANDOM() * 3000)::DECIMAL(10, 2),
    CURRENT_DATE + (INTERVAL '1 day' * FLOOR(RANDOM() * 14)::INT),
    (ARRAY['RECEIVED', 'WORK_IN_PROGRESS', 'COMPLETED'])[FLOOR(RANDOM() * 3 + 1)::INT],
    'PAID',
    TRUE
FROM stores s
CROSS JOIN customers c
WHERE c.store_id = s.id
  AND ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY RANDOM()) <= 4;

-- ============================================================================
-- SUPPLIERS
-- ============================================================================

INSERT INTO suppliers (
    store_id, supplier_name, supplier_code, supplier_type,
    contact_person, phone, email, gstin,
    credit_period_days, credit_limit, is_active
)
SELECT
    s.id,
    (ARRAY['Gold Bullion Traders', 'Premium Diamond Imports', 'Silver Wholesale'])[FLOOR(RANDOM() * 3 + 1)::INT],
    'SUP-' || LPAD(ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY RANDOM())::TEXT, 4, '0'),
    (ARRAY['MANUFACTURER', 'WHOLESALER', 'DIAMOND_MERCHANT'])[FLOOR(RANDOM() * 3 + 1)::INT],
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    demo_helpers.generate_gst_number(),
    FLOOR(15 + RANDOM() * 45)::INT,
    FLOOR(500000 + RANDOM() * 2000000)::DECIMAL(12, 2),
    TRUE
FROM stores s
CROSS JOIN GENERATE_SERIES(1, 3);

-- ============================================================================
-- STAFF
-- ============================================================================

INSERT INTO staff (
    store_id, employee_code, first_name, last_name, phone,
    designation, date_of_joining, employment_type,
    basic_salary, commission_applicable, commission_percentage,
    system_username, system_role, can_create_invoice,
    can_test_purity, can_modify_rates, is_active
)
SELECT
    s.id,
    'EMP-' || LPAD(ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY RANDOM())::TEXT, 4, '0'),
    demo_helpers.get_random_male_name(),
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    (ARRAY['MANAGER', 'SALES_PERSON', 'CASHIER', 'GOLDSMITH'])[FLOOR(RANDOM() * 4 + 1)::INT],
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 1500)::INT),
    'PERMANENT',
    FLOOR(20000 + RANDOM() * 50000),
    RANDOM() > 0.5,
    FLOOR(2 + RANDOM() * 5)::DECIMAL(5, 2),
    'emp_' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 4, '0'),
    'SALES',
    RANDOM() > 0.3,
    RANDOM() > 0.5,
    RANDOM() > 0.7,
    TRUE
FROM stores s
CROSS JOIN GENERATE_SERIES(1, 5);

-- ============================================================================
-- DAILY SALES SUMMARY
-- ============================================================================

INSERT INTO daily_sales_summary (
    store_id, summary_date,
    total_invoices, total_items_sold, gross_revenue,
    total_discounts, net_revenue, total_gold_weight_sold,
    total_silver_weight_sold, gold_revenue, silver_revenue,
    total_making_charges, old_gold_exchanges, old_gold_value,
    scheme_enrollments, scheme_payments_received, repair_jobs_received,
    unique_customers, new_customers
)
SELECT
    s.id,
    CURRENT_DATE - (INTERVAL '1 day' * days.day),
    FLOOR(RANDOM() * 10)::INT,
    FLOOR(RANDOM() * 20)::INT,
    FLOOR(RANDOM() * 500000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 50000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 450000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 100)::DECIMAL(10, 3),
    FLOOR(RANDOM() * 50)::DECIMAL(10, 3),
    FLOOR(RANDOM() * 300000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 100000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 50000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 5)::INT,
    FLOOR(RANDOM() * 50000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 3)::INT,
    FLOOR(RANDOM() * 30000)::DECIMAL(10, 2),
    FLOOR(RANDOM() * 3)::INT,
    FLOOR(RANDOM() * 15)::INT,
    FLOOR(RANDOM() * 5)::INT
FROM stores s
CROSS JOIN (SELECT GENERATE_SERIES(0, 90) AS day) days;

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT
    (SELECT COUNT(*) FROM jewellery_groups) as "Total Jewellery Groups",
    (SELECT COUNT(*) FROM stores) as "Total Store Outlets",
    (SELECT COUNT(*) FROM product_designs) as "Product Designs",
    (SELECT COUNT(*) FROM inventory_items) as "Inventory Items",
    (SELECT COUNT(*) FROM customers) as "Total Customers",
    (SELECT COUNT(*) FROM sales_invoices) as "Total Sales Invoices",
    (SELECT SUM(grand_total) FROM sales_invoices WHERE is_cancelled = FALSE) as "Total Sales Revenue",
    (SELECT COUNT(*) FROM scheme_enrollments) as "Active Scheme Enrollments",
    (SELECT COUNT(*) FROM repair_jobs) as "Repair Jobs",
    (SELECT COUNT(*) FROM old_gold_entries) as "Old Gold Purchases"
    AS "Jewellery Store Management Demo Data Summary";
