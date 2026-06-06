# Intellify — NovaTel Voice Agent (Self-Healing)

<!--
Submission README. Will cover: architecture (hexagonal: shared -> core -> adapters
-> apps), setup instructions, the two self-healing loops, and ALL prompts
(v1 base, analysis-qa, meta-patch, evolved v2+). Backend only for now (frontend
added later).

Layout:
- shared/    domain types (framework-free)
- core/      orchestrator + business rules (voice, healing, analysis, ports)
- adapters/  providers/infra (livekit, deepgram, openai, elevenlabs, mongo)
- apps/      composition roots (agent worker, express server)
- prompts/   v1 + meta + evolved versions
- tests/     core unit tests (loops, analysis, turn tracker)
-->
