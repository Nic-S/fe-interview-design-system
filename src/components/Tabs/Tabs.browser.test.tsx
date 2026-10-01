import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { userEvent } from "vitest/browser";
import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { TabPanel } from "./TabPanel";
import { Tabs } from "./Tabs";
import type { TabsVariant } from "./Tabs.types";

// What jsdom can't see: layout, computed styles, real pointer and keyboard
// events. In Chrome, with the real CSS and design tokens.

const tab = (name: string | RegExp) => screen.getByRole("tab", { name });
const style = (element: Element, pseudo?: string) => getComputedStyle(element, pseudo);

// Figma colors, as Chrome computes them.
const INVERSE = "rgb(27, 33, 52)";
const INVERSE_HOVER = "rgb(52, 58, 78)";
const SURFACE_HOVER = "rgb(246, 246, 250)";
const OUTLINE_HOVER = "rgb(196, 197, 207)";
const TRANSPARENT = "rgba(0, 0, 0, 0)";

// Room for the focus ring around a tab: its width plus its offset.
const RING_ROOM = 4;

function Inbox({
  variant,
  defaultValue = "emails",
}: {
  variant?: TabsVariant;
  defaultValue?: string;
}) {
  return (
    <Tabs defaultValue={defaultValue} variant={variant}>
      <TabList aria-label="Inbox">
        <Tab value="emails">Emails</Tab>
        <Tab value="files" badgeProps={{ label: "Warning", variant: "negative" }}>
          Files
        </Tab>
        <Tab value="edits">Edits</Tab>
        <Tab value="dashboard">Dashboard</Tab>
        <Tab value="messages">Messages</Tab>
      </TabList>
      <TabPanel value="emails">Your emails.</TabPanel>
      <TabPanel value="files">Your files.</TabPanel>
      <TabPanel value="edits">Recent edits.</TabPanel>
      <TabPanel value="dashboard">Dashboard overview.</TabPanel>
      <TabPanel value="messages">Your messages.</TabPanel>
    </Tabs>
  );
}

