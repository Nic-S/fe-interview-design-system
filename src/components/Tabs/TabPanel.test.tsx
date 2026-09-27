import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, type ReactNode } from "react";
import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { TabPanel } from "./TabPanel";
import { Tabs } from "./Tabs";

const renderInbox = (panels: ReactNode) =>
  render(
    <Tabs defaultValue="emails">
      <TabList aria-label="Inbox">
        <Tab value="emails">Emails</Tab>
        <Tab value="files">Files</Tab>
      </TabList>
      {panels}
    </Tabs>,
  );

/**
 * The panel controlled by a tab, found through the tab's aria-controls.
 * Hidden panels are out of the accessibility tree (they have no accessible
 * name), so they can't be queried by role and name like visible ones.
 */
const panelOf = (tabName: string) => {
  const panelId = screen.getByRole("tab", { name: tabName }).getAttribute("aria-controls");
  const element = panelId ? document.getElementById(panelId) : null;
  if (!element) {
    throw new Error(`No panel controlled by the "${tabName}" tab`);
  }
  return element;
};

describe("TabPanel", () => {
  it("is a tabpanel labelled by its tab", () => {
    renderInbox(<TabPanel value="emails">Inbox content</TabPanel>);

    const emailsPanel = screen.getByRole("tabpanel", { name: "Emails" });
    expect(emailsPanel).toHaveTextContent("Inbox content");
    expect(screen.getByRole("tab", { name: "Emails" })).toHaveAttribute(
      "aria-controls",
      emailsPanel.id,
    );
  });

  it("shows only the panel of the selected tab", async () => {
    const user = userEvent.setup();
    renderInbox(
      <>
        <TabPanel value="emails">Inbox content</TabPanel>
        <TabPanel value="files">Attachments</TabPanel>
      </>,
    );
    expect(screen.getByRole("tabpanel", { name: "Emails" })).toBeVisible();
    expect(screen.queryByRole("tabpanel", { name: "Files" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Files" }));

    expect(screen.getByRole("tabpanel", { name: "Files" })).toHaveAttribute("data-selected");
    expect(screen.queryByRole("tabpanel", { name: "Emails" })).not.toBeInTheDocument();
    expect(panelOf("Emails")).not.toBeVisible();
    expect(panelOf("Emails")).not.toHaveAttribute("data-selected");
  });

  it("keeps the panel element but mounts the content only while selected", () => {
    renderInbox(<TabPanel value="files">Attachments</TabPanel>);

    expect(panelOf("Files")).toBeEmptyDOMElement();
  });

  it("keeps the content (and its state) mounted with keepMounted", async () => {
    const user = userEvent.setup();
    renderInbox(
      <TabPanel value="emails" keepMounted>
        <label>
          Search <input />
        </label>
      </TabPanel>,
    );
    await user.type(screen.getByRole("textbox", { name: "Search" }), "invoice");

    await user.click(screen.getByRole("tab", { name: "Files" }));
    expect(panelOf("Emails")).not.toBeVisible();
    await user.click(screen.getByRole("tab", { name: "Emails" }));

    expect(screen.getByRole("textbox", { name: "Search" })).toHaveValue("invoice");
  });

  it("loses the content state without keepMounted", async () => {
    const user = userEvent.setup();
    renderInbox(
      <TabPanel value="emails">
        <label>
          Search <input />
        </label>
      </TabPanel>,
    );
    await user.type(screen.getByRole("textbox", { name: "Search" }), "invoice");

    await user.click(screen.getByRole("tab", { name: "Files" }));
    await user.click(screen.getByRole("tab", { name: "Emails" }));

    expect(screen.getByRole("textbox", { name: "Search" })).toHaveValue("");
  });

  it("is focusable by default, and the consumer can opt out", () => {
    renderInbox(
      <>
        <TabPanel value="emails">Inbox content</TabPanel>
        <TabPanel value="files" tabIndex={-1}>
          Attachments
        </TabPanel>
      </>,
    );

    expect(panelOf("Emails")).toHaveAttribute("tabindex", "0");
    expect(panelOf("Files")).toHaveAttribute("tabindex", "-1");
  });

  it("merges className and passes native props and the ref", () => {
    const ref = createRef<HTMLDivElement>();
    renderInbox(
      <TabPanel value="emails" className="custom" ref={ref} data-testid="panel">
        Inbox content
      </TabPanel>,
    );

    const emailsPanel = screen.getByTestId("panel");
    expect(emailsPanel).toHaveClass("ds-TabPanel", "custom");
    expect(ref.current).toBe(emailsPanel);
  });
});
