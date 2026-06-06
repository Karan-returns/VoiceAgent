// Loop 2 — post-call prompt evolution (runs after each call ends).
// Implements: Step 1 extract recurring failure patterns from analysis JSON,
// Step 2 call the LLM with the meta-prompt to generate a targeted patch/diff to
// ONE section of the base prompt, Step 3 auto-apply + save new PromptVersion,
// Step 4 keep version history linked to the triggering callId.
