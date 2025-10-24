import React from 'react';
import { NodeProps } from '@xyflow/react';
import { Globe } from 'lucide-react';
import BaseNode from './BaseNode';
import { HttpNodeData } from '@/types/workflow';

export default function HttpNode(props: NodeProps<import("@xyflow/react").Node<HttpNodeData>>) {
  return (
    <BaseNode
      id={props.id}
      category="http"
      label={props.data.label}
      icon={Globe}
      selected={props.selected}
    >
      <div className="flex gap-1.5 items-center">
        <span className="font-mono text-[10px] bg-border px-1 py-0.5 rounded text-accent-http">
          {props.data.method || 'GET'}
        </span>
        <span className="truncate max-w-[150px]" title={props.data.url}>
          {props.data.url || 'No URL configured'}
        </span>
      </div>
    </BaseNode>
  );
}
