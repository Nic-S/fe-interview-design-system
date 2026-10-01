# Changelog

All notable changes to this design system. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versions follow [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-01

### Added

* **Tabs** (`Tabs`, `TabList`, `Tab`, `TabPanel`): compound components for the WAI-ARIA Tabs pattern.
  * Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`), checked by the types; in development, a switch between the two is reported.
  * Variants `pill` (default) and `underline`, with every state of the Figma file (hover, active, selected, focus) and mobile sizes up to 768px.
  * Keyboard: ←/→ with wrap-around, Home/End, automatic activation, roving tabindex. Keys pressed with a modifier are left to the browser.
  * `badgeProps` on `Tab`: a Badge after the label, included in the tab's accessible name ("Files, Warning").
  * `keepMounted` on `TabPanel`: keeps the content and its state while hidden. Hidden panels stay hidden even when a class sets their `display`.
  * A tab list that scrolls horizontally when the tabs don't fit, keeping the selected tab in view without scrolling the page. Tabs shrink inside grid and flex layouts.
  * The selected tab stays recognizable in high contrast (forced colors), with the system colors.
  * Native props, `ref` and `className` passed through on every part (except `disabled` on `Tab`: the design has no disabled state).
  * Development checks: a tablist without a name, duplicate values, a value that matches no tab.
* **Badge**: variants `neutral`, `positive` and `negative`, with mobile sizes and an outline in high contrast. `BADGE_VARIANTS` lists them.
* **Design tokens** as CSS custom properties (`--ds-*`): colors named as the Figma variables, spacing scale, typography, focus ring.
* **Styling API**: a stable `ds-*` class per part, `data-variant` and `data-selected` attributes, and a documented specificity contract.
* **Fonts entry** (`src/fonts.ts`): optional, loads Inter from the app itself.
* **Documentation** in Storybook, published on GitHub Pages for each release: introduction, foundations generated from the tokens (colors with contrast ratios, typography, spacing), component pages with design and tech guidelines, and stories for variants, badges, overflow, mobile, nested Tabs and kept panels.
* **Demo page** (`pnpm dev`) with the example of the Figma file.
* **Quality**: tests in jsdom (Vitest, Testing Library, axe, type tests, snapshots of the public API and of the token names) and in Chrome (Vitest browser mode with Playwright: styles, layout, real pointer and keyboard events, axe with the real CSS); Biome, git hooks, CI on GitHub Actions and Dependabot.

### Fixed

* Problems of the base repository: `react-dom` aligned with `react` 19.3.0, the missing Storybook `addon-links` removed, Vitest types instead of `@types/jest`, unused `@typescript-eslint` packages removed, `@vitejs/plugin-react` instead of the SWC plugin.

[1.0.0]: https://github.com/Nic-S/fe-interview-design-system/releases/tag/v1.0.0
