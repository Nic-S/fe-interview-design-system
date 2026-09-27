import { createContext, use } from "react";

export interface TabsContextValue {
  /** Value of the selected tab. */
  value: string | undefined;
  /** Selects a tab (updates the state if uncontrolled, calls onValueChange). */
  setValue: (value: string) => void;
  /** Unique prefix for the ids that link each Tab to its Panel. */
  baseId: string;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

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
