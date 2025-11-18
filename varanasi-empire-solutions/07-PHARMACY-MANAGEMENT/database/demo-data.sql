-- ============================================================================
-- PHARMACY MANAGEMENT SYSTEM - COMPREHENSIVE DEMO DATA
-- Version: 1.0.0
-- ============================================================================
-- Complete pharmacy demo data with inventory, sales, prescriptions, etc.
-- ============================================================================

-- ============================================================================
-- PHARMACY CHAINS
-- ============================================================================

INSERT INTO pharmacy_chains (
    chain_name, drug_license_number, gstin, pan_number,
    contact_email, contact_phone, is_active
) VALUES
(
    'Ayurveda Plus Pharmacy Chain',
    'APPC-DL-2018-00001',
    demo_helpers.generate_gst_number(),
    demo_helpers.generate_pan_number(),
    'info@ayurvedaplus.com',
    demo_helpers.generate_phone_number(),
    TRUE
),
(
    'Wellness Care Pharmacies',
    'WCP-DL-2016-00002',
    demo_helpers.generate_gst_number(),
    demo_helpers.generate_pan_number(),
    'contact@wellnesscare.com',
    demo_helpers.generate_phone_number(),
    TRUE
),
(
    'Medlife Pharmacy Network',
    'MPN-DL-2017-00003',
    demo_helpers.generate_gst_number(),
    demo_helpers.generate_pan_number(),
    'admin@medlifepharma.com',
    demo_helpers.generate_phone_number(),
    TRUE
);

-- ============================================================================
-- INDIVIDUAL PHARMACIES
-- ============================================================================

INSERT INTO pharmacies (
    chain_id, pharmacy_code, pharmacy_name, drug_license_number,
    address, city, state, pincode, location,
    pharmacist_name, pharmacist_reg_number, phone,
    opening_time, closing_time, is_24x7, is_active
)
SELECT
    pc.id,
    'PHARM-' || LPAD(ROW_NUMBER() OVER (PARTITION BY pc.id ORDER BY RANDOM())::TEXT, 3, '0'),
    CASE WHEN RANDOM() > 0.5 THEN 'Wellness' ELSE 'Medcare' END || ' Pharmacy - ' ||
    (ARRAY['Varanasi', 'Lucknow', 'Prayagraj', 'Kanpur'])[FLOOR(RANDOM() * 4 + 1)::INT],
    'DL-' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0'),
    demo_helpers.generate_address((ARRAY['Varanasi', 'Lucknow', 'Prayagraj'])[FLOOR(RANDOM() * 3 + 1)::INT]),
    (ARRAY['Varanasi', 'Lucknow', 'Prayagraj', 'Kanpur'])[FLOOR(RANDOM() * 4 + 1)::INT],
    'Uttar Pradesh',
    (ARRAY['221001', '226001', '211001', '208001'])[FLOOR(RANDOM() * 4 + 1)::INT],
    ST_GeomFromText('POINT(82.9789 25.3209)'),
    demo_helpers.get_random_male_name(),
    'REG-' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0'),
    demo_helpers.generate_phone_number(),
    '08:00'::TIME,
    (CASE WHEN RANDOM() > 0.7 THEN '22:00'::TIME ELSE '20:00'::TIME END),
    RANDOM() > 0.8,
    TRUE
FROM pharmacy_chains pc
CROSS JOIN GENERATE_SERIES(1, 4);

-- ============================================================================
-- DRUG CATEGORIES
-- ============================================================================

INSERT INTO drug_categories (
    category_name, schedule, requires_prescription
) VALUES
('Antibiotics', 'H', TRUE),
('Pain Relief', 'G', FALSE),
('Cough & Cold', 'G', FALSE),
('Vitamins & Supplements', 'G', FALSE),
('Cardiac Drugs', 'H', TRUE),
('Antidiabetic', 'H', TRUE),
('Respiratory', 'H', TRUE),
('Digestive', 'G', FALSE),
('Skin Care', 'G', FALSE),
('Immune Boosters', 'G', FALSE);

-- ============================================================================
-- DRUGS (50+ medicines with GST)
-- ============================================================================

