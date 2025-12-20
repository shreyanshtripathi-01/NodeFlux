import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { LucideIcon } from 'lucide-react';
import { NodeType } from '@/types/workflow';
import GlobalIcon from '@/components/global/Icon';

interface BaseNodeProps {
  id: string;
  category: NodeType;
  label: string;
  icon: LucideIcon | string;
  selected?: boolean;
  children: React.ReactNode;
  hasInput?: boolean;
  hasOutput?: boolean;
}

export default function BaseNode({
  id,
  category,
  label,
  icon: IconComponent,
  selected,
  children,
  hasInput = true,
  hasOutput = true,
}: BaseNodeProps) {
  return (
    <div
      className={`relative flex flex-col gap-4 rounded-xl border px-4 py-4 ${
        selected ? 'border-accent bg-elevated' : 'border-border bg-panel'
      }`}
      style={{ width: 240 }}
    >
      {/* Handles */}
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            width: 16,
            height: 16,
            left: -8,
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-border)',
          }}
        />
      )}
      
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            width: 16,
            height: 16,
            right: -8,
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-border)',
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground shrink-0">
          {typeof IconComponent === 'string' ? (
             <GlobalIcon i={IconComponent} size={16} /> 
          ) : (
             <IconComponent size={16} />
          )}
        </div>
        <div className="space-y-1 overflow-hidden">
          <div className="text-sm font-medium text-panel-foreground truncate">{label}</div>
          <div className="text-xs text-muted-foreground truncate">{children}</div>
        </div>
      </div>

      {/* Decorative Body */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-16 rounded-full bg-border" />
        <div className="h-2 w-10 rounded-full bg-muted" />
      </div>
    </div>
  );
}
