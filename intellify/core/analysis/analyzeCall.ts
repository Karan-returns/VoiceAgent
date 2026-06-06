// analyzeCall — orchestrates the analysis pipeline (pure, port-driven).
// Implements: takes a diarized transcript -> buildAnalysisPrompt -> ILlmPort ->
// parseScorecard -> AnalysisScorecard (rubric_score, sentiment_arc, call_flow,
// flags, agent_signals, improvement_areas). Also feeds Loop 2 failure extraction.
