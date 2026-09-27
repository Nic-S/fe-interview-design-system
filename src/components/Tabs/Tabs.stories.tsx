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

/** Uncontrolled: `defaultValue` sets the first selected tab, then Tabs owns the state. */
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
