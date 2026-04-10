---
description: "TypeScript coding conventions, hexagonal architecture rules, testing requirements, and naming standards. Use when writing or reviewing TypeScript code."
applyTo: "**/*.ts"
---

# Coding Conventions

## Architecture

Hexagonal (Ports & Adapters). Dependencies flow inward only:

| Layer | Can Import | Cannot Import |
|-------|-----------|---------------|
| Domain | Nothing external | Application, Adapters, Ports |
| Application | Domain | Adapters |
| Adapters | Application, Domain, Ports | — |
| Ports | Domain (types only) | Application, Adapters |

## TypeScript

- No `any` — use explicit types or `unknown`
- Explicit return types on all functions
- `readonly` on properties that shouldn't change
- Interfaces prefixed with `I`: `IGroupRepository`, `IAuthPort`
- camelCase for variables/functions, PascalCase for classes, UPPER_SNAKE_CASE for constants

## File Naming

- Entities: `PascalCase.ts` (e.g., `Group.ts`)
- Use Cases: `PascalCaseUseCase.ts` (e.g., `CreateGroupUseCase.ts`)
- Components: `kebab-case.component.ts`
- Services: `kebab-case.service.ts`
- Tests: `*.spec.ts` co-located with source

## Testing (Mandatory)

- 90%+ coverage on new code
- AAA pattern (Arrange, Act, Assert)
- Mock dependencies via interfaces, never concrete implementations
- Backend: Jest, tests in `__tests__/` folders
- Frontend: Jasmine/Karma, `.spec.ts` co-located

### Exceptions (cite which applies)

- Pure configuration (routes, modules, barrel exports)
- Type-only files (interfaces, type aliases, enums with no logic)
- Third-party wrappers with zero logic

## Build Verification

```bash
# Backend
cd backend && npm run build && npm test

# Frontend
cd frontend && npx ng build --configuration=development
```

## SCSS (for .scss files)

- Use full relative paths: `@use '../../../../styles/tokens' as *;`
- Never `@use "tokens"` — will fail at build time
