# Essential Commands

## Development
```bash
# Start development server with Turbo
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start

# Build and preview
pnpm run preview
```

## Code Quality & Validation
```bash
# Run linting
pnpm run lint

# Fix linting issues automatically
pnpm run lint:fix

# Type check without emitting files
pnpm run typecheck

# Full check (lint + typecheck)
pnpm run check
```

## Code Formatting
```bash
# Check formatting
pnpm run format:check

# Apply formatting
pnpm run format:write
```

## Package Management
```bash
# Install dependencies
pnpm install

# Add new dependency
pnpm add <package>

# Add dev dependency
pnpm add -D <package>

# Remove dependency
pnpm remove <package>
```

## System Utilities (macOS/Darwin)
```bash
# List directory contents
ls -la

# Find files by pattern
find . -name "*.tsx" -type f

# Search in files
grep -r "pattern" src/

# Change directory
cd <path>

# Git operations
git status
git add .
git commit -m "message"
git push
```

## Recommended Workflow
1. `pnpm run dev` - Start development
2. Make changes
3. `pnpm run check` - Validate code quality
4. `pnpm run format:write` - Format code
5. Git commit and push
6. Create PR (never commit to main)

## Environment Setup
- Ensure `.env.example` is copied to `.env.local` if needed
- Run `pnpm install` after cloning
- Development server runs on http://localhost:3000