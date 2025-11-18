# Varanasi Empire Solutions - Comprehensive Demo Data Guide

## Overview

This guide provides complete documentation for the comprehensive demo data SQL scripts created for all Varanasi Empire Solutions business systems. These scripts populate realistic, production-quality sample data for client demonstrations.

---

## Quick Start

### Prerequisites
- PostgreSQL 12+ with extensions: uuid-ossp, pg_trgm, postgis, timescaledb
- Database schemas already created using the respective `complete-schema.sql` files
- UTF-8 character encoding support

### Execution Order

1. **First**: Load the generic demo data generator (shared by all solutions)
   ```bash
   psql -U postgres -d your_database -f shared/database/demo-data-generator.sql
   ```

2. **Then**: Load individual solution demo data in any order

   ```bash
   # Restaurant POS System
   psql -U postgres -d your_database -f 03-RESTAURANT-POS-MANAGEMENT/database/demo-data.sql

   # Hotel Management System
   psql -U postgres -d your_database -f 01-HOTEL-HOSPITALITY-MANAGEMENT/database/demo-data.sql

   # Hospital Management System
   psql -U postgres -d your_database -f 05-HOSPITAL-MANAGEMENT-SYSTEM/database/demo-data.sql
   ```

---

## File Descriptions

### 1. Generic Demo Data Generator
**File**: `shared/database/demo-data-generator.sql` (16 KB)

**Purpose**: Provides reusable helper functions and data for all 22 business solutions.

**Contents**:
- **Helper Functions**:
  - `generate_phone_number()` - Random 10-digit Indian phone numbers
  - `generate_email()` - Random email addresses
  - `generate_gst_number()` - Valid GST numbers for UP
  - `generate_pan_number()` - PAN numbers
  - `generate_aadhaar_number()` - Aadhaar identification
  - `generate_address()` - Realistic addresses
  - `generate_pincode()` - Valid pincodes by city

- **Location Data**:
  - UP cities and districts (15+ locations)
  - Includes: Varanasi, Lucknow, Agra, Kanpur, Meerut, Allahabad, Mathura, Vrindavan, etc.
  - Geographic coordinates (latitude/longitude)
  - Pincode prefixes

- **Indian Names Data**:
  - 45+ Male first names
  - 40+ Female first names
  - 50+ Last names (Indian surnames)
  - Functions to generate random names

- **Business Utilities**:
  - `calculate_gst()` - GST calculations (18% default)
  - `generate_order_number()` - Realistic order numbering
  - `generate_invoice_number()` - Invoice number generation
  - `get_random_past_date()` - Realistic historical dates
  - `generate_price()` - Price generation within ranges
  - `get_random_status()` - Status selection from arrays

**Key Features**:
- All data respects Indian business standards
- GST compliance with UP (state code 09)
- Phone numbers follow 10-digit Indian format
- UP-specific location context

---

### 2. Restaurant POS Management Demo Data
**File**: `03-RESTAURANT-POS-MANAGEMENT/database/demo-data.sql` (33 KB)

**Purpose**: Comprehensive demo data for restaurant and food service management system.

**Sample Data Provided**:

#### Restaurant Groups (2)
- Varanasi Heritage Restaurants (VHR)
- Lucknow Express Foods (LEF)

#### Restaurants (8)
1. **Varanasi Ghats Restaurant & Bar** - Fine Dining
   - Location: Assi Ghat, Varanasi
   - Capacity: 150 seats, 20 tables
   - Services: Dine-in, Takeaway, Delivery, Catering
   - Cuisine: North Indian, Mughlai, Regional

2. **Chandni Chowk Bistro** - Casual Dining
   - Location: Old City, Varanasi
   - Capacity: 80 seats, 12 tables
   - Services: Dine-in, Takeaway, Delivery

3. **Thali Express** - QSR (Quick Service)
   - Location: Cantonment, Varanasi
   - Capacity: 60 seats, 8 tables
   - Cuisine: North & South Indian

