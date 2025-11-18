# HOSPITAL INFORMATION SYSTEM (HIS) - COMPLETE IMPLEMENTATION
## Enterprise-Grade Multi-Specialty Hospital Management

**Solution ID:** HIS-05
**Version:** 2.0.0 Enterprise
**Target:** Multi-specialty Hospitals, Nursing Homes, Medical Centers (100-500 beds)

---

## 📊 SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   HOSPITAL INFORMATION SYSTEM (HIS)                     │
│                         LAYERED ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  FRONTEND LAYER (Multi-channel Access)                                  │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────┤
│ Doctor       │ Nurse        │ Patient      │ Admin        │ Pharmacy   │
│ Portal       │ Station      │ Portal       │ Dashboard    │ POS        │
│ (Web/Mobile) │ (Tablets)    │ (Mobile App) │ (Web)        │ (Desktop)  │
└──────────────┴──────────────┴──────────────┴──────────────┴────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  API GATEWAY (Load Balanced, Rate Limited)                              │
│  - Authentication (JWT + OAuth 2.0)                                     │
│  - Authorization (RBAC - 50+ roles)                                     │
│  - API Versioning (v1, v2)                                              │
└─────────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  MICROSERVICES (Containerized - Docker/Kubernetes)                      │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────┤
│ OPD          │ IPD          │ EMERGENCY    │ OPERATION    │ PHARMACY   │
│ Management   │ Management   │ Management   │ THEATER      │ Management │
├──────────────┼──────────────┼──────────────┼──────────────┼────────────┤
│ LABORATORY   │ RADIOLOGY    │ BILLING      │ INSURANCE    │ HR & PAYROLL│
│ (LIMS)       │ (PACS)       │              │ (TPA)        │            │
├──────────────┼──────────────┼──────────────┼──────────────┼────────────┤
│ BED          │ AMBULANCE    │ BLOOD BANK   │ DIET         │ REPORTS &  │
│ MANAGEMENT   │ TRACKING     │              │ KITCHEN      │ ANALYTICS  │
└──────────────┴──────────────┴──────────────┴──────────────┴────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  DATA LAYER                                                              │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────┤
│ PostgreSQL   │ MongoDB      │ Redis        │ ElasticSearch│ TimescaleDB│
│ (Primary DB) │ (Documents)  │ (Cache)      │ (Search)     │ (Analytics)│
└──────────────┴──────────────┴──────────────┴──────────────┴────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  INTEGRATION LAYER                                                       │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────┤
│ ABDM         │ Lab Machines │ Imaging      │ Payment      │ WhatsApp   │
│ (Ayushman)   │ (HL7/FHIR)   │ Devices      │ Gateways     │ Business   │
│              │              │ (DICOM)      │              │ API        │
└──────────────┴──────────────┴──────────────┴──────────────┴────────────┘
```

---

## 🗄️ CORE DATABASE SCHEMA (120+ Tables)

### **Patient Management (EMR/EHR)**

```sql
-- ============================================================================
-- HOSPITAL INFORMATION SYSTEM - DATABASE SCHEMA
-- HIPAA/ABDM Compliant Electronic Medical Records
-- ============================================================================

-- ============================================================================
-- PATIENT MASTER
-- ============================================================================

CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Patient Identification
    patient_id VARCHAR(20) UNIQUE NOT NULL, -- HOSP-LKO-2025-001234
    uhid VARCHAR(20) UNIQUE, -- Universal Health ID (optional, for multi-hospital)
    abha_number VARCHAR(20), -- Ayushman Bharat Health Account

    -- Demographics
    title VARCHAR(10),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100),

    father_husband_name VARCHAR(255),

    date_of_birth DATE NOT NULL,
    age_years INTEGER,
    age_months INTEGER,
    age_days INTEGER,

    gender VARCHAR(20) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),

    -- Contact
    mobile VARCHAR(15) NOT NULL,
    alternate_mobile VARCHAR(15),
    email VARCHAR(255),
    whatsapp_number VARCHAR(15),

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),

    -- ID Proof
    id_proof_type VARCHAR(50), -- aadhar, voter_id, pan, driving_license
    id_proof_number VARCHAR(50),
    aadhar_number VARCHAR(12), -- stored encrypted

    -- Medical Profile
    blood_group VARCHAR(5) CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    known_allergies TEXT[],
    chronic_conditions TEXT[],
    current_medications TEXT[],

    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_relation VARCHAR(50),
    emergency_contact_mobile VARCHAR(15),

    -- Patient Type & Classification
    patient_type VARCHAR(50) DEFAULT 'GENERAL',
    -- GENERAL, VIP, STAFF, STAFF_DEPENDENT, GOVERNMENT_EMPLOYEE, CORPORATE

    economic_status VARCHAR(50), -- BPL, APL, MIDDLE_CLASS, AFFLUENT
    religion VARCHAR(50),
    marital_status VARCHAR(50),
    occupation VARCHAR(100),

    -- Registration Details
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    registration_time TIME NOT NULL DEFAULT CURRENT_TIME,
    registered_by UUID REFERENCES users(id),
    registration_fee_paid DECIMAL(8, 2),

    -- Loyalty & History
    total_visits INTEGER DEFAULT 0,
    total_admissions INTEGER DEFAULT 0,
    last_visit_date DATE,
    lifetime_revenue DECIMAL(12, 2) DEFAULT 0,

    -- Insurance (if applicable)
    has_insurance BOOLEAN DEFAULT false,
    primary_insurance_id UUID REFERENCES insurance_providers(id),
    insurance_policy_number VARCHAR(100),
    insurance_validity_date DATE,

    -- Government Schemes
    has_ayushman_card BOOLEAN DEFAULT false,
    ayushman_card_number VARCHAR(50),
    has_esi_card BOOLEAN DEFAULT false,
    esi_number VARCHAR(50),

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_deceased BOOLEAN DEFAULT false,
    deceased_date DATE,

    -- Privacy & Consent
    consent_for_treatment BOOLEAN DEFAULT false,
    consent_for_data_sharing BOOLEAN DEFAULT false,
    consent_for_marketing BOOLEAN DEFAULT false,

    -- Tags for segmentation
    tags TEXT[],

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_patient_id ON patients(patient_id);
CREATE INDEX idx_patients_mobile ON patients(mobile);
CREATE INDEX idx_patients_abha ON patients(abha_number);
CREATE INDEX idx_patients_name ON patients USING gin (to_tsvector('english', first_name || ' ' || COALESCE(last_name, '')));

-- Medical History (Comprehensive)
CREATE TABLE patient_medical_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,

    -- Past Medical History
    past_illnesses TEXT[],
    past_surgeries JSONB[], -- [{name, date, hospital, surgeon}]
    hospitalizations JSONB[], -- [{reason, date, duration, hospital}]

    -- Family History
    family_history JSONB, -- {diabetes: ['father', 'grandfather'], hypertension: ['mother']}

    -- Social History
    smoking_status VARCHAR(50), -- NEVER, FORMER, CURRENT
    smoking_pack_years DECIMAL(5, 2),
    alcohol_consumption VARCHAR(50), -- NEVER, OCCASIONAL, REGULAR, HEAVY
    drug_use TEXT,
    occupation_hazards TEXT,

    -- Gynecological History (for females)
    lmp_date DATE, -- Last Menstrual Period
    gravida INTEGER, -- Number of pregnancies
    para INTEGER, -- Number of live births
    abortion INTEGER,
    contraception VARCHAR(100),

    -- Vaccination History
    vaccinations JSONB[], -- [{vaccine, date, dose, batch_no}]

    -- Imported Records (from other hospitals)
    previous_hospital_records JSONB[],

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- OPD (OUTPATIENT DEPARTMENT) MANAGEMENT
-- ============================================================================

CREATE TABLE opd_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    appointment_number VARCHAR(30) UNIQUE NOT NULL, -- OPD-LKO-20251118-001

    patient_id UUID REFERENCES patients(id) NOT NULL,
    doctor_id UUID REFERENCES doctors(id) NOT NULL,
    department_id UUID REFERENCES departments(id),

    -- Appointment Details
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_type VARCHAR(50) DEFAULT 'NEW',
    -- NEW, FOLLOWUP, EMERGENCY, VIDEO_CONSULT

    -- Status
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    -- SCHEDULED, CHECKED_IN, CONSULTED, CANCELLED, NO_SHOW

    -- Queue Management
    token_number INTEGER,
    checked_in_at TIMESTAMP,
    consultation_started_at TIMESTAMP,
    consultation_ended_at TIMESTAMP,
    waiting_time_minutes INTEGER,

    -- Chief Complaint
    chief_complaint TEXT NOT NULL,

    -- Vitals (taken by nurse before doctor consultation)
    vitals_recorded BOOLEAN DEFAULT false,
    temperature_f DECIMAL(4, 1),
    pulse_rate INTEGER,
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    respiratory_rate INTEGER,
    spo2_percent INTEGER,
    weight_kg DECIMAL(5, 2),
    height_cm DECIMAL(5, 2),
    bmi DECIMAL(4, 2),

    -- Consultation Fee
    consultation_fee DECIMAL(8, 2),
    fee_paid BOOLEAN DEFAULT false,
    payment_id UUID REFERENCES payments(id),

    -- Referral
    referred_by_doctor UUID REFERENCES doctors(id),
    referral_note TEXT,

    -- Cancellation
    cancelled_at TIMESTAMP,
    cancelled_by UUID REFERENCES users(id),
    cancellation_reason TEXT,

    -- Created
    booked_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_opd_patient ON opd_appointments(patient_id);
