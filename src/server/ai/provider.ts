/**
 * Provider-neutral AI seam. UI and services only talk to `AiProvider`.
 * Adapters live in ./adapters.ts and are selected by configuration. The
 * platform must remain fully useful with `DisabledAiProvider`.
 */

export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiCompletionRequest {
  messages: AiMessage[];
  maxTokens?: number;
  temperature?: number;
  /** Ask for strict JSON output when the provider supports it. */
  json?: boolean;
}

export interface AiCompletionResult {
  text: string;
  model: string;
  provider: string;
  usage?: { inputTokens?: number; outputTokens?: number };
}

export interface AiProvider {
  readonly name: string;
  readonly enabled: boolean;
  complete(request: AiCompletionRequest): Promise<AiCompletionResult>;
}

export class AiDisabledError extends Error {
  constructor() {
    super("AI provider is disabled. CloudBase is running in governed retrieval mode.");
  }
}

export class DisabledAiProvider implements AiProvider {
  readonly name = "disabled";
  readonly enabled = false;
  async complete(): Promise<AiCompletionResult> {
    throw new AiDisabledError();
  }
}
