import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { createRef } from "react";
import { Badge } from "./Badge";
import { BADGE_VARIANTS, type BadgeVariant } from "./Badge.types";

describe("Badge", () => {
  it("lists every variant in BADGE_VARIANTS", () => {
    // Checked by the type-check (tsc): fails if the array and the type drift apart.
    expectTypeOf<(typeof BADGE_VARIANTS)[number]>().toEqualTypeOf<BadgeVariant>();
  });

  it("renders its label", () => {
    render(<Badge label="Warning" />);

    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("uses the neutral variant by default", () => {
    render(<Badge label="Warning" />);

    expect(screen.getByText("Warning")).toHaveAttribute("data-variant", "neutral");
  });

  it.each(BADGE_VARIANTS)("exposes the %s variant as a data attribute", (variant) => {
    render(<Badge label="Warning" variant={variant} />);

    expect(screen.getByText("Warning")).toHaveAttribute("data-variant", variant);
  });

  it("keeps its own classes when a className is passed", () => {
    render(<Badge label="Warning" className="custom" />);

    expect(screen.getByText("Warning")).toHaveClass("ds-Badge", "custom");
  });

  it("passes native props and the ref to the span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge label="Warning" ref={ref} data-testid="badge" title="Needs attention" />);

    const badge = screen.getByTestId("badge");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveAttribute("title", "Needs attention");
    expect(ref.current).toBe(badge);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <p>
        Files <Badge label="Warning" variant="negative" />
      </p>,
    );

    const { violations } = await axe.run(container);
    expect(violations).toEqual([]);
  });
});
