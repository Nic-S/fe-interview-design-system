import { createContext, use } from "react";

export interface TabsContextValue {
  /** Value of the selected tab. */
  value: string | undefined;
  /** Selects a tab (updates the state if uncontrolled, calls onValueChange). */
  setValue: (value: string) => void;
  /** Unique id of this Tabs instance (also marks its tabs, see TabList). */
  baseId: string;
  /** Ids that link the Tab and the TabPanel with the given value. */
  getIds: (value: string) => { tabId: string; panelId: string };
}

export const TabsContext = createContext<TabsContextValue | null>(null);

/** True inside a TabList: a Tab outside it would be an orphan `role="tab"`. */
export const TabListContext = createContext(false);

/**
 * Reads the Tabs context. Throws if the component is rendered outside
 * `<Tabs>`: that is a structural mistake, not something to recover from.
 */
export function useTabsContext(componentName: string): TabsContextValue {
  const context = use(TabsContext);
  if (!context) {
    throw new Error(`<${componentName}> must be used within <Tabs>.`);
  }
  return context;
}
