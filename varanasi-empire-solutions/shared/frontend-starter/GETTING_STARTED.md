# Getting Started with Varanasi Empire Frontend Starter

## Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### 2. Configure Environment

Edit `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Varanasi Empire Solutions

# Authentication
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_AUTH_REFRESH_KEY=auth_refresh_token

# Features
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Key Features to Explore

### 1. Authentication Flow

The template includes a complete authentication system:

- **Login Page**: `/login` - Sign in with email and password
- **Register Page**: `/register` - Create a new account
- **Protected Routes**: Dashboard pages require authentication
- **Token Management**: Automatic JWT token handling and refresh

```tsx
// Use authentication in your components
import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) return <div>Please log in</div>;
  return <div>Welcome, {user?.name}</div>;
}
```

### 2. API Integration

The template provides a pre-configured API client:

```tsx
import { get, post, put, remove } from '@/lib/api';

// GET request
const users = await get<User[]>('/users');

// POST request with data
const newUser = await post<User>('/users', {
  name: 'John',
  email: 'john@example.com'
});

// PUT request to update
await put<User>('/users/1', { name: 'Jane' });

// DELETE request
await remove('/users/1');
```

### 3. Form Validation

Use Zod + React Hook Form for robust validation:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### 4. Data Table

The template includes a feature-rich data table:

```tsx
import { DataTable } from '@/components/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];

export function UsersPage() {
  return (
    <DataTable
      columns={columns}
      data={users}
      title="Users"
      searchableColumns={['name', 'email']}
      pageSize={10}
    />
  );
}
```

### 5. Shadcn/UI Components

All Shadcn/UI components are pre-configured:

```tsx
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### 6. State Management

Use Zustand for global state:

```tsx
import { useAuthStore } from '@/store/authStore';

export function MyComponent() {
  const { user, setUser } = useAuthStore();

  return <div>{user?.name}</div>;
}
```

## Project Structure Walkthrough

### `/app` - Application Routes

- `/(auth)/login` - Login page
- `/(auth)/register` - Register page
- `/(dashboard)` - Protected dashboard layout
- `/(dashboard)/page.tsx` - Dashboard home
- `/(dashboard)/users` - Users management
- `/(dashboard)/settings` - Settings page

### `/components` - Reusable Components

- `/ui` - Base UI components from Shadcn/UI
- `/auth` - Authentication components
- `/layout` - Layout components (sidebar, header)
- `/data-table` - Data table component

### `/hooks` - Custom Hooks

- `useAuth()` - Authentication management
- `useDebounce()` - Debounce values
- `useApi()` - API call management
- `usePagination()` - Pagination state

### `/lib` - Utilities & Helpers

- `api.ts` - Axios instance with interceptors
- `auth.ts` - Authentication utilities
- `utils.ts` - General utility functions

### `/store` - Global State

- `authStore.ts` - Zustand store for authentication

### `/types` - TypeScript Types

- `index.ts` - All shared types

## Common Tasks

### Adding a New Page

1. Create a new directory in `/app/(dashboard)/my-page`
2. Create `page.tsx` inside it:

```tsx
// app/(dashboard)/my-page/page.tsx
export default function MyPage() {
  return <div>My Page Content</div>;
}
```

### Adding a New Component

1. Create a component file in `/components`
2. Export it from the component's index file

```tsx
// components/my-component.tsx
export function MyComponent() {
  return <div>My Component</div>;
}
```

### Adding a New Shadcn/UI Component

```bash
npm run add:component select
npm run add:component checkbox
npm run add:component textarea
```

### Calling an API Endpoint

```tsx
import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api';

export function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => get('/users'),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return <div>{/* Display users */}</div>;
}
```

### Creating Protected Routes

```tsx
import { ProtectedRoute } from '@/components/auth/protected-route';

export function AdminPanel() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>Admin Content</div>
    </ProtectedRoute>
  );
}
```

## Testing

### Manual Testing

1. Start the dev server: `npm run dev`
2. Navigate to the login page
3. Test the registration flow
4. Access protected dashboard pages
5. Test data table features

### TypeScript Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Customization

### Change Colors

Edit `/styles/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 212.7 26.8% 83.9%;
  /* Change these values */
}
```

### Customize Sidebar Links

Edit `app/(dashboard)/layout.tsx`:

```tsx
const sidebarLinks: SidebarLink[] = [
  {
    id: '1',
    label: 'My Page',
    href: '/dashboard/my-page',
    icon: '📄',
  },
];
```

### Change Default Page Size

In data table or pagination hooks:

```tsx
<DataTable
  columns={columns}
  data={data}
  pageSize={25}  // Change this
/>
```

## Troubleshooting

### Port 3000 is in use

```bash
npm run dev -- -p 3001
```

### Clear Next.js cache

```bash
rm -rf .next
npm run dev
```

### Types not working

```bash
npm run type-check
```

### Module not found errors

Check the path aliases in `tsconfig.json`

## Next Steps

1. Customize the theme colors
2. Add your API endpoints
3. Create your pages and components
4. Test authentication flow
5. Deploy to production

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Shadcn/UI Components](https://ui.shadcn.com)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

## Support

For issues and questions:
1. Check the documentation
2. Review example pages in `/app`
3. Check component source code in `/components`
4. Create an issue in the repository

Happy coding!
