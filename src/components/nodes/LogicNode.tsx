import React from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

export default function LogicNode({ id, data, selected }: NodeProps) {
  return (
    <div
      style={{
        width: 220,
        borderRadius: 8,
        backgroundColor: '#141414',
        border: selected ? '1px solid #f59e0b' : '1px solid #262626',
        boxShadow: selected ? '0 0 0 1px rgba(245,158,11,0.2)' : 'none',
        overflow: 'hidden',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#404040';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#262626';
      }}
    >
      <div style={{ height: 3, width: '100%', backgroundColor: '#f59e0b' }} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 12px',
          gap: 8,
          borderBottom: '1px solid #262626',
        }}
      >
        <GitBranch size={16} style={{ color: '#e5e5e5' }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: '#e5e5e5' }}>
          {data.label as string}
        </span>
      </div>

      <div
        style={{
          padding: '8px 12px',
          fontSize: 12,
          color: '#737373',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {(data.condition as string) || 'if (true)'}
      </div>

      {/* Branch labels */}
      <div style={{ position: 'absolute', right: 12, top: '30%', fontSize: 9, fontFamily: 'var(--font-mono)', color: '#22c55e', textTransform: 'uppercase' }}>True</div>
      <div style={{ position: 'absolute', right: 12, top: '70%', fontSize: 9, fontFamily: 'var(--font-mono)', color: '#f43f5e', textTransform: 'uppercase' }}>False</div>

      <Handle type="target" position={Position.Left} style={{ width: 8, height: 8, backgroundColor: '#404040', border: '1.5px solid #525252' }} />
      <Handle type="source" id="true" position={Position.Right} style={{ top: '35%', width: 8, height: 8, backgroundColor: '#22c55e', border: 'none' }} />
      <Handle type="source" id="false" position={Position.Right} style={{ top: '75%', width: 8, height: 8, backgroundColor: '#f43f5e', border: 'none' }} />
    </div>
  );
}
