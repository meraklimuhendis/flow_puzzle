# Flow Puzzle Game - Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (Apple/Flow Free inspired minimalist puzzle game aesthetic)

This is a premium puzzle game requiring a clean, focused, distraction-free interface. The design draws inspiration from Flow Free's elegant simplicity and Apple's minimalist design principles, prioritizing clarity and smooth interactions.

## Core Design Elements

### Typography
- **Primary Font:** Inter or SF Pro Display (via Google Fonts CDN)
- **Font Weights:** Regular (400) for body, Medium (500) for UI elements, Semibold (600) for difficulty selector
- **Font Sizes:** 
  - Difficulty selector: text-lg (18px)
  - Timer display: text-2xl (24px)
  - Letter cells: text-xl to text-3xl (responsive based on grid size)

### Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8
- Component spacing: p-4, p-6
- Section gaps: gap-4, gap-6
- Margin between elements: m-4, m-6, m-8

**Grid Layout:**
- Fully centered vertically and horizontally on viewport
- Difficulty selector at top with gap-8 from grid
- Timer positioned gap-6 below grid
- Grid cells with gap-2 between tiles

### Visual Theme

**Color Palette - Pastel & Soft:**
- Letter pairs use pastel colors: soft pink, lavender, mint green, peach, sky blue, coral
- Empty tiles: white (bg-white)
- Active path drawing: semi-transparent overlay matching pair color
- Background: light gray (bg-gray-50) or subtle gradient

**Tile Design:**
- Rounded corners: rounded-xl (12px border radius)
- Soft drop shadows: shadow-md for tiles, shadow-lg for active tiles
- Border: subtle 1px border in light gray for empty tiles
- Smooth transitions: transition-all duration-200

### Component Library

**Difficulty Selector:**
- Horizontal button group, centered alignment
- Active state: filled background with pastel color, slight scale transform
- Inactive state: transparent background with border
- Smooth transitions on selection
- Touch-friendly sizing (min 44px height)

**Grid & Tiles:**
- Square tiles with consistent aspect ratio
- Responsive sizing (smaller on mobile, larger on desktop)
- Letter tiles: bold letter centered with pastel background
- Empty tiles: white with subtle border
- Active tile (during drawing): subtle glow effect with shadow-lg

**Path Drawing:**
- Smooth SVG paths connecting tiles
- Semi-transparent colored lines (opacity 0.7)
- Line width: 6-8px for visibility
- Rounded line caps and joins
- Animated drawing effect (subtle)

**Timer Component:**
- Clean digital display or simple text format
- Three buttons: Start, Pause, Reset
- Buttons: rounded-lg, minimal style, subtle hover states
- Auto-pause styling change when puzzle complete

### Animations & Interactions

**Use Sparingly - Critical Moments Only:**
- Tile selection: subtle scale (scale-105) and shadow increase
- Path drawing: smooth line animation as user drags
- Puzzle completion: gentle celebration animation (scale pulse or glow)
- Button interactions: subtle scale and background transitions

**Touch/Mouse Interactions:**
- Immediate visual feedback on tile press/click
- Smooth path preview while dragging
- Valid connection: keep path with smooth fade-in
- Invalid connection: remove with quick fade-out
- Path replacement: cross-fade between old and new paths

### Responsive Design

**Desktop (lg and above):**
- Grid tiles: 60-80px per tile
- Generous spacing around grid
- Timer and controls comfortably sized

**Tablet (md):**
- Grid tiles: 50-70px per tile
- Adjusted spacing to fit viewport

**Mobile (base):**
- Grid tiles: 45-60px per tile (responsive to screen width)
- Optimized for touch: minimum 44px touch targets
- Works in both portrait and landscape
- Full-width grid container with proper padding

### Accessibility

- High contrast between letters and backgrounds
- Touch targets minimum 44x44px
- Clear visual feedback for all interactions
- Keyboard support not required (puzzle game)
- Color differentiation plus letter labels for color-blind users

## Layout Structure

```
┌─────────────────────────────────┐
│                                 │
│    [ Easy | Medium | Hard ]     │  ← Difficulty selector (centered, gap-8 below)
│                                 │
│         ┌─────────────┐         │
│         │   5x5 Grid  │         │  ← Puzzle grid (perfectly centered)
│         │   (or 6x6   │         │
│         │    or 7x7)  │         │
│         └─────────────┘         │
│                                 │
│       Timer: 00:45              │  ← Timer display (gap-6 below grid)
│    [Start] [Pause] [Reset]     │  ← Timer controls (gap-2 below display)
│                                 │
└─────────────────────────────────┘
```

## Critical Design Principles

1. **Minimalism First:** Remove all unnecessary elements, focus on the puzzle
2. **Soft & Approachable:** Pastel colors, rounded shapes, gentle shadows
3. **Smooth Interactions:** Every interaction should feel fluid and responsive
4. **Mobile-First Touch:** Optimized for touch with generous hit areas
5. **Instant Feedback:** Visual response within 100ms of user action
6. **No Distractions:** Clean, focused interface with no clutter

## Images

No images required - this is a pure puzzle game with generated graphics (SVG paths and colored tiles).