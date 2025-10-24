import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { LucideIcon } from 'lucide-react';
import { NodeType } from '@/types/workflow';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BaseNodeProps {
  id: string;
  category: NodeType;
  label: string;
  icon: LucideIcon;
  selected?: boolean;
  children: React.ReactNode;
  hasInput?: boolean;
  hasOutput?: boolean;
}

const categoryColors = {
  trigger: 'bg-accent-trigger',
  http: 'bg-accent-http',
  ai: 'bg-accent-ai',
  logic: 'bg-accent-logic',
  output: 'bg-accent-output',
};

const categoryBorders = {
  trigger: 'border-accent-trigger',
  http: 'border-accent-http',
  ai: 'border-accent-ai',
  logic: 'border-accent-logic',
  output: 'border-accent-output',
};

const categoryShadows = {
  trigger: 'shadow-[0_0_0_1px_rgba(34,197,94,0.3)]',
  http: 'shadow-[0_0_0_1px_rgba(59,130,246,0.3)]',
  ai: 'shadow-[0_0_0_1px_rgba(167,139,250,0.3)]',
  logic: 'shadow-[0_0_0_1px_rgba(245,158,11,0.3)]',
  output: 'shadow-[0_0_0_1px_rgba(244,63,94,0.3)]',
};

export default function BaseNode({
  id,
  category,
  label,
  icon: Icon,
  selected,
  children,
  hasInput = true,
  hasOutput = true,
}: BaseNodeProps) {
  const accentColor = categoryColors[category];
  const accentBorder = categoryBorders[category];
  const accentShadow = categoryShadows[category];

  return (
    <div
      className={cn(
        'w-[220px] rounded-lg bg-surface border overflow-hidden transition-colors',
        selected
          ? `border-${categoryBorders[category].replace('border-', '')} ${accentShadow}`
          : 'border-border hover:border-border-hover'
      )}
    >
      {/* Top Accent Bar */}
      <div className={cn('h-[3px] w-full', accentColor)} />

      {/* Header */}
      <div className="flex items-center px-3 py-2.5 gap-2 border-b border-border">
        <Icon size={16} className="text-text-primary" />
        <span className="text-[13px] font-medium text-text-primary">{label}</span>
      </div>

      {/* Body */}
      <div className="px-3 py-2 text-[12px] text-text-secondary bg-surface">
        {children}
      </div>

      {/* Handles */}
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-1.5 h-1.5 bg-border-hover border border-text-muted hover:bg-foreground hover:scale-125 transition-all"
        />
      )}
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-1.5 h-1.5 bg-border-hover border border-text-muted hover:bg-foreground hover:scale-125 transition-all"
        />
      )}
    </div>
  );
}
