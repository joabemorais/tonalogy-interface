#!/bin/bash

# Development setup script for Tonalogy Interface
# Sets up the development environment with proper configuration

set -e

echo "🚀 Setting up Tonalogy Interface development environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

# Create development environment file
if [ ! -f ".env.local" ]; then
    echo "⚙️ Creating development environment file..."
    cp deploy/.env.development .env.local
    echo "✅ Created .env.local from development template"
else
    echo "ℹ️ .env.local already exists, skipping creation"
fi

# Install dependencies
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
elif command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

echo "✅ Dependencies installed successfully"

# Check if API is accessible (optional)
echo "🔍 Checking API connectivity..."
API_URL=$(grep NEXT_PUBLIC_API_URL .env.local | cut -d '=' -f2)
if curl -s "$API_URL" > /dev/null 2>&1; then
    echo "✅ API is accessible at $API_URL"
else
    echo "⚠️ API not accessible at $API_URL"
    echo "💡 Make sure the tonalogy-api is running locally"
fi

echo ""
echo "🎉 Development setup complete!"
echo ""
echo "🚀 To start development:"
echo "   npm run dev"
echo ""
echo "🔗 The application will be available at http://localhost:3000"
echo ""
echo "📖 For more information, see:"
echo "   - GETTING_STARTED.md"
echo "   - deploy/DEPLOYMENT.md"
