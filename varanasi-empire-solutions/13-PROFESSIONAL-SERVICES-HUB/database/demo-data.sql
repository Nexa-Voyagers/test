-- ============================================================================
-- PROFESSIONAL SERVICES HUB - Comprehensive Demo Data
-- Varanasi Focus: Legal, Consulting, Audit, Advisory Services
-- ============================================================================

SET search_path TO public, demo_helpers;

-- ============================================================================
-- SERVICE FIRMS (2-3 professional service firms)
-- ============================================================================
INSERT INTO service_firms (firm_name, firm_type, registration_number, address, phone, email, is_active) VALUES
('Varanasi Legal Associates', 'LEGAL', 'BCI/2015/REG/001', '45 Court Road, Legal Complex, Varanasi', '9876545000', 'contact@varanasi-legal.in', true),
('Sharma & Associates Consulting', 'CONSULTING', 'ICAI/2014/REG/456', '123 Business Plaza, Lucknow Advisory Center', 'Lucknow', 'consulting@sharma-associates.in', true),
('Agra Professional Services', 'AUDIT', 'ICAI/2016/REG/789', 'Audit Complex, Fatehabad Road, Agra', '9876545002', 'audit@agra-professionals.in', true);

-- ============================================================================
-- PROFESSIONALS (20+ professionals - lawyers, CAs, architects, consultants)
-- ============================================================================
INSERT INTO professionals (firm_id, professional_code, first_name, last_name, designation, specialization, bar_council_number, phone, email, hourly_rate, is_active) VALUES
-- Varanasi Legal Associates
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), 'PRO001', 'Rajesh', 'Singh', 'Senior Advocate', ARRAY['Criminal Law', 'Constitutional Law'], 'BCI/UP/2005/001', '9876545100', 'rajesh@varanasi-legal.in', 1500.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), 'PRO002', 'Priya', 'Verma', 'Advocate', ARRAY['Family Law', 'Property Disputes'], 'BCI/UP/2010/002', '9876545101', 'priya@varanasi-legal.in', 900.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), 'PRO003', 'Arun', 'Pandey', 'Advocate', ARRAY['Corporate Law', 'Contract Law'], 'BCI/UP/2008/003', '9876545102', 'arun@varanasi-legal.in', 1000.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), 'PRO004', 'Meera', 'Sharma', 'Legal Consultant', ARRAY['Intellectual Property', 'Patents'], NULL, '9876545103', 'meera@varanasi-legal.in', 800.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), 'PRO005', 'Vikram', 'Trivedi', 'Senior Advocate', ARRAY['Criminal Law', 'Civil Litigation'], 'BCI/UP/2003/004', '9876545104', 'vikram@varanasi-legal.in', 1600.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), 'PRO006', 'Anjali', 'Singh', 'Advocate', ARRAY['Labor Law', 'Employment'], 'BCI/UP/2011/005', '9876545105', 'anjali@varanasi-legal.in', 850.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), 'PRO007', 'Deepak', 'Gupta', 'Advocate', ARRAY['Real Estate Law', 'Property Rights'], 'BCI/UP/2009/006', '9876545106', 'deepak@varanasi-legal.in', 950.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), 'PRO008', 'Neha', 'Mishra', 'Legal Associate', ARRAY['Contracts', 'Document Review'], NULL, '9876545107', 'neha@varanasi-legal.in', 600.00, true),
-- Sharma & Associates Consulting
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), 'PRO009', 'Dr. Ashok', 'Sharma', 'Lead Consultant', ARRAY['Financial Consulting', 'Tax Planning', 'CFO Advisory'], 'FCA/2005/007', '9876545108', 'ashok@sharma-associates.in', 2000.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), 'PRO010', 'Rajesh', 'Joshi', 'Management Consultant', ARRAY['Business Strategy', 'Operations'], 'ICAI/2010/008', '9876545109', 'rajesh@sharma-associates.in', 1500.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), 'PRO011', 'Priya', 'Agarwal', 'IT Consultant', ARRAY['Digital Transformation', 'ERP Implementation'], 'ICAI/2012/009', '9876545110', 'priya@sharma-associates.in', 1800.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), 'PRO012', 'Vikram', 'Desai', 'HR Consultant', ARRAY['Organizational Development', 'HR Policies'], 'ICAI/2011/010', '9876545111', 'vikram@sharma-associates.in', 1200.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), 'PRO013', 'Sunita', 'Patel', 'Financial Analyst', ARRAY['Financial Analysis', 'Investment Advisory'], 'CFA/2013/011', '9876545112', 'sunita@sharma-associates.in', 1100.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), 'PRO014', 'Ravi', 'Singh', 'Business Consultant', ARRAY['Process Improvement', 'Quality Management'], 'ICAI/2009/012', '9876545113', 'ravi@sharma-associates.in', 1400.00, true),
-- Agra Professional Services
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), 'PRO015', 'CA Ramesh', 'Verma', 'Chartered Accountant', ARRAY['Auditing', 'Taxation', 'GST'], 'ICAI/2004/013', '9876545114', 'ramesh@agra-professionals.in', 1700.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), 'PRO016', 'Divya', 'Kumar', 'Chartered Accountant', ARRAY['Financial Accounting', 'Internal Audit'], 'ICAI/2008/014', '9876545115', 'divya@agra-professionals.in', 1300.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), 'PRO017', 'Arjun', 'Reddy', 'Architect & Consultant', ARRAY['Project Planning', 'Building Design'], 'AMAI/2007/015', '9876545116', 'arjun@agra-professionals.in', 1600.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), 'PRO018', 'Pooja', 'Saxena', 'Chartered Accountant', ARRAY['Compliance', 'Taxation'], 'ICAI/2010/016', '9876545117', 'pooja@agra-professionals.in', 1200.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), 'PRO019', 'Sanjeev', 'Kapoor', 'Management Auditor', ARRAY['Internal Audit', 'Compliance Audit'], 'ICAI/2009/017', '9876545118', 'sanjeev@agra-professionals.in', 1400.00, true),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), 'PRO020', 'Kavya', 'Menon', 'Financial Advisor', ARRAY['Wealth Management', 'Investment Planning'], 'SEBI/2011/018', '9876545119', 'kavya@agra-professionals.in', 1100.00, true);

