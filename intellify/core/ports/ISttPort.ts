// STT port — speech-to-text contract (implemented by the Deepgram adapter).
//
// Ported from the C++ orchestrator's ITranscriber (streaming, callback-driven,
// connection-managed) and adapted to idiomatic TypeScript. `core` depends only
// on this interface, never on the Deepgram SDK directly.

/**
 * Raw audio payload pushed to the transcriber.
 * 16 kHz mono PCM (signed 16-bit little-endian) as raw bytes — mirrors the
 * C++ `push_audio(std::vector<uint8_t>)` contract.
 */
export type AudioChunk = Uint8Array;

/**
 * A single STT update. Supports both interim (speculative, low-latency) and
 * final (committed) results — mirrors C++ `common::TranscriptResult`.
 *
 * NOTE: This is a provider-level result, distinct from the diarized
 * `TranscriptTurn` in `shared/Transcript.ts`. TurnTracker consumes these
 * results and assembles labelled turns.
 */
export interface TranscriptResult {
  /** Recognized text for this update. */
  text: string;
  /** True when committed; false for interim/speculative hypotheses. */
  isFinal: boolean;
  /** Provider confidence in [0, 1]. */
  confidence: number;
  /** Offset (ms from call start) where this speech segment began. */
  startMs?: number;
  /** Offset (ms from call start) where this speech segment ended. */
  endMs?: number;
}

/** Receives interim/final transcripts as they stream in. */
export type TranscriptCallback = (result: TranscriptResult) => void;

/**
 * Streaming speech-to-text transport contract.
 *
 * Lifecycle: connect() → start(cb) → pushAudio()* → stop() → disconnect().
 * Implementations must be safe to call stop()/disconnect() at any time.
 */
export interface ISttPort {
  /**
   * Establish the streaming connection and validate configuration.
   * @throws if the connection cannot be established (caller handles fallback).
   */
  connect(): Promise<void>;

  /** Tear down the connection and release resources. Idempotent. */
  disconnect(): Promise<void>;

  /**
   * Begin transcription, delivering interim + final results via the callback.
   * @param onTranscript invoked for every interim/final update.
   */
  start(onTranscript: TranscriptCallback): void;

  /** Stop delivering results without tearing down the connection. */
  stop(): void;

  /**
   * Push a chunk of raw audio for transcription.
   * @param chunk 16 kHz mono PCM_S16LE bytes.
   */
  pushAudio(chunk: AudioChunk): void;

  /** True when the connection is established and ready to accept audio. */
  isHealthy(): boolean;
}
