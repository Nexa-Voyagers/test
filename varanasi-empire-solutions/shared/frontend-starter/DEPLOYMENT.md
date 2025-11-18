# Deployment Guide

This guide covers deploying your Next.js 14 frontend starter to production.

## Pre-Deployment Checklist

- [ ] Review environment variables
- [ ] Run tests: `npm run type-check && npm run lint`
- [ ] Build locally: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Update API URLs for production
- [ ] Enable analytics (if applicable)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure backup/recovery plan

## Environment Variables

Set up production environment variables:

```env
# Production API URL
NEXT_PUBLIC_API_URL=https://api.production.com/api
NEXT_PUBLIC_APP_NAME=Varanasi Empire Solutions

# Security
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token
NEXT_PUBLIC_AUTH_REFRESH_KEY=auth_refresh_token

# Features
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## Vercel Deployment

Vercel is the recommended platform for Next.js applications.

### 1. Push to Git

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub account
3. Click "New Project"
4. Select your repository
5. Click "Import"

### 3. Configure Environment Variables

1. In project settings, go to "Environment Variables"
2. Add your production variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_APP_NAME`
   - etc.
3. Click "Save"

### 4. Deploy

Vercel automatically deploys on push to main branch.

### 5. Custom Domain

1. Go to project "Settings" > "Domains"
2. Add your custom domain
3. Follow DNS configuration steps
4. Wait for verification (usually 30 minutes)

## Docker Deployment

### Dockerfile

Create a `Dockerfile` in the root directory:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      NEXT_PUBLIC_APP_NAME: ${NEXT_PUBLIC_APP_NAME}
    depends_on:
      - api
```

### Build and Run

```bash
# Build image
docker build -t varanasi-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001/api \
  varanasi-frontend

# With docker-compose
docker-compose up -d
```

## Netlify Deployment

### 1. Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select your repository
4. Click "Connect"

### 2. Configure Build

- Build command: `npm run build`
- Publish directory: `.next`
- Base directory: `/` (or your project path)

### 3. Set Environment Variables

1. Go to "Site settings" > "Build & deploy" > "Environment"
2. Add environment variables
3. Redeploy

### 4. Deploy

Netlify automatically deploys on push to main.

## AWS Deployment

### Using AWS Amplify

1. Go to AWS Amplify Console
2. Click "Create app"
3. Select "GitHub"
4. Authorize and select repository
5. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
6. Click "Save and deploy"

### Using EC2 + Nginx

1. Launch EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install dependencies:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo apt-get install -y nginx
   ```
4. Clone repository:
   ```bash
   cd /home/ubuntu
   git clone your-repo
   cd your-repo
   ```
5. Build and start:
   ```bash
   npm install
   npm run build
   npm start
   ```
6. Configure Nginx:
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```
7. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

## GitHub Pages (Static Export)

For static deployment (without API routes):

1. Update `next.config.js`:
   ```js
   const nextConfig = {
     output: 'export',
     // ... other config
   };
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Deploy `out` directory to GitHub Pages

## Performance Optimization

### 1. Image Optimization

Next.js automatically optimizes images. Ensure images are in `/public`:

```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority
/>
```

### 2. Code Splitting

Next.js automatically splits code. Use dynamic imports for large components:

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/heavy'), {
  loading: () => <div>Loading...</div>,
});
```

### 3. Bundle Analysis

Check bundle size:

```bash
npm install --save-dev @next/bundle-analyzer

# In next.config.js:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run:
ANALYZE=true npm run build
```

## Monitoring

### Error Tracking (Sentry)

1. Sign up at [sentry.io](https://sentry.io)
2. Create project for Next.js
3. Install SDK:
   ```bash
   npm install @sentry/nextjs
   ```
4. Configure in `next.config.js`:
   ```js
   const { withSentryConfig } = require("@sentry/nextjs");

   const nextConfig = {
     // your config
   };

   module.exports = withSentryConfig(nextConfig, {
     org: "your-org",
     project: "your-project",
     authToken: process.env.SENTRY_AUTH_TOKEN,
   });
   ```

### Analytics

Add your preferred analytics service:

```tsx
// In app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Logging

Configure logging for production:

```typescript
// lib/logger.ts
export function logError(error: Error, context?: any) {
  if (typeof window === 'undefined') {
    // Server-side logging
    console.error('[ERROR]', error.message, context);
  } else {
    // Client-side logging
    console.error('[CLIENT ERROR]', error.message, context);
  }
}

export function logInfo(message: string, data?: any) {
  console.log('[INFO]', message, data);
}
```

## Security

### 1. HTTPS

- Ensure your domain uses HTTPS
- Most platforms (Vercel, Netlify) provide free SSL certificates

### 2. Headers

Already configured in `next.config.js`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection

### 3. Environment Variables

Never commit sensitive data:
- API keys
- Tokens
- Secrets

Use platform-specific environment variable management.

### 4. CORS

Configure CORS on your backend API to only allow your frontend domain.

## Monitoring Checklist

- [ ] Set up error tracking
- [ ] Configure logging
- [ ] Enable analytics
- [ ] Monitor response times
- [ ] Check error rates
- [ ] Monitor API health
- [ ] Track user interactions
- [ ] Set up alerts

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Slow Performance

1. Check bundle size: `ANALYZE=true npm run build`
2. Optimize images
3. Implement code splitting
4. Use CDN for static assets

### API Connection Issues

1. Check `NEXT_PUBLIC_API_URL` in environment
2. Verify CORS settings on backend
3. Check network tab in DevTools
4. Verify API is running and accessible

### Authentication Issues

1. Check token storage in localStorage
2. Verify token refresh endpoint
3. Check Authorization header in requests
4. Clear browser storage and re-login

## Rollback Procedure

### Vercel
1. Go to "Deployments"
2. Find previous stable deployment
3. Click "..." > "Redeploy"

### Manual Deployment
1. Revert to previous commit: `git revert <commit>`
2. Push changes: `git push origin main`
3. Platform redeploys automatically

## Maintenance

- Keep dependencies updated: `npm outdated`
- Run security audit: `npm audit`
- Monitor error logs
- Review analytics regularly
- Plan regular updates

## Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

For questions or issues, please create an issue in the repository.
