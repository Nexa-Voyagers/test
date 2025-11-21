'use client';

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Manager',
    status: 'active',
    joinDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'User',
    status: 'inactive',
    joinDate: '2024-03-10',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'Manager',
    status: 'active',
    joinDate: '2024-01-25',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'User',
    status: 'active',
    joinDate: '2024-04-05',
  },
];

export default function UsersPage() {
  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => <span className="font-medium">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => <span className="text-muted-foreground">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: (info) => <Badge variant="outline">{info.getValue() as string}</Badge>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <Badge variant={status === 'active' ? 'default' : 'secondary'}>
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'joinDate',
        header: 'Join Date',
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return <span>{date.toLocaleDateString()}</span>;
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
        </div>
        <Button>Add User</Button>
      </div>

      <DataTable
        columns={columns}
        data={mockUsers}
        title="User Directory"
        description="View and manage all users in the system"
        searchableColumns={['name', 'email']}
        pageSize={10}
      />
    </div>
  );
}
