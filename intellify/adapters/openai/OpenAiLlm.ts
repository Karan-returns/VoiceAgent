// OpenAiLlm — implements ILlmPort using OpenAI GPT-4o.
// Implements: streaming chat completion with AbortSignal support (barge-in /
// timeout), token streaming for low TTFA. Reused by agent brain, analysis, Loop 2.