4. **Spice Cloud Kitchen** - Cloud Kitchen
   - Location: Industrial Area, Varanasi
   - Delivery/Takeaway only
   - Cuisine: Indian Fusion, Asian

5. **Lucknow Express - Gomti Nagar** - QSR
   - Location: Lucknow
   - Capacity: 50 seats, 7 tables

6. **Taj Spice House** - Fine Dining
   - Location: Near Taj Mahal, Agra
   - Capacity: 120 seats, 18 tables
   - Specialty: Mughlai, Awadhi cuisine

7. **Cafe Riverside** - Casual Dining
   - Location: Kanpur
   - Capacity: 70 seats, 10 tables
   - Riverside views

8. **Sacred Valley Kitchen** - Cloud Kitchen
   - Location: Prayagraj (Allahabad)
   - Specialty: Healthy, Vegetarian options

#### Menu Items (50+)
- **Appetizers**: Samosa, Spring Rolls, Paneer 65, Tandoori Chicken, Fish Tikka, Meat Kebab
- **Vegetarian Mains**: Paneer Butter Masala, Chana Masala, Aloo Gobi, Dal Makhani
- **Non-Vegetarian**: Butter Chicken, Tikka Masala, Rogan Josh, Tandoori, Fish Curry
- **Breads & Rice**: Naan, Roti, Biryani, Basmati Rice
- **Beverages**: Lassi, Chai, Coffee, Fresh Juices
- **Desserts**: Gulab Jamun, Kheer, Jalebi, Rasmalai, Ice Cream

#### Tables (15-20 across multiple floors)
- Ground Floor & First Floor layouts
- VIP and Regular table types
- Seating capacity 4-6 persons
- Status tracking (Available, Occupied, Reserved, Cleaning)

#### Orders (35+)
- Mixed order types: Dine-in, Takeaway, Delivery
- Various statuses: Pending, Confirmed, Preparing, Ready, Served, Completed, Cancelled
- Realistic order timestamps spanning last 35 days
- Order items with quantity and customizations

#### Kitchen Order Tickets (KOT)
- Multiple items per order
- Cooking station assignments
- Status tracking: Pending, Sent to Kitchen, Preparing, Ready, Served

#### Inventory Items (10+)
- Grains: Basmati Rice, Wheat Flour
- Vegetables: Onions, Tomatoes
- Meats: Chicken Breast
- Dairy: Paneer, Ghee, Milk
- Spices: Cumin, Coriander
- Stock levels with min/max thresholds
- Perishable items with shelf life

#### Staff (7+ per restaurant)
- Roles: Owner, Manager, Chef, Waiter, Captain, Cashier
- Joining dates and salary ranges
- Contact information

#### Customers (10)
- Loyalty tier: Gold, Silver, Bronze
- Preferences: Vegetarian, Vegan, Jain
- Order history and spending
- Geographic distribution

#### Payments (25+)
- Payment methods: Cash, Card, UPI, Wallet
- Status: Success, Pending, Failed
- Payment references with tracking

#### Daily Sales Summary (10+)
- Summary by date
- Orders breakdown: Dine-in, Takeaway, Delivery
- Revenue calculations with GST
- Payment method breakdown
- Average order value

**Key Features**:
- Realistic Indian restaurant operations
- GST calculations (5% for QSR, 2.5% CGST + 2.5% SGST for fine dining)
- Multi-location restaurant chain management
- Complete POS workflow
- Kitchen management integration

---

### 3. Hotel Management System Demo Data
**File**: `01-HOTEL-HOSPITALITY-MANAGEMENT/database/demo-data.sql` (23 KB)

**Purpose**: Comprehensive demo data for hotel and hospitality management.

**Sample Data Provided**:

#### Hotel Groups (2)
- Varanasi Heritage Hotel Group (VHHG)
- North India Hospitality Corporation (NIHC)

#### Properties (5 Hotels)
1. **Ganges Riverside Palace** - 5-star Heritage
   - Location: Assi Ghat, Varanasi
   - 120 rooms (100 guest rooms)
   - Premium heritage property

