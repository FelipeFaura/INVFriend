# TASK-001: Análisis y Propuesta de Sistema de Diseño Unificado

**Agent:** @angular-ui-designer
**Status:** ✅ Complete
**Dependencies:** None
**Completed:** 2026-03-06

## Objective

Realizar un análisis completo de la interfaz actual de INVFriend y proponer un sistema de diseño unificado que mejore la usabilidad, consistencia visual y experiencia de usuario.

## Context

INVFriend es una aplicación de "Amigo Invisible" (Secret Santa) con las siguientes vistas principales:

1. **Autenticación**: Login, Register
2. **Dashboard**: Página principal post-login
3. **Grupos**: Lista, Crear, Detalle
4. **Funcionalidades de grupo**: Raffle, Wish List, Secret Santa Reveal, Status, Notifications

### Estado Actual

- 10 componentes con estilos SCSS independientes
- Sin sistema de variables globales
- Colores inconsistentes entre componentes
- No hay design tokens definidos
- Carpeta `frontend/src/styles/` vacía

## Deliverables

### 1. Análisis de Usabilidad (UX Audit)

Evaluar cada vista y documentar:

- Problemas de usabilidad detectados
- Flujos de usuario que necesitan mejoras
- Issues de accesibilidad
- Inconsistencias visuales actuales

### 2. Propuesta de Design Tokens

Definir el sistema de tokens:

```scss
// Ejemplo de estructura esperada
// Colors
$primary: ...
$secondary: ...
$success: ...
$warning: ...
$error: ...
$neutral-100 through $neutral-900: ...

// Typography
$font-family-base: ...
$font-size-xs through $font-size-2xl: ...
$font-weight-normal, $font-weight-medium, $font-weight-bold: ...

// Spacing
$space-1 through $space-12: ...

// Border radius
$radius-sm, $radius-md, $radius-lg, $radius-full: ...

// Shadows
$shadow-sm, $shadow-md, $shadow-lg: ...

// Breakpoints
$breakpoint-sm, $breakpoint-md, $breakpoint-lg: ...
```

### 3. Componentes UI Reutilizables

Proponer diseño para:

- **Buttons**: Primary, Secondary, Danger, Ghost, Icon buttons
- **Forms**: Inputs, Labels, Validation states, Form groups
- **Cards**: Group cards, Info cards, Action cards
- **Feedback**: Loading states, Error states, Empty states, Success messages
- **Navigation**: Header, Back buttons, Tabs
- **Modals**: Confirmation dialogs, Form modals

### 4. Mockups/Wireframes

Proporcionar diseño visual para las vistas principales:

- [x] Login / Register (refinamiento)
- [x] Dashboard
- [x] Group List
- [x] Group Detail (vista más compleja)
- [x] Mobile responsive versions

### 5. Plan de Implementación

Listar las tareas específicas de implementación ordenadas por prioridad:

```markdown
## Tareas Propuestas

1. [Descripción] - [Prioridad Alta/Media/Baja] - [Estimación]
2. ...
```

## Files to Analyze

| File                                                                                       | Purpose            |
| ------------------------------------------------------------------------------------------ | ------------------ |
| `frontend/src/styles.scss`                                                                 | Global styles      |
| `frontend/src/app/adapters/components/login/login.component.*`                             | Auth UI            |
| `frontend/src/app/adapters/components/register/register.component.*`                       | Auth UI            |
| `frontend/src/app/adapters/components/dashboard/dashboard.component.ts`                    | Dashboard (inline) |
| `frontend/src/app/adapters/components/group-list/group-list.component.*`                   | Groups listing     |
| `frontend/src/app/adapters/components/group-detail/group-detail.component.*`               | Group details      |
| `frontend/src/app/adapters/components/group-create/group-create.component.*`               | Group creation     |
| `frontend/src/app/adapters/components/group-status/group-status.component.*`               | Status display     |
| `frontend/src/app/adapters/components/raffle-trigger/raffle-trigger.component.*`           | Raffle UI          |
| `frontend/src/app/adapters/components/secret-santa-reveal/secret-santa-reveal.component.*` | Reveal UI          |
| `frontend/src/app/adapters/components/wish-list/wish-list.component.*`                     | Wishes UI          |
| `frontend/src/app/adapters/components/notification/notification.component.*`               | Notifications      |

## Scope / Limits

### ✅ What to Do

- Analyze all existing components and their styles
- Document current issues and inconsistencies
- Propose complete design token system
- Create visual mockups or detailed descriptions
- Recommend implementation order

### ❌ What NOT to Do

- Do NOT implement code changes yet
- Do NOT create actual SCSS files
- Do NOT modify any existing components
- This is ANALYSIS and PROPOSAL only

## Acceptance Criteria

- [x] UX audit document with findings
- [x] Complete design token specification
- [x] Component library specification (buttons, forms, cards, etc.)
- [x] Visual mockups or detailed wireframe descriptions
- [x] Prioritized implementation task list
- [x] Accessibility considerations documented (WCAG AA)
- [x] Mobile-first approach considered

## References

