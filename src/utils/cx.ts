export type ClassValue = string | false | null | undefined;

/**
 * Joins class names, skipping falsy values.
 * Used to merge a component's CSS Module class with the consumer's `className`
 * (and conditional classes) without pulling in a dependency like `clsx`.
 *
 * @example cx(styles.tab, isSelected && styles.selected, className)
 */
export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
