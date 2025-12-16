import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Database } from 'lucide-react';
import BaseNode from './BaseNode';

export default function OutputNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      category="output"
      label={data.label as string}
      icon={Database}
      selected={selected}
      hasOutput={false}
    >
      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        Save / Return
      </div>
    </BaseNode>
  );
}
