import React from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
import { LogicNodeData } from '@/types/workflow';
import { cn } from './BaseNode';

export default function LogicNode(props: NodeProps<import("@xyflow/react").Node<LogicNodeData>>) {
  return (
    <div
      className={cn(
        'w-[220px] rounded-lg bg-surface border overflow-hidden transition-colors',
        props.selected
          ? 'border-accent-logic shadow-[0_0_0_1px_rgba(245,158,11,0.3)]'
          : 'border-border hover:border-border-hover'
      )}
    >
      {/* Top Accent Bar */}
      <div className="h-[3px] w-full bg-accent-logic" />

      {/* Header */}
      <div className="flex items-center px-3 py-2.5 gap-2 border-b border-border">
        <GitBranch size={16} className="text-text-primary" />
        <span className="text-[13px] font-medium text-text-primary">{props.data.label}</span>
      </div>

      {/* Body */}
      <div className="px-3 py-2 text-[12px] text-text-secondary bg-surface font-mono">
        {props.data.condition || 'if (true)'}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-1.5 h-1.5 bg-border-hover border border-text-muted hover:bg-foreground hover:scale-125 transition-all"
      />
      
      {/* Right handles for branching */}
      <Handle
        type="source"
        id="true"
        position={Position.Right}
        style={{ top: '35%' }}
        className="w-1.5 h-1.5 bg-accent-trigger border-none hover:bg-green-400 hover:scale-125 transition-all"
      />
      <Handle
        type="source"
        id="false"
        position={Position.Right}
        style={{ top: '75%' }}
        className="w-1.5 h-1.5 bg-accent-output border-none hover:bg-red-400 hover:scale-125 transition-all"
      />
      
      {/* Labels for branches */}
      <div className="absolute right-3 top-[25%] text-[9px] font-mono text-accent-trigger uppercase">True</div>
      <div className="absolute right-3 top-[65%] text-[9px] font-mono text-accent-output uppercase">False</div>
    </div>
  );
}
