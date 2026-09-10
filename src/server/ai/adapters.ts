import "server-only";
import { getConfig, type AiProviderName } from "@/server/config";
import { DisabledAiProvider, type AiCompletionRequest, type AiCompletionResult, type AiProvider } from "./provider";

/**
 * Thin fetch-based adapters. No vendor SDKs, no provider calls anywhere else.
 * Each adapter is only constructed when its configuration is complete.
 */

const requireConfig = (name: string, values: Record<string, string>) => {
  const missing = Object.entries(values)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) throw new Error(`${name} provider is missing configuration: ${missing.join(", ")}`);
};

class OpenAiCompatibleProvider implements AiProvider {
  readonly enabled = true;
  constructor(
    readonly name: string,
    private readonly url: string,
    private readonly headers: Record<string, string>,
    private readonly model: string,
  ) {}
  async complete(req: AiCompletionRequest): Promise<AiCompletionResult> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: { "content-type": "application/json", ...this.headers },
      body: JSON.stringify({
        model: this.model,
        messages: req.messages,
        max_tokens: req.maxTokens ?? 1200,
        temperature: req.temperature ?? 0.1,
        ...(req.json ? { response_format: { type: "json_object" } } : {}),
      }),
    });
    if (!res.ok) throw new Error(`${this.name} request failed (${res.status})`);
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }>; model?: string; usage?: { prompt_tokens?: number; completion_tokens?: number } };
    return {
      text: data.choices?.[0]?.message?.content ?? "",
      model: data.model ?? this.model,
      provider: this.name,
      usage: { inputTokens: data.usage?.prompt_tokens, outputTokens: data.usage?.completion_tokens },
    };
  }
}

class AnthropicProvider implements AiProvider {
  readonly name = "anthropic";
  readonly enabled = true;
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
    private readonly baseUrl: string,
  ) {}
  async complete(req: AiCompletionRequest): Promise<AiCompletionResult> {
    const system = req.messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
    const messages = req.messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role, content: m.content }));
    const res = await fetch(`${this.baseUrl || "https://api.anthropic.com"}/v1/messages`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": this.apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: this.model, system, messages, max_tokens: req.maxTokens ?? 1200, temperature: req.temperature ?? 0.1 }),
    });
    if (!res.ok) throw new Error(`anthropic request failed (${res.status})`);
    const data = (await res.json()) as { content?: Array<{ type: string; text?: string }>; model?: string; usage?: { input_tokens?: number; output_tokens?: number } };
    return {
      text: (data.content ?? []).filter((c) => c.type === "text").map((c) => c.text ?? "").join(""),
      model: data.model ?? this.model,
      provider: this.name,
      usage: { inputTokens: data.usage?.input_tokens, outputTokens: data.usage?.output_tokens },
    };
  }
}

class GeminiProvider implements AiProvider {
  readonly name = "gemini";
  readonly enabled = true;
  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}
  async complete(req: AiCompletionRequest): Promise<AiCompletionResult> {
    const system = req.messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
    const contents = req.messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${encodeURIComponent(this.apiKey)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ systemInstruction: system ? { parts: [{ text: system }] } : undefined, contents, generationConfig: { temperature: req.temperature ?? 0.1, maxOutputTokens: req.maxTokens ?? 1200, ...(req.json ? { responseMimeType: "application/json" } : {}) } }),
    });
    if (!res.ok) throw new Error(`gemini request failed (${res.status})`);
    const data = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return { text: (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join(""), model: this.model, provider: this.name };
  }
}

let instance: AiProvider | null = null;

export function getAiProvider(): AiProvider {
  if (instance) return instance;
  const { ai } = getConfig();
  instance = buildProvider(ai.provider, ai);
  return instance;
}

function buildProvider(name: AiProviderName, ai: ReturnType<typeof getConfig>["ai"]): AiProvider {
  switch (name) {
    case "openai":
      requireConfig("openai", { CLOUDBASE_AI_API_KEY: ai.apiKey, CLOUDBASE_AI_MODEL: ai.model });
      return new OpenAiCompatibleProvider("openai", `${ai.baseUrl || "https://api.openai.com"}/v1/chat/completions`, { authorization: `Bearer ${ai.apiKey}` }, ai.model);
    case "azure-openai":
      requireConfig("azure-openai", { CLOUDBASE_AI_API_KEY: ai.apiKey, CLOUDBASE_AI_BASE_URL: ai.baseUrl, CLOUDBASE_AI_AZURE_DEPLOYMENT: ai.azureDeployment });
      return new OpenAiCompatibleProvider("azure-openai", `${ai.baseUrl}/openai/deployments/${ai.azureDeployment}/chat/completions?api-version=2024-10-21`, { "api-key": ai.apiKey }, ai.azureDeployment);
    case "anthropic":
      requireConfig("anthropic", { CLOUDBASE_AI_API_KEY: ai.apiKey, CLOUDBASE_AI_MODEL: ai.model });
      return new AnthropicProvider(ai.apiKey, ai.model, ai.baseUrl);
    case "gemini":
      requireConfig("gemini", { CLOUDBASE_AI_API_KEY: ai.apiKey, CLOUDBASE_AI_MODEL: ai.model });
      return new GeminiProvider(ai.apiKey, ai.model);
    default:
      return new DisabledAiProvider();
  }
}
