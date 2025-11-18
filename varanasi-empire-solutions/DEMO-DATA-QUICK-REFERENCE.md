# Demo Data Quick Reference

## File Locations & Sizes

```
shared/database/
├── demo-data-generator.sql              (16 KB) - Shared helper functions

01-HOTEL-HOSPITALITY-MANAGEMENT/database/
├── demo-data.sql                        (23 KB) - Hotel system demo data

03-RESTAURANT-POS-MANAGEMENT/database/
├── demo-data.sql                        (33 KB) - Restaurant system demo data

05-HOSPITAL-MANAGEMENT-SYSTEM/database/
├── demo-data.sql                        (27 KB) - Hospital system demo data
```

**Total Size**: ~99 KB

---

## Loading Order

```bash
# Step 1: Load shared generator (REQUIRED FIRST)
psql -U postgres -d yourdb -f shared/database/demo-data-generator.sql

# Step 2: Load any solutions (in any order)
psql -U postgres -d yourdb -f 03-RESTAURANT-POS-MANAGEMENT/database/demo-data.sql
psql -U postgres -d yourdb -f 01-HOTEL-HOSPITALITY-MANAGEMENT/database/demo-data.sql
psql -U postgres -d yourdb -f 05-HOSPITAL-MANAGEMENT-SYSTEM/database/demo-data.sql
```

---

## Sample Data Counts

### Restaurant POS System

| Entity | Count | Details |
|--------|-------|---------|
| Restaurant Groups | 2 | VHR, LEF |
| Restaurants | 8 | Fine Dining, QSR, Cloud Kitchen, Casual |
| Menu Categories | 6 | Appetizers, Main, Breads, Beverages, Desserts |
| Menu Items | 50+ | Across all categories |
| Menu Variants | 15+ | Sizes and options |
| Inventory Categories | 9 | Grains, Vegetables, Meats, Dairy, Spices, etc. |
| Inventory Items | 10+ | Basmati Rice, Chicken, Paneer, Spices, etc. |
| Floors | 2-4 | Ground & First Floor per restaurant |
| Tables | 15-20 | Regular & VIP seating |
| Customers | 10 | Mix of loyalty tiers |
| Orders | 35 | Various types & statuses |
| Order Items | 70+ | Items per order |
| Payments | 25 | Cash, Card, UPI methods |
| Staff | 7+ | Per restaurant (Owner, Manager, Chef, Waiter, etc.) |
| Daily Sales | 10 | Last 10 days |

**Total Records**: ~400+

---

### Hotel Management System

| Entity | Count | Details |
|--------|-------|---------|
| Hotel Groups | 2 | VHHG, NIHC |
| Properties (Hotels) | 5 | 5-star to 3-star, Heritage to Budget |
| Room Categories | 3 | Standard, Deluxe, Suite |
| Rooms | 50+ | 12 per category per property |
| Guests | 10 | Domestic & International |
| Bookings | 25+ | Past, Current, Future |
| Room Service Orders | 15+ | Dining requests |
| Housekeeping Assignments | 15 | Cleaning schedules |
| Amenities | 15 | WiFi, Pool, Spa, Restaurant, etc. |
| Staff | 8+ | Per property |
| Invoices | 15 | Billing records |
| Daily Occupancy | 20 | Last 20 days summary |

**Total Records**: ~250+

---

### Hospital Management System

| Entity | Count | Details |
|--------|-------|---------|
| Hospitals | 2 | Multi-specialty, Government |
| Departments | 10 | OPD, IPD, ICU, Emergency, Specialty depts |
| Doctors | 12+ | Cardiology, Surgery, Orthopedics, etc. |
| Nurses | 15+ | Various departments & shifts |
| Patients | 30+ | Domestic & International |
| Appointments | 25+ | OPD consultation bookings |
| IPD Admissions | 8 | Inpatient ward admissions |
| Lab Tests | 20+ | Hematology, Biochemistry, etc. |
| Pharmacy Items | 6+ | Medications with stock management |
| Prescriptions | 15+ | Doctor prescriptions |
| Billing Records | 12+ | Patient invoices |

**Total Records**: ~200+

---

## Key Features by System

### Restaurant POS
✅ Multi-restaurant chain management
✅ Complete menu with variants
✅ Real-time order management
✅ Kitchen order tracking (KOT)
✅ Inventory management
✅ Payment processing (Cash, Card, UPI)
✅ Staff role management
✅ Daily sales analytics
✅ Customer loyalty tracking
✅ GST compliance

