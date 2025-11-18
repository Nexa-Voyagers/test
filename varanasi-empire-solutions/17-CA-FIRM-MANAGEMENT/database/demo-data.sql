-- ============================================================================
-- CA FIRM MANAGEMENT SYSTEM - COMPREHENSIVE DEMO DATA
-- Varanasi Empire Solution
-- ============================================================================

-- Insert CA firms (2-3 firms)
INSERT INTO ca_firms (firm_name, firm_legal_name, registration_number, icai_registration_number, pan_number, gstin, tan_number, firm_type, establishment_year, head_office_address, contact_email, contact_phone, website, services_offered, is_active)
VALUES
('Varanasi Tax Consultants', 'Varanasi Tax Consultants LLP', 'REG-UP-2015-001', 'ICAI-001234', 'ABCDE1234F', '09ABCDE1234F1Z5', 'TRUST190001A', 'LLP', 2015, '145 Business Plaza, Varanasi, UP 221001', 'info@varanasitax.com', '9876543801', 'www.varanasitax.com', '{"GST", "ITR", "AUDIT", "ACCOUNTING", "TAX_PLANNING"}', true),
('Lucknow Professional Services', 'Lucknow Professional Services & Co.', 'REG-UP-2010-002', 'ICAI-005678', 'BCDEF2345G', '09BCDEF2345G1Z5', 'TRUST190002B', 'PARTNERSHIP', 2010, '221 Corporate Center, Lucknow, UP 226001', 'contact@lps.com', '9876543802', 'www.lucknowprofessional.com', '{"GST", "ITR", "AUDIT", "COMPANY_FORMATION", "ROC"}', true),
('Kanpur Audit & Compliance', 'Kanpur Audit & Compliance Firm', 'REG-UP-2018-003', 'ICAI-009012', 'CDEFG3456H', '09CDEFG3456H1Z5', 'TRUST190003C', 'PROPRIETORSHIP', 2018, '456 Audit House, Kanpur, UP 208001', 'support@kac.co.in', '9876543803', 'www.kanpuraudit.com', '{"AUDIT", "TAX_PLANNING", "TDS", "ACCOUNTING"}', true);

-- Insert firm branches
INSERT INTO firm_branches (firm_id, branch_name, branch_code, address_line1, city, district, state, pincode, branch_head_name, branch_phone, branch_email, total_staff, total_clients, is_active)
SELECT f.id, 'Main Office', 'BRANCH-001', '145 Business Plaza', 'Varanasi', 'Varanasi', 'Uttar Pradesh', '221001', 'Rajesh Kumar Singh', '9876543804', 'rajesh@varanasitax.com', 12, 85, true
FROM ca_firms f WHERE f.firm_name = 'Varanasi Tax Consultants'
UNION ALL
SELECT f.id, 'Satellite Branch', 'BRANCH-002', '567 Finance District', 'Jaunpur', 'Jaunpur', 'Uttar Pradesh', '222001', 'Priya Verma', '9876543805', 'priya@varanasitax.com', 5, 25, true
FROM ca_firms f WHERE f.firm_name = 'Varanasi Tax Consultants'
UNION ALL
SELECT f.id, 'Head Office', 'BRANCH-003', '221 Corporate Center', 'Lucknow', 'Lucknow', 'Uttar Pradesh', '226001', 'Vikram Singh', '9876543806', 'vikram@lps.com', 15, 120, true
FROM ca_firms f WHERE f.firm_name = 'Lucknow Professional Services'
UNION ALL
SELECT f.id, 'Main Office', 'BRANCH-004', '456 Audit House', 'Kanpur', 'Kanpur', 'Uttar Pradesh', '208001', 'Arun Sharma', '9876543807', 'arun@kac.co.in', 8, 65, true
FROM ca_firms f WHERE f.firm_name = 'Kanpur Audit & Compliance';

