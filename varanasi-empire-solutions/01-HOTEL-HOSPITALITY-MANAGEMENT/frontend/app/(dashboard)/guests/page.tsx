'use client';

import { useState } from 'react';
import { useGet } from '@/hooks/useApi';
import { Guest } from '@/types';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const columns: ColumnDef<Guest>[] = [
  {
    accessorKey: 'firstName',
    header: 'Name',
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'nationality',
    header: 'Nationality',
  },
  {
    accessorKey: 'totalBookings',
    header: 'Bookings',
  },
  {
    accessorKey: 'vipStatus',
    header: 'VIP',
    cell: ({ row }) => (
      row.getValue('vipStatus') ?
        <Badge variant="default">VIP</Badge> :
        <Badge variant="outline">Regular</Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Registered',
    cell: ({ row }) => formatDate(row.getValue('createdAt')),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">View</Button>
        <Button variant="ghost" size="sm">Edit</Button>
      </div>
    ),
  },
];

export default function GuestsPage() {
  const { data: guests, isLoading } = useGet<Guest[]>(
    ['guests'],
    '/guests'
  );

  const vipGuests = guests?.filter(g => g.vipStatus).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Guest Management</h1>
          <p className="text-muted-foreground">
            Total Guests: {guests?.length || 0} | VIP: {vipGuests}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={guests || []} />
      )}
    </div>
  );
}