### Hotel Management
✅ Multi-property management
✅ Room inventory with categories
✅ Booking and reservation system
✅ Guest profiles (domestic & international)
✅ Room service orders
✅ Housekeeping assignments
✅ Facilities and amenities
✅ Staff management
✅ Invoice and billing
✅ Occupancy analytics

### Hospital Management
✅ Multi-department structure
✅ Doctor and nurse management
✅ Complete patient records
✅ Appointment scheduling
✅ IPD admission and discharge
✅ Lab test management
✅ Pharmacy inventory
✅ Prescription management
✅ Patient billing
✅ Medical records (EMR)

---

## Geographic Locations

### UP Cities Included
- **Major**: Varanasi, Lucknow, Agra, Kanpur, Meerut, Prayagraj
- **Secondary**: Mathura, Vrindavan, Jhansi, Gwalior, Bareilly, Moradabad, Saharanpur, Aligarh

### Coordinates
- Varanasi: 25.3209°N, 82.9789°E
- Lucknow: 26.8467°N, 80.9462°E
- Agra: 27.1767°N, 78.0081°E
- Kanpur: 26.4499°N, 80.3319°E
- Prayagraj: 25.4358°N, 81.8463°E

---

## Data Formats

### Phone Numbers
- Format: 10-digit Indian mobile
- Example: `9876543210`
- Prefix in inserts: `+919876543210`
- Range: 6000000000 - 9999999999

### Email
- Format: `name.surname@organization.com` or `name@gmail.com`
- Domains: gmail.com, hotmail.com, outlook.com, rediffmail.com

### GST Numbers
- Format: `09XXXXXXXXXX1Z5`
- 09 = UP state code
- Can be generated with: `demo_helpers.generate_gst_number()`

### PAN Numbers
- Format: `AABCDEFGHIJ`
- 5 letters + 7 digits + 1 letter
- Indian taxation identifier

### Business Codes
- Format: 3-4 letter prefix + sequential number
- Examples: VHR, LEF, VMRI, LCH, ORD-, INV-, DOC-

### Pincodes
- Format: 6 digits
- Prefix matches city (226 for Lucknow, 221 for Varanasi, etc.)
- Suffix: Random 4 digits

---

## Sample Data Values

### Restaurant Menu Prices (INR)
- Appetizers: ₹80-₹200
- Main Course: ₹140-₹380
- Rice/Bread: ₹40-₹250
- Beverages: ₹60-₹100
- Desserts: ₹100-₹160

### Hotel Room Rates (INR/night)
- Standard: ₹3,500-₹4,500
- Deluxe: ₹5,500-₹6,500
- Suite: ₹8,500-₹12,000

### Hospital Charges (INR)
- Doctor Consultation: ₹600-₹1,500
- Lab Tests: ₹500-₹2,000
- Room Charges: ₹3,000-₹15,000/day
- Total Bill Range: ₹12,000-₹50,000

---

## SQL Functions Available

### Helper Functions (in demo_helpers schema)
```sql
-- Phone & Contact
demo_helpers.generate_phone_number()
demo_helpers.generate_email(name_prefix)

-- Identifiers
demo_helpers.generate_gst_number()
demo_helpers.generate_pan_number()
demo_helpers.generate_aadhaar_number()

-- Location
demo_helpers.get_random_location()
demo_helpers.generate_address(city)
demo_helpers.generate_pincode(city)

-- Names
demo_helpers.get_random_male_name()
demo_helpers.get_random_female_name()
demo_helpers.get_random_name()

-- Business
demo_helpers.generate_business_reg_number(prefix)
demo_helpers.generate_order_number(location_code)
demo_helpers.generate_invoice_number(prefix)

-- Financial
demo_helpers.calculate_gst(amount, gst_rate)
demo_helpers.format_inr(amount)

-- Utilities
demo_helpers.calculate_age(dob)
demo_helpers.is_weekend(day)
demo_helpers.get_random_price(min, max)
demo_helpers.get_random_status(status_array)
demo_helpers.get_random_past_date(days_back)
demo_helpers.get_random_past_timestamp(days_back)
```

---

## Status Values

### Restaurant Orders
- PENDING → CONFIRMED → PREPARING → READY → SERVED → COMPLETED
- Alternative: CANCELLED

### Hotel Bookings
- PENDING → CONFIRMED → CHECKED_IN → CHECKED_OUT
- Alternative: CANCELLED

### Hospital Appointments
- PENDING → CONFIRMED → COMPLETED
- Alternative: CANCELLED

### Payment Status
- PENDING → PAID (or PARTIAL, REFUNDED)

### Room Status
- AVAILABLE → OCCUPIED → CLEANING → AVAILABLE
- Alternative: MAINTENANCE, RESERVED

