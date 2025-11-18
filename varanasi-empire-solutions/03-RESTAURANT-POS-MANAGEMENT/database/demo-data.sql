-- ============================================================================
-- RESTAURANT & FOOD SERVICE MANAGEMENT SYSTEM - COMPREHENSIVE DEMO DATA
-- Version: 1.0.0
-- ============================================================================
-- This script populates realistic sample data for all restaurant management
-- features including: restaurants, menus, orders, inventory, staff, payments
-- and analytics.
--
-- Sample Data:
-- - 2 restaurant groups (corporate chains)
-- - 8 restaurants (fine dining, QSR, cloud kitchen)
-- - 50+ menu items across multiple categories
-- - 15-20 tables on multiple floors
-- - 30+ orders with various statuses
-- - Kitchen order tickets
-- - Inventory with stock levels
-- - Staff users with different roles
-- - Payment records
-- - Daily sales summaries
-- ============================================================================

-- ============================================================================
-- 1. RESTAURANT GROUPS (Corporate Chains)
-- ============================================================================

INSERT INTO restaurant_groups (group_name, group_code, legal_entity_name, gst_number, pan_number, fssai_license,
                               corporate_address, corporate_email, corporate_phone, centralized_inventory,
                               centralized_menu, centralized_pricing)
VALUES
-- Restaurant Group 1: Varanasi Fine Dining Chain
(
    'Varanasi Heritage Restaurants',
    'VHR',
    'Varanasi Heritage Restaurants Pvt Ltd',
    '09AABCU1234G1Z0',
    'AABCU1234G',
    'FSSAI-1234567890',
    '42 Assi Ghat, Varanasi, UP 221001',
    'info@varanasi-heritage.com',
    '+919876543210',
    true,
    true,
    true
),
-- Restaurant Group 2: North India QSR Chain
(
    'Lucknow Express Foods',
    'LEF',
    'Lucknow Express Foods Pvt Ltd',
    '09AACPL5678H1Z5',
    'AACPL5678H',
    'FSSAI-0987654321',
    'Unit 205, Imperial Plaza, Lucknow, UP 226001',
    'admin@lucknowexpressfoods.com',
    '+919988776655',
    true,
    false,
    false
);

-- ============================================================================
-- 2. RESTAURANTS (8 restaurants - different types and locations)
-- ============================================================================

INSERT INTO restaurants (group_id, restaurant_name, restaurant_code, restaurant_type, cuisine_types,
                        address_line1, address_line2, city, state, pincode, latitude, longitude,
                        phone, email, website, opening_time, closing_time, seating_capacity, total_tables,
                        has_dine_in, has_takeaway, has_delivery, has_catering, fssai_license, gst_number,
                        tax_rate_cgst, tax_rate_sgst, service_charge_percent)
VALUES
-- Group 1: Varanasi Heritage Restaurants
-- Restaurant 1: Fine Dining establishment
(
    (SELECT id FROM restaurant_groups WHERE group_code = 'VHR'),
    'Varanasi Ghats Restaurant & Bar',
    'VHR-VGR-001',
    'fine_dining',
    ARRAY['north_indian', 'mughlai', 'regional_uttar_pradesh'],
    '42 Assi Ghat, Opposite Assi Ghat Stairs',
    'Near Shitala Temple',
    'Varanasi',
    'Uttar Pradesh',
    '221001',
    25.3209,
    82.9789,
    '+919876543210',
    'info@varanasi-ghats.com',
    'www.varanasi-ghats.com',
    '11:30',
    '23:30',
    150,
    20,
    true,
    true,
    true,
    true,
    'FSSAI-VAR-001',
    '09AABCU1234G1Z0',
    2.5,
    2.5,
    10.0
),

-- Restaurant 2: Casual Dining
(
    (SELECT id FROM restaurant_groups WHERE group_code = 'VHR'),
    'Chandni Chowk Bistro',
    'VHR-CCB-002',
    'casual_dining',
    ARRAY['north_indian', 'chinese', 'continental'],
    '178 Mint Street, Old City',
    'Near Kaal Bhairav Temple',
    'Varanasi',
    'Uttar Pradesh',
    '221002',
    25.3280,
    82.9850,
    '+919876543211',
    'bistro@chandni-chowk.com',
    'www.chandni-chowk.com',
    '11:00',
    '23:00',
    80,
    12,
    true,
    true,
    true,
    false,
    'FSSAI-VAR-002',
    '09AABCU1234G1Z1',
    2.5,
    2.5,
    5.0
),

-- Restaurant 3: QSR (Quick Service Restaurant)
(
    (SELECT id FROM restaurant_groups WHERE group_code = 'VHR'),
    'Thali Express',
    'VHR-TE-003',
    'qsr',
    ARRAY['north_indian', 'south_indian'],
    '234 Chauk Road, Cantonment',
    'Near Railway Station',
    'Varanasi',
    'Uttar Pradesh',
    '221002',
    25.3210,
    82.9700,
    '+919876543212',
    'orders@thali-express.com',
    'www.thali-express.com',
    '09:00',
    '22:00',
    60,
    8,
    true,
    true,
    false,
    false,
    'FSSAI-VAR-003',
    '09AABCU1234G1Z2',
    5.0,
    5.0,
    0.0
),