2. **Lucknow Grand Hotel** - 4.5-star Boutique
   - Location: Hazratganj, Lucknow
   - 85 rooms (75 guest rooms)
   - Near railway station

3. **Taj View Resort** - 4-star Resort
   - Location: Taj East Gate, Agra
   - 150 rooms (130 guest rooms)
   - Walking distance to Taj Mahal

4. **Kanpur Business Hotel** - 3.5-star Business
   - Location: Old Court Road, Kanpur
   - 60 rooms (50 guest rooms)
   - Corporate business district

5. **Allahabad Comfort Inn** - 3-star Budget
   - Location: Civil Lines, Prayagraj
   - 45 rooms (40 guest rooms)
   - Near Triveni Sangam

#### Room Categories (per property)
- **Standard Rooms**: Basic amenities, 2-person occupancy
- **Deluxe Rooms**: Premium furnishings, 3-person occupancy, Minibar, Writing desk
- **Suite Rooms**: Luxury living area, 4-person occupancy, Jacuzzi, Lounge

#### Rooms (50+)
- 12 rooms per category per property
- Multiple floors (floors 1-4)
- Status tracking: Available, Occupied, Maintenance, Reserved
- Room rates: ₹3,500-₹8,500 per night

#### Guests (10)
- **Domestic Guests**: Indian businessmen and tourists
  - Professionals from TCS, ICICI Bank, Infosys, McKinsey
  - Age range: 25-65 years
  - Preferences: Business amenities, specific dietary needs

- **International Guests**: From US, UK, France, Germany, Japan
  - Business travelers and tourists
  - Language preferences: English, French, German, Japanese
  - Special requirements documented

#### Bookings (25+)
- **Historical**: Checked-out guests (past 15 days)
- **Current**: Currently checked-in
- **Future**: Upcoming reservations (next 10 days)
- Duration: 2-7 nights
- Status: Pending, Confirmed, Checked-in, Checked-out

#### Room Service Orders
- Lunch and dinner items
- Beverages (tea, coffee, juices)
- Special dietary requests
- Delivery tracking: Pending, Confirmed, Delivered
- Order timestamps throughout day

#### Housekeeping Assignments
- Room cleaning schedules
- Staff assignments
- Status: Pending, In-Progress, Completed
- Inspection notes
- Deep cleaning schedules

#### Amenities & Facilities (15+)
- **Communication**: WiFi, Business Center
- **Recreation**: Swimming Pool, Kids Play Area, Library
- **Health & Wellness**: Fitness Center, Spa, Medical Assistance
- **Services**: Room Service, Laundry, Concierge, Travel Desk
- **Dining**: Restaurant & Bar
- **Business**: Conference Halls, Meeting Rooms
- Complimentary vs. Paid services

#### Hotel Staff (8+ per property)
- Positions: General Manager, Front Office Manager, Housekeeping Manager, Chef
- Departments: Management, Front Office, Housekeeping, Food & Beverage, Security, Wellness
- Salary ranges: ₹25,000-₹150,000 per month
- Joining dates and employment records

#### Invoices & Billing
- Room charges
- Food & Beverage charges
- Additional service charges
- Tax (18% GST)
- Payment methods: Credit Card, Cash, UPI
- Payment tracking

#### Daily Occupancy Summary (20 days)
- Occupancy percentage
- Revenue per day
- Room utilization
- Average room rate
- Maintenance room tracking

**Key Features**:
- Multi-property hotel chain management
- Diverse property types (heritage, boutique, business, budget, resort)
- Complete guest lifecycle: Booking → Check-in → Services → Check-out
- Housekeeping integration
- Revenue management
- Service tracking and billing

---

### 4. Hospital Management System Demo Data
**File**: `05-HOSPITAL-MANAGEMENT-SYSTEM/database/demo-data.sql` (27 KB)

**Purpose**: Comprehensive demo data for hospital information system.

**Sample Data Provided**:

