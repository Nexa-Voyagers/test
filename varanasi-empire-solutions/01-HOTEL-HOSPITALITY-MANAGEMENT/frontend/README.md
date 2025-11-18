# Hotel Management System - Frontend

A complete, production-ready frontend application for Hotel and Hospitality Management built with Next.js 14, React 18, TypeScript, and Shadcn/UI.

## Features

- **Authentication System**: Complete login/register with JWT token management
- **Dashboard**: Real-time statistics and occupancy metrics
- **Hotel Management**: Manage multiple hotel properties
- **Room Management**: Track room status, types, and availability
- **Booking Management**: Create and manage reservations
- **Guest Management**: Comprehensive guest profiles and CRM
- **Housekeeping**: Task assignment and status tracking
- **Reports & Analytics**: Occupancy reports and revenue analytics
- **Settings**: User profile and hotel configuration

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
│   │   ├── hotels/page.tsx
│   │   ├── rooms/page.tsx
│   │   ├── bookings/page.tsx
│   │   ├── guests/page.tsx
│   │   ├── housekeeping/page.tsx
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
- Backend API running on http://localhost:5001

## Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd /home/user/test/varanasi-empire-solutions/01-HOTEL-HOSPITALITY-MANAGEMENT/frontend
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
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   NEXT_PUBLIC_AUTH_TOKEN_KEY=hotel_mgmt_token
   NEXT_PUBLIC_AUTH_REFRESH_KEY=hotel_mgmt_refresh_token
   ```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at **http://localhost:3001**

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

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## API Integration

The frontend connects to the backend API at `http://localhost:5001/api` by default. Key API endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /hotels` - List hotels
- `GET /rooms` - List rooms
- `GET /bookings` - List bookings
- `POST /bookings` - Create new booking
- `GET /guests` - List guests
- `GET /housekeeping` - List housekeeping tasks
- `GET /reports/occupancy` - Occupancy reports
- `GET /dashboard/stats` - Dashboard statistics

## Features Overview

### Authentication
- JWT-based authentication
- Automatic token refresh
- Protected routes
- Session persistence

### Room Management
- Real-time room status
- Room types and categories
- Pricing management
- Amenities tracking
- Floor plans

### Booking Management
- New reservations
- Check-in/check-out
- Booking modifications
- Cancellations
- Payment tracking

### Guest Management
- Guest profiles
- Booking history
- VIP status
- Preferences
- Contact information

### Housekeeping
- Task assignment
- Priority levels
- Status tracking
- Room cleaning schedules
- Maintenance requests

### Reports
- Occupancy rate
- Revenue per available room (RevPAR)
- Average daily rate (ADR)
- Occupancy by room type
- Revenue trends

## Hotel Metrics

The system tracks key performance indicators:

- **Occupancy Rate**: Percentage of occupied rooms
- **ADR (Average Daily Rate)**: Average revenue per occupied room
- **RevPAR (Revenue Per Available Room)**: Total room revenue / total rooms available
- **Check-ins/Check-outs**: Daily tracking
- **Room Status**: Available, Occupied, Reserved, Cleaning, Maintenance

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

### Check-in/Check-out Times
Configure default times in Settings page or via backend configuration.

## Troubleshooting

### Port Already in Use
If port 3001 is in use, specify a different port:
```bash
npm run dev -- -p 3002
```

### API Connection Issues
1. Verify backend is running on http://localhost:5001
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

## Multi-Property Support

The system supports managing multiple hotel properties:
- Property-specific dashboards
- Centralized guest database
- Cross-property reporting
- Individual property settings

## Security

- JWT token authentication
- Secure HTTP-only cookies
- CSRF protection
- Input validation and sanitization
- Role-based access control (RBAC)

## Performance

- Server-side rendering (SSR)
- Static generation where possible
- Image optimization
- Code splitting
- Lazy loading

## License

MIT

## Support

For issues and questions, please contact the development team.
