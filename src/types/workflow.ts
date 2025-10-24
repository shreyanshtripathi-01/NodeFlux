import { Node, Edge } from '@xyflow/react';

export type NodeType = 'trigger' | 'http' | 'ai' | 'logic' | 'output';

export interface BaseNodeData {
  label: string;
  category: NodeType;
  [key: string]: any;
}

export interface TriggerNodeData extends BaseNodeData {
  category: 'trigger';
  payload: string; // JSON string
}

export interface HttpNodeData extends BaseNodeData {
  category: 'http';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: string; // JSON string representing array of {key, value}
  body: string; // JSON string
}

export interface AiNodeData extends BaseNodeData {
  category: 'ai';
  prompt: string;
  systemInstruction?: string;
}

export interface LogicNodeData extends BaseNodeData {
  category: 'logic';
  condition: string;
}

export interface OutputNodeData extends BaseNodeData {
  category: 'output';
  outputMap: string; // JSON string representing array of {key, value} mapping
}

export type AppNode = Node<
  TriggerNodeData | HttpNodeData | AiNodeData | LogicNodeData | OutputNodeData,
  NodeType
>;

export interface ExecutionStep {
  nodeId: string;
  type: string;
  status: 'success' | 'error' | 'running';
  output?: any;
  error?: string;
  duration_ms?: number;
}

export interface ExecutionResult {
  status: 'success' | 'error';
  duration_ms: number;
  steps: ExecutionStep[];
}
