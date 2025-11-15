"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  Controls,
  ReactFlowProvider,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArrowLeft, X, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { nodeTypes, type WorkflowNodeData } from "@/components/editor/nodes";
import Tutorial from "@/components/Tutorial";
import { createWorkflow, updateWorkflow, getWorkflow, createRun } from "../actions";

const NODE_TYPES = ["Input", "Prompt", "HTTP", "Transform", "Output"] as const;

const initialNodes: Node<WorkflowNodeData>[] = [];
const initialEdges: Edge[] = [];

function EditorInner() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params.id as string;
  const isNew = workflowId === "new";

  const [workflowName, setWorkflowName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveModalName, setSaveModalName] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [placementType, setPlacementType] = useState<WorkflowNodeData["type"] | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [terminalHeight, setTerminalHeight] = useState(180);
  const [running, setRunning] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const nodeCountRef = useRef(0);
  const savedIdRef = useRef<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ startY: number; startH: number } | null>(null);

  // Load existing workflow on mount
  useEffect(() => {
    if (isNew) { setLoaded(true); return; }
    getWorkflow(workflowId).then((res) => {
      if (res.data) {
        const wf = res.data as any;
        setWorkflowName(wf.name);
        if (wf.nodes?.length > 0) setNodes(wf.nodes as Node<WorkflowNodeData>[]);
        if (wf.edges?.length > 0) setEdges(wf.edges as Edge[]);
        savedIdRef.current = wf.id;
        setHasSaved(true);
      }
      setLoaded(true);
    });
  }, [isNew, workflowId, setNodes, setEdges]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  useEffect(() => {
    if (selectedNode) {
      const stillExists = nodes.find((n) => n.id === selectedNode.id);
      if (!stillExists) setSelectedNode(null);
    }
  }, [nodes, selectedNode]);

  const persist = useCallback(
    async (name: string): Promise<string | null> => {
      setSaving(true);
      const payload = { name, nodes: nodes as unknown[], edges: edges as unknown[] };
      if (savedIdRef.current) {
        const res = await updateWorkflow(savedIdRef.current, payload);
        setSaving(false);
        if (res.data) return savedIdRef.current;
        return null;
      }
      const res = await createWorkflow(payload);
      setSaving(false);
      if (res.data) {
        savedIdRef.current = (res.data as any).id;
        return savedIdRef.current;
      }
      return null;
    },
    [nodes, edges]
  );

  const simulateExecution = useCallback(
    async (name: string) => {
      setRunning(true);
      setTerminalOpen(true);
      setTerminalLogs([]);

      const log = (msg: string) =>
        setTerminalLogs((prev) => [...prev, msg]);

      const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

      log(`[${new Date().toLocaleTimeString()}] Starting workflow: ${name}`);
      await delay(400);

      for (const node of nodes) {
        log(`  → [${node.data.type}] ${node.data.label}...`);
        await delay(300 + Math.random() * 400);
        log(`    ✓ completed (${(Math.random() * 0.5 + 0.1).toFixed(2)}s)`);
      }

      log(`[${new Date().toLocaleTimeString()}] Workflow finished (${nodes.length} nodes executed)`);
      setRunning(false);
    },
    [nodes]
  );

  const handleRunAction = useCallback(
    async (name: string) => {
      const id = await persist(name);
      if (!id) return;
      await createRun({ workflow_id: id, workflow_name: name });
      simulateExecution(name);
    },
    [persist, router, simulateExecution]
  );

  const createNode = useCallback(
    (type: string, position: { x: number; y: number }) => {
      const count = nodeCountRef.current++;
      const nodeId = `${type.toLowerCase()}-${Date.now()}-${count}`;
      const newNode: Node<WorkflowNodeData> = {
        id: nodeId,
        type: "workflowNode",
        position,
        width: 220,
        height: 56,
        data: { type: type as WorkflowNodeData["type"], label: type, preview: "...", nodeId },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: "smoothstep", style: { stroke: "#737373", strokeWidth: 1.5 } }, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<WorkflowNodeData>);
  }, []);

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (placementType && rfInstance) {
        const position = rfInstance.screenToFlowPosition({
          x: (event as any).clientX || 0,
          y: (event as any).clientY || 0,
        });
        createNode(placementType, position);
        setPlacementType(null);
        return;
      }
      setSelectedNode(null);
    },
    [placementType, rfInstance, createNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !rfInstance) return;
      const position = rfInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      createNode(type, position);
    },
    [rfInstance, createNode]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape" && placementType) setPlacementType(null);
    },
    [placementType]
  );

  const handleNameSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") setIsEditingName(false);
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
    }
  };

  const handleRun = () => {
    if (!hasSaved || !workflowName.trim()) {
      setSaveModalName(workflowName);
      setShowSaveModal(true);
      return;
    }
    handleRunAction(workflowName);
  };

  const handleSaveFromModal = async () => {
    const name = saveModalName.trim();
    if (!name) return;
    setWorkflowName(name);
    setHasSaved(true);
    setShowSaveModal(false);
    await handleRunAction(name);
  };

  const handleSave = async () => {
    const name = workflowName.trim();
    if (!name) { setSaveModalName(workflowName); setShowSaveModal(true); return; }
    await persist(name);
    setHasSaved(true);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = { startY: e.clientY, startH: terminalHeight };
    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const delta = resizeRef.current.startY - ev.clientY;
      setTerminalHeight(Math.max(100, Math.min(500, resizeRef.current.startH + delta)));
    };
    const onUp = () => {
      resizeRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-background font-mono text-sm text-secondary-text">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background font-sans">
      {/* Top Bar */}
      <header className="h-12 bg-background border-b border-border-custom flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push("/workflows")}
            className="flex items-center gap-1.5 text-sm text-secondary-text hover:text-primary-text transition-colors shrink-0"
          >
            <ArrowLeft size={14} strokeWidth={1.75} />
            <span className="font-mono">Workflows</span>
          </button>
          <span className="text-muted-text text-base font-light leading-none">/</span>
          {isEditingName ? (
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={handleNameSubmit}
              className="border border-foreground px-2 py-0.5 text-sm font-semibold bg-background text-primary-text rounded-sm focus:outline-none font-mono min-w-0"
              placeholder="Name your workflow"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className={`text-sm font-semibold transition-colors font-mono truncate ${
                workflowName ? "text-primary-text hover:text-secondary-text" : "text-muted-text"
              }`}
            >
              {workflowName || "Name your workflow"}
            </button>
          )}
          {saving && <span className="font-mono text-xs text-muted-text">saving...</span>}
          {hasSaved && !saving && <span className="font-mono text-xs text-muted-text">saved</span>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTerminalOpen((p) => !p)}
            className="text-sm text-secondary-text hover:text-primary-text transition-colors font-mono p-1.5"
            title="Toggle output terminal"
          >
            <Terminal size={16} strokeWidth={1.75} />
          </button>
          <Tutorial />
          <button
            onClick={handleSave}
            className="text-sm font-semibold text-secondary-text hover:text-primary-text transition-colors font-mono px-3 py-1.5"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleRun}
            disabled={saving || running}
            className="bg-foreground text-background text-sm font-semibold rounded-md py-1.5 px-4 hover:opacity-90 active:scale-[0.98] transition-all shadow-subtle font-mono disabled:opacity-40"
          >
            {running ? "Running..." : "Run"}
          </button>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <aside className="w-[200px] bg-background border-r border-border-custom shrink-0 flex flex-col">
          <div className="px-4 py-3 border-b border-border-custom">
            <span className="font-mono text-xs tracking-wider text-muted-text">Nodes</span>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
            {NODE_TYPES.map((type) => (
              <div
                key={type}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("application/reactflow", type);
                  event.dataTransfer.effectAllowed = "move";
                }}
                onClick={() => setPlacementType(type)}
                className={`px-3 py-2 rounded-md transition-colors font-mono text-sm font-semibold ${
                  placementType === type
                    ? "bg-foreground text-background cursor-crosshair"
                    : "cursor-grab hover:bg-surface-hover active:cursor-grabbing text-primary-text"
                }`}
              >
                {type}
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas + Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            ref={reactFlowWrapper}
            className={`flex-1 relative bg-background ${placementType ? "cursor-crosshair" : ""}`}
            style={{ backgroundImage: 'radial-gradient(circle, #a3a3a3 1px, transparent 1px)', backgroundSize: '16px 16px' }}
            tabIndex={0}
            onKeyDown={onKeyDown}
          >
            {placementType && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-foreground text-background rounded-full font-mono text-xs shadow-subtle pointer-events-none">
                Click on the canvas to place {placementType} node &mdash; press Esc to cancel
              </div>
            )}
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange as any}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onInit={setRfInstance}
              nodeTypes={nodeTypes}
              fitView
              snapToGrid={false}
              colorMode="light"
              defaultEdgeOptions={{
                type: "smoothstep",
                style: { stroke: "#737373", strokeWidth: 1.5 },
              }}
              proOptions={{ hideAttribution: true }}
            >
              <Controls
                position="bottom-right"
                className="!border !border-border-custom !rounded-lg !shadow-subtle !bg-background"
              />
            </ReactFlow>
          </div>

          {/* Terminal Panel */}
          {terminalOpen && (
            <div
              className="border-t border-border-custom bg-background shrink-0 flex flex-col"
              style={{ height: terminalHeight }}
            >
              <div
                className="h-1.5 cursor-ns-resize hover:bg-foreground/10 transition-colors shrink-0"
                onMouseDown={handleResizeStart}
              />
              <div className="flex items-center justify-between px-4 py-2 border-b border-border-custom shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal size={14} strokeWidth={1.75} className="text-secondary-text" />
                  <span className="font-mono text-xs tracking-wider text-muted-text">Output</span>
                  {running && <span className="font-mono text-xs text-secondary-text animate-pulse">running</span>}
                </div>
                <button
                  onClick={() => setTerminalOpen(false)}
                  className="text-muted-text hover:text-primary-text transition-colors"
                >
                  <ChevronDown size={14} strokeWidth={1.75} />
                </button>
              </div>
              <div
                ref={terminalRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed"
              >
                {terminalLogs.length === 0 ? (
                  <span className="text-muted-text">Run the workflow to see execution output.</span>
                ) : (
                  terminalLogs.map((line, i) => (
                    <div key={i} className={line.startsWith("  →") ? "text-secondary-text" : "text-primary-text"}>
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        {selectedNode && (
          <aside className="w-[300px] bg-background border-l border-border-custom shrink-0 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-custom">
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => {
                  const label = e.target.value;
                  setNodes((nds) =>
                    nds.map((n) =>
                      n.id === selectedNode.id ? { ...n, data: { ...n.data, label } } : n
                    )
                  );
                  setSelectedNode((prev) =>
                    prev ? { ...prev, data: { ...prev.data, label } } : null
                  );
                }}
                className="text-sm font-semibold text-primary-text bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full font-mono"
              />
              <button
                onClick={() => setSelectedNode(null)}
                className="w-7 h-7 flex items-center justify-center text-secondary-text hover:text-primary-text hover:bg-surface-hover rounded-md transition-colors"
              >
                <X size={14} strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex-1 p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-muted-text">Name</label>
                <input
                  type="text"
                  className="border border-border-custom px-2.5 py-1.5 text-sm bg-background text-primary-text rounded-md focus:outline-none focus:border-foreground transition-colors font-mono"
                  value={selectedNode.data.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    setNodes((nds) =>
                      nds.map((n) =>
                        n.id === selectedNode.id ? { ...n, data: { ...n.data, label } } : n
                      )
                    );
                    setSelectedNode((prev) =>
                      prev ? { ...prev, data: { ...prev.data, label } } : null
                    );
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-muted-text">Type</label>
                <input
                  type="text"
                  readOnly
                  className="border border-border-custom px-2.5 py-1.5 text-sm bg-surface-custom text-secondary-text rounded-md cursor-not-allowed font-mono"
                  value={selectedNode.data.type}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-muted-text">Preview</label>
                <input
                  type="text"
                  className="border border-border-custom px-2.5 py-1.5 text-sm bg-background text-primary-text rounded-md focus:outline-none focus:border-foreground transition-colors font-mono"
                  value={selectedNode.data.preview}
                  onChange={(e) => {
                    const preview = e.target.value;
                    setNodes((nds) =>
                      nds.map((n) =>
                        n.id === selectedNode.id ? { ...n, data: { ...n.data, preview } } : n
                      )
                    );
                    setSelectedNode((prev) =>
                      prev ? { ...prev, data: { ...prev.data, preview } } : null
                    );
                  }}
                />
              </div>
              <div className="border-t border-border-custom pt-4">
                <label className="font-mono text-xs text-muted-text mb-2 block">Output</label>
                <div className="font-mono text-xs text-muted-text bg-surface-custom rounded-md px-3 py-2 leading-relaxed">
                  Run the workflow to see output for this node.
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border-custom">
              <button
                onClick={handleDeleteNode}
                className="text-sm text-error-custom hover:text-red-700 font-semibold transition-colors font-mono"
              >
                Delete node
              </button>
            </div>
          </aside>
        )}
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="w-full max-w-[380px] bg-background border border-border-custom rounded-lg shadow-subtle p-6">
            <h3 className="font-mono font-bold text-base text-primary-text mb-4">Save before running</h3>
            <input
              type="text"
              autoFocus
              value={saveModalName}
              onChange={(e) => setSaveModalName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && saveModalName.trim()) handleSaveFromModal();
              }}
              className="w-full border border-border-custom px-3 py-2 text-sm bg-background text-primary-text rounded-md focus:outline-none focus:border-foreground transition-colors font-mono mb-4"
              placeholder="Name your workflow"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-sm font-semibold text-secondary-text hover:text-primary-text transition-colors font-mono px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFromModal}
                disabled={!saveModalName.trim() || saving}
                className="bg-foreground text-background text-sm font-semibold rounded-md py-1.5 px-4 hover:opacity-90 active:scale-[0.98] transition-all shadow-subtle font-mono disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save & Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <ReactFlowProvider>
      <EditorInner />
    </ReactFlowProvider>
  );
}