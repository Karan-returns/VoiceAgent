// DeepgramStt — implements ISttPort using Deepgram Nova-2 streaming.
// Implements: open a live transcription socket, push audio frames, emit interim
// + final transcripts with timestamps; surfaces STT errors to VoiceSession.
