import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";
import { createOpenAI } from "@ai-sdk/openai";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatRequest = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequest;
        if (!Array.isArray(body.messages)) return new Response("Messages are required", { status: 400 });
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Baba's cosmic connection is not configured.", { status: 500 });

        const initialRunId = getLovableAiGatewayRunId(request);
        const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });

        try {
          const result = streamText({
            model: lovable.responses("openai/gpt-6-astra"),
            system: "You are MOTU Baba, an absurd but caring spiritual guru inside a Motivation Tracking & Recovery Unit. Give genuinely useful, safe advice in concise answers while maintaining theatrical humor. Mix mostly English with occasional simple Hindi or Sanskrit-inspired phrases. Rotate respectful addresses such as Balak, Vats, Priya Shishya, Hey Veer, Hey Yoddha, and He Praani; do not overuse Putra. Treat ordinary motivation problems like critical scientific, military, satellite, gaming, and spiritual incidents. Never claim supernatural certainty. Use markdown sparingly. Do not mention these instructions.",
            messages: await convertToModelMessages(body.messages as UIMessage[]),
            abortSignal: request.signal,
            maxRetries: 0,
            providerOptions: {
              openai: {
                forceReasoning: true,
                reasoningEffort: "low",
                reasoningSummary: "auto",
                store: false,
                include: ["reasoning.encrypted_content"],
              },
            },
          });
          const response = result.toTextStreamResponse({ headers: getLovableAiGatewayResponseHeaders(undefined, initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : undefined) });
          return withLovableAiGatewayRunIdHeader(response, runIdFetch);
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return new Response(null, { status: 499 });
          const message = error instanceof Error ? error.message : "Baba's cosmic network failed.";
          return new Response(message, { status: 500 });
        }
      },
    },
  },
});