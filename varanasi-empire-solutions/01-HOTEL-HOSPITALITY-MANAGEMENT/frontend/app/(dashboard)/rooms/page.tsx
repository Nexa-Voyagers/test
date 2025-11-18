'use client';

import { useState } from 'react';
import { useGet } from '@/hooks/useApi';
import { Room } from '@/types';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

const columns: ColumnDef<Room>[] = [
  {
    accessorKey: 'roomNumber',
    header: 'Room #',
  },
  {
    accessorKey: 'floor',
    header: 'Floor',
  },
  {
    accessorKey: 'roomType',
    header: 'Type',
  },
  {
    accessorKey: 'bedType',
    header: 'Bed Type',
  },
  {
    accessorKey: 'capacity',
    header: 'Capacity',
    cell: ({ row }) => `${row.getValue('capacity')} guests`,
  },
  {
    accessorKey: 'basePrice',
    header: 'Price/Night',
    cell: ({ row }) => formatCurrency(row.getValue('basePrice')),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant =
        status === 'available' ? 'default' :
        status === 'occupied' ? 'destructive' :
        status === 'reserved' ? 'secondary' : 'outline';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">Edit</Button>
        <Button variant="ghost" size="sm">Details</Button>
      </div>
    ),
  },
];

export default function RoomsPage() {
  const { data: rooms, isLoading } = useGet<Room[]>(
    ['rooms'],
    '/rooms'
  );

  const availableRooms = rooms?.filter(r => r.status === 'available').length || 0;
  const occupiedRooms = rooms?.filter(r => r.status === 'occupied').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Room Management</h1>
          <p className="text-muted-foreground">
            Available: {availableRooms} | Occupied: {occupiedRooms}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={rooms || []} />
      )}
    </div>
  );
}
