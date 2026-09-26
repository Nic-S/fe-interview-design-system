import type { Preview } from "@storybook/react-vite";

// Storybook consumes the design system like an app would: the optional font
// entry (self-hosted Inter, no third-party requests) and the design tokens.
import "../src/fonts";
import "../src/styles/tokens.scss";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
