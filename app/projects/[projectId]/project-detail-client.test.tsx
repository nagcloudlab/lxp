import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrainingProject } from "@/lib/training-projects";
import { ProjectDetailClient } from "./project-detail-client";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({ data: null, status: "unauthenticated" })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children
}));

const emptyDelivery = {
  cohorts: [],
  enrollments: [],
  progressEvents: [],
  quizAttempts: [],
  smeAlerts: []
};

const project: TrainingProject = {
  id: "project_1",
  name: "AI Tools for Business Productivity",
  businessGoal: "Help teams use AI safely.",
  targetDepartment: "Operations",
  expectedLearnerCount: 40,
  targetCompletionDate: "2026-06-30",
  learnerRoles: "Business users, team leads",
  assignedSme: "Priya Sharma",
  status: "draft",
  createdAt: "2026-05-28T00:00:00.000Z"
};

vi.mock("@/lib/data-api", () => ({
  fetchProjects: vi.fn(() => Promise.resolve([project])),
  fetchSources: vi.fn(() => Promise.resolve([])),
  apiCreateSource: vi.fn((_, s: unknown) => Promise.resolve(s)),
  apiUpdateSource: vi.fn(() => Promise.resolve({})),
  fetchPlans: vi.fn(() => Promise.resolve([])),
  apiCreatePlan: vi.fn((_, p: unknown) => Promise.resolve(p)),
  apiUpdatePlan: vi.fn(() => Promise.resolve({})),
  fetchArtifacts: vi.fn(() => Promise.resolve([])),
  apiCreateArtifact: vi.fn((_, a: unknown) => Promise.resolve(a)),
  apiUpdateArtifact: vi.fn(() => Promise.resolve({})),
  fetchDeliveryState: vi.fn(() => Promise.resolve(emptyDelivery)),
  apiCreateCohort: vi.fn((_, c: unknown) => Promise.resolve(c)),
  apiCreateEnrollment: vi.fn((_, e: unknown) => Promise.resolve(e)),
  apiCreateProgressEvent: vi.fn((_, e: unknown) => Promise.resolve(e)),
  apiCreateQuizAttempt: vi.fn((_, a: unknown) => Promise.resolve(a)),
  apiCreateSMEAlert: vi.fn((_, a: unknown) => Promise.resolve(a)),
  fetchComments: vi.fn(() => Promise.resolve([])),
  apiCreateComment: vi.fn((_, c: unknown) => Promise.resolve(c)),
  apiUpdateComment: vi.fn(() => Promise.resolve({})),
  fetchAuditLog: vi.fn(() => Promise.resolve([])),
  apiCreateAuditEvent: vi.fn((_, e: unknown) => Promise.resolve(e))
}));

function setTestUser(role: "ld_admin" | "sme") {
  const users = {
    ld_admin: { id: "user_admin", name: "Admin User", email: "admin@company.com", role: "ld_admin" },
    sme: { id: "user_sme", name: "Dr. Sarah Chen", email: "sarah@company.com", role: "sme" }
  };
  window.localStorage.setItem("lxp.currentUser.v1", JSON.stringify(users[role]));
}

// Mock the ai-status fetch separately
const originalFetch = globalThis.fetch;

