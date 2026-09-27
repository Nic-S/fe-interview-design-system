import { cx } from "../../utils/cx";
import styles from "./Badge.module.scss";
import type { BadgeProps } from "./Badge.types";

/**
 * Short label that adds context to another element, e.g. a Tab.
 * Native `<span>` props (including `ref` and `className`) are passed through.
 */
export function Badge({ label, variant = "neutral", className, ...rest }: BadgeProps) {
  return (
    <span {...rest} className={cx(styles.badge, "ds-Badge", className)} data-variant={variant}>
      {label}
    </span>
  );
}
