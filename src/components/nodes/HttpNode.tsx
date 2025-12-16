import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Globe } from 'lucide-react';
import BaseNode from './BaseNode';

export default function HttpNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      category="http"
      label={data.label as string}
      icon={Globe}
      selected={selected}
    >
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            backgroundColor: '#262626',
            padding: '2px 4px',
            borderRadius: 3,
            color: '#3b82f6',
          }}
        >
          {(data.method as string) || 'GET'}
        </span>
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 150,
          }}
          title={data.url as string}
        >
          {(data.url as string) || 'No URL configured'}
        </span>
      </div>
    </BaseNode>
  );
}
