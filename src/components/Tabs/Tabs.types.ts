import type { ComponentProps } from "react";
import type { BadgeProps } from "../Badge";

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

export interface TabProps extends Omit<ComponentProps<"button">, "value" | "type"> {
  /**
   * Unique value of the tab. It selects the tab and links it to the TabPanel
   * with the same value.
   */
  value: string;
  /** Adds a Badge after the label. Same props as `Badge`. */
  badgeProps?: BadgeProps;
}

export interface TabPanelProps extends ComponentProps<"div"> {
  /** Value of the Tab this panel belongs to. */
  value: string;
  /**
   * Keeps the content mounted (and hidden) while the tab is not selected,
   * preserving its state (form input, scroll, loaded data).
   * @defaultValue false
   */
  keepMounted?: boolean;
}
