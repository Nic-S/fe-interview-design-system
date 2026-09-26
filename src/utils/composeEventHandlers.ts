/**
 * Composes a consumer's event handler with the component's internal one.
 * The consumer's handler runs first; if it calls `event.preventDefault()`,
 * the internal handler is skipped. This lets consumers add behaviour (e.g.
 * analytics) or opt out of the default one without replacing it.
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  externalHandler: ((event: E) => void) | undefined,
  internalHandler: (event: E) => void,
): (event: E) => void {
  return (event) => {
    externalHandler?.(event);
    if (!event.defaultPrevented) {
      internalHandler(event);
    }
  };
}
