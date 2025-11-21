'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Complete business data with demo records
const businessData: Record<string, any> = {
  '1': {
    name: 'Hotel & Hospitality Management',
    icon: '🏨',
    description: 'Complete hotel management system with room booking, guest management, and billing',
    modules: ['Rooms', 'Bookings', 'Guests', 'Housekeeping', 'Billing', 'Reports'],
    stats: { rooms: 150, bookings: 89, guests: 234, revenue: '₹12,45,000' },
    demoData: {
      title: 'Room Inventory',
      headers: ['Room No', 'Type', 'Floor', 'Status', 'Rate/Night', 'Guest'],
      rows: [
        ['101', 'Deluxe', '1st', 'Occupied', '₹3,500', 'Rajesh Kumar'],
        ['102', 'Suite', '1st', 'Available', '₹7,500', '-'],
        ['103', 'Standard', '1st', 'Occupied', '₹2,000', 'Priya Singh'],
        ['201', 'Deluxe', '2nd', 'Maintenance', '₹3,500', '-'],
        ['202', 'Suite', '2nd', 'Available', '₹7,500', '-'],
        ['203', 'Premium', '2nd', 'Occupied', '₹5,000', 'Amit Sharma'],
        ['301', 'Deluxe', '3rd', 'Available', '₹3,500', '-'],
        ['302', 'Standard', '3rd', 'Occupied', '₹2,000', 'Neha Gupta'],
      ]
    }
  },
  '2': {
    name: 'Temple Management System',
    icon: '🛕',
    description: 'Manage temple operations, donations, events, and devotee records',
    modules: ['Donations', 'Events', 'Devotees', 'Pooja Booking', 'Inventory', 'Reports'],
    stats: { donations: '₹8,50,000', events: 24, devotees: 5420, poojas: 156 },
    demoData: {
      title: 'Recent Donations',
      headers: ['Date', 'Devotee', 'Amount', 'Purpose', 'Receipt No', 'Mode'],
      rows: [
        ['21/11/2024', 'Ramesh Agarwal', '₹51,000', 'Temple Renovation', 'RCP-001', 'UPI'],
        ['21/11/2024', 'Sunita Devi', '₹11,000', 'Annadaan', 'RCP-002', 'Cash'],
        ['20/11/2024', 'Mohan Lal', '₹5,100', 'General', 'RCP-003', 'Card'],
        ['20/11/2024', 'Geeta Sharma', '₹21,000', 'Festival Fund', 'RCP-004', 'UPI'],
        ['19/11/2024', 'Vijay Kumar', '₹1,100', 'Pooja', 'RCP-005', 'Cash'],
        ['19/11/2024', 'Lakshmi Trust', '₹1,00,000', 'Gold Donation', 'RCP-006', 'Cheque'],
      ]
    }
  },
  '3': {
    name: 'Restaurant POS Management',
    icon: '🍽️',
    description: 'Point of sale system for restaurants with order management and kitchen display',
    modules: ['Orders', 'Menu', 'Tables', 'Kitchen', 'Inventory', 'Billing'],
    stats: { orders: 145, tables: 25, items: 89, revenue: '₹78,500' },
    demoData: {
      title: 'Active Orders',
      headers: ['Order #', 'Table', 'Items', 'Amount', 'Status', 'Time'],
      rows: [
        ['ORD-101', 'Table 5', 'Paneer Tikka, Dal Makhani, Naan x2', '₹850', 'Preparing', '12:30'],
        ['ORD-102', 'Table 8', 'Biryani, Raita, Cold Drink', '₹450', 'Ready', '12:25'],
        ['ORD-103', 'Table 2', 'Thali Special, Lassi', '₹350', 'Served', '12:15'],
        ['ORD-104', 'Table 12', 'Pizza, Pasta, Garlic Bread', '₹780', 'Preparing', '12:35'],
        ['ORD-105', 'Takeaway', 'Burger x2, Fries, Coke', '₹520', 'Packed', '12:40'],
        ['ORD-106', 'Table 6', 'Chinese Combo, Manchurian', '₹620', 'Preparing', '12:38'],
      ]
    }
  },
  '4': {
    name: 'Travel & Tour Agency',
    icon: '✈️',
    description: 'Complete travel agency management with packages, bookings, and itineraries',
    modules: ['Packages', 'Bookings', 'Customers', 'Vendors', 'Payments', 'Reports'],
    stats: { packages: 45, bookings: 78, customers: 234, revenue: '₹25,00,000' },
    demoData: {
      title: 'Tour Packages',
      headers: ['Package', 'Destination', 'Duration', 'Price', 'Bookings', 'Rating'],
      rows: [
        ['Varanasi Heritage', 'Varanasi', '3D/2N', '₹12,500', '45', '4.8⭐'],
        ['Rajasthan Royal', 'Jaipur-Udaipur', '5D/4N', '₹28,000', '32', '4.9⭐'],
        ['Kerala Backwaters', 'Kerala', '4D/3N', '₹22,000', '28', '4.7⭐'],
        ['Himalayan Adventure', 'Manali', '6D/5N', '₹35,000', '18', '4.6⭐'],
        ['Goa Beach Holiday', 'Goa', '4D/3N', '₹18,500', '56', '4.5⭐'],
        ['Golden Triangle', 'Delhi-Agra-Jaipur', '5D/4N', '₹24,000', '42', '4.8⭐'],
      ]
    }
  },
  '5': {
    name: 'Hospital Management System',
    icon: '🏥',
    description: 'Healthcare management with patient records, appointments, and pharmacy',
    modules: ['Patients', 'Appointments', 'Doctors', 'Pharmacy', 'Lab', 'Billing'],
    stats: { patients: 1250, appointments: 89, doctors: 35, beds: 200 },
    demoData: {
      title: 'Today\'s Appointments',
      headers: ['Time', 'Patient', 'Doctor', 'Department', 'Type', 'Status'],
      rows: [
        ['09:00', 'Ramesh Kumar', 'Dr. Sharma', 'Cardiology', 'Follow-up', 'Completed'],
        ['09:30', 'Priya Singh', 'Dr. Gupta', 'Gynecology', 'Consultation', 'In Progress'],
        ['10:00', 'Amit Verma', 'Dr. Patel', 'Orthopedics', 'New', 'Waiting'],
        ['10:30', 'Sunita Devi', 'Dr. Khan', 'General', 'Follow-up', 'Scheduled'],
        ['11:00', 'Vijay Malhotra', 'Dr. Sharma', 'Cardiology', 'Emergency', 'Scheduled'],
        ['11:30', 'Neha Agarwal', 'Dr. Reddy', 'Pediatrics', 'Vaccination', 'Scheduled'],
      ]
    }
  },
  '6': {
    name: 'Real Estate Management',
    icon: '🏠',
    description: 'Property listings, leads management, and transaction tracking',
    modules: ['Properties', 'Leads', 'Clients', 'Transactions', 'Documents', 'Reports'],
    stats: { properties: 156, leads: 89, clients: 234, deals: 23 },
    demoData: {
      title: 'Property Listings',
      headers: ['Property', 'Type', 'Location', 'Price', 'Status', 'Agent'],
      rows: [
        ['Green Villa', '3BHK Villa', 'Gomti Nagar', '₹1.2 Cr', 'Available', 'Rahul S.'],
        ['Sky Heights', '2BHK Flat', 'Hazratganj', '₹65 Lac', 'Under Offer', 'Priya M.'],
        ['Lake View', '4BHK Villa', 'Indira Nagar', '₹2.5 Cr', 'Available', 'Amit K.'],
        ['City Center', 'Commercial', 'Chowk', '₹3.8 Cr', 'Sold', 'Rahul S.'],
        ['Garden Estate', '3BHK Flat', 'Aliganj', '₹78 Lac', 'Available', 'Neha G.'],
        ['Royal Residency', 'Penthouse', 'Gomti Nagar', '₹4.2 Cr', 'Available', 'Amit K.'],
      ]
    }
  },
  '7': {
    name: 'Pharmacy Management',
    icon: '💊',
    description: 'Medicine inventory, prescriptions, and sales management',
    modules: ['Inventory', 'Sales', 'Purchases', 'Prescriptions', 'Expiry', 'Reports'],
    stats: { medicines: 2450, sales: '₹1,25,000', prescriptions: 156, expiring: 23 },
    demoData: {
      title: 'Medicine Inventory',
      headers: ['Medicine', 'Category', 'Stock', 'MRP', 'Expiry', 'Supplier'],
      rows: [
        ['Paracetamol 500mg', 'Analgesic', '500', '₹25', 'Dec 2025', 'Sun Pharma'],
        ['Amoxicillin 250mg', 'Antibiotic', '200', '₹85', 'Mar 2025', 'Cipla'],
        ['Omeprazole 20mg', 'Antacid', '350', '₹120', 'Jun 2025', 'Dr Reddy'],
        ['Metformin 500mg', 'Diabetes', '450', '₹45', 'Sep 2025', 'Lupin'],
        ['Cetirizine 10mg', 'Antiallergy', '600', '₹35', 'Aug 2025', 'Sun Pharma'],
        ['Azithromycin 500mg', 'Antibiotic', '150', '₹180', 'Feb 2025', 'Cipla'],
      ]
    }
  },
  '8': {
    name: 'Jewellery Store Management',
    icon: '💎',
    description: 'Gold and jewellery inventory with custom orders and billing',
    modules: ['Inventory', 'Sales', 'Custom Orders', 'Gold Rate', 'Customers', 'Reports'],
    stats: { items: 850, sales: '₹45,00,000', orders: 34, customers: 456 },
    demoData: {
      title: 'Jewellery Inventory',
      headers: ['Item', 'Category', 'Weight', 'Purity', 'Making', 'Price'],
      rows: [
        ['Necklace Set', 'Gold', '45g', '22K', '₹12,000', '₹2,85,000'],
        ['Diamond Ring', 'Diamond', '8g', '18K', '₹8,500', '₹1,25,000'],
        ['Bangles (4)', 'Gold', '32g', '22K', '₹6,400', '₹2,08,000'],
        ['Earrings', 'Gold', '12g', '22K', '₹3,600', '₹81,600'],
        ['Chain', 'Gold', '25g', '22K', '₹5,000', '₹1,62,500'],
        ['Pendant', 'Diamond', '5g', '18K', '₹4,500', '₹65,000'],
      ]
    }
  },
  '9': {
    name: 'Saree & Textile Store',
    icon: '👗',
    description: 'Textile inventory management with alterations and customer records',
    modules: ['Inventory', 'Sales', 'Alterations', 'Customers', 'Suppliers', 'Reports'],
    stats: { sarees: 1200, sales: '₹8,50,000', alterations: 45, customers: 567 },
    demoData: {
      title: 'Saree Collection',
      headers: ['Item', 'Type', 'Material', 'Color', 'Price', 'Stock'],
      rows: [
        ['Banarasi Silk', 'Wedding', 'Pure Silk', 'Red/Gold', '₹25,000', '15'],
        ['Kanjivaram', 'Bridal', 'Silk', 'Maroon', '₹35,000', '8'],
        ['Chanderi', 'Casual', 'Cotton Silk', 'Blue', '₹4,500', '25'],
        ['Bandhani', 'Festive', 'Georgette', 'Multi', '₹3,800', '30'],
        ['Tussar Silk', 'Party', 'Silk', 'Beige', '₹8,500', '12'],
        ['Chiffon Print', 'Daily', 'Chiffon', 'Various', '₹1,200', '50'],
      ]
    }
  },
  '10': {
    name: 'Educational Institute',
    icon: '🎓',
    description: 'Student management, attendance, fees, and examination system',
    modules: ['Students', 'Attendance', 'Fees', 'Exams', 'Teachers', 'Reports'],
    stats: { students: 850, teachers: 45, courses: 24, revenue: '₹35,00,000' },
    demoData: {
      title: 'Student Records',
      headers: ['Roll No', 'Name', 'Class', 'Section', 'Fees Status', 'Attendance'],
      rows: [
        ['2024001', 'Aarav Sharma', 'X', 'A', 'Paid', '92%'],
        ['2024002', 'Diya Gupta', 'X', 'A', 'Paid', '95%'],
        ['2024003', 'Arjun Singh', 'X', 'B', 'Pending', '88%'],
        ['2024004', 'Ananya Patel', 'IX', 'A', 'Paid', '90%'],
        ['2024005', 'Vihaan Kumar', 'IX', 'B', 'Partial', '85%'],
        ['2024006', 'Ishita Verma', 'VIII', 'A', 'Paid', '94%'],
      ]
    }
  },
  '11': {
    name: 'Event & Wedding Planning',
    icon: '💒',
    description: 'Event booking, vendor management, and budget tracking',
    modules: ['Events', 'Vendors', 'Bookings', 'Budget', 'Tasks', 'Reports'],
    stats: { events: 45, vendors: 120, bookings: 28, revenue: '₹85,00,000' },
    demoData: {
      title: 'Upcoming Events',
      headers: ['Event', 'Client', 'Date', 'Venue', 'Budget', 'Status'],
      rows: [
        ['Sharma Wedding', 'Rajesh Sharma', '25 Dec 2024', 'Grand Palace', '₹25,00,000', 'Confirmed'],
        ['Corporate Meet', 'TCS Ltd', '15 Dec 2024', 'Hotel Taj', '₹8,00,000', 'Planning'],
        ['Birthday Party', 'Priya Gupta', '10 Dec 2024', 'Farm House', '₹2,50,000', 'Confirmed'],
        ['Anniversary', 'Kumar Family', '20 Dec 2024', 'Club Resort', '₹5,00,000', 'Confirmed'],
        ['Product Launch', 'Startup Inc', '18 Dec 2024', 'Convention Center', '₹12,00,000', 'Planning'],
      ]
    }
  },
  '12': {
    name: 'Gym & Fitness Center',
    icon: '🏋️',
    description: 'Membership management, trainer schedules, and equipment tracking',
    modules: ['Members', 'Trainers', 'Classes', 'Equipment', 'Payments', 'Reports'],
    stats: { members: 450, trainers: 12, classes: 25, revenue: '₹6,50,000' },
    demoData: {
      title: 'Member Directory',
      headers: ['ID', 'Name', 'Plan', 'Trainer', 'Start Date', 'Status'],
      rows: [
        ['GYM001', 'Rahul Verma', 'Premium', 'Amit K.', '01 Oct 2024', 'Active'],
        ['GYM002', 'Priya Singh', 'Basic', 'Neha S.', '15 Sep 2024', 'Active'],
        ['GYM003', 'Amit Sharma', 'Premium', 'Raj P.', '01 Nov 2024', 'Active'],
        ['GYM004', 'Sneha Gupta', 'Gold', 'Neha S.', '20 Oct 2024', 'Active'],
        ['GYM005', 'Vikram Malhotra', 'Basic', 'Amit K.', '05 Nov 2024', 'Active'],
        ['GYM006', 'Anjali Patel', 'Gold', 'Raj P.', '10 Sep 2024', 'Expired'],
      ]
    }
  },
  '13': {
    name: 'Professional Services Hub',
    icon: '💼',
    description: 'Client management, project tracking, and invoicing',
    modules: ['Clients', 'Projects', 'Tasks', 'Timesheets', 'Invoices', 'Reports'],
    stats: { clients: 85, projects: 34, invoices: '₹45,00,000', pending: 8 },
    demoData: {
      title: 'Active Projects',
      headers: ['Project', 'Client', 'Start', 'Deadline', 'Budget', 'Progress'],
      rows: [
        ['Website Redesign', 'ABC Corp', '01 Nov', '30 Dec', '₹5,00,000', '65%'],
        ['Mobile App', 'XYZ Ltd', '15 Oct', '15 Jan', '₹12,00,000', '40%'],
        ['ERP Implementation', 'PQR Industries', '01 Sep', '28 Feb', '₹25,00,000', '55%'],
        ['Digital Marketing', 'StartupX', '01 Nov', '31 Dec', '₹2,00,000', '30%'],
        ['Cloud Migration', 'Tech Corp', '20 Oct', '20 Dec', '₹8,00,000', '75%'],
      ]
    }
  },
  '14': {
    name: 'School Management System',
    icon: '🏫',
    description: 'Complete school ERP with admissions, classes, and transport',
    modules: ['Admissions', 'Classes', 'Teachers', 'Library', 'Transport', 'Fees'],
    stats: { students: 1250, teachers: 65, buses: 12, books: 8500 },
    demoData: {
      title: 'Class Schedule',
      headers: ['Class', 'Section', 'Subject', 'Teacher', 'Time', 'Room'],
      rows: [
        ['X', 'A', 'Mathematics', 'Mr. Sharma', '09:00-10:00', '101'],
        ['X', 'A', 'Physics', 'Mrs. Gupta', '10:00-11:00', '102'],
        ['IX', 'B', 'English', 'Mr. Verma', '09:00-10:00', '201'],
        ['VIII', 'A', 'Science', 'Mrs. Patel', '11:00-12:00', '103'],
        ['X', 'B', 'Chemistry', 'Mr. Khan', '10:00-11:00', '104'],
        ['IX', 'A', 'Hindi', 'Mrs. Singh', '11:00-12:00', '202'],
      ]
    }
  },
  '15': {
    name: 'Food Production & Distribution',
    icon: '🍕',
    description: 'Production planning, quality control, and distribution management',
    modules: ['Production', 'Quality', 'Inventory', 'Orders', 'Distribution', 'Reports'],
    stats: { products: 85, orders: 156, distributors: 45, revenue: '₹28,00,000' },
    demoData: {
      title: 'Production Schedule',
      headers: ['Product', 'Batch', 'Quantity', 'Start', 'Status', 'QC'],
      rows: [
        ['Bread Loaf', 'BL-2411', '500 pcs', '06:00', 'Completed', 'Passed'],
        ['Cookies Pack', 'CK-2411', '1000 pcs', '07:00', 'In Progress', 'Pending'],
        ['Cake 1kg', 'CA-2411', '50 pcs', '08:00', 'Scheduled', 'Pending'],
        ['Biscuits', 'BS-2411', '2000 pcs', '06:30', 'Completed', 'Passed'],
        ['Pastries', 'PS-2411', '200 pcs', '09:00', 'Scheduled', 'Pending'],
      ]
    }
  },
  '16': {
    name: 'Transport & Logistics',
    icon: '🚚',
    description: 'Fleet management, route planning, and shipment tracking',
    modules: ['Fleet', 'Drivers', 'Routes', 'Shipments', 'Tracking', 'Reports'],
    stats: { vehicles: 35, drivers: 42, shipments: 156, revenue: '₹18,00,000' },
    demoData: {
      title: 'Active Shipments',
      headers: ['Tracking ID', 'From', 'To', 'Vehicle', 'Driver', 'Status'],
      rows: [
        ['TRK-001', 'Mumbai', 'Delhi', 'UP-32-AB-1234', 'Ramesh K.', 'In Transit'],
        ['TRK-002', 'Chennai', 'Bangalore', 'TN-01-CD-5678', 'Suresh M.', 'Delivered'],
        ['TRK-003', 'Delhi', 'Jaipur', 'DL-01-EF-9012', 'Amit S.', 'In Transit'],
        ['TRK-004', 'Kolkata', 'Patna', 'WB-02-GH-3456', 'Vijay P.', 'Loading'],
        ['TRK-005', 'Pune', 'Hyderabad', 'MH-12-IJ-7890', 'Raju T.', 'In Transit'],
      ]
    }
  },
  '17': {
    name: 'CA Firm Management',
    icon: '📊',
    description: 'Client file management, tax filing, and compliance tracking',
    modules: ['Clients', 'Tax Filing', 'Compliance', 'Documents', 'Billing', 'Reports'],
    stats: { clients: 250, filings: 180, pending: 45, revenue: '₹35,00,000' },
    demoData: {
      title: 'Tax Filing Status',
      headers: ['Client', 'Type', 'FY', 'Due Date', 'Status', 'Fee'],
      rows: [
        ['ABC Traders', 'GST Return', '2024-25', '20 Dec', 'Pending', '₹2,500'],
        ['XYZ Pvt Ltd', 'ITR', '2023-24', '31 Dec', 'Filed', '₹15,000'],
        ['Kumar & Sons', 'TDS Return', '2024-25', '15 Dec', 'In Progress', '₹3,000'],
        ['Sharma Enterprises', 'GST Annual', '2023-24', '31 Dec', 'Pending', '₹8,000'],
        ['Tech Solutions', 'ITR', '2023-24', '31 Dec', 'Filed', '₹25,000'],
      ]
    }
  },
  '18': {
    name: 'Health & Fitness Center',
    icon: '🧘',
    description: 'Wellness center with classes, bookings, and health tracking',
    modules: ['Classes', 'Bookings', 'Members', 'Trainers', 'Health', 'Reports'],
    stats: { members: 320, classes: 45, trainers: 15, revenue: '₹4,50,000' },
    demoData: {
      title: 'Class Schedule',
      headers: ['Class', 'Instructor', 'Time', 'Duration', 'Capacity', 'Booked'],
      rows: [
        ['Morning Yoga', 'Priya S.', '06:00 AM', '60 min', '20', '18'],
        ['Zumba', 'Neha K.', '07:00 AM', '45 min', '25', '22'],
        ['Pilates', 'Anjali M.', '08:00 AM', '60 min', '15', '12'],
        ['HIIT', 'Rahul V.', '06:00 PM', '45 min', '20', '20'],
        ['Meditation', 'Priya S.', '07:00 PM', '30 min', '30', '15'],
      ]
    }
  },
  '19': {
    name: 'Laundry & Dry Cleaning',
    icon: '🧺',
    description: 'Order tracking, pricing, and delivery management',
    modules: ['Orders', 'Pricing', 'Customers', 'Delivery', 'Inventory', 'Reports'],
    stats: { orders: 89, customers: 345, revenue: '₹1,25,000', pending: 23 },
    demoData: {
      title: 'Active Orders',
      headers: ['Order ID', 'Customer', 'Items', 'Service', 'Amount', 'Status'],
      rows: [
        ['LD-001', 'Rahul Kumar', '5 Shirts, 2 Pants', 'Express', '₹450', 'Processing'],
        ['LD-002', 'Priya Singh', '3 Sarees', 'Dry Clean', '₹600', 'Ready'],
        ['LD-003', 'Amit Verma', '2 Suits', 'Premium', '₹800', 'Processing'],
        ['LD-004', 'Neha Gupta', '10 pcs Mixed', 'Regular', '₹350', 'Delivered'],
        ['LD-005', 'Vijay Sharma', '1 Blanket', 'Heavy', '₹250', 'Processing'],
      ]
    }
  },
  '20': {
    name: 'Home Services Platform',
    icon: '🔧',
    description: 'Service booking, provider management, and scheduling',
    modules: ['Services', 'Bookings', 'Providers', 'Schedule', 'Payments', 'Reports'],
    stats: { services: 45, providers: 120, bookings: 234, revenue: '₹5,50,000' },
    demoData: {
      title: 'Service Bookings',
      headers: ['Booking ID', 'Service', 'Customer', 'Provider', 'Schedule', 'Status'],
      rows: [
        ['HM-001', 'AC Repair', 'Ramesh K.', 'Sunil Tech', '21 Nov, 10AM', 'Confirmed'],
        ['HM-002', 'Plumbing', 'Priya S.', 'Fix Masters', '21 Nov, 2PM', 'In Progress'],
        ['HM-003', 'Electrical', 'Amit V.', 'Power Pro', '22 Nov, 11AM', 'Scheduled'],
        ['HM-004', 'Cleaning', 'Neha G.', 'Clean Home', '21 Nov, 9AM', 'Completed'],
        ['HM-005', 'Carpentry', 'Vijay M.', 'Wood Works', '23 Nov, 10AM', 'Scheduled'],
      ]
    }
  },
  '21': {
    name: 'Arts & Crafts Studio',
    icon: '🎨',
    description: 'Art classes, materials management, and student progress',
    modules: ['Classes', 'Students', 'Materials', 'Projects', 'Events', 'Reports'],
    stats: { students: 85, classes: 12, projects: 45, revenue: '₹2,50,000' },
    demoData: {
      title: 'Art Classes',
      headers: ['Class', 'Instructor', 'Level', 'Day', 'Time', 'Students'],
      rows: [
        ['Oil Painting', 'Mrs. Sharma', 'Advanced', 'Mon/Wed', '4-6 PM', '8'],
        ['Sketching', 'Mr. Kumar', 'Beginner', 'Tue/Thu', '5-6 PM', '12'],
        ['Pottery', 'Mrs. Patel', 'Intermediate', 'Sat', '10-12 AM', '6'],
        ['Watercolor', 'Mrs. Sharma', 'Beginner', 'Fri', '4-6 PM', '10'],
        ['Craft Making', 'Ms. Gupta', 'All Levels', 'Sun', '11-1 PM', '15'],
      ]
    }
  },
  '22': {
    name: 'Spa & Salon Management',
    icon: '💆',
    description: 'Appointment booking, services, and staff management',
    modules: ['Appointments', 'Services', 'Staff', 'Inventory', 'Packages', 'Reports'],
    stats: { appointments: 45, services: 35, staff: 12, revenue: '₹3,50,000' },
    demoData: {
      title: 'Today\'s Appointments',
      headers: ['Time', 'Client', 'Service', 'Staff', 'Duration', 'Amount'],
      rows: [
        ['10:00', 'Priya Sharma', 'Hair Spa', 'Neha', '90 min', '₹1,500'],
        ['10:30', 'Anjali Gupta', 'Facial', 'Ritu', '60 min', '₹800'],
        ['11:00', 'Sneha Patel', 'Manicure+Pedicure', 'Pooja', '75 min', '₹1,200'],
        ['12:00', 'Meera Singh', 'Hair Cut + Color', 'Amit', '120 min', '₹3,500'],
        ['02:00', 'Kavita Verma', 'Full Body Massage', 'Sunita', '90 min', '₹2,500'],
      ]
    }
  }
};

