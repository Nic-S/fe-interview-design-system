// Public API of the design system: anything not exported here is internal.
// Use explicit named exports (no `export *`), so every addition or removal is
// a deliberate change, caught by the public API snapshot in index.test.ts.

// Design tokens: loaded once, together with the components.
import "./styles/tokens.scss";

export { BADGE_VARIANTS, Badge, type BadgeProps, type BadgeVariant } from "./components/Badge";