describe("Tabs in a real browser", () => {
  it.each<[TabsVariant, TabsVariant]>([
    ["pill", "underline"],
    ["underline", "pill"],
  ])("keeps the %s styles outside and the %s styles inside nested Tabs", (outer, inner) => {
    render(
      <Tabs defaultValue="files" variant={outer}>
        <TabList aria-label="Inbox">
          <Tab value="emails">Emails</Tab>
          <Tab value="files">Files</Tab>
        </TabList>
        <TabPanel value="files">
          <Tabs defaultValue="images" variant={inner}>
            <TabList aria-label="File types">
              <Tab value="images">Images</Tab>
              <Tab value="documents">Documents</Tab>
            </TabList>
          </Tabs>
        </TabPanel>
      </Tabs>,
    );
    // A selected pill has a (transparent) border and no line; a selected
    // underline tab has no border and the dark line.
    const selectedLook = {
      pill: { border: "1px", line: TRANSPARENT },
      underline: { border: "0px", line: INVERSE },
    };
    const look = (name: string) => ({
      border: style(tab(name)).borderTopWidth,
      line: style(tab(name), "::after").backgroundColor,
    });

    expect(look("Files")).toEqual(selectedLook[outer]);
    expect(look("Images")).toEqual(selectedLook[inner]);
  });

  it("shows the hover colors of the design with a real pointer", async () => {
    render(<Inbox />);

    await userEvent.hover(tab("Edits"));
    expect(style(tab("Edits")).backgroundColor).toBe(SURFACE_HOVER);
    expect(style(tab("Edits")).borderTopColor).toBe(OUTLINE_HOVER);

    await userEvent.hover(tab("Emails"));
    expect(style(tab("Emails")).backgroundColor).toBe(INVERSE_HOVER);
  });

  it("shows the line of an underline tab in hover", async () => {
    render(<Inbox variant="underline" />);

    await userEvent.hover(tab("Edits"));

    expect(style(tab("Edits"), "::after").backgroundColor).toBe(OUTLINE_HOVER);
  });

  it("shows the focus ring with the keyboard, not clipped by the scrolling list", async () => {
    render(<Inbox />);

    await userEvent.keyboard("{Tab}");

    const focused = tab("Emails");
    expect(document.activeElement).toBe(focused);
    expect(style(focused).outline).toBe(`${INVERSE} solid 2px`);
    expect(style(focused).outlineOffset).toBe("2px");
    // The whole ring is inside the list, which clips what overflows it.
    const ring = focused.getBoundingClientRect();
    const list = screen.getByRole("tablist").getBoundingClientRect();
    expect(ring.left - RING_ROOM).toBeGreaterThanOrEqual(list.left);
    expect(ring.top - RING_ROOM).toBeGreaterThanOrEqual(list.top);
    expect(ring.bottom + RING_ROOM).toBeLessThanOrEqual(list.bottom);
  });

  it("keeps label and badge as two words of the accessible name, with a pause", () => {
    render(<Inbox />);

    // With the real CSS, Chrome (and Testing Library) compute "Files , Warning":
    // spaces around non-inline elements. jsdom computes "Files, Warning".
    expect(tab(/^Files\s*,\s*Warning$/)).toBeTruthy();
  });

  it("keeps 8px between the label and the badge", () => {
    render(<Inbox />);

    const files = tab(/^Files/);
    const label = document.createRange();
    label.selectNodeContents(files.firstElementChild?.firstChild as Node);
    const badge = files.querySelector(".ds-Badge") as Element;

    expect(badge.getBoundingClientRect().left - label.getBoundingClientRect().right).toBeCloseTo(
      8,
      0,
    );
  });

  it.each<TabsVariant>(["pill", "underline"])(
    "leaves 32px between the %s tabs and the panel",
    (variant) => {
      render(<Inbox variant={variant} />);

      const panel = screen.getByRole("tabpanel").getBoundingClientRect();
      expect(panel.top - tab("Emails").getBoundingClientRect().bottom).toBeCloseTo(32, 0);
    },
  );

  it("keeps a hidden panel hidden when a class sets its display", () => {
    const layout = document.createElement("style");
    layout.textContent = ".layout { display: flex; }";
    document.head.append(layout);
    render(
      <Tabs defaultValue="emails">
        <TabList aria-label="Inbox">
          <Tab value="emails">Emails</Tab>
          <Tab value="files">Files</Tab>
        </TabList>
        <TabPanel value="emails" className="layout">
          Your emails.
        </TabPanel>
        <TabPanel value="files" className="layout" keepMounted>
          Your files.
        </TabPanel>
      </Tabs>,
    );
    const panelOf = (name: string) =>
      document.getElementById(tab(name).getAttribute("aria-controls") ?? "") as Element;

    expect(style(panelOf("Emails")).display).toBe("flex");
    expect(style(panelOf("Files")).display).toBe("none");
    layout.remove();
  });

  it("scrolls only the list to show the tab selected at mount", () => {
    render(
      <div style={{ width: 300 }}>
        <Inbox defaultValue="messages" />
      </div>,
    );

    const list = screen.getByRole("tablist");
    const selected = tab("Messages").getBoundingClientRect();
    const visible = list.getBoundingClientRect();
    expect(list.scrollLeft).toBeGreaterThan(0);
    expect(selected.left).toBeGreaterThanOrEqual(visible.left);
    expect(selected.right).toBeLessThanOrEqual(visible.right);
    expect([window.scrollX, window.scrollY]).toEqual([0, 0]);
  });

  it("shrinks inside a grid, so the list scrolls instead of widening the layout", () => {
    render(
      <div style={{ display: "grid", width: 300 }}>
        <Inbox />
      </div>,
    );

    const list = screen.getByRole("tablist");
    expect(list.parentElement?.getBoundingClientRect().width).toBeLessThanOrEqual(300);
    expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);
  });

  it.each<TabsVariant>(["pill", "underline"])(
    "has no accessibility violations with the real styles, contrast included (%s)",
    async (variant) => {
      const { container } = render(<Inbox variant={variant} />);

      const { violations, passes } = await axe.run(container);

      expect(violations).toEqual([]);
      expect(passes.map((rule) => rule.id)).toContain("color-contrast");
    },
  );
});