INSERT INTO drugs (
    drug_code, generic_name, brand_name, manufacturer, category_id,
    drug_schedule, dosage_form, strength, pack_size, requires_prescription,
    gst_rate, mrp, purchase_price, margin_percentage, is_active
)
SELECT
    'DRUG-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 4, '0'),
    (ARRAY[
        'Amoxicillin', 'Ciprofloxacin', 'Aspirin', 'Paracetamol',
        'Metformin', 'Atorvastatin', 'Amlodipine', 'Omeprazole',
        'Vitamin C', 'Vitamin D3', 'Cough Syrup', 'Betadine',
        'Cetirizine', 'Ibuprofen', 'Loperamide', 'Ranitidine',
        'Digoxin', 'Furosemide', 'Levothyroxine', 'Phenytoin',
        'Azithromycin', 'Doxycycline', 'Cephalexin', 'Penicillin',
        'Metronidazole', 'Fluconazole', 'Ketoconazole', 'Salbutamol',
        'Theophylline', 'Prednisone', 'Dexamethasone', 'Hydrocortisone',
        'Insulin', 'Glibenclamide', 'Pioglitazone', 'Lisinopril',
        'Enalapril', 'Valsartan', 'Losartan', 'Nifedipine',
        'Diltiazem', 'Verapamil', 'Atenolol', 'Metoprolol',
        'Carvedilol', 'Bisoprolol', 'Warfarin', 'Heparin'
    ])[FLOOR(RANDOM() * 50 + 1)::INT],
    (ARRAY[
        'Amoxilin', 'Cipro', 'Aspro', 'Crocin', 'Glyciphage',
        'Atorva', 'Norvasc', 'Omez', 'Becozyme', 'Cholecalciferol',
        'Benadryl', 'Betadine', 'Cetirizine-D', 'Brufen', 'Imodium',
        'Zantac', 'Lanoxin', 'Lasix', 'Thyronorm', 'Phenytoin-Sodium',
        'Zithromax', 'Doxy', 'Keflex', 'Penicillin-V', 'Flagyl',
        'Diflucan', 'Nizoral', 'Asthalin', 'Uniphyl', 'Wysolone',
        'Decadron', 'Hydrocortisone', 'Humulin', 'Euglucon', 'Pioz',
        'Zestril', 'Vasotec', 'Diovan', 'Cozaar', 'Adalat',
        'Dilzem', 'Isoptin', 'Tenormin', 'Betaloc', 'Coreg',
        'Concor', 'Coumadin', 'Inj-Heparin'
    ])[FLOOR(RANDOM() * 50 + 1)::INT],
    (ARRAY['Dr. Reddy', 'Cipla', 'Sun Pharma', 'Lupin', 'Ranbaxy', 'Aurobindo', 'Torrent'])[FLOOR(RANDOM() * 7 + 1)::INT],
    (SELECT id FROM drug_categories ORDER BY RANDOM() LIMIT 1),
    (ARRAY['H', 'G'])[FLOOR(RANDOM() * 2 + 1)::INT],
    (ARRAY['TABLET', 'CAPSULE', 'SYRUP', 'INJECTION', 'CREAM'])[FLOOR(RANDOM() * 5 + 1)::INT],
    (ARRAY['500mg', '250mg', '100mg', '10ml', '5ml', '2%', '1%'])[FLOOR(RANDOM() * 7 + 1)::INT],
    (ARRAY['10 tablets', '20 tablets', '100ml', '10 capsules'])[FLOOR(RANDOM() * 4 + 1)::INT],
    RANDOM() > 0.6,
    12.0,
    FLOOR(50 + RANDOM() * 2000)::DECIMAL(10, 2),
    FLOOR(40 + RANDOM() * 1600)::DECIMAL(10, 2),
    FLOOR(15 + RANDOM() * 30)::DECIMAL(5, 2),
    TRUE
FROM GENERATE_SERIES(1, 55);

-- ============================================================================
-- PHARMACY INVENTORY (Batch tracking)
-- ============================================================================

INSERT INTO pharmacy_inventory (
    pharmacy_id, drug_id, batch_number, manufacturing_date,
    expiry_date, quantity_in_stock, purchase_price, mrp,
    supplier_name, purchase_date, rack_number, shelf_number
)
SELECT
    p.id,
    d.id,
    'BATCH-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 600)::INT),
    CURRENT_DATE + (INTERVAL '1 day' * FLOOR(RANDOM() * 900)::INT),
    FLOOR(10 + RANDOM() * 500)::INT,
    d.purchase_price,
    d.mrp,
    (ARRAY['Dr. Reddy Distributors', 'Cipla Supplies', 'Sun Pharma Distribution'])[FLOOR(RANDOM() * 3 + 1)::INT],
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 120)::INT),
    'RACK-' || CHR(65 + FLOOR(RANDOM() * 10)::INT),
    'SHELF-' || LPAD(FLOOR(RANDOM() * 20)::TEXT, 2, '0')
FROM pharmacies p
CROSS JOIN drugs d
WHERE ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) <= 40;

-- ============================================================================
-- CUSTOMERS
-- ============================================================================

