# Vercel Deployment Instructions

## Quick Setup

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. Click **"Add New Project"**
3. **Import** your GitHub repository: `Nexa-Voyagers/test`
4. **Configure Project:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `varanasi-empire-solutions/shared/frontend-starter`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

5. **Environment Variables** (optional):
   - `NEXT_PUBLIC_API_URL` - Your backend API URL (not needed for demo mode)

6. **Deploy** - Click Deploy button

## Important: Branch Configuration

Make sure Vercel is deploying from:
- **Branch:** `claude/vercel-deployment-prep-01FXtewWD4PMvZTWgdecjYKL`
- **Latest Commit:** `3794a41` - Add clickable business pages with full demo data

## What You'll See After Deployment

### Dashboard (/)
- 22 clickable business cards
- Search and filter by category
- Stats: 22 apps, 100% complete
- Click any card to open that business system

### Each Business Page (/business/1 through /business/22)
- Live stats and metrics
- System modules
- Full data tables with demo records
- Quick actions

### Example URLs
- `/` - Main dashboard
- `/business/1` - Hotel Management with room inventory
- `/business/2` - Temple Management with donations
- `/business/3` - Restaurant POS with orders
- `/analytics` - Analytics overview
- `/reports` - System reports
- `/users` - User management
- `/settings` - Settings page

## Demo Mode

Demo mode is ENABLED by default. You can log in with ANY email and password.

Example:
- Email: `demo@example.com`
- Password: `anything`

## Troubleshooting

### Getting 404 errors?
1. Make sure **Root Directory** is set to `varanasi-empire-solutions/shared/frontend-starter`
2. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check Vercel is deploying latest commit `3794a41`

### Still seeing old version?
1. Go to Vercel Dashboard > Deployments
2. Find the latest deployment
3. Click the 3 dots > **Redeploy**
4. Or push an empty commit:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

### Vercel building old commit?
1. Check Settings > Git
2. Ensure branch is: `claude/vercel-deployment-prep-01FXtewWD4PMvZTWgdecjYKL`
3. Ensure "Production Branch" is set correctly

## Verification

After deployment succeeds, verify:
1. Go to your Vercel URL
2. Log in with any credentials
3. You should see 22 business cards
4. Click "Hotel & Hospitality Management"
5. You should see room inventory with data

If all works, you're done! All 22 systems are live with demo data.
