import React from 'react';
import Link from 'next/link';
import { useWorkflowStore } from '@/store/workflowStore';
import Icon from '@/components/global/Icon';
import BrandLogo from '@/components/BrandLogo';
import { t } from '@/components/global/t';

interface TopBarProps {
  workflowId: string;
  workflowName: string;
  onSave: () => Promise<void>;
  onRun: () => Promise<void>;
  isSaving: boolean;
}

export default function TopBar({ workflowId, workflowName, onSave, onRun, isSaving }: TopBarProps) {
  const { isRunning } = useWorkflowStore();

  return (
    <div className="border-b border-border bg-background px-6 py-4 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/workflows" className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-sm text-muted-foreground hover:bg-elevated transition-colors">
            <Icon i="arrow-left" size={16} />
            {t('Back')}
          </Link>
          <BrandLogo compact={true} />
          <div className="rounded-lg border border-border bg-panel px-4 py-2.5 text-sm text-panel-foreground max-w-[200px] truncate">
            {workflowName || t('Untitled Workflow')}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <button 
            onClick={onSave}
            disabled={isSaving}
            className="rounded-lg border border-border bg-panel px-4 py-2.5 text-panel-foreground hover:bg-elevated transition-colors disabled:opacity-50"
          >
            {isSaving ? t('Saving...') : t('Save')}
          </button>
          <button 
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isRunning ? <Icon i="loader-2" size={15} /> : <Icon i="play" size={15} />}
            {isRunning ? t('Running...') : t('Run')}
          </button>
        </div>
      </div>
    </div>
  );
}
