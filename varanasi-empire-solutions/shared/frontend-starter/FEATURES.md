# Features Overview

This document provides a comprehensive overview of all features included in the Varanasi Empire Frontend Starter.

## Core Features

### 1. Next.js 14 with App Router
- Server-side rendering (SSR)
- Static site generation (SSG)
- Incremental static regeneration (ISR)
- API routes support
- Automatic code splitting
- Built-in optimization

**Files:**
- `app/layout.tsx` - Root layout
- `next.config.js` - Next.js configuration

### 2. React 18
- Concurrent features
- Automatic batching
- Suspense
- Server components
- Transitions

**Usage:**
```tsx
'use client'; // Client component

import { useState } from 'react';
```

### 3. TypeScript
- Full type safety
- Path aliases configured
- Strict mode enabled
- Type definitions for all libraries

**Configuration:**
- `tsconfig.json` - TypeScript configuration with path aliases

### 4. TailwindCSS
- Utility-first CSS
- Dark mode support via CSS variables
- Responsive design
- Custom animations
- Shadcn/UI theme integration

**Files:**
- `tailwind.config.js` - Configuration
- `styles/globals.css` - Global styles and CSS variables

## Authentication & Authorization

### JWT Authentication
- Token-based authentication
- Automatic token injection into requests
- Token refresh handling
- Secure token storage in localStorage
- Automatic logout on token expiration

**Files:**
- `lib/auth.ts` - Authentication utilities
- `lib/api.ts` - API client with auth interceptors
- `store/authStore.ts` - Zustand auth store

### Authentication Flow

1. **Login**
   - Email and password validation
   - JWT token received
   - Token automatically stored
   - Redirect to dashboard

2. **Token Refresh**
   - Automatic refresh on 401
   - Transparent to user
   - Prevents unnecessary logouts

3. **Logout**
   - Clear tokens from storage
   - Redirect to login page
   - Clean session state

**Components:**
- `LoginForm` - Login page with Zod validation
- `RegisterForm` - Registration with validation
- `ProtectedRoute` - Route protection wrapper

### Authorization

- Role-based access control (RBAC)
- Protected routes by role
- User role in context

```tsx
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

## State Management

### Zustand Store
- Lightweight global state management
- Persistence middleware
- TypeScript support
- Devtools integration

**Files:**
- `store/authStore.ts` - Auth state store

**Features:**
- User state
- Authentication state
- Loading states
- Error messages
- Actions for login/logout/register

```tsx
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated, login } = useAuthStore();
```

## API Integration

### Axios-Based HTTP Client
- Pre-configured with interceptors
- JWT token management
- Request/response transformation
- Error handling
- Type safety

**Files:**
- `lib/api.ts` - API client implementation

**Methods:**
- `get<T>(url, params?, config?)` - GET request
- `post<T>(url, data?, config?)` - POST request
- `put<T>(url, data?, config?)` - PUT request
- `patch<T>(url, data?, config?)` - PATCH request
- `remove<T>(url, config?)` - DELETE request

**Features:**
- Automatic token injection
- Request/response interceptors
- Token refresh on 401
- Error handling
- Type-safe responses
- Query parameters support

### Auth Utilities
- Login/Register/Logout functions
- JWT token validation
- Token decoding
- Current user fetching

**Files:**
- `lib/auth.ts` - Auth functions

## Form Handling & Validation

### React Hook Form
- Efficient form state management
- Minimal re-renders
- Easy integration with UI components
- Easy uncontrolled form handling

### Zod Validation
- Schema validation
- Type inference
- Runtime type checking
- Comprehensive error messages

**Example:**
```tsx
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

## Components

### Shadcn/UI Components

Pre-built, accessible components based on Radix UI:

1. **Button** - Multiple variants (default, outline, ghost, destructive)
2. **Input** - Text input with Tailwind styling
3. **Card** - Container with header, content, footer
4. **Form** - React Hook Form integration
5. **Badge** - Flexible badge component
6. **Avatar** - User avatar with fallback
7. **Dropdown Menu** - Accessible dropdown menu
8. **Dialog** - Modal dialog component
9. **Tabs** - Tabbed interface
10. **Table** - Data table component

