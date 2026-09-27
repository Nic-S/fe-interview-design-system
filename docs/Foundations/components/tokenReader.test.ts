import { compile } from "sass";
import { readTokens, resolveTokenValue, toFigmaName } from "./tokenReader";

// Loads the real tokens.scss, as Storybook does, so the tests prove that the
// Foundations pages find the design system's actual tokens.
beforeAll(() => {
  const style = document.createElement("style");
  style.textContent = compile("src/styles/tokens.scss").css;
  document.head.append(style);
});

describe("readTokens", () => {
  it("reads the color tokens in declaration order", () => {
    const colors = readTokens("--ds-color-");

    expect(colors).toHaveLength(12);
    expect(colors[0]).toEqual({ name: "--ds-color-inverse", value: "#1b2134" });
    expect(colors.map((token) => token.name)).toContain("--ds-color-surface-negative");
  });

  it("reads the spacing scale", () => {
    expect(readTokens("--ds-space-").map((token) => token.value)).toEqual([
      "0",
      "2px",
      "4px",
      "8px",
      "12px",
      "16px",
      "20px",
      "24px",
      "32px",
      "48px",
    ]);
  });

  it("returns nothing for an unknown prefix", () => {
    expect(readTokens("--unknown-")).toEqual([]);
  });
});

describe("resolveTokenValue", () => {
  it("resolves references to other tokens", () => {
    const tokens = readTokens("--ds-");

    expect(resolveTokenValue("var(--ds-focus-ring-color)", tokens)).toBe("#1b2134");
  });

  it("leaves unknown references and plain values untouched", () => {
    expect(resolveTokenValue("var(--missing)", [])).toBe("var(--missing)");
    expect(resolveTokenValue("12px", [])).toBe("12px");
  });
});

describe("toFigmaName", () => {
  it.each([
    ["--ds-color-surface-hover", "--ds-color-", "SurfaceHover"],
    ["--ds-color-on-inverse", "--ds-color-", "OnInverse"],
    ["--ds-space-2xs", "--ds-space-", "2XS"],
    ["--ds-space-s", "--ds-space-", "S"],
    ["--ds-space-0", "--ds-space-", "0"],
  ])("%s → %s", (name, prefix, expected) => {
    expect(toFigmaName(name, prefix)).toBe(expected);
  });
});
