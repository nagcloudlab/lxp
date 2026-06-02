import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectsClient } from "./projects-client";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({ data: null, status: "unauthenticated" })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children
}));

vi.mock("@/lib/data-api", () => {
  let store: unknown[] = [];
  return {
    fetchProjects: vi.fn(() => Promise.resolve(store)),
    apiCreateProject: vi.fn((project: unknown) => {
      store = [{ ...(project as Record<string, unknown>), computedStatus: "draft" }, ...store];
      return Promise.resolve(project);
    })
  };
});

describe("ProjectsClient", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("creates and lists a draft Corporate L&D project", async () => {
    const user = userEvent.setup();
    render(<ProjectsClient />);

    await waitFor(() => {
      expect(screen.getByLabelText(/program name/i)).toBeInTheDocument();
    });

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

    const { apiCreateProject } = await import("@/lib/data-api");
    expect(apiCreateProject).toHaveBeenCalled();
  });
});
