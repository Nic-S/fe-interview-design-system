import { cx } from "./cx";

describe("cx", () => {
  it("joins class names with a space", () => {
    expect(cx("tab", "selected")).toBe("tab selected");
  });

  it("skips falsy values", () => {
    expect(cx("tab", false, null, undefined, "", "custom")).toBe("tab custom");
  });

  it("returns an empty string when there is nothing to join", () => {
    expect(cx()).toBe("");
    expect(cx(undefined, false)).toBe("");
  });
});
