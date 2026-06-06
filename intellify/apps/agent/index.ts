// Agent entry (SPIKE) — minimal LiveKit voice loop to validate the pipeline.
//
// Goal: prove "user says hello -> agent replies" end-to-end (STT -> LLM -> TTS)
// with barge-in handled by the framework. Intentionally isolated from core/ports
// for now; TurnTracker, recording, healing, and prompt versioning come later.
//
// Run:   npx tsx apps/agent/index.ts dev
// Test:  https://agents-playground.livekit.io  (connect to your LiveKit project)

import {
  type JobContext,
  type JobProcess,
  cli,
  defineAgent,
  ServerOptions,
  voice,
} from "@livekit/agents";
import * as deepgram from "@livekit/agents-plugin-deepgram";
import { LLM } from "@livekit/agents-plugin-google";
import * as silero from "@livekit/agents-plugin-silero";
import { fileURLToPath } from "node:url";
import "dotenv/config";

// Inline NovaTel persona for the spike. The real, versioned Prompt v1 will live
// in prompts/v1-novatel-system.md and be loaded via IPromptRepository later.
const NOVATEL_SYSTEM_PROMPT = [
  "You are a customer support representative for NovaTel, a telecom company.",
  "You handle billing complaints (double charges, plan cancellations, late fees,",
  "and requests for a manager). Greet the caller, acknowledge their issue before",
  "offering a solution, and explain any pricing or refund policy clearly.",
  "Keep responses concise (1-3 sentences) and natural — this is a phone call.",
].join(" ");

export default defineAgent({
  // Load Silero VAD once per worker process (turn detection + barge-in).
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load();
  },

  entry: async (ctx: JobContext) => {
    await ctx.connect();

    const agent = new voice.Agent({ instructions: NOVATEL_SYSTEM_PROMPT });

    const session = new voice.AgentSession({
      vad: ctx.proc.userData.vad as silero.VAD,
      stt: new deepgram.STT({
        model: "nova-2-phonecall",
        language: "en",
        interimResults: true,
        smartFormat: true,
        punctuate: true,
      }),
      llm: new LLM({
        model: "gemini-2.0-flash",
        apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY,
      }),
      tts: new deepgram.TTS({ model: "aura-2-thalia-en" }),
    });

    await session.start({ agent, room: ctx.room });

    // Agent speaks first so the caller hears a greeting on connect.
    await session.generateReply({
      instructions:
        "Greet the caller as NovaTel billing support and ask how you can help.",
    });
  },
});

cli.runApp(new ServerOptions({ agent: fileURLToPath(import.meta.url) }));
