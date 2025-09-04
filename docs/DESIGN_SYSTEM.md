# Tonalogy Design System v2.0

## Overview
A comprehensive, modern design system for Tonalogy harmonic analysis interface, inspired by Linear and Raycast aesthetics. This system emphasizes deep contrast, sophisticated color harmonies, musical theory integration, and exceptional accessibility across all platforms and devices.

## Project Scope & Evolution

### Current Implementation Status
- ✅ **Core Color System**: Fully implemented HSL-based theme switching
- ✅ **Component Architecture**: Modular shadcn/ui components with Tailwind CSS
- ✅ **Typography System**: Inter font with optimized font features
- ✅ **Responsive Design**: Mobile-first approach with bottom navigation
- ✅ **Theme Management**: System/manual theme switching with persistence
- ✅ **Tonality Visualization**: Complete color palette for 12 major tonalities
- ✅ **Tonality Integration**: Live color theming across analysis components
- ✅ **Accessibility**: WCAG AA compliance with high contrast ratios
- ✅ **Micro-interactions**: Smooth animations and state transitions
- ✅ **Musical Context**: Dashed borders for minor tonalities visual distinction

### Design Philosophy
- **Musical Authenticity**: Visual elements reflecting harmonic theory principles
- **Academic Credibility**: Professional appearance suitable for research contexts
- **Technical Sophistication**: Modern design reflecting computational intelligence
- **Universal Accessibility**: Inclusive design for all users and devices
- **Performance-First**: Optimized rendering and lightweight implementations

## Color System Architecture

### Implementation Strategy
All colors are implemented using HSL (Hue, Saturation, Lightness) values in CSS custom properties, enabling:
- **Seamless Theme Switching**: Instant transitions between light/dark modes
- **Dynamic Color Manipulation**: Runtime adjustments for accessibility
- **Consistent Color Management**: Single source of truth across the application
- **Brand Flexibility**: Easy customization while maintaining design coherence

### Color Palette

### Dark Theme (Primary)
Our dark theme uses deep blacks and grays with vibrant accent colors for a premium, professional feel.

#### Background Colors
- **Background**: `#121212` (HSL: 0 0% 7%)
  - Main application background, very dark gray-black
- **Card**: `#171717` (HSL: 0 0% 9%)
  - Elevated surfaces, slightly lighter than background
- **Popover**: `#1c1c1c` (HSL: 0 0% 11%)
  - Modal overlays and floating panels
- **Secondary**: `#212121` (HSL: 0 0% 13%)
  - Secondary buttons and inactive elements
- **Muted**: `#262626` (HSL: 0 0% 15%)
  - Input backgrounds and disabled states
- **Border**: `#2e2e2e` (HSL: 0 0% 18%)
  - Subtle borders and dividers

#### Text Colors
- **Foreground**: `#f2f2f2` (HSL: 0 0% 95%)
  - Primary text color, near white
- **Secondary Text**: `#d9d9d9` (HSL: 0 0% 85%)
  - Secondary text elements
- **Muted Text**: `#a6a6a6` (HSL: 0 0% 65%)
  - Placeholder text and disabled labels

#### Accent Colors
- **Primary**: `#5b9df9` (HSL: 213 93% 68%)
  - Modern bright blue for CTAs and focus states
- **Primary Text**: `#0d0d0d` (HSL: 0 0% 5%)
  - Text on primary backgrounds
- **Destructive**: `#f56565` (HSL: 0 75% 60%)
  - Error states and delete actions

### Light Theme
A clean, high-contrast light theme with the same modern blue accent.

#### Background Colors
- **Background**: `#ffffff` (HSL: 0 0% 100%)
  - Pure white background
- **Card**: `#ffffff` (HSL: 0 0% 100%)
  - White cards with shadow elevation
- **Secondary**: `#f5f5f5` (HSL: 0 0% 96%)
  - Light gray for secondary elements
- **Border**: `#e6e6e6` (HSL: 0 0% 90%)
  - Subtle gray borders

#### Text Colors
- **Foreground**: `#171717` (HSL: 0 0% 9%)
  - Almost black text for maximum contrast
- **Muted Text**: `#737373` (HSL: 0 0% 45%)
  - Secondary text and placeholders

#### Accent Colors
- **Primary**: `#5b9df9` (HSL: 213 93% 68%)
  - Same modern blue as dark theme
- **Primary Text**: `#ffffff` (HSL: 0 0% 100%)
  - White text on primary
- **Destructive**: `#e53e3e` (HSL: 0 75% 55%)
  - Slightly darker red for light backgrounds

### Tonality Color Palette
Specialized color system for harmonic visualization and tonality representation.

#### Light Theme Tonality Colors
Each tonality has a unique color identity with stroke, fill, and label variants for comprehensive visualization:

