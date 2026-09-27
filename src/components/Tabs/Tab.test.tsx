import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, type ReactNode } from "react";
import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { Tabs } from "./Tabs";

const renderInTabs = (children: ReactNode, onValueChange = vi.fn()) =>
  render(
    <Tabs defaultValue="emails" onValueChange={onValueChange}>
      <TabList aria-label="Inbox">{children}</TabList>
    </Tabs>,
  );

const tab = (name: string) => screen.getByRole("tab", { name });

describe("Tab", () => {
  it("is a native button with the tab role", () => {
    renderInTabs(<Tab value="emails">Emails</Tab>);

    expect(tab("Emails").tagName).toBe("BUTTON");
    expect(tab("Emails")).toHaveAttribute("type", "button");
  });

  it("marks only the selected tab, in ARIA and as a styling hook", () => {
    renderInTabs(
      <>
        <Tab value="emails">Emails</Tab>
        <Tab value="files">Files</Tab>
      </>,
    );

    expect(tab("Emails")).toHaveAttribute("aria-selected", "true");
    expect(tab("Emails")).toHaveAttribute("data-selected");
    expect(tab("Files")).toHaveAttribute("aria-selected", "false");
    expect(tab("Files")).not.toHaveAttribute("data-selected");
  });

  it("keeps only the selected tab in the Tab sequence (roving tabindex)", () => {
    renderInTabs(
      <>
        <Tab value="emails">Emails</Tab>
        <Tab value="files">Files</Tab>
      </>,
    );

    expect(tab("Emails")).toHaveAttribute("tabindex", "0");
    expect(tab("Files")).toHaveAttribute("tabindex", "-1");
  });

  it("links to its panel through ids derived from the value", () => {
    renderInTabs(<Tab value="files">Files</Tab>);

    const files = tab("Files");
    expect(files.id).toMatch(/-tab-files$/);
    expect(files.getAttribute("aria-controls")).toBe(files.id.replace("-tab-", "-panel-"));
  });

  it("escapes spaces in the ids, without collisions", () => {
    renderInTabs(
      <>
        <Tab value="my files">My files</Tab>
        <Tab value="my-files">Shared files</Tab>
      </>,
    );

    const spaced = tab("My files");
    expect(spaced.id).toMatch(/-tab-my%20files$/);
    expect(spaced.getAttribute("aria-controls")).not.toContain(" ");
    expect(spaced.id).not.toBe(tab("Shared files").id);
  });

  it("includes the badge in its accessible name, after a pause", () => {
    renderInTabs(
      <Tab value="files" badgeProps={{ label: "Warning", variant: "negative" }}>
        Files
      </Tab>,
    );

    const files = tab("Files, Warning");
    expect(files.querySelector(".ds-Badge")).toHaveAttribute("data-variant", "negative");
  });

  it("throws a clear error when used outside TabList", () => {
    // React also logs the error thrown during render: expected here.
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(
        <Tabs defaultValue="emails">
          <Tab value="emails">Emails</Tab>
        </Tabs>,
      ),
    ).toThrow("<Tab> must be used within <TabList>.");

    consoleError.mockRestore();
  });

  it("merges className and passes native props and the ref", () => {
    const ref = createRef<HTMLButtonElement>();
    renderInTabs(
      <Tab value="emails" className="custom" ref={ref} title="Unread emails">
        Emails
      </Tab>,
    );

    expect(tab("Emails")).toHaveClass("ds-Tab", "custom");
    expect(tab("Emails")).toHaveAttribute("title", "Unread emails");
    expect(ref.current).toBe(tab("Emails"));
  });

  describe("onClick", () => {
    it("calls the consumer's handler and still selects the tab", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const onValueChange = vi.fn();
      renderInTabs(
        <>
          <Tab value="emails">Emails</Tab>
          <Tab value="files" onClick={onClick}>
            Files
          </Tab>
        </>,
        onValueChange,
      );

      await user.click(tab("Files"));

      expect(onClick).toHaveBeenCalledOnce();
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith("files");
    });

    it("lets the consumer prevent the selection with preventDefault", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderInTabs(
        <>
          <Tab value="emails">Emails</Tab>
          <Tab value="files" onClick={(event) => event.preventDefault()}>
            Files
          </Tab>
        </>,
        onValueChange,
      );

      await user.click(tab("Files"));

      expect(onValueChange).not.toHaveBeenCalled();
      expect(tab("Emails")).toHaveAttribute("aria-selected", "true");
    });
  });
});
