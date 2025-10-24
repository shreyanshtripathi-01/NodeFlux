import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Database } from 'lucide-react';
import BaseNode from './BaseNode';
import { OutputNodeData } from '@/types/workflow';

export default function OutputNode(props: NodeProps<import("@xyflow/react").Node<OutputNodeData>>) {
  return (
    <BaseNode
      id={props.id}
      category="output"
      label={props.data.label}
      icon={Database}
      selected={props.selected}
      hasOutput={false}
    >
      <div className="truncate">
        Save / Return
      </div>
    </BaseNode>
  );
}