-- Restaurant 4: Cloud Kitchen
(
    (SELECT id FROM restaurant_groups WHERE group_code = 'VHR'),
    'Spice Cloud Kitchen',
    'VHR-SCK-004',
    'cloud_kitchen',
    ARRAY['indian_fusion', 'north_indian', 'asian'],
    '456 Industrial Area, Rajatalab',
    'Behind BHU Campus',
    'Varanasi',
    'Uttar Pradesh',
    '221005',
    25.3100,
    82.9900,
    '+919876543213',
    'orders@spice-cloud.com',
    'www.spice-cloud.com',
    '11:00',
    '23:00',
    0,
    0,
    false,
    false,
    true,
    false,
    'FSSAI-VAR-004',
    '09AABCU1234G1Z3',
    5.0,
    5.0,
    0.0
),

-- Group 2: Lucknow Express Foods
-- Restaurant 5: QSR in Lucknow
(
    (SELECT id FROM restaurant_groups WHERE group_code = 'LEF'),
    'Lucknow Express - Gomti Nagar',
    'LEF-GN-005',
    'qsr',
    ARRAY['north_indian', 'lucknowi', 'biryani'],
    '789 Ashok Marg, Gomti Nagar',
    'Opposite Gomti Nagar Thana',
    'Lucknow',
    'Uttar Pradesh',
    '226010',
    26.8467,
    80.9462,
    '+919988776655',
    'gn@lucknowexpress.com',
    'www.lucknowexpress.com',
    '10:00',
    '22:30',
    50,
    7,
    true,
    true,
    true,
    false,
    'FSSAI-LKO-001',
    '09AACPL5678H1Z5',
    5.0,
    5.0,
    0.0
),

-- Restaurant 6: Fine Dining in Agra
(
    (SELECT id FROM restaurant_groups WHERE group_code = 'LEF'),
    'Taj Spice House',
    'LEF-TSH-006',
    'fine_dining',
    ARRAY['mughlai', 'north_indian', 'awadhi'],
    '123 Taj Road, Tajganj',
    'Walking Distance from Taj Mahal',
    'Agra',
    'Uttar Pradesh',
    '282001',
    27.1756,
    78.0081,
    '+919988776656',
    'info@taj-spice.com',
    'www.taj-spice.com',
    '12:00',
    '23:30',
    120,
    18,
    true,
    true,
    true,
    true,
    'FSSAI-AGR-001',
    '09AACPL5678H1Z6',
    2.5,
    2.5,
    15.0
),

-- Restaurant 7: Cafe in Kanpur
(
    (SELECT id FROM restaurant_groups WHERE group_code = 'LEF'),
    'Cafe Riverside',
    'LEF-CR-007',
    'casual_dining',
    ARRAY['continental', 'chinese', 'italian'],
    '456 Old Court Road, Kidwai Nagar',
    'Overlooking Ganga River',
    'Kanpur',
    'Uttar Pradesh',
    '208001',
    26.4500,
    80.3300,
    '+919988776657',
    'hello@cafe-riverside.com',
    'www.cafe-riverside.com',
    '08:00',
    '22:00',
    70,
    10,
    true,
    true,
    false,
    false,
    'FSSAI-KAN-001',
    '09AACPL5678H1Z7',
    5.0,
    5.0,
    0.0
),

-- Restaurant 8: Cloud Kitchen in Allahabad
(
    (SELECT id FROM restaurant_groups WHERE group_code = 'LEF'),
    'Sacred Valley Kitchen',
    'LEF-SVK-008',
    'cloud_kitchen',
    ARRAY['indian', 'healthy_options', 'vegetarian'],
    '789 Sardar Patel Marg, Civil Lines',
    'Food Tech Hub',
    'Prayagraj',
    'Uttar Pradesh',
    '211001',
    25.4358,
    81.8463,
    '+919988776658',
    'orders@sacred-valley.com',
    'www.sacred-valley.com',
    '11:00',
    '22:00',
    0,
    0,
    false,
    false,
    true,
    false,
    'FSSAI-PRY-001',
    '09AACPL5678H1Z8',
    5.0,
    5.0,
    0.0
);

-- ============================================================================
-- 3. MENU CATEGORIES
-- ============================================================================

INSERT INTO menu_categories (restaurant_id, category_name, category_code, description, display_order, is_active)
SELECT
    r.id,
    unnest(ARRAY['Appetizers', 'Main Course - Vegetarian', 'Main Course - Non-Vegetarian', 'Rice & Breads', 'Beverages', 'Desserts']),
    unnest(ARRAY['APP', 'MCVeg', 'MCNonVeg', 'RB', 'BEV', 'DES']),
    unnest(ARRAY['Starters and appetizers', 'Vegetarian main courses', 'Non-vegetarian curries and preparations', 'Rice, breads and dough preparations', 'Hot and cold beverages', 'Sweet dishes and desserts']),
    unnest(ARRAY[1, 2, 3, 4, 5, 6]),
    true
