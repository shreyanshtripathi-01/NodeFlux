import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { AppNode, ExecutionResult } from '@/types/workflow';

interface WorkflowState {
  nodes: AppNode[];
  edges: Edge[];
  selectedNode: AppNode | null;
  isRunning: boolean;
  executionResult: ExecutionResult | null;
  
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: AppNode) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setIsRunning: (isRunning: boolean) => void;
  setExecutionResult: (result: ExecutionResult | null) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  isRunning: false,
  executionResult: null,

  onNodesChange: (changes: NodeChange<AppNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes: AppNode[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },
  addNode: (node: AppNode) => {
    set({ nodes: [...get().nodes, node] });
  },
  updateNodeData: (nodeId: string, data: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // If this is the currently selected node, update it too so the properties panel reflects changes instantly
          const updatedNode = { ...node, data: { ...node.data, ...data } };
          if (get().selectedNode?.id === nodeId) {
            set({ selectedNode: updatedNode });
          }
          return updatedNode;
        }
        return node;
      }),
    });
  },
  setSelectedNode: (nodeId: string | null) => {
    if (!nodeId) {
      set({ selectedNode: null });
      return;
    }
    const node = get().nodes.find((n) => n.id === nodeId);
    set({ selectedNode: node || null });
  },
  setIsRunning: (isRunning: boolean) => {
    set({ isRunning });
    // If we start running, animate all edges
    if (isRunning) {
      set({
        edges: get().edges.map((e) => ({ ...e, animated: true, className: 'running' })),
      });
    } else {
      set({
        edges: get().edges.map((e) => ({ ...e, animated: false, className: '' })),
      });
    }
  },
  setExecutionResult: (result: ExecutionResult | null) => {
    set({ executionResult: result });
  },
}));
