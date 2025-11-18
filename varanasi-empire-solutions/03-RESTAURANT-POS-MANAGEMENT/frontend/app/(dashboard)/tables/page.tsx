'use client';

import { useState } from 'react';
import { useGet } from '@/hooks/useApi';
import { Table as TableType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function TablesPage() {
  const { data: tables, isLoading } = useGet<TableType[]>(
    ['tables'],
    '/tables'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'occupied':
        return 'bg-red-500';
      case 'reserved':
        return 'bg-blue-500';
      case 'cleaning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Table Management</h1>
          <p className="text-muted-foreground">View and manage table status</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Table
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {tables?.map((table) => (
            <Card
              key={table.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg',
                table.status === 'occupied' && 'border-red-500',
                table.status === 'reserved' && 'border-blue-500'
              )}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-2xl">
                  Table {table.number}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-center">
                  <Badge className={getStatusColor(table.status)}>
                    {table.status}
                  </Badge>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Capacity: {table.capacity}
                </div>
                {table.floor && (
                  <div className="text-center text-sm text-muted-foreground">
                    Floor: {table.floor}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
