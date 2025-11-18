# Restaurant POS Management - Frontend

A complete, production-ready frontend application for Restaurant Point of Sale (POS) Management built with Next.js 14, React 18, TypeScript, and Shadcn/UI.

## Features

- **Authentication System**: Complete login/register with JWT token management
- **Dashboard**: Real-time statistics and overview
- **Restaurant Management**: Manage multiple restaurant locations
- **Menu Management**: Add, edit, and organize menu items with categories
- **Order Management**: Create and track orders with status updates
- **Table Management**: Visual table layout with real-time status
- **Inventory Management**: Track stock levels with low stock alerts
- **POS Interface**: Interactive point-of-sale for taking orders
- **Reports & Analytics**: Sales reports and performance metrics
- **Settings**: User profile and application configuration

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn/UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── restaurants/page.tsx
│   │   ├── menu/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── tables/page.tsx
│   │   ├── inventory/page.tsx
│   │   ├── pos/page.tsx
│   │   ├── reports/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── auth/
│   ├── layout/
│   ├── data-table/
│   ├── ui/
│   ├── query-provider.tsx
│   └── toast-provider.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── usePagination.ts
│   └── useDebounce.ts
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── utils.ts
├── store/
│   └── authStore.ts
├── types/
│   └── index.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Prerequisites

- Node.js 18 or higher
- npm or yarn or pnpm
- Backend API running on http://localhost:5000

## Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd /home/user/test/varanasi-empire-solutions/03-RESTAURANT-POS-MANAGEMENT/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and configure:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_AUTH_TOKEN_KEY=restaurant_pos_token
   NEXT_PUBLIC_AUTH_REFRESH_KEY=restaurant_pos_refresh_token
   ```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

## Build for Production

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm run start
   ```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api` by default. Key API endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /restaurants` - List restaurants
- `GET /menu` - List menu items
- `GET /orders` - List orders
- `POST /orders` - Create new order
- `GET /tables` - List tables
- `GET /inventory` - List inventory items
- `GET /reports/sales` - Sales reports
- `GET /dashboard/stats` - Dashboard statistics

## Features Overview

### Authentication
- JWT-based authentication
- Automatic token refresh
- Protected routes
- Session persistence

### POS Interface
- Add items to cart
- Adjust quantities
- Apply discounts
- Multiple payment methods
- Print receipts

### Order Management
- Create, view, and update orders
- Order status tracking
- Kitchen display integration
- Order history

### Menu Management
- Category organization
- Veg/Non-veg indicators
- Availability status
- Pricing management
- Preparation time

### Inventory
- Stock level monitoring
- Low stock alerts
- Reorder level management
- Expiry date tracking

### Reports
- Sales by time period
- Top selling items
- Category performance
- Revenue analytics

## Customization

### Theme
Edit `app/globals.css` to customize the color scheme:
```css
:root {
  --primary: /* your color */;
  --secondary: /* your color */;
  /* ... */
}
```

### API URL
Update `.env.local` to point to your backend:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## Troubleshooting

### Port Already in Use
If port 3000 is in use, specify a different port:
```bash
npm run dev -- -p 3001
```

### API Connection Issues
1. Verify backend is running on http://localhost:5000
2. Check CORS settings in backend
3. Verify `.env.local` configuration

### Build Errors
1. Clear Next.js cache: `rm -rf .next`
2. Remove node_modules: `rm -rf node_modules`
3. Reinstall dependencies: `npm install`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues and questions, please contact the development team.
