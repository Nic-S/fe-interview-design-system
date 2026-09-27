import type { ComponentProps } from "react";

/** Visual variant of the tabs, as in Figma. */
export type TabsVariant = "pill" | "underline";

interface TabsBaseProps extends Omit<ComponentProps<"div">, "defaultValue" | "onChange"> {
  /**
   * Visual variant, shared by all the tabs.
   * @defaultValue "pill"
   */
  variant?: TabsVariant;
}

interface TabsControlledProps {
  /** Value of the selected tab: the parent owns the state. */
  value: string;
  /** Called when the user selects another tab; the parent must update `value`. */
  onValueChange: (value: string) => void;
  defaultValue?: never;
}

interface TabsUncontrolledProps {
  /** Value of the tab selected at first: Tabs owns the state. */
  defaultValue: string;
  /** Called when the user selects another tab. */
  onValueChange?: (value: string) => void;
  value?: never;
}

/**
 * Either controlled (`value` + `onValueChange`) or uncontrolled
 * (`defaultValue`): one of the two is required, never both.
 */
export type TabsProps = TabsBaseProps & (TabsControlledProps | TabsUncontrolledProps);
