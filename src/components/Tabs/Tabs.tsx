import { useId, useMemo } from "react";
import { useControllableState } from "../../hooks/useControllableState";
import { cx } from "../../utils/cx";
import { TabsContext } from "./internal/TabsContext";
import type { TabsProps } from "./Tabs.types";

/**
 * Root of the tabs: owns the selected value (controlled or uncontrolled)
 * and shares it with `TabList`, `Tab` and `TabPanel` through context.
 *
 * @example
 * <Tabs defaultValue="emails">
 *   <TabList aria-label="Inbox">
 *     <Tab value="emails">Emails</Tab>
 *     <Tab value="files" badgeProps={{ label: "Warning", variant: "negative" }}>Files</Tab>
 *   </TabList>
 *   <TabPanel value="emails">…</TabPanel>
 *   <TabPanel value="files">…</TabPanel>
 * </Tabs>
 */
export function Tabs({
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = "pill",
  className,
  children,
  ref,
  ...rest
}: TabsProps) {
  const [value, setValue] = useControllableState({
    value: controlledValue,
    defaultValue,
    onChange: onValueChange,
  });
  const baseId = useId();
  const contextValue = useMemo(
    () => ({
      value,
      setValue,
      baseId,
      getIds: (tabValue: string) => {
        // Escapes spaces (and other unusual characters): ARIA id references are
        // space-separated lists, so "my files" would be read as two ids.
        const idPart = encodeURIComponent(tabValue);
        return { tabId: `${baseId}-tab-${idPart}`, panelId: `${baseId}-panel-${idPart}` };
      },
      variant,
    }),
    [value, setValue, baseId, variant],
  );

  return (
    <TabsContext value={contextValue}>
      <div ref={ref} {...rest} className={cx("ds-Tabs", className)} data-variant={variant}>
        {children}
      </div>
    </TabsContext>
  );
}
