'use client';

import { useState } from 'react';
import { useGet } from '@/hooks/useApi';
import { OccupancyReport } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, DoorOpen, DollarSign, BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('today');

  const { data: occupancyReport, isLoading } = useGet<OccupancyReport>(
    ['occupancy-report', dateRange],
    `/reports/occupancy?range=${dateRange}`
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">View occupancy and revenue reports</p>
      </div>

      <Tabs defaultValue="today" onValueChange={setDateRange}>
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="year">This Year</TabsTrigger>
        </TabsList>

        <TabsContent value={dateRange} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {occupancyReport?.totalRooms || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Occupied</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {occupancyReport?.occupiedRooms || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {occupancyReport?.occupancyRate || 0}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">ADR</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {occupancyReport ? formatCurrency(occupancyReport.averageDailyRate) : '₹0'}
                </div>
                <p className="text-xs text-muted-foreground">Average Daily Rate</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Occupancy by Room Type</CardTitle>
            </CardHeader>
            <CardContent>
              {occupancyReport?.occupancyByRoomType && occupancyReport.occupancyByRoomType.length > 0 ? (
                <div className="space-y-4">
                  {occupancyReport.occupancyByRoomType.map((roomType, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{roomType.roomType}</p>
                        <p className="text-sm text-muted-foreground">
                          {roomType.occupied}/{roomType.total} rooms
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{roomType.rate}%</p>
                        <p className="text-sm text-muted-foreground">Occupancy</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Per Available Room (RevPAR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {occupancyReport ? formatCurrency(occupancyReport.revenuePerAvailableRoom) : '₹0'}
              </div>
              <p className="text-sm text-muted-foreground">
                Key performance indicator for hotel revenue
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
