import { render } from "@testing-library/react";
import { createRef } from "react";
import { mergeRefs } from "./mergeRefs";

describe("mergeRefs", () => {
  it("assigns the node to object refs and callback refs", () => {
    const objectRef = createRef<HTMLDivElement>();
    const callbackRef = vi.fn();

    render(<div ref={mergeRefs(objectRef, callbackRef)} data-testid="node" />);

    expect(objectRef.current).toBeInstanceOf(HTMLDivElement);
    expect(callbackRef).toHaveBeenCalledWith(objectRef.current);
  });

  it("ignores undefined and null refs", () => {
    const objectRef = createRef<HTMLDivElement>();

    render(<div ref={mergeRefs(undefined, null, objectRef)} />);

    expect(objectRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it("resets object refs and calls callback refs with null on unmount", () => {
    const objectRef = createRef<HTMLDivElement>();
    const callbackRef = vi.fn();

    const { unmount } = render(<div ref={mergeRefs(objectRef, callbackRef)} />);
    unmount();

    expect(objectRef.current).toBeNull();
    expect(callbackRef).toHaveBeenLastCalledWith(null);
  });

  it("runs the cleanup returned by a callback ref instead of calling it with null", () => {
    const cleanup = vi.fn();
    const callbackRef = vi.fn(() => cleanup);

    const { unmount } = render(<div ref={mergeRefs(callbackRef)} />);
    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(callbackRef).toHaveBeenCalledTimes(1);
  });
});
