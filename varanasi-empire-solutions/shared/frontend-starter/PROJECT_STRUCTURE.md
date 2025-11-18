# Project Structure & File Guide

## Directory Layout

```
frontend-starter/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── (auth)/                  # Authentication routes group
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   └── register/
│   │       └── page.tsx         # Register page
│   └── (dashboard)/             # Protected dashboard group
│       ├── layout.tsx           # Dashboard layout with sidebar/header
│       ├── page.tsx             # Dashboard home page
│       ├── users/
│       │   └── page.tsx         # Users management page
│       └── settings/
│           └── page.tsx         # Settings page
│
├── components/                   # React components
│   ├── ui/                      # Shadcn/UI components
│   │   ├── button.tsx           # Button component
│   │   ├── input.tsx            # Input component
│   │   ├── card.tsx             # Card component
│   │   ├── form.tsx             # Form wrapper (React Hook Form)
│   │   ├── badge.tsx            # Badge component
│   │   ├── avatar.tsx           # Avatar component
│   │   ├── dropdown-menu.tsx    # Dropdown menu
│   │   ├── dialog.tsx           # Modal dialog
│   │   ├── tabs.tsx             # Tabbed interface
│   │   ├── table.tsx            # Table component
│   │   └── index.ts             # Component exports
│   │
│   ├── auth/                    # Authentication components
│   │   ├── login-form.tsx       # Login form with validation
│   │   ├── register-form.tsx    # Register form with validation
│   │   ├── protected-route.tsx  # Route protection wrapper
│   │   └── index.ts             # Component exports
│   │
│   ├── layout/                  # Layout components
│   │   ├── sidebar.tsx          # Responsive sidebar navigation
│   │   ├── header.tsx           # Top header with user menu
│   │   └── index.ts             # Component exports
│   │
│   ├── data-table/              # Data table component
│   │   └── data-table.tsx       # Feature-rich data table
│   │
│   ├── error-boundary.tsx       # Error boundary wrapper
│   └── toast-provider.tsx       # Toast notification provider
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── useDebounce.ts           # Debounce hook
│   ├── useApi.ts                # API call hook
│   ├── usePagination.ts         # Pagination hook
│   └── index.ts                 # Hook exports
│
├── lib/                          # Utility functions & API
│   ├── api.ts                   # Axios instance with interceptors
│   ├── auth.ts                  # Authentication utilities
│   ├── utils.ts                 # General utility functions
│   └── index.ts                 # Utility exports
│
├── store/                        # Global state management
│   ├── authStore.ts             # Zustand auth store
│   └── index.ts                 # Store exports
│
├── types/                        # TypeScript type definitions
│   └── index.ts                 # All shared types
│
├── styles/                       # Global styles
│   └── globals.css              # CSS variables & global styles
│
├── Configuration Files
│   ├── next.config.js           # Next.js configuration
│   ├── tailwind.config.js       # TailwindCSS configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── components.json          # Shadcn/UI configuration
│   ├── .eslintrc.json           # ESLint configuration
│   ├── .prettierrc               # Prettier configuration
│   └── .gitignore               # Git ignore rules
│
├── Documentation
│   ├── README.md                # Main documentation
│   ├── GETTING_STARTED.md       # Quick start guide
│   ├── FEATURES.md              # Feature overview
│   ├── API_INTEGRATION.md       # API integration guide
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── PROJECT_STRUCTURE.md     # This file
│   ├── .env.example             # Environment variables template
│   └── LICENSE                  # MIT License
│
└── package.json                 # NPM dependencies & scripts
```

## File Descriptions

### Core Application Files

#### `app/layout.tsx`
- Root layout component
- Sets up global providers (ErrorBoundary, ToastProvider)
- Configures metadata
- Imports global styles

#### `app/(auth)/login/page.tsx`
- Login page
- Full-screen login form
- Gradient background
- Unauthenticated users only

#### `app/(auth)/register/page.tsx`
- Registration page
- Sign-up form with validation
- Link to login page
- Unauthenticated users only

#### `app/(dashboard)/layout.tsx`
- Protected dashboard layout
- Sidebar navigation
- Header with user menu
- Protected route wrapper
- Responsive sidebar toggle

#### `app/(dashboard)/page.tsx`
- Dashboard home page
- Welcome message
- Statistics cards
- Recent activity
- Quick actions
- User information

