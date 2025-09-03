# Project Structure

This document outlines the organized structure of the Tonalogy Interface project.

## 📁 Directory Structure

```
tonalogy-interface/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 api/               # API routes (development proxy)
│   ├── 📁 globals.css        # Global styles
│   ├── 📁 layout.tsx         # Root layout
│   └── 📁 page.tsx           # Home page
├── 📁 components/            # React components
├── 📁 deploy/                # 🆕 Deployment configuration
│   ├── 📄 .env.production    # Production environment
│   ├── 📄 .env.development   # Development template
│   ├── 📄 build-production.sh # Build script
│   ├── 📄 render.yaml        # Render.com config
│   ├── 📄 DEPLOYMENT.md      # Deployment guide
│   └── 📄 README.md          # Deploy overview
├── 📁 hooks/                 # Custom React hooks
├── 📁 lib/                   # Utilities and API client
├── 📁 public/                # Static assets
├── 📁 scripts/               # 🆕 Development scripts
│   ├── 📄 setup.sh           # Original setup script
│   └── 📄 dev-setup.sh       # Enhanced dev setup
├── 📁 stores/                # Zustand state management
├── 📁 types/                 # TypeScript type definitions
├── 📄 .env.example           # Environment template
├── 📄 GETTING_STARTED.md     # Quick start guide
├── 📄 README.md              # Project documentation
├── 📄 next.config.js         # Next.js configuration
├── 📄 package.json           # Dependencies and scripts
├── 📄 tailwind.config.js     # Tailwind CSS config
└── 📄 tsconfig.json          # TypeScript config
```

## 🎯 Key Improvements

### ✅ Organized Configuration
- **`deploy/`** - All deployment-related files
- **`scripts/`** - Development and build scripts
- Clean root directory with essential files only

### ✅ Environment Management
- **`.env.example`** - Simple development template
- **`deploy/.env.production`** - Production configuration
- **`deploy/.env.development`** - Development template

### ✅ Script Organization
- **`scripts/dev-setup.sh`** - Automated development setup
- **`deploy/build-production.sh`** - Production build
- **`scripts/setup.sh`** - Legacy setup script

### ✅ Documentation Structure
- **Root level** - User-facing documentation
- **`deploy/`** - Technical deployment guides
- Clear separation of concerns

## 🚀 Usage

### Development Setup
```bash
./scripts/dev-setup.sh
npm run dev
```

### Production Deployment
```bash
./deploy/build-production.sh
# or follow deploy/DEPLOYMENT.md
```

### Key Files by Purpose

| Purpose | File Location |
|---------|---------------|
| **Development start** | `scripts/dev-setup.sh` |
| **Production build** | `deploy/build-production.sh` |
| **Deployment guide** | `deploy/DEPLOYMENT.md` |
| **Quick start** | `GETTING_STARTED.md` |
| **Environment setup** | `.env.example` → `.env.local` |
| **Production config** | `deploy/.env.production` |

## 🔄 Migration Notes

Files moved to improve organization:
- `render.yaml` → `deploy/render.yaml`
- `build-production.sh` → `deploy/build-production.sh`
- `DEPLOYMENT.md` → `deploy/DEPLOYMENT.md`
- `setup.sh` → `scripts/setup.sh`

All scripts updated to reference new locations.