-- ============================================================================
-- CLIENTS (30+ clients)
-- ============================================================================
INSERT INTO clients (client_code, client_type, first_name, last_name, company_name, phone, email, address, is_active) VALUES
-- Individual Clients
('CLI001', 'INDIVIDUAL', 'Rajesh', 'Sharma', NULL, '9876545200', 'rajesh.cli@email.com', 'Flat 201, Heritage Heights, Varanasi', true),
('CLI002', 'INDIVIDUAL', 'Priya', 'Singh', NULL, '9876545201', 'priya.cli@email.com', 'House 45, Ashok Vihar, Varanasi', true),
('CLI003', 'INDIVIDUAL', 'Amit', 'Verma', NULL, '9876545202', 'amit.cli@email.com', 'Apartment 12, Scholar Colony, Varanasi', true),
('CLI004', 'INDIVIDUAL', 'Anjali', 'Patel', NULL, '9876545203', 'anjali.cli@email.com', 'Flat 105, Garden View, Varanasi', true),
('CLI005', 'INDIVIDUAL', 'Vikram', 'Pandey', NULL, '9876545204', 'vikram.cli@email.com', 'House 78, Cantonment, Varanasi', true),
('CLI006', 'INDIVIDUAL', 'Neha', 'Gupta', NULL, '9876545205', 'neha.cli@email.com', 'Apartment 8, Govind Vihar, Varanasi', true),
('CLI007', 'INDIVIDUAL', 'Arjun', 'Singh', NULL, '9876545206', 'arjun.cli@email.com', 'Villa 5, Elite Colony, Varanasi', true),
('CLI008', 'INDIVIDUAL', 'Divya', 'Kumar', NULL, '9876545207', 'divya.cli@email.com', 'Flat 302, Medical Gardens, Varanasi', true),
('CLI009', 'INDIVIDUAL', 'Suresh', 'Mishra', NULL, '9876545208', 'suresh.cli@email.com', 'House 156, Saket Nagar, Varanasi', true),
('CLI010', 'INDIVIDUAL', 'Meera', 'Sharma', NULL, '9876545209', 'meera.cli@email.com', 'Apartment 9, Heritage Enclave, Varanasi', true),
('CLI011', 'INDIVIDUAL', 'Rajeev', 'Kumar', NULL, '9876545210', 'rajeev.cli@email.com', 'Flat 201, IAS Complex, Lucknow', true),
('CLI012', 'INDIVIDUAL', 'Anjali', 'Singh', NULL, '9876545211', 'anjali2.cli@email.com', 'Apartment 12, Premium Heights, Lucknow', true),
('CLI013', 'INDIVIDUAL', 'Praveen', 'Sharma', NULL, '9876545212', 'praveen.cli@email.com', 'House 78, Civil Lines, Lucknow', true),
('CLI014', 'INDIVIDUAL', 'Isha', 'Patel', NULL, '9876545213', 'isha.cli@email.com', 'House 234, Health Vihar, Agra', true),
('CLI015', 'INDIVIDUAL', 'Nikhil', 'Menon', NULL, '9876545214', 'nikhil.cli@email.com', 'Flat 208, Wellness Center, Agra', true),
-- Corporate Clients
('COR001', 'CORPORATE', NULL, NULL, 'Tech Solutions India Pvt Ltd', '9876545215', 'legal@techsolutions.in', 'IT Park, Varanasi', true),
('COR002', 'CORPORATE', NULL, NULL, 'Manufacturing Corp Limited', '9876545216', 'admin@manuf-corp.in', 'Industrial Area, Lucknow', true),
('COR003', 'CORPORATE', NULL, NULL, 'Retail Express Chain', '9876545217', 'compliance@retailexpress.in', 'Commerce Hub, Varanasi', true),
('COR004', 'CORPORATE', NULL, NULL, 'Healthcare Services Private Limited', '9876545218', 'hr@healthcare-services.in', 'Medical District, Agra', true),
('COR005', 'CORPORATE', NULL, NULL, 'Education Plus Institute', '9876545219', 'accounts@eduplus.in', 'Academic Campus, Lucknow', true),
('COR006', 'CORPORATE', NULL, NULL, 'Real Estate Builders Pvt Ltd', '9876545220', 'legal@rebuild.in', 'Construction Hub, Varanasi', true),
('COR007', 'CORPORATE', NULL, NULL, 'Finance Advisory Group', '9876545221', 'compliance@financeadv.in', 'Business Center, Agra', true),
('COR008', 'CORPORATE', NULL, NULL, 'Logistics & Transport Services', '9876545222', 'admin@logisticsplus.in', 'Transport Hub, Lucknow', true),
('COR009', 'CORPORATE', NULL, NULL, 'Agricultural Products Export', '9876545223', 'exports@agroprod.in', 'Trade Center, Varanasi', true),
('COR010', 'CORPORATE', NULL, NULL, 'Pharmaceutical Manufacturing Ltd', '9876545224', 'compliance@pharma-mfg.in', 'Industrial Zone, Agra', true),
('COR011', 'CORPORATE', NULL, NULL, 'Hotel & Hospitality Group', '9876545225', 'legal@hotelgroup.in', 'Hospitality Hub, Varanasi', true),
('COR012', 'CORPORATE', NULL, NULL, 'Insurance Brokers International', '9876545226', 'compliance@insbrokers.in', 'Finance Center, Lucknow', true),
('COR013', 'CORPORATE', NULL, NULL, 'Textile Export Corporation', '9876545227', 'legal@textileexport.in', 'Textile Hub, Varanasi', true),
('COR014', 'CORPORATE', NULL, NULL, 'Construction & Engineering', '9876545228', 'admin@conengineering.in', 'Project Office, Agra', true),
('COR015', 'CORPORATE', NULL, NULL, 'Energy Solutions Pvt Ltd', '9876545229', 'compliance@energysol.in', 'Tech Park, Lucknow', true);

