# Task Completion Checklist

## Before Committing Code
1. **Code Quality Validation**
   ```bash
   # Run full validation suite
   pnpm run check
   
   # This runs both:
   # - pnpm run lint (ESLint validation)
   # - pnpm run typecheck (TypeScript type checking)
   ```

2. **Code Formatting**
   ```bash
   # Format code automatically
   pnpm run format:write
   ```

3. **Manual Testing**
   - Test in mobile view first (mobile-first approach)
   - Verify accessibility features work
   - Test form validation and error states
   - Check localStorage persistence

## Git Workflow (REQUIRED)
- **NEVER commit directly to main/master**
- **ALWAYS create a PR** for code changes
- **Regularly commit changes** to your feature branch

## Code Quality Standards
- **No TypeScript errors** - `pnpm run typecheck` must pass
- **No ESLint errors** - `pnpm run lint` must pass
- **Proper formatting** - Use `pnpm run format:write`
- **Follow CLAUDE.md principles** - KISS, YAGNI, DRY
- **Mobile-first responsive design**
- **Accessibility compliance** (ARIA labels, keyboard navigation)

## Architecture Compliance
- Components go in `src/components/`
- Types go in `src/types/`
- Utilities go in `src/lib/`
- Follow functional programming patterns
- Use Zod for validation
- Prepare Firebase stubs for future backend integration

## Before Deployment
1. `pnpm run build` - Ensure production build succeeds
2. Manual testing in production build
3. Verify all environment variables are properly configured

## Common Issues to Check
- Unused imports (ESLint will catch these)
- Missing accessibility attributes
- Unhandled form validation errors
- Missing mobile responsiveness
- Firebase adapter stubs not following established patterns