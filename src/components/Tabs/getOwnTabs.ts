/**
 * The tabs of one Tabs instance inside `list`, in rendered order. Tabs of a
 * nested Tabs (e.g. inside a panel) have another baseId and are left out.
 */
export const getOwnTabs = (list: HTMLElement | null, baseId: string): HTMLElement[] =>
  Array.from(list?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []).filter(
    (tab) => tab.dataset.tabsId === baseId,
  );
