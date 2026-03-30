# Coding Conventions

**Analysis Date:** 2026-03-31

## Naming Patterns

**Files:**
- Components/Layouts: PascalCase (e.g. `WalletConnect.tsx`, `GlassPanel.tsx`)
- Hooks: camelCase starting with "use" (e.g. `useToast.ts`, `useAuth.ts`)
- Utilities/Lib: kebab-case or camelCase (e.g. `constants.ts`, `utils.ts`, `algorand.ts`)
- Page Router: boilerplate Next.js files (`page.tsx`, `layout.tsx`, `middleware.ts`)

**Functions:**
- React Components: PascalCase (e.g. `export function WalletConnect()`)
- Logic/Utilities: camelCase (e.g. `export function truncateAddress()`)
- Event Handlers: camelCase (e.g. `connectWallet`, `disconnect`, `copyAddress`)

**Variables:**
- Local state/refs: camelCase (e.g. `wallet`, `setWallet`, `copied`)
- Constants: camelCase or UPPER_SNAKE_CASE for truly global values (e.g. `blockchainConfig`)

**Types:**
- Interfaces/Types: PascalCase (e.g. `WalletState`)
- No special prefix (no `I` prefix for interfaces)

## Code Style

**Formatting:**
- Indentation: 2 spaces
- Quotes: Double quotes for strings and imports
- Semicolons: Required
- Next.js Directives: `"use client"` or `"use server"` at the top of the file

**Linting:**
- Tool: ESLint with Next.js profile (`.eslintrc.json`)
- Strictness: Standard Next.js rules

## Import Organization

**Order:**
1. Next.js/React built-ins (`import { useState } from "react"`)
2. External libraries (`import { motion } from "framer-motion"`)
3. UI components (`import { GlassPanel } from "@/components/shared/GlassPanel"`)
4. Hooks (`import { useToast } from "@/components/shared/Toast"`)
5. Lib/Types (`import type { WalletState } from "@/lib/blockchain/config"`)

**Path Aliases:**
- `@/` maps to `src/` (e.g. `@/components/...`, `@/lib/...`)

## Error Handling

**Patterns:**
- Try/Catch blocks in async functions (e.g. `connectWallet` in `WalletConnect.tsx`)
- User-facing error notifications via `toast` hook
- Graceful fallbacks in UI for missing data (e.g. empty address check before render)

## Logging

**Framework:**
- `console.log` for debugging (no dedicated logger found yet)
- Errors typically caught and toasted to the user

## Comments

**When to Comment:**
- Feature implementation notes (e.g. `// Check for Pera wallet`)
- TODOs (e.g. `// TODO: ...`) found sparingly
- Complex business logic (blockchain/IPFS interactions)

## Function Design

**React Components:**
- Functional components using named exports
- Extensive use of hooks for local state and side effects
- Return JSX for UI structure

**Utilities:**
- Focused, reusable helper functions exported as named exports

---

*Convention analysis: 2026-03-31*
*Update when patterns change*
