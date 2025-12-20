import React, { useState } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import Icon from '@/components/global/Icon';
import { t } from '@/components/global/t';

export default function ExecutionConsole() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { executionResult, isRunning } = useWorkflowStore();

  const hasResult = !!executionResult;

  if (!hasResult && !isRunning) {
    return null;
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 border-t border-border bg-panel z-20 flex flex-col transition-all duration-200"
      style={{ height: isExpanded ? 300 : 64 }}
    >
      <div 
        className="flex items-center justify-between px-5 py-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 text-sm text-panel-foreground">
          <Icon i="terminal" size={16} />
          <span>{t('Execution Console')}</span>
          {isRunning && (
            <span className="ml-2 text-primary font-body tracking-tight">
              {t('Running...')}
            </span>
          )}
          {!isRunning && executionResult && (
            <span className={`ml-2 font-body tracking-tight ${executionResult.status === 'success' ? 'text-success' : 'text-danger'}`}>
              {executionResult.status === 'success' ? t('Completed') : t('Failed')} ({executionResult.duration_ms}ms)
            </span>
          )}
        </div>
        <button className="rounded-lg border border-border bg-panel px-3 py-2 text-sm text-muted-foreground hover:bg-elevated transition-colors">
          {isExpanded ? t('Collapse') : t('Expand')}
        </button>
      </div>

      {isExpanded && (
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto px-5 pb-4 text-sm text-muted-foreground">
          {isRunning ? (
            <div className="rounded-md bg-background px-3 py-2 font-body tracking-tight italic opacity-50">
              {t('Executing workflow nodes...')}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {executionResult?.steps.map((step, idx) => (
                <div key={idx} className="rounded-md bg-background px-3 py-3 font-body tracking-tight flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="opacity-50">
                      {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    {step.status === 'success' ? (
                      <span className="text-success">[INFO]</span>
                    ) : (
                      <span className="text-danger">[ERROR]</span>
                    )}
                    <span className="text-panel-foreground">
                      [{step.type}] {step.nodeId}
                    </span>
                    <span className="ml-auto flex items-center gap-1 opacity-70">
                      <Icon i="clock-3" size={12} /> {step.duration_ms}ms
                    </span>
                  </div>
                  {step.status === 'error' && (
                    <div className="ml-[104px] text-danger">
                      {t('Error:')} {step.error}
                    </div>
                  )}
                  {step.output && (
                    <div className="ml-[104px] mt-1 bg-input p-3 rounded-md border border-border overflow-auto max-h-[120px]">
                      <pre className="m-0 whitespace-pre-wrap text-muted-foreground font-body text-xs">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
