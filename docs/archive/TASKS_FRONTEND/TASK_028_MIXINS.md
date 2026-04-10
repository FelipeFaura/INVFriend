# TASK-028: Create Mixins File (\_mixins.scss)

**Agent:** @angular-ui-designer
**Status:** ✅ Complete
**Dependencies:** TASK-026 (Análisis) ✅
**Estimate:** 1 hour

## Objective

Crear el archivo de mixins SCSS reutilizables para breakpoints responsivos, estados de focus, y utilidades comunes.

## Files

- **Create:** `frontend/src/styles/_mixins.scss`

## Requirements

Implementar los mixins definidos en TASK-026:

### 1. Responsive Breakpoint Mixins (Mobile-First)

```scss
@mixin sm {
  @media (min-width: $breakpoint-sm) {
    @content;
  }
}
@mixin md {
  @media (min-width: $breakpoint-md) {
    @content;
  }
}
@mixin lg {
  @media (min-width: $breakpoint-lg) {
    @content;
  }
}
@mixin xl {
  @media (min-width: $breakpoint-xl) {
    @content;
  }
}
```

### 2. Max-Width Mixins

```scss
@mixin mobile-only {
  @media (max-width: ($breakpoint-sm - 1)) {
    @content;
  }
}
@mixin tablet-down {
  @media (max-width: ($breakpoint-md - 1)) {
    @content;
  }
}
```

### 3. Focus Visible Mixin (Accessibility)

```scss
@mixin focus-visible {
  &:focus-visible {
    outline: 2px solid $border-focus;
    outline-offset: 2px;
    box-shadow: $shadow-focus;
  }
}
```

### 4. Interactive States Mixin

```scss
@mixin interactive-states($bg-color, $hover-darken: 8%) {
  // background, hover, active, disabled states
  // includes focus-visible
}
```

### 5. Utility Mixins

```scss
@mixin truncate {
  /* text truncation */
}
@mixin visually-hidden {
  /* sr-only */
}
```

## Scope / Limits

### ✅ What to Do

- Create `_mixins.scss` with all mixins
- Import `_tokens.scss` at top for variable access
- Add usage comments/examples

### ❌ What NOT to Do

- Do NOT create component styles
- Do NOT modify existing files

## Acceptance Criteria

- [x] File created at `frontend/src/styles/_mixins.scss`
- [x] All responsive breakpoint mixins defined
- [x] Focus-visible mixin for accessibility
- [x] Interactive states mixin
- [x] Utility mixins (truncate, visually-hidden)
- [x] SCSS compiles without errors

## References

- [TASK-026 Analysis - Section 2.2 Mixins](./TASK_026_UI_ANALYSIS_PROPOSAL.md)

---

## 📊 Results

**Status:** ✅ Complete
**Completed:** 2026-03-07

### Files Created

- `frontend/src/styles/_mixins.scss`

### Mixins Implemented

| Mixin Category         | Mixins                                                            |
| ---------------------- | ----------------------------------------------------------------- |
| **Responsive (min)**   | `sm`, `md`, `lg`, `xl`, `xxl`                                     |
| **Responsive (max)**   | `mobile-only`, `tablet-down`, `desktop-down`                      |
| **Accessibility**      | `focus-visible`, `focus-visible-custom`, `visually-hidden`        |
| **Interactive States** | `interactive-states`, `interactive-states-light`                  |
| **Text Utilities**     | `truncate`, `truncate-lines`                                      |
| **Layout Utilities**   | `flex-center`, `flex-align-center`, `flex-between`, `flex-column` |
| **Positioning**        | `absolute-fill`, `fixed-fill`                                     |
| **Form Utilities**     | `input-reset`, `button-reset`                                     |
| **Animation**          | `smooth-transition`, `fade-in`, `slide-up`                        |
| **Scrollbar**          | `custom-scrollbar`, `hide-scrollbar`                              |

### Additional Mixins Beyond Spec

Extended the specification with commonly needed utilities:

- `focus-visible-custom($color)` - Custom focus colors for error states
- `interactive-states-light()` - For dark backgrounds (lightens on hover)
- `truncate-lines($lines)` - Multi-line text truncation
- `flex-*` layout mixins - Common flexbox patterns
- `absolute-fill` / `fixed-fill` - Full coverage positioning
- `input-reset` / `button-reset` - Browser default removal
- `smooth-transition()` - Multi-property transitions
- `fade-in()` / `slide-up()` - Animation mixins
- `custom-scrollbar()` / `hide-scrollbar()` - Scrollbar styling