describe("ProjectDetailClient", () => {
  beforeEach(() => {
    window.localStorage.clear();
    setTestUser("ld_admin");
    vi.clearAllMocks();

    globalThis.fetch = vi.fn((input: string | URL | Request) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      if (url === "/api/ai-status") {
        return Promise.resolve(
          new Response(JSON.stringify({ status: "offline", message: "Test" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          })
        );
      }
      return originalFetch(input);
    }) as typeof fetch;
  });

  async function waitForLoaded() {
    await waitFor(() => {
      expect(screen.queryByText("Loading project...")).not.toBeInTheDocument();
    });
  }

  it("uploads, extracts, previews, and excludes a text source", async () => {
    const user = userEvent.setup();
    render(<ProjectDetailClient projectId={project.id} />);
    await waitForLoaded();

    const file = new File(["Employees need safe AI prompting."], "notes.md", {
      type: "text/markdown"
    });

    await user.upload(screen.getByLabelText(/choose source files/i), file);

    expect(await screen.findAllByText("notes.md")).toHaveLength(3);
    expect(
      screen.getByText("Employees need safe AI prompting.")
    ).toBeInTheDocument();
    expect(screen.getByText(/1 sources uploaded, 1 active/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /exclude source/i }));

    expect(screen.getByText(/1 sources uploaded, 0 active/i)).toBeInTheDocument();

    const { apiUpdateSource } = await import("@/lib/data-api");
    expect(apiUpdateSource).toHaveBeenCalled();
  });

  it("generates a draft program plan from active sources", async () => {
    const user = userEvent.setup();
    render(<ProjectDetailClient projectId={project.id} />);
    await waitForLoaded();

    const file = new File(
      ["AI prompting, confidential data, practical tasks, 3 hours and 6 hours."],
      "notes.md",
      {
        type: "text/markdown"
      }
    );

    await user.upload(screen.getByLabelText(/choose source files/i), file);
    await user.click(
      await screen.findByRole("button", { name: /generate draft plan/i })
    );

    expect(await screen.findByText(/Draft TOC v1/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Requirement summary" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Duration conflict detected/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Tool Basics and Safe Use/i)).toBeInTheDocument();

    const { apiCreatePlan } = await import("@/lib/data-api");
    expect(apiCreatePlan).toHaveBeenCalled();
  });

  it("moves a generated plan through SME approval and locking", async () => {
    const user = userEvent.setup();
    render(<ProjectDetailClient projectId={project.id} />);
    await waitForLoaded();

    const file = new File(["AI prompting and practical tasks."], "notes.md", {
      type: "text/markdown"
    });

    await user.upload(screen.getByLabelText(/choose source files/i), file);
    await user.click(
      await screen.findByRole("button", { name: /generate draft plan/i })
    );
    await user.click(screen.getByRole("button", { name: /submit for sme review/i }));
    expect(screen.getAllByText("in_review").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /approve toc/i }));
    expect(screen.getAllByText("approved").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /lock approved toc/i }));
    expect(screen.getAllByText("locked").length).toBeGreaterThan(0);

    const { apiUpdatePlan } = await import("@/lib/data-api");
    expect(apiUpdatePlan).toHaveBeenCalledTimes(3);
  });

  it("generates and approves content artifacts only after TOC lock", async () => {
    const user = userEvent.setup();
    render(<ProjectDetailClient projectId={project.id} />);
    await waitForLoaded();

    expect(
      screen.getByRole("button", { name: /generate content package/i })
    ).toBeDisabled();

    const file = new File(["AI prompting and practical tasks."], "notes.md", {
      type: "text/markdown"
    });

    await user.upload(screen.getByLabelText(/choose source files/i), file);
    await user.click(
      await screen.findByRole("button", { name: /generate draft plan/i })
    );
    await user.click(screen.getByRole("button", { name: /approve toc/i }));
    await user.click(screen.getByRole("button", { name: /lock approved toc/i }));
    await user.click(screen.getByRole("button", { name: /generate content package/i }));

    expect(
      await screen.findByRole("heading", { name: /Slide Outline -/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Facilitator Notes -/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Learner Handout -/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Quiz Bank -/i })
    ).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: /approve artifact/i })[0]);

    const { apiUpdateArtifact } = await import("@/lib/data-api");
    expect(apiUpdateArtifact).toHaveBeenCalled();
  });

  it("exports a JSON package after at least one artifact is approved", async () => {
    const user = userEvent.setup();
    const createObjectUrl = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:program-package");
    const revokeObjectUrl = vi.spyOn(URL, "revokeObjectURL").mockImplementation(
      () => undefined
    );
    const click = vi.fn();
    const createElement = vi.spyOn(document, "createElement");

    createElement.mockImplementation((tagName: string) => {
      const element = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        tagName
      ) as HTMLElement;

      if (tagName === "a") {
        Object.defineProperty(element, "click", { value: click });
      }

      return element;
    });

    render(<ProjectDetailClient projectId={project.id} />);
    await waitForLoaded();

    const file = new File(["AI prompting and practical tasks."], "notes.md", {
      type: "text/markdown"
    });

    await user.upload(screen.getByLabelText(/choose source files/i), file);
    await user.click(
      await screen.findByRole("button", { name: /generate draft plan/i })
    );
    await user.click(screen.getByRole("button", { name: /approve toc/i }));
    await user.click(screen.getByRole("button", { name: /lock approved toc/i }));
    await user.click(screen.getByRole("button", { name: /generate content package/i }));
    await user.click(screen.getAllByRole("button", { name: /approve artifact/i })[0]);
    await user.click(screen.getByRole("button", { name: /download json package/i }));

    expect(createObjectUrl).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:program-package");

    createObjectUrl.mockRestore();
    revokeObjectUrl.mockRestore();
    createElement.mockRestore();
  });

  it("creates a cohort, enrolls a learner, tracks progress, and raises SME alerts", async () => {
    const user = userEvent.setup();
    render(<ProjectDetailClient projectId={project.id} />);
    await waitForLoaded();

    const file = new File(["AI prompting and practical tasks."], "notes.md", {
      type: "text/markdown"
    });

    await user.upload(screen.getByLabelText(/choose source files/i), file);
    await user.click(
      await screen.findByRole("button", { name: /generate draft plan/i })
    );
    await user.click(screen.getByRole("button", { name: /approve toc/i }));
    await user.click(screen.getByRole("button", { name: /lock approved toc/i }));

    await user.clear(screen.getByLabelText(/cohort name/i));
    await user.type(screen.getByLabelText(/cohort name/i), "June Pilot");
    await user.type(screen.getByLabelText(/instructor/i), "Priya");
    await user.click(screen.getByRole("button", { name: /^create cohort$/i }));

    expect(
      await screen.findByRole("heading", { name: "June Pilot" })
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/learner name/i), "Ananya Rao");
    await user.type(
      screen.getByLabelText(/learner email/i),
      "ananya@example.com"
    );
    await user.click(screen.getByRole("button", { name: /enroll learner/i }));

    expect((await screen.findAllByText("Ananya Rao")).length).toBeGreaterThanOrEqual(1);

    await user.click(screen.getByRole("button", { name: /complete module/i }));
    expect(screen.getByText("completed")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /record failed quiz/i }));
    await user.click(screen.getByRole("button", { name: /record failed quiz/i }));
    expect(await screen.findByText(/failed quiz twice/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /request help/i }));
    expect(screen.getByText(/requested help/i)).toBeInTheDocument();

    const { apiCreateCohort, apiCreateQuizAttempt, apiCreateSMEAlert } = await import("@/lib/data-api");
    expect(apiCreateCohort).toHaveBeenCalled();
    expect(apiCreateQuizAttempt).toHaveBeenCalled();
    expect(apiCreateSMEAlert).toHaveBeenCalled();
  });

  it("downloads the B2B leadership report", async () => {
    const user = userEvent.setup();
    const createObjectUrl = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:leadership-report");
    const revokeObjectUrl = vi.spyOn(URL, "revokeObjectURL").mockImplementation(
      () => undefined
    );
    const click = vi.fn();
    const createElement = vi.spyOn(document, "createElement");

    createElement.mockImplementation((tagName: string) => {
      const element = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        tagName
      ) as HTMLElement;

      if (tagName === "a") {
        Object.defineProperty(element, "click", { value: click });
      }

      return element;
    });

    render(<ProjectDetailClient projectId={project.id} />);
    await waitForLoaded();

    await user.click(
      screen.getByRole("button", { name: /download leadership report/i })
    );

    expect(createObjectUrl).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:leadership-report");

    createObjectUrl.mockRestore();
    revokeObjectUrl.mockRestore();
    createElement.mockRestore();
  });
});
