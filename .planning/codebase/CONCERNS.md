# Codebase Concerns

**Analysis Date:** 2026-03-31

## Tech Debt

**Mocked Blockchain Logic in Components:**
- Issue: `WalletConnect.tsx` uses a mock implementation for connection instead of `src/lib/blockchain/algorand.ts` helpers.
- File: `src/components/shared/WalletConnect.tsx`
- Why: Likely used for rapid UI prototyping.
- Impact: Features won't work on the real network until these are swapped for real calls.
- Fix approach: Integrate `src/lib/blockchain/algorand.ts` methods into the component.

**Direct Supabase Client Initializations:**
- Issue: Multiple client-side checks with Supabase might not be fully synchronized with server components.
- Impact: Potential hydration mismatches or auth flickers.
- Fix approach: Ensure all data fetching follows the Next.js 14 Server Component pattern where possible.

## Known Bugs

- **None reported yet** (no issues folder or bug list found).

## Security Considerations

**Environment Variables in Client:**
- Risk: `NEXT_PUBLIC_SUPABASE_ANON_KEY` is public by design, but sensitive logic must remain server-side.
- Recommendation: Audit all `NEXT_PUBLIC_` variables to ensure no secrets are exposed.

**RLS Policies:**
- Risk: If RLS (Row Level Security) isn't correctly configured in Supabase dashboard, client-side queries can access more data than intended.
- Current mitigation: Inferred Supabase RLS is enabled.
- Recommendations: Add an automated check or documentation for required RLS policies.

## Performance Bottlenecks

**Large Component Tree Hydration:**
- Problem: Complex layouts with multiple providers (Auth, Theme, etc.).
- Symptoms: TBT (Total Blocking Time) might increase on low-end devices.
- Improvement path: Optimize bundle size, lazy load non-critical components like animations.

## Fragile Areas

**Blockchain Configuration:**
- File: `src/lib/blockchain/config.ts`
- Why fragile: Central point of failure for all decentralized features.
- Common failures: Incorrect network parameters (testnet vs mainnet) can lead to lost assets.
- Safe modification: Use strict typing and environment-based staging for config.

## Scaling Limits

**Supabase Free Tier (Inferred):**
- Current capacity: 500MB DB, 1GB Storage.
- Scaling path: Move to Pro plan for larger hackathons or production traffic.

## Dependencies at Risk

**framer-motion v12:**
- Risk: High version number (bleeding edge), might introduce breaking changes or compatibility issues with older React 18 patterns.
- Impact: UI animations might fail or cause hydration errors.

## Missing Critical Features

**Automated Testing:**
- Problem: Zero test coverage for critical paths (Auth, Blockchain, Forms).
- Current workaround: Manual testing by devs.
- Blocks: Confident refactoring and scaling.
- Implementation complexity: Medium (Setup Vitest + Playwright).

## Test Coverage Gaps

**Blockchain Utility Functions:**
- What's not tested: `algorand.ts` helpers and IPFS pinning logic.
- Risk: Bugs in transaction logic could be catastrophic.
- Priority: High.

---

*Concerns audit: 2026-03-31*
*Update as issues are fixed or new ones discovered*
