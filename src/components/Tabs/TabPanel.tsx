import { cx } from "../../utils/cx";
import type { TabPanelProps } from "./Tabs.types";
import { useTabsContext } from "./TabsContext";

/**
 * Content of a tab. The panel element is always rendered (so the tab's
 * `aria-controls` always points to it) and hidden when its tab is not
 * selected; the content is mounted only while selected, unless `keepMounted`.
 *
 * It is focusable by default (`tabIndex={0}`) so keyboard users can reach
 * content without focusable elements; pass `tabIndex={-1}` when the panel
 * starts with a focusable element, to avoid an extra Tab stop.
 */
export function TabPanel({
  value,
  keepMounted = false,
  className,
  children,
  ref,
  ...rest
}: TabPanelProps) {
  const { value: selectedValue, getIds } = useTabsContext("TabPanel");
  const isSelected = value === selectedValue;
  const { tabId, panelId } = getIds(value);

  return (
    <div
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the APG recommends a focusable tabpanel (jsx-a11y's recommended config allows it too)
      tabIndex={0}
      ref={ref}
      {...rest}
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      hidden={!isSelected}
      className={cx("ds-TabPanel", className)}
      data-selected={isSelected ? "" : undefined}
    >
      {(isSelected || keepMounted) && children}
    </div>
  );
}
