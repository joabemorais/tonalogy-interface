# Deployment Guide for Tonalogy Interface

This document outlines the deployment process for the Tonalogy Interface as a static site, following the decoupled architecture pattern.

## 🏗️ Architecture Overview

The Tonalogy project uses a decoupled architecture with:
- **Frontend**: Static site (this repository) deployed separately
- **Backend**: Dynamic API service deployed on its own infrastructure

## 📋 Pre-deployment Checklist

1. **Backend API is deployed and accessible**
   - Confirm your `tonalogy-api` is running and accessible
   - Note the API URL (e.g., `https://your-api.onrender.com`)
   - Verify CORS is properly configured in the backend

2. **Environment variables configured**
   - Set `NEXT_PUBLIC_API_URL` to your deployed API URL
   - Ensure the URL doesn't end with a trailing slash

## 🚀 Deployment Steps

### Option 1: Render Static Site (Recommended)

1. **Connect your repository to Render**
   - Create a new Static Site on Render
   - Connect to your `tonalogy-interface` repository

2. **Configure build settings**
   - Build Command: `npm ci && npm run build:static`
   - Publish Directory: `out`
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-tonalogy-api.onrender.com
     NODE_ENV=production
     ```

3. **Deploy**
   - Render will automatically build and deploy your site
   - The site will be available on a Render URL (e.g., `https://your-site.onrender.com`)

### Option 2: Manual Deployment

1. **Build the static site locally**
   ```bash
   # Set environment variable
   export NEXT_PUBLIC_API_URL=https://your-api-url.com
   
   # Install dependencies and build
   npm ci
   npm run build:static
   ```

2. **Deploy the `out/` directory**
   - Upload the contents of the `out/` directory to your static hosting service
   - Examples: Netlify, Vercel, GitHub Pages, AWS S3, etc.

## 🔧 Configuration Details

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://tonalogy-api.onrender.com` |
| `NODE_ENV` | Environment (production for static build) | `production` |

### Build Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development with API proxy |
| `npm run build:static` | Production static build |
| `npm run lint` | Code quality check |

## 🔍 Verification

After deployment, verify:

1. **Site loads correctly** at your deployed URL
2. **API connection works** by testing a chord progression analysis
   - Example: Try "C Am F G C" (note: progression must end on tonic)
3. **Visualizations generate** properly
4. **No console errors** related to API connectivity

## 🐛 Troubleshooting

### Common Issues

**CORS Errors in Production**
- Verify your backend API has CORS properly configured
- Ensure the frontend domain is allowed in backend CORS settings

**API URL Issues**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Ensure no trailing slash in the API URL
- Check that the API is accessible from the internet

**Build Failures**
- Ensure all dependencies are properly installed
- Check that the API URL is accessible during build (for health checks)

**Static Export Issues**
- Verify `next.config.js` has `output: 'export'` configured
- Check that no server-side only features are used

## 📞 Support

If you encounter issues during deployment:

1. Check the build logs for specific error messages
2. Verify your backend API is properly configured for CORS
3. Test API connectivity manually using curl or a tool like Postman

## 📚 Additional Resources

- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Render Static Sites Guide](https://render.com/docs/static-sites)
- [CORS Configuration Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
