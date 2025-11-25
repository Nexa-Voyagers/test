#!/bin/bash

echo "=================================================="
echo "  VARANASI EMPIRE SOLUTIONS - VERCEL DEPLOYMENT"
echo "=================================================="
echo ""
echo "This will deploy your complete system to Vercel."
echo "All 22 businesses with full documentation will be live."
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: Please run this from the frontend-starter directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Build locally first to catch errors
echo "🔨 Building project locally to check for errors..."
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ BUILD FAILED! Please fix errors above before deploying."
    exit 1
fi

echo ""
echo "✅ Local build successful!"
echo ""
echo "=================================================="
echo "  DEPLOYING TO VERCEL"
echo "=================================================="
echo ""
echo "When prompted:"
echo "  1. Login to Vercel (browser will open)"
echo "  2. Set up and deploy? YES"
echo "  3. Which scope? Select your account"
echo "  4. Link to existing project? NO (create new)"
echo "  5. Project name? varanasi-empire-solutions"
echo "  6. Directory? ./ (current directory)"
echo "  7. Override settings? NO"
echo ""
read -p "Press ENTER to start deployment..."

# Deploy to Vercel
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "=================================================="
    echo "  ✅ DEPLOYMENT SUCCESSFUL!"
    echo "=================================================="
    echo ""
    echo "Your Varanasi Empire Solutions is now LIVE!"
    echo ""
    echo "Test these URLs (replace with your Vercel URL):"
    echo "  • Homepage: https://your-app.vercel.app"
    echo "  • Hotel: https://your-app.vercel.app/business/1/technical"
    echo "  • Temple: https://your-app.vercel.app/business/2/technical"
    echo "  • All 22 businesses: /business/1 through /business/22"
    echo ""
    echo "All tabs should work for all businesses!"
    echo ""
else
    echo ""
    echo "❌ Deployment failed. Please check errors above."
    exit 1
fi
