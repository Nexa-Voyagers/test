# Varanasi Empire Solutions - Frontend Starter Template

A comprehensive Next.js 14 frontend starter template with Shadcn/UI, designed for building enterprise-grade applications.

## Features

- **Next.js 14** with App Router
- **React 18** with Server Components
- **TypeScript** for type safety
- **Shadcn/UI** component library
- **TailwindCSS** for styling
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching
- **Zustand** for state management
- **Dark mode support** with next-themes
- **Authentication flow** with JWT
- **Protected routes** wrapper
- **Data table** with sorting, filtering, pagination
- **Error boundaries** and loading states
- **Toast notifications** with react-hot-toast
- **Responsive design** for all screen sizes

## Project Structure

```
/app
  /(auth)                 # Authentication pages
    /login
    /register
  /(dashboard)            # Protected dashboard
    /layout.tsx
    /page.tsx
    /users
    /settings
  /layout.tsx            # Root layout
/components
  /ui                    # Shadcn/UI components
  /auth                  # Authentication forms
  /layout                # Layout components (sidebar, header)
  /data-table            # Data table component
/hooks
  /useAuth.ts           # Authentication hook
  /useDebounce.ts       # Debounce hook
  /useApi.ts            # API hook
  /usePagination.ts     # Pagination hook
/lib
  /api.ts               # Axios instance with interceptors
  /auth.ts              # Auth utilities
  /utils.ts             # General utilities
/store
  /authStore.ts         # Zustand auth store
/styles
  /globals.css          # Global styles
/types
  /index.ts             # TypeScript types
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend-starter
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure the following in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Varanasi Empire Solutions
```

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run add:component` - Add new Shadcn/UI component

## Usage Examples

### Using the Data Table

```tsx
import { DataTable } from '@/components/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<YourType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  // ... more columns
];

export function YourPage() {
  return (
    <DataTable
      columns={columns}
      data={data}
      title="Your Title"
      searchableColumns={['id', 'name']}
    />
  );
}
```

### Using Authentication

```tsx
import { useAuth } from '@/hooks/useAuth';

export function YourComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <>
      {isAuthenticated && <p>Hello, {user?.name}</p>}
    </>
  );
}
```

### Using Protected Routes

```tsx
import { ProtectedRoute } from '@/components/auth/protected-route';

export function YourLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}
```

### Using Form Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Using API Calls

```tsx
import { get, post, put, remove } from '@/lib/api';

// GET request
const users = await get<User[]>('/users');

// POST request
const newUser = await post<User>('/users', { name: 'John', email: 'john@example.com' });

// PUT request
const updatedUser = await put<User>('/users/1', { name: 'Jane' });

// DELETE request
await remove('/users/1');
```

### Using Zustand Store

```tsx
import { useAuthStore } from '@/store/authStore';

export function MyComponent() {
  const { user, isAuthenticated, login } = useAuthStore();

  return (
    <>
      {isAuthenticated && <p>{user?.name}</p>}
    </>
  );
}
```

## Adding Shadcn/UI Components

To add more Shadcn/UI components:

```bash
npm run add:component button
npm run add:component input
npm run add:component select
```

Available components can be found at [https://ui.shadcn.com](https://ui.shadcn.com)

## Configuration Files

### next.config.js
- React strict mode enabled
- Security headers configured
- Environment variables setup
- Redirects configuration

### tailwind.config.js
- Shadcn/UI theme colors
- Custom animations
- Responsive breakpoints

### tsconfig.json
- Strict mode enabled
- Path aliases configured
- Module resolution setup

## Customization

### Theme Colors
Edit `tailwind.config.js` to customize colors:
```js
colors: {
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  // ... more colors
}
```

### Sidebar Navigation
Edit `app/(dashboard)/layout.tsx` to customize sidebar links:
```tsx
const sidebarLinks: SidebarLink[] = [
  {
    id: '1',
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  // ... more links
];
```

### API Configuration
Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=your-api-url
```

## API Integration

The template includes a pre-configured Axios instance with:
- Automatic JWT token injection
- Request/response interceptors
- Token refresh handling
- Error handling
- Type safety

See `/lib/api.ts` for more details.

## Best Practices

1. **Type Safety**: Always use TypeScript types for components and data
2. **Validation**: Use Zod for form validation
3. **Error Handling**: Wrap components in ErrorBoundary
4. **Performance**: Use React.memo and useMemo for optimization
5. **Security**: Never expose sensitive data in client-side code
6. **Testing**: Write tests for components and utilities

## Troubleshooting

### Port already in use
```bash
npm run dev -- -p 3001
```

### Clear cache and rebuild
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Type errors
```bash
npm run type-check
```

## License

MIT

## Support

For issues and questions, please create an issue in the repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
