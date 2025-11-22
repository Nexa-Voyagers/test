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

  // Continue for all 22 businesses...
};

export type BusinessId = keyof typeof businessesFullData;