---

## Table Relationships

### Restaurant POS
```
restaurant_groups
├── restaurants
│   ├── menu_categories
│   │   └── menu_items
│   │       ├── menu_item_variants
│   │       └── order_items (from orders)
│   ├── floors
│   │   └── tables
│   │       └── table_reservations
│   └── orders
│       ├── order_items
│       ├── payments
│       └── daily_sales_summary
└── suppliers
    └── purchase_orders
```

### Hotel Management
```
hotel_groups
└── properties
    ├── rooms
    │   ├── room_categories
    │   └── ipd_admissions (links to bookings)
    ├── guests
    │   └── bookings
    │       ├── room_service_orders
    │       └── invoices
    ├── amenities
    ├── staff
    └── daily_occupancy_summary
```

### Hospital Management
```
hospitals
├── departments
├── doctors
│   ├── appointments (with patients)
│   └── ipd_admissions (with patients)
├── nurses
├── patients
│   ├── appointments
│   ├── ipd_admissions
│   ├── lab_tests
│   ├── prescriptions
│   └── billing
├── pharmacy_items
└── lab_tests (with results)
```

---

## Common Queries

### Get Statistics
```sql
-- Restaurant Orders
SELECT order_status, COUNT(*) FROM orders GROUP BY order_status;

-- Hotel Occupancy
SELECT summary_date, occupancy_percentage FROM daily_occupancy_summary ORDER BY summary_date DESC;

-- Hospital Appointments
SELECT appointment_type, COUNT(*) FROM appointments GROUP BY appointment_type;
```

### Revenue Analysis
```sql
-- Restaurant Total Sales
SELECT SUM(total_amount) as total_sales FROM orders WHERE order_status = 'COMPLETED';

-- Hotel Revenue
SELECT SUM(grand_total) as total_revenue FROM invoices WHERE payment_status = 'PAID';

-- Hospital Revenue
SELECT SUM(total_amount) as total_revenue FROM billing WHERE payment_status = 'PAID';
```

### Recent Activity
```sql
-- Last 5 Orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

-- Last 5 Bookings
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5;

-- Last 5 Appointments
SELECT * FROM appointments ORDER BY created_at DESC LIMIT 5;
```

---

## Limitations & Notes

⚠️ **Demo Data Limitations**:
- Random data using RANDOM() - different each run
- Small subset (35, 25, 30 records) not suitable for performance testing
- No relationships between separate solutions
- Simplified business logic

✅ **Best For**:
- UI/UX demonstrations
- Client showcases
- Feature walkthroughs
- Training and onboarding
- Integration testing

❌ **Not For**:
- Large-scale performance testing
- Production use
- Real financial/medical records
- Data privacy compliance requirements

---

## Data Cleanup

### Delete All Demo Data
```bash
# Create cleanup script
cat > cleanup.sql << 'EOF'
BEGIN;
DELETE FROM orders CASCADE;
DELETE FROM restaurants CASCADE;
DELETE FROM bookings CASCADE;
DELETE FROM patients CASCADE;
COMMIT;
EOF

psql -U postgres -d yourdb -f cleanup.sql
```

### Delete Specific Solution
```sql
-- Clear Restaurant System
DELETE FROM orders WHERE restaurant_id IN (SELECT id FROM restaurants);
DELETE FROM restaurants WHERE group_id IN (SELECT id FROM restaurant_groups);

-- Clear Hotel System
DELETE FROM bookings WHERE property_id IN (SELECT id FROM properties);
DELETE FROM properties WHERE group_id IN (SELECT id FROM hotel_groups);

-- Clear Hospital System
DELETE FROM appointments WHERE hospital_id = (SELECT id FROM hospitals WHERE hospital_code = 'VMRI');
DELETE FROM patients WHERE hospital_id = (SELECT id FROM hospitals WHERE hospital_code = 'VMRI');
```

---

## Performance Notes

**Load Times (Approximate)**
- Generator Script: 5-10 seconds
- Restaurant Demo: 10-15 seconds
- Hotel Demo: 8-12 seconds
- Hospital Demo: 10-15 seconds
- **Total**: ~30-50 seconds

**Storage Requirements**
- All demo data: ~15-25 MB
- Index size: ~5-10 MB (depends on schema)
- Total with indexes: ~20-35 MB

---

## Version Info

- **Created**: 2025-11-18
- **Script Version**: 1.0.0
- **Framework**: Varanasi Empire Solutions
- **PostgreSQL**: 12+ required
- **Extensions**: uuid-ossp, pg_trgm, postgis, timescaledb

---

**Last Updated**: November 18, 2025
