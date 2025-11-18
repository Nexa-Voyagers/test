'use client';

import { useGet } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DoorOpen, DollarSign, Users } from 'lucide-react';
import { DashboardStats } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { data: stats, isLoading } = useGet<DashboardStats>(
    ['dashboard-stats'],
    '/dashboard/stats'
  );

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: Calendar,
      change: stats?.bookingsGrowth ? `+${stats.bookingsGrowth}%` : '0%',
    },
    {
      title: 'Check-ins Today',
      value: stats?.checkInsToday || 0,
      icon: Users,
      change: '',
    },
    {
      title: 'Available Rooms',
      value: stats?.availableRooms || 0,
      icon: DoorOpen,
      change: '',
    },
    {
      title: 'Total Revenue',
      value: stats ? formatCurrency(stats.totalRevenue) : '₹0',
      icon: DollarSign,
      change: stats?.revenueGrowth ? `+${stats.revenueGrowth}%` : '0%',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your hotel operations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.occupancyRate ? `${stats.occupancyRate}%` : '0%'}
            </div>
            <p className="text-sm text-muted-foreground">Current occupancy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Check-outs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.checkOutsToday || 0}</div>
            <p className="text-sm text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
