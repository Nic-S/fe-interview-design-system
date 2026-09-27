import { useId, useMemo } from "react";
import { useControllableState } from "../../hooks/useControllableState";
import { cx } from "../../utils/cx";
import type { TabsProps } from "./Tabs.types";
import { TabsContext } from "./TabsContext";

/**
 * Root of the tabs: owns the selected value (controlled or uncontrolled)
 * and shares it with `TabList`, `Tab` and `TabPanel` through context.
 */
export function Tabs({
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = "pill",
  className,
  children,
  ...rest
}: TabsProps) {
  const [value, setValue] = useControllableState({
    value: controlledValue,
    defaultValue,
    onChange: onValueChange,
  });
  const baseId = useId();
  const context = useMemo(
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
    }),
    [value, setValue, baseId],
  );

  return (
    <TabsContext value={context}>
      <div {...rest} className={cx("ds-Tabs", className)} data-variant={variant}>
        {children}
      </div>
    </TabsContext>
  );
}
