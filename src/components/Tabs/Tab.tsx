import { composeEventHandlers } from "../../utils/composeEventHandlers";
import { cx } from "../../utils/cx";
import { Badge } from "../Badge";
import styles from "./Tab.module.scss";
import type { TabProps } from "./Tabs.types";
import { useTabsContext } from "./TabsContext";

/**
 * A tab: a native button with `role="tab"`. Clicking it selects its value.
 * Only the selected tab is in the Tab sequence (roving tabindex); TabList
 * moves the focus between tabs with the arrow keys.
 */
export function Tab({ value, badgeProps, className, children, onClick, ...rest }: TabProps) {
  const { value: selectedValue, setValue, baseId, getIds } = useTabsContext("Tab");
  const isSelected = value === selectedValue;
  const { tabId, panelId } = getIds(value);

  return (
    <button
      {...rest}
      type="button"
      role="tab"
      id={tabId}
      aria-controls={panelId}
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      className={cx("ds-Tab", className)}
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
