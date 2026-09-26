import { act, renderHook } from "@testing-library/react";
import { type UseControllableStateParams, useControllableState } from "./useControllableState";

type Params = UseControllableStateParams<string>;

const renderControllable = (initialProps: Params) =>
  renderHook((props: Params) => useControllableState(props), { initialProps });

describe("useControllableState", () => {
  describe("uncontrolled", () => {
    it("starts from defaultValue", () => {
      const { result } = renderControllable({ defaultValue: "emails" });

      expect(result.current[0]).toBe("emails");
    });

    it("updates its own state and calls onChange", () => {
      const onChange = vi.fn();
      const { result } = renderControllable({ defaultValue: "emails", onChange });

      act(() => result.current[1]("files"));

      expect(result.current[0]).toBe("files");
      expect(onChange).toHaveBeenCalledExactlyOnceWith("files");
    });

    it("ignores later changes to defaultValue", () => {
      const { result, rerender } = renderControllable({ defaultValue: "emails" });

      rerender({ defaultValue: "files" });

      expect(result.current[0]).toBe("emails");
    });
  });

  describe("controlled", () => {
    it("returns the value prop", () => {
      const { result } = renderControllable({ value: "files" });

      expect(result.current[0]).toBe("files");
    });

    it("calls onChange without changing the value until the parent updates it", () => {
      const onChange = vi.fn();
      const { result, rerender } = renderControllable({ value: "emails", onChange });

      act(() => result.current[1]("files"));

      expect(onChange).toHaveBeenCalledExactlyOnceWith("files");
      expect(result.current[0]).toBe("emails");

      rerender({ value: "files", onChange });

      expect(result.current[0]).toBe("files");
    });
  });

  it.each<[string, Params]>([
    ["uncontrolled", { defaultValue: "emails" }],
    ["controlled", { value: "emails" }],
  ])("does not call onChange when setting the current value (%s)", (_, params) => {
    const onChange = vi.fn();
    const { result } = renderControllable({ ...params, onChange });

    act(() => result.current[1]("emails"));

    expect(onChange).not.toHaveBeenCalled();
  });
});
