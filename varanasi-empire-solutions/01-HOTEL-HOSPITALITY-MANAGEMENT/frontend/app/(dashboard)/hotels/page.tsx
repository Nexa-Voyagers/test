'use client';

import { useState } from 'react';
import { useGet } from '@/hooks/useApi';
import { Hotel } from '@/types';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

const columns: ColumnDef<Hotel>[] = [
  {
    accessorKey: 'name',
    header: 'Hotel Name',
  },
  {
    accessorKey: 'city',
    header: 'Location',
    cell: ({ row }) => `${row.original.city}, ${row.original.state}`,
  },
  {
    accessorKey: 'starRating',
    header: 'Rating',
    cell: ({ row }) => `${row.getValue('starRating')} Star`,
  },
  {
    accessorKey: 'totalRooms',
    header: 'Total Rooms',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant =
        status === 'active' ? 'default' :
        status === 'maintenance' ? 'secondary' : 'destructive';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">Edit</Button>
        <Button variant="ghost" size="sm">View</Button>
      </div>
    ),
  },
];

export default function HotelsPage() {
  const { data: hotels, isLoading } = useGet<Hotel[]>(
    ['hotels'],
    '/hotels'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hotels</h1>
          <p className="text-muted-foreground">Manage your hotel properties</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Hotel
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={hotels || []} />
      )}
    </div>
  );
}
