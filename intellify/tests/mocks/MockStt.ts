// MockStt — in-memory ISttPort implementation for tests.
//
// Mirrors the orchestrator's MockStt: pushing audio synchronously emits a
// pre-scripted TranscriptResult through the registered callback. Lets us test
// core logic (VoiceSession, TurnTracker) without hitting Deepgram.

import type {
  AudioChunk,
  ISttPort,
  TranscriptCallback,
  TranscriptResult,
} from "../../core/ports/ISttPort.js";

export class MockStt implements ISttPort {
  // --- introspection for assertions ---
  connected = false;
  started = false;
  pushedChunks = 0;

  /** Scripted results emitted, one per pushAudio() call (round-robin). */
  private scriptedResults: TranscriptResult[];
  private callback?: TranscriptCallback;
  private emitIndex = 0;

  constructor(scriptedResults: TranscriptResult[] = []) {
    this.scriptedResults = scriptedResults;
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.started = false;
    this.callback = undefined;
  }

  start(onTranscript: TranscriptCallback): void {
    this.started = true;
    this.callback = onTranscript;
  }

  stop(): void {
    this.started = false;
  }

  pushAudio(_chunk: AudioChunk): void {
    this.pushedChunks += 1;
    if (!this.callback || this.scriptedResults.length === 0) return;
    const result = this.scriptedResults[this.emitIndex % this.scriptedResults.length];
    this.emitIndex += 1;
    this.callback(result);
  }

  isHealthy(): boolean {
    return this.connected;
  }

  /** Manually emit a result (for tests that drive emissions explicitly). */
  emit(result: TranscriptResult): void {
    this.callback?.(result);
  }
}
