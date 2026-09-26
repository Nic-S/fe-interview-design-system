import { type Ref, type RefCallback, useMemo } from "react";
import { mergeRefs } from "../utils/mergeRefs";

/**
 * Memoized `mergeRefs`: returns the same callback ref as long as the given
 * refs don't change, so React doesn't detach and re-attach them on every
 * render. Typical use: a component that needs an internal ref and must also
 * forward the consumer's `ref` to the same element.
 *
 * @example
 * const listRef = useRef<HTMLDivElement>(null);
 * const ref = useMergedRefs(listRef, props.ref);
 * return <div ref={ref} />;
 */
export function useMergedRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  // biome-ignore lint/correctness/useExhaustiveDependencies: the refs are the dependency list
  return useMemo(() => mergeRefs(...refs), refs);
}
