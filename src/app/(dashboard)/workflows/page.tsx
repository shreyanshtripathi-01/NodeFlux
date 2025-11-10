"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getUserWorkflows, deleteWorkflow } from "@/app/editor/actions";
import { Trash2, Plus, Grid3X3 } from "lucide-react";
import MiniCanvas from "@/components/MiniCanvas";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchWorkflows = useCallback(() => {
    getUserWorkflows().then((res) => {
      if (res.data) setWorkflows(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    const res = await deleteWorkflow(id);
    setDeleting(null);
    if (res.success) {
      setWorkflows((prev) => prev.filter((w) => w.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-[1100px]">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display font-semibold text-[32px] tracking-tight text-primary-text">
          Workflows
        </h1>
        <Link
          href="/editor/new"
          className="bg-foreground text-background font-mono text-sm font-semibold rounded-md py-2 px-4 hover:opacity-90 active:scale-[0.98] transition-all shadow-subtle flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={2} />
          New workflow
        </Link>
      </div>

      {loading ? (
        <p className="font-mono text-sm text-muted-text">Loading...</p>
      ) : workflows.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {workflows.map((w) => (
            <div
              key={w.id}
              className="group border border-border-custom rounded-lg bg-background hover:border-foreground transition-colors"
            >
              <Link href={`/editor/${w.id}`} className="block p-5 pb-0">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-mono font-bold text-[15px] text-primary-text truncate leading-tight mr-2">
                    {w.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(w.id, w.name);
                    }}
                    disabled={deleting === w.id}
                    className="p-1 opacity-0 group-hover:opacity-100 text-muted-text hover:text-error-custom disabled:opacity-30 transition-all rounded shrink-0 -mr-1 -mt-1"
                    title="Delete workflow"
                  >
                    <Trash2 size={13} strokeWidth={1.75} />
                  </button>
                </div>
                <MiniCanvas nodes={w.nodes || []} edges={w.edges || []} />
              </Link>
              <div className="px-5 pb-4 pt-2">
                <span className="font-mono text-[11px] text-muted-text">
                  {new Date(w.updated_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <Grid3X3 size={48} strokeWidth={1} className="text-muted-text" />
          <p className="font-mono text-base text-secondary-text">No workflows yet</p>
          <Link
            href="/editor/new"
            className="bg-foreground text-background font-mono text-sm font-semibold rounded-md py-2 px-4 hover:opacity-90 active:scale-[0.98] transition-all shadow-subtle"
          >
            Create your first workflow
          </Link>
        </div>
      )}
    </div>
  );
}