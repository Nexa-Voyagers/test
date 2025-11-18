'use client';

import { useState } from 'react';
import { useGet } from '@/hooks/useApi';
import { Housekeeping } from '@/types';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatRelativeTime } from '@/lib/utils';

const columns: ColumnDef<Housekeeping>[] = [
  {
    accessorKey: 'roomId',
    header: 'Room',
    cell: ({ row }) => 'Room #', // Would need to join with room data
  },
  {
    accessorKey: 'taskType',
    header: 'Task Type',
    cell: ({ row }) => {
      const type = row.getValue('taskType') as string;
      return <Badge variant="outline">{type}</Badge>;
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string;
      const variant =
        priority === 'urgent' ? 'destructive' :
        priority === 'high' ? 'secondary' : 'outline';
      return <Badge variant={variant}>{priority}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant =
        status === 'completed' ? 'default' :
        status === 'in-progress' ? 'secondary' :
        status === 'cancelled' ? 'destructive' : 'outline';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => row.getValue('assignedTo') || 'Unassigned',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatRelativeTime(row.getValue('createdAt')),
  },
  {
    accessorKey: 'completedAt',
    header: 'Completed',
    cell: ({ row }) => {
      const date = row.getValue('completedAt');
      return date ? formatDate(date as string, 'time') : '-';
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">Assign</Button>
        <Button variant="ghost" size="sm">Complete</Button>
      </div>
    ),
  },
];

export default function HousekeepingPage() {
  const { data: tasks, isLoading } = useGet<Housekeeping[]>(
    ['housekeeping'],
    '/housekeeping'
  );

  const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;
  const inProgressTasks = tasks?.filter(t => t.status === 'in-progress').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Housekeeping</h1>
          <p className="text-muted-foreground">
            Pending: {pendingTasks} | In Progress: {inProgressTasks}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={tasks || []} />
      )}
    </div>
  );
}