FROM restaurants r
WHERE r.restaurant_type IN ('fine_dining', 'casual_dining', 'qsr');

-- ============================================================================
-- 4. MENU ITEMS (50+ items)
-- ============================================================================

WITH menu_data AS (
    SELECT
        r.id as restaurant_id,
        CASE
            WHEN mc.category_code = 'APP' THEN
                CASE (row_number() OVER (PARTITION BY r.id, mc.category_code ORDER BY r.id))
                    WHEN 1 THEN ('Samosa - Set of 4', 'SOM-001', 'Crispy triangular pastry filled with spiced potato', 80.00, 30.00)
                    WHEN 2 THEN ('Spring Rolls', 'SR-001', 'Vegetable spring rolls served with sweet chili sauce', 120.00, 40.00)
                    WHEN 3 THEN ('Paneer 65', 'P65-001', 'Crispy fried cottage cheese cubes with spices', 150.00, 50.00)
                    WHEN 4 THEN ('Tandoori Chicken Starter', 'TC-001', 'Grilled chicken pieces with yogurt marinade', 180.00, 70.00)
                    WHEN 5 THEN ('Fish Tikka', 'FT-001', 'Marinated fish grilled on skewers', 200.00, 85.00)
                    WHEN 6 THEN ('Chikhalwali (Meat Kebab)', 'CK-001', 'Traditional meat kebab from Lucknow', 160.00, 65.00)
                    ELSE NULL
                END
            WHEN mc.category_code = 'MCVeg' THEN
                CASE (row_number() OVER (PARTITION BY r.id, mc.category_code ORDER BY r.id))
                    WHEN 1 THEN ('Paneer Butter Masala', 'PBM-001', 'Cottage cheese in creamy tomato sauce', 280.00, 100.00)
                    WHEN 2 THEN ('Chana Masala', 'CHA-001', 'Chickpea curry with tomato and spices', 180.00, 60.00)
                    WHEN 3 THEN ('Aloo Gobi', 'AG-001', 'Potatoes and cauliflower with cumin seeds', 160.00, 50.00)
                    WHEN 4 THEN ('Mushroom Matar', 'MM-001', 'Mushrooms and peas in creamy sauce', 200.00, 70.00)
                    WHEN 5 THEN ('Baingan Bharta', 'BB-001', 'Roasted eggplant with onions and tomatoes', 140.00, 45.00)
                    WHEN 6 THEN ('Dal Makhani', 'DM-001', 'Black lentils and kidney beans in cream', 220.00, 80.00)
                    ELSE NULL
                END
            WHEN mc.category_code = 'MCNonVeg' THEN
                CASE (row_number() OVER (PARTITION BY r.id, mc.category_code ORDER BY r.id))
                    WHEN 1 THEN ('Butter Chicken', 'BC-001', 'Succulent chicken pieces in creamy tomato sauce', 320.00, 120.00)
                    WHEN 2 THEN ('Chicken Tikka Masala', 'CTM-001', 'Grilled chicken in aromatic spiced sauce', 300.00, 110.00)
                    WHEN 3 THEN ('Rogan Josh - Lamb', 'RJ-001', 'Tender lamb cooked in aromatic spices', 380.00, 150.00)
                    WHEN 4 THEN ('Tandoori Chicken - Half', 'TC-HALF', 'Whole chicken grilled with yogurt and spices', 350.00, 140.00)
                    WHEN 5 THEN ('Fish Curry - Coastal Style', 'FC-001', 'Fresh fish in coconut and spice sauce', 320.00, 130.00)
                    WHEN 6 THEN ('Seekh Kebab - Mutton', 'SK-001', 'Minced mutton kebab with herbs', 280.00, 110.00)
                    ELSE NULL
                END
            WHEN mc.category_code = 'RB' THEN
                CASE (row_number() OVER (PARTITION BY r.id, mc.category_code ORDER BY r.id))
                    WHEN 1 THEN ('Basmati Rice', 'BR-001', 'Fragrant Indian basmati rice', 150.00, 50.00)
                    WHEN 2 THEN ('Naan - Plain', 'NAAN-P', 'Traditional tandoor baked flatbread', 60.00, 20.00)
                    WHEN 3 THEN ('Butter Naan', 'NAAN-B', 'Naan brushed with ghee and butter', 80.00, 28.00)
                    WHEN 4 THEN ('Garlic Naan', 'NAAN-G', 'Naan topped with garlic and cilantro', 100.00, 35.00)
                    WHEN 5 THEN ('Roti - Wheat Bread', 'ROTI-W', 'Traditional whole wheat flatbread', 40.00, 12.00)
                    WHEN 6 THEN ('Biryani - Vegetarian', 'BIRYAN-VEG', 'Fragrant rice and vegetable preparation', 200.00, 70.00)
                    ELSE NULL
                END
            WHEN mc.category_code = 'BEV' THEN
                CASE (row_number() OVER (PARTITION BY r.id, mc.category_code ORDER BY r.id))
                    WHEN 1 THEN ('Fresh Lemonade', 'LEMON-001', 'Freshly squeezed lemon juice', 80.00, 20.00)
                    WHEN 2 THEN ('Mango Lassi', 'LASSI-M', 'Yogurt-based mango smoothie', 100.00, 30.00)
                    WHEN 3 THEN ('Sweet Lassi', 'LASSI-S', 'Chilled yogurt drink', 80.00, 25.00)
                    WHEN 4 THEN ('Indian Tea (Chai)', 'CHAI-001', 'Authentic Indian spiced tea', 60.00, 15.00)
                    WHEN 5 THEN ('Coffee', 'COFFEE-001', 'Fresh brewed coffee', 80.00, 20.00)
                    WHEN 6 THEN ('Cold Beverage - Cola', 'COLA-001', 'Soft drink', 60.00, 15.00)
                    ELSE NULL
                END
            WHEN mc.category_code = 'DES' THEN
                CASE (row_number() OVER (PARTITION BY r.id, mc.category_code ORDER BY r.id))
                    WHEN 1 THEN ('Gulab Jamun - 4 pieces', 'GJ-001', 'Sweet milk solids fried and soaked in syrup', 140.00, 40.00)
                    WHEN 2 THEN ('Kheer - Rice Pudding', 'KH-001', 'Rice pudding with milk and nuts', 120.00, 35.00)
                    WHEN 3 THEN ('Jalebi', 'JAL-001', 'Crispy sweet orange swirl in sugar syrup', 100.00, 30.00)
                    WHEN 4 THEN ('Rasmalai', 'RASM-001', 'Soft cheese dumplings in cardamom sauce', 160.00, 50.00)
                    WHEN 5 THEN ('Ice Cream - Vanilla', 'ICECR-V', 'Homemade vanilla ice cream', 100.00, 30.00)
                    WHEN 6 THEN ('Ice Cream - Pistachio', 'ICECR-P', 'Creamy pistachio flavored ice cream', 120.00, 35.00)
                    ELSE NULL
                END
            ELSE NULL
        END AS menu_data
    FROM restaurants r
    CROSS JOIN menu_categories mc
)
INSERT INTO menu_items (restaurant_id, category_id, item_name, item_code, description, base_price, cost_price,
                        cuisine_type, course_type, food_type, spice_level, preparation_time_minutes,
                        cooking_station, available_for_dine_in, available_for_takeaway, is_featured, is_active)
