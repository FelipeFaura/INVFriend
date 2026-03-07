# TASK-029: Create Base Styles (\_base.scss)

**Agent:** @angular-ui-designer
**Status:** ⏳ Pending
**Dependencies:** TASK-027
**Estimate:** 2 hours

## Objective

Crear estilos base y resets tipográficos que apliquen globalmente.

## Files

- **Create:** `frontend/src/styles/_base.scss`

## Requirements

### 1. CSS Reset / Normalize

```scss
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

### 2. HTML / Body Base

```scss
html {
  font-size: $font-size-root; // 16px
  scroll-behavior: smooth;
}

body {
  font-family: $font-family-base;
  font-size: $font-size-base;
  line-height: $line-height-normal;
  color: $gray-800;
  background-color: $gray-50;
  -webkit-font-smoothing: antialiased;
}
```

### 3. Typography Elements

- Headings (h1-h6) with font sizes from tokens
- Paragraph spacing
- Link styles with brand colors
- Lists (ul, ol) base styles
- Code/pre styling

### 4. Focus Outline Reset

```scss
*:focus {
  outline: none;
}

*:focus-visible {
  @include focus-visible;
}
```

### 5. Selection

```scss
::selection {
  background-color: rgba($primary-500, 0.2);
  color: $primary-800;
}
```

## Scope / Limits

### ✅ What to Do

- Apply global resets and base typography
- Use design tokens for all values

### ❌ What NOT to Do

- Do NOT include component styles (those go in separate files)

## Acceptance Criteria

- [ ] File created at `frontend/src/styles/_base.scss`
- [ ] Box-sizing reset applied
- [ ] Body typography using tokens
- [ ] Heading hierarchy styled
- [ ] Focus-visible properly configured
- [ ] SCSS compiles without errors

## References

- [TASK-026 Analysis - Section 2.2 Typography](./TASK_026_UI_ANALYSIS_PROPOSAL.md)

---

## 📊 Results

**Status:** ✅ Complete
**Files Created:**

- `frontend/src/styles/_base.scss`

**Build:** ✅ Pass (`ng build` completed successfully)

**Acceptance Criteria:**

- [x] File created at `frontend/src/styles/_base.scss`
- [x] Box-sizing reset applied (`*, *::before, *::after { box-sizing: border-box }`)
- [x] Body typography using tokens (`$font-family-base`, `$text-primary`, `$bg-page`)
- [x] Heading hierarchy styled (h1-h6 with appropriate font sizes from tokens)
- [x] Focus-visible properly configured (using `$border-focus` and `$shadow-focus`)
- [x] SCSS compiles without errors

**Additional Features Implemented:**

- CSS reset for margin/padding
- Link styles with hover states using brand colors
- List styles (ul, ol) with proper spacing
- Code and pre element styling with monospace font
- Text elements (strong, em, small, mark, blockquote)
- Image/media responsive defaults
- Form element font inheritance reset
- Table collapse reset
- Selection highlighting with primary color
- Accessibility utilities (`.sr-only`, `.skip-link`)

**Notes:** All values use design tokens from `_tokens.scss`. The file uses `@use` syntax for SCSS module imports.
