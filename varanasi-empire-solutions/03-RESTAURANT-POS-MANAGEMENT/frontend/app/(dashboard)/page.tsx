'use client';

import { useGet } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Table2, Package } from 'lucide-react';
import { DashboardStats } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { data: stats, isLoading } = useGet<DashboardStats>(
    ['dashboard-stats'],
    '/dashboard/stats'
  );

  const statCards = [
    {
      title: 'Today\'s Sales',
      value: stats ? formatCurrency(stats.todaySales) : '₹0',
      icon: DollarSign,
      change: stats?.salesGrowth ? `+${stats.salesGrowth}%` : '0%',
    },
    {
      title: 'Today\'s Orders',
      value: stats?.todayOrders || 0,
      icon: ShoppingCart,
      change: stats?.ordersGrowth ? `+${stats.ordersGrowth}%` : '0%',
    },
    {
      title: 'Active Tables',
      value: stats?.activeTables || 0,
      icon: Table2,
      change: '',
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockItems || 0,
      icon: Package,
      change: '',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your restaurant operations</p>
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
                <p className="text-xs text-muted-foreground">{stat.change} from yesterday</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
