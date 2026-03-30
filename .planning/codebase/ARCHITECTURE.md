# Architecture

**Analysis Date:** 2026-03-31

## Pattern Overview

**Overall:** Full-stack Next.js Application (App Router)

**Key Characteristics:**
- Server-side Rendering (SSR) and Static Site Generation (SSG) via Next.js
- Supabase for Backend-as-a-Service (Auth, Database, Storage)
- Client-side state transitions with Zustand and Framer Motion
- Blockchain-enabled (Algorand) for decentralized features

## Layers

**UI Layer (Client Components):**
- Purpose: Interactive user interface elements
- Contains: React components, hooks, animations
- Location: `src/components/*`, `src/hooks/*`
- Depends on: Store layer for state, Lib layer for logic

**Routing Layer (Server/Client Components):**
- Purpose: Page definitions and layouts
- Contains: `page.tsx`, `layout.tsx`, `loading.tsx`
- Location: `src/app/*`
- Depends on: UI components, API routes, Supabase client

**Store Layer (Client State):**
- Purpose: Global client-side state management
- Contains: Zustand stores
- Location: `src/stores/*`
- Used by: UI components

**Logic/Utility Layer (Lib):**
- Purpose: Core application logic and external integrations
- Contains: Supabase clients, Blockchain logic, IPFS wrappers, general utilities
- Location: `src/lib/*`
- Used by: Routing layer, UI components, Middleware

**API Layer (Server Routes):**
- Purpose: Server-side endpoints for complex logic or sensitive operations
- Contains: Route handlers
- Location: `src/app/api/*`

## Data Flow

**Page Request (SSR/Hydration):**
1. User requests a route (e.g., `/dashboard`)
2. `middleware.ts` checks auth session via Supabase
3. `layout.tsx` and `page.tsx` (Server Components) fetch initial data from Supabase
4. Page renders on server and streams to client
5. Client hydrates, Zustand stores initialize from props if needed
6. Interactive components (e.g. `WalletConnect`) become active

**Blockchain Transaction:**
1. User triggers action in UI (e.g., "Submit Quest")
2. UI calls hook or lib function (`src/lib/blockchain/algorand.ts`)
3. Hook interacts with browser wallet (Pera/MyAlgo)
4. Transaction signed and broadcast to Algorand network
5. Outcome confirms in UI, optionally updates Supabase via API

**State Management:**
- Server state: Managed by Supabase (real-time subscriptions via `@supabase/supabase-js`)
- Client state: Managed by Zustand (`src/stores/`)
- Persistent state: Cookies (for auth) and Supabase Database

## Key Abstractions

**Supabase Client:**
- Purpose: Unified interface for Auth and Database
- Examples: `src/lib/supabase/client.ts` (browser), `src/lib/supabase/server.ts` (server)
- Pattern: Factory/Singleton

**Blockchain Integration:**
- Purpose: Abstracting Algorand network complexity
- Examples: `src/lib/blockchain/algorand.ts`, `src/lib/blockchain/config.ts`
- Pattern: Utility modules

**State Stores:**
- Purpose: Reactive state for complex UI flows (e.g. multi-step forms)
- Examples: `src/stores/useUserStore.ts` (inferred)
- Pattern: Zustand store

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Any page load
- Responsibilities: Global providers (Auth, Theme, Toast), main navigation

**Index Page:**
- Location: `src/app/page.tsx`
- Triggers: Landing on root URL
- Responsibilities: Initial entry/marketing content

**Middleware:**
- Location: `src/middleware.ts`
- Triggers: Every request
- Responsibilities: Auth session refresh/protection

## Error Handling

**Strategy:** Error Boundaries and Global Error Handlers

**Patterns:**
- `src/app/error.tsx`: Catch-all for runtime errors in page groups
- Form validation via `react-hook-form` and `zod`
- Try/catch blocks in async lib functions with proper notification triggers

## Cross-Cutting Concerns

**Authentication:**
- Handled via `middleware.ts` and `@supabase/ssr`

**Validation:**
- Schemas defined with `zod` for forms and API payloads

**Styling/Theming:**
- Persistent theme via Tailwind CSS and `globals.css`

---

*Architecture analysis: 2026-03-31*
*Update when major patterns change*