-- ============================================================================
-- CASES (40+ cases)
-- ============================================================================
INSERT INTO cases (firm_id, client_id, case_number, case_title, case_type, court_name, case_status, filing_date, next_hearing_date, assigned_to, created_at) VALUES
-- Varanasi Legal Associates Cases
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI001'), 'CASE001', 'Property Dispute - Inheritance', 'CIVIL', 'Varanasi High Court', 'OPEN', '2024-01-15', '2024-12-10', (SELECT id FROM professionals WHERE professional_code = 'PRO001'), '2024-01-15'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI002'), 'CASE002', 'Divorce Settlement Petition', 'FAMILY', 'District Court, Varanasi', 'IN_PROGRESS', '2024-02-20', '2024-11-25', (SELECT id FROM professionals WHERE professional_code = 'PRO002'), '2024-02-20'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'COR001'), 'CASE003', 'Corporate Contract Dispute', 'CORPORATE', 'Varanasi Commercial Court', 'OPEN', '2024-03-10', '2024-12-15', (SELECT id FROM professionals WHERE professional_code = 'PRO003'), '2024-03-10'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI003'), 'CASE004', 'Criminal Charge - Defamation', 'CRIMINAL', 'District Court, Varanasi', 'IN_PROGRESS', '2024-03-25', '2024-12-05', (SELECT id FROM professionals WHERE professional_code = 'PRO001'), '2024-03-25'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'COR002'), 'CASE005', 'Employment Dispute Case', 'LABOR', 'Labor Court, Lucknow', 'OPEN', '2024-04-10', '2024-12-20', (SELECT id FROM professionals WHERE professional_code = 'PRO006'), '2024-04-10'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI004'), 'CASE006', 'Property Boundary Dispute', 'CIVIL', 'District Court, Varanasi', 'CLOSED', '2024-05-01', NULL, (SELECT id FROM professionals WHERE professional_code = 'PRO007'), '2024-05-01'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'COR003'), 'CASE007', 'Trademark Infringement', 'IP', 'Varanasi Commercial Court', 'OPEN', '2024-05-20', '2024-12-10', (SELECT id FROM professionals WHERE professional_code = 'PRO004'), '2024-05-20'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI005'), 'CASE008', 'Criminal Theft Case', 'CRIMINAL', 'District Court, Varanasi', 'IN_PROGRESS', '2024-06-05', '2024-11-28', (SELECT id FROM professionals WHERE professional_code = 'PRO005'), '2024-06-05'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'COR004'), 'CASE009', 'Contract Breach Litigation', 'CORPORATE', 'Commercial Court, Agra', 'OPEN', '2024-06-25', '2024-12-18', (SELECT id FROM professionals WHERE professional_code = 'PRO003'), '2024-06-25'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI006'), 'CASE010', 'Will Validity Challenge', 'FAMILY', 'District Court, Varanasi', 'IN_PROGRESS', '2024-07-10', '2024-12-08', (SELECT id FROM professionals WHERE professional_code = 'PRO002'), '2024-07-10'),
-- Additional Varanasi Cases
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI007'), 'CASE011', 'Unlawful Eviction Notice', 'CIVIL', 'District Court, Varanasi', 'OPEN', '2024-07-25', '2024-12-22', (SELECT id FROM professionals WHERE professional_code = 'PRO007'), '2024-07-25'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'COR005'), 'CASE012', 'Labor Law Compliance', 'LABOR', 'Labor Tribunal, Lucknow', 'OPEN', '2024-08-05', '2024-12-10', (SELECT id FROM professionals WHERE professional_code = 'PRO006'), '2024-08-05'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI008'), 'CASE013', 'Business Partnership Dispute', 'CORPORATE', 'Commercial Court, Varanasi', 'IN_PROGRESS', '2024-08-20', '2024-11-30', (SELECT id FROM professionals WHERE professional_code = 'PRO003'), '2024-08-20'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI009'), 'CASE014', 'Criminal Assault Case', 'CRIMINAL', 'District Court, Varanasi', 'OPEN', '2024-09-01', '2024-12-12', (SELECT id FROM professionals WHERE professional_code = 'PRO001'), '2024-09-01'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'COR006'), 'CASE015', 'Property Title Verification', 'CIVIL', 'Sub-Registry, Varanasi', 'OPEN', '2024-09-15', '2024-12-05', (SELECT id FROM professionals WHERE professional_code = 'PRO007'), '2024-09-15'),
-- Consulting Firm Cases
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), (SELECT id FROM clients WHERE client_code = 'COR001'), 'CASE016', 'Tax Audit - Income Tax Notice', 'TAX', 'Income Tax Office, Lucknow', 'OPEN', '2024-04-01', '2024-12-15', (SELECT id FROM professionals WHERE professional_code = 'PRO009'), '2024-04-01'),
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), (SELECT id FROM clients WHERE client_code = 'COR002'), 'CASE017', 'GST Compliance Review', 'COMPLIANCE', 'GST Department', 'OPEN', '2024-05-10', '2024-12-20', (SELECT id FROM professionals WHERE professional_code = 'PRO010'), '2024-05-10'),
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), (SELECT id FROM clients WHERE client_code = 'COR007'), 'CASE018', 'Financial Audit & Compliance', 'AUDIT', 'Audit Department', 'IN_PROGRESS', '2024-06-01', '2024-12-10', (SELECT id FROM professionals WHERE professional_code = 'PRO009'), '2024-06-01'),
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), (SELECT id FROM clients WHERE client_code = 'COR008'), 'CASE019', 'Business Restructuring Consultation', 'CONSULTING', 'Internal', 'OPEN', '2024-07-05', NULL, (SELECT id FROM professionals WHERE professional_code = 'PRO010'), '2024-07-05'),
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), (SELECT id FROM clients WHERE client_code = 'COR009'), 'CASE020', 'Import-Export Compliance Advisory', 'COMPLIANCE', 'Customs Department', 'OPEN', '2024-08-10', '2024-12-15', (SELECT id FROM professionals WHERE professional_code = 'PRO011'), '2024-08-10'),
-- Audit Firm Cases
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), (SELECT id FROM clients WHERE client_code = 'COR010'), 'CASE021', 'Financial Audit - Annual', 'AUDIT', 'Audit Office, Agra', 'IN_PROGRESS', '2024-03-15', '2024-12-31', (SELECT id FROM professionals WHERE professional_code = 'PRO015'), '2024-03-15'),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), (SELECT id FROM clients WHERE client_code = 'COR011'), 'CASE022', 'Internal Audit Program', 'AUDIT', 'Internal', 'OPEN', '2024-04-20', NULL, (SELECT id FROM professionals WHERE professional_code = 'PRO019'), '2024-04-20'),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), (SELECT id FROM clients WHERE client_code = 'COR012'), 'CASE023', 'Tax Planning & Compliance', 'TAX', 'Tax Office, Agra', 'OPEN', '2024-05-25', '2024-12-18', (SELECT id FROM professionals WHERE professional_code = 'PRO016'), '2024-05-25'),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), (SELECT id FROM clients WHERE client_code = 'COR013'), 'CASE024', 'Statutory Compliance Review', 'COMPLIANCE', 'Regulatory Body', 'IN_PROGRESS', '2024-06-30', '2024-12-20', (SELECT id FROM professionals WHERE professional_code = 'PRO018'), '2024-06-30'),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), (SELECT id FROM clients WHERE client_code = 'COR014'), 'CASE025', 'Project Financial Advisory', 'CONSULTING', 'Project Site', 'OPEN', '2024-07-15', NULL, (SELECT id FROM professionals WHERE professional_code = 'PRO017'), '2024-07-15'),
-- More diverse cases
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI010'), 'CASE026', 'Guardianship Application', 'FAMILY', 'District Court, Varanasi', 'OPEN', '2024-08-25', '2024-12-03', (SELECT id FROM professionals WHERE professional_code = 'PRO002'), '2024-08-25'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'COR015'), 'CASE027', 'Patent Application Review', 'IP', 'Patent Office', 'OPEN', '2024-09-01', '2024-12-10', (SELECT id FROM professionals WHERE professional_code = 'PRO004'), '2024-09-01'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI011'), 'CASE028', 'Consumer Protection Case', 'CONSUMER', 'Consumer Court', 'IN_PROGRESS', '2024-09-20', '2024-12-01', (SELECT id FROM professionals WHERE professional_code = 'PRO003'), '2024-09-20'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'COR001'), 'CASE029', 'Commercial Dispute Resolution', 'CORPORATE', 'Arbitration Center', 'OPEN', '2024-10-01', '2024-12-25', (SELECT id FROM professionals WHERE professional_code = 'PRO005'), '2024-10-01'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI012'), 'CASE030', 'Inheritance Rights Claim', 'FAMILY', 'District Court, Lucknow', 'OPEN', '2024-10-10', '2024-12-12', (SELECT id FROM professionals WHERE professional_code = 'PRO002'), '2024-10-10'),
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), (SELECT id FROM clients WHERE client_code = 'COR002'), 'CASE031', 'Financial Restructuring Plan', 'CONSULTING', 'Internal', 'IN_PROGRESS', '2024-08-15', NULL, (SELECT id FROM professionals WHERE professional_code = 'PRO010'), '2024-08-15'),
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), (SELECT id FROM clients WHERE client_code = 'CLI013'), 'CASE032', 'Personal Tax Planning', 'TAX', 'Tax Advisor Office', 'OPEN', '2024-09-10', '2024-12-20', (SELECT id FROM professionals WHERE professional_code = 'PRO013'), '2024-09-10'),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), (SELECT id FROM clients WHERE client_code = 'COR003'), 'CASE033', 'Compliance Audit', 'AUDIT', 'Audit Office', 'IN_PROGRESS', '2024-08-01', '2024-12-30', (SELECT id FROM professionals WHERE professional_code = 'PRO016'), '2024-08-01'),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), (SELECT id FROM clients WHERE client_code = 'CLI014'), 'CASE034', 'Investment Advisory', 'CONSULTING', 'Advisor Office', 'OPEN', '2024-09-25', NULL, (SELECT id FROM professionals WHERE professional_code = 'PRO020'), '2024-09-25'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'CLI015'), 'CASE035', 'Contractual Dispute Settlement', 'CORPORATE', 'Arbitration Tribunal', 'OPEN', '2024-10-05', '2024-12-15', (SELECT id FROM professionals WHERE professional_code = 'PRO003'), '2024-10-05'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'COR004'), 'CASE036', 'Labor Dispute Resolution', 'LABOR', 'Labor Tribunal', 'IN_PROGRESS', '2024-10-15', '2024-12-08', (SELECT id FROM professionals WHERE professional_code = 'PRO006'), '2024-10-15'),
((SELECT id FROM service_firms WHERE firm_name = 'Sharma & Associates Consulting'), (SELECT id FROM clients WHERE client_code = 'COR005'), 'CASE037', 'Business Growth Strategy', 'CONSULTING', 'Internal', 'OPEN', '2024-10-20', NULL, (SELECT id FROM professionals WHERE professional_code = 'PRO010'), '2024-10-20'),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), (SELECT id FROM clients WHERE client_code = 'COR006'), 'CASE038', 'Internal Control Audit', 'AUDIT', 'Audit Office', 'OPEN', '2024-10-25', '2024-12-25', (SELECT id FROM professionals WHERE professional_code = 'PRO019'), '2024-10-25'),
((SELECT id FROM service_firms WHERE firm_name = 'Varanasi Legal Associates'), (SELECT id FROM clients WHERE client_code = 'COR007'), 'CASE039', 'Regulatory Compliance', 'COMPLIANCE', 'Regulatory Body', 'OPEN', '2024-11-01', '2024-12-10', (SELECT id FROM professionals WHERE professional_code = 'PRO007'), '2024-11-01'),
((SELECT id FROM service_firms WHERE firm_name = 'Agra Professional Services'), (SELECT id FROM clients WHERE client_code = 'COR008'), 'CASE040', 'Risk Assessment & Advisory', 'CONSULTING', 'Advisory Office', 'IN_PROGRESS', '2024-11-05', NULL, (SELECT id FROM professionals WHERE professional_code = 'PRO017'), '2024-11-05');

