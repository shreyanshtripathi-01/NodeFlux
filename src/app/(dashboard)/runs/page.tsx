"use client";

import React, { useState, useEffect } from "react";
import { getUserRuns } from "@/app/editor/actions";

export default function RunsPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserRuns().then((res) => {
      if (res.error) setError(res.error);
      else if (res.data) setRuns(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-8 max-w-[600px]">
      <h1 className="font-display font-semibold text-[32px] tracking-tight text-primary-text mb-10">
        Runs
      </h1>

      {loading ? (
        <p className="font-mono text-sm text-muted-text">Loading...</p>
      ) : error ? (
        <div>
          <p className="font-mono text-sm text-error-custom mb-2">{error}</p>
          <p className="font-mono text-xs text-muted-text">Make sure you are signed in and the database tables exist.</p>
        </div>
      ) : runs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {runs.map((r) => (
            <div key={r.id} className="group block">
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    r.status === "success"
                      ? "bg-foreground"
                      : r.status === "failed"
                      ? "bg-error-custom"
                      : "bg-secondary-text animate-pulse"
                  }`}
                />
                <span className="font-mono font-bold text-xl text-primary-text">{r.workflow_name}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 ml-5">
                <span className="font-mono text-xs text-muted-text">
                  {new Date(r.started_at).toLocaleString()}
                </span>
                <span className="font-mono text-xs text-muted-text">{r.duration}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="font-mono text-base text-secondary-text mb-1">No runs yet</p>
          <p className="font-mono text-xs text-muted-text">
            Save and run a workflow from the editor to see runs here.
          </p>
        </div>
      )}
    </div>
  );
}