#### Hospitals (2)
- **Varanasi Medical & Research Institute** - Multi-specialty (500 beds)
- **Lucknow Central Hospital** - Government hospital (800 beds)

#### Departments (10)
- **Clinical**: OPD, IPD, Emergency & Trauma, ICU
- **Specialty**: Cardiology, Orthopedics, General Surgery, ENT, Pediatrics, Emergency Medicine
- **Support**: Laboratory, Pharmacy, Nursing, Radiology
- Each with departmental head and operational status

#### Doctors (12+)
Specializations include:
- **Cardiology** (2 doctors)
  - Dr. Arun Mishra (DM Cardiology) - ₹1,500 consultation
  - Dr. Rakesh Sharma (MD Cardiology) - ₹1,200 consultation

- **General Surgery** (2 doctors)
  - Dr. Deepti Verma (MS Surgery) - ₹1,000 consultation
  - Dr. Sanjay Singh (MS Surgery) - ₹1,000 consultation

- **Orthopedics** (2 doctors)
  - Dr. Mahesh Singh (MS Orthopedics) - ₹900 consultation
  - Dr. Vikram Patel (MS Orthopedics) - ₹900 consultation

- **Internal Medicine** (2 doctors)
  - Dr. Priya Singh (MD Internal Medicine) - ₹800 consultation
  - Dr. Sunita Sharma (MD Internal Medicine) - ₹800 consultation

- **Other Specialties**:
  - ENT, Pediatrics, Emergency Medicine, Radiology
  - Registration numbers and credentials included

#### Nurses (15+)
- Qualifications: BSc Nursing, GNM (General Nursing)
- Departments: IPD, ICU, Emergency
- Shift types: Day, Night, Rotating
- Registration numbers provided

#### Patients (30+)
- **Demographics**: Age range 20-80 years
- **Blood Groups**: O+, O-, A+, A-, B+, B-, AB+, AB-
- **Occupations**: Teacher, Engineer, Housewife, Business, Software Developer
- **Marital Status**: Single, Married, Widowed, Divorced
- **Nationalities**: Indian and International (US, UK, France, Germany, Japan)
- Identification: Aadhar, Passport, Driving License
- Contact details and addresses

#### Appointments (25+)
- **Types**: First-time, Follow-up, Emergency
- **Status**: Pending, Confirmed, Completed
- **Reasons**: Chest pain, Joint pain, Abdominal pain, Regular checkup, Fever & cough
- **Timing**: Various slots (09:00, 11:30, 14:00, 16:00)
- Doctor assignments with specialization matching

#### IPD Admissions (8)
- **Diagnoses**:
  - Acute Coronary Syndrome
  - Fracture Femur
  - Appendicitis
  - Pneumonia
  - Hypertension Crisis

- **Status**: Pending, Admitted, Discharged
- **Room Assignments**: Room numbers and bed allocation
- **Duration**: 2-7 days
- **Discharge Summary**: For completed admissions

#### Lab Tests (20+)
- **Hematology**: Hemoglobin, White Blood Cells
- **Biochemistry**: Fasting Blood Sugar, Creatinine, Lipid Profile
- **Endocrinology**: Thyroid Function Tests
- **Status**: Pending, Completed
- **Reference Values**: Normal ranges included
- **Sample Types**: Blood, Serum
- **Results**: Within normal/abnormal ranges

#### Pharmacy Inventory (6+ medications)
- **Medications**:
  - Aspirin 75mg - Cipla (500 tablets)
  - Amoxicillin 500mg - GSK (1,200 capsules)
  - Metformin 500mg - Lupin (800 tablets)
  - Lisinopril 10mg - Torrent (600 tablets)
  - Omeprazole 20mg - Dr Reddy's (700 capsules)
  - Insulin Regular - Novo Nordisk (150 vials)

- **Batch Numbers**: Unique tracking
- **Expiry Dates**: Properly managed
- **Stock Levels**: Current, Min, Max thresholds
- **Pricing**: Unit cost and selling price