- [GUIDELINES.md](../../docs/GUIDELINES.md) - Project conventions
- [Angular UI Designer Agent](../../.github/agents/angular-ui-designer.agent.md) - Agent specification
- Current brand colors observed: Purple gradient (`#667eea` → `#764ba2`), Blue accent (`#4a90d9`)

---

## 📊 Results

**Status:** 🔄 Active → ✅ COMPLETE

**Deliverables:**

- [x] UX Audit Document
- [x] Design Tokens Specification
- [x] Component Library Specification
- [x] Visual Mockups/Descriptions
- [x] Implementation Task List

---

# DELIVERABLE 1: UX Audit Document

## 1.1 Component Inventory

| Component           | Files             | Styles Location | Status                         |
| ------------------- | ----------------- | --------------- | ------------------------------ |
| Login               | .ts, .html, .scss | Standalone SCSS | ⚠️ Duplicated styles           |
| Register            | .ts, .html, .scss | Standalone SCSS | ⚠️ Duplicated styles           |
| Dashboard           | .ts (inline)      | Inline styles   | ⚠️ Needs extraction            |
| Profile             | .ts (inline)      | Inline styles   | ⚠️ Needs extraction            |
| Group List          | .ts, .html, .scss | Standalone SCSS | ⚠️ Different color palette     |
| Group Create        | .ts, .html, .scss | Standalone SCSS | ⚠️ Different button styles     |
| Group Detail        | .ts, .html, .scss | Standalone SCSS | ⚠️ Most complex, many patterns |
| Group Status        | .ts, .html, .scss | Standalone SCSS | ⚠️ Different badge styles      |
| Raffle Trigger      | .ts, .html, .scss | Standalone SCSS | ⚠️ Different dialog pattern    |
| Secret Santa Reveal | .ts, .html, .scss | Standalone SCSS | ⚠️ Uses pink accent (unique)   |
| Wish List           | .ts, .html, .scss | Standalone SCSS | ⚠️ CSS Variables (partially)   |
| Notification        | .ts, .html, .scss | Standalone SCSS | ✅ Good pattern                |

## 1.2 Visual Inconsistencies Detected

### Color Palette Chaos

**Primary Colors (5 different values used):**

- `#667eea` → `#764ba2` (gradient) - Login, Register, Dashboard, Profile
- `#4a90d9` / `#3a7bc8` - Group components
- `#1976d2` / `#1565c0` - Wish List
- `#2196f3` - Raffle trigger spinner
- `#e91e63` / `#c2185b` - Secret Santa Reveal (pink)

**Error Colors (4 different reds):**

- `#dc2626` - Login, Register
- `#c53030` / `#9b2c2c` - Group Detail, Group Create
- `#f44336` / `#d32f2f` - Wish List, Raffle Trigger

**Success Colors (4 different greens):**

- `#38a169` - Group List status
- `#4caf50` / `#2e7d32` - Status, Raffle
- `#27ae60` - Referenced in guidelines

**Warning Colors (4 different oranges):**

- `#d69e2e` - Group List
- `#ff9800` / `#e65100` - Raffle, Status
- `#f5a623` - Wish priority

### Typography Inconsistencies

- No consistent type scale defined
- Title sizes vary: `1.5rem`, `1.75rem`, `2rem`
- Body text: `0.875rem`, `0.9rem`, `1rem`
- Labels: `0.75rem`, `0.8rem`, `0.85rem`, `0.9rem`

### Spacing Inconsistencies

- Padding values: `8px`, `10px`, `12px`, `16px`, `20px`, `24px` (no scale)
- Margins: arbitrary values throughout
- Gap values: `0.5rem`, `8px`, `12px`, `16px`, `1rem` (mixed units)

### Border Radius Variations

- `4px` - Some buttons
- `8px` - Most inputs and cards
- `12px` - Cards, modals
- `20px` - Badges
- `50%` - Spinners, avatars

## 1.3 Usability Issues

### Critical Issues

1. **No visual hierarchy in Group Detail page**
   - Too many sections competing for attention
   - Status, Reveal, Raffle, Wishes all equally weighted

2. **Confusing modal patterns**
   - Delete confirmation: orange background
   - Add member: white background
   - No consistent modal design

3. **Button confusion**
   - Primary buttons are different colors in different components
   - Icon buttons lack consistent styling

### Medium Priority Issues

4. **Empty states lack call-to-action consistency**
   - Group list: "Create Your First Group" button
   - Wish list: Text only, no button
   - Assigned wishes: Text only

5. **Loading states vary**
   - Spinner sizes: `16px`, `24px`, `40px`
   - Spinner colors: `#4a90d9`, `#2196f3`, `#e91e63`, `#1976d2`

6. **Error states not uniform**
   - Some have icons, some don't
   - Some have retry buttons, some need page refresh

### Low Priority Issues

7. **Dashboard is too minimal**
   - Only 2 action cards
   - No group previews or quick stats

8. **Profile page is placeholder only**
   - No edit functionality
   - Inline styles

## 1.4 Accessibility Issues (WCAG AA)

### Critical A11y Issues

1. **Missing focus-visible styles globally**
   - Only Login/Register have `:focus` styles
   - Other components lack visible focus indicators

