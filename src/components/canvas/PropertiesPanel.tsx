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

  const inputStyle = {
    backgroundColor: '#0a0a0a',
    border: '1px solid #262626',
    borderRadius: 4,
    padding: '8px 10px',
    fontSize: 13,
    fontFamily: 'var(--font-mono)',
    color: '#e5e5e5',
    width: '100%',
    boxSizing: 'border-box' as const,
    outline: 'none',
    transition: 'border-color 150ms ease',
  };

  const labelStyle = {
    fontSize: 11,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#737373',
    marginBottom: 4,
    display: 'block',
  };

  return (
    <aside
      style={{
        width: 320,
        backgroundColor: '#141414',
        borderLeft: '1px solid #262626',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        zIndex: 10,
        flexShrink: 0,
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: '1px solid #262626',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#1c1c1c',
        }}
      >
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#e5e5e5', margin: 0, textTransform: 'capitalize' }}>
          {type} Node Settings
        </h2>
        <button
          onClick={() => setSelectedNode(null)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#737373',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#e5e5e5')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#737373')}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        <div>
          <label style={labelStyle}>Node Label</label>
          <input
            name="label"
            value={data.label as string || ''}
            onChange={handleChange}
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#262626')}
          />
        </div>

        {type === 'trigger' && (
          <div>
            <label style={labelStyle}>Test Payload (JSON)</label>
            <textarea
              name="payload"
              value={data.payload as string || ''}
              onChange={handleChange}
              rows={8}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder='{"user_id": "123"}'
              onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#262626')}
            />
          </div>
        )}

        {type === 'http' && (
          <>
            <div>
              <label style={labelStyle}>Method</label>
              <select
                name="method"
                value={data.method as string || 'GET'}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#262626')}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>URL</label>
              <input
                name="url"
                value={data.url as string || ''}
                onChange={handleChange}
                style={inputStyle}
                placeholder="https://api.example.com/data"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#262626')}
              />
            </div>
            <div>
              <label style={labelStyle}>Headers (JSON)</label>
              <textarea
                name="headers"
                value={data.headers as string || ''}
                onChange={handleChange}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder='{"Authorization": "Bearer token"}'
                onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#262626')}
              />
            </div>
            {data.method !== 'GET' && data.method !== 'DELETE' && (
              <div>
                <label style={labelStyle}>Body (JSON)</label>
                <textarea
                  name="body"
                  value={data.body as string || ''}
                  onChange={handleChange}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder='{"name": "{{trigger.output.name}}"}'
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#262626')}
                />
              </div>
            )}
          </>
        )}

        {type === 'ai' && (
          <div>
            <label style={labelStyle}>Prompt Template</label>
            <textarea
              name="prompt"
              value={data.prompt as string || ''}
              onChange={handleChange}
              rows={8}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder='Analyze this: {{node_1.output.data}}'
              onFocus={(e) => (e.currentTarget.style.borderColor = '#a78bfa')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#262626')}
            />
            <p style={{ fontSize: 11, color: '#525252', marginTop: 4, margin: 0 }}>
              Use {"{{node_id.output.path}}"} to inject variables.
            </p>
          </div>
        )}

        {type === 'logic' && (
          <div>
            <label style={labelStyle}>Condition (JS Expression)</label>
            <input
              name="condition"
              value={data.condition as string || ''}
              onChange={handleChange}
              style={inputStyle}
              placeholder="trigger.output.score > 50"
              onFocus={(e) => (e.currentTarget.style.borderColor = '#f59e0b')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#262626')}
            />
            <p style={{ fontSize: 11, color: '#525252', marginTop: 4, margin: 0 }}>
              Evaluates to True or False. Variables from other nodes can be used by their node ID.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
