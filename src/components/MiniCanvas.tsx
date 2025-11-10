"use client";

import React from "react";
import {
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { nodeTypes } from "@/components/editor/nodes";

function MiniCanvasInner({ nodes, edges }: { nodes: any[]; edges: any[] }) {
  return (
    <div className="w-full h-[130px] border border-border-custom rounded-md overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        colorMode="light"
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      />
    </div>
  );
}

export default function MiniCanvas({
  nodes,
  edges,
}: {
  nodes: any[];
  edges: any[];
}) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="w-full h-[130px] border border-dashed border-border-custom rounded-md flex items-center justify-center">
        <span className="font-mono text-xs text-muted-text">empty</span>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <MiniCanvasInner nodes={nodes} edges={edges} />
    </ReactFlowProvider>
  );
}