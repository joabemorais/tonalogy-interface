# Tonalogy Icon Usage Guide

## Overview
The Tonalogy icon was created to visually represent the core concepts of the project: harmonic analysis, modal logic, and tonal progressions. The design incorporates musical and geometric elements that reflect the analytical nature of the tool.

## Design Elements

### Visual Symbolism
- **Central Ellipse**: Represents the tonal center (main tonality)
- **Geometric Shapes**: Hexagons and diamonds represent different harmonic functions
- **Colored Circles**: Nodes of the Kripke structure (possible worlds)
- **Connection Lines**: Tonal transitions and harmonic relationships
- **Thematic Colors**:
  - Blue (`#4DABF7`): Primary tonal functions
  - Orange (`#FFA94D`): Dominant functions  
  - Green (`#69DB7C`): Subdominant functions

## Available Components

### 1. TonalogyIcon (React Component)
```tsx
import { TonalogyIcon } from '@/components/ui/tonalogy-icon'

// Basic usage
<TonalogyIcon size={24} />

// With custom class
<TonalogyIcon size={32} className="text-primary" />
```

**Features:**
- Automatic support for light/dark themes
- White elements adapt to background color (`hsl(var(--background))`)
- Black elements use `currentColor` to inherit text color
- Harmonic element colors maintain visual identity

### 2. Static SVG Files

#### `/public/icons/tonalogy-original.svg`
- Original version with white background
- For use in light theme contexts

#### `/public/icons/tonalogy-dark.svg`  
- Version adapted for dark theme
- Background `#121212` and light text

#### `/public/favicon.svg`
- Simplified version based on the original icon
- Maintains essential elements: central ellipse, colored circles, geometric shapes
- Optimized for small sizes (16px-32px)

## Implementation by Context

### Navigation
```tsx
// components/navigation.tsx
<TonalogyIcon size={28} className="text-primary" />
```

### Headers/Landing
```tsx
// components/header.tsx  
<TonalogyIcon size={32} className="text-primary" />
```

### Documentation/Marketing
```html
<!-- For static documents -->
<img src="/icons/tonalogy-original.svg" alt="Tonalogy" width="48" height="48">
```

### Favicon
Automatically configured in `layout.tsx`:
```tsx
icons: {
  icon: '/favicon.svg',
  shortcut: '/favicon.svg', 
  apple: '/favicon.svg',
}
```

## Theme Adaptation

### Elements that Adapt to Theme
- **Background**: `fill="hsl(var(--background))"`
- **Text/Outlines**: `stroke="currentColor"`  
- **Content Areas**: Use dynamic background color

### Elements with Fixed Colors
- **Harmonic Blue**: `#4DABF7` / `#A5D8FF`
- **Dominant Orange**: `#FFA94D` / `#FFD8A8`  
- **Subdominant Green**: `#69DB7C` / `#B2F2BB`

## Usage Guidelines

### Recommended Sizes
- **Navigation**: 28-32px
- **Headers**: 32-40px  
- **Landing Pages**: 48-64px
- **Illustrations**: 80px+
- **Favicon**: 16px, 32px

### Spacing
- Maintain minimum space of `0.5x` the icon size around it
- In logos, use `0.5x` between icon and text

### Contrast
- React component automatically ensures adequate contrast
- For static versions, verify contrast with background

## Future Variations

### Possible Expansions
- **Monochromatic Versions**: For print or restricted use
- **Horizontal Versions**: For signatures and documents
- **Simplified Versions**: For very small sizes
- **Animated Versions**: For loading or transitions

### Alternative Colors
The color system can be expanded using tonality palettes:
- Thematic versions by tonality
- Seasonal or contextual variations
- Adaptations for different products

## Technical Considerations

### Performance
- SVG optimized for fast loading
- React component renders inline (no extra requests)
- SVG favicon for better quality at high resolution

### Accessibility
- Adequate `alt` text when used as image
- Colors maintain WCAG AA minimum contrast
- Works with high contrast mode

### Compatibility
- SVG supported in all modern browsers
- Fallbacks can be added if needed
- TypeScript React component with typed props

---

*This icon represents the visual identity of Tonalogy and should be used consistently across all brand touchpoints.*
