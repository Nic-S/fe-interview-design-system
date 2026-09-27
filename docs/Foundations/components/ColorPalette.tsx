import styles from "./Foundations.module.scss";
import { readTokens, resolveTokenValue, toFigmaName } from "./tokenReader";

const PREFIX = "--ds-color-";

/** All color tokens, read from the loaded stylesheets. */
export function ColorPalette() {
  const allTokens = readTokens("--ds-");
  const colors = readTokens(PREFIX);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">Swatch</th>
          <th scope="col">Figma variable</th>
          <th scope="col">Token</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {colors.map((token) => (
          <tr key={token.name}>
            <td>
              <span className={styles.swatch} style={{ background: `var(${token.name})` }} />
            </td>
            <td>{toFigmaName(token.name, PREFIX)}</td>
            <td>
              <code className={styles.code}>{token.name}</code>
            </td>
            <td>
              <code className={styles.code}>{resolveTokenValue(token.value, allTokens)}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
