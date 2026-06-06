// Agent entry (composition root) — the LiveKit voice worker.
// Implements: wire concrete adapters (LiveKit transport/recorder, Deepgram STT,
// OpenAI LLM, ElevenLabs TTS, Mongo repos) into a VoiceSession per room, load the
// active base prompt, run Loop 1 live, and trigger Loop 2 + analysis on call end.
