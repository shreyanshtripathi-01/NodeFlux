import React from 'react';
import { X } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

export default function PropertiesPanel() {
  const { selectedNode, updateNodeData, setSelectedNode } = useWorkflowStore();

  if (!selectedNode) {
    return null;
  }

  const { id, type, data } = selectedNode;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    updateNodeData(id, { [e.target.name]: e.target.value });
  };

  return (
    <aside className="w-[320px] bg-surface border-l border-border flex flex-col h-full z-10 shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transform translate-x-0 transition-transform">
      <div className="p-4 border-b border-border flex justify-between items-center bg-surface-elevated">
        <h2 className="text-sm font-semibold text-text-primary capitalize">{type} Node Settings</h2>
        <button 
          onClick={() => setSelectedNode(null)}
          className="text-text-muted hover:text-text-primary transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] uppercase tracking-wide text-text-secondary">Node Label</label>
          <input
            name="label"
            value={data.label || ''}
            onChange={handleChange}
            className="bg-[#0a0a0a] border border-border rounded px-3 py-2 text-[13px] font-mono focus:border-accent-http focus:outline-none transition-colors"
          />
        </div>

        {type === 'trigger' && (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-wide text-text-secondary">Test Payload (JSON)</label>
            <textarea
              name="payload"
              value={data.payload || ''}
              onChange={handleChange}
              rows={8}
              className="bg-[#0a0a0a] border border-border rounded px-3 py-2 text-[13px] font-mono focus:border-accent-http focus:outline-none transition-colors resize-y"
              placeholder='{"user_id": "123"}'
            />
          </div>
        )}

        {type === 'http' && (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wide text-text-secondary">Method</label>
              <select
                name="method"
                value={data.method || 'GET'}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-border rounded px-3 py-2 text-[13px] font-mono focus:border-accent-http focus:outline-none transition-colors"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wide text-text-secondary">URL</label>
              <input
                name="url"
                value={data.url || ''}
                onChange={handleChange}
                className="bg-[#0a0a0a] border border-border rounded px-3 py-2 text-[13px] font-mono focus:border-accent-http focus:outline-none transition-colors"
                placeholder="https://api.example.com/data"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wide text-text-secondary">Headers (JSON)</label>
              <textarea
                name="headers"
                value={data.headers || ''}
                onChange={handleChange}
                rows={3}
                className="bg-[#0a0a0a] border border-border rounded px-3 py-2 text-[13px] font-mono focus:border-accent-http focus:outline-none transition-colors resize-y"
                placeholder='{"Authorization": "Bearer token"}'
              />
            </div>
            {(data.method !== 'GET' && data.method !== 'DELETE') && (
              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wide text-text-secondary">Body (JSON)</label>
                <textarea
                  name="body"
                  value={data.body || ''}
                  onChange={handleChange}
                  rows={4}
                  className="bg-[#0a0a0a] border border-border rounded px-3 py-2 text-[13px] font-mono focus:border-accent-http focus:outline-none transition-colors resize-y"
                  placeholder='{"name": "{{trigger.output.name}}"}'
                />
              </div>
            )}
          </>
        )}

        {type === 'ai' && (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-wide text-text-secondary">Prompt Template</label>
            <textarea
              name="prompt"
              value={data.prompt || ''}
              onChange={handleChange}
              rows={8}
              className="bg-[#0a0a0a] border border-border rounded px-3 py-2 text-[13px] font-mono focus:border-accent-http focus:outline-none transition-colors resize-y"
              placeholder='Analyze this: {{node_1.output.data}}'
            />
            <p className="text-[11px] text-text-muted mt-1">Use {"{{node_id.output.path}}"} to inject variables.</p>
          </div>
        )}

        {type === 'logic' && (
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-wide text-text-secondary">Condition (JS Expression)</label>
            <input
              name="condition"
              value={data.condition || ''}
              onChange={handleChange}
              className="bg-[#0a0a0a] border border-border rounded px-3 py-2 text-[13px] font-mono focus:border-accent-http focus:outline-none transition-colors"
              placeholder="trigger.output.score > 50"
            />
            <p className="text-[11px] text-text-muted mt-1">Evaluates to True or False. Variables from other nodes can be used by their node ID.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
