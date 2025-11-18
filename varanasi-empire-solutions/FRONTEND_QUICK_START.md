# Frontend Quick Start Guide

This guide will help you quickly set up and run both frontend applications.

## Prerequisites

Ensure you have:
- ✅ Node.js 18 or higher installed
- ✅ npm, yarn, or pnpm package manager
- ✅ Backend APIs running:
  - Restaurant POS Backend: http://localhost:5000
  - Hotel Management Backend: http://localhost:5001

---

## Quick Start - Restaurant POS Frontend

### 1. Navigate to Directory
```bash
cd /home/user/test/varanasi-empire-solutions/03-RESTAURANT-POS-MANAGEMENT/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
cp .env.example .env.local
```

The `.env.local` file should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_AUTH_TOKEN_KEY=restaurant_pos_token
NEXT_PUBLIC_AUTH_REFRESH_KEY=restaurant_pos_refresh_token
```

### 4. Run Development Server
```bash
npm run dev
```

✅ **Frontend running at**: http://localhost:3000

---

## Quick Start - Hotel Management Frontend

### 1. Navigate to Directory
```bash
cd /home/user/test/varanasi-empire-solutions/01-HOTEL-HOSPITALITY-MANAGEMENT/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
cp .env.example .env.local
```

The `.env.local` file should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_AUTH_TOKEN_KEY=hotel_mgmt_token
NEXT_PUBLIC_AUTH_REFRESH_KEY=hotel_mgmt_refresh_token
```

### 4. Run Development Server
```bash
npm run dev
```

✅ **Frontend running at**: http://localhost:3001

---

## Running Both Frontends Simultaneously

You can run both frontends at the same time in separate terminal windows:

### Terminal 1 - Restaurant POS
```bash
cd /home/user/test/varanasi-empire-solutions/03-RESTAURANT-POS-MANAGEMENT/frontend
npm run dev
```

### Terminal 2 - Hotel Management
```bash
cd /home/user/test/varanasi-empire-solutions/01-HOTEL-HOSPITALITY-MANAGEMENT/frontend
npm run dev
```

---

## Access the Applications

Once running:

- **Restaurant POS**: http://localhost:3000
- **Hotel Management**: http://localhost:3001

### Default Login (if using demo data)
```
Email: admin@example.com
Password: password123
```

---

## Available Scripts

For both frontends:

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start dev server with hot reload |
| Build | `npm run build` | Build for production |
| Start | `npm run start` | Run production build |
| Lint | `npm run lint` | Run ESLint |
| Type Check | `npm run type-check` | Check TypeScript types |
| Format | `npm run format` | Format code with Prettier |

---

## Troubleshooting

### Port Already in Use

If port is already in use, you can specify a different port:

```bash
# Restaurant POS on different port
npm run dev -- -p 3002

# Hotel Management on different port
npm run dev -- -p 3003
```

### Can't Connect to Backend

1. Verify backend is running:
   ```bash
   curl http://localhost:5000/api/health  # Restaurant POS
   curl http://localhost:5001/api/health  # Hotel Management
   ```

2. Check `.env.local` configuration
3. Verify CORS is enabled in backend

### Module Not Found Errors

Clear cache and reinstall:
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Build Errors

1. Check Node.js version: `node --version` (should be 18+)
2. Clear TypeScript cache: `rm -rf .next`
3. Run type check: `npm run type-check`

---

## Features to Test

### Restaurant POS
- [ ] Login/Register
- [ ] View Dashboard
- [ ] Browse Restaurants
- [ ] Manage Menu Items
- [ ] Create Order
- [ ] Use POS Interface
- [ ] View Tables
- [ ] Check Inventory
- [ ] Generate Reports

### Hotel Management
- [ ] Login/Register
- [ ] View Dashboard
- [ ] Browse Hotels
- [ ] Manage Rooms
- [ ] Create Booking
- [ ] Manage Guests
- [ ] Create Housekeeping Task
- [ ] View Reports

---

## Production Build

To build for production:

### Restaurant POS
```bash
cd /home/user/test/varanasi-empire-solutions/03-RESTAURANT-POS-MANAGEMENT/frontend
npm run build
npm run start
```

### Hotel Management
```bash
cd /home/user/test/varanasi-empire-solutions/01-HOTEL-HOSPITALITY-MANAGEMENT/frontend
npm run build
npm run start
```

---

## Environment Configuration

### Development
- Uses `.env.local` for local overrides
- Hot reload enabled
- Source maps included
- React Developer Tools supported

### Production
- Set `NODE_ENV=production`
- Optimized bundle
- Minified code
- No source maps (for security)

---

## Browser Recommendations

For best experience:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## Getting Help

If you encounter issues:

1. **Check the README**: Each frontend has detailed documentation
   - `/03-RESTAURANT-POS-MANAGEMENT/frontend/README.md`
   - `/01-HOTEL-HOSPITALITY-MANAGEMENT/frontend/README.md`

2. **Review logs**: Check terminal output for errors

3. **Verify backend**: Ensure APIs are responding

4. **Clear cache**: Remove `.next` and `node_modules` if needed

---

## Next Steps

After successful setup:

1. ✅ Test authentication flow
2. ✅ Explore all pages and features
3. ✅ Test API integrations
4. ✅ Verify data persistence
5. ✅ Test responsive design
6. ✅ Check error handling
7. ✅ Review performance

---

**Happy Coding!** 🚀
