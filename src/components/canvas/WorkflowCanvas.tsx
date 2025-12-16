'use client';

import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  ConnectionMode,
  type DefaultEdgeOptions,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '@/store/workflowStore';
import { nodeTypes } from '../nodes';
import NodePalette from './NodePalette';
import PropertiesPanel from './PropertiesPanel';
import ExecutionConsole from '../execution/ExecutionConsole';
import TopBar from '../layout/TopBar';

const defaultViewport = { x: 0, y: 0, zoom: 1.2 };
const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
  style: { stroke: '#404040', strokeWidth: 1.5 },
};

function FlowCanvas({ workflowId, initialName }: { workflowId: string; initialName: string }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [workflowName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectedNode,
    setSelectedNode,
    setIsRunning,
    setExecutionResult,
  } = useWorkflowStore();

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const labelMap: Record<string, string> = {
        trigger: 'Trigger',
        http: 'HTTP Request',
        ai: 'AI Processing',
        logic: 'Condition',
        output: 'Output',
      };

      const newNode = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: {
          label: labelMap[type] || type,
          category: type,
          method: type === 'http' ? 'GET' : undefined,
          url: type === 'http' ? '' : undefined,
          headers: type === 'http' ? '' : undefined,
          body: type === 'http' ? '' : undefined,
          payload: type === 'trigger' ? '{}' : undefined,
          prompt: type === 'ai' ? '' : undefined,
          condition: type === 'logic' ? '' : undefined,
        },
      };

      addNode(newNode as any);
    },
    [screenToFlowPosition, addNode]
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setExecutionResult(null);
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const result = await response.json();
      setExecutionResult(result);
    } catch (err: any) {
      setExecutionResult({
        status: 'error',
        duration_ms: 0,
        steps: [{ nodeId: 'sys', type: 'system', status: 'error', error: err.message }],
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      <TopBar
        workflowId={workflowId}
        workflowName={workflowName}
        onSave={handleSave}
        onRun={handleRun}
        isSaving={isSaving}
      />

      <div className="flex-1 flex w-full h-full relative overflow-hidden">
        <NodePalette />

        <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={(_, node) => setSelectedNode(node.id)}
            onPaneClick={() => setSelectedNode(null)}
            nodeTypes={nodeTypes as any}
            defaultViewport={defaultViewport}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionMode={ConnectionMode.Loose}
            fitView
            proOptions={{ hideAttribution: true }}
            style={{ backgroundColor: '#0a0a0a' }}
          >
            <Background color="#1a1a1a" gap={20} size={1.5} />
            <Controls
              style={{
                backgroundColor: '#141414',
                border: '1px solid #262626',
                borderRadius: 6,
              }}
            />
          </ReactFlow>

          <ExecutionConsole />
        </div>

        {selectedNode && <PropertiesPanel />}
      </div>
    </div>
  );
}

export default function WorkflowCanvas(props: { workflowId: string; initialName: string }) {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  );
}
