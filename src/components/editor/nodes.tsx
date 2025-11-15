import React from "react";
import { Handle, type NodeProps, type Node, Position } from "@xyflow/react";

export type WorkflowNodeData = {
  type: "Input" | "Prompt" | "HTTP" | "Transform" | "Output";
  label: string;
  preview: string;
  nodeId: string;
};

export type WorkflowNode = Node<WorkflowNodeData>;

export function WorkflowNodeComponent(props: NodeProps) {
  const { data, selected } = props;
  const nodeData = data as WorkflowNodeData;

  return (
    <div
      className={`w-[220px] bg-background border rounded-md ${
        selected ? "border-foreground border-2" : "border-border-custom"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-foreground !border-none !rounded-none"
        style={{ left: -4 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-foreground !border-none !rounded-none"
        style={{ right: -4 }}
      />

      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-mono text-[11px] tracking-wider text-muted-text">
            {nodeData.type}
          </span>
          <span className="font-mono text-[10px] text-muted-text">
            #{nodeData.nodeId.slice(-4)}
          </span>
        </div>
        <span className="font-mono text-sm font-semibold text-primary-text">
          {nodeData.label}
        </span>
      </div>
    </div>
  );
}

export const nodeTypes = {
  workflowNode: WorkflowNodeComponent,
};