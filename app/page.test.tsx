import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("communicates the B2B Corporate L&D positioning", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /turn raw training requirements into sme-approved corporate learning programs/i
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/B2B first\. B2C after proof\./i)).toBeInTheDocument();
  });

  it("shows the MVP workflow and deferred marketplace", () => {
    render(<Home />);

    expect(screen.getByText("Capture requirements")).toBeInTheDocument();
    expect(screen.getByText("Lock the program plan")).toBeInTheDocument();
    expect(screen.getByText("Create the package")).toBeInTheDocument();
    expect(screen.getByText("Deliver and report")).toBeInTheDocument();
    expect(screen.getByText("B2C marketplace")).toBeInTheDocument();
    expect(screen.getByText("Deferred")).toBeInTheDocument();
  });
});