2. **Emoji icons without aria-labels**
   - `👑`, `📋`, `🎲`, `🎁`, `✅`, `❌` used as decorative or informative
   - No `aria-label` or `role="img"` attributes

3. **Color contrast concerns**
   - Warning text (`#d69e2e`, `#ff9800`) may fail on white backgrounds
   - Light gray hints (`#999`) below 4.5:1 ratio

### Medium A11y Issues

4. **No skip links**
   - No "Skip to main content" functionality

5. **Modal focus trap missing**
   - Focus not trapped inside modals
   - Can tab out while modal is open

6. **Form field associations**
   - Most fields properly labeled
   - Some inputs rely on placeholder only

### Keyboard Navigation Issues

7. **Cards clickable but no keyboard indication**
   - Group cards show pointer cursor but no focus state
   - Tab order unclear in Group Detail

---

# DELIVERABLE 2: Design Tokens Specification

## 2.1 Color System

```scss
// ============================================
// DESIGN TOKENS - frontend/src/styles/_tokens.scss
// ============================================

// ===================
// COLOR PALETTE
// ===================

// Primary - Brand gradient (keeping established identity)
$color-primary-50: #f0f2ff;
$color-primary-100: #e0e5ff;
$color-primary-200: #c7ceff;
$color-primary-300: #a3adff;
$color-primary-400: #8090f7;
$color-primary-500: #667eea; // Main primary
$color-primary-600: #5568d4;
$color-primary-700: #4553b8;
$color-primary-800: #3a4599;
$color-primary-900: #333c7a;

// Secondary - Purple accent (from gradient end)
$color-secondary-50: #faf5ff;
$color-secondary-100: #f3e8ff;
$color-secondary-200: #e9d5ff;
$color-secondary-300: #d8b4fe;
$color-secondary-400: #a855f7;
$color-secondary-500: #764ba2; // Main secondary
$color-secondary-600: #6b4190;
$color-secondary-700: #5a367a;
$color-secondary-800: #4a2d64;
$color-secondary-900: #3d2653;

// Brand Gradient
$gradient-primary: linear-gradient(
  135deg,
  $color-primary-500 0%,
  $color-secondary-500 100%
);
$gradient-primary-hover: linear-gradient(
  135deg,
  $color-primary-600 0%,
  $color-secondary-600 100%
);

// Semantic Colors - Success
$color-success-50: #f0fdf4;
$color-success-100: #dcfce7;
$color-success-200: #bbf7d0;
$color-success-300: #86efac;
$color-success-400: #4ade80;
$color-success-500: #22c55e; // Main success
$color-success-600: #16a34a;
$color-success-700: #15803d;
$color-success-800: #166534;
$color-success-900: #14532d;

// Semantic Colors - Warning
$color-warning-50: #fffbeb;
$color-warning-100: #fef3c7;
$color-warning-200: #fde68a;
$color-warning-300: #fcd34d;
$color-warning-400: #fbbf24;
$color-warning-500: #f59e0b; // Main warning
$color-warning-600: #d97706;
$color-warning-700: #b45309;
$color-warning-800: #92400e;
$color-warning-900: #78350f;

// Semantic Colors - Error
$color-error-50: #fef2f2;
$color-error-100: #fee2e2;
$color-error-200: #fecaca;
$color-error-300: #fca5a5;
$color-error-400: #f87171;
$color-error-500: #ef4444; // Main error
$color-error-600: #dc2626;
$color-error-700: #b91c1c;
$color-error-800: #991b1b;
$color-error-900: #7f1d1d;

// Semantic Colors - Info
$color-info-50: #eff6ff;
$color-info-100: #dbeafe;
$color-info-200: #bfdbfe;
$color-info-300: #93c5fd;
$color-info-400: #60a5fa;
$color-info-500: #3b82f6; // Main info
$color-info-600: #2563eb;
$color-info-700: #1d4ed8;
$color-info-800: #1e40af;
$color-info-900: #1e3a8a;

// Neutral Colors
$color-neutral-0: #ffffff;
$color-neutral-50: #f9fafb;
$color-neutral-100: #f3f4f6;
$color-neutral-200: #e5e7eb;
$color-neutral-300: #d1d5db;
$color-neutral-400: #9ca3af;
$color-neutral-500: #6b7280;
$color-neutral-600: #4b5563;
$color-neutral-700: #374151;
$color-neutral-800: #1f2937;
$color-neutral-900: #111827;

// ===================
// SEMANTIC ALIASES
// ===================

// Text
$text-primary: $color-neutral-800;
$text-secondary: $color-neutral-600;
$text-muted: $color-neutral-400;
$text-inverse: $color-neutral-0;
$text-link: $color-primary-500;
$text-link-hover: $color-primary-600;

// Backgrounds
$bg-page: $color-neutral-50;
$bg-surface: $color-neutral-0;
$bg-muted: $color-neutral-100;
$bg-hover: $color-neutral-100;

// Borders
$border-default: $color-neutral-200;
$border-strong: $color-neutral-300;
$border-focus: $color-primary-500;

// ===================
// TYPOGRAPHY
// ===================

$font-family-base:
  "Inter",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  Oxygen,
  Ubuntu,
  Cantarell,
  "Open Sans",
  "Helvetica Neue",
  sans-serif;
$font-family-mono:
  "Fira Code", "JetBrains Mono", Consolas, Monaco, "Andale Mono", monospace;

// Font Sizes (based on 16px = 1rem)
$font-size-xs: 0.75rem; // 12px
$font-size-sm: 0.875rem; // 14px
$font-size-base: 1rem; // 16px
$font-size-lg: 1.125rem; // 18px
$font-size-xl: 1.25rem; // 20px
$font-size-2xl: 1.5rem; // 24px
$font-size-3xl: 1.875rem; // 30px
$font-size-4xl: 2.25rem; // 36px

// Font Weights
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Line Heights
$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;

// ===================
// SPACING
// ===================

$space-0: 0;
$space-1: 0.25rem; // 4px
$space-2: 0.5rem; // 8px
$space-3: 0.75rem; // 12px
$space-4: 1rem; // 16px
$space-5: 1.25rem; // 20px
$space-6: 1.5rem; // 24px
$space-8: 2rem; // 32px
$space-10: 2.5rem; // 40px
$space-12: 3rem; // 48px
$space-16: 4rem; // 64px

// ===================
// BORDERS & RADIUS
// ===================

$border-width-default: 1px;
$border-width-thick: 2px;

$radius-none: 0;
$radius-sm: 0.25rem; // 4px
$radius-md: 0.5rem; // 8px
$radius-lg: 0.75rem; // 12px
$radius-xl: 1rem; // 16px
$radius-2xl: 1.5rem; // 24px
$radius-full: 9999px; // pill shape

// ===================
// SHADOWS
// ===================

$shadow-none: none;
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md:
  0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -2px rgba(0, 0, 0, 0.1);
$shadow-lg:
  0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -4px rgba(0, 0, 0, 0.1);
$shadow-xl:
  0 20px 25px -5px rgba(0, 0, 0, 0.1),
  0 8px 10px -6px rgba(0, 0, 0, 0.1);
$shadow-focus: 0 0 0 3px rgba($color-primary-500, 0.2);
$shadow-focus-error: 0 0 0 3px rgba($color-error-500, 0.2);

// ===================
// BREAKPOINTS
// ===================

$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;

// ===================
// Z-INDEX SCALE
// ===================

$z-dropdown: 100;
$z-sticky: 200;
$z-fixed: 300;
$z-modal-backdrop: 400;
$z-modal: 500;
$z-popover: 600;
$z-tooltip: 700;
$z-notification: 800;

// ===================
// TRANSITIONS
// ===================

$transition-fast: 150ms ease;
$transition-normal: 200ms ease;
$transition-slow: 300ms ease;
```

