// VoiceSession — the orchestrator (VoicePipeline equivalent, framework-free).
// Implements: per-call turn state machine (LISTENING -> TRANSCRIBING -> THINKING
// -> SPEAKING), wiring STT -> LLM -> TTS via ports, barge-in handling with
// generation IDs, error handling (STT errors / LLM timeouts mid-call), and
// per-turn hooks into TurnTracker + Loop 1.
