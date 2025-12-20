import React from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import Icon from '@/components/global/Icon';
import { t } from '@/components/global/t';

export default function PropertiesPanel() {
  const { selectedNode, updateNodeData, setSelectedNode } = useWorkflowStore();

  if (!selectedNode) {
    return null;
  }

  const { id, type, data } = selectedNode;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    updateNodeData(id, { [e.target.name]: e.target.value });
  };

  const inputClass = "w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-panel-foreground outline-none focus:border-accent focus:bg-elevated transition-colors";
  const labelClass = "text-sm font-medium text-secondary-foreground";

  return (
    <div className="flex w-[340px] flex-col bg-panel border-l border-border px-5 py-5 shrink-0 overflow-y-auto">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div className="space-y-1 w-full mr-2">
          <div className="text-sm text-muted-foreground">{t('Selected node')}</div>
          <input
            name="label"
            value={(data.label as string) || ''}
            onChange={handleChange}
            className="w-full bg-transparent border-none font-headings text-xl font-semibold text-panel-foreground outline-none p-0 focus:ring-0"
            placeholder={t("Node Name")}
          />
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          className="rounded-lg border border-border bg-background p-2 text-muted-foreground hover:bg-elevated transition-colors"
        >
          <Icon i="x" size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className={labelClass}>{t('Node ID')}</span>
          <div className="flex items-center justify-between rounded-lg border border-border bg-input px-4 py-3 text-sm font-body tracking-tight text-muted-foreground">
            <span>{id}</span>
          </div>
        </div>

        {type === 'trigger' && (
          <div className="flex flex-col gap-2">
            <label className={labelClass}>{t('Test Payload (JSON)')}</label>
            <textarea
              name="payload"
              value={data.payload as string || ''}
              onChange={handleChange}
              rows={8}
              className={`${inputClass} font-body tracking-tight resize-y`}
              placeholder='{"user_id": "123"}'
            />
          </div>
        )}

        {type === 'http' && (
          <>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>{t('Method')}</label>
              <div className="relative">
                <select
                  name="method"
                  value={data.method as string || 'GET'}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                  <Icon i="chevron-down" size={16} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>{t('URL')}</label>
              <input
                name="url"
                value={data.url as string || ''}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://api.example.com/data"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>{t('Headers (JSON)')}</label>
              <textarea
                name="headers"
                value={data.headers as string || ''}
                onChange={handleChange}
                rows={3}
                className={`${inputClass} font-body tracking-tight resize-y`}
                placeholder='{"Authorization": "Bearer token"}'
              />
            </div>
            {data.method !== 'GET' && data.method !== 'DELETE' && (
              <div className="flex flex-col gap-2">
                <label className={labelClass}>{t('Body (JSON)')}</label>
                <textarea
                  name="body"
                  value={data.body as string || ''}
                  onChange={handleChange}
                  rows={4}
                  className={`${inputClass} font-body tracking-tight resize-y`}
                  placeholder='{"name": "{{trigger.output.name}}"}'
                />
              </div>
            )}
          </>
        )}

        {type === 'ai' && (
          <div className="flex flex-col gap-2">
            <label className={labelClass}>{t('Prompt Template')}</label>
            <textarea
              name="prompt"
              value={data.prompt as string || ''}
              onChange={handleChange}
              rows={8}
              className={`${inputClass} font-body tracking-tight resize-y`}
              placeholder='Analyze this: {{node_1.output.data}}'
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('Use {{node_id.output.path}} to inject variables.')}
            </p>
          </div>
        )}

        {type === 'logic' && (
          <div className="flex flex-col gap-2">
            <label className={labelClass}>{t('Condition (JS Expression)')}</label>
            <input
              name="condition"
              value={data.condition as string || ''}
              onChange={handleChange}
              className={`${inputClass} font-body tracking-tight`}
              placeholder="trigger.output.score > 50"
            />
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {t('Evaluates to True or False. Variables from other nodes can be used by their node ID.')}
            </p>
          </div>
        )}
        
        {type === 'output' && (
          <div className="flex flex-col gap-2">
             <p className="text-sm leading-relaxed text-muted-foreground mt-1">
              {t('Output nodes return the data back from the workflow.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
