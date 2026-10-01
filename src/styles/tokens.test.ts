import { compile } from "sass";

// Guards the public design tokens, like index.test.ts guards the exports: apps
// theme the design system by redefining them, so removing or renaming one is
// a breaking change and must be a conscious one (update this snapshot and the
// changelog). Values can change freely; component tokens (--tab-*, --badge-*)
// are private and not listed here.
describe("design tokens", () => {
  it("declares only the intended public tokens", () => {
    // The compiled CSS, as apps get it.
    const { css } = compile("src/styles/tokens.scss");
    const declared = [...css.matchAll(/(--ds-[\w-]+)\s*:/g)].map(([, name]) => name);

    expect(declared.sort()).toMatchInlineSnapshot(`
      [
        "--ds-color-inverse",
        "--ds-color-inverse-active",
        "--ds-color-inverse-hover",
        "--ds-color-on-inverse",
        "--ds-color-on-neutral",
        "--ds-color-outline",
        "--ds-color-outline-hover",
        "--ds-color-surface-active",
        "--ds-color-surface-high",
        "--ds-color-surface-hover",
        "--ds-color-surface-negative",
        "--ds-color-surface-positive",
        "--ds-focus-ring-color",
        "--ds-focus-ring-offset",
        "--ds-focus-ring-width",
        "--ds-font-family-base",
        "--ds-font-size-body-m",
        "--ds-font-size-body-s",
        "--ds-font-weight-bold",
        "--ds-line-height-body",
        "--ds-space-0",
        "--ds-space-2xl",
        "--ds-space-2xs",
        "--ds-space-3xs",
        "--ds-space-4xs",
        "--ds-space-l",
        "--ds-space-m",
        "--ds-space-s",
        "--ds-space-xl",
        "--ds-space-xs",
      ]
    `);
  });
});