## 2.2 Responsive Breakpoint Mixins

```scss
// ============================================
// MIXINS - frontend/src/styles/_mixins.scss
// ============================================

// Mobile-first breakpoint mixins
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

// Max-width mixins for mobile targeting
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

// Focus visible mixin
@mixin focus-visible {
  &:focus-visible {
    outline: 2px solid $border-focus;
    outline-offset: 2px;
    box-shadow: $shadow-focus;
  }
}

// Interactive states mixin
@mixin interactive-states($bg-color, $hover-darken: 8%) {
  background-color: $bg-color;
  transition: background-color $transition-fast;

  &:hover:not(:disabled) {
    background-color: darken($bg-color, $hover-darken);
  }

  &:active:not(:disabled) {
    background-color: darken($bg-color, $hover-darken + 4%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @include focus-visible;
}

// Truncate text
@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Visually hidden (for a11y)
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

# DELIVERABLE 3: Component Library Specification

## 3.1 Buttons

```scss
// ============================================
// BUTTONS - frontend/src/styles/components/_buttons.scss
// ============================================

// Base button
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  padding: $space-3 $space-4;
  font-family: $font-family-base;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  line-height: $line-height-tight;
  border: $border-width-default solid transparent;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  text-decoration: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @include focus-visible;
}

// Size variants
.btn--sm {
  padding: $space-2 $space-3;
  font-size: $font-size-sm;
}

.btn--lg {
  padding: $space-4 $space-6;
  font-size: $font-size-lg;
}