CREATE INDEX idx_opd_doctor ON opd_appointments(doctor_id);
CREATE INDEX idx_opd_date ON opd_appointments(appointment_date);
CREATE INDEX idx_opd_status ON opd_appointments(status);

-- Doctor's Consultation Notes (SOAP Format)
CREATE TABLE opd_consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES opd_appointments(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),

    consultation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- SOAP Notes
    -- S: Subjective
    subjective_notes TEXT, -- Patient's complaints in their words

    -- O: Objective
    objective_findings TEXT, -- Physical examination findings

    -- A: Assessment
    provisional_diagnosis TEXT[],
    final_diagnosis TEXT[],
    icd_10_codes VARCHAR(10)[], -- ICD-10 diagnosis codes

    -- P: Plan
    treatment_plan TEXT,

    -- Prescriptions (detailed in separate table)
    prescription_id UUID REFERENCES prescriptions(id),

    -- Investigations Ordered
    lab_tests_ordered TEXT[],
    imaging_ordered TEXT[],

    -- Follow-up
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_after_days INTEGER,
    follow_up_instructions TEXT,

    -- Referral to Specialist
    referred_to_doctor UUID REFERENCES doctors(id),
    referred_to_department UUID REFERENCES departments(id),
    referral_reason TEXT,

    -- Admission Required
    admission_required BOOLEAN DEFAULT false,
    admission_reason TEXT,

    -- Documents
    consultation_documents JSONB[], -- [{type, url, description}]

    -- Billing
    consultation_charges DECIMAL(8, 2),
    procedure_charges DECIMAL(8, 2),

    -- Digital Signature
    doctor_signature_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions (E-Prescription)
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_number VARCHAR(30) UNIQUE NOT NULL,

    patient_id UUID REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),
    consultation_id UUID REFERENCES opd_consultations(id),

    prescription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Diagnosis
    diagnosis TEXT NOT NULL,

    -- Patient Instructions
    general_instructions TEXT,
    diet_advice TEXT,
    precautions TEXT,

    -- Prescription Valid Till
    valid_till DATE,

    -- Status
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, CANCELLED

    -- Digital Signature
    doctor_signature_url VARCHAR(500),
    prescription_pdf_url VARCHAR(500), -- Generated PDF

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prescription_medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,

    medicine_name VARCHAR(255) NOT NULL,
    medicine_id UUID REFERENCES medicines(id), -- from master

    -- Dosage
    strength VARCHAR(50), -- e.g., "500mg", "5mg/ml"
    dosage_form VARCHAR(50), -- Tablet, Capsule, Syrup, Injection, Cream

    -- Frequency
    frequency VARCHAR(100), -- "1-0-1", "1-1-1", "SOS", "STAT"
    frequency_detail TEXT, -- "After meals", "Before bed", etc.

    route VARCHAR(50), -- ORAL, IV, IM, TOPICAL, etc.

    -- Duration
    duration_days INTEGER,
    duration_text VARCHAR(100), -- "7 days", "15 days", "Till symptoms subside"

    -- Quantity
    quantity INTEGER,
    quantity_unit VARCHAR(20), -- Tablets, ml, gm

    -- Instructions
    special_instructions TEXT,

    -- Substitution Allowed
    substitution_allowed BOOLEAN DEFAULT true,

    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- IPD (INPATIENT DEPARTMENT) MANAGEMENT
-- ============================================================================

