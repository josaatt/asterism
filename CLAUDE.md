# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Requirements
- Node.js >=20.0.0
- npm for package management

## Architecture Overview

### Tech Stack
- **Remix v2.16.8** with Vite for SSR React framework
- **TypeScript** for type safety
- **Tailwind CSS** with custom design tokens for styling
- **Radix UI** headless components for accessibility
- **Lucide React** for icons

### Design System
The application uses a sophisticated design system centered around Swedish legal case display:

**Color Palette:**
- Primary: Burgundy (#6D0E0E) for accents and interactive elements
- Background: Warm gray (#E8E5E1) for a welcoming professional feel
- Cards: White with subtle shadows for content display

**Typography:**
- Headers: Georgia serif for formal legal context
- Body: Inter sans-serif for readability
- Special elements: La Belle Aurore cursive for branding (asterisk logo, special headings)
- Design pattern: Lowercase headings with pilcrow (¶) symbols positioned higher/left

**Component System:**
Located in `app/design-system/components.ts` - contains reusable styling patterns:
- `card`: White cards with hover effects for legal case display
- `metadataTag`: Underlined tags with burgundy accents
- `enhancedParagraph`: Enhanced typography for legal text
- `enhancedFirstWord`: Serif styling for first words in paragraphs

### Data Architecture
**Legal Cases Structure (`app/data/legal-cases.ts`):**
- Swedish legal cases with comprehensive metadata
- TypeScript interface: `LegalCase` with fields for case numbers, courts, legal areas, decisions, rulings
- 7 sample cases covering different legal domains (Avtalsrätt, Arbetsrätt, Dataskydd, etc.)

### UI Components
**View System:**
- `comp-108.tsx`: View toggle component for switching between card/table views
- Dual display modes: Cards (detailed) vs Table (compact overview)

**Filter System (`app/components/ui/table-filters.tsx`):**
- Search across title, summary, background, case numbers, keywords
- Dropdown filters for Court, Legal Area, Year
- Uses Command/Popover pattern for accessibility
- Real-time filtering with result counts

**Base Components (`app/components/ui/`):**
- Radix UI wrappers with consistent styling
- Button component uses forwardRef for Radix compatibility
- All components follow Tailwind + design token patterns

### Routes Structure
- `_index.tsx`: Landing page with feature cards linking to legal tools
- `rättspraxis.tsx`: Main legal cases page with view toggle and filtering
- Swedish URL routing for legal context

### Key Patterns
**State Management:**
- React useState for view modes and filter states
- useMemo for performant case filtering
- Controlled components throughout

**Styling Approach:**
- CSS custom properties in `app/tailwind.css` for theme tokens
- Tailwind utilities with design system patterns
- cn() utility for conditional classes with clsx and tailwind-merge

**TypeScript Usage:**
- Strict typing for legal case data
- Interface definitions for props and component contracts
- Type-safe styling variants with class-variance-authority