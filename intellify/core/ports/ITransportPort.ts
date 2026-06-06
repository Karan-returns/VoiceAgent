// Transport port — WebRTC audio in/out contract (implemented by LiveKit adapter).
// Implements: onUserAudio (mic in), sendAudio (TTS out), and barge-in flush
// (beginFlush/clear) so VoiceSession stays free of LiveKit-specific types.
