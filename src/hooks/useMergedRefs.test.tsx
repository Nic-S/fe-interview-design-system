import { render, renderHook } from "@testing-library/react";
import { createRef, type Ref, useEffect, useRef } from "react";
import { useMergedRefs } from "./useMergedRefs";

describe("useMergedRefs", () => {
  it("returns the same callback ref while the refs don't change", () => {
    const refA = createRef<HTMLDivElement>();
    const refB = createRef<HTMLDivElement>();
    const { result, rerender } = renderHook(() => useMergedRefs(refA, refB));
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it("returns a new callback ref when one of the refs changes", () => {
    const internal = createRef<HTMLDivElement>();
    const { result, rerender } = renderHook(
      ({ external }: { external: Ref<HTMLDivElement> }) => useMergedRefs(internal, external),
      { initialProps: { external: createRef<HTMLDivElement>() } },
    );
    const first = result.current;

    rerender({ external: createRef<HTMLDivElement>() });

    expect(result.current).not.toBe(first);
  });

  it("attaches the element to both the internal and the forwarded ref", () => {
    let internalNode: HTMLDivElement | null = null;
    const forwarded = createRef<HTMLDivElement>();

    function List({ ref }: { ref: Ref<HTMLDivElement> }) {
      const internal = useRef<HTMLDivElement>(null);
      const mergedRef = useMergedRefs(internal, ref);
      useEffect(() => {
        internalNode = internal.current;
      });
      return <div ref={mergedRef} />;
    }

    render(<List ref={forwarded} />);

    expect(forwarded.current).toBeInstanceOf(HTMLDivElement);
    expect(internalNode).toBe(forwarded.current);
  });
});
