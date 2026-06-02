import { describe, expect, it } from "vitest";
import { extractSourceDocument } from "./source-extraction";

describe("extractSourceDocument", () => {
  it("extracts text files", async () => {
    const file = new File(["Training requirement notes"], "notes.txt", {
      type: "text/plain"
    });

    const source = await extractSourceDocument("project_1", file);

    expect(source.filename).toBe("notes.txt");
    expect(source.sourceType).toBe("txt");
    expect(source.extractionStatus).toBe("extracted");
    expect(source.isActiveForGeneration).toBe(true);
    expect(source.extractedText).toBe("Training requirement notes");
  });

  it("marks unsupported files as failed", async () => {
    const file = new File(["x"], "notes.csv", { type: "text/csv" });

    const source = await extractSourceDocument("project_1", file);

    expect(source.sourceType).toBe("unsupported");
    expect(source.extractionStatus).toBe("failed");
    expect(source.isActiveForGeneration).toBe(false);
    expect(source.extractionError).toMatch(/supported source types/i);
  });
});

