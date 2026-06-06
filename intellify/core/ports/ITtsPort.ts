// TTS port — text-to-speech contract (implemented by the ElevenLabs adapter).
//
// Ported from the C++ orchestrator's ISynthesizer (streaming, generation-tagged,
// interruptible) and adapted to idiomatic TypeScript. `core` depends only on
// this interface, never on the ElevenLabs SDK directly.

/**
 * A chunk of synthesized audio, tagged with the conversation turn that produced
 * it. The generationId lets the transport discard "ghost" audio from a turn the
 * user already interrupted (barge-in) — mirrors C++ `AudioStruct.generation_id`.
 */
export interface TtsAudioChunk {
  /** Raw audio bytes (PCM_S16LE) for playback. */
  data: Uint8Array;
  /** Conversation turn ID this audio belongs to (for ghost-packet filtering). */
  generationId: number;
  /** Output sample rate in Hz (defaults defined by the adapter). */
  sampleRate?: number;
}

/** Invoked for each chunk of synthesized audio as it streams in. */
export type AudioChunkCallback = (chunk: TtsAudioChunk) => void;

/**
 * Streaming text-to-speech contract.
 *
 * Cancellation: pass an AbortSignal to stop synthesis instantly when the user
 * talks over the agent — mirrors the C++ `interrupt()` semantics.
 */
export interface ITtsPort {
  /**
   * Establish connection and validate configuration.
   * @throws if the connection cannot be established (caller handles fallback).
   */
  connect(): Promise<void>;

  /** Tear down the connection and release resources. Idempotent. */
  disconnect(): Promise<void>;

  /**
   * Synthesize speech from text, streaming audio chunks as they are generated.
   * @param text the text to speak.
   * @param generationId conversation turn ID used to tag emitted audio chunks.
   * @param onAudio callback receiving each synthesized audio chunk.
   * @param signal optional AbortSignal to cancel mid-synthesis (barge-in).
   */
  speakStream(
    text: string,
    generationId: number,
    onAudio: AudioChunkCallback,
    signal?: AbortSignal,
  ): Promise<void>;

  /** True when the connection is established and ready to synthesize. */
  isHealthy(): boolean;
}