INSERT INTO customers (
    customer_code, first_name, last_name, phone, email,
    date_of_birth, gender, address, city, pincode,
    allergies, chronic_conditions, loyalty_points, is_active
)
SELECT
    'CUST-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 5, '0'),
    demo_helpers.get_random_male_name(),
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    CURRENT_DATE - (INTERVAL '1 day' * (FLOOR(18 + RANDOM() * 70)::INT * 365)),
    (ARRAY['MALE', 'FEMALE'])[FLOOR(RANDOM() * 2 + 1)::INT],
    demo_helpers.generate_address((ARRAY['Varanasi', 'Lucknow', 'Prayagraj'])[FLOOR(RANDOM() * 3 + 1)::INT]),
    (ARRAY['Varanasi', 'Lucknow', 'Prayagraj'])[FLOOR(RANDOM() * 3 + 1)::INT],
    (ARRAY['221001', '226001', '211001'])[FLOOR(RANDOM() * 3 + 1)::INT],
    (CASE WHEN RANDOM() > 0.8 THEN ARRAY['Penicillin', 'Sulfa'] ELSE NULL END),
    (CASE WHEN RANDOM() > 0.7 THEN ARRAY['Diabetes', 'Hypertension'] ELSE NULL END),
    FLOOR(RANDOM() * 5000)::INT,
    TRUE
FROM GENERATE_SERIES(1, 40);

-- ============================================================================
-- PRESCRIPTIONS
-- ============================================================================

INSERT INTO prescriptions (
    prescription_number, customer_id, doctor_name, doctor_registration_number,
    hospital_name, prescription_date, is_verified, expiry_date
)
SELECT
    'RX-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 5, '0'),
    c.id,
    'Dr. ' || demo_helpers.get_random_male_name(),
    'REG-' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0'),
    (ARRAY['Apollo Hospital', 'Max Healthcare', 'City Hospital', 'District Hospital'])[FLOOR(RANDOM() * 4 + 1)::INT],
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 30)::INT),
    TRUE,
    CURRENT_DATE + (INTERVAL '1 day' * FLOOR(RANDOM() * 90)::INT)
FROM customers c
WHERE ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY RANDOM()) <= 2;

-- ============================================================================
-- PRESCRIPTION ITEMS
-- ============================================================================

INSERT INTO prescription_items (
    prescription_id, drug_id, dosage, frequency, duration_days, quantity
)
SELECT
    p.id,
    d.id,
    '1 tablet',
    (ARRAY['Once daily', 'Twice daily', 'Three times daily'])[FLOOR(RANDOM() * 3 + 1)::INT],
    FLOOR(5 + RANDOM() * 25)::INT,
    FLOOR(5 + RANDOM() * 30)::INT
FROM prescriptions p
CROSS JOIN LATERAL (SELECT * FROM drugs d ORDER BY RANDOM() LIMIT 1) d
WHERE ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) <= 3;

-- ============================================================================
-- SALES INVOICES (POS transactions)
-- ============================================================================

INSERT INTO sales_invoices (
    pharmacy_id, customer_id, prescription_id, invoice_number,
    invoice_type, subtotal, cgst_amount, sgst_amount,
    grand_total, payment_mode, payment_status
)
SELECT
    p.id,
    c.id,
    (SELECT id FROM prescriptions WHERE customer_id = c.id ORDER BY RANDOM() LIMIT 1),
    'INV-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 6, '0'),
    'RETAIL',
    FLOOR(500 + RANDOM() * 3000)::DECIMAL(10, 2),
    FLOOR((500 + RANDOM() * 3000) * 0.06)::DECIMAL(10, 2),
    FLOOR((500 + RANDOM() * 3000) * 0.06)::DECIMAL(10, 2),
    FLOOR((500 + RANDOM() * 3000) * 1.12)::DECIMAL(10, 2),
    (ARRAY['CASH', 'CARD', 'UPI'])[FLOOR(RANDOM() * 3 + 1)::INT],
    'PAID'
FROM pharmacies p
CROSS JOIN customers c
WHERE ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) <= 25;

-- ============================================================================
-- SALE ITEMS (Line items for invoices)
-- ============================================================================

INSERT INTO sale_items (
    invoice_id, drug_id, batch_number, quantity, mrp,
    unit_price, total_price, gst_rate, gst_amount
)
SELECT
    si.id,
    pi.drug_id,
    pi.batch_number,
    FLOOR(1 + RANDOM() * 5)::INT,
    pi.mrp,
    pi.mrp,
    pi.mrp * (FLOOR(1 + RANDOM() * 5)::INT),
    12.0,
    (pi.mrp * (FLOOR(1 + RANDOM() * 5)::INT) * 0.12)::DECIMAL(10, 2)
FROM sales_invoices si
CROSS JOIN LATERAL (
    SELECT pi.* FROM pharmacy_inventory pi
    WHERE pi.pharmacy_id = si.pharmacy_id
    ORDER BY RANDOM() LIMIT 3
) pi;

-- ============================================================================
-- SUPPLIERS
-- ============================================================================

