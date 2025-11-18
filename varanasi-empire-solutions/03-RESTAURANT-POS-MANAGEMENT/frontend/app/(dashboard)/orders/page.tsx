'use client';

import { useState } from 'react';
import { useGet } from '@/hooks/useApi';
import { Order } from '@/types';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderNumber',
    header: 'Order #',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return <Badge variant="outline">{type}</Badge>;
    },
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => formatCurrency(row.getValue('total')),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant =
        status === 'completed' ? 'default' :
        status === 'preparing' ? 'secondary' :
        status === 'cancelled' ? 'destructive' : 'outline';
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
    accessorKey: 'createdAt',
    header: 'Time',
    cell: ({ row }) => formatDate(row.getValue('createdAt'), 'time'),
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

export default function OrdersPage() {
  const { data: orders, isLoading } = useGet<Order[]>(
    ['orders'],
    '/orders'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">View and manage customer orders</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={orders || []} />
      )}
    </div>
  );
}
