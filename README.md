# Design System — Tabs

An accessible, reusable **Tabs** component with **Badge**, built as part of a small design system for the [home test](https://github.com/primait/fe-interview-design-system/blob/master/src/Introduction.mdx): React 19, SCSS Modules written from scratch, design tokens as CSS custom properties, no CSS framework and no headless library.

- **Documentation:** Storybook (`pnpm storybook`), with foundations, components, guidelines and interactive stories.
- **Design:** [Figma file](https://www.figma.com/design/OclakAGLSXDoMKLFvwLNMP/?node-id=47-678).
- **Demo page:** `pnpm dev` shows the example of the Figma file.

## Acceptance criteria

| As a developer, I want to… | How |
|---|---|
| switch between the variants of the `Tabs`, according to the design | `variant="pill" \| "underline"` on `Tabs` (Storybook: Tabs › Variants) |
| add a `Badge` to a `Tab` using the Tab's API | `badgeProps` on `Tab` (Tabs › With Badges) |
| choose between different `Badge` variants | `badgeProps.variant`: `neutral`, `positive`, `negative` (Badge) |

```tsx
import { Tab, TabList, TabPanel, Tabs } from "<design-system>";

<Tabs defaultValue="emails" variant="underline">
  <TabList aria-label="Inbox">
    <Tab value="emails">Emails</Tab>
    <Tab value="files" badgeProps={{ label: "Warning", variant: "negative" }}>
      Files
    </Tab>
  </TabList>
  <TabPanel value="emails">…</TabPanel>
  <TabPanel value="files">…</TabPanel>
</Tabs>
```

`<design-system>` stands for the package name: the design system is not published as a package. In this repository the public entry is `src/index.ts`.

## Requirements

- Node 24 (`.nvmrc`; `engines` in `package.json`)
- pnpm 11, through Corepack (`packageManager` in `package.json`)

## Commands

| Command | What it does |
|---|---|
| `pnpm install` | Installs the dependencies |
| `pnpm storybook` | Storybook on port 6006 |
| `pnpm dev` | The demo page |
| `pnpm test` | All the tests (Vitest) |
| `pnpm tsc` | Type-check |
| `pnpm check` / `pnpm check:fix` | Lint and format check with Biome / with fixes |
| `pnpm build-storybook` | Static build of Storybook |

Git hooks (husky): Biome on the staged files and the type-check before each commit, the tests before each push.

## Repository layout

```text
.
├── src/
│   ├── index.ts                # public API: anything not exported here is internal
│   ├── fonts.ts                # optional entry: loads the Inter font
│   ├── components/
│   │   ├── Badge/              # component, types, styles, tests, stories, docs
│   │   └── Tabs/
│   │       ├── Tabs.tsx, TabList.tsx, Tab.tsx, TabPanel.tsx
│   │       ├── Tabs.types.ts   # public types
│   │       ├── *.module.scss   # one style module per part
│   │       ├── *.test.tsx      # one test file per part
│   │       ├── Tabs.stories.tsx, Tabs.mdx
│   │       └── internal/       # context, DOM helpers, dev checks, scroll into view
│   ├── hooks/                  # useControllableState, useMergedRefs
│   ├── utils/                  # cx, mergeRefs, composeEventHandlers
│   ├── styles/                 # tokens.scss (design tokens), _mixins.scss
│   └── main.tsx, main.css      # demo page
├── docs/                       # Storybook pages: Introduction, Foundations
├── .storybook/                 # Storybook configuration
└── .github/                    # CI workflow, Dependabot
```

## Decisions

### API

- **Compound components** (`Tabs`, `TabList`, `Tab`, `TabPanel`), exported separately (no `Tabs.Tab` namespace): one way to use them, no static properties (which React Server Components can't read), simple types. Headless UI v2 made the same move.
- **Controlled or uncontrolled:** `value` + `onValueChange`, or `defaultValue`. A discriminated union makes TypeScript reject a mix of the two.
- **`badgeProps`** is a typed object, not a React node: the Tab renders the Badge, so it always looks as designed.
- **`variant`** is set once on `Tabs` and reaches every part through context, rendered as `data-variant`. With a descendant selector from the root, a Tabs nested in another's panel took the styles of the outer one (verified in the browser).
- **Native props pass through** on every part, with `ref` (React 19: a regular prop) and `className` merged. Event handlers are composed with ours: `event.preventDefault()` in the consumer's handler skips the built-in behavior.
- **Errors:** a part used outside its parent throws (structural, always visible in development). Mistakes that can come from data (duplicate values, a value that matches no tab, a tablist without a name) are reported with `console.error` in development and don't break the page.

### Accessibility

- **The [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):** roles and `aria-*` attributes, roving tabindex, **automatic activation**. ←/→ move to the previous/next tab and wrap around, Home/End go to the first/last one.
- **Native `<button>`** for each tab: focusable and clickable without extra code.
- **The badge is part of the tab's accessible name:** "Files, Warning" (WCAG 2.5.3, Label in Name). A visually hidden comma adds a pause for screen readers. Without it, the name depended on the browser and the CSS: jsdom computed "FilesWarning", Chrome "Files Warning" (the AccName spec leaves spacing between inline elements open).
- **Panels** are focusable by default (`tabIndex={0}`, overridable when the panel starts with a focusable element). A hidden panel keeps its element (so `aria-controls` always points to it) and gets `display: none` inline too, so a `display` set by the consumer's CSS never shows it. `keepMounted` keeps the content, and its state, mounted while hidden.
- **Focus ring** only for keyboard users (`:focus-visible`), 2px with a 2px offset as in Figma. The scrolling tab list leaves room for it, so it's never clipped.
- **Contrast** (from the Figma colors):

  | Pair | Ratio | WCAG |
  |---|---|---|
  | White text on the selected pill (default / hover / active) | 15.99 / 11.28 / 6.52 | AA |
  | Text `#1B2134` on white, surface hover, surface active | 15.99 / 14.83 / 14.21 | AA |
  | Text on the positive / negative / neutral badge | 13.70 / 10.15 / 14.21 | AA |
  | Line of the selected underline tab, focus ring | 15.99 | ≥ 3:1 (non-text) |
  | Border of an unselected pill | 1.49 | below 3:1, see below |

  The unselected pill border is not a WCAG 1.4.11 failure: the tab is identified by its label, and the selected state uses high-contrast cues (dark background, 3px line).

### Styling

- **SCSS Modules**, compiled to static CSS: no runtime. Sass only where it adds something: mixins for the breakpoint, the focus ring, hover and text styles.
- **Design tokens as CSS custom properties**, named as the Figma variables (`--ds-color-inverse`, `--ds-space-xs`…). Component tokens (`--tab-*`, `--badge-*`) are private and change only the values that differ by breakpoint, variant or state.
- **A small public styling API:** one stable class per part (`ds-Tabs`, `ds-TabList`, `ds-Tab`, `ds-TabPanel`, `ds-Badge`) and state attributes (`data-variant`, `data-selected`). The hashed module classes are private.
- **Specificity contract:** internal selectors use one class plus at most two states, with the variant inside `:where()`, so the maximum is (0,3,0). To override a state, use your class, the `ds-*` class and the same states.
- **Customization levels:** theme tokens on any wrapper, `className` for layout, `ds-*` classes with `data-*` for targeted overrides.
- **Responsive**, desktop-first at 768px as in Figma: on mobile only the token values change. Font sizes in `rem` and `min-height` instead of `height`, so the tabs follow the user's text size (WCAG 1.4.4).
- **Overflow:** the tab list is one row that scrolls horizontally (hidden scrollbar, as in the design) and keeps the selected tab in view, scrolling the list only, never the page. It never wraps, which would confuse the reading order and the arrow keys. The root has `min-width: 0`, so in a grid or flex layout the list scrolls instead of widening the page.
- **Font:** the tokens name Inter. Loading it is up to the app: the optional `fonts` entry serves it from the app itself (`@fontsource-variable/inter`, an optional peer dependency), and apps that already load Inter, or another font, skip it.

## Testing

| Level | Tools | Status |
|---|---|---|
| 1. Behavior | Vitest, Testing Library, user-event, jsdom | 90 tests in 13 files |
| 2. Accessibility | axe-core in the tests; Storybook a11y addon; Biome a11y rules; queries by role and name | automated |
| 3. Real browser | layout, computed styles, real pointer and keyboard events | planned, see Known limitations |
| 4. Visual regression | screenshots of the stories | planned |

- Tests query by role and accessible name, as a user would, and each behavior is tested once, in the file of the part responsible for it. No snapshot tests of the markup.
- Type tests (`expectTypeOf`, `@ts-expect-error`) check the public types, and an inline snapshot of `src/index.ts` exports catches accidental changes to the public API.
- jsdom has no layout. Two bugs of this work were visible only in a browser: a doubled gap between label and badge, and the accessible name computed differently by Chrome. That's why level 3 matters.
- Automated tools find at most about half of the accessibility issues: a manual check with a screen reader completes them. The keyboard navigation was checked by hand in the browser; the screen reader check is still to do (see Known limitations).

## Problems found in the base repository

Each one was reproduced first, then fixed in its own commit:

| Problem | Effect | Fix |
|---|---|---|
| `react` 19.3.0 with `react-dom` 19.2.8 | "Incompatible React versions" at runtime: `pnpm dev` and the tests broke | Aligned `react-dom`. Dependabot now bumps the React packages together |
| `@storybook/addon-links` configured but not installed | Warning in every Storybook build | Removed (unused) |
| `@types/jest` in a Vitest project | `vi` unknown to TypeScript | Vitest types (`vitest/globals`, `@testing-library/jest-dom/vitest`) |
| `@typescript-eslint` packages, but the repo uses Biome | Unused dependencies | Removed |
| `@vitejs/plugin-react-swc` without SWC plugins | Vitest recommends the standard plugin | Switched to `@vitejs/plugin-react` |

## Known limitations

- **Browser-level tests are not automated yet.** The Storybook Vitest addon doesn't support Vitest 5, the version of the base repository, yet (storybookjs/storybook#36082). The options: Vitest browser mode with Playwright directly, reusing the stories, or Vitest 4 with the addon.
- **No manual screen reader check yet:** the announcements (tab name with the badge, position, selected state, panel label) are covered by the automated tests, not yet verified with VoiceOver or NVDA.
- **Full-width layouts:** when the tabs touch the edges of the page, the room reserved for the focus ring makes the list overflow the page by 4px.
- **A wrapper between a grid or flex layout and the Tabs** needs `min-width: 0` too, otherwise the row of tabs widens the layout.
- **Left-to-right only:** arrow keys and scrolling don't handle right-to-left languages yet.
- **Not published as a package:** no library build, no versioned releases on npm.

## Possible extensions

Disabled tabs, vertical orientation, manual activation, an icon in the tab (already in the Figma component), prev/next scroll buttons, a headless `useTabs` hook, a library build with Changesets.

## Clean verification checklist

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm tsc
pnpm test
pnpm build-storybook
```