**Location:** `/components/ui/`

### Custom Components

#### Layout Components
- **Sidebar** - Responsive sidebar navigation
- **Header** - Top header with user menu

#### Auth Components
- **LoginForm** - Login page form with validation
- **RegisterForm** - Registration form with confirmation
- **ProtectedRoute** - Route protection wrapper

#### Data Components
- **DataTable** - Feature-rich data table with:
  - Sorting
  - Filtering
  - Pagination
  - Search
  - Click handlers
  - Responsive design

#### Utility Components
- **ErrorBoundary** - Error boundary for error handling
- **ToastProvider** - Toast notifications provider

## Data Table Features

**File:** `/components/data-table/data-table.tsx`

### Features:
- Column sorting (ascending/descending)
- Global search/filter
- Pagination with controls
- Customizable page size
- Click row handler
- Empty state handling
- TypeScript support

### Usage:
```tsx
<DataTable
  columns={columns}
  data={data}
  title="Users"
  description="User directory"
  searchableColumns={['name', 'email']}
  pageSize={10}
  onRowClick={(row) => console.log(row)}
/>
```

## Custom Hooks

### useAuth
- Authentication state and actions
- User information
- Loading and error states
- Login/Register/Logout functions

**File:** `hooks/useAuth.ts`

```tsx
const { user, isAuthenticated, login, register, logout, error } = useAuth();
```

### useDebounce
- Debounce values for search, auto-complete
- Configurable delay

**File:** `hooks/useDebounce.ts`

```tsx
const debouncedValue = useDebounce(searchTerm, 500);
```

### useApi
- API call management
- Loading, error, data states
- Reset functionality

**File:** `hooks/useApi.ts`

```tsx
const { data, isLoading, error, execute } = useApi(apiCall);
```

### usePagination
- Pagination state management
- Go to page, next/previous
- Page size changes

**File:** `hooks/usePagination.ts`

```tsx
const { page, pageSize, goToPage, nextPage, previousPage } = usePagination();
```

## Utility Functions

**File:** `lib/utils.ts`

### Formatting
- `cn()` - Merge Tailwind classes
- `formatDate()` - Format dates
- `formatCurrency()` - Format currency
- `truncate()` - Truncate strings
- `capitalize()` - Capitalize strings
- `getInitials()` - Get name initials

### Data Manipulation
- `isEmpty()` - Check if empty
- `deepClone()` - Deep clone objects
- `delay()` - Promise-based delay
- `debounce()` - Debounce function

### URL Utilities
- `isAbsoluteUrl()` - Check absolute URL
- `getQueryParams()` - Parse query parameters
- `buildQueryString()` - Build query strings

## Styling

### Dark Mode Support
- CSS variable-based theme
- Built-in dark mode toggle support
- Automatic dark mode detection
- Customizable color palette

### Responsive Design
- Mobile-first approach
- TailwindCSS breakpoints
- Responsive components
- Mobile sidebar toggle

### Custom Animations
- Fade in animation
- Slide up animation
- Accordion animations
- Smooth transitions

## Error Handling

### Error Boundary
- Component error catching
- Custom fallback UI
- Error logging
- Reset functionality

**File:** `components/error-boundary.tsx`

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <YourComponent />
</ErrorBoundary>
```

### API Error Handling
- Automatic error interception
- Meaningful error messages
- Error state in hooks
- Form field error display

## Notifications

### Toast Notifications
- Success, error, info, warning types
- Auto-dismiss
- Custom styling
- Position configurable

**File:** `components/toast-provider.tsx`

**Usage:**
```tsx
import toast from 'react-hot-toast';

