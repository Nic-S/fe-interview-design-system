import { type RefObject, useEffect, useRef } from "react";
import { getOwnTabs } from "./getOwnTabs";

/**
 * Development checks for mistakes that break the tabs without crashing them:
 * a tablist without an accessible name, duplicate values, a selected value
 * that matches no tab. Reported with console.error (like React's duplicate
 * keys), each problem once; no-op in production.
 *
 * They run after every render because tabs can change at any time (e.g.
 * generated from data).
 */
export function useTabsDevChecks(
  listRef: RefObject<HTMLElement | null>,
  value: string | undefined,
) {
  const reported = useRef(new Set<string>());

  useEffect(() => {
    const list = listRef.current;
    if (!import.meta.env.DEV || !list) {
      return;
    }
    const problems: string[] = [];
    if (!list.hasAttribute("aria-label") && !list.hasAttribute("aria-labelledby")) {
      problems.push("TabList needs an accessible name: pass aria-label or aria-labelledby.");
    }
    const values = getOwnTabs(list).map((tab) => tab.dataset.value);
    const duplicates = new Set(
      values.filter((tabValue, index) => values.indexOf(tabValue) !== index),
    );
    for (const duplicate of duplicates) {
      problems.push(`Tabs: duplicate value "${duplicate}". Each Tab needs a unique value.`);
    }
    if (value !== undefined && !values.includes(value)) {
      problems.push(
        `Tabs: value "${value}" does not match any Tab, so no tab is selected and the tabs can't be reached with the keyboard.`,
      );
    }
    for (const problem of problems) {
      if (!reported.current.has(problem)) {
        reported.current.add(problem);
        console.error(problem);
      }
    }
  });
}
