# INVFriend — Workspace Instructions

## Project

- **Name**: INVFriend (Online Secret Santa)
- **Stack**: Angular 18+ frontend, Express/Node.js backend, Firebase (Firestore + Auth)
- **Architecture**: Hexagonal (Ports & Adapters) — Domain → Application → Adapters
- **Language**: TypeScript (strict mode, no `any`)

## Non-Negotiable Rules

- Dependencies flow inward: Adapters → Application → Domain. Never reverse.
- Unit tests required with all implementation (90%+ coverage on new code).
- No `console.log()` in production code.
- Conventional commits: `feat|fix|docs|refactor(scope): description`
- Never `git push` — the user pushes manually.

## Agent System

Work is coordinated by `@project-lead`, who delegates to:
- `@coder` — full-stack implementation + tests
- `@reviewer` — read-only code review + security audit
- `@ui-designer` — SCSS, HTML, accessibility

See `.github/agents/` for agent definitions and `.github/skills/coding-guidelines/` for detailed conventions.
