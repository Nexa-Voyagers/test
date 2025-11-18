'use client';

import { useState } from 'react';
import { useGet } from '@/hooks/useApi';
import { Booking } from '@/types';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'bookingNumber',
    header: 'Booking #',
  },
  {
    accessorKey: 'guestId',
    header: 'Guest',
    cell: ({ row }) => 'Guest Name', // Would need to join with guest data
  },
  {
    accessorKey: 'roomId',
    header: 'Room',
    cell: ({ row }) => 'Room #', // Would need to join with room data
  },
  {
    accessorKey: 'checkInDate',
    header: 'Check-in',
    cell: ({ row }) => formatDate(row.getValue('checkInDate')),
  },
  {
    accessorKey: 'checkOutDate',
    header: 'Check-out',
    cell: ({ row }) => formatDate(row.getValue('checkOutDate')),
  },
  {
    accessorKey: 'numberOfNights',
    header: 'Nights',
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total',
    cell: ({ row }) => formatCurrency(row.getValue('totalAmount')),
  },
  {
    accessorKey: 'bookingStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('bookingStatus') as string;
      const variant =
        status === 'confirmed' ? 'default' :
        status === 'checked-in' ? 'secondary' :
        status === 'checked-out' ? 'outline' : 'destructive';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment',
    cell: ({ row }) => {
      const status = row.getValue('paymentStatus') as string;
      return (
        <Badge variant={status === 'paid' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];

export default function BookingsPage() {
  const { data: bookings, isLoading } = useGet<Booking[]>(
    ['bookings'],
    '/bookings'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">View and manage reservations</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={bookings || []} />
      )}
    </div>
  );
}
