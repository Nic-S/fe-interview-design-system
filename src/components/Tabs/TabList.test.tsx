import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, type ReactNode } from "react";
import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { TabPanel } from "./TabPanel";
import { Tabs } from "./Tabs";

const renderInbox = ({
  onValueChange = vi.fn(),
  listProps = { "aria-label": "Inbox" },
  extra,
}: {
  onValueChange?: (value: string) => void;
  listProps?: Parameters<typeof TabList>[0];
  extra?: ReactNode;
} = {}) =>
  render(
    <Tabs defaultValue="emails" onValueChange={onValueChange}>
      <TabList {...listProps}>
        <Tab value="emails">Emails</Tab>
        <Tab value="files">Files</Tab>
        <Tab value="edits">Edits</Tab>
      </TabList>
      <TabPanel value="emails">Inbox content</TabPanel>
      {extra}
    </Tabs>,
  );

const tab = (name: string) => screen.getByRole("tab", { name });

describe("TabList", () => {
  it("is a tablist with an accessible name", () => {
    renderInbox();

    expect(screen.getByRole("tablist", { name: "Inbox" })).toHaveClass("ds-TabList");
  });

  it("merges className and passes native props and the ref", () => {
    const ref = createRef<HTMLDivElement>();
    renderInbox({ listProps: { "aria-label": "Inbox", className: "custom", ref } });

    const list = screen.getByRole("tablist", { name: "Inbox" });
    expect(list).toHaveClass("ds-TabList", "custom");
    expect(ref.current).toBe(list);
  });

  describe("keyboard", () => {
    it("moves to the next tab with → and selects it", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderInbox({ onValueChange });
      tab("Emails").focus();

      await user.keyboard("{ArrowRight}");

      expect(tab("Files")).toHaveFocus();
      expect(tab("Files")).toHaveAttribute("aria-selected", "true");
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith("files");
    });

    it("wraps from the last tab to the first with →, and back with ←", async () => {
      const user = userEvent.setup();
      renderInbox();
      tab("Emails").focus();

      await user.keyboard("{ArrowLeft}");
      expect(tab("Edits")).toHaveFocus();

      await user.keyboard("{ArrowRight}");
      expect(tab("Emails")).toHaveFocus();
    });

    it("moves to the first and last tab with Home and End", async () => {
      const user = userEvent.setup();
      renderInbox();
      tab("Emails").focus();

      await user.keyboard("{End}");
      expect(tab("Edits")).toHaveFocus();

      await user.keyboard("{Home}");
      expect(tab("Emails")).toHaveFocus();
    });

    it("keeps the focus on a single tab, without selection changes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Tabs defaultValue="emails" onValueChange={onValueChange}>
          <TabList aria-label="Inbox">
            <Tab value="emails">Emails</Tab>
          </TabList>
        </Tabs>,
      );
      tab("Emails").focus();

      await user.keyboard("{ArrowRight}{ArrowLeft}{End}{Home}");

      expect(tab("Emails")).toHaveFocus();
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("ignores ↑ and ↓ (horizontal tablist)", async () => {
      const user = userEvent.setup();
      renderInbox();
      tab("Emails").focus();

      await user.keyboard("{ArrowDown}{ArrowUp}");

      expect(tab("Emails")).toHaveFocus();
    });

    it("enters the tablist on the selected tab and leaves it for the panel with Tab", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button type="button">Before</button>
          <Tabs defaultValue="files">
            <TabList aria-label="Inbox">
              <Tab value="emails">Emails</Tab>
              <Tab value="files">Files</Tab>
            </TabList>
            <TabPanel value="files">Attachments</TabPanel>
          </Tabs>
        </>,
      );
      screen.getByRole("button", { name: "Before" }).focus();

      await user.tab();
      expect(tab("Files")).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("tabpanel", { name: "Files" })).toHaveFocus();
    });

    it("lets the consumer prevent the navigation with preventDefault", async () => {
      const user = userEvent.setup();
      renderInbox({
        listProps: { "aria-label": "Inbox", onKeyDown: (event) => event.preventDefault() },
      });
      tab("Emails").focus();

      await user.keyboard("{ArrowRight}");

      expect(tab("Emails")).toHaveFocus();
    });

    it("moves only between its own tabs when another Tabs is nested", async () => {
      const user = userEvent.setup();
      renderInbox({
        extra: (
          <Tabs defaultValue="images">
            <TabList aria-label="Attachment types">
              <Tab value="images">Images</Tab>
            </TabList>
          </Tabs>
        ),
      });
      tab("Edits").focus();

      await user.keyboard("{ArrowRight}");

      expect(tab("Emails")).toHaveFocus();
    });
  });

  describe("selected tab in view", () => {
    // jsdom has no layout: a 100px list with 60px tabs side by side, moved by
    // the list's scrollLeft like in a browser.
    let rectSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      rectSpy = vi
        .spyOn(HTMLElement.prototype, "getBoundingClientRect")
        .mockImplementation(function (this: HTMLElement) {
          const list = this.closest<HTMLElement>('[role="tablist"]');
          const index = [...(list?.querySelectorAll('[role="tab"]') ?? [])].indexOf(this);
          const left = index === -1 ? 0 : index * 60 - (list?.scrollLeft ?? 0);
          const width = index === -1 ? 100 : 60;
          return { left, right: left + width, width, x: left } as DOMRect;
        });
    });

    afterEach(() => {
      rectSpy.mockRestore();
    });

    function Inbox({ value }: { value: string }) {
      return (
        <Tabs value={value} onValueChange={() => {}}>
          <TabList aria-label="Inbox">
            <Tab value="emails">Emails</Tab>
            <Tab value="files">Files</Tab>
            <Tab value="edits">Edits</Tab>
          </TabList>
        </Tabs>
      );
    }

    it("scrolls the list to show the tab selected at mount", () => {
      render(<Inbox value="edits" />);

      // Edits spans 120-180px: the list scrolls by 80px to show its end.
      expect(screen.getByRole("tablist").scrollLeft).toBe(80);
    });

    it("follows a value changed from outside, in both directions", () => {
      const { rerender } = render(<Inbox value="emails" />);
      const list = screen.getByRole("tablist");
      expect(list.scrollLeft).toBe(0);

      rerender(<Inbox value="edits" />);
      expect(list.scrollLeft).toBe(80);

      rerender(<Inbox value="emails" />);
      expect(list.scrollLeft).toBe(0);
    });
  });

  describe("development checks", () => {
    let consoleError: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleError.mockRestore();
    });

    it("reports a tablist without an accessible name", () => {
      renderInbox({ listProps: {} });

      expect(consoleError).toHaveBeenCalledExactlyOnceWith(
        "TabList needs an accessible name: pass aria-label or aria-labelledby.",
      );
    });

    it("reports duplicate values once", () => {
      render(
        <Tabs defaultValue="emails">
          <TabList aria-label="Inbox">
            <Tab value="emails">Emails</Tab>
            <Tab value="files">Files</Tab>
            <Tab value="files">Attachments</Tab>
          </TabList>
        </Tabs>,
      );

      expect(consoleError).toHaveBeenCalledExactlyOnceWith(
        'Tabs: duplicate value "files". Each Tab needs a unique value.',
      );
    });

    it("reports a value that matches no tab", () => {
      render(
        <Tabs defaultValue="emials">
          <TabList aria-label="Inbox">
            <Tab value="emails">Emails</Tab>
          </TabList>
        </Tabs>,
      );

      expect(consoleError).toHaveBeenCalledExactlyOnceWith(
        expect.stringContaining('Tabs: value "emials" does not match any Tab'),
      );
    });

    it("reports nothing when the tabs are used correctly", () => {
      renderInbox();

      expect(consoleError).not.toHaveBeenCalled();
    });
  });
});
