// Transcript domain types — the diarized, turn-level transcript.
//
// These are domain types (the "what"), distinct from the provider-level
// `TranscriptResult` in core/ports/ISttPort.ts (the raw STT stream). TurnTracker
// consumes STT results + agent output and assembles these labelled turns, which
// then feed recording, analysis, and the dashboard.

/** Who is speaking in a given turn. */
export type Speaker = "Agent" | "Customer";

/**
 * A single diarized turn — one continuous block of speech by one speaker.
 * Timestamps are offsets in milliseconds from the start of the call, enabling
 * the `[00:00:04] Agent: ...` style transcript and timeline alignment.
 */
export interface TranscriptTurn {
  /** Who spoke this turn. */
  speaker: Speaker;
  /** The spoken text for this turn. */
  text: string;
  /** Offset (ms from call start) when this turn began. */
  startMs: number;
  /** Offset (ms from call start) when this turn ended. */
  endMs: number;
  /** STT confidence in [0, 1] for customer turns (optional, agent turns omit). */
  confidence?: number;
}

/**
 * A detected gap where neither party spoke for longer than the dead-air
 * threshold (>3s per the assignment). Flagged on the transcript + analysis.
 */
export interface DeadAirSegment {
  /** Offset (ms from call start) when the silence began. */
  startMs: number;
  /** Offset (ms from call start) when the silence ended. */
  endMs: number;
  /** Convenience: endMs - startMs. */
  durationMs: number;
}

/** The full ordered list of diarized turns for a call. */
export type DiarizedTranscript = TranscriptTurn[];

/** Dead-air threshold in milliseconds (gaps longer than this are flagged). */
export const DEAD_AIR_THRESHOLD_MS = 3000;