#### `app/(dashboard)/users/page.tsx`
- User management page
- Data table with user list
- Add user button
- Search functionality
- Sorting and pagination

#### `app/(dashboard)/settings/page.tsx`
- Settings page
- Tabbed interface (General, API, Notifications)
- Form configuration
- API status display
- Notification preferences

### UI Components (`components/ui/`)

#### `button.tsx`
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon
- States: loading, disabled
- Full accessibility support

#### `input.tsx`
- Text input field
- TailwindCSS styled
- Focus states
- Placeholder support
- Type variants

#### `card.tsx`
- Card container
- CardHeader, CardTitle, CardDescription
- CardContent, CardFooter
- Flexible layout system

#### `form.tsx`
- React Hook Form integration
- FormField wrapper
- FormLabel, FormControl
- FormDescription, FormMessage
- Error display

#### `badge.tsx`
- Inline badge component
- Variants: default, secondary, destructive, outline
- Various use cases

#### `avatar.tsx`
- User avatar display
- Image with fallback
- Radix UI powered
- Custom sizes

#### `dropdown-menu.tsx`
- Accessible dropdown menu
- Submenu support
- Checkboxes and radio items
- Keyboard navigation

#### `dialog.tsx`
- Modal dialog component
- Overlay with blur
- Close button
- Header, footer, title, description

#### `tabs.tsx`
- Tabbed interface
- Active state styling
- Content panels
- Keyboard navigation

#### `table.tsx`
- Data table markup
- Thead, tbody, tfoot
- Row and cell components
- Hover states

### Authentication Components (`components/auth/`)

#### `login-form.tsx`
- Email and password inputs
- Form validation with Zod
- Error messages
- Loading state
- Link to register

#### `register-form.tsx`
- Name, email, password inputs
- Password confirmation
- Form validation
- Loading state
- Link to login

#### `protected-route.tsx`
- Route protection wrapper
- Role-based access control
- Loading state
- Access denied message
- Redirect to dashboard

### Layout Components (`components/layout/`)

#### `sidebar.tsx`
- Responsive sidebar navigation
- Mobile toggle
- Active link highlighting
- Link badges
- Logo area
- Mobile overlay

#### `header.tsx`
- Top navigation bar
- Page title
- Notification bell
- User dropdown menu
- Profile and settings
- Logout functionality

### Data & Utility Components

#### `data-table.tsx`
- TanStack Table integration
- Sorting (asc/desc)
- Global filtering/search
- Pagination
- Responsive
- Customizable columns

#### `error-boundary.tsx`
- React Error Boundary
- Error catching
- Fallback UI
- Reset button
- Error logging

#### `toast-provider.tsx`
- Toast notification provider
- Styled for dark/light modes
- Auto-dismiss
- Success/error/info types

### Hooks (`hooks/`)

#### `useAuth.ts`
- Authentication state management
- Login/logout/register actions
- Error and loading states
- User information access
- Initialization on mount

#### `useDebounce.ts`
- Debounce values
- Configurable delay
- Cleanup on unmount

#### `useApi.ts`
- API call management
- Loading/error states
- Execute function
- Reset functionality
- Type-safe responses

#### `usePagination.ts`
- Pagination state
- Page navigation
- Page size changes
- Reset to first page

### Utilities (`lib/`)

#### `api.ts`
- Axios instance configuration
- Request interceptor (token injection)
- Response interceptor (token refresh)
- Helper methods: get, post, put, patch, remove
- Token management functions
- Error handling

#### `auth.ts`
- Login function
- Register function
- Logout function
- Get current user
- Token refresh
- Token validation
- JWT decoding

#### `utils.ts`
- `cn()` - Merge Tailwind classes
- `formatDate()` - Format dates
- `formatCurrency()` - Format currency
- `truncate()` - Truncate strings
- `debounce()` - Debounce function
- `capitalize()` - Capitalize string
- `isEmpty()` - Check empty value
- `deepClone()` - Clone objects
- `getInitials()` - Get name initials
- `delay()` - Async delay
- `isAbsoluteUrl()` - Check absolute URL
- `getQueryParams()` - Parse query params
- `buildQueryString()` - Build query string

### State Management (`store/`)

