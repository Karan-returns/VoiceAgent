// LLM port — language-model contract (implemented by the OpenAI adapter).
//
// Ported from the C++ orchestrator's ILanguageModel (streaming, callback-driven,
// interruptible) and adapted to idiomatic TypeScript. Reused by three callers:
//   • the agent brain   — streamResponse() for low time-to-first-token
//   • call analysis     — complete() for one-shot structured JSON
//   • Loop 2 meta-patch — complete() for prompt-diff generation
// `core` depends only on this interface, never on the OpenAI SDK directly.

/** Role of a chat message in the conversation history. */
export type ChatRole = "system" | "user" | "assistant";

/** A single message in the LLM conversation history. */
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** Callbacks for a streaming generation. */
export interface LlmStreamCallbacks {
  /** Invoked for each token/chunk as it arrives (drives early TTS). */
  onToken: (token: string) => void;
  /** Invoked once when the stream completes, with the full response text. */
  onComplete: (fullText: string) => void;
}

/**
 * Streaming language-model contract.
 *
 * Cancellation: pass an AbortSignal to stop generation for barge-in (user talks
 * over the agent) or timeouts — mirrors the C++ `interrupt()` semantics.
 */
export interface ILlmPort {
  /**
   * Establish connection and validate configuration.
   * @throws if the connection cannot be established (caller handles fallback).
   */
  connect(): Promise<void>;

  /** Tear down the connection and release resources. Idempotent. */
  disconnect(): Promise<void>;

  /**
   * Stream a response token-by-token (used by the live agent brain).
   * @param messages full conversation history (system + turns).
   * @param callbacks onToken / onComplete handlers.
   * @param signal optional AbortSignal to cancel mid-generation (barge-in/timeout).
   */
  streamResponse(
    messages: ChatMessage[],
    callbacks: LlmStreamCallbacks,
    signal?: AbortSignal,
  ): Promise<void>;

  /**
   * Generate a complete response in one shot (used by analysis + Loop 2).
   * @param messages full conversation/prompt history.
   * @param signal optional AbortSignal to cancel on timeout.
   * @returns the full response text.
   */
  complete(messages: ChatMessage[], signal?: AbortSignal): Promise<string>;

  /** True when the connection is established and ready to accept requests. */
  isHealthy(): boolean;
}
