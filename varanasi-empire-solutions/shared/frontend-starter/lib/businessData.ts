export const businessesFullData = {
  1: {
    name: 'Hotel & Hospitality Management System',
    icon: '🏨',
    category: 'Hospitality & Tourism',
    tagline: 'Complete Hotel Management Solution',
    description: 'Production-ready enterprise hotel management system for heritage hotels, budget hotels, resorts, guest houses, and hostels across Uttar Pradesh.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'For Large Multi-Property Hotels',
        price: 'Custom Pricing',
        features: [
          'Multi-property PMS (unlimited properties)',
          'Centralized inventory & revenue management',
          'Advanced channel manager (30+ OTA integrations)',
          'AI-based dynamic pricing engine',
          'Guest behavior analytics & prediction',
          'Loyalty program management',
          'Staff performance analytics',
          'Custom mobile app (iOS + Android)',
          'Integration: POS, Spa, F&B, Events',
          'Blockchain-based booking ledger (transparency)'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'For Single/Dual Property Hotels',
        price: '₹50,000/year',
        features: [
          'Single property PMS',
          'Channel manager (10 OTAs)',
          'Basic revenue management',
          'Guest database & communications',
          'Standard reports',
          'Web booking engine',
          'Staff management'
        ]
      }
    },

    upSpecificFeatures: [
      'Festival pricing automation (Diwali, Holi, Kumbh Mela, etc.)',
      'Temple proximity marketing (Varanasi, Mathura, Ayodhya)',
      'Pilgrim group booking management',
      'Multilingual (Hindi, English, Bhojpuri, Awadhi)',
      'Integration with UP Tourism portal'
    ],

    realWorldExample: {
      name: 'Brijrama Palace, Varanasi',
      tier: 'Enterprise',
      stats: {
        rooms: 15,
        otaChannels: 8,
        directBookings: '72% (increased from 45%)',
        occupancy: '87% (vs 65% industry average)',
        savings: '₹18 lakhs annually in commissions'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript', 'Tailwind CSS'],
      backend: ['Node.js 20', 'Express.js', 'GraphQL', 'REST APIs'],
      database: ['PostgreSQL 15', 'Redis 7', 'MongoDB'],
      infrastructure: ['Docker', 'Kubernetes', 'Nginx', 'AWS/Azure']
    },

    integrations: [
      'Razorpay, PhonePe, Paytm, UPI',
      'WhatsApp Business API',
      'OTA Channels (MakeMyTrip, Goibibo, Booking.com)',
      'Google Maps API',
      'SMS Gateway (MSG91)'
    ],

    modules: [
      { name: 'Rooms Management', description: 'Complete room inventory, types, rates' },
      { name: 'Bookings', description: 'Online & offline booking management' },
      { name: 'Guest Management', description: 'Guest profiles, preferences, history' },
      { name: 'Housekeeping', description: 'Room cleaning, maintenance schedules' },
      { name: 'Billing', description: 'Invoicing, payments, GST compliance' },
      { name: 'Reports', description: 'Revenue, occupancy, performance analytics' }
    ],

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
        ['302', 'Standard', '3rd', 'Occupied', '₹2,000', 'Neha Gupta']
      ]
    },

    stats: {
      rooms: '150',
      bookings: '89',
      guests: '234',
      revenue: '₹12,45,000'
    }
  },

  2: {
    name: 'Temple Management System',
    icon: '🛕',
    category: 'Hospitality & Tourism',
    tagline: 'Sacred Space Management',
    description: 'Comprehensive temple operations management including donations, events, devotee records, and pooja bookings for temples across Uttar Pradesh.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'For Large Temple Complexes',
        price: 'Custom Pricing',
        features: [
          'Multi-temple complex management',
          'Advanced donation tracking with tax receipts',
          'Event & festival management system',
          'Devotee database with occasion reminders',
          'Online pooja booking portal',
          'Inventory management (Prasad, items)',
          'Priest scheduling & payments',
          'Integration with payment gateways',
          'Custom mobile app for devotees',
          'Blockchain-based donation ledger'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'For Single Temples',
        price: '₹30,000/year',
        features: [
          'Donation management',
          'Basic event calendar',
          'Devotee database',
          'Pooja booking system',
          'Standard receipts',
          'Basic reports'
        ]
      }
    },

    upSpecificFeatures: [
      'Integration with major UP temples (Kashi Vishwanath, Mathura, Ayodhya)',
      'Festival calendar (UP specific dates)',
      'Support for traditional donation items (gold, silver, land)',
      'Multilingual receipts (Hindi, Sanskrit, English)',
      'Temple board meeting management'
    ],

    realWorldExample: {
      name: 'Major Temple Complex, Varanasi',
      tier: 'Enterprise',
      stats: {
        donations: '₹8,50,000/month',
        events: '24/month',
        devotees: '5,420 registered',
        poojas: '156/month'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript', 'Tailwind CSS'],
      backend: ['Node.js 20', 'Express.js', 'PostgreSQL 15'],
      database: ['PostgreSQL 15', 'Redis 7'],
      infrastructure: ['Docker', 'Kubernetes', 'AWS/Azure']
    },

    integrations: [
      'UPI, Razorpay, Paytm',
      'WhatsApp notifications',
      'SMS alerts',
      'Email receipts',
      'Digital signature for receipts'
    ],

    modules: [
      { name: 'Donations', description: 'Track all types of donations with receipts' },
      { name: 'Events', description: 'Festival and event management' },
      { name: 'Devotees', description: 'Devotee database and communication' },
      { name: 'Pooja Booking', description: 'Online and offline pooja reservations' },
      { name: 'Inventory', description: 'Prasad, oil, flowers, other items' },
      { name: 'Reports', description: 'Financial and operational reports' }
    ],

    demoData: {
      title: 'Recent Donations',
      headers: ['Date', 'Devotee', 'Amount', 'Purpose', 'Receipt No', 'Mode'],
      rows: [
        ['21/11/2024', 'Ramesh Agarwal', '₹51,000', 'Temple Renovation', 'RCP-001', 'UPI'],
        ['21/11/2024', 'Sunita Devi', '₹11,000', 'Annadaan', 'RCP-002', 'Cash'],
        ['20/11/2024', 'Mohan Lal', '₹5,100', 'General', 'RCP-003', 'Card'],
        ['20/11/2024', 'Geeta Sharma', '₹21,000', 'Festival Fund', 'RCP-004', 'UPI'],
        ['19/11/2024', 'Vijay Kumar', '₹1,100', 'Pooja', 'RCP-005', 'Cash'],
        ['19/11/2024', 'Lakshmi Trust', '₹1,00,000', 'Gold Donation', 'RCP-006', 'Cheque']
      ]
    },

    stats: {
      donations: '₹8,50,000',
      events: '24',
      devotees: '5420',
      poojas: '156'
    }
  },

  // Add more businesses...
  3: {
    name: 'Restaurant POS Management',
    icon: '🍽️',
    category: 'Food & Beverage',
    tagline: 'Complete Restaurant Management',
    description: 'Modern POS system for fine dining, QSR, cloud kitchens, sweet shops, bakeries, and catering businesses.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Multi-Location Restaurant Chains',
        price: 'Custom Pricing',
        features: [
          'Multi-location POS with real-time sync',
          'Central kitchen management',
          'Recipe costing & profitability analysis',
          'Franchise management module',
          'AI-based inventory prediction',
          'Customer behavior analytics',
          'Delivery fleet management',
          'Integration with Zomato/Swiggy APIs',
          'Own delivery app (0% commission)',
          'Table reservation with AI optimization',
          'Kitchen Display System (KDS)',
          'Supplier portal with automated ordering'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Single Location Restaurants',
        price: '₹40,000/year',
        features: [
          'Single location POS',
          'Basic inventory management',
          'Table management',
          'Kitchen order tickets (KOT)',
          'Online ordering website',
          'Standard reports'
        ]
      }
    },

    upSpecificFeatures: [
      'UP FSSAI integration & compliance',
      'Halal/Jain food categorization',
      'Festival menu management (Ramadan, Navratri)',
      'Traditional UP cuisine recipes database',
      'Awadhi/Mughlai specialty tracking',
      'Integration with local dairy suppliers (Mathura, Agra)'
    ],

    realWorldExample: {
      name: 'Tunday Kababi, Lucknow',
      tier: 'Enterprise',
      stats: {
        locations: '6 across Lucknow',
        orders: '1,200+ daily',
        savings: '₹8 lakhs/month (direct delivery)',
        wastage: 'Reduced from 18% to 4%'
      }
    },

    modules: [
      { name: 'Orders', description: 'Dine-in, takeaway, delivery order management' },
      { name: 'Menu', description: 'Digital menu with recipes and pricing' },
      { name: 'Tables', description: 'Table booking and management' },
      { name: 'Kitchen', description: 'Kitchen display and order routing' },
      { name: 'Inventory', description: 'Stock management with wastage tracking' },
      { name: 'Billing', description: 'GST invoicing and payments' }
    ],

    demoData: {
      title: 'Active Orders',
      headers: ['Order #', 'Table', 'Items', 'Amount', 'Status', 'Time'],
      rows: [
        ['ORD-101', 'Table 5', 'Paneer Tikka, Dal Makhani, Naan x2', '₹850', 'Preparing', '12:30'],
        ['ORD-102', 'Table 8', 'Biryani, Raita, Cold Drink', '₹450', 'Ready', '12:25'],
        ['ORD-103', 'Table 2', 'Thali Special, Lassi', '₹350', 'Served', '12:15'],
        ['ORD-104', 'Table 12', 'Pizza, Pasta, Garlic Bread', '₹780', 'Preparing', '12:35'],
        ['ORD-105', 'Takeaway', 'Burger x2, Fries, Coke', '₹520', 'Packed', '12:40'],
        ['ORD-106', 'Table 6', 'Chinese Combo, Manchurian', '₹620', 'Preparing', '12:38']
      ]
    },

    stats: {
      orders: '145',
      tables: '25',
      items: '89',
      revenue: '₹78,500'
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js', 'Express', 'PostgreSQL'],
      database: ['PostgreSQL 15', 'Redis 7'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Zomato, Swiggy API integration',
      'Payment gateways (UPI, Cards)',
      'WhatsApp order notifications',
      'SMS for table ready alerts'
    ]
  }

  ,
  4: {
    name: 'Travel & Tour Agency Management',
    icon: '✈️',
    category: 'Hospitality & Tourism',
    tagline: 'Complete Travel Agency Solution',
    description: 'End-to-end travel agency management for tour operators, pilgrimage travel, corporate travel, and adventure tourism across Uttar Pradesh.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Multi-Branch Travel Agencies',
        price: 'Custom Pricing',
        features: [
          'Multi-branch operations management',
          'B2B portal for agents & franchisees',
          'Integrated flight/train/bus booking APIs',
          'Dynamic package builder with pricing engine',
          'Visa & passport tracking system',
          'Automated itinerary generation',
          'Multi-currency support',
          'Agent commission management',
          'Customer mobile app (iOS + Android)',
          'Integration with IRCTC, airline GDS systems'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Single Location Travel Agency',
        price: '₹35,000/year',
        features: [
          'Package management',
          'Customer database',
          'Booking management',
          'Basic itinerary builder',
          'Vendor management',
          'Standard reports'
        ]
      }
    },

    upSpecificFeatures: [
      'Kumbh Mela pilgrimage packages (Prayagraj)',
      'Varanasi spiritual tourism templates',
      'Mathura-Vrindavan-Ayodhya circuit builder',
      'UP Tourism board integration',
      'Heritage tour templates (Agra, Lucknow)',
      'Festival tourism packages (Dev Deepawali, etc.)'
    ],

    realWorldExample: {
      name: 'Ganga Travels, Varanasi',
      tier: 'Enterprise',
      stats: {
        branches: '4 across UP',
        packages: '120+ active',
        customers: '8,500+/year',
        savings: '₹12 lakhs (reduced manual work)'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript', 'Tailwind CSS'],
      backend: ['Node.js 20', 'Express.js', 'GraphQL'],
      database: ['PostgreSQL 15', 'Redis 7', 'MongoDB'],
      infrastructure: ['Docker', 'Kubernetes', 'AWS/Azure']
    },

    integrations: [
      'IRCTC API for train bookings',
      'Flight GDS (Amadeus/Galileo)',
      'Payment gateways (UPI, Cards)',
      'WhatsApp Business for itineraries',
      'Google Maps API'
    ],

    modules: [
      { name: 'Packages', description: 'Tour package creation and management' },
      { name: 'Bookings', description: 'Customer booking and reservations' },
      { name: 'Customers', description: 'Customer database and history' },
      { name: 'Vendors', description: 'Hotel, transport vendor management' },
      { name: 'Payments', description: 'Payment tracking and invoicing' },
      { name: 'Reports', description: 'Sales and performance analytics' }
    ],

    demoData: {
      title: 'Tour Packages',
      headers: ['Package', 'Destination', 'Duration', 'Price', 'Bookings', 'Rating'],
      rows: [
        ['Varanasi Heritage', 'Varanasi', '3D/2N', '₹12,500', '45', '4.8⭐'],
        ['Rajasthan Royal', 'Jaipur-Udaipur', '5D/4N', '₹28,000', '32', '4.9⭐'],
        ['Kerala Backwaters', 'Kerala', '4D/3N', '₹22,000', '28', '4.7⭐'],
        ['Himalayan Adventure', 'Manali', '6D/5N', '₹35,000', '18', '4.6⭐'],
        ['Goa Beach Holiday', 'Goa', '4D/3N', '₹18,500', '56', '4.5⭐'],
        ['Golden Triangle', 'Delhi-Agra-Jaipur', '5D/4N', '₹24,000', '42', '4.8⭐']
      ]
    },

    stats: {
      packages: '45',
      bookings: '78',
      customers: '234',
      revenue: '₹25,00,000'
    }
  },

  5: {
    name: 'Hospital Management System',
    icon: '🏥',
    category: 'Healthcare',
    tagline: 'Complete Healthcare Solution',
    description: 'Full-featured hospital management system for multi-specialty hospitals, clinics, diagnostic centers, and nursing homes.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Multi-Specialty Hospitals',
        price: 'Custom Pricing',
        features: [
          'Multi-location hospital network',
          'Complete EMR/EHR system',
          'OPD & IPD management',
          'Advanced laboratory & radiology integration',
          'Operation theater scheduling',
          'Pharmacy & inventory management',
          'Insurance & TPA integration',
          'Doctor mobile app',
          'Patient portal & mobile app',
          'NABH compliance ready'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Single Clinic/Hospital',
        price: '₹60,000/year',
        features: [
          'Patient registration',
          'Appointment management',
          'Basic EMR',
          'Pharmacy integration',
          'Lab management',
          'Billing & reports'
        ]
      }
    },

    upSpecificFeatures: [
      'Ayush system integration (Ayurvedic hospitals)',
      'UP Health Department reporting',
      'Ayushman Bharat integration',
      'Local insurance (SGPGI, KGMU) support',
      'Hindi language medical records',
      'Government scheme tracking'
    ],

    realWorldExample: {
      name: 'City Hospital, Lucknow',
      tier: 'Enterprise',
      stats: {
        beds: '250 beds',
        patients: '12,000+/month',
        departments: '18 specialties',
        savings: '₹45 lakhs/year (paperwork reduction)'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js', 'PostgreSQL'],
      database: ['PostgreSQL 15', 'Redis 7'],
      infrastructure: ['Docker', 'Kubernetes', 'AWS']
    },

    integrations: [
      'Laboratory equipment interfaces',
      'Radiology PACS integration',
      'Insurance TPA APIs',
      'Payment gateways',
      'SMS & WhatsApp notifications'
    ],

    modules: [
      { name: 'Patients', description: 'Patient registration and EMR' },
      { name: 'Appointments', description: 'Doctor appointment scheduling' },
      { name: 'Doctors', description: 'Doctor profiles and schedules' },
      { name: 'Pharmacy', description: 'In-house pharmacy management' },
      { name: 'Lab', description: 'Laboratory test management' },
      { name: 'Billing', description: 'Patient billing and insurance claims' }
    ],

    demoData: {
      title: 'Today\'s Appointments',
      headers: ['Time', 'Patient', 'Doctor', 'Department', 'Type', 'Status'],
      rows: [
        ['09:00', 'Ramesh Kumar', 'Dr. Sharma', 'Cardiology', 'Follow-up', 'Completed'],
        ['09:30', 'Priya Singh', 'Dr. Gupta', 'Gynecology', 'Consultation', 'In Progress'],
        ['10:00', 'Amit Verma', 'Dr. Patel', 'Orthopedics', 'New', 'Waiting'],
        ['10:30', 'Sunita Devi', 'Dr. Khan', 'General', 'Follow-up', 'Scheduled'],
        ['11:00', 'Vijay Malhotra', 'Dr. Sharma', 'Cardiology', 'Emergency', 'Scheduled'],
        ['11:30', 'Neha Agarwal', 'Dr. Reddy', 'Pediatrics', 'Vaccination', 'Scheduled']
      ]
    },

    stats: {
      patients: '1250',
      appointments: '89',
      doctors: '35',
      beds: '200'
    }
  },

  6: {
    name: 'Real Estate Management System',
    icon: '🏠',
    category: 'Professional Services',
    tagline: 'Complete Real Estate Solution',
    description: 'Property listing, lead management, transaction tracking, and customer relationship management for real estate brokers and builders.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Real Estate Developers & Large Brokerages',
        price: 'Custom Pricing',
        features: [
          'Multi-project management',
          'Lead tracking & CRM with AI scoring',
          'Property portal integration (99acres, MagicBricks)',
          'Virtual property tours (360° images)',
          'Document management & e-signing',
          'Payment milestone tracking',
          'Channel partner portal',
          'Customer mobile app',
          'RERA compliance module',
          'WhatsApp campaign automation'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Individual Brokers',
        price: '₹25,000/year',
        features: [
          'Property listings',
          'Lead management',
          'Client database',
          'Basic CRM',
          'Document storage',
          'Standard reports'
        ]
      }
    },

    upSpecificFeatures: [
      'UP RERA integration',
      'Gomti Nagar, Hazratganj locality templates',
      'Property tax calculator (UP rates)',
      'Hindi property descriptions',
      'Local registry office integration',
      'Traditional measurement units (Bigha, Katha)'
    ],

    realWorldExample: {
      name: 'Prime Properties, Lucknow',
      tier: 'Enterprise',
      stats: {
        properties: '450+ active',
        leads: '2,500+/month',
        closures: '18-25/month',
        revenue: '₹8.5 Cr/year'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'MongoDB'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Property portals (99acres, MagicBricks)',
      'Payment gateways',
      'WhatsApp Business API',
      'Google Maps',
      'E-signature tools'
    ],

    modules: [
      { name: 'Properties', description: 'Property listing and details' },
      { name: 'Leads', description: 'Lead capture and nurturing' },
      { name: 'Clients', description: 'Client database and history' },
      { name: 'Transactions', description: 'Deal tracking and closure' },
      { name: 'Documents', description: 'Document management' },
      { name: 'Reports', description: 'Sales and performance reports' }
    ],

    demoData: {
      title: 'Property Listings',
      headers: ['Property', 'Type', 'Location', 'Price', 'Status', 'Agent'],
      rows: [
        ['Green Villa', '3BHK Villa', 'Gomti Nagar', '₹1.2 Cr', 'Available', 'Rahul S.'],
        ['Sky Heights', '2BHK Flat', 'Hazratganj', '₹65 Lac', 'Under Offer', 'Priya M.'],
        ['Lake View', '4BHK Villa', 'Indira Nagar', '₹2.5 Cr', 'Available', 'Amit K.'],
        ['City Center', 'Commercial', 'Chowk', '₹3.8 Cr', 'Sold', 'Rahul S.'],
        ['Garden Estate', '3BHK Flat', 'Aliganj', '₹78 Lac', 'Available', 'Neha G.'],
        ['Royal Residency', 'Penthouse', 'Gomti Nagar', '₹4.2 Cr', 'Available', 'Amit K.']
      ]
    },

    stats: {
      properties: '156',
      leads: '89',
      clients: '234',
      deals: '23'
    }
  },

  7: {
    name: 'Pharmacy Management System',
    icon: '💊',
    category: 'Healthcare',
    tagline: 'Complete Pharmacy Solution',
    description: 'Medicine inventory, prescription management, sales tracking, and expiry management for retail pharmacies and hospital pharmacies.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Pharmacy Chains',
        price: 'Custom Pricing',
        features: [
          'Multi-store inventory sync',
          'Central procurement system',
          'Integration with distributors (Apollo, Medplus)',
          'Prescription image capture & OCR',
          'Automated expiry alerts',
          'Loyalty program integration',
          'Insurance claim processing',
          'Mobile app for home delivery',
          'AI-based stock prediction',
          'Drug interaction alerts'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Single Pharmacy',
        price: '₹20,000/year',
        features: [
          'Medicine inventory',
          'Sales billing',
          'Purchase management',
          'Prescription tracking',
          'Expiry management',
          'Basic reports'
        ]
      }
    },

    upSpecificFeatures: [
      'UP Drug License integration',
      'Local distributor network (Varanasi, Lucknow)',
      'Ayurvedic medicine support',
      'Government scheme medicines (Ayushman)',
      'Hindi medicine names',
      'Jan Aushadhi integration'
    ],

    realWorldExample: {
      name: 'HealthCare Pharmacy, Lucknow',
      tier: 'Standard',
      stats: {
        medicines: '3,500+ SKUs',
        sales: '₹18 lakhs/month',
        expiry: 'Reduced wastage by 65%',
        accuracy: '99.8% billing accuracy'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'Redis 7'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Distributor APIs',
      'Insurance TPAs',
      'Payment gateways',
      'SMS notifications',
      'Barcode scanners'
    ],

    modules: [
      { name: 'Inventory', description: 'Medicine stock management' },
      { name: 'Sales', description: 'Billing and invoicing' },
      { name: 'Purchases', description: 'Supplier orders and payments' },
      { name: 'Prescriptions', description: 'Prescription tracking' },
      { name: 'Expiry', description: 'Expiry alerts and returns' },
      { name: 'Reports', description: 'Sales and inventory reports' }
    ],

    demoData: {
      title: 'Medicine Inventory',
      headers: ['Medicine', 'Category', 'Stock', 'MRP', 'Expiry', 'Supplier'],
      rows: [
        ['Paracetamol 500mg', 'Analgesic', '500', '₹25', 'Dec 2025', 'Sun Pharma'],
        ['Amoxicillin 250mg', 'Antibiotic', '200', '₹85', 'Mar 2025', 'Cipla'],
        ['Omeprazole 20mg', 'Antacid', '350', '₹120', 'Jun 2025', 'Dr Reddy'],
        ['Metformin 500mg', 'Diabetes', '450', '₹45', 'Sep 2025', 'Lupin'],
        ['Cetirizine 10mg', 'Antiallergy', '600', '₹35', 'Aug 2025', 'Sun Pharma'],
        ['Azithromycin 500mg', 'Antibiotic', '150', '₹180', 'Feb 2025', 'Cipla']
      ]
    },

    stats: {
      medicines: '2450',
      sales: '₹1,25,000',
      prescriptions: '156',
      expiring: '23'
    }
  },

  8: {
    name: 'Jewellery Store Management',
    icon: '💎',
    category: 'Retail',
    tagline: 'Gold & Jewellery ERP',
    description: 'Comprehensive jewellery store management with gold rate tracking, custom orders, hallmarking, and customer database.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Jewellery Showroom Chains',
        price: 'Custom Pricing',
        features: [
          'Multi-store inventory sync',
          'Live gold/silver rate integration',
          'Custom order tracking with CAD',
          'Hallmarking compliance (BIS)',
          'Old gold exchange calculator',
          'Customer loyalty & schemes',
          'Workshop management',
          'Karatmeter integration',
          'Video KYC for high-value sales',
          'WhatsApp catalog sharing'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Single Jewellery Store',
        price: '₹40,000/year',
        features: [
          'Jewellery inventory',
          'Sales & billing',
          'Gold rate updates',
          'Customer database',
          'Custom orders',
          'Standard reports'
        ]
      }
    },

    upSpecificFeatures: [
      'Varanasi traditional designs library',
      'Festival schemes (Dhanteras, Akshaya Tritiya)',
      'Local goldsmith network integration',
      'Hindi invoices with regional terms',
      'Temple jewellery collection templates',
      'Bridal jewellery package builder'
    ],

    realWorldExample: {
      name: 'Shri Jewellers, Varanasi',
      tier: 'Enterprise',
      stats: {
        inventory: '₹12 Cr worth',
        transactions: '450+/month',
        customOrders: '80+/month',
        customers: '8,500+ registered'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'MongoDB'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Live gold rate APIs',
      'Payment gateways',
      'WhatsApp Business',
      'Digital hallmarking system',
      'CAD software for designs'
    ],

    modules: [
      { name: 'Inventory', description: 'Jewellery stock with images' },
      { name: 'Sales', description: 'Billing with making charges' },
      { name: 'Custom Orders', description: 'Order design to delivery' },
      { name: 'Gold Rate', description: 'Live rate and history' },
      { name: 'Customers', description: 'Customer schemes and history' },
      { name: 'Reports', description: 'Stock and sales analytics' }
    ],

    demoData: {
      title: 'Jewellery Inventory',
      headers: ['Item', 'Category', 'Weight', 'Purity', 'Making', 'Price'],
      rows: [
        ['Necklace Set', 'Gold', '45g', '22K', '₹12,000', '₹2,85,000'],
        ['Diamond Ring', 'Diamond', '8g', '18K', '₹8,500', '₹1,25,000'],
        ['Bangles (4)', 'Gold', '32g', '22K', '₹6,400', '₹2,08,000'],
        ['Earrings', 'Gold', '12g', '22K', '₹3,600', '₹81,600'],
        ['Chain', 'Gold', '25g', '22K', '₹5,000', '₹1,62,500'],
        ['Pendant', 'Diamond', '5g', '18K', '₹4,500', '₹65,000']
      ]
    },

    stats: {
      items: '850',
      sales: '₹45,00,000',
      orders: '34',
      customers: '456'
    }
  },

  9: {
    name: 'Saree & Textile Store Management',
    icon: '👗',
    category: 'Retail',
    tagline: 'Textile Retail Solution',
    description: 'Complete textile and saree store management with inventory, alterations, customer loyalty, and supplier management.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Multi-Store Textile Chains',
        price: 'Custom Pricing',
        features: [
          'Multi-store inventory sync',
          'Catalogue management with images',
          'Alteration tracking system',
          'Customer wish-list & preferences',
          'Supplier portal with automated ordering',
          'Seasonal collection planning',
          'Festival campaign automation',
          'Loyalty & wedding card program',
          'Mobile app for catalog browsing',
          'WhatsApp catalog integration'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Single Textile Store',
        price: '₹22,000/year',
        features: [
          'Inventory management',
          'Sales billing',
          'Alteration records',
          'Customer database',
          'Supplier management',
          'Basic reports'
        ]
      }
    },

    upSpecificFeatures: [
      'Banarasi saree collection templates',
      'Chikankari work inventory tracking',
      'Wedding season demand forecasting',
      'Regional design library (Lucknow, Varanasi)',
      'Festival collection planning (Diwali, etc.)',
      'Hindi product descriptions'
    ],

    realWorldExample: {
      name: 'Silk Emporium, Varanasi',
      tier: 'Enterprise',
      stats: {
        inventory: '15,000+ pieces',
        customers: '3,500+ registered',
        alterations: '250+/month',
        revenue: '₹45 lakhs/month'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'MongoDB'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Payment gateways',
      'WhatsApp Business',
      'SMS notifications',
      'Barcode system',
      'Cloud storage for images'
    ],

    modules: [
      { name: 'Inventory', description: 'Textile and saree stock' },
      { name: 'Sales', description: 'Billing and invoicing' },
      { name: 'Alterations', description: 'Alteration job tracking' },
      { name: 'Customers', description: 'Customer loyalty and history' },
      { name: 'Suppliers', description: 'Supplier orders and payments' },
      { name: 'Reports', description: 'Sales and inventory analytics' }
    ],

    demoData: {
      title: 'Saree Collection',
      headers: ['Item', 'Type', 'Material', 'Color', 'Price', 'Stock'],
      rows: [
        ['Banarasi Silk', 'Wedding', 'Pure Silk', 'Red/Gold', '₹25,000', '15'],
        ['Kanjivaram', 'Bridal', 'Silk', 'Maroon', '₹35,000', '8'],
        ['Chanderi', 'Casual', 'Cotton Silk', 'Blue', '₹4,500', '25'],
        ['Bandhani', 'Festive', 'Georgette', 'Multi', '₹3,800', '30'],
        ['Tussar Silk', 'Party', 'Silk', 'Beige', '₹8,500', '12'],
        ['Chiffon Print', 'Daily', 'Chiffon', 'Various', '₹1,200', '50']
      ]
    },

    stats: {
      sarees: '1200',
      sales: '₹8,50,000',
      alterations: '45',
      customers: '567'
    }
  },

  10: {
    name: 'Educational Institute Management',
    icon: '🎓',
    category: 'Education',
    tagline: 'Complete Education ERP',
    description: 'Comprehensive institute management with student records, attendance, fees, examinations, and online learning.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Universities & Large Institutes',
        price: 'Custom Pricing',
        features: [
          'Multi-campus management',
          'Complete LMS (Learning Management System)',
          'Online examination & proctoring',
          'Student & parent mobile apps',
          'Alumni management portal',
          'Placement cell automation',
          'Hostel & transport management',
          'Library management system',
          'Research paper repository',
          'Video lectures & e-content delivery'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Coaching Centers & Small Institutes',
        price: '₹35,000/year',
        features: [
          'Student management',
          'Attendance tracking',
          'Fee collection',
          'Exam management',
          'Teacher records',
          'Basic reports'
        ]
      }
    },

    upSpecificFeatures: [
      'UP Board exam pattern integration',
      'CBSE/ICSE/IB board support',
      'Integration with UP education portals',
      'Hindi medium support',
      'Scholarship tracking (UP govt schemes)',
      'Local university affiliation tracking'
    ],

    realWorldExample: {
      name: 'Lucknow Academy',
      tier: 'Enterprise',
      stats: {
        students: '2,500+ enrolled',
        teachers: '120 faculty',
        courses: '45 programs',
        feeCollection: '₹8 Cr/year'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js', 'GraphQL'],
      database: ['PostgreSQL 15', 'MongoDB'],
      infrastructure: ['Docker', 'Kubernetes', 'AWS']
    },

    integrations: [
      'Payment gateways',
      'SMS & WhatsApp notifications',
      'Google Classroom',
      'Zoom/MS Teams',
      'Biometric attendance'
    ],

    modules: [
      { name: 'Students', description: 'Student admissions and records' },
      { name: 'Attendance', description: 'Daily attendance tracking' },
      { name: 'Fees', description: 'Fee collection and receipts' },
      { name: 'Exams', description: 'Examination and results' },
      { name: 'Teachers', description: 'Faculty management' },
      { name: 'Reports', description: 'Academic and financial reports' }
    ],

    demoData: {
      title: 'Student Records',
      headers: ['Roll No', 'Name', 'Class', 'Section', 'Fees Status', 'Attendance'],
      rows: [
        ['2024001', 'Aarav Sharma', 'X', 'A', 'Paid', '92%'],
        ['2024002', 'Diya Gupta', 'X', 'A', 'Paid', '95%'],
        ['2024003', 'Arjun Singh', 'X', 'B', 'Pending', '88%'],
        ['2024004', 'Ananya Patel', 'IX', 'A', 'Paid', '90%'],
        ['2024005', 'Vihaan Kumar', 'IX', 'B', 'Partial', '85%'],
        ['2024006', 'Ishita Verma', 'VIII', 'A', 'Paid', '94%']
      ]
    },

    stats: {
      students: '850',
      teachers: '45',
      courses: '24',
      revenue: '₹35,00,000'
    }
  },

  11: {
    name: 'Event & Wedding Planning',
    icon: '💒',
    category: 'Professional Services',
    tagline: 'Complete Event Management',
    description: 'Full-featured event planning with vendor management, bookings, budgeting, and task automation for weddings and corporate events.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Large Event Companies',
        price: 'Custom Pricing',
        features: [
          'Multi-event concurrent management',
          'Vendor marketplace integration',
          'Client mobile app with live updates',
          'Budget tracking with AI predictions',
          'Digital invitation & RSVP system',
          'Event website builder',
          'Live event dashboard',
          'Photography & video delivery portal',
          'Multi-currency & international events',
          'WhatsApp integration for vendors'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Individual Event Planners',
        price: '₹28,000/year',
        features: [
          'Event management',
          'Vendor database',
          'Client bookings',
          'Budget tracking',
          'Task lists',
          'Basic reports'
        ]
      }
    },

    upSpecificFeatures: [
      'UP wedding tradition templates',
      'Local vendor network (caterers, decorators)',
      'Temple/venue booking integration',
      'Baarat route planning',
      'Traditional ceremony checklists',
      'Hindi invitation templates'
    ],

    realWorldExample: {
      name: 'Dream Events, Lucknow',
      tier: 'Enterprise',
      stats: {
        events: '150+/year',
        vendors: '350+ network',
        avgBudget: '₹18 lakhs/event',
        clientSatisfaction: '4.9/5.0'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'MongoDB'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Payment gateways',
      'WhatsApp Business',
      'Google Calendar',
      'Cloud storage',
      'Email marketing'
    ],

    modules: [
      { name: 'Events', description: 'Event planning and timeline' },
      { name: 'Vendors', description: 'Vendor contracts and payments' },
      { name: 'Bookings', description: 'Client bookings and deposits' },
      { name: 'Budget', description: 'Budget planning and tracking' },
      { name: 'Tasks', description: 'Task checklists and assignments' },
      { name: 'Reports', description: 'Financial and event reports' }
    ],

    demoData: {
      title: 'Upcoming Events',
      headers: ['Event', 'Client', 'Date', 'Venue', 'Budget', 'Status'],
      rows: [
        ['Sharma Wedding', 'Rajesh Sharma', '25 Dec 2024', 'Grand Palace', '₹25,00,000', 'Confirmed'],
        ['Corporate Meet', 'TCS Ltd', '15 Dec 2024', 'Hotel Taj', '₹8,00,000', 'Planning'],
        ['Birthday Party', 'Priya Gupta', '10 Dec 2024', 'Farm House', '₹2,50,000', 'Confirmed'],
        ['Anniversary', 'Kumar Family', '20 Dec 2024', 'Club Resort', '₹5,00,000', 'Confirmed'],
        ['Product Launch', 'Startup Inc', '18 Dec 2024', 'Convention Center', '₹12,00,000', 'Planning']
      ]
    },

    stats: {
      events: '45',
      vendors: '120',
      bookings: '28',
      revenue: '₹85,00,000'
    }
  },

  12: {
    name: 'Gym & Fitness Center Management',
    icon: '🏋️',
    category: 'Health & Fitness',
    tagline: 'Complete Gym Management',
    description: 'Membership management, trainer scheduling, class bookings, equipment tracking, and payment automation for gyms and fitness centers.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Fitness Center Chains',
        price: 'Custom Pricing',
        features: [
          'Multi-location membership sync',
          'Member mobile app with workout plans',
          'Trainer app with client tracking',
          'Biometric access control integration',
          'Nutrition & diet planning module',
          'PT session scheduling & payments',
          'Class booking with waitlists',
          'Equipment maintenance tracking',
          'Body composition analysis integration',
          'WhatsApp workout reminders'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Single Gym',
        price: '₹18,000/year',
        features: [
          'Member management',
          'Trainer schedules',
          'Class bookings',
          'Payment tracking',
          'Equipment log',
          'Basic reports'
        ]
      }
    },

    upSpecificFeatures: [
      'Local fitness challenges (UP Marathon prep)',
      'Festival membership offers',
      'Yoga & traditional fitness integration',
      'Hindi workout instructions',
      'Local trainer network',
      'Diet plans for Indian cuisine'
    ],

    realWorldExample: {
      name: 'PowerFit Gym, Lucknow',
      tier: 'Standard',
      stats: {
        members: '650 active',
        trainers: '15 certified',
        classes: '40+/week',
        revenue: '₹12 lakhs/month'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'Redis 7'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Payment gateways',
      'Biometric systems',
      'WhatsApp notifications',
      'SMS reminders',
      'Body analyzer devices'
    ],

    modules: [
      { name: 'Members', description: 'Membership and renewals' },
      { name: 'Trainers', description: 'Trainer profiles and schedules' },
      { name: 'Classes', description: 'Group class management' },
      { name: 'Equipment', description: 'Equipment tracking and maintenance' },
      { name: 'Payments', description: 'Fee collection and renewals' },
      { name: 'Reports', description: 'Attendance and revenue reports' }
    ],

    demoData: {
      title: 'Member Directory',
      headers: ['ID', 'Name', 'Plan', 'Trainer', 'Start Date', 'Status'],
      rows: [
        ['GYM001', 'Rahul Verma', 'Premium', 'Amit K.', '01 Oct 2024', 'Active'],
        ['GYM002', 'Priya Singh', 'Basic', 'Neha S.', '15 Sep 2024', 'Active'],
        ['GYM003', 'Amit Sharma', 'Premium', 'Raj P.', '01 Nov 2024', 'Active'],
        ['GYM004', 'Sneha Gupta', 'Gold', 'Neha S.', '20 Oct 2024', 'Active'],
        ['GYM005', 'Vikram Malhotra', 'Basic', 'Amit K.', '05 Nov 2024', 'Active'],
        ['GYM006', 'Anjali Patel', 'Gold', 'Raj P.', '10 Sep 2024', 'Expired']
      ]
    },

    stats: {
      members: '450',
      trainers: '12',
      classes: '25',
      revenue: '₹6,50,000'
    }
  },

  13: {
    name: 'Professional Services Hub',
    icon: '💼',
    category: 'Professional Services',
    tagline: 'Complete Business Services Management',
    description: 'Project management, client tracking, time billing, and invoicing for consultancies, IT services, and professional firms.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Large Consultancies',
        price: 'Custom Pricing',
        features: [
          'Multi-team project management',
          'Resource allocation & capacity planning',
          'Time tracking with screenshots',
          'Advanced invoicing & billing automation',
          'Client portal with project dashboards',
          'Contract management system',
          'Expense tracking & reimbursement',
          'Integration with accounting software',
          'Mobile time tracking app',
          'AI-based project analytics'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Small Agencies & Freelancers',
        price: '₹15,000/year',
        features: [
          'Client management',
          'Project tracking',
          'Basic time sheets',
          'Invoice generation',
          'Document storage',
          'Basic reports'
        ]
      }
    },

    upSpecificFeatures: [
      'GST compliance & invoicing',
      'Local client database templates',
      'Hindi/English bilingual invoices',
      'Integration with Indian accounting software',
      'Support for retainer-based billing',
      'Festival holiday calendar'
    ],

    realWorldExample: {
      name: 'TechConsult Solutions, Noida',
      tier: 'Enterprise',
      stats: {
        clients: '150+ active',
        projects: '80+ concurrent',
        billingAccuracy: '99.5%',
        revenue: '₹15 Cr/year'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'MongoDB'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Tally/QuickBooks',
      'Payment gateways',
      'Google Workspace',
      'Slack/Teams',
      'Cloud storage'
    ],

    modules: [
      { name: 'Clients', description: 'Client relationship management' },
      { name: 'Projects', description: 'Project planning and tracking' },
      { name: 'Tasks', description: 'Task assignment and monitoring' },
      { name: 'Timesheets', description: 'Time tracking and billing' },
      { name: 'Invoices', description: 'Invoice generation and payments' },
      { name: 'Reports', description: 'Profitability and utilization reports' }
    ],

    demoData: {
      title: 'Active Projects',
      headers: ['Project', 'Client', 'Start', 'Deadline', 'Budget', 'Progress'],
      rows: [
        ['Website Redesign', 'ABC Corp', '01 Nov', '30 Dec', '₹5,00,000', '65%'],
        ['Mobile App', 'XYZ Ltd', '15 Oct', '15 Jan', '₹12,00,000', '40%'],
        ['ERP Implementation', 'PQR Industries', '01 Sep', '28 Feb', '₹25,00,000', '55%'],
        ['Digital Marketing', 'StartupX', '01 Nov', '31 Dec', '₹2,00,000', '30%'],
        ['Cloud Migration', 'Tech Corp', '20 Oct', '20 Dec', '₹8,00,000', '75%']
      ]
    },

    stats: {
      clients: '85',
      projects: '34',
      invoices: '₹45,00,000',
      pending: '8'
    }
  },

  14: {
    name: 'School Management System',
    icon: '🏫',
    category: 'Education',
    tagline: 'Complete School ERP',
    description: 'Full-featured school management with admissions, academics, transportation, library, and parent communication.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Large School Chains',
        price: 'Custom Pricing',
        features: [
          'Multi-branch school management',
          'Complete LMS with online classes',
          'Parent & student mobile apps',
          'Bus tracking with GPS integration',
          'Digital library management',
          'Online admission portal',
          'Report card generation',
          'Staff payroll integration',
          'Canteen management',
          'Alumni portal'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Single Schools',
        price: '₹45,000/year',
        features: [
          'Admission management',
          'Class & section allocation',
          'Attendance tracking',
          'Fee management',
          'Exam & results',
          'Basic reports'
        ]
      }
    },

    upSpecificFeatures: [
      'UP Board/CBSE compliance',
      'DIOS reporting integration',
      'RTE quota management',
      'Mid-day meal tracking',
      'Sanskrit/Hindi subject support',
      'Local transport route planning'
    ],

    realWorldExample: {
      name: 'City Public School, Lucknow',
      tier: 'Enterprise',
      stats: {
        students: '3,200 enrolled',
        teachers: '180 faculty',
        buses: '25 vehicles',
        feeCollection: '₹18 Cr/year'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'MongoDB'],
      infrastructure: ['Docker', 'Kubernetes', 'AWS']
    },

    integrations: [
      'Payment gateways',
      'GPS tracking',
      'SMS/WhatsApp',
      'Biometric systems',
      'Google Classroom'
    ],

    modules: [
      { name: 'Admissions', description: 'Student admission process' },
      { name: 'Classes', description: 'Class and timetable management' },
      { name: 'Teachers', description: 'Faculty records and schedules' },
      { name: 'Library', description: 'Book issue and inventory' },
      { name: 'Transport', description: 'Bus routes and tracking' },
      { name: 'Fees', description: 'Fee collection and receipts' }
    ],

    demoData: {
      title: 'Class Schedule',
      headers: ['Class', 'Section', 'Subject', 'Teacher', 'Time', 'Room'],
      rows: [
        ['X', 'A', 'Mathematics', 'Mr. Sharma', '09:00-10:00', '101'],
        ['X', 'A', 'Physics', 'Mrs. Gupta', '10:00-11:00', '102'],
        ['IX', 'B', 'English', 'Mr. Verma', '09:00-10:00', '201'],
        ['VIII', 'A', 'Science', 'Mrs. Patel', '11:00-12:00', '103'],
        ['X', 'B', 'Chemistry', 'Mr. Khan', '10:00-11:00', '104'],
        ['IX', 'A', 'Hindi', 'Mrs. Singh', '11:00-12:00', '202']
      ]
    },

    stats: {
      students: '1250',
      teachers: '65',
      buses: '12',
      books: '8500'
    }
  },

  15: {
    name: 'Food Production & Distribution',
    icon: '🍕',
    category: 'Food & Beverage',
    tagline: 'Food Manufacturing Management',
    description: 'Production planning, quality control, inventory management, and distribution tracking for food manufacturers.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Large Food Manufacturers',
        price: 'Custom Pricing',
        features: [
          'Multi-plant production management',
          'Recipe & formulation management',
          'Quality control with lab integration',
          'Batch tracking & traceability',
          'FSSAI compliance automation',
          'Cold chain monitoring',
          'Distributor portal & ordering',
          'Route optimization for delivery',
          'Warehouse management system',
          'Expiry & recall management'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Small Food Businesses',
        price: '₹30,000/year',
        features: [
          'Production scheduling',
          'Inventory management',
          'Quality checks',
          'Order management',
          'Delivery tracking',
          'Basic reports'
        ]
      }
    },

    upSpecificFeatures: [
      'UP FSSAI license integration',
      'Local ingredient suppliers database',
      'Seasonal product planning (festivals)',
      'Traditional UP food recipes',
      'Hindi labeling support',
      'Local distribution network mapping'
    ],

    realWorldExample: {
      name: 'Awadhi Delights, Lucknow',
      tier: 'Standard',
      stats: {
        products: '45 SKUs',
        production: '5,000+ units/day',
        distributors: '80+ across UP',
        revenue: '₹12 Cr/year'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'Redis 7'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'FSSAI portal',
      'Temperature sensors',
      'Barcode/RFID systems',
      'Payment gateways',
      'GPS tracking'
    ],

    modules: [
      { name: 'Production', description: 'Production planning and scheduling' },
      { name: 'Quality', description: 'Quality control and testing' },
      { name: 'Inventory', description: 'Raw material and finished goods' },
      { name: 'Orders', description: 'Customer and distributor orders' },
      { name: 'Distribution', description: 'Delivery and logistics' },
      { name: 'Reports', description: 'Production and sales analytics' }
    ],

    demoData: {
      title: 'Production Schedule',
      headers: ['Product', 'Batch', 'Quantity', 'Start', 'Status', 'QC'],
      rows: [
        ['Bread Loaf', 'BL-2411', '500 pcs', '06:00', 'Completed', 'Passed'],
        ['Cookies Pack', 'CK-2411', '1000 pcs', '07:00', 'In Progress', 'Pending'],
        ['Cake 1kg', 'CA-2411', '50 pcs', '08:00', 'Scheduled', 'Pending'],
        ['Biscuits', 'BS-2411', '2000 pcs', '06:30', 'Completed', 'Passed'],
        ['Pastries', 'PS-2411', '200 pcs', '09:00', 'Scheduled', 'Pending']
      ]
    },

    stats: {
      products: '85',
      orders: '156',
      distributors: '45',
      revenue: '₹28,00,000'
    }
  },

  16: {
    name: 'Transport & Logistics Management',
    icon: '🚚',
    category: 'Professional Services',
    tagline: 'Complete Logistics Solution',
    description: 'Fleet management, shipment tracking, route optimization, and driver management for transport companies.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Large Logistics Companies',
        price: 'Custom Pricing',
        features: [
          'Multi-location fleet management',
          'Real-time GPS tracking',
          'Route optimization with AI',
          'Driver mobile app with proof of delivery',
          'Customer tracking portal',
          'Automated billing & invoicing',
          'Fuel management system',
          'Vehicle maintenance scheduling',
          'Load optimization',
          'Integration with e-commerce platforms'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Small Transport Operators',
        price: '₹25,000/year',
        features: [
          'Fleet management',
          'Shipment tracking',
          'Driver records',
          'Basic billing',
          'Route planning',
          'Standard reports'
        ]
      }
    },

    upSpecificFeatures: [
      'UP transport authority integration',
      'Lucknow-Varanasi-Kanpur route templates',
      'Toll plaza mapping',
      'Local driver network',
      'Hindi documentation',
      'Festival traffic planning'
    ],

    realWorldExample: {
      name: 'FastMove Logistics, Kanpur',
      tier: 'Enterprise',
      stats: {
        vehicles: '120 fleet',
        routes: '50+ active',
        shipments: '2,500+/month',
        onTimeDelivery: '94.5%'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'MongoDB'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'GPS tracking devices',
      'Google Maps API',
      'Payment gateways',
      'Fuel card systems',
      'E-commerce platforms'
    ],

    modules: [
      { name: 'Fleet', description: 'Vehicle inventory and management' },
      { name: 'Drivers', description: 'Driver profiles and licenses' },
      { name: 'Routes', description: 'Route planning and optimization' },
      { name: 'Shipments', description: 'Shipment booking and tracking' },
      { name: 'Tracking', description: 'Real-time GPS tracking' },
      { name: 'Reports', description: 'Performance and utilization reports' }
    ],

    demoData: {
      title: 'Active Shipments',
      headers: ['Tracking ID', 'From', 'To', 'Vehicle', 'Driver', 'Status'],
      rows: [
        ['TRK-001', 'Mumbai', 'Delhi', 'UP-32-AB-1234', 'Ramesh K.', 'In Transit'],
        ['TRK-002', 'Chennai', 'Bangalore', 'TN-01-CD-5678', 'Suresh M.', 'Delivered'],
        ['TRK-003', 'Delhi', 'Jaipur', 'DL-01-EF-9012', 'Amit S.', 'In Transit'],
        ['TRK-004', 'Kolkata', 'Patna', 'WB-02-GH-3456', 'Vijay P.', 'Loading'],
        ['TRK-005', 'Pune', 'Hyderabad', 'MH-12-IJ-7890', 'Raju T.', 'In Transit']
      ]
    },

    stats: {
      vehicles: '35',
      drivers: '42',
      shipments: '156',
      revenue: '₹18,00,000'
    }
  },

  17: {
    name: 'CA Firm Management System',
    icon: '📊',
    category: 'Professional Services',
    tagline: 'Chartered Accountant Practice Management',
    description: 'Client management, tax filing, compliance tracking, and billing for CA firms and tax consultants.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Large CA Firms',
        price: 'Custom Pricing',
        features: [
          'Multi-partner firm management',
          'Client portal with document vault',
          'Automated tax filing (ITR, GST, TDS)',
          'Compliance calendar with alerts',
          'Time & billing management',
          'Audit management module',
          'E-filing integration (Income Tax, MCA)',
          'Document management with e-signature',
          'Practice management analytics',
          'Staff productivity tracking'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Individual CA Practitioners',
        price: '₹20,000/year',
        features: [
          'Client database',
          'Filing tracker',
          'Compliance calendar',
          'Document storage',
          'Basic billing',
          'Standard reports'
        ]
      }
    },

    upSpecificFeatures: [
      'UP state tax compliance',
      'UP Professional Tax integration',
      'Local trade license tracking',
      'Integration with UP commercial tax dept',
      'Hindi client communication',
      'Regional business documentation'
    ],

    realWorldExample: {
      name: 'Sharma & Associates, Lucknow',
      tier: 'Enterprise',
      stats: {
        clients: '850+ businesses',
        filings: '3,500+/year',
        compliance: '99.2% on-time',
        revenue: '₹2.5 Cr/year'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'MongoDB'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Income Tax e-filing portal',
      'GST Network',
      'MCA portal',
      'Payment gateways',
      'Digital signature services'
    ],

    modules: [
      { name: 'Clients', description: 'Client database and files' },
      { name: 'Tax Filing', description: 'ITR, GST, TDS filing management' },
      { name: 'Compliance', description: 'Due date tracking and alerts' },
      { name: 'Documents', description: 'Secure document storage' },
      { name: 'Billing', description: 'Professional fee invoicing' },
      { name: 'Reports', description: 'Practice performance analytics' }
    ],

    demoData: {
      title: 'Tax Filing Status',
      headers: ['Client', 'Type', 'FY', 'Due Date', 'Status', 'Fee'],
      rows: [
        ['ABC Traders', 'GST Return', '2024-25', '20 Dec', 'Pending', '₹2,500'],
        ['XYZ Pvt Ltd', 'ITR', '2023-24', '31 Dec', 'Filed', '₹15,000'],
        ['Kumar & Sons', 'TDS Return', '2024-25', '15 Dec', 'In Progress', '₹3,000'],
        ['Sharma Enterprises', 'GST Annual', '2023-24', '31 Dec', 'Pending', '₹8,000'],
        ['Tech Solutions', 'ITR', '2023-24', '31 Dec', 'Filed', '₹25,000']
      ]
    },

    stats: {
      clients: '250',
      filings: '180',
      pending: '45',
      revenue: '₹35,00,000'
    }
  },

  18: {
    name: 'Health & Wellness Center',
    icon: '🧘',
    category: 'Health & Fitness',
    tagline: 'Wellness Center Management',
    description: 'Yoga studios, wellness centers, and alternative therapy centers with class scheduling, member management, and health tracking.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Multi-Location Wellness Centers',
        price: 'Custom Pricing',
        features: [
          'Multi-center management',
          'Member mobile app with class videos',
          'Health assessment & tracking',
          'Personalized wellness plans',
          'Nutrition consultation module',
          'Online class streaming',
          'Therapy appointment scheduling',
          'Product sales (supplements, merchandise)',
          'Instructor training portal',
          'WhatsApp health tips automation'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Single Wellness Centers',
        price: '₹16,000/year',
        features: [
          'Class scheduling',
          'Member management',
          'Booking system',
          'Instructor records',
          'Basic health tracking',
          'Standard reports'
        ]
      }
    },

    upSpecificFeatures: [
      'Ayurveda & traditional therapy integration',
      'Yoga Day event management',
      'Local instructor network',
      'Hindi class instructions',
      'Festival wellness programs',
      'Traditional health packages'
    ],

    realWorldExample: {
      name: 'Zen Wellness, Varanasi',
      tier: 'Standard',
      stats: {
        members: '450 active',
        classes: '60+/week',
        instructors: '12 certified',
        retention: '87%'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'Redis 7'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Payment gateways',
      'WhatsApp Business',
      'Video streaming platforms',
      'Health tracking devices',
      'SMS notifications'
    ],

    modules: [
      { name: 'Classes', description: 'Class schedule and bookings' },
      { name: 'Bookings', description: 'Session and therapy bookings' },
      { name: 'Members', description: 'Member profiles and plans' },
      { name: 'Trainers', description: 'Instructor management' },
      { name: 'Health', description: 'Health assessments and tracking' },
      { name: 'Reports', description: 'Attendance and revenue reports' }
    ],

    demoData: {
      title: 'Class Schedule',
      headers: ['Class', 'Instructor', 'Time', 'Duration', 'Capacity', 'Booked'],
      rows: [
        ['Morning Yoga', 'Priya S.', '06:00 AM', '60 min', '20', '18'],
        ['Zumba', 'Neha K.', '07:00 AM', '45 min', '25', '22'],
        ['Pilates', 'Anjali M.', '08:00 AM', '60 min', '15', '12'],
        ['HIIT', 'Rahul V.', '06:00 PM', '45 min', '20', '20'],
        ['Meditation', 'Priya S.', '07:00 PM', '30 min', '30', '15']
      ]
    },

    stats: {
      members: '320',
      classes: '45',
      trainers: '15',
      revenue: '₹4,50,000'
    }
  },

  19: {
    name: 'Laundry & Dry Cleaning Service',
    icon: '🧺',
    category: 'Professional Services',
    tagline: 'Laundry Service Management',
    description: 'Order management, pickup/delivery tracking, pricing, and customer management for laundry and dry cleaning services.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Laundry Service Chains',
        price: 'Custom Pricing',
        features: [
          'Multi-outlet management',
          'Customer mobile app for booking',
          'Driver app for pickup/delivery',
          'RFID tag tracking',
          'Dynamic pricing engine',
          'Route optimization',
          'Automated SMS/WhatsApp updates',
          'Quality check workflow',
          'Subscription plans management',
          'Corporate client portal'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Single Laundry Shops',
        price: '₹12,000/year',
        features: [
          'Order management',
          'Pricing calculator',
          'Customer database',
          'Delivery tracking',
          'Basic billing',
          'Standard reports'
        ]
      }
    },

    upSpecificFeatures: [
      'Local area route planning',
      'Festival rush management',
      'Traditional garment handling (saree, kurta)',
      'Hindi receipts & SMS',
      'Seasonal pricing (wedding season)',
      'College/hostel bulk order management'
    ],

    realWorldExample: {
      name: 'SpinCycle Laundry, Lucknow',
      tier: 'Standard',
      stats: {
        orders: '350+/week',
        customers: '1,200+ registered',
        deliveryTime: '24-hour avg',
        customerSatisfaction: '4.7/5.0'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'Redis 7'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Payment gateways',
      'WhatsApp Business',
      'SMS gateway',
      'Google Maps',
      'RFID readers'
    ],

    modules: [
      { name: 'Orders', description: 'Order creation and tracking' },
      { name: 'Pricing', description: 'Service pricing and packages' },
      { name: 'Customers', description: 'Customer profiles and history' },
      { name: 'Delivery', description: 'Pickup and delivery scheduling' },
      { name: 'Inventory', description: 'Detergent and supplies tracking' },
      { name: 'Reports', description: 'Revenue and performance reports' }
    ],

    demoData: {
      title: 'Active Orders',
      headers: ['Order ID', 'Customer', 'Items', 'Service', 'Amount', 'Status'],
      rows: [
        ['LD-001', 'Rahul Kumar', '5 Shirts, 2 Pants', 'Express', '₹450', 'Processing'],
        ['LD-002', 'Priya Singh', '3 Sarees', 'Dry Clean', '₹600', 'Ready'],
        ['LD-003', 'Amit Verma', '2 Suits', 'Premium', '₹800', 'Processing'],
        ['LD-004', 'Neha Gupta', '10 pcs Mixed', 'Regular', '₹350', 'Delivered'],
        ['LD-005', 'Vijay Sharma', '1 Blanket', 'Heavy', '₹250', 'Processing']
      ]
    },

    stats: {
      orders: '89',
      customers: '345',
      revenue: '₹1,25,000',
      pending: '23'
    }
  },

  20: {
    name: 'Home Services Platform',
    icon: '🔧',
    category: 'Professional Services',
    tagline: 'On-Demand Home Services',
    description: 'Marketplace for home services including plumbing, electrical, cleaning, carpentry with provider and customer management.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Home Services Aggregators',
        price: 'Custom Pricing',
        features: [
          'Multi-city operations',
          'Customer & provider mobile apps',
          'AI-based service provider matching',
          'Dynamic pricing & surge management',
          'Quality rating & feedback system',
          'Service provider training portal',
          'Insurance integration',
          'Automated dispatch system',
          'Live job tracking',
          'Wallet & payment management'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Local Service Providers',
        price: '₹15,000/year',
        features: [
          'Service catalog',
          'Booking management',
          'Provider database',
          'Customer records',
          'Basic scheduling',
          'Standard reports'
        ]
      }
    },

    upSpecificFeatures: [
      'Local area service provider network',
      'Hindi customer communication',
      'Festival demand forecasting',
      'Local price standards',
      'Community-based referrals',
      'Verification with local authorities'
    ],

    realWorldExample: {
      name: 'HomeServe Pro, Lucknow',
      tier: 'Enterprise',
      stats: {
        services: '60+ types',
        providers: '450 verified',
        bookings: '1,800+/month',
        avgRating: '4.6/5.0'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'MongoDB'],
      infrastructure: ['Docker', 'Kubernetes', 'AWS']
    },

    integrations: [
      'Payment gateways',
      'WhatsApp Business',
      'Google Maps',
      'Background verification APIs',
      'SMS notifications'
    ],

    modules: [
      { name: 'Services', description: 'Service catalog and pricing' },
      { name: 'Bookings', description: 'Customer booking management' },
      { name: 'Providers', description: 'Service provider profiles' },
      { name: 'Schedule', description: 'Job scheduling and dispatch' },
      { name: 'Payments', description: 'Payment processing' },
      { name: 'Reports', description: 'Business analytics' }
    ],

    demoData: {
      title: 'Service Bookings',
      headers: ['Booking ID', 'Service', 'Customer', 'Provider', 'Schedule', 'Status'],
      rows: [
        ['HM-001', 'AC Repair', 'Ramesh K.', 'Sunil Tech', '21 Nov, 10AM', 'Confirmed'],
        ['HM-002', 'Plumbing', 'Priya S.', 'Fix Masters', '21 Nov, 2PM', 'In Progress'],
        ['HM-003', 'Electrical', 'Amit V.', 'Power Pro', '22 Nov, 11AM', 'Scheduled'],
        ['HM-004', 'Cleaning', 'Neha G.', 'Clean Home', '21 Nov, 9AM', 'Completed'],
        ['HM-005', 'Carpentry', 'Vijay M.', 'Wood Works', '23 Nov, 10AM', 'Scheduled']
      ]
    },

    stats: {
      services: '45',
      providers: '120',
      bookings: '234',
      revenue: '₹5,50,000'
    }
  },

  21: {
    name: 'Arts & Crafts Studio',
    icon: '🎨',
    category: 'Education',
    tagline: 'Art Studio Management',
    description: 'Class management, student enrollment, materials inventory, and project tracking for art schools and craft studios.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Multi-Studio Art Academies',
        price: 'Custom Pricing',
        features: [
          'Multi-location management',
          'Online class & video tutorials',
          'Student portfolio management',
          'Art supplies e-commerce',
          'Exhibition & event management',
          'Artwork gallery & selling portal',
          'Instructor certification tracking',
          'Parent mobile app',
          'Project progress tracking with photos',
          'WhatsApp project updates'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Single Art Studios',
        price: '₹14,000/year',
        features: [
          'Class scheduling',
          'Student management',
          'Material inventory',
          'Project tracking',
          'Basic billing',
          'Standard reports'
        ]
      }
    },

    upSpecificFeatures: [
      'Traditional UP art forms (Gond, Warli)',
      'Local art exhibition calendar',
      'Festival art workshops',
      'Hindi/regional language support',
      'Local artist network',
      'Cultural event integration'
    ],

    realWorldExample: {
      name: 'Creative Canvas, Varanasi',
      tier: 'Standard',
      stats: {
        students: '180 enrolled',
        classes: '15 different',
        projects: '350+/year',
        exhibitions: '6/year'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'MongoDB'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Payment gateways',
      'WhatsApp Business',
      'Cloud storage for artwork',
      'E-commerce platforms',
      'SMS notifications'
    ],

    modules: [
      { name: 'Classes', description: 'Class schedules and enrollment' },
      { name: 'Students', description: 'Student profiles and progress' },
      { name: 'Materials', description: 'Art supplies inventory' },
      { name: 'Projects', description: 'Student project tracking' },
      { name: 'Events', description: 'Exhibition and event management' },
      { name: 'Reports', description: 'Enrollment and revenue reports' }
    ],

    demoData: {
      title: 'Art Classes',
      headers: ['Class', 'Instructor', 'Level', 'Day', 'Time', 'Students'],
      rows: [
        ['Oil Painting', 'Mrs. Sharma', 'Advanced', 'Mon/Wed', '4-6 PM', '8'],
        ['Sketching', 'Mr. Kumar', 'Beginner', 'Tue/Thu', '5-6 PM', '12'],
        ['Pottery', 'Mrs. Patel', 'Intermediate', 'Sat', '10-12 AM', '6'],
        ['Watercolor', 'Mrs. Sharma', 'Beginner', 'Fri', '4-6 PM', '10'],
        ['Craft Making', 'Ms. Gupta', 'All Levels', 'Sun', '11-1 PM', '15']
      ]
    },

    stats: {
      students: '85',
      classes: '12',
      projects: '45',
      revenue: '₹2,50,000'
    }
  },

  22: {
    name: 'Spa & Salon Management',
    icon: '💆',
    category: 'Health & Fitness',
    tagline: 'Beauty & Wellness Management',
    description: 'Appointment scheduling, service management, staff allocation, inventory, and customer loyalty for spas and salons.',

    tiers: {
      enterprise: {
        name: 'Enterprise Tier',
        subtitle: 'Salon & Spa Chains',
        price: 'Custom Pricing',
        features: [
          'Multi-outlet management',
          'Customer mobile app for bookings',
          'Staff mobile app with schedules',
          'Package & membership management',
          'Product sales & commission tracking',
          'Customer feedback & reviews',
          'Marketing automation (birthday offers)',
          'Inventory with auto-reorder',
          'Video consultation for bridal packages',
          'WhatsApp appointment reminders'
        ]
      },
      standard: {
        name: 'Standard Tier',
        subtitle: 'Single Salon/Spa',
        price: '₹16,000/year',
        features: [
          'Appointment booking',
          'Service catalog',
          'Staff management',
          'Basic inventory',
          'Customer database',
          'Standard reports'
        ]
      }
    },

    upSpecificFeatures: [
      'Bridal package management (UP weddings)',
      'Festival beauty packages',
      'Traditional UP beauty treatments',
      'Hindi service descriptions',
      'Local product suppliers',
      'Wedding season demand management'
    ],

    realWorldExample: {
      name: 'Glamour Studio, Lucknow',
      tier: 'Enterprise',
      stats: {
        appointments: '850+/month',
        services: '45 treatments',
        staff: '18 beauticians',
        revenue: '₹15 lakhs/month'
      }
    },

    techStack: {
      frontend: ['React 18', 'Next.js 14', 'TypeScript'],
      backend: ['Node.js 20', 'Express.js'],
      database: ['PostgreSQL 15', 'Redis 7'],
      infrastructure: ['Docker', 'AWS']
    },

    integrations: [
      'Payment gateways',
      'WhatsApp Business',
      'Google Calendar',
      'SMS gateway',
      'Loyalty program APIs'
    ],

    modules: [
      { name: 'Appointments', description: 'Booking and scheduling' },
      { name: 'Services', description: 'Service catalog and pricing' },
      { name: 'Staff', description: 'Staff profiles and schedules' },
      { name: 'Inventory', description: 'Product stock management' },
      { name: 'Packages', description: 'Service packages and memberships' },
      { name: 'Reports', description: 'Revenue and performance reports' }
    ],

    demoData: {
      title: 'Today\'s Appointments',
      headers: ['Time', 'Client', 'Service', 'Staff', 'Duration', 'Amount'],
      rows: [
        ['10:00', 'Priya Sharma', 'Hair Spa', 'Neha', '90 min', '₹1,500'],
        ['10:30', 'Anjali Gupta', 'Facial', 'Ritu', '60 min', '₹800'],
        ['11:00', 'Sneha Patel', 'Manicure+Pedicure', 'Pooja', '75 min', '₹1,200'],
        ['12:00', 'Meera Singh', 'Hair Cut + Color', 'Amit', '120 min', '₹3,500'],
        ['02:00', 'Kavita Verma', 'Full Body Massage', 'Sunita', '90 min', '₹2,500']
      ]
    },

    stats: {
      appointments: '45',
      services: '35',
      staff: '12',
      revenue: '₹3,50,000'
    }
  }
};

export type BusinessId = keyof typeof businessesFullData;
