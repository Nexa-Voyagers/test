#!/bin/bash

echo "=================================================="
echo "  VARANASI EMPIRE SOLUTIONS - LOCAL DEMO"
echo "=================================================="
echo ""
echo "Starting local development server..."
echo "Perfect for client demos on your laptop!"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: Please run this from the frontend-starter directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting development server..."
echo ""
echo "=================================================="
echo "  SERVER WILL START AT:"
echo "  http://localhost:3000"
echo "=================================================="
echo ""
echo "DEMO URLs for clients:"
echo "  • Homepage: http://localhost:3000"
echo "  • Hotel System: http://localhost:3000/business/1"
echo "  • Hotel Technical Docs: http://localhost:3000/business/1/technical"
echo "  • Temple System: http://localhost:3000/business/2"
echo "  • Temple Technical Docs: http://localhost:3000/business/2/technical"
echo ""
echo "All 22 businesses available: /business/1 through /business/22"
echo "All technical tabs work perfectly!"
echo ""
echo "Press Ctrl+C to stop the server when done."
echo ""

# Start development server
npm run dev
