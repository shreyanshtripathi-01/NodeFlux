export type WorkflowRow = {
  id: string;
  user_id: string;
  name: string;
  nodes: unknown[];
  edges: unknown[];
  created_at: string;
  updated_at: string;
};

export type WorkflowListItem = {
  id: string;
  name: string;
  node_count: number;
  nodes: unknown;
  edges: unknown;
  updated_at: string;
};

export type RunRow = {
  id: string;
  workflow_id: string;
  user_id: string;
  workflow_name: string;
  status: "success" | "failed" | "running";
  started_at: string;
  duration: string;
};
