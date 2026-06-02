import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { projectStorageKey } from "@/lib/training-projects";
import { ProjectsClient } from "./projects-client";

describe("ProjectsClient", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("creates and lists a draft Corporate L&D project", async () => {
    const user = userEvent.setup();
    render(<ProjectsClient />);

    await user.type(
      screen.getByLabelText(/program name/i),
      "AI Tools for Business Productivity"
    );
    await user.type(
      screen.getByLabelText(/business goal/i),
      "Help teams use AI safely."
    );
    await user.type(screen.getByLabelText(/target department/i), "Operations");
    await user.clear(screen.getByLabelText(/expected learners/i));
    await user.type(screen.getByLabelText(/expected learners/i), "40");
    await user.type(screen.getByLabelText(/target completion/i), "2026-06-30");
    await user.type(screen.getByLabelText(/assigned sme/i), "Priya Sharma");
    await user.type(
      screen.getByLabelText(/learner roles/i),
      "Business users, team leads"
    );
    await user.click(screen.getByRole("button", { name: /create draft project/i }));

    expect(
      screen.getByRole("heading", {
        name: /AI Tools for Business Productivity/i
      })
    ).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();

    const stored = window.localStorage.getItem(projectStorageKey);
    expect(stored).toContain("AI Tools for Business Productivity");
  });
});

