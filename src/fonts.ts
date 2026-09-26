// Optional entry: loads Inter, the design system's typeface, self-hosted.
// Apps opt in with a single import (e.g. `import "<design-system>/fonts"`).
// Apps that already load Inter in another way skip it.
//
// `@fontsource-variable/inter` is an optional peer dependency: the design
// system declares the font it is designed for, but never installs or bundles
// it unless the app asks for it.
import "@fontsource-variable/inter";