SELECT
    r.id,
    mc.id,
    (menu_data).menu_data[1],
    (menu_data).menu_data[2],
    (menu_data).menu_data[3],
    (menu_data).menu_data[4]::DECIMAL(10,2),
    (menu_data).menu_data[5]::DECIMAL(10,2),
    CASE mc.category_code
        WHEN 'APP' THEN 'north_indian'
        WHEN 'MCVeg' THEN 'north_indian'
        WHEN 'MCNonVeg' THEN 'mughlai'
        WHEN 'RB' THEN 'north_indian'
        WHEN 'BEV' THEN 'beverages'
        WHEN 'DES' THEN 'desserts'
    END,
    CASE mc.category_code
        WHEN 'APP' THEN 'starter'
        WHEN 'MCVeg' THEN 'main'
        WHEN 'MCNonVeg' THEN 'main'
        WHEN 'RB' THEN 'main'
        WHEN 'BEV' THEN 'beverage'
        WHEN 'DES' THEN 'dessert'
    END,
    CASE mc.category_code
        WHEN 'MCVeg' THEN 'VEG'
        WHEN 'DES' THEN 'VEG'
        WHEN 'BEV' THEN 'VEG'
        ELSE 'NON_VEG'
    END,
    CASE mc.category_code
        WHEN 'APP' THEN 'MEDIUM'
        WHEN 'MCVeg' THEN 'MILD'
        WHEN 'MCNonVeg' THEN 'MEDIUM'
        ELSE 'MILD'
    END,
    CASE mc.category_code
        WHEN 'APP' THEN 15
        WHEN 'MCVeg' THEN 25
        WHEN 'MCNonVeg' THEN 30
        WHEN 'RB' THEN 10
        WHEN 'BEV' THEN 5
        WHEN 'DES' THEN 8
    END,
    CASE mc.category_code
        WHEN 'APP' THEN 'KITCHEN_COLD'
        WHEN 'MCVeg' THEN 'KITCHEN_HOT'
        WHEN 'MCNonVeg' THEN 'KITCHEN_HOT'
        WHEN 'RB' THEN 'KITCHEN_HOT'
        WHEN 'BEV' THEN 'BAR'
        WHEN 'DES' THEN 'KITCHEN_COLD'
    END,
    true,
    true,
    CASE WHEN (row_number() OVER (PARTITION BY mc.id ORDER BY r.id)) <= 2 THEN true ELSE false END,
    true
