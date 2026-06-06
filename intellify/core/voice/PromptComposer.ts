// PromptComposer — builds the final system message for each LLM turn.
// Implements: basePrompt (from IPromptRepository) + hidden dynamic block
// (from Loop 1) + conversation history -> messages array. Keeps mid-call
// injection auditable and out of VoiceSession.