| Tonality | Stroke | Fill | Label |
|----------|--------|------|-------|
| C Major | `#4dabf7` | `#a5d8ff` | `#1971c2` |
| C# Major | `#5BC3BA` | `#ACE5DD` | `#248883` |
| D Major | `#69db7c` | `#b2f2bb` | `#2f9e44` |
| D# Major | `#B4D85C` | `#D9EFAA` | `#909522` |
| E Major | `#ffd43b` | `#ffec99` | `#f08c00` |
| F Major | `#ffa94d` | `#ffd8a8` | `#e8590c` |
| F# Major | `#FF986A` | `#FFD1B9` | `#E4451F` |
| G Major | `#ff8787` | `#ffc9c9` | `#e03131` |
| G# Major | `#FB859A` | `#FEC6D0` | `#D12B47` |
| A Major | `#f783ac` | `#fcc2d7` | `#c2255c` |
| A# Major | `#E97DCF` | `#F5C0E9` | `#AF2E89` |
| B Major | `#da77f2` | `#eebefa` | `#9c36b5` |

#### Dark Theme Tonality Colors
Adapted color palette for dark theme visualizations with enhanced contrast:

| Tonality | Stroke | Fill | Label |
|----------|--------|------|-------|
| C Major | `#2273b4` | `#154163` | `#56a2e8` |
| C# Major | `#136d65` | `#0d3e37` | `#479d99` |
| D Major | `#046615` | `#046615` | `#3a994c` |
| D# Major | `#315000` | `#315000` | `#797d1a` |
| E Major | `#5f3a00` | `#5f3a00` | `#5f3a00` |
| F Major | `#924800` | `#4d2b02` | `#f17634` |
| F# Major | `#a14922` | `#a14922` | `#ff7c5c` |
| G Major | `#b44d4d` | `#5b2c2c` | `#ff8383` |
| G# Major | `#cc59a2` | `#cc59a2` | `#ff8ac9` |
| A Major | `#e466f7` | `#e466f7` | `#ff92ff` |
| A# Major | `#b476fa` | `#3a2f56` | `#db9cff` |
| B Major | `#8385fd` | `#8385fd` | `#b0a7ff` |

#### Tonality Color Usage Guidelines
- **Stroke**: Used for borders, outlines, and connection lines in harmonic diagrams
- **Fill**: Background colors for tonality regions and highlighted areas
- **Label**: High-contrast text color for tonality labels and annotations
- **Color Harmony**: Colors are arranged chromatically around the circle of fifths
- **Accessibility**: Each tonality maintains sufficient contrast ratios across themes
- **Visualization**: Colors help users quickly identify tonal centers and modulations
- **Minor Distinction**: Minor tonalities use dashed borders for visual differentiation
- **Interactive States**: Hover and selection states enhance user feedback
- **Badge System**: Consistent tonality badges across all interface components

### Implementation Features

#### Tonality Color System
The Tonality Color System provides sophisticated color theming for harmonic analysis:

**Core Components:**
- `lib/tonality-colors.ts`: Complete color palette and utility functions
- `hooks/use-tonality-theme.ts`: Theme-aware color hooks and styling utilities
- `components/ui/tonality-badge.tsx`: Reusable tonality badge components

**Key Functions:**
- `getTonalityColor()`: Theme-aware color retrieval
- `getTonalityStyles()`: Complete CSS style objects
- `isMinorTonality()`: Minor tonality detection for dashed borders
- `useTonalityTheme()`: React hook for color theming

**Visual Features:**
- **Smart Theming**: Automatic light/dark theme adaptation
- **Minor Distinction**: Dashed borders for minor tonalities
- **Interactive States**: Hover effects with color transitions  
- **Badge Variants**: Multiple badge styles (default, outline, subtle)
- **Size Options**: Small, medium, and large sizing
- **Accessibility**: High contrast ratios maintained across all themes

## Typography

### Principles
- **Hierarchy**: Clear visual hierarchy using size, weight, and spacing
- **Readability**: High contrast ratios for accessibility
- **Consistency**: Standardized type scale across all components

### Font Features
- **Ligatures**: Enabled with `"rlig" 1, "calt" 1`
- **Modern Stack**: System fonts for optimal performance and native feel

## Component Design Patterns

### Design System Integration
The component system is built on shadcn/ui foundations with custom Tonalogy enhancements:
- **Consistent Spacing**: 4px base unit system (Tailwind spacing scale)
- **Unified Interactions**: Standardized hover, focus, and active states
- **Theme-Aware Components**: All components respond to system/manual theme changes
- **Musical Context**: Specialized components for harmonic analysis workflows

### Interface Hierarchy

#### Navigation Systems
- **Desktop Navigation**: Collapsible sidebar with contextual sections
- **Mobile Navigation**: Bottom tab bar following iOS/Android patterns
- **Breadcrumbs**: Clear navigation paths for complex analysis workflows
- **Theme Integration**: Navigation elements adapt to current theme with smooth transitions

### Musical Interface Elements

#### Chord Buttons
- **Size**: 80px × 56px (w-20 h-14)
- **Border Radius**: 12px (rounded-xl)
- **Typography**: Base size, semibold weight
- **States**:
  - Default: Background with subtle border
  - Hover: Lift effect with shadow and scale (105%)
  - Active: Press effect with scale (95%)
  - Focus: Primary color ring
  - Selected: Primary background with elevation

