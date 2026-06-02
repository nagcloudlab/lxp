export type AiGenerationRequest = {
  type: "program_plan" | "content_artifact";
  systemPrompt: string;
  userPrompt: string;
};

export type AiGenerationResponse = {
  text: string;
  model: string;
  provider: "ollama" | "stub";
};

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

export async function generateWithAi(
  request: AiGenerationRequest
): Promise<AiGenerationResponse> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: request.systemPrompt },
          { role: "user", content: request.userPrompt }
        ],
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 4096
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.message?.content ?? "",
      model: OLLAMA_MODEL,
      provider: "ollama"
    };
  } catch (error) {
    throw new Error(
      `Ollama not available at ${OLLAMA_BASE_URL}. Install Ollama and run: ollama pull ${OLLAMA_MODEL}. Original error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
