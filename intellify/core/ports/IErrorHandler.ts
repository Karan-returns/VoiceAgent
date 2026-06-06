// Error handler port — centralized error contract shared by STT/LLM/TTS adapters.
//
// Ported from the C++ orchestrator's IErrorHandler. Providers report runtime
// errors here; the orchestrator implements it to log, track metrics, and drive
// graceful degradation / fallback mid-call.

/** Categorized error types for unified handling across providers. */
export enum ErrorType {
  // Connection errors
  ConnectionFailed = "connection_failed",
  ConnectionLost = "connection_lost",
  ConnectionTimeout = "connection_timeout",

  // Request errors
  RequestFailed = "request_failed",
  RequestTimeout = "request_timeout",
  InvalidResponse = "invalid_response",

  // Provider errors
  ProviderError = "provider_error",
  RateLimited = "rate_limited",
  QuotaExceeded = "quota_exceeded",

  // System errors
  OutOfMemory = "out_of_memory",
}

/** Structured error context for detailed reporting — mirrors C++ ErrorContext. */
export interface ErrorContext {
  type: ErrorType;
  /** Originating component, e.g. "stt" | "llm" | "tts". */
  component: string;
  message: string;
  /** Epoch milliseconds when the error occurred. */
  timestampMs: number;
  metadata?: Record<string, unknown>;
}

/**
 * Centralized error-handling contract. Providers call these to report failures
 * and recoveries; the orchestrator implements the handling logic.
 */
export interface IErrorHandler {
  /** Invoked when a provider hits an error. */
  onError(error: ErrorContext): void;

  /** Invoked when a provider recovers from an error state. */
  onRecovery(component: string): void;
}
