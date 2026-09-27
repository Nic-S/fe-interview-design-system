import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { BADGE_VARIANTS } from "./Badge.types";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: {
    label: "Warning",
    variant: "negative",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** All variants, generated from `BADGE_VARIANTS`. */
export const Variants: Story = {
  parameters: { controls: { exclude: ["variant"] } },
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--ds-space-xs)" }}>
      {BADGE_VARIANTS.map((variant) => (
        <Badge key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

/** At viewport widths up to 768px the badge uses smaller padding and radius. */
export const Mobile: Story = {
  ...Variants,
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
