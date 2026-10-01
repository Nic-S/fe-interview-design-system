// Extends Vitest's `expect` with jest-dom matchers (e.g. `toBeInTheDocument`)
// and types them for Vitest instead of Jest.
// Learn more: https://github.com/testing-library/jest-dom#with-vitest
import "@testing-library/jest-dom/vitest";

// axe-core tries a canvas in its color checks, but jsdom has none and prints
// "Not implemented: HTMLCanvasElement's getContext()". A missing context is
// what jsdom gives anyway: same results, without the noise in the output.
HTMLCanvasElement.prototype.getContext = () => null;
