import * as publicApi from "./index";

// Guards the public API: removing or renaming an export is a breaking change
// and must be a conscious one (update this snapshot and the changelog).
// Type-only exports (e.g. prop types) don't exist at runtime, so they are
// guarded by the explicit export list in index.ts and by the type-check.
describe("public API", () => {
  it("exports only the intended values", () => {
    expect(Object.keys(publicApi).sort()).toMatchInlineSnapshot(`
      [
        "BADGE_VARIANTS",
        "Badge",
      ]
    `);
  });
});
