import { type RefObject, useLayoutEffect } from "react";
import { getOwnTabs } from "./getOwnTabs";

/**
 * Keeps the selected tab visible in a TabList that scrolls horizontally: on
 * mount and whenever the value changes, also from outside (controlled mode).
 * With the keyboard the browser already does it, as it scrolls the focused
 * tab into view.
 *
 * It scrolls the list only: `scrollIntoView` could also scroll the page.
 */
export function useSelectedTabInView(
  listRef: RefObject<HTMLElement | null>,
  value: string | undefined,
) {
  // Layout effect: at mount the list is scrolled before the first paint.
  useLayoutEffect(() => {
    const list = listRef.current;
    const selectedTab = getOwnTabs(list).find((tab) => tab.dataset.value === value);
    if (list && selectedTab) {
      list.scrollLeft += distanceOutOfView(list, selectedTab);
    }
  }, [listRef, value]);
}

/**
 * How far the list must scroll to show the whole tab: negative when the tab
 * is hidden on the left, positive when hidden on the right, 0 when visible.
 * The list's padding (the room for the focus ring) counts as hidden, so the
 * ring is visible too.
 */
function distanceOutOfView(list: HTMLElement, tab: HTMLElement): number {
  // Same padding on both sides; empty in jsdom, which applies no CSS.
  const ringRoom = Number.parseFloat(getComputedStyle(list).paddingLeft) || 0;
  const listBox = list.getBoundingClientRect();
  const tabBox = tab.getBoundingClientRect();
  const visibleLeft = listBox.left + ringRoom;
  const visibleRight = listBox.right - ringRoom;

  if (tabBox.left < visibleLeft) {
    return tabBox.left - visibleLeft;
  }
  if (tabBox.right > visibleRight) {
    return tabBox.right - visibleRight;
  }
  return 0;
}
