import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Save, Loader2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

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
    <header className="h-12 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <Link 
          href="/workflows"
          className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-elevated rounded transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-sm font-medium text-text-primary truncate max-w-[300px]">
          {workflowName || 'Untitled Workflow'}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-primary border border-border rounded hover:bg-surface-elevated transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save
        </button>
        
        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-accent-trigger text-[#0a0a0a] rounded hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {isRunning ? <Loader2 size={14} className="animate-spin text-[#0a0a0a]" /> : <Play size={14} fill="currentColor" />}
          Run
        </button>
      </div>
    </header>
  );
}
