-- ============================================================================
-- CA FIRM MANAGEMENT SYSTEM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Target: Chartered Accountancy Firms, Tax Consultants, Audit Firms
-- Features: Client Management, GST, ITR, Company Formation, Auditing, ROC,
--           Compliance Calendar, Document Management, Portal Integration
-- Tier: Enterprise (Multi-branch, unlimited clients) + Standard (Single office)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- ============================================================================
-- FIRM HIERARCHY & CONFIGURATION
-- ============================================================================

CREATE TABLE ca_firms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_name VARCHAR(255) NOT NULL,
    firm_legal_name VARCHAR(255),

    -- Registration
    registration_number VARCHAR(100),
    icai_registration_number VARCHAR(100), -- Institute of Chartered Accountants of India
    pan_number VARCHAR(20),
    gstin VARCHAR(20),
    tan_number VARCHAR(20), -- Tax Deduction Account Number

    -- Firm Type
    firm_type VARCHAR(50), -- PROPRIETORSHIP, PARTNERSHIP, LLP, COMPANY
    establishment_year INTEGER,

    -- Head Office
    head_office_address TEXT,
    location GEOGRAPHY(POINT),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    website VARCHAR(255),

    -- Partners (for partnership firms)
    total_partners INTEGER,
    partner_details JSONB, -- [{name, membership_no, designation, email, phone}]

    -- Services Offered
    services_offered TEXT[], -- GST, ITR, AUDIT, COMPANY_FORMATION, ACCOUNTING, TAX_PLANNING, ROC, TDS, ESI_PF

    -- Centralized features (Enterprise tier)
    centralized_client_management BOOLEAN DEFAULT false,
    centralized_billing BOOLEAN DEFAULT false,

    -- Branding
    logo_url VARCHAR(500),
    letterhead_template_url VARCHAR(500),
    digital_signature_url VARCHAR(500),

    -- Banking
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    upi_id VARCHAR(100),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE firm_branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES ca_firms(id),

    branch_name VARCHAR(255) NOT NULL,
    branch_code VARCHAR(50) UNIQUE NOT NULL,

    -- Location
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),
    location GEOGRAPHY(POINT),

    -- Contact
    branch_head_name VARCHAR(255),
    branch_phone VARCHAR(20),
    branch_email VARCHAR(255),

    -- Capacity
    total_staff INTEGER DEFAULT 0,
    total_clients INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- ============================================================================
-- STAFF & CA MANAGEMENT
-- ============================================================================

CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES ca_firms(id),
    branch_id UUID REFERENCES firm_branches(id),

    employee_code VARCHAR(50) UNIQUE NOT NULL,

    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),

    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,

    -- Professional Details
    designation VARCHAR(100) NOT NULL, -- CA, ARTICLE, ACCOUNTANT, TAX_CONSULTANT, MANAGER, ADMIN
    staff_category VARCHAR(50) NOT NULL, -- CHARTERED_ACCOUNTANT, ARTICLE_ASSISTANT, STAFF_ACCOUNTANT, ADMIN

    -- For CAs
    icai_membership_number VARCHAR(100),
    icai_membership_type VARCHAR(50), -- FCA, ACA, COP
    year_of_qualification INTEGER,
    digital_signature_certificate_url VARCHAR(500),
    dsc_valid_till DATE,

    -- For Articles
    article_registration_number VARCHAR(100),
    article_start_date DATE,
    article_end_date DATE,

    -- Employment
    date_of_joining DATE NOT NULL,
    employment_type VARCHAR(50), -- PARTNER, PERMANENT, CONTRACT, ARTICLE

    -- Specialization
    specialization TEXT[], -- GST, ITR, AUDIT, COMPANY_LAW, INTERNATIONAL_TAXATION

    -- Salary
    basic_salary DECIMAL(10, 2),

    -- Banking
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),

    -- System Access
    system_username VARCHAR(100) UNIQUE,
    system_password_hash VARCHAR(255),
    system_role VARCHAR(50), -- ADMIN, PARTNER, CA, ARTICLE, ACCOUNTANT, RECEPTIONIST

    -- Permissions
    can_sign_returns BOOLEAN DEFAULT false,
    can_approve_invoices BOOLEAN DEFAULT false,
    can_access_all_clients BOOLEAN DEFAULT false,

    -- Capacity
    current_client_load INTEGER DEFAULT 0,
    max_client_capacity INTEGER DEFAULT 50,

    photo_url VARCHAR(500),

    employment_status VARCHAR(50) DEFAULT 'ACTIVE',
    leaving_date DATE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_staff_employee_code ON staff(employee_code);
CREATE INDEX idx_staff_branch ON staff(branch_id);

