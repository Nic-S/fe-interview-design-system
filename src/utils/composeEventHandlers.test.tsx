import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MouseEvent } from "react";
import { composeEventHandlers } from "./composeEventHandlers";

const fakeEvent = () => ({
  defaultPrevented: false,
  preventDefault() {
    this.defaultPrevented = true;
  },
});

describe("composeEventHandlers", () => {
  it("calls the external handler first, then the internal one", () => {
    const calls: string[] = [];
    const handler = composeEventHandlers(
      () => calls.push("external"),
      () => calls.push("internal"),
    );

    handler(fakeEvent());

    expect(calls).toEqual(["external", "internal"]);
  });

  it("skips the internal handler when the external one prevents default", () => {
    const internal = vi.fn();
    const handler = composeEventHandlers((event: ReturnType<typeof fakeEvent>) => {
      event.preventDefault();
    }, internal);

    handler(fakeEvent());

    expect(internal).not.toHaveBeenCalled();
  });

  it("calls only the internal handler when there is no external one", () => {
    const internal = vi.fn();
    const event = fakeEvent();

    composeEventHandlers(undefined, internal)(event);

    expect(internal).toHaveBeenCalledWith(event);
  });

  it("works with real React events", async () => {
    const user = userEvent.setup();
    const external = vi.fn();
    const internal = vi.fn();
    render(
      <button type="button" onClick={composeEventHandlers<MouseEvent>(external, internal)}>
        Files
      </button>,
    );

    await user.click(screen.getByRole("button", { name: "Files" }));

    expect(external).toHaveBeenCalledTimes(1);
    expect(internal).toHaveBeenCalledTimes(1);
  });
});
