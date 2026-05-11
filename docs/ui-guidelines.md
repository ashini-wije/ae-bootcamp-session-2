# UI Guidelines

This document describes the core UI guidelines for the TODO app. All UI work must follow these rules.

## Component library

- Use **Material UI (MUI)** components for all UI elements. Do not build custom equivalents when an MUI component exists.
  - Tasks: `Card`, `List`, `ListItem`, `Checkbox`
  - Inputs: `TextField`, `Select`, `DatePicker` (from `@mui/x-date-pickers`), `Chip` (for tags)
  - Actions: `Button`, `IconButton`, `Fab` (for the primary "add task" action)
  - Feedback: `Snackbar`, `Dialog` (for confirmations), `Tooltip`
  - Layout: `AppBar`, `Toolbar`, `Container`, `Stack`, `Grid`
- Icons must come from `@mui/icons-material`.
- Theming must be applied through a single MUI `ThemeProvider` at the app root using `createTheme`. Do not hardcode colors in components — use theme tokens (`theme.palette.*`, `theme.spacing`, `theme.typography`).

## Color palette (cute pastel)

Use this palette via the MUI theme. Hex values are the source of truth.

| Role                | Token                          | Light                         | Notes                              |
| ------------------- | ------------------------------ | ----------------------------- | ---------------------------------- |
| Primary             | `palette.primary.main`         | `#FFB6C1` (cotton-candy pink) | Primary actions, FAB               |
| Primary contrast    | `palette.primary.contrastText` | `#3A2A36`                     | Text on primary                    |
| Secondary           | `palette.secondary.main`       | `#B5EAD7` (mint)              | Secondary actions, tags            |
| Accent / tertiary   | custom `palette.tertiary.main` | `#C7CEEA` (periwinkle)        | Highlights, selected state         |
| Warning (due soon)  | `palette.warning.main`         | `#FFDAC1` (peach)             | Tasks due today                    |
| Error (overdue)     | `palette.error.main`           | `#FF8FA3` (rose)              | Overdue tasks, destructive actions |
| Success (completed) | `palette.success.main`         | `#A8E6CF` (sage)              | Completed indicator                |
| Background default  | `palette.background.default`   | `#FFF8F0` (cream)             | App background                     |
| Background paper    | `palette.background.paper`     | `#FFFFFF`                     | Cards, dialogs                     |
| Text primary        | `palette.text.primary`         | `#3A2A36` (plum-charcoal)     | Body text                          |
| Text secondary      | `palette.text.secondary`       | `#7A6B75`                     | Helper text                        |

- All foreground/background combinations above must be verified to meet **WCAG 2.1 AA contrast** (4.5:1 for body text, 3:1 for large text and UI components). If a pastel pairing fails, darken the foreground rather than abandoning the palette.
- Provide a dark mode variant via `createTheme({ palette: { mode: 'dark' } })` using deeper, desaturated versions of the same hues.

## Typography

- Use the MUI default `Roboto` font, plus `"Nunito", "Quicksand", sans-serif` as a rounded, friendly fallback stack for headings.
- Base font size: 16px. Do not go below 14px for body text.
- Use semantic typography variants (`h1`–`h6`, `body1`, `body2`, `caption`) — do not style raw `<div>`s for text hierarchy.

## Shape, spacing, and elevation

- Set `theme.shape.borderRadius = 16` for soft, rounded corners on cards, buttons, and inputs.
- Use the 8px MUI spacing scale (`theme.spacing(1)` = 8px). Do not use arbitrary pixel values.
- Prefer low elevation (`elevation={1}` or `elevation={2}`) for cards. Reserve higher elevation for modals and menus.

## Buttons

- Primary action: MUI `Button` with `variant="contained"`, `color="primary"`, fully rounded (`borderRadius: 999`) for a pill shape.
- Secondary action: `variant="outlined"`, `color="secondary"`.
- Tertiary / inline action: `variant="text"`.
- Destructive action: `variant="contained"`, `color="error"`, and always paired with a confirmation `Dialog`.
- Floating Action Button (`Fab`): used once per screen for the primary "Add task" action, bottom-right, `color="primary"`.
- Icon-only buttons must use `IconButton` wrapped in a `Tooltip` and have an `aria-label`.
- Buttons must show clear hover, focus, active, and disabled states. Do not remove the default focus ring.
- Minimum hit target: **44x44px** (use `size="large"` or padding to meet this on touch).

## Task list visuals

- Each task is rendered as an MUI `Card` or `ListItem` with:
  - A leading `Checkbox` for completion.
  - Title in `body1`, description in `body2` `text.secondary`.
  - Due date as a `Chip` with an icon; color follows the warning/error tokens above when due today or overdue.
  - Tags as small outlined `Chip`s using the secondary color.
  - Trailing `IconButton`s for edit and delete.
- Completed tasks are visually de-emphasized: reduced opacity (0.6) and strikethrough on the title. They remain fully readable and accessible.

## Feedback and motion

- Use `Snackbar` for transient confirmations (created, updated, deleted) with an "Undo" action where applicable.
- Use `Dialog` for destructive confirmations.
- Animations should be subtle and quick (150–250ms), using MUI's built-in transitions. Respect `prefers-reduced-motion` — disable non-essential animation when set.

## Accessibility (required)

The app must be usable by people with disabilities. Treat these as acceptance criteria, not nice-to-haves.

- **WCAG 2.1 AA** compliance is the baseline target.
- **Semantic HTML**: use real `<button>`, `<label>`, `<input>`, `<nav>`, `<main>`, `<header>` elements. Do not attach click handlers to `<div>`s.
- **Labels**: every form control has a visible `<label>` or an `aria-label`. Icon-only buttons always have `aria-label`.
- **Keyboard**:
  - All interactive elements must be reachable and operable with `Tab`, `Shift+Tab`, `Enter`, and `Space`.
  - Focus order must follow visual order.
  - A visible focus indicator must always be present (do not set `outline: none` without a replacement).
  - Modals trap focus and return it to the invoking element on close.
- **Screen readers**:
  - Dynamic updates (task added/completed/deleted) are announced via an ARIA live region or MUI `Snackbar` with appropriate role.
  - Checkboxes communicate their checked state; completion is not conveyed by color or strikethrough alone.
- **Color and contrast**:
  - Never use color as the sole means of conveying information (overdue, priority, completion must also use icon, text, or shape).
  - All text meets 4.5:1 contrast against its background; large text and UI components meet 3:1.
- **Touch targets**: minimum 44x44px.
- **Forms**: errors are announced to assistive tech (`aria-invalid`, `aria-describedby`) and shown in text, not just color.
- **Internationalization-ready**: do not bake text into images; allow strings to grow without breaking layout.
- Test with: keyboard only, a screen reader (NVDA, VoiceOver, or JAWS), and an automated tool (axe DevTools or Lighthouse). Lighthouse Accessibility score should be ≥ 95.

## Responsive layout

- Mobile-first. Layout must work at 360px width and scale up.
- Use MUI breakpoints (`xs`, `sm`, `md`, `lg`, `xl`) via `sx` props or `useMediaQuery`.
- Single-column task list on `xs`; optional two-column or sidebar layout on `md` and up.

## Don'ts

- Don't introduce a second component library alongside MUI.
- Don't override MUI styles with global CSS; use the `sx` prop, `styled()`, or theme overrides.
- Don't use saturated or neon colors — keep the palette soft and pastel.
- Don't remove focus outlines or rely on hover-only affordances.