-- ============================================================================
-- CLIENT MANAGEMENT
-- ============================================================================

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES ca_firms(id),
    branch_id UUID REFERENCES firm_branches(id),

    client_code VARCHAR(50) UNIQUE NOT NULL,

    -- Client Type
    client_type VARCHAR(50) NOT NULL, -- INDIVIDUAL, PROPRIETORSHIP, PARTNERSHIP, LLP, PRIVATE_LTD, PUBLIC_LTD, TRUST, SOCIETY, HUF

    -- Business/Individual Name
    client_name VARCHAR(255) NOT NULL,
    trading_name VARCHAR(255),
    legal_name VARCHAR(255),

    -- For Individuals
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    father_name VARCHAR(255), -- Required for some filings

    -- Contact
    primary_contact_person VARCHAR(255),
    designation VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    email VARCHAR(255),
    whatsapp_number VARCHAR(20),

    -- Address
    registered_address TEXT NOT NULL,
    business_address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(10),

    -- Tax Identifications
    pan_number VARCHAR(20) UNIQUE,
    aadhar_number VARCHAR(20),
    tan_number VARCHAR(20), -- For TDS
    cin_number VARCHAR(30), -- Corporate Identification Number
    llpin_number VARCHAR(30), -- LLP Identification Number
    udyam_number VARCHAR(50), -- MSME Registration

    -- GST Details
    has_gst_registration BOOLEAN DEFAULT false,
    gstin VARCHAR(20)[],
    gst_registration_date DATE,
    gst_username VARCHAR(100),
    gst_password_encrypted TEXT,

    -- Income Tax Details
    income_tax_username VARCHAR(100),
    income_tax_password_encrypted TEXT,
    itr_filing_required BOOLEAN DEFAULT true,
    assessment_year_client_since VARCHAR(10), -- e.g., "2020-21"

    -- Company Details (if applicable)
    date_of_incorporation DATE,
    authorized_capital DECIMAL(15, 2),
    paid_up_capital DECIMAL(15, 2),
    roc_code VARCHAR(50), -- Registrar of Companies

    -- Directors/Partners
    total_directors INTEGER,
    total_partners INTEGER,
    director_details JSONB, -- [{name, din, pan, dob, designation}]
    partner_details JSONB,

    -- Business Classification
    nature_of_business TEXT,
    industry_type VARCHAR(100), -- MANUFACTURING, SERVICES, TRADING, etc.
    business_activity_code VARCHAR(20),

    -- Turnover & Financial
    annual_turnover DECIMAL(15, 2),
    financial_year_end_date DATE DEFAULT '2025-03-31',

    -- Services Subscribed
    services_subscribed TEXT[], -- GST_FILING, ITR_FILING, AUDIT, TDS_RETURN, ACCOUNTING, PAYROLL

    -- Service Plans
    service_plan VARCHAR(50), -- BASIC, STANDARD, PREMIUM, CUSTOM
    annual_retainer_fee DECIMAL(10, 2),
    retainer_paid_till DATE,

    -- Assignment
    primary_ca_id UUID REFERENCES staff(id),
    secondary_ca_id UUID REFERENCES staff(id),

    -- Portal Credentials Storage (encrypted)
    mca_username VARCHAR(100), -- Ministry of Corporate Affairs
    mca_password_encrypted TEXT,
    traces_username VARCHAR(100), -- TDS portal
    traces_password_encrypted TEXT,

    -- Documents
    pan_card_url VARCHAR(500),
    aadhar_card_url VARCHAR(500),
    gst_certificate_url VARCHAR(500),
    incorporation_certificate_url VARCHAR(500),
    moa_aoa_url VARCHAR(500),

    -- Client Status
    client_status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPENDED, ARCHIVED
    onboarding_date DATE DEFAULT CURRENT_DATE,
    last_service_date DATE,

    -- Client Rating & Notes
    client_priority VARCHAR(50) DEFAULT 'REGULAR', -- VIP, HIGH_VALUE, REGULAR, SMALL
    internal_notes TEXT,

    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_clients_code ON clients(client_code);
CREATE INDEX idx_clients_pan ON clients(pan_number);
CREATE INDEX idx_clients_gstin ON clients USING gin(gstin);
CREATE INDEX idx_clients_branch ON clients(branch_id);
CREATE INDEX idx_clients_ca ON clients(primary_ca_id);

-- ============================================================================
-- SERVICE CATALOG & PRICING
-- ============================================================================

CREATE TABLE service_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES ca_firms(id),

    service_name VARCHAR(255) NOT NULL,
    service_code VARCHAR(50) UNIQUE NOT NULL,
    service_category VARCHAR(100) NOT NULL, -- GST, INCOME_TAX, AUDIT, COMPANY_LAW, ACCOUNTING, ADVISORY

    description TEXT,

    -- Pricing
    pricing_model VARCHAR(50) DEFAULT 'FIXED', -- FIXED, HOURLY, PERCENTAGE, CUSTOM
    base_price DECIMAL(10, 2) DEFAULT 0,
    hourly_rate DECIMAL(10, 2),

    -- Turnover-based pricing (for GST, Audit)
    turnover_slabs JSONB, -- [{min: 0, max: 1000000, price: 5000}, ...]

    -- Tax applicability
    is_taxable BOOLEAN DEFAULT true,
    gst_rate DECIMAL(5, 2) DEFAULT 18.0,
    sac_code VARCHAR(20), -- Service Accounting Code

    -- Frequency
    service_frequency VARCHAR(50), -- ONE_TIME, MONTHLY, QUARTERLY, ANNUAL

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert common services
INSERT INTO service_catalog (firm_id, service_name, service_code, service_category, pricing_model, base_price, service_frequency, sac_code) VALUES
-- Will be inserted during firm setup with actual firm_id
-- ('{firm_id}', 'GST Registration', 'GST_REG', 'GST', 'FIXED', 3000, 'ONE_TIME', '998313'),
-- ('{firm_id}', 'GST Monthly Return (GSTR-1 & GSTR-3B)', 'GST_MONTHLY', 'GST', 'FIXED', 1500, 'MONTHLY', '998313'),
-- ('{firm_id}', 'ITR-1 (Salaried)', 'ITR_1', 'INCOME_TAX', 'FIXED', 1000, 'ANNUAL', '998313'),
-- ('{firm_id}', 'ITR-3 (Business)', 'ITR_3', 'INCOME_TAX', 'FIXED', 5000, 'ANNUAL', '998313'),
-- ('{firm_id}', 'Company Audit', 'AUDIT_COMPANY', 'AUDIT', 'PERCENTAGE', 0, 'ANNUAL', '998312'),
-- ('{firm_id}', 'Private Limited Company Incorporation', 'PVT_LTD_INC', 'COMPANY_LAW', 'FIXED', 15000, 'ONE_TIME', '998313');

