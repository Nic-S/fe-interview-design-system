import type { ComponentProps } from "react";

/**
 * Badge variants. Written as an explicit union (not derived from
 * BADGE_VARIANTS) so Storybook's docgen can read it and generate the
 * controls and the props table automatically.
 */
export type BadgeVariant = "neutral" | "positive" | "negative";

/**
 * Every BadgeVariant, for iterating (stories, tests, consumers). A type test
 * in Badge.test.tsx fails the type-check if it drifts from BadgeVariant.
 */
export const BADGE_VARIANTS = ["neutral", "positive", "negative"] as const;

export interface BadgeProps extends Omit<ComponentProps<"span">, "children"> {
  /**
   * Text of the badge. Plain text on purpose: inside a Tab it becomes part of
   * the tab's accessible name, and it must carry the meaning on its own
   * (the variant color alone is not enough, WCAG 1.4.1).
   */
  label: string;
  /**
   * Visual variant.
   * @defaultValue "neutral"
   */
  variant?: BadgeVariant;
}
