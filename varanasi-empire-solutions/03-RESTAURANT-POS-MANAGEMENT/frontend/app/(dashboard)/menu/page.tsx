'use client';

import { useState } from 'react';
import { useGet } from '@/hooks/useApi';
import { MenuItem } from '@/types';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

const columns: ColumnDef<MenuItem>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => formatCurrency(row.getValue('price')),
  },
  {
    accessorKey: 'isVeg',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant={row.getValue('isVeg') ? 'default' : 'secondary'}>
        {row.getValue('isVeg') ? 'Veg' : 'Non-Veg'}
      </Badge>
    ),
  },
  {
    accessorKey: 'isAvailable',
    header: 'Available',
    cell: ({ row }) => (
      <Badge variant={row.getValue('isAvailable') ? 'default' : 'secondary'}>
        {row.getValue('isAvailable') ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    accessorKey: 'preparationTime',
    header: 'Prep Time',
    cell: ({ row }) => {
      const time = row.getValue('preparationTime') as number;
      return time ? `${time} min` : '-';
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">Edit</Button>
        <Button variant="ghost" size="sm">Delete</Button>
      </div>
    ),
  },
];

export default function MenuPage() {
  const { data: menuItems, isLoading } = useGet<MenuItem[]>(
    ['menu-items'],
    '/menu'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Manage your menu items and categories</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={menuItems || []} />
      )}
    </div>
  );
}
