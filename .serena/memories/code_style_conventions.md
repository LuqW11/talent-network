# Code Style & Conventions

## General Principles (from CLAUDE.md)
- **KISS (Keep It Simple, Stupid)** - Straightforward solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)** - Build only what's currently needed
- **DRY (Don't Repeat Yourself)** - Extract common functionality into reusable components
- **SOLID Principles** - Single Responsibility, Interface Segregation, Dependency Inversion
- **Structural programming** - Avoid classes, use functions for utilities

## File Organization
- **Components**: `src/components/` - All React components
- **Types**: `src/types/` - All TypeScript type definitions
- **Utilities**: `src/lib/` - Utility functions and services
- **Icons**: `src/components/icons/` - SVG icon components
- **App Router**: `src/app/` - Next.js pages and layouts

## TypeScript Configuration
- **Strict mode enabled** with additional strictness:
  - `noUncheckedIndexedAccess: true`
  - `exactOptionalPropertyTypes: true`
  - `checkJs: true`
- **Path aliases**: `~/*` maps to `./src/*`
- **ESM modules** with `"type": "module"`

## ESLint Rules
- **TypeScript ESLint** with recommended, recommended-type-checked, and stylistic rules
- **Consistent type imports** with inline style preferred
- **Unused variables** warned with `_` prefix ignore pattern
- **Next.js core web vitals** rules enabled

## Naming Conventions
- **Components**: PascalCase (e.g., `WaitlistForm`, `CvDrop`)
- **Files**: PascalCase for components, camelCase for utilities
- **Functions**: camelCase (e.g., `handleEditDetails`, `toggleRoleInterest`)
- **Types/Interfaces**: PascalCase (e.g., `Student`, `CvMeta`)
- **Constants**: camelCase for arrays, SCREAMING_SNAKE_CASE for primitives

## Component Patterns
- **Functional components** with hooks
- **Props interfaces** defined inline or as separate types
- **Export default** for main component
- **Named exports** for utility functions and types
- **Ref forwarding** when needed for accessibility

## Error Handling
- **Fail fast** - validate inputs immediately
- **Specific error messages** for form validation
- **Never ignore errors** - always handle or propagate
- **User-friendly messages** in UI components