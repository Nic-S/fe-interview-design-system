import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { TabPanel } from "./TabPanel";
import { Tabs } from "./Tabs";
import type { TabsVariant } from "./Tabs.types";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  subcomponents: { TabList, Tab, TabPanel },
  args: {
    defaultValue: "emails",
    variant: "pill",
  },
  // react-docgen can't read the discriminated union of TabsProps (controlled or
  // uncontrolled), so the state props are documented here.
  argTypes: {
    value: {
      description: "Value of the selected tab (controlled). Requires `onValueChange`.",
      control: false,
      table: { type: { summary: "string" } },
    },
    defaultValue: {
      description: "Value of the tab selected at first (uncontrolled).",
      table: { type: { summary: "string" } },
    },
    onValueChange: {
      description: "Called when the user selects another tab. Required with `value`.",
      control: false,
      table: { type: { summary: "(value: string) => void" } },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The tabs of the Figma example, shared by the stories. */
const inboxTabs = (
  <TabList aria-label="Inbox">
    <Tab value="emails">Emails</Tab>
    <Tab value="files" badgeProps={{ label: "Warning", variant: "negative" }}>
      Files
    </Tab>
    <Tab value="edits">Edits</Tab>
    <Tab value="dashboard">Dashboard</Tab>
    <Tab value="messages">Messages</Tab>
  </TabList>
);

const inboxPanels = (
  <>
    <TabPanel value="emails">Your emails.</TabPanel>
    <TabPanel value="files">Your files: 2 need attention.</TabPanel>
    <TabPanel value="edits">Recent edits.</TabPanel>
    <TabPanel value="dashboard">Dashboard overview.</TabPanel>
    <TabPanel value="messages">Your messages.</TabPanel>
  </>
);

/**
 * The example of the Figma file. Uncontrolled: `defaultValue` sets the first
 * selected tab, then Tabs owns the state.
 */
export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      {inboxTabs}
      {inboxPanels}
    </Tabs>
  ),
};

function ControlledInbox({ variant }: { variant?: TabsVariant }) {
  const [value, setValue] = useState("emails");
  return (
    <>
      <Tabs value={value} onValueChange={setValue} variant={variant}>
        {inboxTabs}
        {inboxPanels}
      </Tabs>
      <p>
        Selected: <code>{value}</code>{" "}
        <button type="button" onClick={() => setValue("files")}>
          Show files
        </button>
      </p>
    </>
  );
}

/**
 * Controlled: the parent owns the selected value (`value` + `onValueChange`),
 * so it can also change it from outside, e.g. with the "Show files" button.
 */
export const Controlled: Story = {
  parameters: { controls: { include: ["variant"] } },
  render: ({ variant }) => <ControlledInbox variant={variant} />,
};

/** The two variants of the design. All the tabs of a Tabs share its variant. */
export const Variants: Story = {
  parameters: { controls: { exclude: ["variant"] } },
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--ds-space-xl)" }}>
      <Tabs {...args} variant="pill">
        {inboxTabs}
        {inboxPanels}
      </Tabs>
      <Tabs {...args} variant="underline">
        {inboxTabs}
        {inboxPanels}
      </Tabs>
    </div>
  ),
};

/** A tab can show a Badge after its label, in any of its variants (`badgeProps`). */
export const WithBadges: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Inbox">
        <Tab value="emails" badgeProps={{ label: "12", variant: "neutral" }}>
          Emails
        </Tab>
        <Tab value="files" badgeProps={{ label: "Warning", variant: "negative" }}>
          Files
        </Tab>
        <Tab value="edits" badgeProps={{ label: "Saved", variant: "positive" }}>
          Edits
        </Tab>
      </TabList>
      <TabPanel value="emails">12 unread emails.</TabPanel>
      <TabPanel value="files">Your files: 2 need attention.</TabPanel>
      <TabPanel value="edits">All edits are saved.</TabPanel>
    </Tabs>
  ),
};

/**
 * At viewport widths up to 768px the tabs are smaller. When they don't fit,
 * the list scrolls horizontally (touch, trackpad, Shift + wheel, arrow keys)
 * and keeps the selected tab in view.
 */
export const Mobile: Story = {
  ...Default,
  args: { defaultValue: "messages" },
  globals: { viewport: { value: "mobile1", isRotated: false } },
};

const workspaceSections = [
  "Overview",
  "Emails",
  "Files",
  "Edits",
  "Dashboard",
  "Messages",
  "Calendar",
  "Contacts",
  "Tasks",
  "Reports",
  "Settings",
  "Billing",
];

/**
 * More tabs than fit: the list scrolls horizontally at any width and keeps the
 * selected tab in view, here "Billing", the last one, selected at mount.
 */
export const Overflow: Story = {
  args: { defaultValue: "billing" },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Workspace">
        {workspaceSections.map((section) => (
          <Tab key={section} value={section.toLowerCase()}>
            {section}
          </Tab>
        ))}
      </TabList>
      {workspaceSections.map((section) => (
        <TabPanel key={section} value={section.toLowerCase()}>
          {section}.
        </TabPanel>
      ))}
    </Tabs>
  ),
};

/**
 * `keepMounted` keeps the content of a hidden panel mounted, with its state:
 * type in both fields, switch tab and come back.
 */
export const KeepMounted: Story = {
  args: { defaultValue: "draft" },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Message">
        <Tab value="draft">Draft</Tab>
        <Tab value="notes">Notes</Tab>
        <Tab value="preview">Preview</Tab>
      </TabList>
      <TabPanel value="draft" keepMounted>
        <label>
          Draft (kept while hidden) <input />
        </label>
      </TabPanel>
      <TabPanel value="notes">
        <label>
          Notes (reset when hidden) <input />
        </label>
      </TabPanel>
      <TabPanel value="preview">Nothing to preview.</TabPanel>
    </Tabs>
  ),
};

/** A Tabs inside a panel of another: each keeps its own variant and keyboard navigation. */
export const Nested: Story = {
  args: { defaultValue: "files" },
  parameters: { controls: { exclude: ["variant"] } },
  render: (args) => (
    <Tabs {...args} variant="pill">
      <TabList aria-label="Inbox">
        <Tab value="emails">Emails</Tab>
        <Tab value="files">Files</Tab>
      </TabList>
      <TabPanel value="emails">Your emails.</TabPanel>
      <TabPanel value="files">
        <Tabs defaultValue="images" variant="underline">
          <TabList aria-label="File types">
            <Tab value="images">Images</Tab>
            <Tab value="documents">Documents</Tab>
          </TabList>
          <TabPanel value="images">Your images.</TabPanel>
          <TabPanel value="documents">Your documents.</TabPanel>
        </Tabs>
      </TabPanel>
    </Tabs>
  ),
};
