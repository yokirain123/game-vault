---
version: alpha
name: "Game Vault"
description: "A Ukrainian personal gaming journal with a quiet editorial shell, playful pixel accents, and high-contrast game artwork."
colors:
  primary: "#59b292"
  secondary: "#ff3d7e"
  background: "#0a0a0a"
  surface: "#2b2b2b"
  on-background: "#ededed"
  error: "#ef4444"
typography:
  sans:
    fontFamily: "Oswald, sans-serif"
  pixel:
    fontFamily: "Press Start 2P, monospace"
rounded:
  DEFAULT: "0.75rem"
  control: "0.75rem"
  card: "1.5rem"
  pill: "9999px"
spacing:
  page-gutter-mobile: "1rem"
  page-gutter-tablet: "1.5rem"
  page-gutter-desktop: "2.5rem"
  section-gap: "clamp(5rem, 10vw, 10rem)"
  page-max: "96rem"
components:
  button: { }
  card: { }
  dialog: { }
  input: { }
  navigation: { }
  details-panel: { }
---

# Game Vault Design System

## Overview

### Creative North Star

Game Vault should feel like a well-kept personal game shelf: game covers provide the colour, the surrounding interface stays restrained, and a small amount of pixel typography adds a recognisable retro signature.

### Product context and register

- **Audience and primary job:** visitors browse Dmytro's reviews, backlog, and curated collections; the owner manages those records through an authenticated admin flow.
- **Target market(s) and evidence:** Ukrainian-speaking visitors, based on the repository README and the existing Ukrainian navigation and editorial copy.
- **Locale(s) and language policy:** Ukrainian is the primary interface language. Proper game titles, platform names, and external brand names remain in their native form. Existing English admin copy may be migrated incrementally, but a single control must not mix languages.
- **Usage scene:** casual browsing on phones, tablets, and desktops; admin editing is less frequent and may be form-dense.
- **Register:** expressive editorial surfaces on public routes; familiar product patterns for filtering, dialogs, forms, and destructive actions.
- **Memorable signature:** pixel display type is reserved for the brand and large home-page statements.
- **Restraint:** navigation, filters, card details, forms, and admin actions prioritise readability and predictable behaviour.
- **Anti-references:** avoid neon-heavy game-launcher dashboards, glass on every surface, tiny desktop UI squeezed onto mobile, and generic SaaS card mosaics.
- **Token ownership/runtime mapping:** this document mirrors the canonical runtime variables in `app/globals.css`. Tailwind utilities consume those variables through the inline `@theme` mapping; changes to palette or type must start in the stylesheet and be reflected here.

## Colors

The default dark mode uses `background` (`#0a0a0a`), `surface` (`#2b2b2b`), `on-background` (`#ededed`), and `primary` mint (`#59b292`). Light mode maps the same runtime roles to warm paper (`#ece9e3`), stone (`#c2beb6`), near-black (`#171717`), and `secondary` pink (`#ff3d7e`). Game artwork is the main source of additional colour. Accent communicates selection and focus; `error` red (`#ef4444`) is reserved for destructive actions. Both themes use semantic roles rather than route-specific colours.

## Typography

Oswald is the readable default for prose, controls, metadata, and forms. Press Start 2P is a display face only: logo text and short hero headings. Responsive display type uses `clamp()` so Ukrainian words never force horizontal overflow. Controls use sentence case or the existing concise Ukrainian labels; long prose is limited to a readable measure.

## Layout

Pages use a centred `96rem` maximum width with gutters of `1rem`, `1.5rem`, and `2.5rem` across mobile, tablet, and desktop. The supported floor is 320 CSS pixels. Public lists use two compact columns on phones when content permits, expanding progressively; forms remain one column on narrow screens and pair related fields at larger widths. The fixed header reserves matching top space. Sticky detail panels become full-viewport mobile sheets below `1024px`. Safe-area padding protects fixed controls and sheets on notched devices.

## Elevation & Depth

Hierarchy comes primarily from tonal surfaces, artwork, and borders. The floating desktop header and overlays may use blur and a restrained shadow. Cards do not receive decorative shadows by default. Modal backdrops use a dark translucent layer; no content may appear above dialogs except feedback.

## Shapes

Cards and large panels use `1.5rem` corners, controls use `0.75rem`, and compact filters may use pills. The mobile sheet keeps rounded top corners but meets the viewport edges. Icon-only controls are circular and have a minimum 44px hit area.

## Components

### Foundational visual states

Interactive elements retain a quiet default, accent-coloured hover, a visible `focus-visible` ring, and a slight pressed response. Disabled controls preserve their geometry and reduce opacity. Busy submit buttons keep their label area stable and state what is happening. Errors render in an app-owned live region. Reduced-motion mode removes transforms, smooth animation, and continuously cycling hero content.

### Buttons and actions

Mint/accent buttons are primary, neutral surface buttons are secondary, and red is destructive. Text and icon actions use at least a 44px mobile target. Destructive controls stay visually separated from primary save actions and require an app-owned confirmation dialog.

### Navigation and data display

Desktop navigation remains horizontal. Mobile navigation is a labelled disclosure beneath the header, closes on navigation or Escape, and restores focus to its trigger. Active routes use accent colour plus `aria-current`. Game and collection grids progressively add columns without fixed card widths. Selected game details remain sticky on desktop and become a dismissible sheet on mobile.

### Forms and overlays

Every field has a visible label; placeholders are supplemental. Inputs use at least 16px text on mobile to prevent browser zoom. Textareas use a stable, non-resizable starting geometry inside scrollable dialogs. Dialogs own Escape handling, focus trapping/restoration, background scroll lock, labelled headings, and internal vertical scrolling. Form content remains mounted while a request is pending or fails.

### Iconography

React Icons is the canonical family. Interface icons are optically centred at 18–24px. Icon-only buttons always have an accessible name; unfamiliar actions retain text labels.

### Motion

Motion is short and state-driven: roughly 200–300ms for controls and up to 500ms for panels. The floating desktop header may ease more slowly because it reflects page scroll state. All transforms and automated hero changes stop under `prefers-reduced-motion`.

### Content and data visualization

Copy is direct and conversational in Ukrainian. Game reaction emoji may complement, never replace, an accessible label. Hours use a numeric value plus a visible unit; missing content is described explicitly.

## Do's and Don'ts

- **Do:** let game artwork carry visual variety while keeping UI surfaces calm.
- **Do:** test every public route at 320px, tablet, desktop, in both themes, and with long titles.
- **Don't:** solve mobile overflow by hiding content or the global scrollbar.
- **Don't:** use pixel type for paragraphs, form labels, or dense metadata.