INSERT INTO suppliers (
    supplier_code, supplier_name, contact_person, phone, email,
    gstin, drug_license_number, address, city,
    credit_period_days, is_active
)
SELECT
    'SUP-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 4, '0'),
    (ARRAY['Dr. Reddy Distributors', 'Cipla Supplies', 'Sun Pharma Distribution', 'Lupin Traders', 'Ranbaxy Supply'])[FLOOR(RANDOM() * 5 + 1)::INT],
    demo_helpers.get_random_male_name(),
    demo_helpers.generate_phone_number(),
    demo_helpers.generate_email(demo_helpers.get_random_male_name()),
    demo_helpers.generate_gst_number(),
    'DL-' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0'),
    demo_helpers.generate_address('Varanasi'),
    'Varanasi',
    FLOOR(15 + RANDOM() * 45)::INT,
    TRUE
FROM GENERATE_SERIES(1, 8);

-- ============================================================================
-- PURCHASE ORDERS
-- ============================================================================

INSERT INTO purchase_orders (
    pharmacy_id, supplier_id, po_number, po_date,
    expected_delivery_date, subtotal, gst_amount, total_amount, po_status
)
SELECT
    p.id,
    s.id,
    'PO-' || LPAD(ROW_NUMBER() OVER (ORDER BY RANDOM())::TEXT, 5, '0'),
    CURRENT_DATE - (INTERVAL '1 day' * FLOOR(RANDOM() * 15)::INT),
    CURRENT_DATE + (INTERVAL '1 day' * FLOOR(RANDOM() * 7)::INT),
    FLOOR(50000 + RANDOM() * 150000)::DECIMAL(12, 2),
    FLOOR((50000 + RANDOM() * 150000) * 0.12)::DECIMAL(10, 2),
    FLOOR((50000 + RANDOM() * 150000) * 1.12)::DECIMAL(12, 2),
    (ARRAY['PENDING', 'CONFIRMED', 'RECEIVED'])[FLOOR(RANDOM() * 3 + 1)::INT]
FROM pharmacies p
CROSS JOIN suppliers s
WHERE ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) <= 3;

-- ============================================================================
-- STOCK ALERTS
-- ============================================================================

INSERT INTO stock_alerts (
    pharmacy_id, drug_id, alert_type, current_stock,
    min_stock_level, expiry_date, days_to_expiry, is_resolved
)
SELECT
    pi.pharmacy_id,
    pi.drug_id,
    CASE
        WHEN pi.quantity_in_stock < 20 THEN 'LOW_STOCK'
        WHEN pi.expiry_date < CURRENT_DATE + INTERVAL '30 days' THEN 'EXPIRY_SOON'
        ELSE 'EXPIRED'
    END,
    pi.quantity_in_stock,
    20,
    pi.expiry_date,
    (pi.expiry_date - CURRENT_DATE)::INT,
    FALSE
FROM pharmacy_inventory pi
WHERE pi.quantity_in_stock < 30 OR pi.expiry_date < CURRENT_DATE + INTERVAL '60 days'
LIMIT 40;

-- ============================================================================
-- DAILY SALES SUMMARY
-- ============================================================================

INSERT INTO daily_sales_summary (
    pharmacy_id, summary_date,
    total_invoices, total_items_sold, gross_revenue, total_discount,
    net_revenue, prescription_sales, otc_sales
)
SELECT
    p.id,
    CURRENT_DATE - (INTERVAL '1 day' * days.day),
    FLOOR(RANDOM() * 30)::INT,
    FLOOR(RANDOM() * 100)::INT,
    FLOOR(RANDOM() * 50000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 2000)::DECIMAL(10, 2),
    FLOOR(RANDOM() * 45000)::DECIMAL(12, 2),
    FLOOR(RANDOM() * 20)::INT,
    FLOOR(RANDOM() * 15)::INT
FROM pharmacies p
CROSS JOIN (SELECT GENERATE_SERIES(0, 60) AS day) days;

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT
    (SELECT COUNT(*) FROM pharmacy_chains) as "Total Pharmacy Chains",
    (SELECT COUNT(*) FROM pharmacies) as "Total Pharmacy Outlets",
    (SELECT COUNT(*) FROM drugs) as "Total Drugs in Catalog",
    (SELECT COUNT(*) FROM pharmacy_inventory) as "Inventory Records",
    (SELECT COUNT(*) FROM customers) as "Total Customers",
    (SELECT COUNT(*) FROM prescriptions) as "Total Prescriptions",
    (SELECT COUNT(*) FROM sales_invoices) as "Total Sales Invoices",
    (SELECT SUM(grand_total) FROM sales_invoices) as "Total Sales Revenue",
    (SELECT COUNT(*) FROM stock_alerts WHERE is_resolved = FALSE) as "Active Stock Alerts"
    AS "Pharmacy Management Demo Data Summary";
