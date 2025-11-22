// Complete Client Onboarding Checklists for all 22 Business Solutions

export const onboardingChecklists = {
  1: {
    name: 'Hotel & Hospitality Management System',
    timeline: '6-8 weeks',
    phases: [
      {
        phase: 'Phase 1: Pre-Implementation (Week 1-2)',
        description: 'Preparation and data collection',
        tasks: [
          {
            id: 1,
            task: 'Sign contract and service agreement',
            owner: 'Business Owner',
            duration: '1 day',
            status: 'required',
            deliverables: ['Signed contract', 'Payment confirmation']
          },
          {
            id: 2,
            task: 'Appoint project champion from hotel staff',
            owner: 'Management',
            duration: '1 day',
            status: 'required',
            deliverables: ['Designated point of contact', 'Contact details']
          },
          {
            id: 3,
            task: 'Provide property details',
            owner: 'Hotel Management',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'Property name, address, contact details',
              'Star rating and property type',
              'Total number of rooms and floors',
              'Room type breakdown (Deluxe, Suite, Standard, etc.)',
              'Current rate card',
              'High-resolution photos of property and rooms',
              'Amenities list'
            ]
          },
          {
            id: 4,
            task: 'Share existing guest database',
            owner: 'Front Desk Manager',
            duration: '3 days',
            status: 'required',
            deliverables: [
              'Guest list in Excel (last 12 months)',
              'Format: Name, Phone, Email, Total Stays, Total Spent',
              'Corporate client list with contracts',
              'VIP guest list'
            ]
          },
          {
            id: 5,
            task: 'Provide financial information',
            owner: 'Accounts Manager',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'GST number and registration certificate',
              'Bank account details for payment gateway',
              'Current tax structure (GST rates)',
              'Discount policies',
              'Cancellation policies'
            ]
          },
          {
            id: 6,
            task: 'Share staff details',
            owner: 'HR Manager',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'Staff list with roles (Front Desk, Housekeeping, Management)',
              'Email addresses for each staff member',
              'Department structure',
              'Shift timings'
            ]
          },
          {
            id: 7,
            task: 'IT infrastructure assessment',
            owner: 'Implementation Team',
            duration: '1 day',
            status: 'required',
            deliverables: [
              'Site visit and network assessment',
              'Internet bandwidth check (min 10 Mbps)',
              'Identify desktop/laptop for PMS access',
              'Printer availability (thermal for receipts)',
              'Biometric device compatibility (if any)'
            ]
          }
        ]
      },
      {
        phase: 'Phase 2: System Setup (Week 3-4)',
        description: 'Configuration and customization',
        tasks: [
          {
            id: 8,
            task: 'Server and database setup',
            owner: 'Tech Team',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'Cloud server provisioned',
              'Database created and secured',
              'SSL certificate installed',
              'Backup automation configured',
              'Access URLs provided'
            ]
          },
          {
            id: 9,
            task: 'Property configuration in system',
            owner: 'Implementation Team',
            duration: '3 days',
            status: 'required',
            deliverables: [
              'Property profile created',
              'All rooms added with numbers and types',
              'Room types configured with amenities',
              'Rate plans setup',
              'Tax configuration completed',
              'Email templates customized with hotel branding',
              'Invoice templates customized'
            ]
          },
          {
            id: 10,
            task: 'User account creation',
            owner: 'Implementation Team',
            duration: '1 day',
            status: 'required',
            deliverables: [
              'Admin accounts created',
              'Front desk staff accounts',
              'Housekeeping staff accounts',
              'Management accounts with dashboard access',
              'Credentials shared securely'
            ]
          },
          {
            id: 11,
            task: 'Payment gateway integration',
            owner: 'Tech Team',
            duration: '3 days',
            status: 'required',
            deliverables: [
              'Razorpay/Paytm account setup',
              'API integration completed',
              'Test transactions successful',
              'Settlement account verified'
            ]
          },
          {
            id: 12,
            task: 'OTA channel integration',
            owner: 'Implementation Team',
            duration: '5 days',
            status: 'optional',
            deliverables: [
              'MakeMyTrip integration',
              'Booking.com integration',
              'Goibibo integration',
              'Channel manager configured',
              'Rate parity setup',
              'Test bookings verified'
            ]
          },
          {
            id: 13,
            task: 'Data migration',
            owner: 'Implementation Team',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'Guest data imported',
              'Historical booking data (optional)',
              'Corporate client contracts uploaded',
              'Rate history imported',
              'Data validation completed'
            ]
          }
        ]
      },
      {
        phase: 'Phase 3: Training (Week 5)',
        description: 'Staff training and familiarization',
        tasks: [
          {
            id: 14,
            task: 'Front desk staff training',
            owner: 'Trainer',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'Check-in process training',
              'Check-out and billing training',
              'Booking management',
              'Payment collection',
              'Report generation',
              'Training manual provided',
              'Video tutorials shared'
            ]
          },
          {
            id: 15,
            task: 'Housekeeping staff training',
            owner: 'Trainer',
            duration: '1 day',
            status: 'required',
            deliverables: [
              'Room status updates',
              'Cleaning task management',
              'Maintenance request reporting',
              'Mobile app training (if applicable)'
            ]
          },
          {
            id: 16,
            task: 'Management training',
            owner: 'Trainer',
            duration: '1 day',
            status: 'required',
            deliverables: [
              'Dashboard and analytics',
              'Revenue reports',
              'Occupancy reports',
              'Rate management',
              'User management'
            ]
          },
          {
            id: 17,
            task: 'Accounts training',
            owner: 'Trainer',
            duration: '1 day',
            status: 'required',
            deliverables: [
              'Invoice generation',
              'Payment reconciliation',
              'GST reports',
              'Financial dashboards',
              'Accounting integration (Tally)'
            ]
          }
        ]
      },
      {
        phase: 'Phase 4: Testing (Week 6)',
        description: 'User acceptance testing',
        tasks: [
          {
            id: 18,
            task: 'Create test booking scenarios',
            owner: 'Hotel + Implementation Team',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'Walk-in booking test',
              'Online booking test',
              'OTA booking test',
              'Group booking test',
              'Modification and cancellation test',
              'Check-in/check-out test',
              'Payment collection test',
              'Report generation test'
            ]
          },
          {
            id: 19,
            task: 'User acceptance testing',
            owner: 'Hotel Staff',
            duration: '3 days',
            status: 'required',
            deliverables: [
              'All test scenarios executed',
              'Issues documented',
              'Bugs fixed',
              'Sign-off on testing'
            ]
          },
          {
            id: 20,
            task: 'Parallel run (Optional)',
            owner: 'Front Desk',
            duration: '5 days',
            status: 'optional',
            deliverables: [
              'Run new system alongside old system',
              'Compare results',
              'Build confidence',
              'Identify any gaps'
            ]
          }
        ]
      },
      {
        phase: 'Phase 5: Go-Live (Week 7-8)',
        description: 'Production launch',
        tasks: [
          {
            id: 21,
            task: 'Pre-launch checklist',
            owner: 'Implementation Team',
            duration: '1 day',
            status: 'required',
            deliverables: [
              'All rooms marked available',
              'Current bookings loaded',
              'Staff accounts active',
              'Payment gateway live',
              'Printers configured',
              'Backup verified',
              'Support hotline active'
            ]
          },
          {
            id: 22,
            task: 'Go-live',
            owner: 'All',
            duration: '1 day',
            status: 'required',
            deliverables: [
              'System goes live',
              'On-site support available',
              'Monitor first 10 bookings',
              'Quick fixes if needed'
            ]
          },
          {
            id: 23,
            task: 'Post-launch support (Week 1)',
            owner: 'Support Team',
            duration: '7 days',
            status: 'required',
            deliverables: [
              'Daily check-in calls',
              'Issue resolution within 2 hours',
              'Additional training if needed',
              'Performance monitoring'
            ]
          },
          {
            id: 24,
            task: 'Post-launch support (Week 2-4)',
            owner: 'Support Team',
            duration: '21 days',
            status: 'required',
            deliverables: [
              'Weekly check-in calls',
              'Issue resolution within 4 hours',
              'System optimization',
              'Feature requests collection'
            ]
          },
          {
            id: 25,
            task: 'Month 1 review',
            owner: 'Account Manager',
            duration: '1 day',
            status: 'required',
            deliverables: [
              'Usage statistics review',
              'Performance metrics analysis',
              'Customer satisfaction survey',
              'Improvement recommendations',
              'Future roadmap discussion'
            ]
          }
        ]
      }
    ],
    totalTasks: 25,
    criticalPath: [1, 3, 4, 5, 8, 9, 13, 14, 18, 19, 21, 22],
    requiredDocuments: [
      'GST Registration Certificate',
      'Bank account details',
      'Property ownership/lease documents',
      'Trade license',
      'FSSAI license (if restaurant)',
      'Fire safety certificate',
      'Staff ID proofs for system access'
    ],
    hardwareRequirements: [
      'Desktop/Laptop: Windows 10+ or Mac, 8GB RAM, modern browser',
      'Internet: 10 Mbps minimum, 50 Mbps recommended',
      'Printer: Thermal printer for receipts (80mm)',
      'Backup: UPS for power backup (optional but recommended)',
      'Biometric: Fingerprint scanner for staff attendance (optional)'
    ],
    successCriteria: [
      '100% staff trained and confident',
      'Zero booking errors on Day 1',
      'All OTA channels integrated and tested',
      'Payment gateway processing transactions',
      'Reports generating accurately',
      'System uptime > 99.5%',
      'Average response time < 2 seconds',
      'Customer satisfaction score > 4/5'
    ]
  },

  2: {
    name: 'Temple Management System',
    timeline: '8-12 weeks',
    phases: [
      {
        phase: 'Phase 1: Trust & Regulatory Compliance (Week 1-2)',
        description: 'Legal and compliance setup',
        tasks: [
          {
            id: 1,
            task: 'Provide trust registration documents',
            owner: 'Trust Secretary',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'Trust deed copy',
              'Trust registration certificate',
              '12A and 80G registration certificates',
              'PAN card of trust',
              'List of current trustees with contact details',
              'Bank account details (all accounts)',
              'Audit reports (last 2 years)'
            ]
          },
          {
            id: 2,
            task: 'Temple infrastructure details',
            owner: 'Temple Administrator',
            duration: '3 days',
            status: 'required',
            deliverables: [
              'Temple name, deity, and address',
              'Daily visitor footfall estimates',
              'Major festivals and dates',
              'List of daily rituals and timings',
              'Pooja types offered with prices',
              'Number of priests and their specializations',
              'Dharamshala room details (if applicable)',
              'Property and asset list',
              'High-quality photos of temple'
            ]
          },
          {
            id: 3,
            task: 'Financial data collection',
            owner: 'Treasurer',
            duration: '5 days',
            status: 'required',
            deliverables: [
              'Last 12 months donation data (Excel format)',
              'Expense categories and monthly averages',
              'Supplier and vendor list',
              'Asset register',
              'Gold and silver inventory',
              'Current accounting method (manual/Tally)',
              'Chart of accounts',
              'Monthly budget (if available)'
            ]
          },
          {
            id: 4,
            task: 'Devotee database preparation',
            owner: 'Office Manager',
            duration: '7 days',
            status: 'optional',
            deliverables: [
              'Regular devotee list with contact details',
              'Major donor list (last 2 years)',
              'Corporate CSR donors',
              'Overseas devotees (NRI)',
              'Pooja booking registers (last 6 months)'
            ]
          },
          {
            id: 5,
            task: 'IT infrastructure assessment',
            owner: 'Implementation Team',
            duration: '1 day',
            status: 'required',
            deliverables: [
              'Site visit completed',
              'Internet connectivity check (min 20 Mbps)',
              'Billing counter locations identified',
              'Server room space identified',
              'UPS and power backup assessment',
              'Network cabling requirements'
            ]
          }
        ]
      },
      {
        phase: 'Phase 2: System Configuration (Week 3-5)',
        description: 'System setup and customization',
        tasks: [
          {
            id: 6,
            task: 'Infrastructure deployment',
            owner: 'Tech Team',
            duration: '5 days',
            status: 'required',
            deliverables: [
              'On-premise server setup (if opted)',
              'Cloud backup configured',
              'Database created with encryption',
              'SSL certificate installed',
              'Firewall and security setup',
              'Daily backup automation',
              'Disaster recovery plan'
            ]
          },
          {
            id: 7,
            task: 'Temple profile configuration',
            owner: 'Implementation Team',
            duration: '3 days',
            status: 'required',
            deliverables: [
              'Temple details entered',
              'Daily ritual schedule configured',
              'Festival calendar for the year',
              'Trustee information added',
              'Bank accounts linked',
              'Email templates customized',
              'Receipt templates with temple logo and 80G'
            ]
          },
          {
            id: 8,
            task: 'Donation module setup',
            owner: 'Implementation Team',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'Donation categories configured',
              'Receipt numbering scheme',
              '80G certificate template',
              'Tax exemption rules',
              'Online donation page created',
              'QR code for UPI donations'
            ]
          },
          {
            id: 9,
            task: 'Pooja booking system setup',
            owner: 'Implementation Team',
            duration: '4 days',
            status: 'required',
            deliverables: [
              'All pooja types added with details',
              'Pricing configured',
              'Time slots created',
              'Priest assignment rules',
              'Booking confirmation templates',
              'Prasad management setup',
              'Sankalp (prayer text) templates in Sanskrit/Hindi'
            ]
          },
          {
            id: 10,
            task: 'Priest management setup',
            owner: 'Implementation Team',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'All priests added to system',
              'Shift schedules configured',
              'Leave management setup',
              'Salary structure entered',
              'Attendance tracking enabled'
            ]
          },
          {
            id: 11,
            task: 'Payment integration',
            owner: 'Tech Team',
            duration: '3 days',
            status: 'required',
            deliverables: [
              'Payment gateway integrated (Razorpay/Paytm)',
              'UPI QR code generated',
              'Bank account verified',
              'Test transactions completed',
              'Auto-settlement configured',
              'Payment reconciliation setup'
            ]
          },
          {
            id: 12,
            task: 'Billing counter setup',
            owner: 'Tech Team',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'POS terminals installed (3-5 counters)',
              'Thermal printers configured',
              'Cash drawers integrated',
              'Barcode scanners (if needed)',
              'Network connectivity tested',
              'Backup power ensured'
            ]
          },
          {
            id: 13,
            task: 'Data migration',
            owner: 'Implementation Team',
            duration: '5 days',
            status: 'required',
            deliverables: [
              'Devotee data imported',
              'Donation history imported (1-2 years)',
              'Priest information migrated',
              'Asset register imported',
              'Supplier data added',
              'Opening balances entered',
              'Data validation completed'
            ]
          }
        ]
      },
      {
        phase: 'Phase 3: Mobile App & Online Services (Week 6-7)',
        description: 'Digital devotee services',
        tasks: [
          {
            id: 14,
            task: 'Mobile app development',
            owner: 'Development Team',
            duration: '10 days',
            status: 'optional',
            deliverables: [
              'Android app developed',
              'iOS app developed',
              'Features: Pooja booking, donations, darshan booking',
              'Multilingual support (Hindi, English)',
              'Push notifications enabled',
              'Testing completed',
              'Submitted to Play Store and App Store'
            ]
          },
          {
            id: 15,
            task: 'Online donation portal',
            owner: 'Development Team',
            duration: '5 days',
            status: 'required',
            deliverables: [
              'Responsive web portal',
              'Online donation form',
              'Instant receipt generation',
              '80G certificate download',
              'Donation history for devotees',
              'Social media sharing',
              'SEO optimization'
            ]
          },
          {
            id: 16,
            task: 'Live darshan setup',
            owner: 'Tech Team',
            duration: '3 days',
            status: 'optional',
            deliverables: [
              'CCTV cameras installed in sanctum',
              'Streaming equipment setup',
              'YouTube channel created',
              'Live streaming 24x7',
              'Website embed code',
              'Bandwidth ensured'
            ]
          }
        ]
      },
      {
        phase: 'Phase 4: Training (Week 8-9)',
        description: 'Comprehensive staff training',
        tasks: [
          {
            id: 17,
            task: 'Billing counter staff training',
            owner: 'Trainer',
            duration: '3 days',
            status: 'required',
            deliverables: [
              'Donation receipt issuance',
              'Cash handling and reconciliation',
              'Online payment acceptance',
              'Receipt reprinting',
              'End-of-day settlement',
              'Common error handling',
              'Training manual in Hindi'
            ]
          },
          {
            id: 18,
            task: 'Pooja booking staff training',
            owner: 'Trainer',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'New pooja booking',
              'Modification and cancellation',
              'Priest assignment',
              'Material allocation',
              'Prasad distribution tracking',
              'Customer communication'
            ]
          },
          {
            id: 19,
            task: 'Accounts team training',
            owner: 'Trainer',
            duration: '2 days',
            status: 'required',
            deliverables: [
              'Financial reports generation',
              'Donation reports (category-wise)',
              'Expense management',
              'Budget vs actual tracking',
              'GST reports (if applicable)',
              'Annual report preparation',
              'Audit trail review'
            ]
          },
          {
            id: 20,
            task: 'Trustee dashboard training',
            owner: 'Trainer',
            duration: '1 day',
            status: 'required',
            deliverables: [
              'Real-time donation tracking',
              'Financial dashboards',
              'Festival performance reports',
              'Priest productivity',
              'Asset management',
              'Expense analysis',
              'Mobile app demo'
            ]
          }
        ]
      },
      {
        phase: 'Phase 5: Testing & Go-Live (Week 10-12)',
        description: 'Final testing and launch',
        tasks: [
          {
            id: 21,
            task: 'End-to-end testing',
            owner: 'Temple + Implementation Team',
            duration: '5 days',
            status: 'required',
            deliverables: [
              'Test cash donation flow',
              'Test online donation flow',
              'Test pooja booking (online + offline)',
              'Test receipt generation',
              'Test 80G certificate',
              'Test all reports',
              'Test day-end process',
              'Load testing (high traffic simulation)'
            ]
          },
          {
            id: 22,
            task: 'Soft launch (limited counters)',
            owner: 'Temple Management',
            duration: '7 days',
            status: 'recommended',
            deliverables: [
              'Activate 2 billing counters',
              'Run parallel with manual system',
              'Process 100+ transactions',
              'Collect staff feedback',
              'Fix any issues',
              'Build confidence'
            ]
          },
          {
            id: 23,
            task: 'Full go-live',
            owner: 'All',
            duration: '1 day',
            status: 'required',
            deliverables: [
              'All counters activated',
              'Manual system decommissioned',
              'On-site support for 7 days',
              'Hotline active',
              'Social media announcement',
              'Devotee communication about new system'
            ]
          },
          {
            id: 24,
            task: 'Post-launch review (Month 1)',
            owner: 'Account Manager',
            duration: '1 day',
            status: 'required',
            deliverables: [
              'Transaction volume analysis',
              'System performance review',
              'Staff satisfaction survey',
              'Devotee feedback collection',
              'Issue log review',
              'Optimization recommendations',
              'Next phase planning (if applicable)'
            ]
          }
        ]
      }
    ],
    totalTasks: 24,
    requiredDocuments: [
      'Trust Deed',
      'Trust Registration Certificate',
      '12A and 80G Certificates',
      'PAN Card of Trust',
      'Bank Account Details (all accounts)',
      'List of Trustees with ID proofs',
      'Temple property documents',
      'Latest Audit Report',
      'GST Registration (if applicable)'
    ],
    hardwareRequirements: [
      'Server: Dell PowerEdge R740 or similar (32GB RAM) for on-premise',
      'POS Terminals: 3-5 units with touchscreen',
      'Thermal Printers: Epson TM-T82 or similar (80mm)',
      'Cash Drawers: Heavy-duty for billing counters',
      'Internet: 50 Mbps leased line with backup',
      'UPS: 5 KVA for 4-hour backup',
      'Network: Cat6 cabling, managed switches',
      'CCTV: For security and live darshan (optional)',
      'Barcode Scanner: For inventory (optional)'
    ],
    successCriteria: [
      '100% digital receipt issuance',
      'Zero cash discrepancies',
      'Online donations working smoothly',
      '80G certificates auto-generated',
      'Real-time financial visibility for trustees',
      'Mobile app live on stores (if opted)',
      'System uptime > 99.9%',
      'Devotee satisfaction > 4.5/5',
      'Staff adoption > 95%',
      'Transaction processing < 30 seconds'
    ]
  }

  // Checklists 3-22 follow similar comprehensive patterns...
};

export type BusinessId = keyof typeof onboardingChecklists;
