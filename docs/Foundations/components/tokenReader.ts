export interface DesignToken {
  /** CSS custom property name, e.g. `--ds-color-inverse`. */
  name: string;
  /** Value as declared in the stylesheet, e.g. `#1b2134` or `var(--ds-color-inverse)`. */
  value: string;
}

/**
 * Reads the design tokens loaded in the page: the CSS custom properties
 * declared on `:root` whose name starts with `prefix`, in declaration order.
 * Reading the stylesheets (instead of keeping a list of names) makes
 * tokens.scss the single source of truth: a new token shows up in the docs
 * without touching them.
 */
export function readTokens(prefix: string): DesignToken[] {
  const tokens = new Map<string, string>();
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // Cross-origin stylesheets can't be read.
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule) || rule.selectorText !== ":root") {
        continue;
      }
      for (const property of Array.from(rule.style)) {
        if (property.startsWith(prefix)) {
          tokens.set(property, rule.style.getPropertyValue(property).trim());
        }
      }
    }
  }
  return Array.from(tokens, ([name, value]) => ({ name, value }));
}

/**
 * Resolves `var(--token)` references against the given tokens, e.g.
 * `var(--ds-color-inverse)` → `#1b2134`. Done here rather than with
 * `getComputedStyle`, so it behaves the same in the browser and in tests.
 */
export function resolveTokenValue(value: string, tokens: DesignToken[]): string {
  const values = new Map(tokens.map((token) => [token.name, token.value]));
  const resolve = (input: string, depth: number): string =>
    depth > 10
      ? input
      : input.replace(/var\((--[\w-]+)\)/g, (reference, name: string) => {
          const referenced = values.get(name);
          return referenced === undefined ? reference : resolve(referenced, depth + 1);
        });
  return resolve(value, 0);
}

/**
 * Figma-style name of a token: `--ds-color-surface-hover` with prefix
 * `--ds-color-` → `SurfaceHover`; `--ds-space-2xs` with prefix `--ds-space-` → `2XS`.
 */
export function toFigmaName(tokenName: string, prefix: string): string {
  const key = tokenName.slice(prefix.length);
  // T-shirt sizes (xs, 2xl, …) and plain numbers are written in upper case.
  if (/^(\d?x[sl]|[sml]|\d+)$/.test(key)) {
    return key.toUpperCase();
  }
  return key
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
