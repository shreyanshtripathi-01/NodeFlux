import React from 'react';
import { Play, Globe, Sparkles, GitBranch, Database } from 'lucide-react';
import { NodeType } from '@/types/workflow';

const nodeConfig: Array<{ type: NodeType; label: string; icon: any; colorClass: string }> = [
  { type: 'trigger', label: 'Trigger Node', icon: Play, colorClass: 'bg-accent-trigger' },
  { type: 'http', label: 'HTTP Request', icon: Globe, colorClass: 'bg-accent-http' },
  { type: 'ai', label: 'AI Processing', icon: Sparkles, colorClass: 'bg-accent-ai' },
  { type: 'logic', label: 'Logic / Branch', icon: GitBranch, colorClass: 'bg-accent-logic' },
  { type: 'output', label: 'Output', icon: Database, colorClass: 'bg-accent-output' },
];

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-[240px] bg-surface border-r border-border flex flex-col h-full z-10 shrink-0">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-text-primary">Node Palette</h2>
        <p className="text-xs text-text-secondary mt-1">Drag nodes to the canvas</p>
      </div>
      
      <div className="p-2 flex flex-col gap-1 overflow-y-auto">
        <div className="text-[11px] uppercase tracking-wider text-text-muted px-2 py-2 font-semibold">Available Nodes</div>
        
        {nodeConfig.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.type}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface-elevated rounded-md cursor-grab active:cursor-grabbing group transition-colors"
              onDragStart={(event) => onDragStart(event, node.type)}
              draggable
            >
              <div className={`w-2 h-2 rounded-full ${node.colorClass}`} />
              <Icon size={16} className="text-text-primary" />
              <span className="text-[13px] text-text-primary group-hover:text-white transition-colors">{node.label}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
