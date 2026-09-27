import { contrastRatio, relativeLuminance } from "./contrast";

describe("contrast", () => {
  it("computes the relative luminance of black and white", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBe(1);
  });

  it("computes WCAG contrast ratios", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBe(21);
    expect(contrastRatio("#1b2134", "#ffffff")).toBeCloseTo(15.99, 2);
    expect(contrastRatio("#d3d3dc", "#ffffff")).toBeCloseTo(1.49, 2);
  });

  it("does not depend on the order of the colors", () => {
    expect(contrastRatio("#ffffff", "#585d71")).toBe(contrastRatio("#585d71", "#ffffff"));
  });
});
