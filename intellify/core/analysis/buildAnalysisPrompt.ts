// buildAnalysisPrompt — pure prompt builder for the QA analysis pass.
// Implements: templates the diarized transcript into the analysis prompt with
// the fixed rubric, call-flow stages, sentiment + agent-signal instructions,
// and a strict "ground every score in the transcript" rule.
