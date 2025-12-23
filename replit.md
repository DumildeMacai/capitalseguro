# Capital Seguro - Investment Platform

## Overview
Capital Seguro is a React + TypeScript investment platform featuring dashboards for admin, partners, and investors, integrated with Supabase. Its core purpose is to provide a secure and efficient environment for managing investments, offering features such as real-time balance updates, diverse investment options with varying interest types, and robust security measures. The platform aims to facilitate investment management with features like deposits, withdrawals, credit allocation, and detailed portfolio analysis, targeting a market that values transparency and user control.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with frequent updates on progress. Ask before making major architectural changes or implementing new features that might impact existing functionality. I prefer detailed explanations for complex logic, especially concerning financial calculations. Ensure that all new features are thoroughly tested and do not introduce regressions.

## System Architecture
The platform is built with React and TypeScript, leveraging Supabase for backend services, including authentication and database management.

### UI/UX Decisions
- Dashboards are provided for Admin, Partner, and Investor roles, each tailored to their specific needs.
- Investment cards display key information including status, highlight, estimated return, interest type (Simple/Compound), and income classification (Fixed/Variable/Passive).
- The design prioritizes clear display of financial data, with real-time updates for balances and investment performance.
- Responsive design for optimal viewing on both desktop and mobile devices.

### Technical Implementations
- **Authentication**: Supabase Auth with 2FA (authenticator app + backup codes) and password management.
- **Deposit System**: Investors submit values and proofs (PNG/JPG/JPEG/PDF up to 5MB). Admins can view proofs, approve deposits, and update balances in real-time. Supports Banco BAI and Multicaixa Express methods.
- **Withdrawal System**: Investors request withdrawals via Banco BAI (IBAN) or Multicaixa Express (phone/account number). Includes validations for minimum amounts (5,000 Kz) and sufficient balance. Admin approval deducts balance immediately.
- **Balance Crediting**: Admins can directly credit investor balances.
- **Interest Calculation**: Supports both Simple and Compound interest (50% p.a.). Interest type is configurable per investment. Calculations are precise and based on ISO dates.
- **Real-time Balance**: Balances are updated immediately upon login and persist in the `profiles` table (DECIMAL 15,2) in Supabase.
- **Investment Classification**: Investments can be classified by `tipo_juros` (Simple/Compound) and `tipo_renda` (Fixed/Variable/Passive).
- **Multi-contribution System**: Investors can make unlimited multiple contributions to the same investment product. Each contribution is tracked individually with its own interest type and contributes to a consolidated statement. Contributions are automatically set to "Active" status upon submission, with immediate balance deduction.
- **Consolidated Statement**: Aggregates all contributions per investment product, showing total invested, accumulated return, number of contributions, period, and income classification.
- **Performance Analysis**: Dynamic charts visualize investment performance, grouping by category and showing returns evolution over time.
- **Data Integrity**: Supabase RLS (Row Level Security) is used. Workarounds for Supabase schema cache issues involve a two-phase update strategy for investment properties.
- **Error Handling**: Robust error handling is implemented for database operations and user input validation.

### Feature Specifications
- **Deposit System**: Proof upload, admin approval, real-time balance update.
- **Withdrawal System**: Two methods (BAI, Multicaixa), strict validations, admin approval, immediate balance deduction.
- **Balance Crediting**: Admin interface for direct balance adjustments.
- **Interest Calculation**: Simple and Compound interest formulas applied based on investment settings.
- **Real-time Balance**: Immediate and persistent balance updates across the platform.
- **Investment Management**: Admin can manage all investment properties including `tipo_juros` and `tipo_renda`.
- **Multi-Aportes**: Allows multiple applications to the same investment, each with independent interest calculation.
- **Extrato Consolidado**: Provides a summarized view of all investments and their aggregated returns.
- **Análise de Desempenho**: Dynamic grouping of investments by category and temporal evolution of returns.
- **Security**: Supabase authentication with 2FA, password change functionality, and rate limiting.

## External Dependencies
- **Supabase**: Used for authentication, real-time database, and API services.
- **React**: Frontend framework.
- **TypeScript**: For type-safe JavaScript.
- **Banco BAI**: Integrated as a payment/withdrawal method.
- **Multicaixa Express**: Integrated as a payment/withdrawal method.
```