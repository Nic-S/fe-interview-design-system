# Design System — Tabs

An accessible, reusable **Tabs** component with **Badge**, built as part of a small design system for the [home test](https://github.com/primait/fe-interview-design-system/blob/master/src/Introduction.mdx): React 19, SCSS Modules written from scratch, design tokens as CSS custom properties, no CSS framework and no headless library.

- **Documentation:** Storybook (`pnpm storybook`): foundations, component guidelines, anatomy, tokens, keyboard and accessibility notes, interactive stories.
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

## Getting started

Requirements: Node 24 (`.nvmrc`) and pnpm 11, through Corepack (`packageManager` in `package.json`).

| Command | What it does |
|---|---|
| `pnpm install` | Installs the dependencies |
| `pnpm storybook` | Storybook on port 6006 |
| `pnpm dev` | The demo page |
| `pnpm test` | All the tests |
| `pnpm test:unit` | The tests in jsdom |
| `pnpm test:browser` | The tests in Chrome (uses the Chrome installed on the machine) |
| `pnpm tsc` | Type-check |
| `pnpm check` / `pnpm check:fix` | Lint and format check with Biome / with fixes |
| `pnpm build-storybook` | Static build of Storybook |

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
│   │       ├── *.test.tsx      # tests in jsdom, one file per part
│   │       ├── Tabs.browser.test.tsx  # tests in Chrome
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

## Public API

| | Public | Internal |
|---|---|---|
| Components and types | `Tabs`, `TabList`, `Tab`, `TabPanel`, `Badge`, `BADGE_VARIANTS`, their `*Props` types, `TabsVariant`, `BadgeVariant` | hooks, utilities, `components/Tabs/internal/` |
| Styling hooks | the `ds-*` classes, `data-variant`, `data-selected` | the hashed module classes |
| Tokens | `--ds-*` | component tokens (`--tab-*`, `--tab-list-*`, `--badge-*`) |

How to customize them is described in the Tabs page of Storybook.

## Testing

- **jsdom** (Vitest, Testing Library): behavior, keyboard, ARIA, accessibility with axe, public types and API.
- **Chrome** (Vitest browser mode with Playwright): what jsdom can't see, such as computed styles, layout and real pointer and keyboard events, plus axe with the real CSS.
- Tests query by role and accessible name, as a user would.

## Quality

- **CI** on GitHub Actions, on every push to `main` and on pull requests: Biome, type-check, tests, Storybook build.
- **Git hooks:** Biome and the type-check before each commit, the tests before each push.
- **Dependabot**, weekly: npm packages and GitHub Actions.

## Base repository

- **Fixes**, each reproduced first and then fixed in its own commit: `react-dom` aligned with `react` 19.3.0 (it broke the app and the tests), the missing Storybook `addon-links` removed, Vitest types instead of `@types/jest`, unused `@typescript-eslint` packages removed, `@vitejs/plugin-react` instead of the SWC plugin.
- **Storybook's Vitest addon** doesn't support Vitest 5, the version of the base repository, yet: instead of running the stories as tests through the addon, the browser tests use Vitest browser mode directly.

## Clean verification checklist

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm tsc
pnpm test
pnpm build-storybook
```
