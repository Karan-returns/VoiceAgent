// parseScorecard — validates the LLM analysis output.
// Implements: a schema (e.g. Zod) that parses raw JSON into AnalysisScorecard,
// rejecting/retrying on malformed or hallucinated fields so output is trustworthy.