-- ============================================================================
-- GST MANAGEMENT
-- ============================================================================

CREATE TABLE gst_returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    firm_id UUID REFERENCES ca_firms(id),

    gstin VARCHAR(20) NOT NULL,

    -- Return Details
    return_type VARCHAR(50) NOT NULL, -- GSTR1, GSTR3B, GSTR4, GSTR9, GSTR9C
    return_period VARCHAR(20) NOT NULL, -- Format: MM-YYYY or QQ-YYYY
    financial_year VARCHAR(10) NOT NULL, -- e.g., "2024-25"

    -- Filing Timeline
    due_date DATE NOT NULL,
    filed_date DATE,
    days_delay INTEGER,

    -- Return Summary
    total_taxable_value DECIMAL(15, 2),
    total_igst DECIMAL(12, 2) DEFAULT 0,
    total_cgst DECIMAL(12, 2) DEFAULT 0,
    total_sgst DECIMAL(12, 2) DEFAULT 0,
    total_cess DECIMAL(12, 2) DEFAULT 0,
    total_tax DECIMAL(12, 2) DEFAULT 0,

    -- Input Tax Credit
    itc_available DECIMAL(12, 2) DEFAULT 0,
    itc_utilized DECIMAL(12, 2) DEFAULT 0,

    -- Net Tax Payable/Refundable
    net_tax_payable DECIMAL(12, 2) DEFAULT 0,
    tax_paid DECIMAL(12, 2) DEFAULT 0,
    interest_paid DECIMAL(10, 2) DEFAULT 0,
    late_fee_paid DECIMAL(10, 2) DEFAULT 0,

    -- Filing Status
    filing_status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, DATA_COLLECTION, IN_PROGRESS, READY_FOR_FILING, FILED, REVISED

    -- Portal Details
    arn_number VARCHAR(100), -- Acknowledgement Reference Number
    filed_by_username VARCHAR(100),

    -- Documents
    return_json_url VARCHAR(500),
    return_pdf_url VARCHAR(500),
    supporting_documents_urls TEXT[],

    -- Assignment
    assigned_to UUID REFERENCES staff(id),
    prepared_by UUID REFERENCES staff(id),
    reviewed_by UUID REFERENCES staff(id),
    filed_by UUID REFERENCES staff(id),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gst_returns_client ON gst_returns(client_id);
CREATE INDEX idx_gst_returns_period ON gst_returns(return_period, return_type);
CREATE INDEX idx_gst_returns_status ON gst_returns(filing_status);

CREATE TABLE gst_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    return_id UUID REFERENCES gst_returns(id),

    invoice_type VARCHAR(50) NOT NULL, -- SALES, PURCHASE, DEBIT_NOTE, CREDIT_NOTE
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL,

    -- Party Details
    party_name VARCHAR(255) NOT NULL,
    party_gstin VARCHAR(20),
    party_pan VARCHAR(20),
    party_state VARCHAR(100),

    -- Invoice Details
    taxable_value DECIMAL(12, 2) NOT NULL,
    igst_amount DECIMAL(10, 2) DEFAULT 0,
    cgst_amount DECIMAL(10, 2) DEFAULT 0,
    sgst_amount DECIMAL(10, 2) DEFAULT 0,
    cess_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,

    -- HSN/SAC
    hsn_sac_codes TEXT[],

    -- Place of Supply
    place_of_supply VARCHAR(100),

    -- Reverse Charge
    is_reverse_charge BOOLEAN DEFAULT false,

    -- Document
    invoice_file_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gst_invoices_client ON gst_invoices(client_id);
CREATE INDEX idx_gst_invoices_return ON gst_invoices(return_id);

-- ============================================================================
-- INCOME TAX MANAGEMENT
-- ============================================================================

CREATE TABLE itr_filings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    firm_id UUID REFERENCES ca_firms(id),

    -- Assessment Year
    assessment_year VARCHAR(10) NOT NULL, -- e.g., "2024-25"
    financial_year VARCHAR(10) NOT NULL, -- e.g., "2023-24"

    -- ITR Form Type
    itr_form_type VARCHAR(20) NOT NULL, -- ITR1, ITR2, ITR3, ITR4, ITR5, ITR6, ITR7

    -- Filing Timeline
    due_date DATE NOT NULL,
    filed_date DATE,
    is_belated BOOLEAN DEFAULT false,
    is_revised BOOLEAN DEFAULT false,
    original_itr_id UUID REFERENCES itr_filings(id),

    -- Income Details
    gross_total_income DECIMAL(15, 2),
    total_deductions DECIMAL(12, 2) DEFAULT 0,
    taxable_income DECIMAL(15, 2),

    -- Tax Computation
    tax_on_total_income DECIMAL(12, 2) DEFAULT 0,
    education_cess DECIMAL(10, 2) DEFAULT 0,
    total_tax_liability DECIMAL(12, 2) DEFAULT 0,

    -- Tax Paid
    tds_deducted DECIMAL(10, 2) DEFAULT 0,
    advance_tax_paid DECIMAL(10, 2) DEFAULT 0,
    self_assessment_tax_paid DECIMAL(10, 2) DEFAULT 0,
    total_tax_paid DECIMAL(12, 2) DEFAULT 0,

    -- Refund/Demand
    refund_amount DECIMAL(12, 2) DEFAULT 0,
    tax_payable DECIMAL(12, 2) DEFAULT 0,

    -- Filing Status
    filing_status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, DATA_COLLECTION, IN_PROGRESS, COMPUTATION_DONE, READY_FOR_FILING, FILED, PROCESSED, INTIMATION_RECEIVED

    -- Portal Details
    acknowledgement_number VARCHAR(100),
    filing_date TIMESTAMP,
    verification_status VARCHAR(50), -- PENDING_VERIFICATION, VERIFIED_AADHAAR, VERIFIED_NET_BANKING, VERIFIED_EVC
    verification_date DATE,

    -- Income Tax Order
    intimation_received BOOLEAN DEFAULT false,
    intimation_u143_1_url VARCHAR(500),
    intimation_date DATE,
    refund_credited_date DATE,

    -- Documents
    itr_json_url VARCHAR(500),
    itr_xml_url VARCHAR(500),
    itr_pdf_url VARCHAR(500),
    form_16_url VARCHAR(500),
    form_26as_url VARCHAR(500),
    ais_tis_url VARCHAR(500), -- Annual Information Statement
    computation_sheet_url VARCHAR(500),

    -- Assignment
    assigned_to UUID REFERENCES staff(id),
    prepared_by UUID REFERENCES staff(id),
    reviewed_by UUID REFERENCES staff(id),
    filed_by UUID REFERENCES staff(id),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_itr_filings_client ON itr_filings(client_id);
