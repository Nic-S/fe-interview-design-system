import { type KeyboardEvent, useRef } from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { composeEventHandlers } from "../../utils/composeEventHandlers";
import { cx } from "../../utils/cx";
import { getOwnTabs } from "./getOwnTabs";
import type { TabListProps } from "./Tabs.types";
import { TabListContext, useTabsContext } from "./TabsContext";
import { useTabsDevChecks } from "./useTabsDevChecks";

/**
 * Container of the tabs (`role="tablist"`), with the keyboard navigation of
 * the WAI-ARIA Tabs pattern: ←/→ move to the previous/next tab (wrapping
 * around), Home/End to the first/last one, and the focused tab is selected at
 * once (automatic activation). Tabs are read from the DOM, so the order is
 * always the rendered one.
 */
export function TabList({ className, onKeyDown, ref, children, ...rest }: TabListProps) {
  const { value, setValue, baseId } = useTabsContext("TabList");
  const listRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(listRef, ref);
  useTabsDevChecks(listRef, baseId, value);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = getOwnTabs(listRef.current, baseId);
    const current = tabs.indexOf(event.target as HTMLElement);
    const count = tabs.length;
    const targets: Record<string, number> = {
      ArrowRight: (current + 1) % count,
      ArrowLeft: (current - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = tabs[targets[event.key]];
    if (current === -1 || !next) {
      return;
    }
    event.preventDefault(); // Keeps arrows, Home and End from scrolling the page.
    next.focus();
    setValue(next.dataset.value ?? "");
  };

  return (
    <TabListContext value={true}>
      <div
        ref={mergedRef}
        {...rest}
        role="tablist"
        className={cx("ds-TabList", className)}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      >
        {children}
      </div>
    </TabListContext>
  );
}
