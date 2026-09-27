import { contrastRatio } from "./contrast";
import styles from "./Foundations.module.scss";
import { readTokens, resolveTokenValue } from "./tokenReader";

const PAGE_BACKGROUND = "#ffffff";

interface ContrastPair {
  foreground: string;
  /** Token name, or the page background when omitted. */
  background?: string;
  /** Where the pair is used in the components. */
  usage: string;
  /** Text needs 4.5:1 (WCAG 1.4.3), graphical objects 3:1 (WCAG 1.4.11). */
  kind: "text" | "graphic";
  note?: string;
}

// The pairs are design knowledge (which color sits on which), so they are
// listed explicitly; the colors themselves are read from the tokens.
const PAIRS: ContrastPair[] = [
  {
    foreground: "--ds-color-on-inverse",
    background: "--ds-color-inverse",
    usage: "Selected pill label",
    kind: "text",
  },
  {
    foreground: "--ds-color-on-inverse",
    background: "--ds-color-inverse-hover",
    usage: "Selected pill label, hover",
    kind: "text",
  },
  {
    foreground: "--ds-color-on-inverse",
    background: "--ds-color-inverse-active",
    usage: "Selected pill label, active",
    kind: "text",
  },
  { foreground: "--ds-color-on-neutral", usage: "Tab label on the page", kind: "text" },
  {
    foreground: "--ds-color-on-neutral",
    background: "--ds-color-surface-hover",
    usage: "Unselected pill label, hover",
    kind: "text",
  },
  {
    foreground: "--ds-color-on-neutral",
    background: "--ds-color-surface-active",
    usage: "Unselected pill label, active",
    kind: "text",
  },
  {
    foreground: "--ds-color-on-neutral",
    background: "--ds-color-surface-high",
    usage: "Neutral badge",
    kind: "text",
  },
  {
    foreground: "--ds-color-on-neutral",
    background: "--ds-color-surface-positive",
    usage: "Positive badge",
    kind: "text",
  },
  {
    foreground: "--ds-color-on-neutral",
    background: "--ds-color-surface-negative",
    usage: "Negative badge",
    kind: "text",
  },
  {
    foreground: "--ds-color-inverse",
    usage: "Selected underline, focus ring",
    kind: "graphic",
  },
  {
    foreground: "--ds-color-outline",
    usage: "Unselected pill border",
    kind: "graphic",
    note: "Not required: the tab is identified by its label and the selected state by the high-contrast fill or underline.",
  },
  {
    foreground: "--ds-color-outline-hover",
    usage: "Unselected pill border (hover), unselected underline",
    kind: "graphic",
    note: "Not required: hover and pressed feedback, the selected state uses high-contrast indicators.",
  },
];

const MINIMUM = { text: 4.5, graphic: 3 };

/** WCAG contrast of the color pairs used by the components, computed from the tokens. */
export function ContrastTable() {
  const tokens = readTokens("--ds-");
  const color = (name: string) => resolveTokenValue(`var(${name})`, tokens);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">Sample</th>
          <th scope="col">Usage</th>
          <th scope="col">Foreground / background</th>
          <th scope="col">Ratio</th>
          <th scope="col">Result</th>
        </tr>
      </thead>
      <tbody>
        {PAIRS.map((pair) => {
          const foreground = color(pair.foreground);
          const background = pair.background ? color(pair.background) : PAGE_BACKGROUND;
          const ratio = contrastRatio(foreground, background);
          const minimum = MINIMUM[pair.kind];
          const passes = ratio >= minimum;
          return (
            <tr key={`${pair.foreground}-${pair.background ?? "page"}`}>
              <td>
                <span className={styles.sample} style={{ color: foreground, background }}>
                  {pair.kind === "text" ? "Aa" : "▬"}
                </span>
              </td>
              <td>{pair.usage}</td>
              <td>
                <code className={styles.code}>{pair.foreground}</code>
                <br />
                <code className={styles.code}>{pair.background ?? "page background"}</code>
              </td>
              <td>{ratio.toFixed(2)}:1</td>
              <td>
                {passes ? (
                  <span className={styles.pass}>
                    Passes {minimum}:1 ({pair.kind})
                  </span>
                ) : (
                  <span className={styles.info}>
                    Below {minimum}:1. {pair.note}
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
