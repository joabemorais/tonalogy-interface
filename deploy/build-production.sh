#!/bin/bash

# Production build script for Tonalogy Interface
# This script builds the static version for deployment

set -e

echo "🚀 Building Tonalogy Interface for production deployment..."

# Check if API URL is set
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo "⚠️  Warning: NEXT_PUBLIC_API_URL not set. Loading from production config..."
    
    # Try to load from production environment file
    if [ -f "deploy/.env.production" ]; then
        source deploy/.env.production
        echo "✅ Loaded production environment from deploy/.env.production"
    else
        echo "⚠️ Using default production URL"
        export NEXT_PUBLIC_API_URL="https://tonalogy-api.onrender.com"
    fi
fi

echo "📡 API URL: $NEXT_PUBLIC_API_URL"

# Set production environment
export NODE_ENV=production

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build the static site
echo "🔨 Building static site..."
npm run build:static

# Verify build output
if [ -d "out" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Static files available in: ./out"
    echo "🌐 Ready for deployment to static hosting service"
    
    # Show build stats
    echo ""
    echo "📊 Build Statistics:"
    echo "   Total files: $(find out -type f | wc -l)"
    echo "   Total size: $(du -sh out | cut -f1)"
else
    echo "❌ Build failed - output directory not found"
    exit 1
fi