FROM restaurants r
CROSS JOIN menu_categories mc
CROSS JOIN (SELECT DISTINCT menu_data FROM (
    SELECT
        CASE
            WHEN mc.category_code = 'APP' AND (row_number() OVER (PARTITION BY r.id, mc.category_code ORDER BY r.id)) <= 6 THEN
                ARRAY['Samosa - Set of 4', 'SOM-001', 'Crispy triangular pastry filled with spiced potato', '80.00', '30.00']
            WHEN mc.category_code = 'APP' AND (row_number() OVER (PARTITION BY r.id, mc.category_code ORDER BY r.id)) = 2 THEN
                ARRAY['Spring Rolls', 'SR-001', 'Vegetable spring rolls served with sweet chili sauce', '120.00', '40.00']
            WHEN mc.category_code = 'MCVeg' THEN
                ARRAY['Paneer Butter Masala', 'PBM-001', 'Cottage cheese in creamy tomato sauce', '280.00', '100.00']
            WHEN mc.category_code = 'MCNonVeg' THEN
                ARRAY['Butter Chicken', 'BC-001', 'Succulent chicken pieces in creamy tomato sauce', '320.00', '120.00']
            WHEN mc.category_code = 'RB' THEN
                ARRAY['Basmati Rice', 'BR-001', 'Fragrant Indian basmati rice', '150.00', '50.00']
            WHEN mc.category_code = 'BEV' THEN
                ARRAY['Fresh Lemonade', 'LEMON-001', 'Freshly squeezed lemon juice', '80.00', '20.00']
            WHEN mc.category_code = 'DES' THEN
                ARRAY['Gulab Jamun - 4 pieces', 'GJ-001', 'Sweet milk solids fried and soaked in syrup', '140.00', '40.00']
        END AS menu_data
    FROM restaurants r, menu_categories mc
) t WHERE menu_data IS NOT NULL
) menu_data
WHERE r.restaurant_type IN ('fine_dining', 'casual_dining', 'qsr')
AND mc.restaurant_id = r.id
AND (menu_data).menu_data IS NOT NULL;

-- ============================================================================
-- 5. MENU ITEM VARIANTS
-- ============================================================================

INSERT INTO menu_item_variants (menu_item_id, variant_name, variant_type, price_adjustment, is_default, is_available)
SELECT
    mi.id,
    variant_name,
    variant_type,
    price_adjustment,
    is_default,
    true
FROM menu_items mi
CROSS JOIN (VALUES
    ('Small', 'SIZE', -20.00, false),
    ('Medium', 'SIZE', 0.00, true),
    ('Large', 'SIZE', 30.00, false)
) AS variants(variant_name, variant_type, price_adjustment, is_default)
WHERE mi.item_name LIKE '%Paneer%' OR mi.item_name LIKE '%Chicken%' OR mi.item_name LIKE '%Rice%';

-- ============================================================================
-- 6. INVENTORY CATEGORIES & ITEMS
-- ============================================================================

INSERT INTO inventory_categories (category_name, parent_category_id)
VALUES
('Grains & Flour', NULL),
('Vegetables', NULL),
('Meats & Seafood', NULL),
('Dairy & Eggs', NULL),
('Spices & Condiments', NULL),
('Oils & Ghee', NULL),
('Dry Goods', NULL),
('Beverages', NULL),
('Packaging', NULL);

-- Sample inventory items
INSERT INTO inventory_items (restaurant_id, category_id, item_name, item_code, description, base_unit,
                            current_stock, min_stock_level, max_stock_level, avg_cost_price, is_perishable, shelf_life_days, is_active)
SELECT
    r.id,
    ic.id,
    items.item_name,
    items.item_code,
    items.description,
    items.base_unit,
    items.current_stock,
    items.min_stock_level,
    items.max_stock_level,
    items.avg_cost_price,
    items.is_perishable,
    items.shelf_life_days,
    true
FROM restaurants r
CROSS JOIN inventory_categories ic
CROSS JOIN (VALUES
    ('Basmati Rice', 'RICE-BAM', 'Premium basmati rice 1kg bags', 'bag', 50, 10, 100, 45.00, false, NULL),
    ('Wheat Flour', 'FLOUR-W', 'All-purpose wheat flour', 'kg', 200, 50, 500, 25.00, false, NULL),
    ('Onions', 'VEG-ONI', 'Fresh red onions', 'kg', 300, 100, 800, 30.00, true, 15),
    ('Tomatoes', 'VEG-TOM', 'Fresh tomatoes', 'kg', 150, 50, 400, 35.00, true, 7),
    ('Chicken Breast', 'MEAT-CHB', 'Fresh boneless chicken breast', 'kg', 120, 20, 300, 280.00, true, 2),
    ('Paneer', 'DAIRY-PAN', 'Fresh cottage cheese', 'kg', 80, 10, 150, 180.00, true, 5),
    ('Ghee', 'OIL-GHE', 'Pure clarified butter', 'liter', 30, 5, 80, 500.00, false, 365),
    ('Cumin Seeds', 'SPICE-CUM', 'Dried cumin seeds', 'kg', 5, 1, 15, 400.00, false, 365),
    ('Coriander Powder', 'SPICE-COR', 'Ground coriander', 'kg', 3, 1, 10, 350.00, false, 365),
    ('Milk', 'DAIRY-MIL', 'Fresh pasteurized milk', 'liter', 100, 30, 200, 60.00, true, 3)
) items(item_name, item_code, description, base_unit, current_stock, min_stock_level, max_stock_level, avg_cost_price, is_perishable, shelf_life_days)
WHERE r.restaurant_type IN ('fine_dining', 'casual_dining', 'qsr')
AND ic.category_name = 'Vegetables' OR ic.category_name IN ('Grains & Flour', 'Meats & Seafood', 'Dairy & Eggs', 'Spices & Condiments', 'Oils & Ghee');