#### Prescriptions (15+)
- Medication name and dosage
- Frequency: Once/Twice daily
- Duration: 7-30 days
- Special instructions: With/Without food
- Doctor-specific prescribing

#### Billing & Invoices (12+)
- **Charges**:
  - Consultation fees
  - Medication costs
  - Diagnostic test charges
  - Procedure costs
  - Room/ICU charges

- **Tax**: 18% GST included
- **Total**: ₹12,000-₹25,000 per patient
- **Payment**: Cash, Credit Card, UPI
- **Status**: Paid, Partial, Pending

**Key Features**:
- Complete EMR/EHR functionality
- Multi-department hospital management
- Doctor-patient relationship tracking
- Complete patient lifecycle: OPD → IPD → Discharge
- Lab integration
- Pharmacy management
- Billing and revenue tracking
- HIPAA-compliant patient data handling

---

## Data Characteristics

### Geographic Diversity
- **Primary Cities**: Varanasi (HQ), Lucknow, Agra, Kanpur, Prayagraj
- **Secondary Cities**: Meerut, Mathura, Vrindavan, Jhansi, Gwalior
- **All data in Uttar Pradesh**: Indian state context maintained

### Realistic Patterns

#### Phone Numbers
- 10-digit Indian format
- Starting digits 6-9
- Proper prefixes (+91)

#### Naming Conventions
- Authentic Indian names
- Mix of male/female
- Regional appropriateness

#### Timestamps
- Recent dates (last 30 days for most data)
- Future bookings/appointments
- Proper CURRENT_TIMESTAMP usage
- Timezone: IST (Indian Standard Time)

#### Financial Data
- GST compliance (5%, 18%, etc.)
- INR currency
- Realistic pricing ranges
- Tax calculations included

#### Status Workflows
- Realistic status progressions
- Partial vs. Complete statuses
- Cancellation tracking
- Time-based state management

### Quality Standards
- **Foreign Key Integrity**: All relationships properly defined
- **Data Consistency**: Related records maintain logical relationships
- **Uniqueness**: Codes and IDs are unique where required
- **Completeness**: Optional fields appropriately populated
- **Realism**: Data mirrors actual business operations

---

## Usage Recommendations

### For Client Demonstrations
1. Load the generator script first (provides helper functions)
2. Load the specific solution demo data
3. Test all major features with sample data
4. Show reporting dashboards with aggregated data
5. Demonstrate multi-location capabilities

### For Development Testing
1. Use smaller subsets for unit testing
2. Modify demo data to test edge cases
3. Extend with additional scenarios as needed
4. Keep baseline copy for regression testing

### For Training & Onboarding
1. Load full demo dataset
2. Use realistic scenarios for staff training
3. Show complete workflows from start to finish
4. Demonstrate reporting and analytics

### For Performance Testing
1. Demo data provides baseline
2. Can be duplicated to increase volume
3. Test indexing and query performance
4. Identify optimization opportunities

---

## Customization

### Modifying Demo Data

#### Change Location Focus
In `demo-data-generator.sql`, add more UP cities to `up_locations` table:
```sql
INSERT INTO demo_helpers.up_locations (city_name, district, pincode_prefix, latitude, longitude)
VALUES ('City Name', 'District', 'PRC', lat, lon);
```

#### Add More Names
Extend `first_names_male`, `first_names_female`, `last_names` tables with additional names:
```sql
INSERT INTO demo_helpers.first_names_male (name) VALUES ('Name1'), ('Name2');
```

#### Scale Volume
Increase loop counters in demo data scripts:
```sql
FOR v_count IN 1..50 LOOP  -- Increase from 35 to 50
```

### Data Regeneration
All scripts use reproducible patterns based on RANDOM() for variations:
- Same script run = different data (due to RANDOM)
- To fix data: Manually set seed or use deterministic approaches

---

## Performance Considerations

### Index Creation
Demo data creation doesn't create additional indexes (schema should already have them).
Existing indexes will automatically optimize query performance.

