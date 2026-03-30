# External Integrations

**Analysis Date:** 2026-03-30

## APIs & External Services

**Blockchain:**
- Algorand - Smart contract interactions, asset management
  - SDK/Client: Inferred from `src/lib/blockchain/algorand.ts`
  - Auth: Wallet-based (e.g., Pera, MyAlgo) through client connection
  - Config: `src/lib/blockchain/config.ts`

**IPFS:**
- IPFS (Integrated via `src/lib/ipfs/index.ts`) - Content-addressed storage for quest data
  - Client: Inferred Pinata or Infura from `src/lib/ipfs` structure
  - Auth: API Keys (pinned via `.env`)

## Data Storage

**Databases:**
- PostgreSQL on Supabase - Primary database
  - Connection: via `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Client: `@supabase/supabase-js` and `@supabase/ssr`
  - Storage: Supabase Storage for assets

**File Storage:**
- Supabase Storage - User uploads, hackathon assets
  - Client: `@supabase/supabase-js`

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Email/password and session management
  - Implementation: `@supabase/ssr` for middleware/server-side auth
  - Token storage: Cookies via `@supabase/ssr`

**Social Auth (OAuth):**
- Likely configured in Supabase (e.g., GitHub, Google) - Inferred from generic Auth logic

## Monitoring & Observability

- **None detected** - No Sentry or Mixpanel integrations found in `package.json`

## CI/CD & Deployment

**Hosting:**
- Likely Vercel (standard for Next.js) or Railway

## Environment Configuration

**Development:**
- Required env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for administrative tasks)
  - `IPFS_PROJECT_ID` / `IPFS_PROJECT_SECRET` (inferred)

---

*Integration audit: 2026-03-30*
*Update when adding/removing external services*
