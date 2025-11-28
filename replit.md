# Capital Seguro - Investment Platform

## Overview
Capital Seguro is a React + TypeScript investment platform built with Vite, featuring admin, partner, and investor dashboards. The platform is integrated with Supabase for authentication and data persistence.

## Recent Changes (November 28, 2025)

### Comprehensive Color Standardization (NEW)
- **Complete color palette migration to design system tokens** from hardcoded colors
- Replaced 44+ instances of hardcoded colors across 12 files with semantic design tokens
- **Color Token Mapping:**
  - `purple-600/700` → `primary` (brand color)
  - `slate-800/900` → `card` (card backgrounds)
  - `slate-700` → `border` (borders)
  - `slate-400` → `muted-foreground` (secondary text)
  - `gray-100/50` → `background` (light backgrounds)
  - `emerald-500/600` → `primary` (accent/success actions)
  - `text-white` → `text-foreground` (primary text)
- **Files Updated:** FeatureCard, HowItWorksSection, InvestmentCard, StatsSection, AdminDashboard, InvestorDashboard, PartnerDashboard, NotFound, Investments, InvestmentDetail, ReturnCalculator, About
- **Benefits:** Unified light/dark mode support, consistent visual hierarchy, easier theme customization

### Branding Updates (Completed)
- Changed logo from "F"/"C" to "CS" across all components
- Updated branding in Login.tsx, Navbar.tsx, Footer.tsx, and Dashboard.tsx

### Return Rate Updates (Completed)
- Changed all return rates from 50% to 100% throughout the application
- Updated files: HeroSection, HowItWorksSection, CTASection, FAQSection, TestimonialsSection, ReturnCalculator, Chart, Dashboard, InvestorDashboard, PartnerDashboard, Investments, InvestmentDetail, InvestmentOptions

### Investments Page Light Theme (Completed)
- Removed all dark gradients and slate colors from Investments.tsx
- Updated card backgrounds: bg-white in light mode, dark:bg-card in dark mode
- Changed filter section styling to light theme (bg-white dark:bg-card)
- Updated InvestmentDetail.tsx with light backgrounds
- Changed image gradient overlay from black/60 to black/30 for lighter appearance

### Hero Section Copy Updates (Completed)
- Updated main headline: "Comece a Investir" + "Construa o Seu Legado Financeiro"
- New hero description: "Rendimento passivo que transforma sonhos em património real. Retornos que criam renda. Renda que constrói património."

## Project Architecture

### Frontend Stack
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling with semantic design tokens
- Shadcn/ui component library
- Framer Motion for animations
- React Query for data fetching

### Design System
- **Color Tokens:** Defined in `tailwind.config.ts` and `src/index.css`
- **Semantic Variables:** primary, success, accent, muted-foreground, border, background, card
- **All components use design system tokens** - No hardcoded colors
- Supports automatic light/dark mode switching

### Backend
- Supabase (PostgreSQL database, authentication, storage)
- Project ID: xmemmdmyzwimluvgiqal

### Key Directories
- `/src/pages/` - Main pages (Login, Dashboard, InvestorDashboard, AdminDashboard, etc.)
- `/src/components/` - Reusable UI components (all using design tokens)
- `/src/integrations/supabase/` - Supabase client configuration
- `/src/contexts/` - React contexts (Auth)

### Known Issues
- Storage bucket creation fails due to RLS policies - requires manual SQL scripts in Supabase SQL Editor

## Running the Project
```bash
npm run dev
```
The application runs on port 5000.