export default function BusinessPage() {
  const params = useParams();
  const id = params.id as string;
  const business = businessData[id];

  if (!business) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-4xl mb-4">❌</p>
            <h2 className="text-xl font-bold">Business Not Found</h2>
            <p className="text-muted-foreground mt-2">The requested business system does not exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{business.icon}</span>
            <div>
              <h1 className="text-2xl font-bold">{business.name}</h1>
              <p className="text-muted-foreground">{business.description}</p>
            </div>
          </div>
        </div>
        <Badge className="bg-green-600">Live System</Badge>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(business.stats).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{String(value)}</div>
              <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules */}
      <Card>
        <CardHeader>
          <CardTitle>System Modules</CardTitle>
          <CardDescription>Available features and modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {business.modules.map((module: string, idx: number) => (
              <Button key={idx} variant="outline" className="cursor-pointer">
                {module}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{business.demoData.title}</CardTitle>
              <CardDescription>Live demo data</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Search..." className="w-48" />
              <Button>Add New</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {business.demoData.headers.map((header: string, idx: number) => (
                    <TableHead key={idx}>{header}</TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {business.demoData.rows.map((row: string[], idx: number) => (
                  <TableRow key={idx}>
                    {row.map((cell: string, cellIdx: number) => (
                      <TableCell key={cellIdx}>
                        {cell.includes('Completed') || cell.includes('Active') || cell.includes('Paid') || cell.includes('Available') || cell.includes('Passed') || cell.includes('Delivered') ? (
                          <Badge className="bg-green-600">{cell}</Badge>
                        ) : cell.includes('Pending') || cell.includes('Processing') || cell.includes('Scheduled') || cell.includes('In Progress') || cell.includes('Planning') || cell.includes('Loading') ? (
                          <Badge variant="secondary">{cell}</Badge>
                        ) : cell.includes('Expired') || cell.includes('Maintenance') || cell.includes('Sold') ? (
                          <Badge variant="outline">{cell}</Badge>
                        ) : (
                          cell
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">View</Button>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">Generate Report</Button>
            <Button className="w-full" variant="outline">Export Data</Button>
            <Button className="w-full" variant="outline">View Analytics</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Frontend:</span><Badge>Next.js 14</Badge></div>
            <div className="flex justify-between"><span>Backend:</span><Badge>Node.js</Badge></div>
            <div className="flex justify-between"><span>Database:</span><Badge>PostgreSQL</Badge></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><div className="h-2 w-2 bg-green-500 rounded-full"></div> API Connected</div>
            <div className="flex items-center gap-2"><div className="h-2 w-2 bg-green-500 rounded-full"></div> Database Active</div>
            <div className="flex items-center gap-2"><div className="h-2 w-2 bg-green-500 rounded-full"></div> All Services Running</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
