'use client';

import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  Edge,
  Connection,
  addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '@/store/workflowStore';
import { nodeTypes } from '../nodes';
import NodePalette from './NodePalette';
import PropertiesPanel from './PropertiesPanel';
import ExecutionConsole from '../execution/ExecutionConsole';
import TopBar from '../layout/TopBar';

const defaultViewport = { x: 0, y: 0, zoom: 1.2 };

function FlowCanvas({ workflowId, initialName }: { workflowId: string, initialName: string }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [workflowName, setWorkflowName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
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
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}_${new Date().getTime()}`,
        type,
        position,
        data: { label: `${type} node`, category: type },
      };

      addNode(newNode as any);
    },
    [screenToFlowPosition, addNode]
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real app we'd save to supabase here.
      // E.g., await fetch(`/api/workflows/${workflowId}`, { method: 'PUT', body: JSON.stringify({ nodes, edges }) })
      await new Promise(resolve => setTimeout(resolve, 500)); // simulate network
      console.log('Saved', { nodes, edges });
    } catch (err) {
      console.error(err);
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
        steps: [{ nodeId: 'sys', type: 'system', status: 'error', error: err.message }]
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      <TopBar 
        workflowId={workflowId} 
        workflowName={workflowName} 
        onSave={handleSave} 
        onRun={handleRun} 
        isSaving={isSaving} 
      />
      
      <div className="flex-1 flex w-full h-full relative">
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
            fitView
            className="bg-[#0a0a0a]"
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#1a1a1a" gap={20} size={2} />
            <Controls className="bg-surface border-border fill-text-primary" />
          </ReactFlow>

          <ExecutionConsole />
        </div>

        <PropertiesPanel />
      </div>
    </div>
  );
}

export default function WorkflowCanvas(props: { workflowId: string, initialName: string }) {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  );
}
