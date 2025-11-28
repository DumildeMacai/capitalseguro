# Capital Seguro - Investment Platform

## Overview
Capital Seguro is a React + TypeScript investment platform built with Vite, featuring admin, partner, and investor dashboards. The platform is integrated with Supabase for authentication and data persistence.

## Recent Changes (November 28, 2025)

### Branding Updates
- Changed logo from "F"/"C" to "CS" across all components
- Updated branding in Login.tsx, Navbar.tsx, Footer.tsx, and Dashboard.tsx

### Return Rate Updates
- Changed all return rates from 50% to 100% throughout the application
- Updated files: HeroSection, HowItWorksSection, CTASection, FAQSection, TestimonialsSection, ReturnCalculator, Chart, Dashboard, InvestorDashboard, PartnerDashboard, Investments, InvestmentDetail, InvestmentOptions

### Color Harmonization
- Updated InvestorDashboard to match AdminDashboard styling (bg-gray-100 / dark:bg-gray-900)

### Notification Badge System
- Added notification badge with unread count to InvestorDashboard sidebar
- Badge disappears when user clicks on Notifications tab
- Uses destructive variant for visibility
- Added 3 mock notifications with different types

### Button Colors Harmonization
- Updated InvestorDashboard buttons to match AdminDashboard styles
- All buttons now use `variant="outline"` for consistency
- Removed custom color classes from logout button and other buttons

### Investments Page Light Theme
- Removed all dark gradients and slate colors from Investments.tsx
- Updated card backgrounds: bg-white in light mode, dark:bg-card in dark mode
- Changed filter section styling to light theme (bg-white dark:bg-card)
- Updated InvestmentDetail.tsx with light backgrounds
- Changed image gradient overlay from black/60 to black/30 for lighter appearance

### Hero Section Copy Updates
- Updated main headline: "Comece a Investir" + "Construa o Seu Legado Financeiro"
- New hero description: "Rendimento passivo que transforma sonhos em património real. Retornos que criam renda. Renda que constrói património."

## Project Architecture

### Frontend Stack
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Shadcn/ui component library
- Framer Motion for animations
- React Query for data fetching

### Backend
- Supabase (PostgreSQL database, authentication, storage)
- Project ID: xmemmdmyzwimluvgiqal

### Key Directories
- `/src/pages/` - Main pages (Login, Dashboard, InvestorDashboard, AdminDashboard, etc.)
- `/src/components/` - Reusable UI components
- `/src/integrations/supabase/` - Supabase client configuration
- `/src/contexts/` - React contexts (Auth)

### Known Issues
- Storage bucket creation fails due to RLS policies - requires manual SQL scripts in Supabase SQL Editor

## Running the Project
```bash
npm run dev
```
The application runs on port 5000.
