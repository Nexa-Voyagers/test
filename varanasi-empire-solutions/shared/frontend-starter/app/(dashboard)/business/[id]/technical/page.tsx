'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const technicalDocs: Record<string, any> = {
  '1': {
    name: 'Hotel & Hospitality Management',

    database: {
      totalTables: 156,
      mainTables: [
        { name: 'properties', columns: 45, description: 'Hotel properties and branches' },
        { name: 'rooms', columns: 32, description: 'Room inventory with types and amenities' },
        { name: 'bookings', columns: 58, description: 'Reservation and booking records' },
        { name: 'guests', columns: 38, description: 'Guest profiles and preferences' },
        { name: 'rates', columns: 28, description: 'Dynamic pricing and rate plans' },
        { name: 'housekeeping', columns: 24, description: 'Cleaning and maintenance schedules' },
        { name: 'pos_transactions', columns: 42, description: 'Point of sale records' },
        { name: 'invoices', columns: 36, description: 'Billing and payment records' },
        { name: 'ota_channels', columns: 22, description: 'OTA integration mappings' },
        { name: 'staff', columns: 28, description: 'Employee records and shifts' }
      ],
      schema: `
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  property_code VARCHAR(50) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10),
  phone VARCHAR(20),
  email VARCHAR(255),
  total_rooms INTEGER NOT NULL,
  star_rating DECIMAL(2,1),
  check_in_time TIME DEFAULT '14:00',
  check_out_time TIME DEFAULT '11:00',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  room_number VARCHAR(20) NOT NULL,
  room_type_id UUID REFERENCES room_types(id),
  floor INTEGER,
  status VARCHAR(20) DEFAULT 'available',
  base_rate DECIMAL(10,2),
  max_occupancy INTEGER,
  amenities JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref VARCHAR(50) UNIQUE NOT NULL,
  property_id UUID REFERENCES properties(id),
  room_id UUID REFERENCES rooms(id),
  guest_id UUID REFERENCES guests(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  total_amount DECIMAL(10,2),
  booking_source VARCHAR(50),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ... 153 more tables
      `
    },

    apis: {
      totalEndpoints: 487,
      categories: [
        {
          name: 'Property Management',
          count: 45,
          endpoints: [
            'GET /api/v1/properties - List all properties',
            'POST /api/v1/properties - Create new property',
            'GET /api/v1/properties/{id} - Get property details',
            'PUT /api/v1/properties/{id} - Update property',
            'DELETE /api/v1/properties/{id} - Delete property'
          ]
        },
        {
          name: 'Room Management',
          count: 68,
          endpoints: [
            'GET /api/v1/rooms - List all rooms',
            'POST /api/v1/rooms - Create room',
            'GET /api/v1/rooms/availability - Check availability',
            'PUT /api/v1/rooms/{id}/status - Update room status',
            'GET /api/v1/rooms/types - Get room types'
          ]
        },
        {
          name: 'Booking Management',
          count: 92,
          endpoints: [
            'POST /api/v1/bookings - Create booking',
            'GET /api/v1/bookings/{ref} - Get booking details',
            'PUT /api/v1/bookings/{ref}/modify - Modify booking',
            'DELETE /api/v1/bookings/{ref}/cancel - Cancel booking',
            'POST /api/v1/bookings/block - Block rooms'
          ]
        },
        {
          name: 'Guest Management',
          count: 54,
          endpoints: [
            'GET /api/v1/guests - List guests',
            'POST /api/v1/guests - Create guest profile',
            'GET /api/v1/guests/{id} - Get guest details',
            'GET /api/v1/guests/{id}/history - Booking history'
          ]
        },
        {
          name: 'Housekeeping',
          count: 42,
          endpoints: [
            'GET /api/v1/housekeeping/tasks - Get cleaning tasks',
            'PUT /api/v1/housekeeping/tasks/{id} - Update task',
            'POST /api/v1/housekeeping/schedule - Create schedule'
          ]
        },
        {
          name: 'Billing & Payments',
          count: 78,
          endpoints: [
            'POST /api/v1/invoices - Generate invoice',
            'GET /api/v1/invoices/{id} - Get invoice',
            'POST /api/v1/payments - Process payment',
            'GET /api/v1/payments/methods - Payment methods'
          ]
        },
        {
          name: 'Reports & Analytics',
          count: 56,
          endpoints: [
            'GET /api/v1/reports/occupancy - Occupancy report',
            'GET /api/v1/reports/revenue - Revenue report',
            'GET /api/v1/analytics/dashboard - Dashboard stats'
          ]
        },
        {
          name: 'OTA Integration',
          count: 52,
          endpoints: [
            'POST /api/v1/ota/sync - Sync with OTAs',
            'GET /api/v1/ota/bookings - OTA bookings',
            'PUT /api/v1/ota/rates - Update OTA rates'
          ]
        }
      ]
    },

    deployment: {
      requirements: {
        server: 'Ubuntu 20.04 LTS or higher',
        cpu: '4 cores (8 recommended for Enterprise)',
        ram: '8GB (16GB recommended for Enterprise)',
        storage: '100GB SSD (500GB for Enterprise)',
        database: 'PostgreSQL 15+',
        cache: 'Redis 7+'
      },
      steps: [
        '1. Clone repository: git clone https://github.com/varanasi-empire/hotel-management.git',
        '2. Install dependencies: npm install',
        '3. Configure environment: cp .env.example .env',
        '4. Setup database: npm run db:migrate',
        '5. Seed initial data: npm run db:seed',
        '6. Build frontend: npm run build',
        '7. Start services: pm2 start ecosystem.config.js',
        '8. Configure Nginx reverse proxy',
        '9. Setup SSL with Let\'s Encrypt',
        '10. Configure backup cron jobs'
      ]
    },

    features: {
      total: 245,
      core: [
        'Multi-property management',
        'Room inventory & rates',
        'Online booking engine',
        'Guest CRM',
        'Housekeeping automation',
        'POS integration',
        'Channel manager (OTA)',
        'Revenue management',
        'Reports & analytics',
        'Mobile app'
      ],
      enterprise: [
        'AI dynamic pricing',
        'Blockchain ledger',
        'Custom integrations',
        'White labeling',
        'Advanced analytics',
        'API access',
        'Multi-currency',
        'Multi-language'
      ]
    }
  },

  '2': {
    name: 'Temple Management System',

    database: {
      totalTables: 124,
      mainTables: [
        { name: 'temples', columns: 38, description: 'Temple information and hierarchy' },
        { name: 'donations', columns: 45, description: 'All donation records with receipts' },
        { name: 'devotees', columns: 32, description: 'Devotee profiles and preferences' },
        { name: 'events', columns: 42, description: 'Religious events and festivals' },
        { name: 'poojas', columns: 36, description: 'Pooja types and bookings' },
        { name: 'priests', columns: 28, description: 'Priest details and schedules' },
        { name: 'inventory', columns: 24, description: 'Prasad and ritual items' },
        { name: 'receipts', columns: 32, description: 'Tax receipts and acknowledgments' },
        { name: 'accounts', columns: 48, description: 'Financial accounting' }
      ],
      schema: `
CREATE TABLE donations (
  id UUID PRIMARY KEY,
  receipt_no VARCHAR(50) UNIQUE NOT NULL,
  temple_id UUID REFERENCES temples(id),
  devotee_id UUID REFERENCES devotees(id),
  amount DECIMAL(12,2) NOT NULL,
  donation_type VARCHAR(50),
  purpose TEXT,
  payment_mode VARCHAR(20),
  transaction_id VARCHAR(100),
  tax_exemption_applicable BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE poojas (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  duration INTEGER, -- in minutes
  priest_required INTEGER DEFAULT 1,
  base_fee DECIMAL(10,2),
  materials_included JSONB,
  created_at TIMESTAMP
);
-- ... 122 more tables
      `
    },

    apis: {
      totalEndpoints: 398,
      categories: [
        {
          name: 'Donation Management',
          count: 86,
          endpoints: [
            'POST /api/v1/donations - Record donation',
            'GET /api/v1/donations/{id} - Get donation details',
            'GET /api/v1/donations/receipts/{no} - Get receipt',
            'POST /api/v1/donations/bulk - Bulk import'
          ]
        },
        {
          name: 'Devotee Management',
          count: 52,
          endpoints: [
            'GET /api/v1/devotees - List devotees',
            'POST /api/v1/devotees - Register devotee',
            'GET /api/v1/devotees/{id}/history - Donation history'
          ]
        },
        {
          name: 'Pooja Booking',
          count: 68,
          endpoints: [
            'GET /api/v1/poojas - List available poojas',
            'POST /api/v1/poojas/book - Book pooja',
            'GET /api/v1/poojas/schedule - Get schedule'
          ]
        },
        {
          name: 'Event Management',
          count: 45,
          endpoints: [
            'GET /api/v1/events - List events',
            'POST /api/v1/events - Create event',
            'GET /api/v1/events/{id}/attendees - Event attendees'
          ]
        }
      ]
    },

    deployment: {
      requirements: {
        server: 'Ubuntu 20.04 LTS',
        cpu: '2 cores (4 for Enterprise)',
        ram: '4GB (8GB for Enterprise)',
        storage: '50GB SSD',
        database: 'PostgreSQL 15+',
        cache: 'Redis 7+'
      },
      steps: [
        '1. Clone repository',
        '2. Install dependencies',
        '3. Configure environment',
        '4. Setup database',
        '5. Import temple data',
        '6. Configure payment gateway',
        '7. Setup SMS/Email services',
        '8. Deploy frontend',
        '9. Configure SSL',
        '10. Test receipt generation'
      ]
    }
  }

  // Add all 22 solutions...
};

