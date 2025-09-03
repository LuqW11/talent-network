# Codebase Structure

## Root Level
```
├── src/                    # Source code
├── public/                 # Static assets
├── .claude/               # Claude IDE configuration
├── .serena/               # Serena tool configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration
├── prettier.config.js     # Prettier configuration
├── next.config.js         # Next.js configuration
├── postcss.config.js      # PostCSS configuration
└── claude.md              # Project-specific coding principles

```

## Source Directory (`src/`)
```
├── app/                   # Next.js App Router
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page with waitlist form
├── components/            # React components
│   ├── icons/             # SVG icon components
│   │   └── FileIcon.tsx   # PDF file icon
│   ├── CvDrop.tsx         # CV/PDF drag-and-drop component
│   ├── InviteLinkCard.tsx # Referral invite link display
│   ├── SaveFileButton.tsx # File download utility
│   ├── UniversitySearch.tsx # University autocomplete
│   └── WaitlistForm.tsx   # Main multi-step form
├── lib/                   # Utility functions and services
│   ├── cv.ts              # CV upload service (Firebase stub)
│   ├── device.ts          # Device detection utilities
│   ├── ics.ts             # Calendar file generation
│   ├── referrals.ts       # Referral service (Firebase stub)
│   ├── uk-universities.ts # University data
│   └── validation.ts      # Zod schemas and form validation
├── types/                 # TypeScript type definitions
│   └── entities.ts        # Student and Startup interfaces
├── db/                    # Database schema (Typesaurus)
│   └── schema.ts          # Database collections (commented out)
├── styles/                # Global styles
│   └── globals.css        # Tailwind imports and custom styles
└── env.js                 # Environment variable validation
```

## Key Components Overview
- **WaitlistForm**: Main two-step form with localStorage persistence
- **CvDrop**: Drag-and-drop PDF upload with validation and hashing
- **UniversitySearch**: Autocomplete search for UK universities
- **InviteLinkCard**: Displays referral links with sharing functionality

## Data Flow
1. Form data validated with Zod schemas
2. Persisted to localStorage on each step
3. Firebase adapter stubs prepared for future backend integration
4. No actual data upload or backend processing currently