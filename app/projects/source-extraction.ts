import {
  createSourceDocument,
  getSourceType,
  type SourceDocument,
  type SourceType
} from "@/lib/training-projects";

export async function extractSourceDocument(
  projectId: string,
  file: File
): Promise<SourceDocument> {
  const sourceType = getSourceType(file.name);

  try {
    const extractedText = await extractText(file, sourceType);

    return createSourceDocument({
      projectId,
      filename: file.name,
      sourceType,
      extractedText
    });
  } catch (error) {
    return createSourceDocument({
      projectId,
      filename: file.name,
      sourceType,
      extractedText: "",
      extractionStatus: "failed",
      extractionError:
        error instanceof Error ? error.message : "Unable to extract source."
    });
  }
}

async function extractText(file: File, sourceType: SourceType) {
  if (sourceType === "txt" || sourceType === "md") {
    return file.text();
  }

  if (sourceType === "docx") {
    const mammoth = await import("mammoth/mammoth.browser");
    const result = await mammoth.extractRawText({
      arrayBuffer: await file.arrayBuffer()
    });
    return result.value;
  }

  if (sourceType === "pdf") {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.mjs",
      import.meta.url
    ).toString();

    const document = await pdfjs.getDocument({
      data: new Uint8Array(await file.arrayBuffer())
    }).promise;

    const pageTexts: string[] = [];

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      pageTexts.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
    }

    return pageTexts.join("\n\n");
  }

  throw new Error("Supported source types are .txt, .md, .pdf, and .docx.");
}