### Large Dataset Handling
- Scripts use efficient bulk inserts
- Foreign key constraints checked at end of each solution's script
- Consider running in transactions for atomicity:
  ```sql
  BEGIN;
  -- Load demo data
  COMMIT;
  ```

### Storage Requirements
- Restaurant POS: ~5-10 MB
- Hotel Management: ~3-5 MB
- Hospital Management: ~4-8 MB
- Shared Generator: ~1 MB
- **Total**: ~15-25 MB for all data

---

## Troubleshooting

### Common Issues

**Issue**: Foreign Key Constraint Errors
- **Cause**: Schema not created or missing tables
- **Solution**: Ensure `complete-schema.sql` is loaded before demo data

**Issue**: UUID Extension Not Found
- **Cause**: PostgreSQL extensions not installed
- **Solution**: Run `CREATE EXTENSION "uuid-ossp";` first

**Issue**: Duplicate Key Errors
- **Cause**: Running demo data script multiple times
- **Solution**: Delete old data before reloading or use different database

**Issue**: Empty Tables After Load
- **Cause**: Script execution error
- **Solution**: Check error messages, ensure all prerequisites met, check privileges

### Debug Commands

Check if data loaded:
```sql
SELECT COUNT(*) FROM restaurants;
SELECT COUNT(*) FROM hotels;
SELECT COUNT(*) FROM patients;
```

Verify key data:
```sql
SELECT COUNT(*) AS restaurant_count FROM restaurants;
SELECT COUNT(*) AS menu_items FROM menu_items;
SELECT SUM(total_amount) AS total_sales FROM orders;
```

---

## Data Dictionary

### Common Fields Across Solutions

#### Timestamps
- `created_at`: Record creation timestamp (CURRENT_TIMESTAMP)
- `updated_at`: Last update timestamp
- `deleted_at`: Soft delete timestamp (null if active)

#### Geographic Fields
- `city`: City name (from UP)
- `state`: State (Uttar Pradesh)
- `pincode`: 6-digit postal code
- `latitude`, `longitude`: Decimal coordinates

#### Business Identifiers
- `*_code`: Unique business code (e.g., 'VHR', 'VMRI')
- `*_number`: Sequential business number (e.g., order number, invoice number)
- `*_id`: UUID primary key

#### Status Fields
- `status`: Current state (VARCHAR with specific enum values)
- `is_active`: Boolean flag for active/inactive
- `payment_status`: Specific payment state

---

## Future Enhancements

The demo data framework can be extended to cover all 22 Varanasi Empire Solutions:

1. **Travel & Tour Agency**: Add itineraries, bookings, package tours
2. **Real Estate**: Add properties, listings, agent assignments
3. **Pharmacy**: Add medication inventory, prescriptions, sales
4. **Jewellery Store**: Add inventory, designs, customer orders
5. **School Management**: Add students, teachers, courses, grades
6. **Gym & Fitness**: Add memberships, classes, schedules
7. **Event Planning**: Add events, vendors, budgets
8. And 14 more...

Each can follow the same pattern:
- Generator functions in shared script
- Specific demo data in solution folder
- Production-ready quality

---

## Support & Documentation

For additional information:
- Review individual solution's `COMPLETE-SYSTEM.md`
- Check schema documentation in `complete-schema.sql`
- Refer to API documentation for usage patterns
- Review application user guides

---

## Version History

**Version 1.0.0** (2025-11-18)
- Initial comprehensive demo data package
- 3 complete solutions covered
- Generic generator script
- Full documentation

---

## License & Usage

These demo data scripts are provided as part of the Varanasi Empire Solutions package. They are intended for:
- ✅ Development and testing
- ✅ Client demonstrations
- ✅ Staff training
- ✅ System benchmarking

Not intended for:
- ❌ Production use
- ❌ Real financial/medical records
- ❌ Data without proper sanitization

---

**Created**: November 18, 2025
**Framework**: Varanasi Empire Solutions
**Format**: PostgreSQL SQL Scripts
**Encoding**: UTF-8
