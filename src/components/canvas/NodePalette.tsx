import React from 'react';
import { NodeType } from '@/types/workflow';
import Icon from '@/components/global/Icon';
import { t } from '@/components/global/t';

const paletteSections: Array<{
  title: string;
  items: Array<{ type: NodeType; icon: string; name: string }>;
}> = [
  {
    title: t('Triggers'),
    items: [
      { type: 'trigger', icon: 'webhook', name: t('Trigger Node') },
    ],
  },
  {
    title: t('Actions'),
    items: [
      { type: 'http', icon: 'globe', name: t('HTTP Request') },
      { type: 'ai', icon: 'brain', name: t('AI Processing') },
      { type: 'output', icon: 'database', name: t('Output') },
    ],
  },
  {
    title: t('Logic'),
    items: [
      { type: 'logic', icon: 'git-branch', name: t('Logic / Branch') },
    ],
  },
];

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex w-[280px] flex-col border-r border-border bg-panel px-4 py-4 shrink-0 overflow-y-auto">
      <div className="mb-4 rounded-lg border border-border bg-input px-4 py-3 text-sm text-muted-foreground focus-within:border-accent focus-within:bg-elevated transition-colors">
        <input 
          type="text" 
          placeholder={t('Search nodes')} 
          className="bg-transparent outline-none w-full text-panel-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex flex-col gap-5">
        {paletteSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-3">
            <div className="text-sm font-medium text-muted-foreground">{section.title}</div>
            <div className="flex flex-col gap-2">
              {section.items.map((item) => (
                <div 
                  key={item.type} 
                  draggable
                  onDragStart={(event) => onDragStart(event, item.type)}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-3 text-sm text-panel-foreground cursor-grab active:cursor-grabbing hover:border-accent hover:bg-elevated transition-colors"
                >
                  <div className="flex size-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground shrink-0">
                    <Icon i={item.icon} size={15} />
                  </div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
