import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import BaseNode from './BaseNode';
import { TriggerNodeData } from '@/types/workflow';

export default function TriggerNode(props: NodeProps<import("@xyflow/react").Node<TriggerNodeData>>) {
  return (
    <BaseNode
      id={props.id}
      category="trigger"
      label={props.data.label}
      icon={Play}
      selected={props.selected}
      hasInput={false}
    >
      <div className="truncate">
        Trigger: Manual
      </div>
    </BaseNode>
  );
}
