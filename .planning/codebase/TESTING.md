# Testing Patterns

**Analysis Date:** 2026-03-30

## Test Framework

**Runner:**
- **None detected** - No test runner found in `package.json` scripts or dependencies.

**Assertion Library:**
- **None detected**

**Run Commands:**
```bash
# No test scripts defined in package.json
```

## Test File Organization

**Location:**
- No test files (`*.test.tsx`, `*.spec.ts`, etc.) found in the codebase.

**Recommendation for Future Tests:**
- **Unit Tests:** Alongside source files (e.g. `src/lib/utils.test.ts`)
- **UI Tests:** For shared components (e.g. `src/components/shared/WalletConnect.test.tsx`)
- **E2E Tests:** `e2e/` directory using Playwright (standard for Next.js)

## Mocking

- **None detected**

## Coverage

- **None detected**

## Test Types (Planned)

**Unit Tests:**
- Logic in `src/lib/` (blockchain utils, ipfs pinning)
- Hooks in `src/hooks/`

**Integration Tests:**
- Supabase interaction logic
- Multi-step form flows

**E2E Tests:**
- Full user authentication flow
- Wallet connection and transaction flow

---

*Testing analysis: 2026-03-30*
*Update when testing infrastructure is added*