-- ============================================================================
-- CASE HEARINGS (25+ hearings)
-- ============================================================================
INSERT INTO case_hearings (case_id, hearing_date, hearing_time, court_name, judge_name, outcome, next_hearing_date, created_at) VALUES
((SELECT id FROM cases WHERE case_number = 'CASE001'), '2024-11-15', '10:30:00', 'Varanasi High Court', 'Hon\'ble Justice Rajesh Kumar', 'Adjourned', '2024-12-10', '2024-11-15'),
((SELECT id FROM cases WHERE case_number = 'CASE002'), '2024-11-10', '02:00:00', 'District Court, Varanasi', 'Hon\'ble Judge Priya Sharma', 'Arguments Heard', '2024-11-25', '2024-11-10'),
((SELECT id FROM cases WHERE case_number = 'CASE003'), '2024-11-12', '11:00:00', 'Varanasi Commercial Court', 'Hon\'ble Justice Vikram Singh', 'Interim Order Passed', '2024-12-15', '2024-11-12'),
((SELECT id FROM cases WHERE case_number = 'CASE004'), '2024-11-08', '01:30:00', 'District Court, Varanasi', 'Hon\'ble Judge Arun Pandey', 'Witness Examination', '2024-12-05', '2024-11-08'),
((SELECT id FROM cases WHERE case_number = 'CASE005'), '2024-11-20', '10:00:00', 'Labor Court, Lucknow', 'Hon\'ble Judge Neha Verma', 'Settlement Discussion', '2024-12-20', '2024-11-20'),
((SELECT id FROM cases WHERE case_number = 'CASE006'), '2024-10-28', '09:30:00', 'District Court, Varanasi', 'Hon\'ble Judge Deepak Singh', 'Judgment Delivered', NULL, '2024-10-28'),
((SELECT id FROM cases WHERE case_number = 'CASE006'), '2024-09-15', '03:00:00', 'District Court, Varanasi', 'Hon\'ble Judge Deepak Singh', 'Final Arguments', '2024-10-28', '2024-09-15'),
((SELECT id FROM cases WHERE case_number = 'CASE007'), '2024-11-18', '11:30:00', 'Varanasi Commercial Court', 'Hon\'ble Justice Meera Gupta', 'Evidence Presented', '2024-12-10', '2024-11-18'),
((SELECT id FROM cases WHERE case_number = 'CASE008'), '2024-11-05', '02:15:00', 'District Court, Varanasi', 'Hon\'ble Judge Sanjeev Kumar', 'Cross Examination', '2024-11-28', '2024-11-05'),
((SELECT id FROM cases WHERE case_number = 'CASE009'), '2024-11-22', '10:45:00', 'Commercial Court, Agra', 'Hon\'ble Justice Rajesh Verma', 'Motion Hearing', '2024-12-18', '2024-11-22'),
((SELECT id FROM cases WHERE case_number = 'CASE010'), '2024-11-12', '03:30:00', 'District Court, Varanasi', 'Hon\'ble Judge Anjali Singh', 'Settlement Negotiations', '2024-12-08', '2024-11-12'),
((SELECT id FROM cases WHERE case_number = 'CASE011'), '2024-11-19', '10:30:00', 'District Court, Varanasi', 'Hon\'ble Judge Mahesh Tiwari', 'Affidavit Submission', '2024-12-22', '2024-11-19'),
((SELECT id FROM cases WHERE case_number = 'CASE012'), '2024-11-25', '11:00:00', 'Labor Tribunal, Lucknow', 'Hon\'ble Judge Rakesh Yadav', 'Case Hearing', '2024-12-10', '2024-11-25'),
((SELECT id FROM cases WHERE case_number = 'CASE013'), '2024-11-14', '02:00:00', 'Commercial Court, Varanasi', 'Hon\'ble Justice Divya Patel', 'Pre-Judgment', '2024-11-30', '2024-11-14'),
((SELECT id FROM cases WHERE case_number = 'CASE014'), '2024-11-09', '01:45:00', 'District Court, Varanasi', 'Hon\'ble Judge Vikas Kumar', 'Witness Deposition', '2024-12-12', '2024-11-09'),
((SELECT id FROM cases WHERE case_number = 'CASE015'), '2024-11-21', '09:00:00', 'Sub-Registry, Varanasi', 'Registrar Priya Verma', 'Document Verification', '2024-12-05', '2024-11-21'),
((SELECT id FROM cases WHERE case_number = 'CASE016'), '2024-10-30', '10:00:00', 'Income Tax Office, Lucknow', 'Revenue Officer Amit Singh', 'Notice Response', '2024-12-15', '2024-10-30'),
((SELECT id FROM cases WHERE case_number = 'CASE017'), '2024-11-22', '02:30:00', 'GST Department', 'GST Officer Priya Sharma', 'Compliance Check', '2024-12-20', '2024-11-22'),
((SELECT id FROM cases WHERE case_number = 'CASE018'), '2024-11-15', '11:00:00', 'Audit Department', 'Audit Manager Rajesh Singh', 'Audit Hearing', '2024-12-10', '2024-11-15'),
((SELECT id FROM cases WHERE case_number = 'CASE026'), '2024-11-20', '03:00:00', 'District Court, Varanasi', 'Hon\'ble Judge Ravi Mishra', 'Guardianship Arguments', '2024-12-03', '2024-11-20'),
((SELECT id FROM cases WHERE case_number = 'CASE027'), '2024-11-08', '10:30:00', 'Patent Office', 'Patent Officer Deepak Verma', 'Application Review', '2024-12-10', '2024-11-08'),
((SELECT id FROM cases WHERE case_number = 'CASE028'), '2024-11-18', '02:15:00', 'Consumer Court', 'Hon\'ble Judge Meera Sharma', 'Evidence Hearing', '2024-12-01', '2024-11-18'),
((SELECT id FROM cases WHERE case_number = 'CASE029'), '2024-11-25', '11:00:00', 'Arbitration Center', 'Arbitrator Sunita Patel', 'Arbitration Hearing', '2024-12-25', '2024-11-25'),
((SELECT id FROM cases WHERE case_number = 'CASE030'), '2024-11-16', '03:45:00', 'District Court, Lucknow', 'Hon\'ble Judge Vikram Singh', 'Case Presentation', '2024-12-12', '2024-11-16'),
((SELECT id FROM cases WHERE case_number = 'CASE036'), '2024-11-22', '10:00:00', 'Labor Tribunal', 'Hon\'ble Judge Arjun Kumar', 'Dispute Hearing', '2024-12-08', '2024-11-22');