// Primary button (gradient brand)
.btn--primary {
  background: $gradient-primary;
  color: $text-inverse;
  border-color: transparent;

  &:hover:not(:disabled) {
    background: $gradient-primary-hover;
    transform: translateY(-1px);
    box-shadow: $shadow-md;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

// Secondary button
.btn--secondary {
  background-color: $bg-muted;
  color: $text-primary;
  border-color: $border-default;

  &:hover:not(:disabled) {
    background-color: $color-neutral-200;
    border-color: $border-strong;
  }
}

// Danger button
.btn--danger {
  background-color: $color-error-500;
  color: $text-inverse;

  &:hover:not(:disabled) {
    background-color: $color-error-600;
  }
}

// Ghost button (transparent)
.btn--ghost {
  background-color: transparent;
  color: $text-primary;

  &:hover:not(:disabled) {
    background-color: $bg-hover;
  }
}

// Link style button
.btn--link {
  background: none;
  color: $text-link;
  padding: 0;
  border: none;

  &:hover:not(:disabled) {
    color: $text-link-hover;
    text-decoration: underline;
  }
}

// Icon button
.btn--icon {
  padding: $space-2;
  background: transparent;
  border: $border-width-default solid $border-default;

  &:hover:not(:disabled) {
    background-color: $bg-hover;
  }

  &.btn--icon-danger:hover:not(:disabled) {
    background-color: $color-error-50;
    border-color: $color-error-200;
  }
}

// Full width
.btn--block {
  width: 100%;
}

// Loading state
.btn--loading {
  pointer-events: none;

  .btn__spinner {
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

## 3.2 Form Elements

```scss
// ============================================
// FORMS - frontend/src/styles/components/_forms.scss
// ============================================

// Form group wrapper
.form-group {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  margin-bottom: $space-4;
}

// Labels
.form-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $text-primary;
}

.form-label--required::after {
  content: " *";
  color: $color-error-500;
}

.form-label--optional::after {
  content: " (optional)";
  color: $text-muted;
  font-weight: $font-weight-normal;
}

// Input base
.form-input {
  width: 100%;
  padding: $space-3 $space-4;
  font-family: $font-family-base;
  font-size: $font-size-base;
  color: $text-primary;
  background-color: $bg-surface;
  border: $border-width-default solid $border-default;
  border-radius: $radius-md;
  transition:
    border-color $transition-fast,
    box-shadow $transition-fast;

  &::placeholder {
    color: $text-muted;
  }

  &:focus {
    outline: none;
    border-color: $border-focus;
    box-shadow: $shadow-focus;
  }

  &:disabled {
    background-color: $bg-muted;
    cursor: not-allowed;
    opacity: 0.7;
  }

  // Invalid state
  &.form-input--invalid,
  &:invalid:not(:placeholder-shown) {
    border-color: $color-error-500;

    &:focus {
      box-shadow: $shadow-focus-error;
    }
  }
}

// Textarea
.form-textarea {
  resize: vertical;
  min-height: 100px;
}

// Field error message
.form-error {
  display: flex;
  align-items: center;
  gap: $space-1;
  font-size: $font-size-xs;
  color: $color-error-600;
}

// Field hint
.form-hint {
  font-size: $font-size-xs;
  color: $text-muted;
}

// Character count
.form-char-count {
  font-size: $font-size-xs;
  color: $text-muted;
  text-align: right;
}
```

## 3.3 Cards

```scss
// ============================================
// CARDS - frontend/src/styles/components/_cards.scss
// ============================================

// Base card
.card {
  background-color: $bg-surface;
  border: $border-width-default solid $border-default;
  border-radius: $radius-lg;
  overflow: hidden;
}

// Card variants
.card--elevated {
  box-shadow: $shadow-md;
  border: none;
}

.card--interactive {
  cursor: pointer;
  transition:
    box-shadow $transition-fast,
    border-color $transition-fast,
    transform $transition-fast;

  &:hover {
    box-shadow: $shadow-lg;
    border-color: $color-primary-300;
    transform: translateY(-2px);
  }

  @include focus-visible;
}

// Card sections
.card__header {
  padding: $space-4;
  border-bottom: $border-width-default solid $border-default;
}

.card__body {
  padding: $space-4;
}

.card__footer {
  padding: $space-4;
  border-top: $border-width-default solid $border-default;
  background-color: $bg-muted;
}

// Group card specific
.card--group {
  .card__title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $text-primary;
    margin: 0;
  }

  .card__meta {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-top: $space-2;
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

// Secret Santa reveal card
.card--reveal {
  background: linear-gradient(145deg, #fff5f8 0%, $bg-surface 100%);
  border-color: $color-secondary-200;
  text-align: center;

  .card__icon {
    font-size: $font-size-4xl;
    margin-bottom: $space-4;
  }
}
```

## 3.4 Feedback Components

```scss
// ============================================
// FEEDBACK - frontend/src/styles/components/_feedback.scss
// ============================================

// Alert base
.alert {
  display: flex;
  align-items: flex-start;
  gap: $space-3;
  padding: $space-4;
  border-radius: $radius-md;
  font-size: $font-size-sm;
}

.alert__icon {
  flex-shrink: 0;
  font-size: $font-size-lg;
}

.alert__content {
  flex: 1;
}

.alert__title {
  font-weight: $font-weight-medium;
  margin-bottom: $space-1;
}

// Alert variants
.alert--error {
  background-color: $color-error-50;
  border: $border-width-default solid $color-error-200;
  color: $color-error-700;
}

.alert--success {
  background-color: $color-success-50;
  border: $border-width-default solid $color-success-200;
  color: $color-success-700;
}

.alert--warning {
  background-color: $color-warning-50;
  border: $border-width-default solid $color-warning-200;
  color: $color-warning-700;
}

.alert--info {
  background-color: $color-info-50;
  border: $border-width-default solid $color-info-200;
  color: $color-info-700;
}

// Loading spinner
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid $border-default;
  border-top-color: $color-primary-500;
  border-radius: $radius-full;
  animation: spin 1s linear infinite;
}

.spinner--sm {
  width: 16px;
  height: 16px;
  border-width: 2px;
}
.spinner--lg {
  width: 40px;
  height: 40px;
  border-width: 4px;
}

// Loading container
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-12;
  color: $text-secondary;
  text-align: center;

  .spinner {
    margin-bottom: $space-4;
  }
}

// Empty state
.empty-state {
  text-align: center;
  padding: $space-12;
  color: $text-secondary;

  .empty-state__icon {
    font-size: $font-size-4xl;
    margin-bottom: $space-4;
  }

  .empty-state__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $text-primary;
    margin-bottom: $space-2;
  }

  .empty-state__description {
    margin-bottom: $space-6;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}

// Status badge
.badge {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  padding: $space-1 $space-3;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  border-radius: $radius-full;
}

.badge--pending {
  background-color: $color-warning-100;
  color: $color-warning-700;
}

.badge--completed {
  background-color: $color-success-100;
  color: $color-success-700;
}

.badge--admin {
  background-color: $color-secondary-100;
  color: $color-secondary-700;
}
```

## 3.5 Modal Component

```scss
// ============================================
// MODAL - frontend/src/styles/components/_modal.scss
// ============================================

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba($color-neutral-900, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-4;
  z-index: $z-modal-backdrop;
  animation: fadeIn $transition-fast;
}

.modal {
  background-color: $bg-surface;
  border-radius: $radius-lg;
  box-shadow: $shadow-xl;
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - #{$space-8});
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: $z-modal;
  animation: slideUp $transition-normal;
}

.modal--sm {
  max-width: 400px;
}
.modal--lg {
  max-width: 640px;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-4 $space-6;
  border-bottom: $border-width-default solid $border-default;

  h3 {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
  }
}

.modal__close {
  @extend .btn--icon;
  margin: -$space-2;
}

.modal__body {
  padding: $space-6;
  overflow-y: auto;
  flex: 1;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: $space-3;
  padding: $space-4 $space-6;
  border-top: $border-width-default solid $border-default;
  background-color: $bg-muted;
}

// Confirmation modal (danger styling)
.modal--confirm-danger {
  .modal__header {
    background-color: $color-error-50;
    border-bottom-color: $color-error-200;

    h3 {
      color: $color-error-700;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## 3.6 Navigation Components

```scss
// ============================================
// NAVIGATION - frontend/src/styles/components/_navigation.scss
// ============================================

// Page header
.page-header {
  display: flex;
  align-items: center;
  gap: $space-4;
  margin-bottom: $space-6;
}

.page-title {
  flex: 1;
  margin: 0;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

// Back link
.back-link {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  color: $text-link;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  text-decoration: none;
  transition: color $transition-fast;

  &:hover {
    color: $text-link-hover;
  }

  @include focus-visible;
}

// Search input
.search-input {
  @extend .form-input;
  padding-left: $space-10;
  background-image: url("data:image/svg+xml,..."); // Search icon SVG
  background-repeat: no-repeat;
  background-position: $space-3 center;
  background-size: 20px;
}
```

---

# DELIVERABLE 4: Visual Mockups & Descriptions

## 4.1 Login / Register Page

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [Gradient Background]                    │
│                    #667eea → #764ba2                        │
│                                                             │
│          ┌─────────────────────────────────────┐            │
│          │                                     │            │
│          │         Welcome Back                │            │
│          │   Sign in to your INVFriend account │            │
│          │                                     │            │
│          │  ┌─────────────────────────────┐    │            │
│          │  │ Email                       │    │            │
│          │  │ [your@email.com          ]  │    │            │
│          │  └─────────────────────────────┘    │            │
│          │                                     │            │
│          │  ┌─────────────────────────────┐    │            │
│          │  │ Password                    │    │            │
│          │  │ [••••••••                 ] │    │            │
│          │  └─────────────────────────────┘    │            │
│          │                                     │            │
│          │  ┌─────────────────────────────┐    │            │
│          │  │      ▐ Sign In             │    │ gradient   │
│          │  └─────────────────────────────┘    │            │
│          │                                     │            │
│          │        ─────── or ───────           │            │
│          │                                     │            │
│          │  ┌─────────────────────────────┐    │            │
│          │  │  [G] Continue with Google   │    │ outlined   │
│          │  └─────────────────────────────┘    │            │
│          │                                     │            │
│          │   Don't have an account? Sign up   │            │
│          │                                     │            │
│          └─────────────────────────────────────┘            │
│                         Card with shadow-lg                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Mobile (< 640px):**

- Card takes full width with 16px margins
- Same form layout, stacked vertically
- Touch-friendly button heights (48px min)

## 4.2 Dashboard Page

```
┌─────────────────────────────────────────────────────────────┐
│ [Gradient Background Header]                                │
│                                                             │
│    Welcome to INVFriend                                     │
│    Hello, [User Name]!                    [Avatar] [Logout] │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ Quick Actions ───────────────────────────────────────┐  │
│  │                                                       │  │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐         │  │
│  │  │    👥     │  │     ➕    │  │    👤     │         │  │
│  │  │ My Groups │  │ New Group │  │  Profile  │         │  │
│  │  │  (3)      │  │           │  │           │         │  │
│  │  └───────────┘  └───────────┘  └───────────┘         │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ Recent Activity ─────────────────────────────────────┐  │
│  │                                                       │  │
│  │  • Family Secret Santa - Raffle completed! 🎉         │  │
│  │  • Office Party 2024 - You were added as admin        │  │
│  │  • Friends Gift Exchange - New wish added             │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ My Active Groups ────────────────────────────────────┐  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ 👑 Family Secret Santa          3 members       │  │  │
│  │  │     [Completed ✓]               $50 budget      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │    Office Party 2024           12 members       │  │  │
│  │  │     [Pending ⏳]                $25 budget      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │        [View All Groups →]                            │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Improvements:**

- Add group count to Quick Actions
- Add Recent Activity section
- Preview of active groups with quick info
- Better use of white space
- Clear visual hierarchy

## 4.3 Group List Page

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ← Back                                                     │
│                                                             │
│  My Groups                           [+ Create Group]       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔍 Search groups...                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 👑 Family Secret Santa                                  ││
│  │                                                         ││
│  │ 3 members  •  [Completed ✓]                            ││
│  │ Budget: $50                                            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │    Office Party 2024                                    ││
│  │                                                         ││
│  │ 12 members  •  [Pending ⏳]                             ││
│  │ Budget: $25                                            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │    Friends Gift Exchange                                ││
│  │                                                         ││
│  │ 6 members  •  [Pending ⏳]                              ││
│  │ Budget: $30                                            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Mobile (< 640px):**

- Header stacks: title on top, button below
- Cards take full width
- Larger touch targets

## 4.4 Group Detail Page (Most Complex)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ← Back to Groups                                           │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │  👑 Family Secret Santa              [✏️] [🗑️]       │ │
│  │                                                        │ │
│  │  ┌────────────────────────────┐                       │ │
│  │  │ Budget: $50  │ Created: Dec 1, 2024 │              │ │
│  │  └────────────────────────────┘                       │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─ Status ──────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  [✓ Raffle Completed]                                │  │
│  │                                                       │  │
│  │  Members: 3 / 2 minimum  [████████████████] 100%     │  │
│  │  ✓ Ready for raffle                                  │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ 🎁 Your Secret Santa Assignment ─────────────────────┐  │
│  │                                                       │  │
│  │              🎁                                       │  │
│  │                                                       │  │
│  │     You are giving a gift to:                        │  │
│  │                                                       │  │
│  │         ┌─────────────────────┐                       │  │
│  │         │    Mom (Sarah)      │                       │  │
│  │         └─────────────────────┘                       │  │
│  │                                                       │  │
│  │     Remember to keep it a secret! 🤫                  │  │
│  │     Budget: $50                                       │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ 🎲 Raffle ───────────────────────────────────────────┐  │
│  │                                                       │  │
│  │     [✓ Raffle Completed]                             │  │
│  │     Assignments have been made                        │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ My Wish List ────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  [+ Add Wish]                                         │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────┐              │  │
│  │  │ ⭐ Wireless Headphones    [✏️] [🗑️]│              │  │
│  │  │ Sony WH-1000XM5                     │              │  │
│  │  │ $350  •  🔗 View Link               │              │  │
│  │  └─────────────────────────────────────┘              │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────┐              │  │
│  │  │ ⭐⭐ Book: Atomic Habits  [✏️] [🗑️]│              │  │
│  │  │ Great book about habits              │              │  │
│  │  │ $15                                 │              │  │
│  │  └─────────────────────────────────────┘              │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ 🎅 Your Recipient's Wish List ───────────────────────┐  │
│  │                                                       │  │
│  │  (Same format as above, read-only)                    │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ Members (3) ─────────────────────────────────────────┐  │
│  │                                                [+ Add] │  │
│  │                                                       │  │
│  │  ┌───────────────────────────────────────────────────┐│  │
│  │  │ 👑 John (You)                      Admin          ││  │
│  │  ├───────────────────────────────────────────────────┤│  │
│  │  │    Mom (Sarah)                     [Remove]       ││  │
│  │  ├───────────────────────────────────────────────────┤│  │
│  │  │    Dad (Michael)                   [Remove]       ││  │
│  │  └───────────────────────────────────────────────────┘│  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Description (optional)                                     │
│  Annual family gift exchange for Christmas 2024.            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Changes:**

1. Clear section cards with consistent styling
2. Visual hierarchy through card headers
3. Status section at top for quick overview
4. Reveal section prominently displayed when raffle complete
5. Collapsible sections for long content (accordion pattern)
6. Consistent icon usage
7. Clear admin-only action visibility

## 4.5 Mobile Responsive Considerations

**Breakpoints:**

- Mobile: < 640px
- Tablet: 640px - 1023px
- Desktop: ≥ 1024px

**Mobile Patterns:**

1. **Stacked layouts**: All horizontal layouts become vertical
2. **Full-width cards**: Cards stretch to screen edges with 16px margins
3. **Bottom sheet modals**: Modals slide up from bottom on mobile
4. **Touch targets**: Minimum 48px height for interactive elements
5. **Condensed headers**: Back button + title only, actions in menu
6. **Swipe actions**: Swipe to edit/delete on wish cards (future enhancement)

---

# DELIVERABLE 5: Implementation Task List

## Priority 1 - Foundation (Week 1)

| #   | Task                      | Description                                                  | Estimate |
| --- | ------------------------- | ------------------------------------------------------------ | -------- |
| 1.1 | Create design tokens file | `_tokens.scss` with all colors, typography, spacing, shadows | 2h       |
| 1.2 | Create mixins file        | `_mixins.scss` with responsive breakpoints, focus styles     | 1h       |
| 1.3 | Create base styles        | `_base.scss` with reset, typography, a11y utilities          | 2h       |
| 1.4 | Update global styles.scss | Import all partials, define CSS custom properties            | 1h       |

## Priority 2 - Core Components (Week 1-2)

| #   | Task                           | Description                                             | Estimate |
| --- | ------------------------------ | ------------------------------------------------------- | -------- |
| 2.1 | Create button component styles | `_buttons.scss` - all variants, sizes, states           | 3h       |
| 2.2 | Create form styles             | `_forms.scss` - inputs, labels, validation states       | 3h       |
| 2.3 | Create card styles             | `_cards.scss` - base, group card, reveal card           | 2h       |
| 2.4 | Create feedback styles         | `_feedback.scss` - alerts, spinner, empty state, badges | 3h       |
| 2.5 | Create modal styles            | `_modal.scss` - overlay, dialog, variants               | 2h       |
| 2.6 | Create navigation styles       | `_navigation.scss` - headers, back links                | 1h       |

## Priority 3 - Migrate Existing Components (Week 2-3)

| #    | Task                             | Description                                   | Estimate |
| ---- | -------------------------------- | --------------------------------------------- | -------- |
| 3.1  | Migrate Login component          | Replace local SCSS with design system classes | 2h       |
| 3.2  | Migrate Register component       | Replace local SCSS with design system classes | 2h       |
| 3.3  | Migrate Dashboard component      | Extract inline styles, apply design system    | 3h       |
| 3.4  | Migrate Profile component        | Extract inline styles, apply design system    | 2h       |
| 3.5  | Migrate Group List component     | Replace local SCSS with design system classes | 3h       |
| 3.6  | Migrate Group Create component   | Replace local SCSS with design system classes | 2h       |
| 3.7  | Migrate Group Detail component   | Most complex - section by section migration   | 5h       |
| 3.8  | Migrate Group Status component   | Replace local SCSS with design system classes | 1h       |
| 3.9  | Migrate Raffle Trigger component | Replace local SCSS with design system classes | 2h       |
| 3.10 | Migrate Secret Santa Reveal      | Replace local SCSS with design system classes | 2h       |
| 3.11 | Migrate Wish List component      | Replace local SCSS (partially uses CSS vars)  | 3h       |
| 3.12 | Migrate Notification component   | Replace local SCSS with design system classes | 1h       |

## Priority 4 - Accessibility Fixes (Week 3)

| #   | Task                    | Description                                           | Estimate |
| --- | ----------------------- | ----------------------------------------------------- | -------- |
| 4.1 | Add global focus styles | `:focus-visible` styles on all interactive elements   | 2h       |
| 4.2 | Add skip link           | Skip to main content link                             | 1h       |
| 4.3 | Fix emoji accessibility | Add `aria-label` or `role="img"` to decorative emojis | 2h       |
| 4.4 | Modal focus trap        | Implement focus trapping in all modals                | 3h       |
| 4.5 | Keyboard navigation     | Ensure all cards and actions keyboard accessible      | 2h       |
| 4.6 | Color contrast audit    | Verify all text meets WCAG AA (4.5:1 for normal text) | 2h       |

## Priority 5 - Polish & Enhancement (Week 4)

| #   | Task                 | Description                                        | Estimate |
| --- | -------------------- | -------------------------------------------------- | -------- |
| 5.1 | Loading skeletons    | Create skeleton loading states for lists and cards | 3h       |
| 5.2 | Micro-animations     | Add subtle transitions (card hover, button press)  | 2h       |
| 5.3 | Dark mode foundation | Set up CSS custom properties for theming           | 4h       |
| 5.4 | Documentation        | Create style guide documentation                   | 3h       |

---

## Summary

**Total Estimated Time:** ~70-80 hours (~2 weeks full-time)

**Key Recommendations:**

1. **Start with tokens and mixins** - Foundation must be solid before component migration
2. **Migrate components incrementally** - Don't try to change everything at once
3. **Test on mobile throughout** - Mobile-first approach catches responsive issues early
4. **Accessibility is not optional** - Build it in from the start, not as an afterthought
5. **Document as you go** - Future maintainers will thank you

---

## ⚠️ External Issues Detected

1. **Dashboard and Profile use inline styles** - Should be extracted to separate SCSS files
2. **No shared component library structure** - Consider creating `frontend/src/styles/components/` directory
3. **Inter font not installed** - Need to add web font or rely on system font fallback
4. **No dark mode support** - CSS custom properties needed for future theming

---

## ❓ Blockers/Questions

None identified. Ready to proceed with implementation phase.\_
