# Deployment Configuration

This directory contains all deployment-related configuration files for the Tonalogy Interface.

## 📁 Files Overview

### Environment Files
- **`.env.production`** - Production environment variables
- **`.env.development`** - Development environment template

### Build & Deploy
- **`build-production.sh`** - Production build script
- **`render.yaml`** - Render.com deployment configuration

### Documentation
- **`DEPLOYMENT.md`** - Complete deployment guide

## 🚀 Quick Deploy

### Render Static Site

1. **Connect repository** to Render
2. **Use configuration** from `render.yaml`
3. **Set environment variables** from `.env.production`

### Manual Build

```bash
# Copy production environment
cp deploy/.env.production .env.local

# Run production build
./deploy/build-production.sh
```

## 🔧 Environment Variables

### Production Required
```bash
NEXT_PUBLIC_API_URL=https://tonalogy-api.onrender.com
NODE_ENV=production
```

### Development Optional
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
TONALOGY_API_URL=http://localhost:8000
NODE_ENV=development
```

## 📖 Detailed Instructions

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for complete setup instructions and troubleshooting.

## 🏗️ Architecture

- **Frontend**: Static site (this repository)
- **Backend**: API service (separate deployment)
- **CDN**: Global content delivery for static assets

## 🔄 CI/CD

The deployment automatically triggers on:
- Push to `main` branch
- Manual deploy from Render dashboard
- Environment variable changes
