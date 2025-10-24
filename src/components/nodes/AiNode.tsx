import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Sparkles } from 'lucide-react';
import BaseNode from './BaseNode';
import { AiNodeData } from '@/types/workflow';

export default function AiNode(props: NodeProps<import("@xyflow/react").Node<AiNodeData>>) {
  return (
    <BaseNode
      id={props.id}
      category="ai"
      label={props.data.label}
      icon={Sparkles}
      selected={props.selected}
    >
      <div className="truncate text-[11px] font-mono opacity-80" title={props.data.prompt}>
        {props.data.prompt || 'No prompt configured'}
      </div>
    </BaseNode>
  );
}