CREATE INDEX idx_itr_filings_ay ON itr_filings(assessment_year);
CREATE INDEX idx_itr_filings_status ON itr_filings(filing_status);

CREATE TABLE tds_returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    firm_id UUID REFERENCES ca_firms(id),

    tan_number VARCHAR(20) NOT NULL,

    -- Return Details
    return_type VARCHAR(50) NOT NULL, -- TDS_24Q, TDS_26Q, TDS_27Q, TDS_27EQ
    quarter VARCHAR(10) NOT NULL, -- Q1, Q2, Q3, Q4
    financial_year VARCHAR(10) NOT NULL,

    -- Timeline
    due_date DATE NOT NULL,
    filed_date DATE,

    -- TDS Summary
    total_deductees INTEGER DEFAULT 0,
    total_tds_deposited DECIMAL(12, 2) DEFAULT 0,
    total_interest DECIMAL(10, 2) DEFAULT 0,
    total_late_fee DECIMAL(10, 2) DEFAULT 0,

    -- Filing Status
    filing_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, FILED
    token_number VARCHAR(100),
    acknowledgement_number VARCHAR(100),

    -- Documents
    return_file_url VARCHAR(500),
    challan_urls TEXT[],

    -- Assignment
    assigned_to UUID REFERENCES staff(id),
    filed_by UUID REFERENCES staff(id),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tds_returns_client ON tds_returns(client_id);
CREATE INDEX idx_tds_returns_quarter ON tds_returns(quarter, financial_year);

-- ============================================================================
-- AUDIT MANAGEMENT
-- ============================================================================

CREATE TABLE audit_engagements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    firm_id UUID REFERENCES ca_firms(id),

    -- Engagement Details
    engagement_number VARCHAR(50) UNIQUE NOT NULL,
    audit_type VARCHAR(100) NOT NULL, -- STATUTORY_AUDIT, TAX_AUDIT, INTERNAL_AUDIT, GST_AUDIT, BANK_AUDIT, CONCURRENT_AUDIT
    financial_year VARCHAR(10) NOT NULL,

    -- Timeline
    engagement_date DATE NOT NULL,
    audit_start_date DATE,
    audit_completion_date DATE,
    report_date DATE,
    agm_date DATE, -- Annual General Meeting (for company audits)

    -- Audit Team
    audit_partner_id UUID REFERENCES staff(id),
    audit_manager_id UUID REFERENCES staff(id),
    audit_team_members UUID[], -- Array of staff_ids

    -- Scope
    audit_scope TEXT,
    materiality_level DECIMAL(15, 2),

    -- Fees
    audit_fee DECIMAL(10, 2),
    fee_received DECIMAL(10, 2) DEFAULT 0,
    fee_pending DECIMAL(10, 2),

    -- Status
    engagement_status VARCHAR(50) DEFAULT 'PLANNING',
    -- PLANNING, FIELDWORK, REVIEW, REPORT_DRAFTING, REPORT_ISSUED, COMPLETED

    -- Reports & Documents
    engagement_letter_url VARCHAR(500),
    audit_program_url VARCHAR(500),
    working_papers_url VARCHAR(500),
    management_representation_letter_url VARCHAR(500),
    audit_report_url VARCHAR(500),
    udin_number VARCHAR(50), -- Unique Document Identification Number

    -- Observations
    total_observations INTEGER DEFAULT 0,
    critical_observations INTEGER DEFAULT 0,

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_engagements_client ON audit_engagements(client_id);
CREATE INDEX idx_audit_engagements_fy ON audit_engagements(financial_year);

CREATE TABLE audit_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    engagement_id UUID REFERENCES audit_engagements(id),

    observation_number VARCHAR(50) NOT NULL,
    observation_category VARCHAR(100), -- ACCOUNTING, INTERNAL_CONTROL, COMPLIANCE, OPERATIONAL, RISK

    severity VARCHAR(50) DEFAULT 'MEDIUM', -- CRITICAL, HIGH, MEDIUM, LOW

    observation_description TEXT NOT NULL,
    impact_assessment TEXT,
    recommendation TEXT,

    -- Client Response
    client_response TEXT,
    action_taken TEXT,
    is_resolved BOOLEAN DEFAULT false,
    resolved_date DATE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- COMPANY LAW & ROC FILINGS
-- ============================================================================