CREATE TABLE ipd_admissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    admission_number VARCHAR(30) UNIQUE NOT NULL, -- IPD-LKO-2025-001234

    patient_id UUID REFERENCES patients(id) NOT NULL,
    consulting_doctor_id UUID REFERENCES doctors(id) NOT NULL,
    department_id UUID REFERENCES departments(id),

    -- Admission Details
    admission_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    admission_type VARCHAR(50) NOT NULL,
    -- EMERGENCY, PLANNED, REFERRAL, TRANSFER, MATERNITY

    admission_source VARCHAR(50),
    -- EMERGENCY, OPD, DIRECT, TRANSFER_FROM_OTHER_HOSPITAL

    -- Reason for Admission
    chief_complaint TEXT NOT NULL,
    provisional_diagnosis TEXT[],
    final_diagnosis TEXT[], -- Updated during stay or at discharge

    -- Bed Assignment
    bed_id UUID REFERENCES beds(id),
    ward_id UUID REFERENCES wards(id),
    bed_category VARCHAR(50), -- GENERAL, SEMI_PRIVATE, PRIVATE, ICU, NICU, PICU

    -- Status
    status VARCHAR(50) DEFAULT 'ADMITTED',
    -- ADMITTED, UNDER_TREATMENT, STABLE, CRITICAL, DISCHARGED, ABSCONDED, LAMA, DEATH

    -- Discharge Details
    discharge_date TIMESTAMP,
    discharge_type VARCHAR(50),
    -- NORMAL, LAMA (Left Against Medical Advice), ABSCONDED, TRANSFER, DEATH
    discharge_summary_id UUID REFERENCES discharge_summaries(id),

    -- Length of Stay
    total_days INTEGER,

    -- Financial
    estimated_cost DECIMAL(12, 2),
    advance_paid DECIMAL(12, 2) DEFAULT 0,
    total_bill_amount DECIMAL(12, 2),

    -- Insurance/TPA
    is_insurance_case BOOLEAN DEFAULT false,
    tpa_id UUID REFERENCES tpa_companies(id),
    tpa_approval_number VARCHAR(100),
    tpa_approved_amount DECIMAL(12, 2),

    -- Government Schemes
    is_ayushman_case BOOLEAN DEFAULT false,
    ayushman_approval_number VARCHAR(100),

    -- Created
    admitted_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ipd_patient ON ipd_admissions(patient_id);
CREATE INDEX idx_ipd_doctor ON ipd_admissions(consulting_doctor_id);
CREATE INDEX idx_ipd_status ON ipd_admissions(status);
CREATE INDEX idx_ipd_admission_date ON ipd_admissions(admission_date);

-- Doctor's Progress Notes (Daily Rounds)
CREATE TABLE ipd_progress_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admission_id UUID REFERENCES ipd_admissions(id) ON DELETE CASCADE,

    note_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    note_type VARCHAR(50) DEFAULT 'PROGRESS', -- PROGRESS, CONSULTATION, EMERGENCY

    doctor_id UUID REFERENCES doctors(id),

    -- Clinical Assessment
    patient_condition VARCHAR(50), -- STABLE, IMPROVING, DETERIORATING, CRITICAL
    consciousness_level VARCHAR(50), -- ALERT, DROWSY, UNCONSCIOUS

    -- Notes
    subjective_notes TEXT,
    objective_findings TEXT,
    assessment TEXT,
    plan TEXT,

    -- Orders
    medication_changes TEXT,
    diet_changes TEXT,
    activity_restrictions TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nursing Notes & Care Plan
CREATE TABLE nursing_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admission_id UUID REFERENCES ipd_admissions(id) ON DELETE CASCADE,

    note_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shift VARCHAR(20), -- MORNING, EVENING, NIGHT
    nurse_id UUID REFERENCES users(id),

    -- Vitals Monitoring
    temperature_f DECIMAL(4, 1),
    pulse_rate INTEGER,
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    respiratory_rate INTEGER,
    spo2_percent INTEGER,

    -- Intake/Output Chart
    oral_intake_ml INTEGER,
    iv_intake_ml INTEGER,
    total_intake_ml INTEGER,
    urine_output_ml INTEGER,
    other_output_ml INTEGER,
    total_output_ml INTEGER,

    -- General Observations
    general_condition TEXT,
    complaints TEXT,
    care_provided TEXT,
    medications_administered TEXT,

    -- Special Observations
    wound_status TEXT,
    drain_output TEXT,
    consciousness_level VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medication Administration Record (MAR)