-- ============================================================================
-- 7. FLOORS & TABLES
-- ============================================================================

-- Insert floors for dine-in restaurants
INSERT INTO floors (restaurant_id, floor_name, floor_number, total_tables, is_active)
SELECT
    r.id,
    floor_data.floor_name,
    floor_data.floor_number,
    floor_data.total_tables,
    true
FROM restaurants r
CROSS JOIN (VALUES
    ('Ground Floor', 0, 8),
    ('First Floor', 1, 7)
) AS floor_data(floor_name, floor_number, total_tables)
WHERE r.restaurant_type IN ('fine_dining', 'casual_dining', 'qsr');

-- Insert tables
INSERT INTO tables (restaurant_id, floor_id, table_number, table_name, seating_capacity, table_type,
                    position_x, position_y, status, is_active)
SELECT
    f.restaurant_id,
    f.id,
    'T' || ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY f.id),
    'Table ' || ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY f.id),
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY f.id) % 5 = 0 THEN 6 ELSE 4 END,
    CASE WHEN ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY f.id) % 10 = 0 THEN 'VIP' ELSE 'REGULAR' END,
    (ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY f.id) * 100) % 500,
    ((ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY f.id) * 50) % 300) + 100,
    'AVAILABLE',
    true
FROM floors f
WHERE f.floor_number IN (0, 1);

-- ============================================================================
-- 8. STAFF USERS
-- ============================================================================

INSERT INTO users (restaurant_id, first_name, last_name, email, phone, password_hash, role,
                   employee_id, joining_date, salary, is_active)
SELECT
    r.id,
    staff.first_name,
    staff.last_name,
    LOWER(staff.first_name || '.' || staff.last_name || '@' || REPLACE(LOWER(r.restaurant_name), ' ', '') || '.com'),
    '+91' || LPAD(FLOOR(6000000000 + RANDOM() * 4000000000)::TEXT, 10, '0'),
    '$2b$10$' || SUBSTR(MD5(RANDOM()::TEXT), 1, 53),
    staff.role,
    UPPER(SUBSTRING(staff.role, 1, 3)) || '-' || LPAD(ROW_NUMBER() OVER (PARTITION BY r.id, staff.role ORDER BY r.id)::TEXT, 3, '0'),
    CURRENT_DATE - INTERVAL '1 year' + INTERVAL '1 day' * FLOOR(RANDOM() * 365),
    (CASE staff.role
        WHEN 'OWNER' THEN 150000
        WHEN 'MANAGER' THEN 50000
        WHEN 'CAPTAIN' THEN 25000
        WHEN 'WAITER' THEN 15000
        WHEN 'CHEF' THEN 40000
        WHEN 'CASHIER' THEN 20000
        ELSE 12000
    END)::DECIMAL(10,2),
    true
FROM restaurants r
CROSS JOIN (VALUES
    ('Rajesh', 'Singh', 'OWNER'),
    ('Amit', 'Kumar', 'MANAGER'),
    ('Vikram', 'Verma', 'CHEF'),
    ('Rohan', 'Patel', 'WAITER'),
    ('Sanjay', 'Sharma', 'WAITER'),
    ('Mahesh', 'Rao', 'CAPTAIN'),
    ('Priya', 'Gupta', 'CASHIER')
) AS staff(first_name, last_name, role)
WHERE r.restaurant_type IN ('fine_dining', 'casual_dining', 'qsr');

-- ============================================================================
-- 9. CUSTOMERS
-- ============================================================================

