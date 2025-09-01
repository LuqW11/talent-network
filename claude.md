# CODING PRINCIPLES

When writing code, strictly follow these fundamental software engineering principles:

## Core Philosophy

**KISS (Keep It Simple, Stupid)**

- Choose straightforward solutions over complex ones
- Write self-documenting code
- Avoid premature abstractions
- Only comment on rare business rules that aren't obvious

**YAGNI (You Aren't Gonna Need It)**

- Build only what's currently needed
- Don't add functionality for imagined future requirements

**DRY (Don't Repeat Yourself)**

- Extract common functionality into reusable components
- Use constants for repeated values
- Create shared utilities for common operations

## SOLID Principles

**Single Responsibility**: Each class/function should have one reason to change
**Interface Segregation**: Don't force clients to depend on unused interfaces
**Dependency Inversion**: Depend on abstractions, not concretions

## Code Structure Requirements

**Functions:**

- Do one thing well
- Use descriptive names that explain purpose
- Return early to reduce nesting

**Classes:**

- use structural programming. avoid using classes
- make functions for utility tools

**Error Handling:**

- Fail fast - validate inputs immediately
- Create specific exception types for different error categories
- Always handle or propagate errors, never ignore them
- Log errors with context

## Architecture Patterns

**Layered Architecture:**

```
Presentation → Application → Domain → Infrastructure
```

## Ci/Cd patterns

- never commit to main/master. Always create a PR
- regularly commit your changes to your branch
- Make pr after you're done with the branch

## Language-Specific Guidelines

**When writing in any language:**

- Follow the language's established conventions
- Use the language's standard formatting tools
- Leverage language-specific features appropriately
- Import only what you need

**Documentation:**

- Add docstrings/comments for public APIs
- Explain complex business logic
- Document assumptions and constraints
- Keep documentation close to code

## Common Anti-Patterns to Avoid

- Large objects that handle too many responsibilities
- Long parameter lists (use objects instead)
- Deep nesting (use early returns)
- Magic numbers/strings (use named constants)
- Ignored exceptions
- Tight coupling between components
- Duplicate code across multiple places

**Remember: Write code as if the person maintaining it is a violent psychopath who knows where you live. Code should be so clear that anyone can understand and modify it safely.**
