# UX Contract

## Product context

- Audience: Ukrainian-speaking visitors and one authenticated content owner.
- Primary jobs: browse reviews, inspect games, filter the library, explore collections/backlog, and manage content as admin.
- Target market(s): Ukraine; grounded in `README.md` and current Ukrainian public copy.
- Active locales: Ukrainian UI with native game and platform names.
- Language/content register and native-review policy: conversational Ukrainian; repository owner reviews final copy.
- Timezone/calendar policy: no date or calendar UI is currently exposed.
- Accessibility target: WCAG 2.2 AA.

## Business-context sources

| Domain / scope | Authoritative source | Source type | Reviewed date |
|---|---|---|---|
| Product scope | `README.md` | Product brief | 2026-09-09 |
| Permission model | Admin email checks in `app/reviews/page.tsx`, `app/backlog/page.tsx`, and `app/collections/page.tsx` | Runtime implementation | 2026-09-09 |
| Data lifecycle | Supabase mutations in public route components | Runtime/API integration | 2026-09-09 |
| Deletion / retention | Not documented; current implementation hard-deletes records after confirmation | Product gap | 2026-09-09 |
| Billing / payment | Not applicable | Product scope | 2026-09-09 |
| Legal / regulatory copy | Not documented | Product gap | 2026-09-09 |
| Market / content conventions | `README.md` and existing public route copy | Product brief/runtime | 2026-09-09 |

## Visual contract

- Project `DESIGN.md`: `DESIGN.md`.
- Token ownership model: existing runtime canonical.
- Runtime design-system/token source: CSS custom properties and Tailwind theme mapping in `app/globals.css`.
- Mapping/export/adapters: Tailwind utilities such as `bg-background`, `bg-bg-alt`, `text-main`, and `text-accent`.
- Token drift gate: `DESIGN.md` lint plus review of any `app/globals.css` token change.
- Supported themes: light and dark; dark is the first-visit default.
- Design-context owner/review policy: repository owner reviews intentional identity changes.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Browser-native `select` | Review form | native | keyboard + mobile browser |
| Form | Route-owned controlled React forms | Review, backlog, collection, and login flows | create / edit | lint + build + browser |
| Scrollbar | Global CSS | `app/globals.css` | page / internal dialog | computed style |
| Toast | `FeedbackMessage` | `app/components/ui/FeedbackMessage.tsx` | error / info | live-region check |
| Dialog | `DialogShell` | `app/components/ui/DialogShell.tsx` | form / confirm | keyboard + focus check |
| CRUD | Route state and Supabase calls | Public route components | create / edit / delete | full-flow with configured Supabase |

## Component behavior

| Component | Default | Hover | Focus | Active | Disabled | Busy | Error |
|---|---|---|---|---|---|---|---|
| Button | readable label, 44px mobile target | accent/surface change | visible accent ring | subtle scale/colour | stable size, reduced opacity | stable label, state text | feedback live region |
| Icon button | accessible name | accent change | visible accent ring | subtle scale | reduced opacity | n/a | n/a |
| Input | visible label | border stable | accent ring | n/a | reduced opacity | preserved value | message near workflow |
| Secret input | masked | border stable | accent ring | n/a | reduced opacity | submit owns pending | inline form error |
| Search | immediate local filter + explicit clear | surface change | accent ring | n/a | n/a | n/a | no-results state |
| Textarea | `resize-none` with an adequate fixed starting height | border stable | accent ring | n/a | reduced opacity | preserved value | workflow message |
| Table/list | responsive grid/list | media emphasis | card/button ring | selected ring | n/a | skeleton/empty | retry context |

## Dataset navigation

- Admin tables: not present.
- Exploratory lists: reviews, backlog, collections, and collection detail use progressive grids.
- URL state: filters remain transient client state in the current architecture.
- Page size: no pagination; full small personal dataset.
- Empty/no-results/error/loading treatment: explicit centred state inside the page shell; loading keeps navigation visible.
- Back/scroll restoration: Next.js route defaults; collection detail exposes a semantic back button.
- Selection scope: one game at a time; closing the panel restores access to the grid.

## Flow ledger

