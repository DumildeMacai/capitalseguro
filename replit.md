# Capital Seguro - Investment Platform

## Overview
Capital Seguro is a React + TypeScript investment platform built with Vite, featuring admin, partner, and investor dashboards. The platform is integrated with Supabase for authentication and data persistence.

## Recent Changes (November 28, 2025)

### Favicon e Open Graph Meta Tags (LATEST - COMPLETED)
- **Logo favicon configurado**: Uso do logo CS em `public/logo.png`
- **Open Graph tags** para WhatsApp, Facebook, Telegram e LinkedIn
- **Twitter Cards** para compartilhamento em redes sociais
- **Theme color**: `#7E69AB` (purple brand color)
- Configuração de titulo e descrição otimizados para SEO social sharing
- Meta tags apontam para `/logo.png` (favicon + og:image)

### InvestmentCard Dark Theme Standardization (Completed)
- **Forced dark mode styling for investment cards** to maintain consistency with design mockups
- Changed cards to use `bg-slate-900` (very dark background) in all modes
- Updated card borders to `border-slate-700`
- Set category badges to `bg-slate-600` with text-white
- Return rates display in `text-emerald-400` (green success color)
- Button gradient uses `bg-gradient-primary` (purple to navy gradient)
- Progress bars use emerald-green for visual consistency
- Text hierarchy: white headings, slate-400 descriptions, emerald accents

### Comprehensive Color Standardization (Completed)
- **Complete color palette migration to design system tokens** from hardcoded colors
- Replaced 44+ instances of hardcoded colors across 12 files with semantic design tokens
- **Color Token Mapping:**
  - `primary` - purple/magenta brand color (#7E69AB)
  - `card` - light/dark card backgrounds
  - `border` - border colors (slate-700 dark)
  - `muted-foreground` - secondary text (slate-400)
  - `background` - page backgrounds
  - `emerald-400` - success/accent actions (100% return rates)
  - `text-white` - primary text on dark backgrounds
- **Files Updated:** FeatureCard, HowItWorksSection, InvestmentCard, StatsSection, AdminDashboard, InvestorDashboard, PartnerDashboard, NotFound, Investments, InvestmentDetail, ReturnCalculator, About

### Branding Updates (Completed)
- Changed logo from "F"/"C" to "CS" across all components
- Updated branding in Login.tsx, Navbar.tsx, Footer.tsx, and Dashboard.tsx

### Return Rate Updates (Completed)
- Changed all return rates from 50% to 100% throughout the application

### Hero Section Copy Updates (Completed)
- Updated main headline: "Comece a Investir" + "Construa o Seu Legado Financeiro"
- New hero description focused on passive income and wealth building

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
- **Custom Colors:** navy, purple, gold, success palettes
- **Gradient Utility:** `bg-gradient-primary` (purple → navy)
- **All components use design system tokens** - No hardcoded colors
- Supports automatic light/dark mode switching
- Investment cards styled for dark theme consistency

### Backend
- Supabase (PostgreSQL database, authentication, storage)
- Project ID: xmemmdmyzwimluvgiqal

### Key Directories
- `/src/pages/` - Main pages (Login, Dashboard, InvestorDashboard, AdminDashboard, etc.)
- `/src/components/` - Reusable UI components (all using design tokens)
- `/src/integrations/supabase/` - Supabase client configuration
- `/src/contexts/` - React contexts (Auth)
- `/public/` - Static assets including logo.png for favicon and social sharing

### Known Issues
- Storage bucket creation fails due to RLS policies - requires manual SQL scripts in Supabase SQL Editor

## Running the Project
```bash
npm run dev
```
The application runs on port 5000.

## Social Sharing Configuration
The site is now properly configured for social media sharing:
- **WhatsApp**: Shows CS logo, "Capital Seguro | Gestão de Ativos" title
- **Facebook**: Shows preview with custom logo and description
- **Telegram**: Shows complete preview card
- **LinkedIn**: Professional sharing with full metadata
- All platforms use `/public/logo.png` as the preview image
