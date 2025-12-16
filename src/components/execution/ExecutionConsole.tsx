import React, { useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

export default function ExecutionConsole() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { executionResult, isRunning } = useWorkflowStore();

  const hasResult = !!executionResult;

  if (!hasResult && !isRunning) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: isExpanded ? 300 : 40,
        backgroundColor: '#0a0a0a',
        borderTop: '1px solid #262626',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        transition: 'height 200ms ease-out',
        overflow: 'hidden',
      }}
    >
      {/* Title Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          height: 40,
          minHeight: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          cursor: 'pointer',
          backgroundColor: isExpanded ? '#141414' : 'transparent',
          transition: 'background-color 150ms ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isExpanded ? (
            <ChevronDown size={16} style={{ color: '#737373' }} />
          ) : (
            <ChevronUp size={16} style={{ color: '#737373' }} />
          )}
          <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: '#e5e5e5' }}>
            Execution Console
          </span>

          {isRunning && (
            <span style={{ marginLeft: 16, fontSize: 11, fontFamily: 'var(--font-mono)', color: '#22c55e' }}>
              Running...
            </span>
          )}

          {!isRunning && executionResult && (
            <span
              style={{
                marginLeft: 16,
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: executionResult.status === 'success' ? '#22c55e' : '#f43f5e',
              }}
            >
              {executionResult.status === 'success' ? 'Completed' : 'Failed'} (
              {executionResult.duration_ms}ms)
            </span>
          )}
        </div>
      </div>

      {/* Logs */}
      {isExpanded && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
          }}
        >
          {isRunning ? (
            <div style={{ color: '#525252', fontStyle: 'italic' }}>Executing workflow nodes...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {executionResult?.steps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    borderBottom: idx < executionResult.steps.length - 1 ? '1px solid #1c1c1c' : 'none',
                    paddingBottom: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {step.status === 'success' ? (
                      <CheckCircle2 size={14} style={{ color: '#22c55e' }} />
                    ) : (
                      <XCircle size={14} style={{ color: '#f43f5e' }} />
                    )}
                    <span style={{ color: '#e5e5e5' }}>
                      [{step.type}] {step.nodeId}
                    </span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        color: '#525252',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Clock size={12} /> {step.duration_ms}ms
                    </span>
                  </div>

                  {step.status === 'error' && (
                    <div style={{ marginLeft: 22, color: '#f43f5e', wordBreak: 'break-word' }}>
                      Error: {step.error}
                    </div>
                  )}

                  {step.output && (
                    <div
                      style={{
                        marginLeft: 22,
                        marginTop: 4,
                        backgroundColor: '#1c1c1c',
                        padding: 8,
                        borderRadius: 4,
                        color: '#737373',
                        overflowX: 'auto',
                        maxHeight: 120,
                        overflowY: 'auto',
                      }}
                    >
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
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