-- Insert CA staff (10-15 CAs)
INSERT INTO staff (firm_id, branch_id, employee_code, first_name, middle_name, last_name, date_of_birth, gender, phone, email, designation, staff_category, icai_membership_number, icai_membership_type, year_of_qualification, date_of_joining, employment_type, basic_salary, bank_account_number, bank_ifsc, system_username, system_role, specialization, employment_status, is_active)
VALUES
-- Varanasi firm
((SELECT id FROM ca_firms WHERE firm_name = 'Varanasi Tax Consultants'), (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-001'), 'EMP-001', 'Rajesh', 'Kumar', 'Singh', '1965-06-15'::DATE, 'MALE', '9876543810', 'rajesh.singh@varanasitax.com', 'CA', 'CHARTERED_ACCOUNTANT', 'FCA-001234', 'FCA', 1990, '2015-01-01'::DATE, 'PARTNER', 150000.00, '10234567890', 'SBIN0002145', 'rajesh_singh', 'ADMIN', '{"GST", "ITR", "AUDIT", "TAX_PLANNING"}', 'ACTIVE', true),
((SELECT id FROM ca_firms WHERE firm_name = 'Varanasi Tax Consultants'), (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-001'), 'EMP-002', 'Priya', 'Sharma', 'Verma', '1970-03-22'::DATE, 'FEMALE', '9876543811', 'priya.verma@varanasitax.com', 'CA', 'CHARTERED_ACCOUNTANT', 'ACA-002345', 'ACA', 2002, '2016-06-15'::DATE, 'PERMANENT', 120000.00, '10234567891', 'SBIN0002145', 'priya_verma', 'CA', '{"GST", "ITR", "ACCOUNTING"}', 'ACTIVE', true),
((SELECT id FROM ca_firms WHERE firm_name = 'Varanasi Tax Consultants'), (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-001'), 'EMP-003', 'Arun', 'Kumar', 'Pandey', '1968-07-10'::DATE, 'MALE', '9876543812', 'arun.pandey@varanasitax.com', 'CA', 'CHARTERED_ACCOUNTANT', 'ACA-003456', 'ACA', 2000, '2017-07-01'::DATE, 'PERMANENT', 115000.00, '10234567892', 'HDFC0000456', 'arun_pandey', 'CA', '{"AUDIT", "TAX_PLANNING", "ACCOUNTING"}', 'ACTIVE', true),
((SELECT id FROM ca_firms WHERE firm_name = 'Varanasi Tax Consultants'), (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-001'), 'EMP-004', 'Deepika', 'Singh', 'Tiwari', '1972-11-05'::DATE, 'FEMALE', '9876543813', 'deepika.tiwari@varanasitax.com', 'CA', 'CHARTERED_ACCOUNTANT', 'FCA-004567', 'FCA', 1998, '2016-08-15'::DATE, 'PERMANENT', 125000.00, '10234567893', 'ICIC0000789', 'deepika_tiwari', 'CA', '{"GST", "AUDIT"}', 'ACTIVE', true),
((SELECT id FROM ca_firms WHERE firm_name = 'Varanasi Tax Consultants'), (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-002'), 'EMP-005', 'Vikram', 'Singh', 'Yadav', '1975-02-14'::DATE, 'MALE', '9876543814', 'vikram.yadav@varanasitax.com', 'CA', 'CHARTERED_ACCOUNTANT', 'ACA-005678', 'ACA', 2003, '2018-04-01'::DATE, 'PERMANENT', 105000.00, '10234567894', 'SBIN0002145', 'vikram_yadav', 'CA', '{"GST", "ITR"}', 'ACTIVE', true),
-- Lucknow firm
((SELECT id FROM ca_firms WHERE firm_name = 'Lucknow Professional Services'), (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-003'), 'EMP-006', 'Meera', 'Devi', 'Kumar', '1978-05-20'::DATE, 'FEMALE', '9876543815', 'meera.kumar@lps.com', 'CA', 'CHARTERED_ACCOUNTANT', 'FCA-006789', 'FCA', 1999, '2010-06-15'::DATE, 'PARTNER', 140000.00, '10234567895', 'SBIN0002145', 'meera_kumar', 'ADMIN', '{"AUDIT", "COMPANY_FORMATION", "ROC"}', 'ACTIVE', true),
((SELECT id FROM ca_firms WHERE firm_name = 'Lucknow Professional Services'), (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-003'), 'EMP-007', 'Suresh', 'Mohan', 'Tripathi', '1976-08-10'::DATE, 'MALE', '9876543816', 'suresh.tripathi@lps.com', 'CA', 'CHARTERED_ACCOUNTANT', 'ACA-007890', 'ACA', 2004, '2018-07-01'::DATE, 'PERMANENT', 110000.00, '10234567896', 'HDFC0000456', 'suresh_tripathi', 'CA', '{"GST", "ACCOUNTING"}', 'ACTIVE', true),
((SELECT id FROM ca_firms WHERE firm_name = 'Lucknow Professional Services'), (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-003'), 'EMP-008', 'Neha', 'Sharma', 'Singh', '1980-12-25'::DATE, 'FEMALE', '9876543817', 'neha.singh@lps.com', 'CA', 'CHARTERED_ACCOUNTANT', 'ACA-008901', 'ACA', 2006, '2019-08-15'::DATE, 'PERMANENT', 100000.00, '10234567897', 'ICIC0000789', 'neha_singh', 'CA', '{"ITR", "AUDIT"}', 'ACTIVE', true),
-- Kanpur firm
((SELECT id FROM ca_firms WHERE firm_name = 'Kanpur Audit & Compliance'), (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-004'), 'EMP-009', 'Amit', 'Kumar', 'Mishra', '1979-04-16'::DATE, 'MALE', '9876543818', 'amit.mishra@kac.co.in', 'CA', 'CHARTERED_ACCOUNTANT', 'FCA-009012', 'FCA', 1997, '2018-07-01'::DATE, 'PARTNER', 135000.00, '10234567898', 'SBIN0002145', 'amit_mishra', 'ADMIN', '{"AUDIT", "TAX_PLANNING", "TDS"}', 'ACTIVE', true),
((SELECT id FROM ca_firms WHERE firm_name = 'Kanpur Audit & Compliance'), (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-004'), 'EMP-010', 'Kavita', 'Singh', 'Gupta', '1982-09-08'::DATE, 'FEMALE', '9876543819', 'kavita.gupta@kac.co.in', 'CA', 'CHARTERED_ACCOUNTANT', 'ACA-010123', 'ACA', 2007, '2019-08-01'::DATE, 'PERMANENT', 98000.00, '10234567899', 'HDFC0000456', 'kavita_gupta', 'CA', '{"GST", "AUDIT"}', 'ACTIVE', true),
-- Support staff
((SELECT id FROM ca_firms WHERE firm_name = 'Varanasi Tax Consultants'), (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-001'), 'EMP-011', 'Rajesh', 'Kumar', 'Verma', '1981-01-30'::DATE, 'MALE', '9876543820', 'rajesh.verma@varanasitax.com', 'Accountant', 'STAFF_ACCOUNTANT', NULL, NULL, NULL, '2020-07-01'::DATE, 'PERMANENT', 50000.00, '10234567900', 'ICIC0000789', 'rajesh_verma', 'ACCOUNTANT', '{"ACCOUNTING"}', 'ACTIVE', true),
((SELECT id FROM ca_firms WHERE firm_name = 'Lucknow Professional Services'), (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-003'), 'EMP-012', 'Priya', 'Devi', 'Sharma', '1983-07-12'::DATE, 'FEMALE', '9876543821', 'priya.sharma@lps.com', 'Accountant', 'STAFF_ACCOUNTANT', NULL, NULL, NULL, '2020-08-15'::DATE, 'PERMANENT', 48000.00, '10234567901', 'SBIN0002145', 'priya_sharma', 'ACCOUNTANT', '{"ACCOUNTING"}', 'ACTIVE', true);

-- Insert clients (30+ clients)
INSERT INTO clients (firm_id, branch_id, client_code, client_type, client_name, first_name, last_name, phone, email, pan_number, gstin, services_subscribed, primary_ca_id, annual_turnover, financial_year_end_date, onboarding_date, client_status, is_active)
WITH client_sample AS (
  SELECT row_number() OVER (ORDER BY RANDOM()) as rn FROM generate_series(1, 35)
)
SELECT
  CASE WHEN cs.rn <= 15 THEN (SELECT id FROM ca_firms WHERE firm_name = 'Varanasi Tax Consultants')
       WHEN cs.rn <= 25 THEN (SELECT id FROM ca_firms WHERE firm_name = 'Lucknow Professional Services')
       ELSE (SELECT id FROM ca_firms WHERE firm_name = 'Kanpur Audit & Compliance') END,
  CASE WHEN cs.rn <= 15 THEN (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-001')
       WHEN cs.rn <= 25 THEN (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-003')
       ELSE (SELECT id FROM firm_branches WHERE branch_code = 'BRANCH-004') END,
  'CLT-' || LPAD(cs.rn::TEXT, 4, '0'),
  (ARRAY['INDIVIDUAL', 'INDIVIDUAL', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PRIVATE_LTD', 'PUBLIC_LTD'])[1 + FLOOR(RANDOM() * 7)::INT],
  CASE
    WHEN (ARRAY['INDIVIDUAL', 'INDIVIDUAL', 'PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PRIVATE_LTD', 'PUBLIC_LTD'])[1 + FLOOR(RANDOM() * 7)::INT] IN ('INDIVIDUAL', 'PROPRIETORSHIP') THEN NULL
    ELSE (ARRAY['Varanasi Textiles Ltd', 'Lucknow Foods Pvt Ltd', 'Kanpur Industries', 'Agra Exports Ltd', 'Jaunpur Trading Co', 'UP Digital Services', 'Varanasi Tech Solutions', 'Northern Business Group', 'Eastern Export House', 'Midwest Consultants'])[1 + FLOOR(RANDOM() * 10)::INT]
  END,
  (ARRAY['Rajesh', 'Priya', 'Arun', 'Deepika', 'Vikram', 'Meera', 'Suresh', 'Neha', 'Amit', 'Kavita', 'Yogesh', 'Divya', 'Hemant', 'Geeta', 'Ramesh'])[1 + FLOOR(RANDOM() * 15)::INT],
  (ARRAY['Singh', 'Kumar', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Mishra', 'Yadav', 'Pandey'])[1 + FLOOR(RANDOM() * 9)::INT],
  '987654' || LPAD((7800 + cs.rn)::TEXT, 4, '0'),
  'client' || cs.rn || '@email.com',
  'ABCDE' || LPAD(cs.rn::TEXT, 4, '0') || 'F',
  CASE WHEN RANDOM() > 0.5 THEN '09ABCDE' || LPAD(cs.rn::TEXT, 4, '0') || '1Z5' ELSE NULL END,
  (ARRAY['{"GST_FILING", "ITR_FILING"}', '{"GST_FILING", "ACCOUNTING"}', '{"AUDIT", "TAX_PLANNING"}', '{"GST_FILING", "ITR_FILING", "AUDIT"}'])[1 + FLOOR(RANDOM() * 4)::INT]::TEXT[],
  CASE WHEN cs.rn <= 15 THEN (SELECT id FROM staff WHERE firm_id = (SELECT id FROM ca_firms WHERE firm_name = 'Varanasi Tax Consultants') AND designation = 'CA' LIMIT 1)
       WHEN cs.rn <= 25 THEN (SELECT id FROM staff WHERE firm_id = (SELECT id FROM ca_firms WHERE firm_name = 'Lucknow Professional Services') AND designation = 'CA' LIMIT 1)
       ELSE (SELECT id FROM staff WHERE firm_id = (SELECT id FROM ca_firms WHERE firm_name = 'Kanpur Audit & Compliance') AND designation = 'CA' LIMIT 1) END,
  FLOOR(RANDOM() * 50000000 + 1000000)::DECIMAL(15,2),
  '2025-03-31'::DATE,
  CURRENT_DATE - (FLOOR(RANDOM() * 1000))::INT,
  (ARRAY['ACTIVE', 'ACTIVE', 'ACTIVE', 'INACTIVE'])[1 + FLOOR(RANDOM() * 4)::INT],
  true
FROM client_sample cs;

-- Insert GST returns (20-25 returns)
INSERT INTO gst_returns (client_id, firm_id, gstin, return_type, return_period, financial_year, due_date, filed_date, filing_status, total_taxable_value, total_cgst, total_sgst, total_igst, net_tax_payable, assigned_to, prepared_by)
SELECT
  c.id,
  c.firm_id,
  (c.gstin ARRAY[FLOOR(RANDOM() * 5)::INT] || LPAD(ROW_NUMBER() OVER (ORDER BY c.id)::TEXT, 4, '0')),
  (ARRAY['GSTR1', 'GSTR3B', 'GSTR4'])[1 + FLOOR(RANDOM() * 3)::INT],
  LPAD(FLOOR(RANDOM() * 12 + 1)::TEXT, 2, '0') || '-2024',
  '2024-25',
  CURRENT_DATE - (FLOOR(RANDOM() * 30)::INT),
  CASE WHEN RANDOM() > 0.3 THEN CURRENT_DATE - (FLOOR(RANDOM() * 10)::INT) ELSE NULL END,
  (ARRAY['PENDING', 'IN_PROGRESS', 'FILED', 'FILED'])[1 + FLOOR(RANDOM() * 4)::INT],
  FLOOR(RANDOM() * 5000000 + 500000)::DECIMAL(15,2),
  FLOOR(RANDOM() * 500000 + 50000)::DECIMAL(12,2),
  FLOOR(RANDOM() * 500000 + 50000)::DECIMAL(12,2),
  FLOOR(RANDOM() * 200000 + 20000)::DECIMAL(12,2),
  FLOOR(RANDOM() * 500000 + 50000)::DECIMAL(12,2),
  (SELECT id FROM staff WHERE firm_id = c.firm_id AND designation = 'CA' LIMIT 1),
  (SELECT id FROM staff WHERE firm_id = c.firm_id AND designation = 'CA' LIMIT 1)
FROM clients c
WHERE c.gstin IS NOT NULL
LIMIT 25;

-- Insert ITR filings (15-20 filings)
INSERT INTO itr_filings (client_id, firm_id, assessment_year, financial_year, itr_form_type, due_date, filing_status, gross_total_income, taxable_income, total_tax_liability, tds_deducted, total_tax_paid, refund_amount, assigned_to, prepared_by)
SELECT
  c.id,
  c.firm_id,
  '2024-25',
  '2023-24',
  (ARRAY['ITR1', 'ITR2', 'ITR3', 'ITR4'])[1 + FLOOR(RANDOM() * 4)::INT],
  CURRENT_DATE - (FLOOR(RANDOM() * 60)::INT),
  (ARRAY['PENDING', 'IN_PROGRESS', 'FILED'])[1 + FLOOR(RANDOM() * 3)::INT],
  FLOOR(RANDOM() * 5000000 + 500000)::DECIMAL(15,2),
  FLOOR(RANDOM() * 4000000 + 400000)::DECIMAL(15,2),
  FLOOR(RANDOM() * 800000 + 100000)::DECIMAL(12,2),
  FLOOR(RANDOM() * 500000 + 50000)::DECIMAL(10,2),
  FLOOR(RANDOM() * 600000 + 80000)::DECIMAL(12,2),
  FLOOR(RANDOM() * 200000 + 20000)::DECIMAL(12,2),
  (SELECT id FROM staff WHERE firm_id = c.firm_id AND designation = 'CA' LIMIT 1),
  (SELECT id FROM staff WHERE firm_id = c.firm_id AND designation = 'CA' LIMIT 1)
FROM clients c
LIMIT 20;

-- Insert invoices (25-30 invoices)
INSERT INTO invoices (firm_id, branch_id, client_id, invoice_number, invoice_date, billing_period_from, billing_period_to, subtotal, taxable_amount, cgst_amount, sgst_amount, igst_amount, total_gst, grand_total, payment_status, amount_paid, balance_amount, prepared_by)
SELECT
  inv.firm_id,
  inv.branch_id,
  inv.client_id,
  'INV-' || LPAD(ROW_NUMBER() OVER (ORDER BY inv.client_id)::TEXT, 5, '0'),
  CURRENT_DATE - (ROW_NUMBER() OVER (ORDER BY inv.client_id) * 7),
  CURRENT_DATE - (ROW_NUMBER() OVER (ORDER BY inv.client_id) * 7) - '30 days'::INTERVAL,
  CURRENT_DATE - (ROW_NUMBER() OVER (ORDER BY inv.client_id) * 7),
  FLOOR(RANDOM() * 50000 + 5000)::DECIMAL(10,2),
  FLOOR(RANDOM() * 50000 + 5000)::DECIMAL(10,2),
  (FLOOR(RANDOM() * 50000 + 5000) * 0.09)::DECIMAL(10,2),
  (FLOOR(RANDOM() * 50000 + 5000) * 0.09)::DECIMAL(10,2),
  0.00,
  ((FLOOR(RANDOM() * 50000 + 5000) * 0.09) + (FLOOR(RANDOM() * 50000 + 5000) * 0.09))::DECIMAL(10,2),
  (FLOOR(RANDOM() * 50000 + 5000) + ((FLOOR(RANDOM() * 50000 + 5000) * 0.09) + (FLOOR(RANDOM() * 50000 + 5000) * 0.09)))::DECIMAL(10,2),
  (ARRAY['PAID', 'PAID', 'PARTIAL', 'UNPAID'])[1 + FLOOR(RANDOM() * 4)::INT],
  CASE WHEN RANDOM() > 0.5 THEN FLOOR(RANDOM() * 40000 + 5000)::DECIMAL(10,2) ELSE 0.00 END,
  (FLOOR(RANDOM() * 50000 + 5000) + ((FLOOR(RANDOM() * 50000 + 5000) * 0.09) + (FLOOR(RANDOM() * 50000 + 5000) * 0.09))) - CASE WHEN RANDOM() > 0.5 THEN FLOOR(RANDOM() * 40000 + 5000)::DECIMAL(10,2) ELSE 0.00 END,
  (SELECT id FROM staff WHERE designation = 'CA' LIMIT 1)
FROM (
  SELECT c.id as client_id, c.firm_id, c.branch_id
  FROM clients c
  ORDER BY RANDOM()
  LIMIT 28
) inv;

-- Summary
SELECT 'CA Firm Management Demo Data Loaded Successfully!' AS Status;
SELECT COUNT(*) AS "Total CAs" FROM staff WHERE staff_category = 'CHARTERED_ACCOUNTANT';
SELECT COUNT(*) AS "Total Clients" FROM clients;
SELECT COUNT(*) AS "Total GST Returns" FROM gst_returns;
SELECT COUNT(*) AS "Total ITR Filings" FROM itr_filings;
SELECT COUNT(*) AS "Total Invoices" FROM invoices;
