'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      description: 'Active users this month',
      change: '+12% from last month',
    },
    {
      title: 'Revenue',
      value: '$54,231',
      description: 'Total revenue',
      change: '+8% from last month',
    },
    {
      title: 'Tasks',
      value: '42',
      description: 'Pending tasks',
      change: '5 due today',
    },
    {
      title: 'Conversion',
      value: '3.2%',
      description: 'Conversion rate',
      change: '+0.5% from last month',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Updated user profile', time: '2 hours ago' },
                { action: 'Created new report', time: '5 hours ago' },
                { action: 'Exported data', time: '1 day ago' },
                { action: 'Modified settings', time: '2 days ago' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <p className="text-sm">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Create New Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              View Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Manage Users
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Export Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <p className="text-sm">All systems operational</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="capitalize">
              {user?.role}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Member Since</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
