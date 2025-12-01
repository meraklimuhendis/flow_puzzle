# Flow Puzzle Game

## Overview

A minimalist Flow Puzzle web game inspired by Flow Free and Apple's design principles. Players connect matching letter pairs by drawing continuous paths on a grid without intersecting paths. The game features three difficulty levels (Easy: 5x5, Medium: 6x6, Hard: 7x7) with a clean, pastel-colored interface optimized for both desktop and mobile interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack:**
- React 18 with TypeScript for type-safe component development
- Vite for fast development and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query for server state management (prepared for future API integration)

**UI Component System:**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS with custom design tokens for consistent styling
- "New York" style variant with pastel color palette
- Responsive design using mobile-first breakpoints

**Game State Management:**
- Custom game engine with immutable state updates (`client/src/logic/gameEngine.ts`)
- Path-based drawing system tracking segments and completion status
- Level generator with pre-configured puzzle layouts for each difficulty
- Real-time collision detection for path intersections

**Input Handling:**
- Unified mouse and touch event handling for cross-device compatibility
- Canvas-based path rendering using SVG polylines
- Grid-based coordinate system with precise cell detection

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- HTTP server with middleware for JSON parsing and logging
- Modular route registration system (currently minimal, designed for expansion)

**Storage Layer:**
- In-memory storage implementation (`MemStorage`) for development
- Abstract storage interface (`IStorage`) supporting future database integration
- User schema defined with Drizzle ORM, ready for PostgreSQL migration

**Build System:**
- esbuild for optimized server bundling with selective dependency bundling
- Vite for client-side asset compilation
- Separate production and development configurations

### Design System

**Visual Theme:**
- Pastel color palette with 6 distinct letter-pair colors
- Soft shadows (shadow-md, shadow-lg) for depth
- Rounded corners (rounded-xl) for modern aesthetic
- Smooth transitions (duration-150, duration-200) for interactions

**Typography:**
- Inter font family (Google Fonts CDN)
- Responsive font sizing based on grid complexity
- Semibold weights for UI controls, bold for letter endpoints

**Layout Principles:**
- Centered grid layout with flexbox
- Consistent spacing using Tailwind's spacing scale (gap-2, gap-4, gap-6, gap-8)
- Responsive tile sizing that adapts to viewport constraints

### External Dependencies

**UI Component Libraries:**
- @radix-ui/* primitives for accessible, unstyled components (accordion, dialog, dropdown-menu, etc.)
- class-variance-authority and clsx for dynamic className composition
- lucide-react for consistent iconography
- embla-carousel-react for potential future carousel features

**Database & ORM:**
- Drizzle ORM with PostgreSQL dialect configured for future database integration
- @neondatabase/serverless for serverless PostgreSQL deployment
- drizzle-zod for schema validation integration

**Development Tools:**
- @replit/vite-plugin-* suite for Replit-specific development enhancements
- tsx for TypeScript execution during development
- postcss with autoprefixer for CSS processing

**Session & State:**
- express-session configured for future user session management
- connect-pg-simple for PostgreSQL-backed sessions (when database is added)
- @tanstack/react-query for optimistic updates and caching

**Form & Validation:**
- react-hook-form for performant form handling
- zod for runtime type validation
- @hookform/resolvers for integration between validation and form libraries

**Note:** The application is architected for PostgreSQL but currently uses in-memory storage. Database integration requires setting the `DATABASE_URL` environment variable and running migrations.