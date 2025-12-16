import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { LucideIcon } from 'lucide-react';
import { NodeType } from '@/types/workflow';

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

const accentStyles: Record<NodeType, { bg: string; borderSelected: string; shadow: string }> = {
  trigger: {
    bg: '#22c55e',
    borderSelected: '1px solid #22c55e',
    shadow: '0 0 0 1px rgba(34,197,94,0.2)',
  },
  http: {
    bg: '#3b82f6',
    borderSelected: '1px solid #3b82f6',
    shadow: '0 0 0 1px rgba(59,130,246,0.2)',
  },
  ai: {
    bg: '#a78bfa',
    borderSelected: '1px solid #a78bfa',
    shadow: '0 0 0 1px rgba(167,139,250,0.2)',
  },
  logic: {
    bg: '#f59e0b',
    borderSelected: '1px solid #f59e0b',
    shadow: '0 0 0 1px rgba(245,158,11,0.2)',
  },
  output: {
    bg: '#f43f5e',
    borderSelected: '1px solid #f43f5e',
    shadow: '0 0 0 1px rgba(244,63,94,0.2)',
  },
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
  const accent = accentStyles[category];

  return (
    <div
      style={{
        width: 220,
        borderRadius: 8,
        backgroundColor: '#141414',
        border: selected ? accent.borderSelected : '1px solid #262626',
        boxShadow: selected ? accent.shadow : 'none',
        overflow: 'hidden',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#404040';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#262626';
      }}
    >
      {/* Top Accent Bar */}
      <div style={{ height: 3, width: '100%', backgroundColor: accent.bg }} />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 12px',
          gap: 8,
          borderBottom: '1px solid #262626',
        }}
      >
        <Icon size={16} style={{ color: '#e5e5e5' }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: '#e5e5e5' }}>{label}</span>
      </div>

      {/* Body */}
      <div
        style={{
          padding: '8px 12px',
          fontSize: 12,
          color: '#737373',
          backgroundColor: '#141414',
        }}
      >
        {children}
      </div>

      {/* Handles */}
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            width: 8,
            height: 8,
            backgroundColor: '#404040',
            border: '1.5px solid #525252',
          }}
        />
      )}
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            width: 8,
            height: 8,
            backgroundColor: '#404040',
            border: '1.5px solid #525252',
          }}
        />
      )}
    </div>
  );
}