CREATE TABLE roc_filings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    firm_id UUID REFERENCES ca_firms(id),

    -- Form Details
    form_type VARCHAR(50) NOT NULL, -- AOC-4, MGT-7, DIR-3-KYC, ADT-1, etc.
    form_name VARCHAR(255) NOT NULL,
    filing_type VARCHAR(50) DEFAULT 'ANNUAL', -- ANNUAL, EVENT_BASED, COMPLIANCE

    -- Financial Year (for annual forms)
    financial_year VARCHAR(10),

    -- Due Date
    due_date DATE NOT NULL,
    extended_due_date DATE,
    filed_date DATE,

    -- Filing Details
    srn_number VARCHAR(100), -- Service Request Number
    filing_fee DECIMAL(10, 2) DEFAULT 0,
    additional_fee DECIMAL(10, 2) DEFAULT 0, -- Late fee

    -- Status
    filing_status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, IN_PROGRESS, READY, FILED, APPROVED, REJECTED, RESUBMISSION_REQUIRED

    -- Documents
    form_pdf_url VARCHAR(500),
    attachments_urls TEXT[],
    approval_certificate_url VARCHAR(500),

    -- Assignment
    assigned_to UUID REFERENCES staff(id),
    prepared_by UUID REFERENCES staff(id),
    filed_by UUID REFERENCES staff(id),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_roc_filings_client ON roc_filings(client_id);
CREATE INDEX idx_roc_filings_form ON roc_filings(form_type);
CREATE INDEX idx_roc_filings_status ON roc_filings(filing_status);

CREATE TABLE company_incorporations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES ca_firms(id),

    -- Application Details
    application_number VARCHAR(50) UNIQUE NOT NULL,
    application_date DATE NOT NULL,

    -- Company Details
    proposed_name_1 VARCHAR(255) NOT NULL,
    proposed_name_2 VARCHAR(255),
    company_type VARCHAR(50) NOT NULL, -- PRIVATE_LIMITED, PUBLIC_LIMITED, OPC, SECTION_8

    -- Promoters
    promoter_details JSONB NOT NULL, -- [{name, pan, din, email, phone, address}]
    total_promoters INTEGER NOT NULL,

    -- Capital
    authorized_capital DECIMAL(15, 2) NOT NULL,
    paid_up_capital DECIMAL(15, 2) NOT NULL,

    -- Registered Office
    registered_office_address TEXT NOT NULL,
    state VARCHAR(100),

    -- Objects
    main_objects TEXT NOT NULL,
    other_objects TEXT,

    -- Professional Details
    auditor_name VARCHAR(255),
    auditor_membership_number VARCHAR(100),

    -- Application Status
    application_status VARCHAR(50) DEFAULT 'NAME_RESERVATION',
    -- NAME_RESERVATION, NAME_APPROVED, SPICe_FILED, INCORPORATION_PENDING, INCORPORATED

    -- Name Approval
    name_approved BOOLEAN DEFAULT false,
    name_approval_date DATE,

    -- Incorporation
    cin_number VARCHAR(30),
    date_of_incorporation DATE,
    incorporation_certificate_url VARCHAR(500),

    -- Fees
    professional_fees DECIMAL(10, 2),
    government_fees DECIMAL(10, 2),
    total_fees DECIMAL(10, 2),
    amount_received DECIMAL(10, 2) DEFAULT 0,

    -- Documents
    moa_url VARCHAR(500),
    aoa_url VARCHAR(500),
    spice_form_url VARCHAR(500),

    -- Assignment
    handled_by UUID REFERENCES staff(id),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ACCOUNTING & BOOKKEEPING
-- ============================================================================

CREATE TABLE accounting_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    firm_id UUID REFERENCES ca_firms(id),

    -- Package Details
    package_name VARCHAR(255) NOT NULL,
    financial_year VARCHAR(10) NOT NULL,

    -- Scope of Work
    service_scope TEXT[], -- VOUCHER_ENTRY, BANK_RECONCILIATION, LEDGER_MAINTENANCE, TRIAL_BALANCE, FINANCIAL_STATEMENTS

    -- Frequency
    service_frequency VARCHAR(50), -- MONTHLY, QUARTERLY, ANNUAL

    -- Monthly Deliverables
    monthly_deliverables TEXT[], -- BANK_RECONCILIATION, CREDITOR_STATEMENT, DEBTOR_STATEMENT, EXPENSE_REPORT

    -- Pricing
    monthly_fee DECIMAL(10, 2),
    annual_fee DECIMAL(10, 2),

    -- Timeline
    start_date DATE NOT NULL,
    end_date DATE,

    -- Assignment
    assigned_accountant_id UUID REFERENCES staff(id),

    -- Status
    package_status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, ON_HOLD, COMPLETED, CANCELLED

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE accounting_deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID REFERENCES accounting_packages(id),
    client_id UUID REFERENCES clients(id),

    -- Deliverable Details
    deliverable_type VARCHAR(100) NOT NULL, -- TRIAL_BALANCE, P&L, BALANCE_SHEET, CASH_FLOW, BANK_RECON
    period VARCHAR(50) NOT NULL, -- MM-YYYY or QQ-YYYY
    financial_year VARCHAR(10) NOT NULL,

    -- Timeline
    due_date DATE NOT NULL,
    delivered_date DATE,

    -- Status
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, SENT_TO_CLIENT

    -- Documents
    deliverable_file_url VARCHAR(500),

    -- Prepared By
    prepared_by UUID REFERENCES staff(id),
    reviewed_by UUID REFERENCES staff(id),

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- DOCUMENT MANAGEMENT
-- ============================================================================

