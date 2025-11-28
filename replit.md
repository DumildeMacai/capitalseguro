# Capital Seguro - Investment Platform

## Overview
Capital Seguro is a React + TypeScript investment platform built with Vite, featuring admin, partner, and investor dashboards. The platform is integrated with Supabase for authentication and data persistence.

## Recent Changes (November 28, 2025)

### Deposit System Implementation (LATEST - COMPLETED)
- **Investor Deposit Form** (`/depositar` route) - Choose payment method and enter amount
  - Payment methods: Banco BAI (IBAN: AO06 0040 0000 1433 6637 1018 6) and Multicaixa Express (949360828)
  - Form validation and success notifications
- **Admin Deposit Approval Dashboard** - New "Depósitos" tab in admin panel
  - View all pending, approved, rejected deposits
  - Approve/reject deposits with one-click actions
  - Shows deposit amount, date, payment method and status
- **Data Storage**: Using localStorage (MockData) until Supabase table "deposits" is created
- **Flow**: Investor submits → Admin approves → Balance updated → Notification sent (future)
- **Test IDs**: Added for all interactive elements (buttons, forms, etc.)

### Favicon e Open Graph Meta Tags (Completed)
- **Logo favicon configurado**: Uso do logo CS em `public/logo.png`
- **Open Graph tags** para WhatsApp, Facebook, Telegram e LinkedIn
- **Twitter Cards** para compartilhamento em redes sociais
- **Theme color**: `#7E69AB` (purple brand color)

### InvestmentCard Dark Theme Standardization (Completed)
- Forced dark mode styling for investment cards (bg-slate-900)
- Updated card borders to `border-slate-700`
- Set category badges to `bg-slate-600` with text-white
- Return rates display in `text-emerald-400`
- Button gradient uses `bg-gradient-primary` (purple to navy gradient)
- Progress bars use emerald-green for visual consistency

### Comprehensive Color Standardization (Completed)
- Complete color palette migration to design system tokens from hardcoded colors
- Replaced 44+ instances of hardcoded colors across 12 files

### Branding Updates (Completed)
- Changed logo from "F"/"C" to "CS" across all components
- Updated all return rates to 100%
- Hero section with passive income messaging

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
- **All components use design system tokens** - No hardcoded colors
- Supports automatic light/dark mode switching
- Investment cards styled for dark theme consistency

### Backend
- Supabase (PostgreSQL database, authentication, storage)
- Project ID: xmemmdmyzwimluvgiqal

### Key Directories
- `/src/pages/` - Main pages (Login, Dashboard, InvestorDashboard, AdminDashboard, DepositPage, etc.)
- `/src/components/` - Reusable UI components (DepositForm, AdminDeposits, etc.)
- `/src/integrations/supabase/` - Supabase client configuration
- `/src/contexts/` - React contexts (Auth)
- `/src/types/` - TypeScript types (investment.ts, auth.ts, deposit.ts)
- `/public/` - Static assets including logo.png

### New Deposit System Files
- `src/types/deposit.ts` - Deposit and DepositRequest types
- `src/components/DepositForm.tsx` - Investor deposit form with payment methods
- `src/components/AdminDeposits.tsx` - Admin deposit approval component
- `src/pages/DepositPage.tsx` - Deposit page wrapper

### Routes
- `/` - Home page
- `/login` - Login/Register
- `/investments` - Browse investments
- `/investments/:id` - Investment details
- `/investidor` - Investor dashboard (protected)
- `/depositar` - Deposit funds page (protected, investor only)
- `/admin` - Admin dashboard (protected, admin only)
- `/parceiro` - Partner dashboard (protected, partner only)

### Known Issues & TODOs
1. **Deposits Table**: Currently using localStorage (MockData). Need to create "deposits" table in Supabase:
   ```sql
   CREATE TABLE deposits (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id),
     amount DECIMAL(12, 2) NOT NULL,
     payment_method VARCHAR(20) NOT NULL,
     status VARCHAR(20) NOT NULL DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT now(),
     approved_at TIMESTAMP,
     approved_by UUID REFERENCES auth.users(id),
     rejection_reason TEXT
   );
   ```
2. **Notifications**: Need to implement notification system when deposits are approved/rejected
3. **Balance Updates**: Need to properly update user account_balance when deposit is approved
4. **Storage bucket creation**: Fails due to RLS policies - requires manual SQL scripts

## Running the Project
```bash
npm run dev
```
The application runs on port 5000.

## Social Sharing Configuration
The site is properly configured for social media sharing:
- **WhatsApp**: Shows CS logo, "Capital Seguro | Gestão de Ativos" title
- **Facebook**: Preview with custom logo and description
- **Telegram**: Complete preview card
- **LinkedIn**: Professional sharing with metadata
- All platforms use `/public/logo.png`

## User Preferences
- Portuguese language (pt-PT)
- Dark theme for investment cards
- 100% return rates for all investments
- Payment methods: Banco BAI and Multicaixa Express
