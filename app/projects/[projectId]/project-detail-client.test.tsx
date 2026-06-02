import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getContentArtifactStorageKey,
  getDeliveryStorageKey,
  getSourceStorageKey,
  getProgramPlanStorageKey,
  projectStorageKey,
  type TrainingProject
} from "@/lib/training-projects";
import { ProjectDetailClient } from "./project-detail-client";

function setTestUser(role: "ld_admin" | "sme") {
  const users = {
    ld_admin: { id: "user_admin", name: "Admin User", email: "admin@company.com", role: "ld_admin" },
    sme: { id: "user_sme", name: "Dr. Sarah Chen", email: "sarah@company.com", role: "sme" }
  };
  window.localStorage.setItem("lxp.currentUser.v1", JSON.stringify(users[role]));
}

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

describe("ProjectDetailClient", () => {
  beforeEach(() => {
    window.localStorage.clear();
    setTestUser("ld_admin");
    window.localStorage.setItem(projectStorageKey, JSON.stringify([project]));
  });

  it("uploads, extracts, previews, and excludes a text source", async () => {
    const user = userEvent.setup();
    render(<ProjectDetailClient projectId={project.id} />);

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
    expect(window.localStorage.getItem(getSourceStorageKey(project.id))).toContain(
      "\"isActiveForGeneration\":false"
    );
  });

  it("generates a draft program plan from active sources", async () => {
    const user = userEvent.setup();
    render(<ProjectDetailClient projectId={project.id} />);

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
    expect(window.localStorage.getItem(getProgramPlanStorageKey(project.id))).toContain(
      "program-plan-deterministic-v1"
    );
  });

  it("moves a generated plan through SME approval and locking", async () => {
    const user = userEvent.setup();
    render(<ProjectDetailClient projectId={project.id} />);

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
    expect(window.localStorage.getItem(getProgramPlanStorageKey(project.id))).toContain(
      "\"status\":\"locked\""
    );
  });

  it("generates and approves content artifacts only after TOC lock", async () => {
    const user = userEvent.setup();
    render(<ProjectDetailClient projectId={project.id} />);

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

    expect(window.localStorage.getItem(getContentArtifactStorageKey(project.id))).toContain(
      "\"status\":\"approved\""
    );
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

    expect(window.localStorage.getItem(getDeliveryStorageKey(project.id))).toContain(
      "quiz_failed_twice"
    );
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