| Operation | Trigger | Pending | Success destination | Success feedback | Failure recovery | Focus outcome | Source ref |
|---|---|---|---|---|---|---|---|
| Create/edit game | Admin form submit | submit disabled, content preserved | same list, dialog closes | updated card | dialog remains, error message | dialog on error / trigger on close | Route component |
| Create/edit collection | Admin form submit | submit disabled, selection preserved | collections list | updated card | dialog remains, error message | dialog on error / trigger on close | `app/collections/page.tsx` |
| Delete | Admin detail/card action | confirm dialog, then request | same list | item removed | item remains, error message | prior context / close control | Route component |
| Search/filter | Text or filter action | immediate local update | same route | matching grid | no-results with reset | originating control | Reviews route |
| Cancel/back | Close or back control | none | previous context | none | none | invoking control where possible | Dialog/header components |

## Navigation and responsive behavior

- Route document title policy: root metadata currently provides `Game Vault`; route-specific titles are a future content task.
- Route error / 403 page behavior: Supabase fetch errors stay within the current route; unauthorised admin controls are hidden.
- Breadcrumb/tab/route-state policy: no breadcrumbs or tabs; collection detail has a back action.
- Sidebar/drawer/bottom-sheet transformation: game details are sticky at desktop widths and a full-height sheet below 1024px.
- Responsive table strategy: not applicable; card lists use progressive grids.
- Truncation/full-value access: titles wrap; collection excerpts clamp only on index cards and open in full on detail routes.
- Focus restoration and sticky-obstruction policy: mobile disclosures and dialogs restore trigger focus; anchored content reserves fixed-header space.

## Overlays and feedback

- Dialog primitive: app-owned `DialogShell` with labelled dialog semantics, Escape, focus trap/restoration, and scroll lock.
- Destructive confirmation levels: one explicit confirmation for hard delete; destructive button is visually separated.
- Feedback placement/duration/deduplication: one dismissible top-right live-region message per route; no automatic disappearance.
- Alert/banner scope and persistence: workflow-local until dismissed or superseded.
- Tooltip delay/dismissal: native `title` is supplemental only; icon actions have accessible labels.
- Unsaved-changes behavior: close discards current edits; no draft persistence is implemented.
- Layer/z-index contract: feedback (120) > dialog (100) > mobile detail sheet (70) > header/add action (50).

## Async and resilience

- Mutation default: pessimistic; UI updates after Supabase success.
- Idempotency and duplicate-submit policy: submit is disabled while saving.
- Auto-save/draft recovery: not implemented.
- Offline/read-stale/write behavior: Supabase errors are surfaced without deleting local form input.
- Retry/backoff/timeout behavior: user retries explicitly; no automated retry.
- Version conflict and multi-tab behavior: not implemented.
- Session expiry/re-authentication: admin actions disappear after authentication state is rechecked on navigation/reload.
- Long-running progress and return path: button copy communicates save progress.
- Stale-request cancellation/invalidation and pending-state ownership: route component owns requests and local state.
- Dialog/form preservation and retry after mutation failure: dialog remains open and values are preserved.

## Validation

- Schema/validation layer: native required/type/min/step constraints plus Supabase server errors.
- Trigger timing: native validation on submit; service errors after response.
- Error summary/inline policy: one workflow-level `role=alert` message; fields keep values for correction.
- Server error mapping: Supabase message is surfaced as plain text.
- Sensitive-value handling: passwords remain in controlled secret inputs and are cleared after logout.
- Native browser validation stays enabled; pending submit prevention is mandatory.

## Permission and clipboard

- Permission UI strategy: admin-only create/edit/delete actions are hidden for non-admin visitors.
- Clipboard copy policy: no clipboard actions exist.
- Disabled-state explanation: pending submit retains a clear busy label.

## Verification

- Required static commands: `npm run lint`, `npx tsc --noEmit`, `npm run build`, design-context lint, project UI audit.
- Browser/device/locale/theme matrix: 320x700, 390x844, 768x1024, 1024x768, 1440x900; light and dark; Ukrainian content and long game titles.
- Accessibility checks: keyboard navigation, Escape, focus restoration, visible focus, dialog labels, 44px targets, reduced motion, 200% zoom reflow.
- Native-language/domain review and target-user evidence: repository owner reviews Ukrainian copy and gaming terminology.
- Component-state/visual regression coverage: header open/closed/scrolled; empty/loading; selected details; filters; all modal forms; admin login.
- Canonical sibling flow used for comparison: review and backlog browse/detail/edit flows.
- Project audit command/result: run the frontend-design-premium audit script with `--no-write` before handoff.
- CRUD full-flow evidence: requires configured Supabase credentials and an admin account.
- Failure-path evidence: verify fetch/save errors keep navigation and form recovery available.