-- ============================================================================
-- INVOICES (40+ invoices)
-- ============================================================================
INSERT INTO invoices (case_id, client_id, invoice_number, invoice_date, total_amount, payment_status, created_at) VALUES
-- Varanasi Legal Associates Invoices
((SELECT id FROM cases WHERE case_number = 'CASE001'), (SELECT id FROM clients WHERE client_code = 'CLI001'), 'INV-VAL-2024-001', '2024-11-01', 25000.00, 'PAID', '2024-11-01'),
((SELECT id FROM cases WHERE case_number = 'CASE002'), (SELECT id FROM clients WHERE client_code = 'CLI002'), 'INV-VAL-2024-002', '2024-11-05', 18000.00, 'PENDING', '2024-11-05'),
((SELECT id FROM cases WHERE case_number = 'CASE003'), (SELECT id FROM clients WHERE client_code = 'COR001'), 'INV-VAL-2024-003', '2024-11-10', 45000.00, 'PARTIAL', '2024-11-10'),
((SELECT id FROM cases WHERE case_number = 'CASE004'), (SELECT id FROM clients WHERE client_code = 'CLI003'), 'INV-VAL-2024-004', '2024-11-08', 30000.00, 'PAID', '2024-11-08'),
((SELECT id FROM cases WHERE case_number = 'CASE005'), (SELECT id FROM clients WHERE client_code = 'COR002'), 'INV-VAL-2024-005', '2024-11-12', 28000.00, 'PENDING', '2024-11-12'),
((SELECT id FROM cases WHERE case_number = 'CASE006'), (SELECT id FROM clients WHERE client_code = 'CLI004'), 'INV-VAL-2024-006', '2024-10-30', 22000.00, 'PAID', '2024-10-30'),
((SELECT id FROM cases WHERE case_number = 'CASE007'), (SELECT id FROM clients WHERE client_code = 'COR003'), 'INV-VAL-2024-007', '2024-11-15', 35000.00, 'PARTIAL', '2024-11-15'),
((SELECT id FROM cases WHERE case_number = 'CASE008'), (SELECT id FROM clients WHERE client_code = 'CLI005'), 'INV-VAL-2024-008', '2024-11-06', 32000.00, 'PAID', '2024-11-06'),
((SELECT id FROM cases WHERE case_number = 'CASE009'), (SELECT id FROM clients WHERE client_code = 'COR004'), 'INV-VAL-2024-009', '2024-11-20', 50000.00, 'PARTIAL', '2024-11-20'),
((SELECT id FROM cases WHERE case_number = 'CASE010'), (SELECT id FROM clients WHERE client_code = 'CLI006'), 'INV-VAL-2024-010', '2024-11-12', 20000.00, 'PENDING', '2024-11-12'),
((SELECT id FROM cases WHERE case_number = 'CASE011'), (SELECT id FROM clients WHERE client_code = 'CLI007'), 'INV-VAL-2024-011', '2024-11-18', 24000.00, 'PAID', '2024-11-18'),
((SELECT id FROM cases WHERE case_number = 'CASE012'), (SELECT id FROM clients WHERE client_code = 'COR005'), 'INV-VAL-2024-012', '2024-11-10', 26000.00, 'PENDING', '2024-11-10'),
((SELECT id FROM cases WHERE case_number = 'CASE013'), (SELECT id FROM clients WHERE client_code = 'CLI008'), 'INV-VAL-2024-013', '2024-11-15', 40000.00, 'PARTIAL', '2024-11-15'),
((SELECT id FROM cases WHERE case_number = 'CASE014'), (SELECT id FROM clients WHERE client_code = 'CLI009'), 'INV-VAL-2024-014', '2024-11-08', 35000.00, 'PAID', '2024-11-08'),
((SELECT id FROM cases WHERE case_number = 'CASE015'), (SELECT id FROM clients WHERE client_code = 'COR006'), 'INV-VAL-2024-015', '2024-11-20', 28000.00, 'PENDING', '2024-11-20'),
((SELECT id FROM cases WHERE case_number = 'CASE026'), (SELECT id FROM clients WHERE client_code = 'CLI010'), 'INV-VAL-2024-016', '2024-11-22', 19000.00, 'PAID', '2024-11-22'),
((SELECT id FROM cases WHERE case_number = 'CASE027'), (SELECT id FROM clients WHERE client_code = 'COR015'), 'INV-VAL-2024-017', '2024-11-05', 32000.00, 'PARTIAL', '2024-11-05'),
((SELECT id FROM cases WHERE case_number = 'CASE028'), (SELECT id FROM clients WHERE client_code = 'CLI011'), 'INV-VAL-2024-018', '2024-11-18', 27000.00, 'PENDING', '2024-11-18'),
((SELECT id FROM cases WHERE case_number = 'CASE029'), (SELECT id FROM clients WHERE client_code = 'COR001'), 'INV-VAL-2024-019', '2024-11-08', 42000.00, 'PAID', '2024-11-08'),
((SELECT id FROM cases WHERE case_number = 'CASE030'), (SELECT id FROM clients WHERE client_code = 'CLI012'), 'INV-VAL-2024-020', '2024-11-15', 21000.00, 'PENDING', '2024-11-15'),
-- Consulting Firm Invoices
((SELECT id FROM cases WHERE case_number = 'CASE016'), (SELECT id FROM clients WHERE client_code = 'COR001'), 'INV-SAC-2024-001', '2024-11-10', 55000.00, 'PAID', '2024-11-10'),
((SELECT id FROM cases WHERE case_number = 'CASE017'), (SELECT id FROM clients WHERE client_code = 'COR002'), 'INV-SAC-2024-002', '2024-11-15', 48000.00, 'PARTIAL', '2024-11-15'),
((SELECT id FROM cases WHERE case_number = 'CASE018'), (SELECT id FROM clients WHERE client_code = 'COR007'), 'INV-SAC-2024-003', '2024-11-20', 62000.00, 'PENDING', '2024-11-20'),
((SELECT id FROM cases WHERE case_number = 'CASE019'), (SELECT id FROM clients WHERE client_code = 'COR008'), 'INV-SAC-2024-004', '2024-11-12', 72000.00, 'PARTIAL', '2024-11-12'),
((SELECT id FROM cases WHERE case_number = 'CASE020'), (SELECT id FROM clients WHERE client_code = 'COR009'), 'INV-SAC-2024-005', '2024-11-18', 38000.00, 'PAID', '2024-11-18'),
((SELECT id FROM cases WHERE case_number = 'CASE031'), (SELECT id FROM clients WHERE client_code = 'COR002'), 'INV-SAC-2024-006', '2024-11-10', 85000.00, 'PARTIAL', '2024-11-10'),
((SELECT id FROM cases WHERE case_number = 'CASE032'), (SELECT id FROM clients WHERE client_code = 'CLI013'), 'INV-SAC-2024-007', '2024-11-16', 15000.00, 'PAID', '2024-11-16'),
((SELECT id FROM cases WHERE case_number = 'CASE037'), (SELECT id FROM clients WHERE client_code = 'COR005'), 'INV-SAC-2024-008', '2024-11-22', 95000.00, 'PENDING', '2024-11-22'),
-- Audit Firm Invoices
((SELECT id FROM cases WHERE case_number = 'CASE021'), (SELECT id FROM clients WHERE client_code = 'COR010'), 'INV-APS-2024-001', '2024-11-20', 75000.00, 'PAID', '2024-11-20'),
((SELECT id FROM cases WHERE case_number = 'CASE022'), (SELECT id FROM clients WHERE client_code = 'COR011'), 'INV-APS-2024-002', '2024-11-15', 65000.00, 'PARTIAL', '2024-11-15'),
((SELECT id FROM cases WHERE case_number = 'CASE023'), (SELECT id FROM clients WHERE client_code = 'COR012'), 'INV-APS-2024-003', '2024-11-18', 45000.00, 'PENDING', '2024-11-18'),
((SELECT id FROM cases WHERE case_number = 'CASE024'), (SELECT id FROM clients WHERE client_code = 'COR013'), 'INV-APS-2024-004', '2024-11-22', 55000.00, 'PAID', '2024-11-22'),
((SELECT id FROM cases WHERE case_number = 'CASE025'), (SELECT id FROM clients WHERE client_code = 'COR014'), 'INV-APS-2024-005', '2024-11-12', 88000.00, 'PARTIAL', '2024-11-12'),
((SELECT id FROM cases WHERE case_number = 'CASE033'), (SELECT id FROM clients WHERE client_code = 'COR003'), 'INV-APS-2024-006', '2024-11-10', 68000.00, 'PENDING', '2024-11-10'),
((SELECT id FROM cases WHERE case_number = 'CASE034'), (SELECT id FROM clients WHERE client_code = 'CLI014'), 'INV-APS-2024-007', '2024-11-20', 35000.00, 'PAID', '2024-11-20'),
((SELECT id FROM cases WHERE case_number = 'CASE035'), (SELECT id FROM clients WHERE client_code = 'CLI015'), 'INV-VAL-2024-021', '2024-11-10', 38000.00, 'PARTIAL', '2024-11-10'),
((SELECT id FROM cases WHERE case_number = 'CASE038'), (SELECT id FROM clients WHERE client_code = 'COR006'), 'INV-APS-2024-008', '2024-11-25', 72000.00, 'PENDING', '2024-11-25'),
((SELECT id FROM cases WHERE case_number = 'CASE039'), (SELECT id FROM clients WHERE client_code = 'COR007'), 'INV-VAL-2024-022', '2024-11-15', 32000.00, 'PAID', '2024-11-15'),
((SELECT id FROM cases WHERE case_number = 'CASE040'), (SELECT id FROM clients WHERE client_code = 'COR008'), 'INV-APS-2024-009', '2024-11-20', 98000.00, 'PARTIAL', '2024-11-20');

-- Summary
SELECT 'Professional Services Hub Demo Data Loaded Successfully!' AS status;
SELECT COUNT(*) AS total_firms FROM service_firms;
SELECT COUNT(*) AS total_professionals FROM professionals;
SELECT COUNT(*) AS total_clients FROM clients;
SELECT COUNT(*) AS total_cases FROM cases;
SELECT COUNT(*) AS total_case_hearings FROM case_hearings;
SELECT COUNT(*) AS total_invoices FROM invoices;
