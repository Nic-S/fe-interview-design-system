/**
 * The tabs inside `list`, in rendered order. A nested Tabs lives in a panel,
 * outside this list, so its tabs are never included.
 */
export const getOwnTabs = (list: HTMLElement | null): HTMLElement[] =>
  Array.from(list?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []);