#### `authStore.ts`
- Zustand store for auth
- Persisted to localStorage
- User state
- Authentication state
- Loading and error states
- Actions: login, register, logout, fetchUser

### Types (`types/index.ts`)

```typescript
// User types
User, UserRole, AuthCredentials, RegisterCredentials, AuthResponse

// API types
ApiResponse, PaginatedResponse, PaginationParams

// Common types
TableColumn, SidebarLink, NotificationMessage, FormFieldConfig

// Error types
AppError, ResponseError
```

### Configuration Files

#### `next.config.js`
- React strict mode
- SWC minification
- Security headers
- Redirects
- Environment variables
- Console removal in production

#### `tailwind.config.js`
- Shadcn/UI theme colors
- Dark mode support
- Custom animations
- Responsive breakpoints
- CSS variable colors

#### `tsconfig.json`
- Strict mode enabled
- Path aliases (@/*, @/components/*, etc.)
- ES2020 target
- No unused locals/parameters
- Module resolution

#### `components.json`
- Shadcn/UI CLI configuration
- Alias paths
- TailwindCSS config reference

#### `.eslintrc.json`
- Next.js recommended rules
- Prettier integration
- React hooks validation

#### `.prettierrc`
- 2-space indentation
- Single quotes
- Trailing commas (ES5)
- Arrow parens always
- Print width: 100

### Documentation Files

#### `README.md`
- Project overview
- Installation instructions
- Available scripts
- Usage examples
- Component listing
- Customization guide
- Troubleshooting

#### `GETTING_STARTED.md`
- Quick start instructions
- Feature exploration guide
- Common tasks
- Customization examples
- Resources

#### `FEATURES.md`
- Comprehensive feature list
- Technology descriptions
- Component documentation
- Best practices
- Extensibility guide

#### `API_INTEGRATION.md`
- API client setup
- HTTP methods
- Authentication
- React Query integration
- Error handling
- TypeScript types
- Best practices
- Example services

#### `DEPLOYMENT.md`
- Pre-deployment checklist
- Environment variables
- Vercel deployment
- Docker deployment
- Netlify deployment
- AWS deployment
- Performance optimization
- Monitoring setup
- Security guidelines

#### `.env.example`
- Template for environment variables
- All available variables
- Default values
- Comments explaining each variable

#### `LICENSE`
- MIT License
- Copyright information

## File Dependencies

### Authentication Flow
`login/page.tsx` → `LoginForm` → `useAuth()` → `authStore.ts` → `lib/auth.ts` → `lib/api.ts`

### Protected Route Access
`(dashboard)/layout.tsx` → `ProtectedRoute` → `useAuth()` → `authStore.ts`

### API Calls
`components/` → `hooks/useApi()` or `lib/api.ts` → `apiClient` → interceptors → token management

### Form Handling
`*-form.tsx` → `react-hook-form` + `zod` → `Form` component → `FormField` → `Input`/`Button`

### Data Table
`data-table.tsx` → `@tanstack/react-table` → `Table`, `TableHead`, `TableRow`, etc.

### Styling
`globals.css` → `tailwind.config.js` → components → Shadcn/UI colors

## Key Conventions

1. **Server Components** - Default for performance
2. **Client Components** - Used for interactivity (`'use client'` directive)
3. **Export Pattern** - Each directory has `index.ts` for exports
4. **Naming** - kebab-case for files, PascalCase for components
5. **Imports** - Path aliases (`@/`) for clean imports
6. **Types** - All types in `/types/index.ts`
7. **Error Handling** - Try-catch in API calls, Error Boundary for components
8. **Styling** - TailwindCSS utility classes, `cn()` for merging
9. **Validation** - Zod schemas for forms and API responses
10. **State** - Zustand for global state, hooks for local state

## Adding New Features

### Adding a New Page
1. Create directory in `/app/(dashboard)/new-page/`
2. Add `page.tsx`
3. Add to sidebar links in dashboard layout

### Adding a Component
1. Create file in appropriate directory
2. Export from `index.ts`
3. Import and use in pages/components

### Adding an API Service
1. Create service file in new `/services/` directory
2. Use `lib/api.ts` methods
3. Integrate with React Query in components

### Adding New Validation
1. Create Zod schema in component or `/types/`
2. Use with `useForm()` from React Hook Form
3. Display errors with `FormMessage`

---

For detailed information about specific files, see their respective documentation files.
