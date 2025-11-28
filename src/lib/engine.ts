import { AppNode, ExecutionResult, ExecutionStep } from '@/types/workflow';
import { Edge } from '@xyflow/react';

// Basic state registry for interpolation
type StateRegistry = Record<string, any>;

function interpolate(template: string, state: StateRegistry): string {
  if (!template) return '';
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const keys = path.trim().split('.');
    let value = state;
    for (const key of keys) {
      if (value === undefined || value === null) return match;
      value = value[key];
    }
    return value !== undefined ? String(value) : match;
  });
}

export async function executeDAG(nodes: AppNode[], edges: Edge[]): Promise<ExecutionResult> {
  const startTime = Date.now();
  const steps: ExecutionStep[] = [];
  const state: StateRegistry = {};

  try {
    // 1. Build adjacency list and in-degrees
    const adjList = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach((n) => {
      adjList.set(n.id, []);
      inDegree.set(n.id, 0);
    });

    edges.forEach((e) => {
      // In Logic nodes, we might only want to follow the true/false branch.
      // But for static topological sort, we build the basic graph. 
      // Dynamic execution actually walks the graph dynamically.
      if (adjList.has(e.source)) {
        adjList.get(e.source)!.push(e.target);
      }
      if (inDegree.has(e.target)) {
        inDegree.set(e.target, inDegree.get(e.target)! + 1);
      }
    });

    // 2. Find nodes with 0 in-degree
    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) queue.push(nodeId);
    });

    let executedCount = 0;

    // 3. Process Queue
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const node = nodes.find((n) => n.id === currentId);
      if (!node) continue;

      const stepStart = Date.now();
      let output: any = null;
      let status: 'success' | 'error' = 'success';
      let errorStr: string | undefined = undefined;
      let branch: string | undefined = undefined;

      try {
        // Execute based on category
        switch (node.type) {
          case 'trigger':
            output = node.data.payload ? JSON.parse(node.data.payload as string) : {};
            break;
            
          case 'http':
            const url = interpolate(node.data.url as string, state);
            const method = node.data.method as string;
            const headersStr = interpolate(node.data.headers as string || '{}', state);
            const bodyStr = interpolate(node.data.body as string || '{}', state);
            
            const headers = JSON.parse(headersStr);
            const reqInit: RequestInit = { method, headers };
            if (method !== 'GET' && method !== 'DELETE') {
              reqInit.body = bodyStr;
            }
            
            const res = await fetch(url, reqInit);
            const resText = await res.text();
            try {
              output = JSON.parse(resText);
            } catch {
              output = resText;
            }
            break;

          case 'ai':
            const prompt = interpolate(node.data.prompt as string, state);
            const aiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + process.env.GEMINI_API_KEY, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
              })
            });
            if (!aiRes.ok) throw new Error(`AI API failed: ${aiRes.statusText}`);
            const aiData = await aiRes.json();
            output = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            break;
            
          case 'logic':
            // VERY basic JS eval for demonstration. In production, use a safe evaluator!
            const condition = interpolate(node.data.condition as string, state);
            // Safe eval wrapper
            const fn = new Function('return ' + condition);
            const result = !!fn();
            output = { result };
            branch = result ? 'true' : 'false';
            break;
            
          case 'output':
            // Collect all state
            output = { ...state };
            break;
            
          default:
            output = { skipped: true };
        }
        
        state[node.id] = { output };

      } catch (err: any) {
        status = 'error';
        errorStr = err.message;
        state[node.id] = { error: errorStr };
      }

      steps.push({
        nodeId: node.id,
        type: node.type,
        status,
        output,
        error: errorStr,
        duration_ms: Date.now() - stepStart
      });

      executedCount++;

      // Stop execution of this branch if error
      if (status === 'error') break;

      // Add neighbors to queue
      const neighbors = adjList.get(node.id) || [];
      for (const neighborId of neighbors) {
        // If it's a logic node, only process the edge that matches the branch
        if (node.type === 'logic' && branch) {
          const edgeToNeighbor = edges.find(e => e.source === node.id && e.target === neighborId);
          if (edgeToNeighbor && edgeToNeighbor.sourceHandle !== branch) {
            // Skip this neighbor since it's on the wrong branch
            // We need to decrement its in-degree though, so it doesn't block
            inDegree.set(neighborId, inDegree.get(neighborId)! - 1);
            if (inDegree.get(neighborId) === 0) queue.push(neighborId);
            continue;
          }
        }

        inDegree.set(neighborId, inDegree.get(neighborId)! - 1);
        if (inDegree.get(neighborId) === 0) {
          queue.push(neighborId);
        }
      }
    }

    const hasError = steps.some(s => s.status === 'error');

    return {
      status: hasError ? 'error' : 'success',
      duration_ms: Date.now() - startTime,
      steps
    };

  } catch (err: any) {
    return {
      status: 'error',
      duration_ms: Date.now() - startTime,
      steps: [...steps, { nodeId: 'sys', type: 'system', status: 'error', error: err.message }]
    };
  }
}
