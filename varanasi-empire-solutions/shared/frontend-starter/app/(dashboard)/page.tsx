'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const businesses = [
  { id: 1, name: 'Hotel & Hospitality Management', icon: '🏨', category: 'Hospitality', status: 'Complete', features: ['Room Booking', 'Guest Management', 'Housekeeping', 'Billing', 'Reports'] },
  { id: 2, name: 'Temple Management System', icon: '🛕', category: 'Religious', status: 'Complete', features: ['Donation Tracking', 'Event Management', 'Devotee Records', 'Pooja Booking'] },
  { id: 3, name: 'Restaurant POS Management', icon: '🍽️', category: 'Food & Beverage', status: 'Complete', features: ['Order Management', 'Table Booking', 'Kitchen Display', 'Inventory', 'Billing'] },
  { id: 4, name: 'Travel & Tour Agency', icon: '✈️', category: 'Travel', status: 'Complete', features: ['Package Booking', 'Itinerary Planning', 'Customer Management', 'Payments'] },
  { id: 5, name: 'Hospital Management System', icon: '🏥', category: 'Healthcare', status: 'Complete', features: ['Patient Records', 'Appointments', 'Pharmacy', 'Lab Reports', 'Billing'] },
  { id: 6, name: 'Real Estate Management', icon: '🏠', category: 'Real Estate', status: 'Complete', features: ['Property Listings', 'Lead Management', 'Document Management', 'Transactions'] },
  { id: 7, name: 'Pharmacy Management', icon: '💊', category: 'Healthcare', status: 'Complete', features: ['Inventory', 'Prescriptions', 'Expiry Tracking', 'Sales', 'Suppliers'] },
  { id: 8, name: 'Jewellery Store Management', icon: '💎', category: 'Retail', status: 'Complete', features: ['Inventory', 'Custom Orders', 'Gold Rate', 'Customer Ledger', 'Billing'] },
  { id: 9, name: 'Saree & Textile Store', icon: '👗', category: 'Retail', status: 'Complete', features: ['Inventory', 'Alterations', 'Customer Records', 'Sales', 'Returns'] },
  { id: 10, name: 'Educational Institute', icon: '🎓', category: 'Education', status: 'Complete', features: ['Student Management', 'Attendance', 'Fees', 'Exams', 'Reports'] },
  { id: 11, name: 'Event & Wedding Planning', icon: '💒', category: 'Events', status: 'Complete', features: ['Event Booking', 'Vendor Management', 'Guest Lists', 'Budget Tracking'] },
  { id: 12, name: 'Gym & Fitness Center', icon: '🏋️', category: 'Fitness', status: 'Complete', features: ['Membership', 'Trainer Management', 'Equipment', 'Attendance', 'Diet Plans'] },
  { id: 13, name: 'Professional Services Hub', icon: '💼', category: 'Services', status: 'Complete', features: ['Client Management', 'Project Tracking', 'Time Sheets', 'Invoicing'] },
  { id: 14, name: 'School Management System', icon: '🏫', category: 'Education', status: 'Complete', features: ['Admissions', 'Classes', 'Teachers', 'Library', 'Transport'] },
  { id: 15, name: 'Food Production & Distribution', icon: '🍕', category: 'Food & Beverage', status: 'Complete', features: ['Production', 'Quality Control', 'Distribution', 'Orders', 'Inventory'] },
  { id: 16, name: 'Transport & Logistics', icon: '🚚', category: 'Logistics', status: 'Complete', features: ['Fleet Management', 'Route Planning', 'Driver Management', 'Tracking'] },
  { id: 17, name: 'CA Firm Management', icon: '📊', category: 'Finance', status: 'Complete', features: ['Client Files', 'Tax Filing', 'Compliance', 'Document Management'] },
  { id: 18, name: 'Health & Fitness Center', icon: '🧘', category: 'Fitness', status: 'Complete', features: ['Classes', 'Bookings', 'Trainers', 'Membership', 'Health Records'] },
  { id: 19, name: 'Laundry & Dry Cleaning', icon: '🧺', category: 'Services', status: 'Complete', features: ['Order Tracking', 'Pricing', 'Delivery', 'Customer Records'] },
  { id: 20, name: 'Home Services Platform', icon: '🔧', category: 'Services', status: 'Complete', features: ['Service Booking', 'Provider Management', 'Scheduling', 'Payments'] },
  { id: 21, name: 'Arts & Crafts Studio', icon: '🎨', category: 'Creative', status: 'Complete', features: ['Classes', 'Materials', 'Projects', 'Student Progress', 'Events'] },
  { id: 22, name: 'Spa & Salon Management', icon: '💆', category: 'Beauty', status: 'Complete', features: ['Appointments', 'Services', 'Staff Management', 'Inventory', 'Packages'] },
];

const categories = ['All', ...new Set(businesses.map(b => b.category))];

export default function DashboardPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome, {user?.name || 'User'}!</h1>
        <p className="text-muted-foreground">
          Varanasi Empire Solutions - 22 Complete Business Management Systems
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary">22</div>
            <p className="text-sm text-muted-foreground">Business Apps</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600">100%</div>
            <p className="text-sm text-muted-foreground">Complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600">12</div>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600">100+</div>
            <p className="text-sm text-muted-foreground">Features</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search businesses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Business Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBusinesses.map((business) => (
          <Link key={business.id} href={`/business/${business.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full hover:border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{business.icon}</span>
                  <Badge variant="secondary">{business.category}</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{business.name}</CardTitle>
                <CardDescription>
                  <Badge variant="default" className="bg-green-600">
                    {business.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-3">
                  {business.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full" variant="outline">Open System</Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Footer Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">Varanasi Empire Solutions</p>
            <p className="text-sm text-muted-foreground">
              Complete business management solutions for modern enterprises. Each system includes frontend, backend API, and database schema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
