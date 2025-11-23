import { runInput, runPrompt, runHttp, runTransform, runOutput } from "./nodes";

export type ExecutionLogEntry = {
  nodeId: string;
  kind: string;
  startedAt: string;
  finishedAt: string;
  status: "success" | "failed";
  output?: any;
  error?: string;
};

export type ExecutionResult = {
  logs: ExecutionLogEntry[];
  nodeOutputs: Record<string, any>;
  finalOutput: any;
};

type Edge = { source: string; target: string };

export async function execute(opts: {
  nodes: any[];
  edges: Edge[];
  workflowInput: Record<string, any>;
}): Promise<ExecutionResult> {
  const { nodes, edges, workflowInput } = opts;
  const adjacency: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};
  const nodeMap: Record<string, any> = {};

  for (const n of nodes) {
    nodeMap[n.id] = n;
    adjacency[n.id] = [];
    inDegree[n.id] = 0;
  }

  for (const e of edges) {
    if (adjacency[e.source]) {
      adjacency[e.source].push(e.target);
      inDegree[e.target] = (inDegree[e.target] || 0) + 1;
    }
  }

  const queue: string[] = [];
  for (const [id, deg] of Object.entries(inDegree)) {
    if (deg === 0) queue.push(id);
  }

  const order: string[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);
    for (const neighbor of adjacency[node] || []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }

  if (order.length !== nodes.length) {
    throw new Error("workflow contains a cycle");
  }

  const logs: ExecutionLogEntry[] = [];
  const nodeOutputs: Record<string, any> = {};

  for (const nodeId of order) {
    const node = nodeMap[nodeId];
    const kind = node.data?.type || "unknown";
    const startedAt = new Date().toISOString();

    try {
      let output: any;
      const ctx = { workflowInput, nodeOutputs };

      switch (kind) {
        case "Input":
          output = await runInput(node.data, ctx);
          break;
        case "Prompt":
          output = await runPrompt(node.data, ctx);
          break;
        case "HTTP":
          output = await runHttp(node.data, ctx);
          break;
        case "Transform":
          output = await runTransform(node.data, ctx);
          break;
        case "Output":
          output = await runOutput(node.data, ctx);
          break;
        default:
          throw new Error(`unknown node type: ${kind}`);
      }

      nodeOutputs[nodeId] = output;
      logs.push({
        nodeId,
        kind,
        startedAt,
        finishedAt: new Date().toISOString(),
        status: "success",
        output,
      });
    } catch (error: any) {
      nodeOutputs[nodeId] = { error: error.message };
      logs.push({
        nodeId,
        kind,
        startedAt,
        finishedAt: new Date().toISOString(),
        status: "failed",
        error: error.message,
      });
      throw { partialLogs: logs, nodeOutputs, error: error.message };
    }
  }

  const lastNode = nodes[nodes.length - 1];
  const finalOutput = lastNode ? nodeOutputs[lastNode.id] : null;

  return { logs, nodeOutputs, finalOutput };
}