CREATE TABLE client_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    firm_id UUID REFERENCES ca_firms(id),

    -- Document Details
    document_name VARCHAR(255) NOT NULL,
    document_category VARCHAR(100) NOT NULL, -- IDENTITY, REGISTRATION, FINANCIAL, TAX, LEGAL, CONTRACTS, CORRESPONDENCE
    document_type VARCHAR(100), -- PAN_CARD, GST_CERTIFICATE, ITR, AUDIT_REPORT, AGREEMENT, etc.

    -- File Details
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_kb INTEGER,
    file_type VARCHAR(50), -- PDF, DOCX, XLSX, JPG, PNG

    -- Metadata
    document_date DATE,
    financial_year VARCHAR(10),
    validity_start_date DATE,
    validity_end_date DATE,
    is_confidential BOOLEAN DEFAULT false,

    -- Tags for easy search
    tags TEXT[],

    -- Version Control
    version_number INTEGER DEFAULT 1,
    previous_version_id UUID REFERENCES client_documents(id),

    -- Upload Info
    uploaded_by UUID REFERENCES staff(id),
    uploaded_at TIMESTAMP DEFAULT NOW(),

    -- Access Control
    is_client_accessible BOOLEAN DEFAULT false, -- Can client see this in portal?

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_client_documents_client ON client_documents(client_id);
CREATE INDEX idx_client_documents_category ON client_documents(document_category);
CREATE INDEX idx_client_documents_date ON client_documents(document_date);

-- ============================================================================
-- TASK & COMPLIANCE MANAGEMENT
-- ============================================================================

CREATE TABLE compliance_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES ca_firms(id),

    -- Compliance Details
    compliance_name VARCHAR(255) NOT NULL,
    compliance_type VARCHAR(100) NOT NULL, -- GST, INCOME_TAX, TDS, ROC, STATUTORY, REGULATORY
    compliance_frequency VARCHAR(50) NOT NULL, -- MONTHLY, QUARTERLY, HALF_YEARLY, ANNUAL, EVENT_BASED

    -- Applicability
    applicable_to_client_types TEXT[], -- INDIVIDUAL, COMPANY, LLP, etc.
    applicable_conditions JSONB, -- {turnover_above: 20000000, ...}

    -- Timeline
    due_day INTEGER, -- Day of month (for monthly)
    due_month INTEGER, -- Month (for annual)
    due_quarter VARCHAR(10), -- Q1, Q2, Q3, Q4
    buffer_days INTEGER DEFAULT 7, -- Reminder before days

    description TEXT,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE client_compliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id),
    compliance_calendar_id UUID REFERENCES compliance_calendar(id),

    -- Period
    compliance_period VARCHAR(50) NOT NULL, -- MM-YYYY, QQ-YYYY, YYYY
    financial_year VARCHAR(10),

    -- Due Date
    due_date DATE NOT NULL,
    completed_date DATE,

    -- Status
    compliance_status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, IN_PROGRESS, COMPLETED, DELAYED, NOT_APPLICABLE

    -- Assignment
    assigned_to UUID REFERENCES staff(id),

    -- Notifications
    reminder_sent BOOLEAN DEFAULT false,
    reminder_sent_at TIMESTAMP,
    escalation_sent BOOLEAN DEFAULT false,

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_client_compliances_client ON client_compliances(client_id);
CREATE INDEX idx_client_compliances_status ON client_compliances(compliance_status, due_date);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES ca_firms(id),
    client_id UUID REFERENCES clients(id),

    -- Task Details
    task_title VARCHAR(255) NOT NULL,
    task_description TEXT,
    task_category VARCHAR(100), -- FILING, COMPLIANCE, ADVISORY, DOCUMENTATION, FOLLOWUP, INTERNAL

    -- Priority
    priority VARCHAR(50) DEFAULT 'MEDIUM', -- URGENT, HIGH, MEDIUM, LOW

    -- Timeline
    due_date DATE,
    estimated_hours DECIMAL(5, 2),

    -- Assignment
    assigned_to UUID REFERENCES staff(id),
    assigned_by UUID REFERENCES staff(id),

    -- Status
    task_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED
    completion_date DATE,
    actual_hours DECIMAL(5, 2),

    -- Dependencies
    depends_on_task_id UUID REFERENCES tasks(id),

    -- Checklist
    checklist_items JSONB, -- [{item: "...", completed: false}, ...]

    -- Attachments
    attachment_urls TEXT[],

    remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_assigned ON tasks(assigned_to, task_status);
CREATE INDEX idx_tasks_client ON tasks(client_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- ============================================================================
-- BILLING & INVOICING
-- ============================================================================

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES ca_firms(id),
    branch_id UUID REFERENCES firm_branches(id),
    client_id UUID REFERENCES clients(id),

    -- Invoice Details
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    invoice_type VARCHAR(50) DEFAULT 'SERVICE', -- SERVICE, RETAINER, ADVANCE

    -- Period (if applicable)
    billing_period_from DATE,
    billing_period_to DATE,
    financial_year VARCHAR(10),

    -- Amounts
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    taxable_amount DECIMAL(10, 2) NOT NULL,

    -- GST
    cgst_amount DECIMAL(10, 2) DEFAULT 0,
    sgst_amount DECIMAL(10, 2) DEFAULT 0,
    igst_amount DECIMAL(10, 2) DEFAULT 0,
    total_gst DECIMAL(10, 2) DEFAULT 0,

    round_off DECIMAL(5, 2) DEFAULT 0,
    grand_total DECIMAL(10, 2) NOT NULL,

    -- Payment Terms
    payment_terms VARCHAR(100) DEFAULT 'Due on Receipt',
    due_date DATE,

    -- Payment Status
    payment_status VARCHAR(50) DEFAULT 'UNPAID', -- UNPAID, PARTIAL, PAID, OVERDUE
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    balance_amount DECIMAL(10, 2),

    -- Documents
    invoice_pdf_url VARCHAR(500),

    -- Narration
    narration TEXT,

    -- Prepared By
    prepared_by UUID REFERENCES staff(id),
    approved_by UUID REFERENCES staff(id),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_cancelled BOOLEAN DEFAULT false
);

CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);

CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,

    -- Service Reference
    service_id UUID REFERENCES service_catalog(id),

    -- Line Item Details
    description TEXT NOT NULL,
    sac_code VARCHAR(20),
    hsn_code VARCHAR(20),

    quantity DECIMAL(10, 2) DEFAULT 1,
    rate DECIMAL(10, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,

    -- Tax
    gst_rate DECIMAL(5, 2) DEFAULT 18.0,
    gst_amount DECIMAL(10, 2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments_received (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id),
    client_id UUID REFERENCES clients(id),

    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,

    amount_received DECIMAL(10, 2) NOT NULL,

    -- Payment Method
    payment_mode VARCHAR(50) NOT NULL, -- CASH, CHEQUE, NEFT, RTGS, UPI, CARD
    transaction_reference VARCHAR(255),

    cheque_number VARCHAR(50),
    cheque_date DATE,
    bank_name VARCHAR(255),

    remarks TEXT,

    received_by UUID REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_invoice ON payments_received(invoice_id);
CREATE INDEX idx_payments_receipt ON payments_received(receipt_number);

-- ============================================================================
-- COMMUNICATION & NOTIFICATIONS
-- ============================================================================

CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES ca_firms(id),
    client_id UUID REFERENCES clients(id),

    -- Communication Details
    communication_type VARCHAR(50) NOT NULL, -- EMAIL, SMS, WHATSAPP, PHONE, MEETING, LETTER
    subject VARCHAR(255),
    message_body TEXT,

    -- Direction
    direction VARCHAR(50) NOT NULL, -- OUTGOING, INCOMING

    -- Channel Details
    from_email VARCHAR(255),
    to_email VARCHAR(255),
    from_phone VARCHAR(20),
    to_phone VARCHAR(20),

    -- Status (for outgoing)
    delivery_status VARCHAR(50), -- SENT, DELIVERED, FAILED, READ

    -- Attachments
    attachment_urls TEXT[],

    -- Staff Involved
    staff_id UUID REFERENCES staff(id),

    -- Purpose
    purpose VARCHAR(100), -- REMINDER, INVOICE, DOCUMENT_REQUEST, GENERAL, FOLLOWUP

    communication_timestamp TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_communications_client ON communications(client_id);
CREATE INDEX idx_communications_date ON communications(communication_timestamp);

-- ============================================================================
-- ANALYTICS & REPORTS (TimescaleDB)
-- ============================================================================

CREATE TABLE daily_productivity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES ca_firms(id),
    staff_id UUID REFERENCES staff(id),

    work_date DATE NOT NULL,

    -- Tasks
    tasks_completed INTEGER DEFAULT 0,
    tasks_pending INTEGER DEFAULT 0,

    -- Hours
    billable_hours DECIMAL(5, 2) DEFAULT 0,
    non_billable_hours DECIMAL(5, 2) DEFAULT 0,

    -- Returns Filed
    gst_returns_filed INTEGER DEFAULT 0,
    itr_filed INTEGER DEFAULT 0,
    tds_returns_filed INTEGER DEFAULT 0,
    roc_forms_filed INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(staff_id, work_date)
);

SELECT create_hypertable('daily_productivity', 'created_at', if_not_exists => TRUE);

CREATE TABLE monthly_revenue_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES ca_firms(id),

    month_year DATE NOT NULL, -- First day of month

    -- Invoicing
    total_invoices INTEGER DEFAULT 0,
    total_invoiced_amount DECIMAL(12, 2) DEFAULT 0,

    -- Collections
    total_collections DECIMAL(12, 2) DEFAULT 0,
    outstanding_amount DECIMAL(12, 2) DEFAULT 0,

    -- Service-wise Revenue
    gst_revenue DECIMAL(10, 2) DEFAULT 0,
    itr_revenue DECIMAL(10, 2) DEFAULT 0,
    audit_revenue DECIMAL(10, 2) DEFAULT 0,
    accounting_revenue DECIMAL(10, 2) DEFAULT 0,
    other_revenue DECIMAL(10, 2) DEFAULT 0,

    -- Clients
    active_clients INTEGER DEFAULT 0,
    new_clients INTEGER DEFAULT 0,
    lost_clients INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(firm_id, month_year)
);

SELECT create_hypertable('monthly_revenue_summary', 'created_at', if_not_exists => TRUE);

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firm_id UUID REFERENCES ca_firms(id),

    user_id UUID,
    user_type VARCHAR(50),

    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,

    action_description TEXT,
    old_values JSONB,
    new_values JSONB,

    ip_address VARCHAR(50),
    user_agent TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
SELECT create_hypertable('audit_logs', 'created_at', if_not_exists => TRUE);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Pending GST returns
CREATE VIEW v_pending_gst_returns AS
SELECT
    c.client_code,
    c.client_name,
    gr.gstin,
    gr.return_type,
    gr.return_period,
    gr.due_date,
    CURRENT_DATE - gr.due_date as days_overdue,
    gr.filing_status,
    s.first_name || ' ' || s.last_name as assigned_to
FROM gst_returns gr
JOIN clients c ON gr.client_id = c.id
LEFT JOIN staff s ON gr.assigned_to = s.id
WHERE gr.filing_status NOT IN ('FILED')
  AND gr.due_date <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY gr.due_date;

-- Pending ITR filings
CREATE VIEW v_pending_itr_filings AS
SELECT
    c.client_code,
    c.client_name,
    itr.assessment_year,
    itr.itr_form_type,
    itr.due_date,
    CURRENT_DATE - itr.due_date as days_overdue,
    itr.filing_status,
    s.first_name || ' ' || s.last_name as assigned_to
