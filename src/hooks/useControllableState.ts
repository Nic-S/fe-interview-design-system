import { useCallback, useEffect, useRef, useState } from "react";

export interface UseControllableStateParams<T> {
  /** Controlled value. When defined, the parent owns the state. */
  value?: T;
  /** Initial value when uncontrolled. Later changes are ignored, as with `<input>`. */
  defaultValue?: T;
  /** Called on every change, in both controlled and uncontrolled mode. */
  onChange?: (value: T) => void;
}

/**
 * State that can be either controlled (`value` + `onChange`) or uncontrolled
 * (`defaultValue`), with the same API for the component using it.
 *
 * - `onChange` is called in both modes, and only when the value actually
 *   changes (setting the current value again is a no-op).
 * - The mode is decided on every render by `value !== undefined`: a component
 *   should not switch between controlled and uncontrolled during its lifetime.
 *   If it does, a development check reports it, and uncontrolled mode resumes
 *   from the last internal value.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): readonly [T | undefined, (next: T) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const wasControlled = useRef(isControlled);
  useEffect(() => {
    if (import.meta.env.DEV && wasControlled.current !== isControlled) {
      const [from, to] = isControlled
        ? ["uncontrolled", "controlled"]
        : ["controlled", "uncontrolled"];
      console.error(
        `A component changed from ${from} to ${to}. Decide between controlled (value) and uncontrolled (defaultValue) for its whole lifetime.`,
      );
      wasControlled.current = isControlled;
    }
  }, [isControlled]);

  const setValue = useCallback(
    (next: T) => {
      if (Object.is(next, currentValue)) {
        return;
      }
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [currentValue, isControlled, onChange],
  );

  return [currentValue, setValue] as const;
}
