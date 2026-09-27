import styles from "./Foundations.module.scss";
import { readTokens } from "./tokenReader";

const TEXT_STYLES = [
  { name: "Body M", mixin: "text-body-m", size: "--ds-font-size-body-m" },
  { name: "Body S", mixin: "text-body-s", size: "--ds-font-size-body-s" },
];

const WEIGHTS = [
  { name: "Regular", token: "--ds-font-weight-regular" },
  { name: "Bold", token: "--ds-font-weight-bold" },
];

/** Figma text styles rendered with the tokens, one specimen per weight. */
export function TextStyles() {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">Text style</th>
          <th scope="col">Sass mixin</th>
          {WEIGHTS.map((weight) => (
            <th scope="col" key={weight.token}>
              {weight.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {TEXT_STYLES.map((textStyle) => (
          <tr key={textStyle.name}>
            <td>{textStyle.name}</td>
            <td>
              <code className={styles.code}>@include mixins.{textStyle.mixin}</code>
            </td>
            {WEIGHTS.map((weight) => (
              <td key={weight.token}>
                <p
                  className={styles.specimen}
                  style={{
                    fontFamily: "var(--ds-font-family-base)",
                    fontSize: `var(${textStyle.size})`,
                    lineHeight: "var(--ds-line-height-body)",
                    fontWeight: `var(${weight.token})`,
                  }}
                >
                  Emails, Files, Warning
                </p>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** All typography tokens, read from the loaded stylesheets. */
export function TypographyTokens() {
  const tokens = [...readTokens("--ds-font-"), ...readTokens("--ds-line-height-")];

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">Token</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token) => (
          <tr key={token.name}>
            <td>
              <code className={styles.code}>{token.name}</code>
            </td>
            <td>
              <code className={styles.code}>{token.value}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