CREATE TABLE medication_administration (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admission_id UUID REFERENCES ipd_admissions(id) ON DELETE CASCADE,
    prescription_medicine_id UUID REFERENCES prescription_medicines(id),

    -- Scheduled
    scheduled_datetime TIMESTAMP NOT NULL,

    -- Administered
    administered_datetime TIMESTAMP,
    administered_by UUID REFERENCES users(id),

    -- Status
    status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, ADMINISTERED, SKIPPED, REFUSED_BY_PATIENT

    skip_reason TEXT,

    -- Dosage Given
    dose_given VARCHAR(100),
    route VARCHAR(50),

    -- Patient Response
    patient_response TEXT,
    adverse_reaction BOOLEAN DEFAULT false,
    adverse_reaction_details TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- LABORATORY INFORMATION MANAGEMENT SYSTEM (LIMS)
-- ============================================================================

CREATE TABLE lab_test_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    request_number VARCHAR(30) UNIQUE NOT NULL, -- LAB-LKO-2025-001234

    patient_id UUID REFERENCES patients(id) NOT NULL,
    doctor_id UUID REFERENCES doctors(id),

    -- Source
    request_source VARCHAR(50), -- OPD, IPD, EMERGENCY
    source_id UUID, -- ID of OPD appointment or IPD admission

    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Tests Requested
    tests_requested TEXT[] NOT NULL,

    -- Sample Collection
    sample_collection_status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, COLLECTED, IN_LAB, PROCESSING, COMPLETED

    sample_collected_at TIMESTAMP,
    sample_collected_by UUID REFERENCES users(id),
    sample_type VARCHAR(50), -- Blood, Urine, Stool, Sputum, etc.
    sample_barcode VARCHAR(100) UNIQUE,

    -- Urgency
    is_urgent BOOLEAN DEFAULT false,
    urgency_reason TEXT,

    -- Billing
    total_amount DECIMAL(8, 2),
    paid_amount DECIMAL(8, 2),
    payment_status VARCHAR(50) DEFAULT 'PENDING',

    -- Status
    overall_status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, PARTIAL, COMPLETED, CANCELLED

    -- Report
    report_ready BOOLEAN DEFAULT false,
    report_ready_at TIMESTAMP,
    report_pdf_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lab_test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    request_id UUID REFERENCES lab_test_requests(id) ON DELETE CASCADE,
    test_master_id UUID REFERENCES lab_test_master(id),

    test_name VARCHAR(255) NOT NULL,
    test_code VARCHAR(50),

    -- Results
    result_value VARCHAR(500),
    result_text TEXT,
    result_unit VARCHAR(50),

    -- Reference Range
    reference_range VARCHAR(100),
    is_abnormal BOOLEAN DEFAULT false,
    abnormal_flag VARCHAR(10), -- H (High), L (Low), HH (Very High), LL (Very Low)

    -- Machine Integration
    machine_id UUID REFERENCES lab_machines(id),
    auto_imported BOOLEAN DEFAULT false,

    -- Verification
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,

    remarks TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab Test Master (Catalog)
CREATE TABLE lab_test_master (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    test_name VARCHAR(255) NOT NULL UNIQUE,
    test_code VARCHAR(50) UNIQUE,
    test_category VARCHAR(100), -- BIOCHEMISTRY, HEMATOLOGY, MICROBIOLOGY, PATHOLOGY

    sample_type VARCHAR(50)[],
    sample_volume VARCHAR(50),

    turnaround_time_hours INTEGER DEFAULT 24,

    reference_range JSONB, -- {male: {min, max}, female: {min, max}, unit: ''}

    price DECIMAL(8, 2) NOT NULL,

    requires_fasting BOOLEAN DEFAULT false,
    special_instructions TEXT,

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- RADIOLOGY & IMAGING (PACS Integration)
-- ============================================================================

CREATE TABLE radiology_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    request_number VARCHAR(30) UNIQUE NOT NULL, -- RAD-LKO-2025-001234

    patient_id UUID REFERENCES patients(id) NOT NULL,
    doctor_id UUID REFERENCES doctors(id),

    request_source VARCHAR(50), -- OPD, IPD, EMERGENCY
    source_id UUID,

    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Imaging Type
    imaging_type VARCHAR(100) NOT NULL,
    -- XRAY, CT_SCAN, MRI, ULTRASOUND, MAMMOGRAPHY, PET_SCAN, etc.

    body_part VARCHAR(100),
    laterality VARCHAR(20), -- LEFT, RIGHT, BILATERAL

    -- Clinical Indication
    clinical_history TEXT NOT NULL,
    provisional_diagnosis TEXT,

    -- Appointment
    scheduled_datetime TIMESTAMP,

    -- Status
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    -- SCHEDULED, IN_PROGRESS, COMPLETED, REPORTED, CANCELLED

    -- Imaging Done
    imaging_done_at TIMESTAMP,
    imaging_done_by UUID REFERENCES users(id),

    -- Images
    dicom_study_id VARCHAR(100), -- PACS system ID
    images_uploaded BOOLEAN DEFAULT false,

    -- Reporting
    report_ready BOOLEAN DEFAULT false,
    reported_by UUID REFERENCES doctors(id), -- Radiologist
    reported_at TIMESTAMP,
    report_text TEXT,
    report_pdf_url VARCHAR(500),

    findings TEXT,
    impression TEXT,

    -- Billing
    total_amount DECIMAL(8, 2),
    paid_amount DECIMAL(8, 2),
    payment_status VARCHAR(50) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Radiology Images (DICOM)
CREATE TABLE radiology_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    request_id UUID REFERENCES radiology_requests(id) ON DELETE CASCADE,

    image_type VARCHAR(50), -- XRAY, CT, MRI
    image_url VARCHAR(500) NOT NULL, -- S3 URL or PACS URL
    thumbnail_url VARCHAR(500),

    dicom_file_path VARCHAR(500),
    file_size_kb INTEGER,

    image_sequence INTEGER DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ... (Continued with 50+ more tables)
```

---

## 🎨 VISUAL DEMO - OPD CONSOLE

```
╔════════════════════════════════════════════════════════════════════════════╗
║  🏥 HOSPITAL INFORMATION SYSTEM - OPD CONSOLE         Dr. Amit Sharma     ║
║  Medanta Lucknow | Department: Cardiology            Nov 18, 2025 10:45 AM║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  📊 TODAY'S OPD SUMMARY                                                   ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │  Total Appointments: 35   ✅ Consulted: 18   ⏳ Pending: 17          │ ║
║  │  Current Token: 19        🚫 No Show: 0      ⏱️  Avg Wait: 12 min   │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  🔔 NEXT PATIENT                                                          ║
║  ╔══════════════════════════════════════════════════════════════════════╗ ║
║  ║  TOKEN #19                                              [CALL PATIENT]║ ║
║  ╠══════════════════════════════════════════════════════════════════════╣ ║
║  ║  👤 Name: Rajesh Kumar                   Age: 45Y    Gender: Male    ║ ║
║  ║  📱 Mobile: +91-9876543210              Blood Group: B+              ║ ║
║  ║  🆔 UHID: MED-LKO-2023-045678          Type: Follow-up              ║ ║
║  ╠══════════════════════════════════════════════════════════════════════╣ ║
║  ║  📋 CHIEF COMPLAINT:                                                 ║ ║
║  ║  Chest pain on exertion, breathlessness for 2 days                  ║ ║
║  ╠══════════════════════════════════════════════════════════════════════╣ ║
║  ║  🩺 VITALS (Recorded at 10:40 AM by Nurse Priya)                    ║ ║
║  ║  ┌────────────────────────────────────────────────────────────────┐ ║ ║
║  ║  │  Temp: 98.4°F  Pulse: 88/min  BP: 140/90 mmHg  SpO2: 96%     │ ║ ║
║  ║  │  Weight: 78 kg  Height: 170 cm  BMI: 27.0 (Overweight)        │ ║ ║
║  ║  └────────────────────────────────────────────────────────────────┘ ║ ║
║  ╠══════════════════════════════════════════════════════════════════════╣ ║
║  ║  📜 MEDICAL HISTORY:                                                 ║ ║
║  ║  • Hypertension (diagnosed 2020) - on Amlodipine 5mg                ║ ║
║  ║  • Type 2 Diabetes (diagnosed 2018) - on Metformin 500mg            ║ ║
║  ║  • Previous MI (Myocardial Infarction) - March 2022                 ║ ║
║  ║  ⚠️  Allergies: Aspirin (rash)                                      ║ ║
║  ╠══════════════════════════════════════════════════════════════════════╣ ║
║  ║  📅 LAST VISIT: Oct 18, 2025 (30 days ago)                          ║ ║
║  ║  Previous Diagnosis: Stable angina, HTN, DM                         ║ ║
║  ║  [VIEW PREVIOUS PRESCRIPTIONS] [VIEW LAB REPORTS] [VIEW ECG]        ║ ║
║  ╠══════════════════════════════════════════════════════════════════════╣ ║
║  ║  [🩺 START CONSULTATION]  [📋 VIEW FULL EMR]  [⏭️  SKIP TO NEXT]    ║ ║
║  ╚══════════════════════════════════════════════════════════════════════╝ ║
║                                                                            ║
║  👥 WAITING QUEUE (Next 5)                                                ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │ #20 Priya Sharma, 32F - New patient - Back pain                     │ ║
║  │ #21 Amit Patel, 55M - Follow-up - Post-angioplasty review           │ ║
║  │ #22 Sarah Khan, 28F - New - Palpitations                            │ ║
║  │ #23 Vikram Singh, 60M - Follow-up - Hypertension                    │ ║
║  │ #24 Deepak Mehta, 48M - New - Chest discomfort                      │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  [👥 Queue] [📝 Consultations] [📊 Reports] [⚙️ Settings] [🔔 Alerts: 2] ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## 📱 CONSULTATION SCREEN (After clicking "Start Consultation")

```
╔════════════════════════════════════════════════════════════════════════════╗
║  CONSULTATION - Rajesh Kumar (UHID: MED-LKO-2023-045678)                  ║
║  [← Back to Queue]                                        [💾 Save Draft]  ║
╠════════════════════════════════════════════════════════════════════════════╣
║  🗒️  SOAP NOTES                                                           ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │  S - SUBJECTIVE (Patient's Complaints)                               │ ║
║  │  ┌────────────────────────────────────────────────────────────────┐  │ ║
║  │  │ Patient complains of chest pain on exertion for past 2 days.   │  │ ║
║  │  │ Pain radiates to left arm. Also experiencing breathlessness.   │  │ ║
║  │  │ No rest pain. No palpitations. Good sleep.                     │  │ ║
║  │  └────────────────────────────────────────────────────────────────┘  │ ║
║  │                                                                       │ ║
║  │  O - OBJECTIVE (Physical Examination)                                │ ║
║  │  ┌────────────────────────────────────────────────────────────────┐  │ ║
║  │  │ General: Conscious, alert, oriented. Mild distress.            │  │ ║
║  │  │ CVS: S1 S2 heard, no murmur. JVP not raised.                   │  │ ║
║  │  │ RS: Bilateral air entry equal, no added sounds.                │  │ ║
║  │  │ P/A: Soft, non-tender.                                         │  │ ║
║  │  └────────────────────────────────────────────────────────────────┘  │ ║
║  │                                                                       │ ║
║  │  A - ASSESSMENT (Diagnosis)                                          │ ║
║  │  ┌────────────────────────────────────────────────────────────────┐  │ ║
║  │  │ Provisional: Unstable angina, post-MI                          │  │ ║
║  │  │ ICD-10: I20.0 (Unstable angina)                                │  │ ║
║  │  │ [Search ICD-10 Codes]                                          │  │ ║
║  │  └────────────────────────────────────────────────────────────────┘  │ ║
║  │                                                                       │ ║
║  │  P - PLAN (Treatment)                                                │ ║
║  │  ┌────────────────────────────────────────────────────────────────┐  │ ║
║  │  │ 1. Medications (see prescription below)                        │  │ ║
║  │  │ 2. Investigations: ECG, Echo, TMT                              │  │ ║
║  │  │ 3. Admit if pain worsens                                       │  │ ║
║  │  │ 4. Follow-up after 1 week                                      │  │ ║
║  │  └────────────────────────────────────────────────────────────────┘  │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  💊 E-PRESCRIPTION                                                        ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │  [+ Add Medicine from Master]  [+ Add Custom Medicine]              │ ║
║  ├──────────────────────────────────────────────────────────────────────┤ ║
║  │  1. Tab Clopidogrel 75mg                                             │ ║
║  │     Dosage: 1-0-0  Route: Oral  Duration: 30 days                    │ ║
║  │     Instructions: After breakfast  Qty: 30 tablets  [✏️ Edit] [🗑️]  │ ║
║  ├──────────────────────────────────────────────────────────────────────┤ ║
║  │  2. Tab Atorvastatin 40mg                                            │ ║
║  │     Dosage: 0-0-1  Route: Oral  Duration: 30 days                    │ ║
║  │     Instructions: After dinner  Qty: 30 tablets  [✏️ Edit] [🗑️]     │ ║
║  ├──────────────────────────────────────────────────────────────────────┤ ║
║  │  3. Tab Metoprolol 25mg                                              │ ║
║  │     Dosage: 1-0-1  Route: Oral  Duration: 30 days                    │ ║
║  │     Instructions: After meals  Qty: 60 tablets  [✏️ Edit] [🗑️]      │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  🧪 INVESTIGATIONS                                                        ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │  LAB TESTS:  [✓] ECG  [✓] Echo  [✓] TMT (Tread Mill Test)           │ ║
║  │  [+ Add More Tests]                                                  │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  📅 FOLLOW-UP                                                             ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │  [✓] Schedule follow-up                                              │ ║
║  │  Date: Nov 25, 2025  Time: 10:00 AM  [Book Slot]                     │ ║
║  │  Instructions: Bring all reports. Fasting required.                  │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  [💾 SAVE & PRINT]  [📧 EMAIL TO PATIENT]  [📱 WHATSAPP]  [❌ Cancel]    ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## 📊 PATIENT MOBILE APP DEMO

```
┌──────────────────────────────────┐
│  📱 Medanta Patient App          │
│  🔙                         ⚙️ 🔔│
├──────────────────────────────────┤
│                                  │
│  👤 Rajesh Kumar                 │
│  🆔 UHID: MED-LKO-2023-045678    │
│  📱 +91-9876543210               │
│                                  │
│  ╔════════════════════════════╗  │
│  ║  🏥 YOUR HEALTH SUMMARY    ║  │
│  ╠════════════════════════════╣  │
│  ║  Last Visit: Today         ║  │
│  ║  Dr. Amit Sharma (Cardio)  ║  │
│  ║                            ║  │
│  ║  ⚠️  ALERTS:               ║  │
│  ║  • Take ECG tomorrow 9 AM  ║  │
│  ║  • Next appointment: 25Nov ║  │
│  ╚════════════════════════════╝  │
│                                  │
│  ⚡ QUICK ACTIONS                │
│  ┌──────┬──────┬──────┬──────┐  │
│  │ 📅   │ 🧾   │ 🧪   │ 📞   │  │
│  │ BOOK │ BILLS│REPORTS│CALL │  │
│  └──────┴──────┴──────┴──────┘  │
│                                  │
│  📋 TODAY'S PRESCRIPTION         │
│  ┌────────────────────────────┐  │
│  │ 1. Clopidogrel 75mg - 1-0-0│  │
│  │    ✓ Taken at 9:00 AM      │  │
│  │                            │  │
│  │ 2. Atorvastatin 40mg -0-0-1│  │
│  │    ⏰ Reminder: 9:00 PM    │  │
│  │                            │  │
│  │ 3. Metoprolol 25mg - 1-0-1 │  │
│  │    ⏰ Next dose: 9:00 PM   │  │
│  │                            │  │
│  │ [📧 Email Prescription]    │  │
│  │ [💊 Order Medicines]       │  │
│  └────────────────────────────┘  │
│                                  │
│  🧪 PENDING TESTS (3)            │
│  ┌────────────────────────────┐  │
│  │ 📝 ECG                     │  │
│  │    Tomorrow 9:00 AM        │  │
│  │    Dept: Cardiology        │  │
│  │    [View Instructions]     │  │
│  │                            │  │
│  │ 📝 Echo                    │  │
│  │    Tomorrow 10:00 AM       │  │
│  │                            │  │
│  │ 📝 TMT                     │  │
│  │    Nov 20, 2025 8:00 AM    │  │
│  │    ⚠️  Fasting required    │  │
│  └────────────────────────────┘  │
│                                  │
│  💳 PENDING BILLS: ₹8,500        │
│  [PAY NOW]                       │
│                                  │
│  [🏠] [📅] [🧾] [📞] [👤]       │
└──────────────────────────────────┘
```

---

**This hospital system is just ONE of 22 complete solutions. Each system has this level of detail!**

Would you like me to:
1. Continue with more database tables (120+ tables total)?
2. Show IPD (Inpatient) screens?
3. Show Emergency Department screens?
4. Show Pharmacy POS?
5. Move to another solution (e.g., Jewellery Store, School Management)?

Let me know and I'll continue building!
