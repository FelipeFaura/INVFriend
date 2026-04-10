# TASK-038: Migrate Header Component to Design System

**Agent:** @angular-ui-designer
**Status:** ❌ Cancelled
**Dependencies:** TASK-036
**Estimate:** N/A

## ⚠️ CANCELLED - Component Does Not Exist

> **Razón de cancelación:** El componente `header` global NO EXISTE en el proyecto.
> La navegación está integrada dentro de cada componente individual (dashboard, profile, etc.).
> Las clases de navegación del design system (`_navigation.scss`) se aplicarán en los componentes que las necesiten.

---

## Original Objective (Archived)

Migrar el componente header para usar las clases de navegación del design system.

## Files

- **Modify:** `frontend/src/app/adapters/shared/header/header.component.html`
- **Modify:** `frontend/src/app/adapters/shared/header/header.component.scss`

## Requirements

### 1. Update HTML Template

Replace custom classes with design system navigation classes:

```html
<!-- Use design system classes -->
<header class="header">
  <div class="header__brand">
    <span>🎁</span>
    <span>INVFriend</span>
  </div>
  <nav class="header__nav">
    <a
      routerLink="/groups"
      class="nav-link"
      routerLinkActive="nav-link--active"
    >
      Groups
    </a>
    <button class="btn btn--ghost" (click)="logout()">Logout</button>
  </nav>
</header>
```

### 2. Clean Component SCSS

Remove:

- Header background/gradient styles (now in `_navigation.scss`)
- Navigation link styles
- Button styles

Keep only component-specific tweaks if absolutely necessary.

### 3. Accessibility

- Add `aria-label` to navigation
- Ensure logo/brand area has proper semantics

## Scope / Limits

### ✅ What to Do

- Update HTML to use `.header`, `.nav-link` classes
- Remove redundant SCSS
- Add accessibility attributes

### ❌ What NOT to Do

- Do NOT change navigation logic
- Do NOT modify routing behavior

## Acceptance Criteria

- [ ] Header uses design system navigation classes
- [ ] Component SCSS reduced (gradient/nav styles removed)
- [ ] Navigation links highlight active state
- [ ] Accessibility attributes present
- [ ] No build errors

## References

- [TASK-026 Analysis - Section 3.6 Navigation](./TASK_026_UI_ANALYSIS_PROPOSAL.md)

---

## 📊 Results

_(To be filled upon completion)_

**Status:** ⏳ Pending
