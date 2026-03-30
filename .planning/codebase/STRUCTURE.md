# Structure

**Analysis Date:** 2026-03-31

## Directory Layout

```text
e:/hackquest/
├── .next/                  # Next.js build output
├── .planning/              # GSD project planning artifacts
├── node_modules/           # Project dependencies
├── src/                    # Application source code
│   ├── app/                # Next.js App Router (pages and layouts)
│   │   ├── (auth)/         # Auth-related routes (e.g., login, register)
│   │   ├── (dashboard)/    # Dashboard context routes
│   │   ├── (main)/         # Main application routes
│   │   ├── (organiser)/    # Organiser-specific routes
│   │   ├── api/            # Server-side API endpoints
│   │   ├── fonts/          # Local font assets
│   │   ├── error.tsx       # Global error handler
│   │   ├── globals.css     # Global CSS and Tailwind directives
│   │   ├── layout.tsx      # Root layout
│   │   ├── loading.tsx     # Global loading state
│   │   └── page.tsx        # Landing/Home page
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin-specific UI
│   │   ├── auth/           # Login/Signup forms
│   │   ├── dashboard/      # Dashboard widgets
│   │   ├── forms/          # Generic form elements
│   │   ├── shared/         # Common UI (e.g., WalletConnect, Nav)
│   │   └── ui/             # Atomic components (buttons, inputs)
│   ├── hooks/              # Custom React hooks (e.g. useAuth, useBlockchain)
│   ├── lib/                # Core logic and external integrations
│   │   ├── blockchain/     # Algorand configuration and helpers
│   │   ├── ipfs/           # IPFS storage logic
│   │   ├── supabase/       # Supabase client/server initialization
│   │   ├── constants.ts    # Shared constants
│   │   └── utils.ts        # Helper functions (e.g., cn, format)
│   ├── stores/             # Global client state (Zustand)
│   └── middleware.ts       # Next.js authentication/refresh middleware
├── .eslintrc.json          # Linting rules
├── .gitignore              # Files to exclude from Git
├── next.config.mjs         # Next.js configuration
├── package.json            # Project manifest and dependencies
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Key Locations

**Entry Points:**
- `src/app/layout.tsx` - App-wide layout, providers, and global navigation
- `src/app/page.tsx` - Marketing/Landing entry point
- `src/middleware.ts` - Request pre-processing (auth checks)

**System Services (Lib):**
- `src/lib/supabase/client.ts` - Supabase browser client
- `src/lib/supabase/server.ts` - Supabase server client for SSR
- `src/lib/blockchain/algorand.ts` - Algorand interaction logic
- `src/lib/ipfs/index.ts` - IPFS upload/pinning logic

**State Management:**
- `src/stores/` - Centralized client state definitions

**UI Components:**
- `src/components/ui/` - Foundational atomic UI components (shadcn style)
- `src/components/shared/` - Business-logic components used across multiple pages

## Naming Conventions

**Files:**
- Components/Layouts: PascalCase (e.g. `WalletConnect.tsx`)
- Hooks: camelCase starting with "use" (e.g. `useAuth.ts`)
- Utilities/Lib: kebab-case or camelCase (e.g. `utils.ts`, `algorand-helpers.ts`)
- Config: standard kebab-case or lowercase (e.g. `tailwind.config.ts`)

**Directories:**
- Feature groups: `(grouping_folder)` for Next.js App Router
- Logic/Components: lowercase (e.g. `components`, `hooks`, `lib`)

---

*Structure analysis: 2026-03-31*
*Update after directory reorganizations*
