import { NextResponse } from "next/server";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(3000)
    });

    if (!response.ok) {
      return NextResponse.json({
        status: "offline",
        message: "Ollama is running but returned an error",
        url: OLLAMA_BASE_URL,
        model: OLLAMA_MODEL
      });
    }

    const data = await response.json();
    const models = (data.models || []).map(
      (m: { name: string }) => m.name
    );
    const hasModel = models.some((name: string) =>
      name.startsWith(OLLAMA_MODEL.split(":")[0])
    );

    return NextResponse.json({
      status: hasModel ? "ready" : "missing_model",
      message: hasModel
        ? `Ollama is running with ${OLLAMA_MODEL}`
        : `Ollama is running but ${OLLAMA_MODEL} is not pulled. Run: ollama pull ${OLLAMA_MODEL}`,
      url: OLLAMA_BASE_URL,
      model: OLLAMA_MODEL,
      availableModels: models
    });
  } catch {
    return NextResponse.json({
      status: "offline",
      message: `Ollama not found at ${OLLAMA_BASE_URL}. Install from ollama.com and run: ollama pull ${OLLAMA_MODEL}`,
      url: OLLAMA_BASE_URL,
      model: OLLAMA_MODEL
    });
  }
}
