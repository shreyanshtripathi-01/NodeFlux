import React, { useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { cn } from '../nodes/BaseNode';

export default function ExecutionConsole() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { executionResult, isRunning } = useWorkflowStore();

  const hasResult = !!executionResult;
  
  if (!hasResult && !isRunning) {
    return null;
  }

  return (
    <div className={cn(
      "absolute bottom-0 left-0 right-[320px] bg-background border-t border-border z-20 flex flex-col transition-all duration-300 ease-in-out",
      isExpanded ? "h-[300px]" : "h-10"
    )}>
      {/* Title Bar */}
      <div 
        className="h-10 flex items-center justify-between px-4 cursor-pointer hover:bg-surface transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown size={16} className="text-text-secondary" /> : <ChevronUp size={16} className="text-text-secondary" />}
          <span className="text-[13px] font-mono text-text-primary">Execution Console</span>
          
          {isRunning && (
            <span className="ml-4 text-[11px] font-mono text-accent-trigger animate-pulse">Running...</span>
          )}
          
          {!isRunning && executionResult && (
            <span className={cn(
              "ml-4 text-[11px] font-mono",
              executionResult.status === 'success' ? "text-accent-trigger" : "text-accent-output"
            )}>
              {executionResult.status === 'success' ? 'Completed' : 'Failed'} ({executionResult.duration_ms}ms)
            </span>
          )}
        </div>
      </div>

      {/* Logs Area */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-4 font-mono text-[12px]">
          {isRunning ? (
            <div className="text-text-muted italic">Executing workflow nodes...</div>
          ) : (
            <div className="flex flex-col gap-3">
              {executionResult?.steps.map((step, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-b border-border/50 pb-3 last:border-0">
                  <div className="flex items-center gap-2">
                    {step.status === 'success' ? (
                      <CheckCircle2 size={14} className="text-accent-trigger" />
                    ) : (
                      <XCircle size={14} className="text-accent-output" />
                    )}
                    <span className="text-text-primary">Node [{step.type}] ({step.nodeId})</span>
                    <span className="text-text-muted flex items-center gap-1 ml-auto">
                      <Clock size={12} /> {step.duration_ms}ms
                    </span>
                  </div>
                  
                  {step.status === 'error' && (
                    <div className="ml-5 text-accent-output opacity-90 break-words">
                      Error: {step.error}
                    </div>
                  )}
                  
                  {step.output && (
                    <div className="ml-5 mt-1 bg-surface-elevated p-2 rounded text-text-secondary overflow-x-auto">
                      <pre>{JSON.stringify(step.output, null, 2)}</pre>
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