#### Builder Panels
- **Background**: Popover color with elevated appearance
- **Border Radius**: 12px (rounded-xl)
- **Shadow**: Deep shadow (shadow-xl) for floating effect
- **Padding**: 24px (p-6) for generous spacing
- **Animation**: Slide-in from top with 200ms duration

#### Tonality Selection Interface
- **Grid Layout**: 2-column mobile, 3-column desktop for optimal scanning
- **Color-Coded Selection**: Each tonality uses its unique color identity
- **Visual Feedback**: Immediate selection state with tonality-specific highlighting
- **Dashed Borders**: Minor tonalities distinguished with dashed border styling
- **Interactive States**: Smooth hover animations with color transitions
- **Scrollable Container**: Maximum height with custom styled scrollbars
- **Bulk Operations**: Clear all/select common patterns functionality
- **Live Updates**: Real-time count and preview of selected tonalities
- **Badge Integration**: Selected tonalities displayed as colored badges

#### Tonality Badge System
- **Multiple Variants**: Default, outline, and subtle styling options
- **Size Scaling**: Small (12px), medium (16px), and large (20px) variants
- **Color Integration**: Automatic theme-aware color application
- **Minor Distinction**: Dashed borders for minor tonality identification
- **Icon Support**: Optional music icons and indicator dots
- **Responsive Design**: Adaptive sizing for different screen contexts

#### Accordion Components
- **Integrated Design**: Unified border containers with smooth expansion
- **Visual States**: Clear open/closed indicators with chevron animations
- **Content Hierarchy**: Proper spacing and typography within expanded sections
- **Theme Consistency**: Background transitions that respect current theme

#### Analysis Results Display
- **Progressive Disclosure**: Expandable sections for detailed analysis
- **Color-Coded Results**: Tonality-specific colors for visual identification
- **Enhanced Badges**: Sophisticated tonality badges with theme integration
- **Step-by-Step Visualization**: Each analysis step shows relevant tonality colors
- **Export Capabilities**: Downloadable visualizations in multiple formats
- **Theme Switching**: Independent diagram theme control with system sync option
- **Minor Detection**: Automatic dashed border styling for minor tonalities

### Layout Architecture

#### Responsive Breakpoints
- **Mobile First**: Base styles optimized for 320px+ viewports
- **Tablet**: 768px+ with enhanced interaction patterns
- **Desktop**: 1024px+ with sidebar navigation and advanced features
- **Large Desktop**: 1400px+ with optimized content width

#### Grid Systems
- **Content Grids**: CSS Grid for complex layouts with proper fallbacks
- **Component Grids**: Flexbox for component-level arrangements
- **Musical Grids**: Specialized grids for chord progressions and tonality matrices

#### Spacing System
- **Base Unit**: 4px (0.25rem) for micro-spacing
- **Component Spacing**: 16px-24px (1rem-1.5rem) for component padding
- **Section Spacing**: 32px (2rem) for major section separation
- **Page Spacing**: 64px (4rem) for page-level content separation

## Advanced Interaction Patterns

### State Management & Feedback
- **Loading States**: Skeleton screens and progressive loading indicators
- **Error Handling**: Contextual error messages with recovery actions
- **Success Feedback**: Subtle confirmations without disrupting workflow
- **Progress Indicators**: Clear progress communication for analysis operations

### Micro-Interactions & Animations
- **Button Press**: Scale down to 95% with 200ms duration
- **Button Hover**: Scale up to 105% with smooth transition
- **Panel Open**: Slide-in animation with fade
- **State Changes**: 200ms ease-out transitions

### Focus Management
- **Keyboard Navigation**: Clear focus rings using primary color
- **Touch Targets**: Minimum 44px for accessibility
- **Visual Feedback**: Immediate response to user actions

## Accessibility

### Color Contrast
- **Dark Theme**: High contrast ratios for WCAG AA compliance
- **Light Theme**: Maximum contrast with pure white backgrounds
- **Interactive Elements**: Always meet contrast requirements

### Motion & Animation
- **Reduced Motion**: Respect user preferences
- **Focus Indicators**: Always visible and high contrast
- **Touch Targets**: Adequately sized for all input methods

## Implementation Notes

### CSS Custom Properties
All colors are defined as HSL values in CSS custom properties for:
- **Theme Switching**: Seamless transitions between light/dark
- **Customization**: Easy brand color modifications
- **Consistency**: Single source of truth for all color values

### Component Architecture
- **Modular Design**: Reusable component patterns
- **Responsive**: Mobile-first approach with desktop enhancements
- **Performance**: Optimized animations and lightweight styles

## Brand Personality

### Visual Characteristics
- **Modern**: Clean lines and contemporary aesthetics
- **Professional**: Sophisticated color choices and typography
- **Accessible**: High contrast and clear hierarchy
- **Musical**: Color harmony reflecting musical theory

### User Experience
- **Intuitive**: Familiar patterns from modern design systems
- **Efficient**: Reduced cognitive load with clear affordances
- **Delightful**: Subtle animations and polished interactions
- **Consistent**: Unified experience across all touchpoints

---

*This design system ensures Tonalogy maintains a premium, professional appearance while providing an excellent user experience for harmonic analysis workflows.*