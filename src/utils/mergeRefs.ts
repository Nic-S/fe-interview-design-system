import type { Ref, RefCallback } from "react";

/**
 * Merges several refs into a single callback ref, so a component can keep an
 * internal ref and still forward the consumer's `ref` to the same element.
 *
 * It returns a React 19 cleanup function: on detach, callback refs that
 * returned their own cleanup get it called, the others are called with `null`,
 * and object refs are reset to `null`.
 *
 * The returned callback is a new function on every call: memoize it in the
 * component (`useMemo(() => mergeRefs(a, b), [b])`) to avoid detaching and
 * re-attaching the refs on every render.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === "function") {
        const cleanup = ref(node);
        return typeof cleanup === "function" ? cleanup : () => ref(null);
      }
      if (ref) {
        ref.current = node;
        return () => {
          ref.current = null;
        };
      }
      return undefined;
    });

    return () => {
      for (const cleanup of cleanups) {
        cleanup?.();
      }
    };
  };
}
