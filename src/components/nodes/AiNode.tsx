import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Sparkles } from 'lucide-react';
import BaseNode from './BaseNode';

export default function AiNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      category="ai"
      label={data.label as string}
      icon={Sparkles}
      selected={selected}
    >
      <div
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          opacity: 0.8,
        }}
        title={data.prompt as string}
      >
        {(data.prompt as string) || 'No prompt configured'}
      </div>
    </BaseNode>
  );
}
