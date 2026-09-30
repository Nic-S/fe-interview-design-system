// Demo page (`pnpm dev`): the example of the Figma file, for a quick try.
// It uses the design system like an app: the optional font entry and the
// public entry only. The full documentation is in Storybook.
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./fonts";
import { Tab, TabList, TabPanel, Tabs, type TabsVariant } from "./index";
import "./main.css";

const VARIANTS: TabsVariant[] = ["pill", "underline"];

function Demo() {
  const [variant, setVariant] = useState<TabsVariant>("pill");

  return (
    <main className="page">
      <header>
        <h1>Tabs</h1>
        <p>
          The example of the Figma file. Resize the window below 768px to see the mobile sizes and
          the scrolling list. Full documentation: <code>pnpm storybook</code>.
        </p>
      </header>

      <fieldset className="variants">
        <legend>Variant</legend>
        {VARIANTS.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name="variant"
              value={option}
              checked={variant === option}
              onChange={() => setVariant(option)}
            />{" "}
            {option}
          </label>
        ))}
      </fieldset>

      <Tabs defaultValue="emails" variant={variant}>
        <TabList aria-label="Inbox">
          <Tab value="emails">Emails</Tab>
          <Tab value="files" badgeProps={{ label: "Warning", variant: "negative" }}>
            Files
          </Tab>
          <Tab value="edits">Edits</Tab>
          <Tab value="dashboard">Dashboard</Tab>
          <Tab value="messages">Messages</Tab>
        </TabList>
        <TabPanel value="emails" className="panel">
          <ul>
            <li>Project update</li>
            <li>Meeting tomorrow at 10</li>
            <li>Welcome to the team</li>
          </ul>
        </TabPanel>
        <TabPanel value="files" className="panel">
          <p>2 files need attention.</p>
          <ul>
            <li>report.pdf</li>
            <li>photo.jpg</li>
          </ul>
        </TabPanel>
        <TabPanel value="edits" className="panel">
          <p>No pending edits.</p>
        </TabPanel>
        <TabPanel value="dashboard" className="panel">
          <p>Your overview at a glance.</p>
        </TabPanel>
        <TabPanel value="messages" className="panel">
          <p>No new messages.</p>
        </TabPanel>
      </Tabs>
    </main>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
