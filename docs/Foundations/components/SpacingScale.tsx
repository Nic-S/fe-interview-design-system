import styles from "./Foundations.module.scss";
import { readTokens, toFigmaName } from "./tokenReader";

const PREFIX = "--ds-space-";

/** The spacing scale, read from the loaded stylesheets. */
export function SpacingScale() {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">Figma name</th>
          <th scope="col">Token</th>
          <th scope="col">Value</th>
          <th scope="col">Size</th>
        </tr>
      </thead>
      <tbody>
        {readTokens(PREFIX).map((token) => (
          <tr key={token.name}>
            <td>{toFigmaName(token.name, PREFIX)}</td>
            <td>
              <code className={styles.code}>{token.name}</code>
            </td>
            <td>
              <code className={styles.code}>{token.value}</code>
            </td>
            <td>
              <span className={styles.bar} style={{ width: `var(${token.name})` }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