export default function TechnicalDocumentationPage() {
  const params = useParams();
  const id = params.id as string;
  const docs = technicalDocs[id];

  if (!docs) {
    return <div>Documentation not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{docs.name}</h1>
        <p className="text-muted-foreground">Complete Technical Documentation</p>
      </div>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="database">Database Schema</TabsTrigger>
          <TabsTrigger value="apis">API Documentation</TabsTrigger>
          <TabsTrigger value="deployment">Deployment Guide</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Architecture</CardTitle>
              <CardDescription>Total Tables: {docs.database.totalTables}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Main Tables</h3>
                <div className="space-y-2">
                  {docs.database.mainTables.map((table: any, idx: number) => (
                    <div key={idx} className="flex items-start justify-between p-3 border rounded">
                      <div className="flex-1">
                        <code className="font-mono text-sm font-semibold">{table.name}</code>
                        <p className="text-sm text-muted-foreground mt-1">{table.description}</p>
                      </div>
                      <Badge variant="outline">{table.columns} columns</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Schema Example</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  <code>{docs.database.schema}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Total Endpoints: {docs.apis.totalEndpoints}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {docs.apis.categories.map((category: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{category.name}</h3>
                    <Badge>{category.count} endpoints</Badge>
                  </div>
                  <div className="space-y-1 pl-4">
                    {category.endpoints.map((endpoint: string, eidx: number) => (
                      <code key={eidx} className="block text-sm font-mono p-2 bg-muted rounded">
                        {endpoint}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Guide</CardTitle>
              <CardDescription>Step-by-step deployment instructions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">System Requirements</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(docs.deployment.requirements).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded">
                      <span className="capitalize font-medium">{key}:</span>
                      <code className="text-sm">{value as string}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Deployment Steps</h3>
                <ol className="space-y-2">
                  {docs.deployment.steps.map((step: string, idx: number) => (
                    <li key={idx} className="p-3 border rounded">
                      <code className="text-sm">{step}</code>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Features Overview</CardTitle>
              <CardDescription>Total Features: {docs.features.total}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Core Features (Standard + Enterprise)</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {docs.features.core.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-2 border rounded">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Enterprise-Only Features</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {docs.features.enterprise?.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-2 border rounded bg-purple-50">
                      <Badge className="bg-purple-600">Enterprise</Badge>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{docs.database.totalTables}</div>
              <p className="text-sm text-muted-foreground">Database Tables</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{docs.apis.totalEndpoints}</div>
              <p className="text-sm text-muted-foreground">API Endpoints</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{docs.features.total}</div>
              <p className="text-sm text-muted-foreground">Total Features</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
