import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { Tab } from "./Tab";
import { Tabs } from "./Tabs";

const tab = (name: string) => screen.getByRole("tab", { name });

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
    it("starts from defaultValue and selects the clicked tab", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Tabs defaultValue="emails" onValueChange={onValueChange}>
          <Tab value="emails">Emails</Tab>
          <Tab value="files">Files</Tab>
        </Tabs>,
      );
      expect(tab("Emails")).toHaveAttribute("aria-selected", "true");

      await user.click(tab("Files"));

      expect(tab("Files")).toHaveAttribute("aria-selected", "true");
      expect(tab("Emails")).toHaveAttribute("aria-selected", "false");
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith("files");
    });

    it("does not call onValueChange when the selected tab is clicked again", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Tabs defaultValue="emails" onValueChange={onValueChange}>
          <Tab value="emails">Emails</Tab>
        </Tabs>,
      );

      await user.click(tab("Emails"));

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("controlled", () => {
    it("asks the parent to change the value instead of changing it", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Tabs value="emails" onValueChange={onValueChange}>
          <Tab value="emails">Emails</Tab>
          <Tab value="files">Files</Tab>
        </Tabs>,
      );

      await user.click(tab("Files"));

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith("files");
      expect(tab("Emails")).toHaveAttribute("aria-selected", "true");
    });

    it("follows the parent state", async () => {
      const user = userEvent.setup();
      function Inbox() {
        const [value, setValue] = useState("emails");
        return (
          <>
            <Tabs value={value} onValueChange={setValue}>
              <Tab value="emails">Emails</Tab>
              <Tab value="files">Files</Tab>
            </Tabs>
            <button type="button" onClick={() => setValue("files")}>
              Show attachments
            </button>
          </>
        );
      }
      render(<Inbox />);

      await user.click(screen.getByRole("button", { name: "Show attachments" }));

      expect(tab("Files")).toHaveAttribute("aria-selected", "true");
    });
  });

  it("gives each instance its own ids", () => {
    render(
      <>
        <Tabs defaultValue="emails">
          <Tab value="emails">Emails</Tab>
        </Tabs>
        <Tabs defaultValue="emails">
          <Tab value="emails">Emails</Tab>
        </Tabs>
      </>,
    );

    const [first, second] = screen.getAllByRole("tab", { name: "Emails" });
    expect(first.id).not.toBe(second.id);
  });

  it("throws a clear error when a part is used outside Tabs", () => {
    // React also logs the error thrown during render: expected here.
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Tab value="emails">Emails</Tab>)).toThrow(
      "<Tab> must be used within <Tabs>.",
    );

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
