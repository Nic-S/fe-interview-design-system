import { use } from "react";
import { composeEventHandlers } from "../../utils/composeEventHandlers";
import { cx } from "../../utils/cx";
import { Badge } from "../Badge";
import { TabListContext, useTabsContext } from "./internal/TabsContext";
import styles from "./Tab.module.scss";
import type { TabProps } from "./Tabs.types";

/**
 * A tab: a native button with `role="tab"`. Clicking it selects its value.
 * Only the selected tab is in the Tab sequence (roving tabindex); TabList
 * moves the focus between tabs with the arrow keys.
 *
 * Place it inside `<TabList>`; the `<TabPanel>` with the same `value` shows its content.
 */
export function Tab({ value, badgeProps, className, children, onClick, ref, ...rest }: TabProps) {
  const { value: selectedValue, setValue, baseId, getIds, variant } = useTabsContext("Tab");
  // Structural, like using a Tab outside Tabs: without a tablist the tab is
  // not accessible (no parent role, no keyboard navigation, no list name).
  if (!use(TabListContext)) {
    throw new Error("<Tab> must be used within <TabList>.");
  }
  const isSelected = value === selectedValue;
  const { tabId, panelId } = getIds(value);

  return (
    <button
      ref={ref}
      {...rest}
      type="button"
      role="tab"
      id={tabId}
      aria-controls={panelId}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      className={cx("ds-Tab", className)}
      data-variant={variant}
      data-selected={isSelected ? "" : undefined}
      data-value={value}
      data-tabs-id={baseId}
      onClick={composeEventHandlers(onClick, () => setValue(value))}
    >
      {children}
      {badgeProps && (
        <>
          {/* Accessible name "Files, Warning": the comma is read aloud only (a pause
              for screen readers), the space keeps label and badge as two words. */}
          <span className={styles.visuallyHidden}>,</span> <Badge {...badgeProps} />
        </>
      )}
    </button>
  );
}
