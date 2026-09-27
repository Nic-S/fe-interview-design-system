import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { Tabs } from "./Tabs";
import { useTabsContext } from "./TabsContext";

/** Reads the context the way Tab and TabPanel will, to test the root alone. */
function ContextProbe() {
  const { value, baseId, setValue } = useTabsContext("ContextProbe");
  return (
    <>
      <output aria-label="selected">{value}</output>
      <output aria-label="base id">{baseId}</output>
      <button type="button" onClick={() => setValue("files")}>
        Select files
      </button>
    </>
  );
}

const selected = () => screen.getByRole("status", { name: "selected" });

describe("Tabs", () => {
  describe("root element", () => {
    it("renders a div with the stable class and the variant", () => {
      render(<Tabs defaultValue="emails" data-testid="tabs" />);

      const root = screen.getByTestId("tabs");
      expect(root.tagName).toBe("DIV");
      expect(root).toHaveClass("ds-Tabs");
      expect(root).toHaveAttribute("data-variant", "pill");
    });

    it("accepts the underline variant", () => {
      render(<Tabs defaultValue="emails" variant="underline" data-testid="tabs" />);

      expect(screen.getByTestId("tabs")).toHaveAttribute("data-variant", "underline");
    });

    it("merges className and passes native props and the ref", () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Tabs
          defaultValue="emails"
          className="custom"
          ref={ref}
          data-testid="tabs"
          title="Inbox"
        />,
      );

      const root = screen.getByTestId("tabs");
      expect(root).toHaveClass("ds-Tabs", "custom");
      expect(root).toHaveAttribute("title", "Inbox");
      expect(ref.current).toBe(root);
    });
  });

  describe("uncontrolled", () => {
    it("starts from defaultValue and updates on selection", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Tabs defaultValue="emails" onValueChange={onValueChange}>
          <ContextProbe />
        </Tabs>,
      );
      expect(selected()).toHaveTextContent("emails");

      await user.click(screen.getByRole("button", { name: "Select files" }));

      expect(selected()).toHaveTextContent("files");
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith("files");
    });
  });

  describe("controlled", () => {
    it("shows the value prop and only asks the parent to change it", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Tabs value="emails" onValueChange={onValueChange}>
          <ContextProbe />
        </Tabs>,
      );

      await user.click(screen.getByRole("button", { name: "Select files" }));

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith("files");
      expect(selected()).toHaveTextContent("emails");
    });

    it("follows the parent state", async () => {
      const user = userEvent.setup();
      function Parent() {
        const [tab, setTab] = useState("emails");
        return (
          <Tabs value={tab} onValueChange={setTab}>
            <ContextProbe />
          </Tabs>
        );
      }
      render(<Parent />);

      await user.click(screen.getByRole("button", { name: "Select files" }));

      expect(selected()).toHaveTextContent("files");
    });
  });

  it("gives each instance its own id prefix", () => {
    render(
      <>
        <Tabs defaultValue="emails">
          <ContextProbe />
        </Tabs>
        <Tabs defaultValue="emails">
          <ContextProbe />
        </Tabs>
      </>,
    );

    const [first, second] = screen.getAllByRole("status", { name: "base id" });
    expect(first.textContent).not.toBe("");
    expect(first.textContent).not.toBe(second.textContent);
  });

  it("throws a clear error when a part is used outside Tabs", () => {
    // React also logs the error thrown during render: expected here.
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<ContextProbe />)).toThrow("<ContextProbe> must be used within <Tabs>.");

    consoleError.mockRestore();
  });

  it("requires value + onValueChange or defaultValue, never both (type-checked)", () => {
    // These lines are verified by tsc: each @ts-expect-error fails the type-check
    // if the props below ever become valid.
    // @ts-expect-error neither value nor defaultValue
    <Tabs />;
    // @ts-expect-error value without onValueChange
    <Tabs value="emails" />;
    // @ts-expect-error both value and defaultValue
    <Tabs value="emails" onValueChange={() => {}} defaultValue="files" />;
  });
});
