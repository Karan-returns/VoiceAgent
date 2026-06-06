// Contract test for the ISttPort streaming lifecycle, exercised via MockStt.
// Verifies: connect/health, callback registration, interim+final emission with
// timestamps, push counting, stop/disconnect teardown.

import { describe, it, expect, vi } from "vitest";
import type { TranscriptResult } from "../../core/ports/ISttPort.js";
import { MockStt } from "../mocks/MockStt.js";

const audio = () => new Uint8Array([0, 1, 2, 3]);

describe("ISttPort (via MockStt)", () => {
  it("is unhealthy until connected and healthy after connect", async () => {
    const stt = new MockStt();
    expect(stt.isHealthy()).toBe(false);
    await stt.connect();
    expect(stt.isHealthy()).toBe(true);
  });

  it("emits a scripted transcript result on pushAudio", async () => {
    const result: TranscriptResult = {
      text: "hello",
      isFinal: true,
      confidence: 0.97,
      startMs: 0,
      endMs: 480,
    };
    const stt = new MockStt([result]);
    await stt.connect();

    const onTranscript = vi.fn();
    stt.start(onTranscript);
    stt.pushAudio(audio());

    expect(onTranscript).toHaveBeenCalledTimes(1);
    expect(onTranscript).toHaveBeenCalledWith(result);
    expect(stt.pushedChunks).toBe(1);
  });

  it("streams interim results before a final result", async () => {
    const interim: TranscriptResult = { text: "hel", isFinal: false, confidence: 0.6 };
    const final: TranscriptResult = { text: "hello", isFinal: true, confidence: 0.95 };
    const stt = new MockStt([interim, final]);
    await stt.connect();

    const received: TranscriptResult[] = [];
    stt.start((r) => received.push(r));
    stt.pushAudio(audio());
    stt.pushAudio(audio());

    expect(received.map((r) => r.isFinal)).toEqual([false, true]);
    expect(received[1].text).toBe("hello");
  });

  it("does not emit before start() registers a callback", async () => {
    const stt = new MockStt([{ text: "x", isFinal: true, confidence: 1 }]);
    await stt.connect();
    expect(() => stt.pushAudio(audio())).not.toThrow();
    expect(stt.pushedChunks).toBe(1);
  });

  it("stop() halts emission and disconnect() tears down", async () => {
    const stt = new MockStt([{ text: "x", isFinal: true, confidence: 1 }]);
    await stt.connect();
    const onTranscript = vi.fn();
    stt.start(onTranscript);

    stt.stop();
    await stt.disconnect();

    expect(stt.isHealthy()).toBe(false);
    // After disconnect the callback is cleared, so pushes emit nothing.
    stt.pushAudio(audio());
    expect(onTranscript).not.toHaveBeenCalled();
  });
});
