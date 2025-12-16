import React from 'react';
import { Play, Globe, Sparkles, GitBranch, Database } from 'lucide-react';
import { NodeType } from '@/types/workflow';

const nodeConfig: Array<{ type: NodeType; label: string; icon: any; colorHex: string }> = [
  { type: 'trigger', label: 'Trigger Node', icon: Play, colorHex: '#22c55e' },
  { type: 'http', label: 'HTTP Request', icon: Globe, colorHex: '#3b82f6' },
  { type: 'ai', label: 'AI Processing', icon: Sparkles, colorHex: '#a78bfa' },
  { type: 'logic', label: 'Logic / Branch', icon: GitBranch, colorHex: '#f59e0b' },
  { type: 'output', label: 'Output', icon: Database, colorHex: '#f43f5e' },
];

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside
      style={{
        width: 240,
        backgroundColor: '#141414',
        borderRight: '1px solid #262626',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <div style={{ padding: 16, borderBottom: '1px solid #262626' }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#e5e5e5', margin: 0 }}>Node Palette</h2>
        <p style={{ fontSize: 12, color: '#737373', marginTop: 4, margin: 0 }}>Drag nodes to the canvas</p>
      </div>

      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#525252',
            padding: '8px 8px',
            fontWeight: 600,
          }}
        >
          Available Nodes
        </div>

        {nodeConfig.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.type}
              draggable
              onDragStart={(event) => onDragStart(event, node.type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 6,
                cursor: 'grab',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1c1c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: node.colorHex }} />
              <Icon size={16} style={{ color: '#e5e5e5' }} />
              <span style={{ fontSize: 13, color: '#e5e5e5' }}>{node.label}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
