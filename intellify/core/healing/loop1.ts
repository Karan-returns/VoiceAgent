// Loop 1 — real-time mid-call correction (runs on every final transcript turn).
// Implements: fast rule/regex detection of failure signals (escalation words
// like "cancel"/"manager"/"lawsuit", CAPS+punctuation, >3s dead air, repeated
// unanswered objection, sentiment dropping 2 levels) and returns a hidden
// MidCallInjection system block for the next turn. Must stay <300ms (no LLM).