toast.success('Success!');
toast.error('Error occurred');
toast.loading('Loading...');
```

## Pages & Routes

### Authentication Routes
- `GET /` - Redirects to dashboard
- `GET /login` - Login page
- `GET /register` - Registration page

### Dashboard Routes
- `GET /dashboard` - Dashboard home
- `GET /dashboard/users` - Users management
- `GET /dashboard/settings` - Settings page

### Protected Routes
- All dashboard routes require authentication
- Role-based access control support
- Redirect to login on unauthorized access

## Configuration

### Environment Variables
- `NEXT_PUBLIC_API_URL` - API base URL
- `NEXT_PUBLIC_APP_NAME` - App name
- `NEXT_PUBLIC_AUTH_TOKEN_KEY` - Token storage key
- `NEXT_PUBLIC_ENABLE_DARK_MODE` - Dark mode support

**File:** `.env.example`

### Next.js Configuration
- Security headers
- Redirects setup
- Performance optimizations
- Environment variables

**File:** `next.config.js`

### TailwindCSS Configuration
- Theme colors
- Dark mode setup
- Custom animations
- Responsive breakpoints

**File:** `tailwind.config.js`

### TypeScript Configuration
- Strict mode
- Path aliases
- Module resolution

**File:** `tsconfig.json`

### Shadcn/UI Configuration
- Component aliases
- Build settings

**File:** `components.json`

## Dependencies

### UI & Components
- `@radix-ui/*` - Accessible UI primitives
- `shadcn/ui` - Component library
- `lucide-react` - Icon library

### Form Handling
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Form validation resolver

### State & Data
- `zustand` - Global state management
- `@tanstack/react-query` - Data fetching
- `@tanstack/react-table` - Data table logic

### HTTP
- `axios` - HTTP client

### Styling
- `tailwindcss` - Utility CSS
- `tailwind-merge` - Class merge utility
- `clsx` - Class name utility
- `tailwindcss-animate` - Animation utilities

### Utilities
- `class-variance-authority` - Component variants
- `react-hot-toast` - Toast notifications
- `next-themes` - Theme management

## Development Tools

### Code Quality
- ESLint - Linting
- Prettier - Code formatting
- TypeScript - Type checking

### Build & Development
- Next.js - Framework
- Node.js 18+ - Runtime

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm start` - Production server
- `npm run lint` - Linting
- `npm run type-check` - Type checking
- `npm run format` - Code formatting
- `npm run add:component` - Add Shadcn/UI component

## Best Practices Implemented

1. **Type Safety** - Full TypeScript coverage
2. **Component Composition** - Reusable, composable components
3. **Error Handling** - Error boundaries and try-catch blocks
4. **Performance** - Code splitting, image optimization, memoization
5. **Accessibility** - ARIA labels, semantic HTML
6. **Security** - JWT tokens, HTTPS, security headers
7. **Responsive Design** - Mobile-first approach
8. **Code Organization** - Logical directory structure
9. **Documentation** - Comprehensive guides and examples
10. **Testing Ready** - Structured for easy testing

## Extensibility

### Adding New Components
1. Create component file
2. Export from index file
3. Use in pages/other components

### Adding New Pages
1. Create directory in `/app`
2. Add `page.tsx`
3. Use layouts for consistency

### Adding New API Endpoints
1. Create functions in service files
2. Use API client methods
3. Integrate with React Query

### Adding Validation Rules
1. Extend Zod schemas
2. Update form validation
3. Display error messages

## Performance Features

- **Code Splitting** - Automatic via Next.js
- **Image Optimization** - next/image component
- **CSS-in-JS** - Tailwind CSS
- **Lazy Loading** - Dynamic imports support
- **Caching** - React Query built-in
- **Minification** - Automatic via build process
- **Tree Shaking** - Unused code removal

## Security Features

- **JWT Authentication** - Secure token-based auth
- **HTTPS Support** - Production-ready
- **Security Headers** - X-Frame-Options, X-XSS-Protection
- **CORS Ready** - Backend configuration support
- **Password Validation** - Zod schema validation
- **Token Refresh** - Automatic token renewal
- **Secure Storage** - Token in localStorage

## Accessibility

- **Semantic HTML** - Proper HTML structure
- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Full keyboard support
- **Color Contrast** - WCAG compliant
- **Focus Management** - Visible focus indicators
- **Form Labels** - Proper label associations

---

For more details, see:
- `README.md` - Overview and installation
- `GETTING_STARTED.md` - Quick start guide
- `API_INTEGRATION.md` - API integration details
- `DEPLOYMENT.md` - Deployment guides
