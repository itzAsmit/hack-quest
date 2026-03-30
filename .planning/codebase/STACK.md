# Technology Stack

**Analysis Date:** 2026-03-31

## Languages

**Primary:**
- TypeScript 5.x - All application code and configuration
- JavaScript (ESM) - Build scripts (`next.config.mjs`, `postcss.config.mjs`)

**Secondary:**
- CSS - Global styles and Tailwind directives

## Runtime

**Environment:**
- Node.js 20.x (referenced in `package.json` devDeps)
- Browser - Client-side React components

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 14.2.35 - React framework for server components and routing
- React 18 - UI library

**Testing:**
- None detected (no test runner in `package.json` or test files found)

**Build/Dev:**
- TypeScript 5.x - Compiler
- Tailwind CSS 3.4.1 - Utility-first CSS framework
- PostCSS 8.x - CSS transformations

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.99.3 - Database and authentication client
- `@supabase/ssr` 0.9.0 - Server-side rendering support for Supabase
- `zustand` 5.0.12 - State management
- `framer-motion` 12.38.0 - Animations
- `react-hook-form` 7.72.0 - Form handling
- `zod` 4.3.6 - Schema validation

**Infrastructure:**
- `lucide-react` 0.577.0 - Icon set
- `class-variance-authority` 0.7.1 - Component variant management
- `tailwind-merge` 3.5.0 - Merging Tailwind classes

## Configuration

**Environment:**
- `.env.local` - Local environment variables
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (inferred from Supabase usage)

**Build:**
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration

## Platform Requirements

**Development:**
- Any platform with Node.js 20.x
- Supabase project for backend

**Production:**
- Vercel (recommended for Next.js) or any Node.js/Container host
- Supabase production instance

---

*Stack analysis: 2026-03-31*
*Update after major dependency changes*
