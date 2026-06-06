# Analysis Prompt — QA Scorecard

<!--
The prompt used by analyzeCall. Will instruct the LLM to score the diarized
transcript against the fixed rubric, classify each agent turn into a call-flow
stage, track per-turn sentiment + trend, count filler words / response length,
find unresolved objections, and emit the strict JSON scorecard. Hard rule:
ground every score in transcript evidence (no hallucinated analysis).
-->
