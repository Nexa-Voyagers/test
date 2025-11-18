'use client';

import { useState } from 'react';
import { useGet } from '@/hooks/useApi';
import { InventoryItem } from '@/types';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: 'name',
    header: 'Item Name',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as number;
      const reorderLevel = row.original.reorderLevel;
      const isLow = quantity <= reorderLevel;

      return (
        <div className="flex items-center gap-2">
          <span>{quantity} {row.original.unit}</span>
          {isLow && <AlertTriangle className="h-4 w-4 text-destructive" />}
        </div>
      );
    },
  },
  {
    accessorKey: 'reorderLevel',
    header: 'Reorder Level',
    cell: ({ row }) => `${row.getValue('reorderLevel')} ${row.original.unit}`,
  },
  {
    accessorKey: 'unitCost',
    header: 'Unit Cost',
    cell: ({ row }) => formatCurrency(row.getValue('unitCost')),
  },
  {
    accessorKey: 'lastRestocked',
    header: 'Last Restocked',
    cell: ({ row }) => {
      const date = row.getValue('lastRestocked');
      return date ? formatDate(date as string) : '-';
    },
  },
  {
    accessorKey: 'expiryDate',
    header: 'Expiry',
    cell: ({ row }) => {
      const date = row.getValue('expiryDate');
      return date ? formatDate(date as string) : '-';
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">Restock</Button>
        <Button variant="ghost" size="sm">Edit</Button>
      </div>
    ),
  },
];

export default function InventoryPage() {
  const { data: inventory, isLoading } = useGet<InventoryItem[]>(
    ['inventory'],
    '/inventory'
  );

  const lowStockItems = inventory?.filter(
    (item) => item.quantity <= item.reorderLevel
  ).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track and manage your inventory
            {lowStockItems > 0 && (
              <Badge variant="destructive" className="ml-2">
                {lowStockItems} low stock
              </Badge>
            )}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={inventory || []} />
      )}
    </div>
  );
}
