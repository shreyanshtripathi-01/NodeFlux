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
    <header
      style={{
        height: 48,
        minHeight: 48,
        backgroundColor: '#141414',
        borderBottom: '1px solid #262626',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link
          href="/workflows"
          style={{
            padding: 6,
            color: '#525252',
            borderRadius: 4,
            display: 'flex',
            transition: 'color 150ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#e5e5e5')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#525252')}
        >
          <ArrowLeft size={16} />
        </Link>
        <h1
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: '#e5e5e5',
            margin: 0,
            maxWidth: 300,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {workflowName || 'Untitled Workflow'}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onSave}
          disabled={isSaving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 500,
            color: '#e5e5e5',
            backgroundColor: 'transparent',
            border: '1px solid #262626',
            borderRadius: 6,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.5 : 1,
            transition: 'background-color 150ms ease',
          }}
          onMouseEnter={(e) => {
            if (!isSaving) e.currentTarget.style.backgroundColor = '#1c1c1c';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save
        </button>

        <button
          onClick={onRun}
          disabled={isRunning}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 500,
            color: '#0a0a0a',
            backgroundColor: '#22c55e',
            border: 'none',
            borderRadius: 6,
            cursor: isRunning ? 'not-allowed' : 'pointer',
            opacity: isRunning ? 0.5 : 1,
            transition: 'background-color 150ms ease',
          }}
          onMouseEnter={(e) => {
            if (!isRunning) e.currentTarget.style.backgroundColor = '#16a34a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#22c55e';
          }}
        >
          {isRunning ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Play size={14} fill="currentColor" />
          )}
          Run
        </button>
      </div>
    </header>
  );
}