INSERT INTO customers (customer_name, email, phone, food_preferences, loyalty_tier, total_orders, is_active)
VALUES
('Rajesh Kumar', 'rajesh.kumar@gmail.com', '9876543210', ARRAY['vegetarian'], 'GOLD', 25, true),
('Priya Singh', 'priya.singh@hotmail.com', '9876543211', ARRAY['vegan'], 'SILVER', 12, true),
('Amit Patel', 'amit.patel@outlook.com', '9876543212', ARRAY['jain'], 'SILVER', 8, true),
('Neha Sharma', 'neha.sharma@gmail.com', '9876543213', NULL, 'BRONZE', 3, true),
('Vikram Verma', 'vikram.verma@rediffmail.com', '9876543214', ARRAY['non_vegetarian'], 'GOLD', 30, true),
('Sunita Gupta', 'sunita.gupta@gmail.com', '9876543215', ARRAY['vegetarian', 'gluten_free'], 'SILVER', 15, true),
('Arun Singh', 'arun.singh@hotmail.com', '9876543216', NULL, 'BRONZE', 2, true),
('Deepti Mishra', 'deepti.mishra@outlook.com', '9876543217', ARRAY['vegetarian'], 'SILVER', 10, true),
('Harsh Trivedi', 'harsh.trivedi@gmail.com', '9876543218', ARRAY['non_vegetarian'], 'GOLD', 28, true),
('Anjali Yadav', 'anjali.yadav@hotmail.com', '9876543219', ARRAY['vegetarian'], 'BRONZE', 5, true);

-- ============================================================================
-- 10. ORDERS (30+ orders with various statuses)
-- ============================================================================

-- Get first restaurant for orders
DO $$
DECLARE
    v_restaurant_id UUID;
    v_user_id UUID;
    v_table_id UUID;
    v_customer_id UUID;
    v_menu_item_id UUID;
    v_order_count INT := 0;
BEGIN
    -- Get IDs for inserting orders
    SELECT id INTO v_restaurant_id FROM restaurants LIMIT 1;
    SELECT id INTO v_user_id FROM users WHERE role = 'WAITER' LIMIT 1;
    SELECT id INTO v_table_id FROM tables LIMIT 1;
    SELECT id INTO v_customer_id FROM customers LIMIT 1;
    SELECT id INTO v_menu_item_id FROM menu_items LIMIT 1;

    -- Insert orders with various statuses
    FOR v_order_count IN 1..35 LOOP
        INSERT INTO orders (
            restaurant_id, order_number, token_number, order_type, customer_id, customer_name, customer_phone,
            table_id, floor_id, guest_count, order_datetime, order_status, subtotal, cgst_amount, sgst_amount,
            total_amount, payment_status, waiter_id, created_by, confirmed_at, preparing_started_at, ready_at, served_at, completed_at
        ) VALUES (
            v_restaurant_id,
            'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(v_order_count::TEXT, 4, '0'),
            v_order_count,
            CASE WHEN v_order_count % 4 = 0 THEN 'TAKEAWAY'
                 WHEN v_order_count % 4 = 1 THEN 'DINE_IN'
                 WHEN v_order_count % 4 = 2 THEN 'DELIVERY'
                 ELSE 'DINE_IN'
            END,
            CASE WHEN v_order_count % 3 = 0 THEN v_customer_id ELSE NULL END,
            'Customer ' || v_order_count,
            '9876543' || LPAD(v_order_count::TEXT, 3, '0'),
            CASE WHEN v_order_count % 5 = 0 THEN NULL ELSE v_table_id END,
            CASE WHEN v_order_count % 5 = 0 THEN NULL ELSE (SELECT id FROM floors LIMIT 1) END,
            CASE WHEN v_order_count % 5 = 0 THEN NULL ELSE (2 + (v_order_count % 4)) END,
            CURRENT_TIMESTAMP - INTERVAL '1 day' * (35 - v_order_count) - INTERVAL '1 hour' * (v_order_count % 12),
            CASE
                WHEN v_order_count <= 5 THEN 'COMPLETED'
                WHEN v_order_count <= 10 THEN 'SERVED'
                WHEN v_order_count <= 15 THEN 'READY'
                WHEN v_order_count <= 20 THEN 'PREPARING'
                WHEN v_order_count <= 25 THEN 'CONFIRMED'
                WHEN v_order_count <= 30 THEN 'PENDING'
                ELSE 'CANCELLED'
            END,
            (250.00 + (v_order_count % 10) * 50)::DECIMAL(10,2),
            CASE WHEN v_order_count % 3 = 0 THEN ((250.00 + (v_order_count % 10) * 50) * 0.025)::DECIMAL(10,2) ELSE 0 END,
            CASE WHEN v_order_count % 3 = 0 THEN ((250.00 + (v_order_count % 10) * 50) * 0.025)::DECIMAL(10,2) ELSE 0 END,
            (250.00 + (v_order_count % 10) * 50 + CASE WHEN v_order_count % 3 = 0 THEN ((250.00 + (v_order_count % 10) * 50) * 0.05)::DECIMAL(10,2) ELSE 0 END)::DECIMAL(10,2),
            CASE WHEN v_order_count <= 10 THEN 'PAID' WHEN v_order_count <= 20 THEN 'PENDING' ELSE 'PARTIAL' END,
            v_user_id,
            v_user_id,
            CASE WHEN v_order_count > 5 THEN (CURRENT_TIMESTAMP - INTERVAL '1 day' * (35 - v_order_count) - INTERVAL '50 minutes') ELSE NULL END,
            CASE WHEN v_order_count > 10 THEN (CURRENT_TIMESTAMP - INTERVAL '1 day' * (35 - v_order_count) - INTERVAL '45 minutes') ELSE NULL END,
            CASE WHEN v_order_count > 15 THEN (CURRENT_TIMESTAMP - INTERVAL '1 day' * (35 - v_order_count) - INTERVAL '20 minutes') ELSE NULL END,
            CASE WHEN v_order_count > 20 THEN (CURRENT_TIMESTAMP - INTERVAL '1 day' * (35 - v_order_count) - INTERVAL '5 minutes') ELSE NULL END,
            CASE WHEN v_order_count <= 5 THEN (CURRENT_TIMESTAMP - INTERVAL '1 day' * (35 - v_order_count)) ELSE NULL END
        );
    END LOOP;
