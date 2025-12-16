import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import BaseNode from './BaseNode';

export default function TriggerNode({ id, data, selected }: NodeProps) {
  return (
    <BaseNode
      id={id}
      category="trigger"
      label={data.label as string}
      icon={Play}
      selected={selected}
      hasInput={false}
    >
      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        Trigger: Manual
      </div>
    </BaseNode>
  );
}
