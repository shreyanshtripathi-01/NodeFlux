import { callGemini } from "@/lib/gemini";
import { interpolate } from "./interpolate";

export type NodeContext = {
  workflowInput: Record<string, any>;
  nodeOutputs: Record<string, any>;
};

export async function runInput(
  nodeData: any,
  ctx: NodeContext
): Promise<any> {
  return ctx.workflowInput;
}

export async function runPrompt(
  nodeData: any,
  ctx: NodeContext
): Promise<any> {
  const systemPrompt = interpolate(nodeData.config?.systemPrompt || "", ctx.nodeOutputs);
  const userPrompt = interpolate(nodeData.config?.userPrompt || "", ctx.nodeOutputs);
  const temperature = nodeData.config?.temperature ?? 0.7;

  const result = await callGemini({ systemPrompt, userPrompt, temperature });
  return { text: result.text, raw: result.raw };
}

export async function runHttp(
  nodeData: any,
  ctx: NodeContext
): Promise<any> {
  const url = interpolate(nodeData.config?.url || "", ctx.nodeOutputs);
  const method = nodeData.config?.method || "GET";
  const headers = nodeData.config?.headers || {};
  const resolvedHeaders: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) {
    resolvedHeaders[k] = typeof v === "string" ? interpolate(v, ctx.nodeOutputs) : String(v);
  }

  let body: string | undefined;
  if (nodeData.config?.body && method !== "GET") {
    body = typeof nodeData.config.body === "string"
      ? interpolate(nodeData.config.body, ctx.nodeOutputs)
      : JSON.stringify(nodeData.config.body);
  }

  const res = await fetch(url, {
    method,
    headers: { ...resolvedHeaders, "Content-Type": "application/json" },
    body,
  });

  const text = await res.text();
  let parsed: any = text;
  try { parsed = JSON.parse(text); } catch {}

  return { status: res.status, body: parsed, raw: text };
}

export async function runTransform(
  nodeData: any,
  ctx: NodeContext
): Promise<any> {
  const code = nodeData.config?.code || "return input;";
  const input = ctx.nodeOutputs;
  const fn = new Function("input", "nodes", code);
  return fn(input, ctx.nodeOutputs);
}

export async function runOutput(
  nodeData: any,
  ctx: NodeContext
): Promise<any> {
  return ctx.nodeOutputs;
}
