# Tonalogy Interface - Q## 🚀 Quick Start

### Automated Setup (Recommended)

```bash
./scripts/dev-setup.sh
```

This script will:
- Create `.env.local` from development template
- Install dependencies
- Check API connectivity
- Provide next steps

### Manual Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp deploy/.env.development .env.local
   ```
   Edit `.env.local` if your API runs on a different URL.uide

## 🎯 What You Have Now

A complete, modern web interface for the Tonalogy API with:

### ✅ Core Features Implemented
- **🎵 Harmonic Analysis Interface**: Interactive chord input with real-time validation
- **📊 Visual Analysis Results**: Step-by-step explanation display
- **🖼️ Diagram Visualization**: PNG generation with light/dark themes
- **💾 Analysis History**: Persistent storage with favorites
- **🎨 Modern UI**: Responsive design with Tailwind CSS + Shadcn/ui
- **🔄 State Management**: Zustand for client-side state
- **📱 Responsive Design**: Works on desktop, tablet, and mobile

### 🛠️ Technical Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + **Shadcn/ui** for styling
- **TanStack Query** for API state management
- **Zustand** for global state
- **Axios** for HTTP requests
- **React Hook Form** + **Zod** for forms

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` if your API runs on a different URL.

3. **Start development server**:
   ```bash
   npm run dev
   ```
   > **💡 Tip**: Use `Ctrl+C` to stop the server when needed.

4. **Open browser**: http://localhost:3000

## 🚀 Production Deployment

For deploying to production (static hosting):

1. **Use automated build script**:
   ```bash
   ./deploy/build-production.sh
   ```

2. **Or manual build**:
   ```bash
   export NEXT_PUBLIC_API_URL=https://tonalogy-api.onrender.com
   npm run build:static
   ```

3. **Deploy**: Upload the `out/` directory to your static hosting service

> **📚 See [`deploy/DEPLOYMENT.md`](./deploy/DEPLOYMENT.md) for detailed deployment instructions**

## 🎹 How to Use

### Basic Workflow
1. **Enter chords**: Type chord progressions like "C Am F G C" (must end on tonic)
2. **Analyze**: Click "Analyze" to get tonal analysis
3. **Visualize**: Click "Visualize" to generate diagrams
4. **Download**: Save diagrams as PNG files

### Advanced Features
- **Tonality Testing**: Select specific tonalities to test
- **Theme Selection**: Choose light/dark for visualizations
- **History Management**: View and favorite past analyses
- **Real-time Validation**: Chord input with suggestions

## 🔧 Customization

### API Configuration
- Edit `NEXT_PUBLIC_API_URL` in `.env.local`
- Default: `http://localhost:8000`

### Styling
- Global styles: `app/globals.css`
- Theme configuration: `tailwind.config.js`
- Component styles: Individual component files

### Adding Features
- New components: `components/`
- API client: `lib/api-client.ts`
- State management: `stores/index.ts`
- Types: `types/index.ts`

## 📱 Mobile Support

The interface is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure Tonalogy API is running
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Verify no CORS issues

2. **Dependencies Not Installing**
   - Ensure Node.js 18+ is installed
   - Try deleting `node_modules` and `package-lock.json`
   - Run `npm install` again

3. **Build Errors**
   - Run `npm run type-check` to see TypeScript errors
   - Check that all imports are correct
   - Ensure API types match backend

### Development Tips

- Use `npm run dev` for hot reloading
- TypeScript errors will show in terminal
- Check browser console for runtime errors
- Use React DevTools for debugging

## 📈 What's Next

### Potential Enhancements
- **Audio Playback**: Play chord progressions
- **MIDI Support**: Import MIDI files
- **Export Options**: PDF reports, JSON data
- **User Accounts**: Save analyses to cloud
- **Collaborative Features**: Share analyses
- **Advanced Visualizations**: Interactive diagrams

### Integration Options
- Embed as iframe in other applications
- Use as PWA (Progressive Web App)
- Deploy to cloud platforms (Vercel, Netlify)
- Package as Electron app for desktop

## 🎓 Learning Resources

To understand the theoretical foundations:
- Read the [Tonalogy API documentation](../tonalogy-api/README.md)
- Review the academic paper in `docs/tcc1_ajamorais.pdf`
- Explore the CLI examples in `../tonalogy-cli/`

## 🤝 Contributing

This is an academic project. For contributions:
1. Maintain the existing code style
2. Add TypeScript types for new features
3. Update documentation
4. Test with the Tonalogy API

---

**🎵 Happy analyzing! The interface is ready to help you explore harmonic progressions with the power of Kripke semantics.**
