# Capital Seguro - Investment Platform

## Overview
Capital Seguro is a React + TypeScript investment platform built with Vite, featuring admin, partner, and investor dashboards. The platform is integrated with Supabase for authentication and data persistence.

## Recent Changes (November 28, 2025)

### Receipt Download Feature (LATEST - COMPLETED)
- **Admin Download** - Admins can download receipt images for offline storage
  - Download button in receipt modal with icon
  - Automatic file naming with timestamp: `comprovante-{timestamp}.png`
  - Success toast notification after download
  - Works with base64 encoded images

### Receipt Upload for Deposits (COMPLETED)
- **Investor Upload Flow** - Investors must upload proof/receipt image when requesting deposits
  - File upload input in DepositForm (PNG, JPG, JPEG only, max 5MB)
  - Receipt stored as base64 in localStorage with deposit
  - Confirmation message shown after upload
- **Admin Receipt Viewer** - New "Comprovante" column in AdminDeposits table
  - Eye icon button to view uploaded receipt
  - Modal dialog displays full-size receipt image
  - Admin can download receipt before approving deposit

### Deposit System Implementation (COMPLETED)
- **Investor Deposit Form** (`/depositar` route) - Choose payment method and enter amount + upload receipt
  - Payment methods: Banco BAI (IBAN: AO06 0040 0000 1433 6637 1018 6) and Multicaixa Express (949360828)
  - Form validation and success notifications
- **Admin Deposit Approval Dashboard** - "Depósitos" tab in admin panel
  - View all pending, approved, rejected deposits
  - Approve/reject deposits with one-click actions
  - Shows deposit amount, date, payment method and status
  - View/download receipt image before approving
- **Transaction History** - "Histórico" tab in investor dashboard
  - Shows all deposits, investments with status
  - Real-time updates on deposit approval
- **Data Storage**: Using localStorage (MockData) until Supabase table "deposits" is created
- **Flow**: Investor uploads receipt + submits → Admin reviews/downloads receipt + approves → Balance updated
- **Test IDs**: Added for all interactive elements (buttons, forms, etc.)

### Favicon e Open Graph Meta Tags (Completed)
- **Logo favicon configurado**: Uso do logo CS em `public/logo.png`
- **Open Graph tags** para WhatsApp, Facebook, Telegram e LinkedIn
- **Twitter Cards** para compartilhamento em redes sociais
- **Theme color**: `#7E69AB` (purple brand color)

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

### Backend
- Supabase (PostgreSQL database, authentication, storage)
- Project ID: xmemmdmyzwimluvgiqal

### Key Directories
- `/src/pages/` - Main pages (Login, Dashboard, InvestorDashboard, AdminDashboard, DepositPage, etc.)
- `/src/components/` - Reusable UI components (DepositForm, AdminDeposits, TransactionHistory, etc.)
- `/src/integrations/supabase/` - Supabase client configuration
- `/src/contexts/` - React contexts (Auth)
- `/src/types/` - TypeScript types (investment.ts, auth.ts, deposit.ts)
- `/public/` - Static assets including logo.png

### Key Files for Deposits
- `src/types/deposit.ts` - Deposit, DepositRequest, Transaction types (includes receiptUrl)
- `src/components/DepositForm.tsx` - Investor deposit form with file upload
- `src/components/AdminDeposits.tsx` - Admin deposit approval + receipt viewer + download
- `src/components/TransactionHistory.tsx` - Transaction history display
- `src/pages/DepositPage.tsx` - Deposit page wrapper
- `src/pages/InvestorDashboard.tsx` - Includes Histórico tab with TransactionHistory

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
1. **Deposits Table**: Currently using localStorage (MockData). Need to create "deposits" table in Supabase with receipt_url field
2. **Receipt Storage**: Currently storing as base64 - consider migrating to Supabase Storage for production
3. **Notifications**: Need to implement notification system when deposits are approved/rejected
4. **Balance Updates**: Working - properly updates user account_balance when deposit is approved

## Running the Project
```bash
npm run dev
```
The application runs on port 5000.

## Deposit System Features
1. **Investor submits deposit** with receipt photo
2. **Admin views receipt** in modal with full preview
3. **Admin downloads receipt** for offline records/verification
4. **Admin approves/rejects** → balance updated automatically
5. **Investor sees** updated balance in "Saldo Disponível" card
6. **Transaction history** tracks all deposit activity

## User Preferences
- Portuguese language (pt-PT)
- Dark theme for investment cards
- 100% return rates for all investments
- Payment methods: Banco BAI and Multicaixa Express
- Receipt upload required for all deposits
- Admin can download/archive receipt images
