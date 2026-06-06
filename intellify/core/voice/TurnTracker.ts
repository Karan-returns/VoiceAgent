// TurnTracker — single source of truth for the diarized transcript.
// Implements: append turns with speaker/text/timestamps at capture time
// (reliable diarization), dead-air detection (>3s gaps), and producing the
// transcript consumed by analysis + the dashboard.
