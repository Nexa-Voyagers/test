'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks';
import { getInitials } from '@/lib/utils';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </p>
            <p className="text-muted-foreground">{user?.role || 'Staff'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