END $$;

-- ============================================================================
-- 11. ORDER ITEMS
-- ============================================================================

INSERT INTO order_items (order_id, menu_item_id, item_name, item_code, quantity, unit_price, total_price, special_instructions)
SELECT
    o.id,
    mi.id,
    mi.item_name,
    mi.item_code,
    CASE WHEN (row_number() OVER (PARTITION BY o.id ORDER BY o.id)) % 4 = 0 THEN 2 ELSE 1 END,
    mi.base_price,
    mi.base_price * CASE WHEN (row_number() OVER (PARTITION BY o.id ORDER BY o.id)) % 4 = 0 THEN 2 ELSE 1 END,
    CASE WHEN (row_number() OVER (PARTITION BY o.id ORDER BY o.id)) % 3 = 0 THEN 'Less spicy please' ELSE NULL END
FROM orders o
CROSS JOIN menu_items mi
WHERE (row_number() OVER (PARTITION BY o.id ORDER BY mi.id)) <= CASE WHEN RANDOM() > 0.5 THEN 3 ELSE 2 END;

-- ============================================================================
-- 12. PAYMENTS
-- ============================================================================

INSERT INTO payments (restaurant_id, order_id, payment_reference, payment_datetime, amount, payment_method,
                      payment_status, collected_by)
SELECT
    o.restaurant_id,
    o.id,
    'PAY-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(ROW_NUMBER() OVER (ORDER BY o.id)::TEXT, 6, '0'),
    o.order_datetime + INTERVAL '30 minutes',
    o.total_amount,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY o.id) % 4 = 0 THEN 'CASH'
         WHEN ROW_NUMBER() OVER (ORDER BY o.id) % 4 = 1 THEN 'CARD'
         WHEN ROW_NUMBER() OVER (ORDER BY o.id) % 4 = 2 THEN 'UPI'
         ELSE 'WALLET'
    END,
    CASE WHEN o.payment_status = 'PAID' THEN 'SUCCESS' ELSE 'PENDING' END,
    o.waiter_id
FROM orders o
WHERE o.payment_status IN ('PAID', 'PARTIAL')
ORDER BY o.created_at DESC
LIMIT 25;

-- ============================================================================
-- 13. DAILY SALES SUMMARY
-- ============================================================================

INSERT INTO daily_sales_summary (restaurant_id, summary_date, total_orders, dine_in_orders, takeaway_orders,
                                 delivery_orders, gross_revenue, net_revenue, taxes_collected, cash_collected,
                                 card_collected, upi_collected, unique_customers, average_order_value)
SELECT
    r.id,
    CURRENT_DATE - INTERVAL '1 day' * (row_number() OVER (ORDER BY r.id) - 1),
    FLOOR(15 + RANDOM() * 20)::INT,
    FLOOR(8 + RANDOM() * 8)::INT,
    FLOOR(3 + RANDOM() * 5)::INT,
    FLOOR(2 + RANDOM() * 4)::INT,
    (2500 + RANDOM() * 3000)::DECIMAL(12,2),
    (2300 + RANDOM() * 2700)::DECIMAL(12,2),
    (250 + RANDOM() * 300)::DECIMAL(12,2),
    (1200 + RANDOM() * 800)::DECIMAL(12,2),
    (700 + RANDOM() * 600)::DECIMAL(12,2),
    (300 + RANDOM() * 400)::DECIMAL(12,2),
    FLOOR(20 + RANDOM() * 15)::INT,
    (200 + RANDOM() * 150)::DECIMAL(10,2)
FROM restaurants r
WHERE r.restaurant_type IN ('fine_dining', 'casual_dining', 'qsr')
LIMIT 10;

-- ============================================================================
-- VERIFICATION & SUMMARY
-- ============================================================================

SELECT 'Demo Data Population Complete!' AS status;
SELECT COUNT(*) AS "Total Restaurants" FROM restaurants;
SELECT COUNT(*) AS "Total Menu Items" FROM menu_items;
SELECT COUNT(*) AS "Total Tables" FROM tables;
SELECT COUNT(*) AS "Total Orders" FROM orders;
SELECT COUNT(*) AS "Total Customers" FROM customers;
SELECT COUNT(*) AS "Total Staff" FROM users;
SELECT COUNT(*) AS "Total Payments" FROM payments;
