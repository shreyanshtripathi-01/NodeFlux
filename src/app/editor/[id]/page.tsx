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

type LogEntry = {
  nodeId: string;
  kind: string;
  status: "success" | "failed";
  output?: any;
  error?: string;
  startedAt: string;
  finishedAt: string;
};

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
  const [terminalLogs, setTerminalLogs] = useState<LogEntry[]>([]);
  const [terminalStatus, setTerminalStatus] = useState<"idle" | "running" | "success" | "failed">("idle");
  const [terminalHeight, setTerminalHeight] = useState(180);
  const [running, setRunning] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [workflowInput, setWorkflowInput] = useState("{}");
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const nodeCountRef = useRef(0);
  const savedIdRef = useRef<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{ startY: number; startH: number } | null>(null);

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

  const executeWorkflow = useCallback(
    async (name: string, input: Record<string, any>) => {
      setRunning(true);
      setTerminalOpen(true);
      setTerminalStatus("running");
      setTerminalLogs([]);

      const id = savedIdRef.current;
      if (!id) return;

      try {
        const res = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workflowId: id, input }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.partialLogs) {
            setTerminalLogs(data.partialLogs);
          }
          setTerminalStatus("failed");
          return;
        }

        setTerminalLogs(data.logs || []);
        setTerminalStatus("success");

        await createRun({
          workflow_id: id,
          workflow_name: name,
          status: "success",
          duration: "0s",
        });
      } catch (err: any) {
        setTerminalStatus("failed");
      } finally {
        setRunning(false);
      }
    },
    []
  );

  const handleRunAction = useCallback(
    async (name: string) => {
      const id = await persist(name);
      if (!id) return;
      await executeWorkflow(name, JSON.parse(workflowInput));
    },
    [persist, executeWorkflow, workflowInput]
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
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedNode && !(event.target instanceof HTMLInputElement)) {
          handleDeleteNode();
        }
      }
    },
    [placementType, selectedNode]
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
    if (nodes.length === 0) return;
    if (!hasSaved || !workflowName.trim()) {
      setSaveModalName(workflowName);
      setShowSaveModal(true);
      return;
    }
    setShowInputModal(true);
  };

  const handleRunWithInput = async () => {
    let parsed: Record<string, any>;
    try {
      parsed = JSON.parse(workflowInput);
    } catch {
      return;
    }
    setShowInputModal(false);
    await handleRunAction(workflowName);
  };

  const handleSaveFromModal = async () => {
    const name = saveModalName.trim();
    if (!name) return;
    setWorkflowName(name);
    setHasSaved(true);
    setShowSaveModal(false);
    setShowInputModal(true);
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

  const toggleLogExpand = (idx: number) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave, handleRun]);

  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-background font-mono text-sm text-secondary-text">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background font-sans">
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
            disabled={saving || running || nodes.length === 0}
            className="bg-foreground text-background text-sm font-semibold rounded-md py-1.5 px-4 hover:opacity-90 active:scale-[0.98] transition-all shadow-subtle font-mono disabled:opacity-40"
          >
            {running ? "Running..." : "Run"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
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
            {nodes.length === 0 && !placementType && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <span className="font-mono text-sm text-muted-text/40">drop a node to start</span>
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
                  <span className="font-mono text-xs tracking-wider text-muted-text">Execution</span>
                  {terminalStatus === "running" && <span className="font-mono text-xs text-secondary-text animate-pulse">running</span>}
                  {terminalStatus === "success" && <span className="font-mono text-xs text-foreground">success</span>}
                  {terminalStatus === "failed" && <span className="font-mono text-xs text-error-custom">failed</span>}
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
                  terminalLogs.map((entry, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${entry.status === "success" ? "bg-foreground" : "bg-error-custom"}`} />
                        <span className="font-mono text-[11px] text-muted-text">#{entry.nodeId.slice(-4)}</span>
                        <span className="font-mono text-[11px] font-semibold text-primary-text">{entry.kind}</span>
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-sm ${entry.status === "success" ? "bg-foreground/10 text-foreground" : "bg-error-custom/10 text-error-custom"}`}>
                          {entry.status}
                        </span>
                        {entry.finishedAt && entry.startedAt && (
                          <span className="font-mono text-[10px] text-muted-text">
                            {new Date(entry.finishedAt).getTime() - new Date(entry.startedAt).getTime()}ms
                          </span>
                        )}
                        {entry.output !== undefined && (
                          <button
                            onClick={() => toggleLogExpand(i)}
                            className="font-mono text-[10px] text-secondary-text hover:text-primary-text transition-colors ml-auto"
                          >
                            {expandedLogs.has(i) ? "hide output" : "view output"}
                          </button>
                        )}
                      </div>
                      {expandedLogs.has(i) && entry.output !== undefined && (
                        <pre className="mt-1.5 ml-3.5 p-2 bg-surface-custom rounded-sm text-[10px] text-secondary-text overflow-x-auto">
                          {JSON.stringify(entry.output, null, 2)}
                        </pre>
                      )}
                      {entry.error && (
                        <div className="mt-1.5 ml-3.5 font-mono text-[10px] text-error-custom">
                          error: {entry.error}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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

      {showInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="w-full max-w-[500px] bg-background border border-border-custom rounded-lg shadow-subtle p-6">
            <h3 className="font-mono font-bold text-base text-primary-text mb-1">Run workflow</h3>
            <p className="font-mono text-xs text-muted-text mb-4">Enter workflow input as JSON (optional)</p>
            <textarea
              value={workflowInput}
              onChange={(e) => setWorkflowInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleRunWithInput();
              }}
              className="w-full h-[200px] border border-border-custom px-3 py-2 text-sm bg-background text-primary-text rounded-md focus:outline-none focus:border-foreground transition-colors font-mono resize-none"
              spellCheck={false}
            />
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setShowInputModal(false)}
                className="text-sm font-semibold text-secondary-text hover:text-primary-text transition-colors font-mono px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                onClick={handleRunWithInput}
                disabled={running}
                className="bg-foreground text-background text-sm font-semibold rounded-md py-1.5 px-4 hover:opacity-90 active:scale-[0.98] transition-all shadow-subtle font-mono disabled:opacity-40"
              >
                {running ? "Running..." : "Run"}
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