FROM itr_filings itr
JOIN clients c ON itr.client_id = c.id
LEFT JOIN staff s ON itr.assigned_to = s.id
WHERE itr.filing_status NOT IN ('FILED', 'PROCESSED')
ORDER BY itr.due_date;

-- Upcoming compliance deadlines
CREATE VIEW v_upcoming_compliance AS
SELECT
    c.client_code,
    c.client_name,
    cc.compliance_name,
    cc.compliance_type,
    ccl.compliance_period,
    ccl.due_date,
    ccl.compliance_status,
    s.first_name || ' ' || s.last_name as assigned_to
FROM client_compliances ccl
JOIN clients c ON ccl.client_id = c.id
JOIN compliance_calendar cc ON ccl.compliance_calendar_id = cc.id
LEFT JOIN staff s ON ccl.assigned_to = s.id
WHERE ccl.compliance_status IN ('PENDING', 'IN_PROGRESS')
  AND ccl.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '15 days'
ORDER BY ccl.due_date;

-- Outstanding invoices
CREATE VIEW v_outstanding_invoices AS
SELECT
    i.invoice_number,
    i.invoice_date,
    c.client_code,
    c.client_name,
    c.phone,
    i.grand_total,
    i.amount_paid,
    i.balance_amount,
    i.due_date,
    CURRENT_DATE - i.due_date as days_overdue
FROM invoices i
JOIN clients c ON i.client_id = c.id
WHERE i.payment_status IN ('UNPAID', 'PARTIAL', 'OVERDUE')
ORDER BY i.due_date;

-- CA workload
CREATE VIEW v_ca_workload AS
SELECT
    s.employee_code,
    s.first_name || ' ' || s.last_name as ca_name,
    COUNT(DISTINCT c.id) as total_clients,
    COUNT(DISTINCT CASE WHEN t.task_status IN ('PENDING', 'IN_PROGRESS') THEN t.id END) as pending_tasks,
    COUNT(DISTINCT CASE WHEN gr.filing_status NOT IN ('FILED') THEN gr.id END) as pending_gst_returns,
    COUNT(DISTINCT CASE WHEN itr.filing_status NOT IN ('FILED', 'PROCESSED') THEN itr.id END) as pending_itr_filings
FROM staff s
LEFT JOIN clients c ON s.id = c.primary_ca_id AND c.is_active = true
LEFT JOIN tasks t ON s.id = t.assigned_to
LEFT JOIN gst_returns gr ON s.id = gr.assigned_to
LEFT JOIN itr_filings itr ON s.id = itr.assigned_to
WHERE s.staff_category = 'CHARTERED_ACCOUNTANT'
  AND s.is_active = true
GROUP BY s.id, s.employee_code, s.first_name, s.last_name;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update client compliance status
CREATE OR REPLACE FUNCTION update_compliance_on_filing()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.filing_status = 'FILED' THEN
        UPDATE client_compliances
        SET compliance_status = 'COMPLETED',
            completed_date = NEW.filed_date
        WHERE client_id = NEW.client_id
          AND compliance_period = NEW.return_period
          AND compliance_status != 'COMPLETED';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_compliance_gst
AFTER UPDATE ON gst_returns
FOR EACH ROW
EXECUTE FUNCTION update_compliance_on_filing();

-- Auto-update invoice balance
CREATE OR REPLACE FUNCTION update_invoice_balance()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE invoices
    SET amount_paid = (
        SELECT COALESCE(SUM(amount_received), 0)
        FROM payments_received
        WHERE invoice_id = NEW.invoice_id
    ),
    balance_amount = grand_total - (
        SELECT COALESCE(SUM(amount_received), 0)
        FROM payments_received
        WHERE invoice_id = NEW.invoice_id
    ),
    payment_status = CASE
        WHEN (grand_total - (SELECT COALESCE(SUM(amount_received), 0) FROM payments_received WHERE invoice_id = NEW.invoice_id)) = 0
        THEN 'PAID'
        WHEN (SELECT COALESCE(SUM(amount_received), 0) FROM payments_received WHERE invoice_id = NEW.invoice_id) > 0
        THEN 'PARTIAL'
        WHEN due_date < CURRENT_DATE
        THEN 'OVERDUE'
        ELSE 'UNPAID'
    END
    WHERE id = NEW.invoice_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_invoice_balance
AFTER INSERT ON payments_received
FOR EACH ROW
EXECUTE FUNCTION update_invoice_balance();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_gst_returns_updated_at BEFORE UPDATE ON gst_returns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_itr_filings_updated_at BEFORE UPDATE ON itr_filings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_clients_services ON clients USING gin(services_subscribed);
CREATE INDEX idx_tasks_status_date ON tasks(task_status, due_date);
CREATE INDEX idx_invoices_payment_status ON invoices(payment_status, due_date);

-- Text search
CREATE INDEX idx_clients_name_search ON clients USING gin(to_tsvector('english', client_name));

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE clients IS 'Complete client information with tax registrations and portal credentials';
COMMENT ON TABLE gst_returns IS 'GST return filing tracking with all form types';
COMMENT ON TABLE itr_filings IS 'Income Tax Return filings with computation details';
COMMENT ON TABLE audit_engagements IS 'Statutory and tax audit engagement management';
COMMENT ON TABLE roc_filings IS 'ROC/MCA form filings and compliance tracking';
COMMENT ON TABLE compliance_calendar IS 'Master compliance calendar with auto-generation of due dates';
COMMENT ON TABLE invoices IS 'Professional service invoicing with GST';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
