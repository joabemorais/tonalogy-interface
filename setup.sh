#!/bin/bash

# Tonalogy Interface Setup Script
echo "🎵 Setting up Tonalogy Interface..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Please upgrade to Node.js 18+."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
elif command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Setup environment file
if [ ! -f .env.local ]; then
    echo "⚙️ Setting up environment variables..."
    cp .env.example .env.local
    echo "✅ Environment file created (.env.local)"
    echo "📝 Please edit .env.local to configure your API URL if needed"
else
    echo "✅ Environment file already exists"
fi

# Build the project to verify everything works
echo "🔨 Building project to verify setup..."
if command -v pnpm &> /dev/null; then
    pnpm build
elif command -v yarn &> /dev/null; then
    yarn build
else
    npm run build
fi

if [ $? -eq 0 ]; then
    echo "✅ Project built successfully!"
    echo ""
    echo "🚀 Setup complete! You can now run:"
    echo "   npm run dev    (or yarn dev / pnpm dev)"
    echo ""
    echo "🔗 The application will be available at http://localhost:3000"
    echo "🔧 Make sure your Tonalogy API is running at the configured URL"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi
