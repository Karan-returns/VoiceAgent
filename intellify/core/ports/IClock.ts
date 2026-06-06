// Clock port — injectable time source.
// Implements: now() used for turn timestamps + dead-air detection so core logic
// is deterministic and testable (mock clock in unit tests).
