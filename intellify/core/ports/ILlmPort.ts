// LLM port — language-model contract (implemented by OpenAI adapter).
// Implements: streamChat(messages, signal?) -> token stream, with cancellation
// for barge-in/timeout. Reused by the agent brain, analysis, and meta-patcher.
