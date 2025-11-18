"use client";

import React, { useEffect, useState } from "react";

const STORAGE_KEY = "nodeflux_tutorial_seen";

const STEPS = [
  {
    title: "Welcome to NodeFlux",
    body: "NodeFlux is a visual workflow builder. You create workflows by dragging nodes onto the canvas and connecting them together. This tutorial will walk you through the basics.",
  },
  {
    title: "Node Palette",
    body: "On the left is the node palette. Each node type has a different function:\n\nInput — receives data into the workflow\nPrompt — sends a prompt to an AI model\nHTTP — makes an HTTP request\nTransform — transforms data\nOutput — sends data out\n\nDrag any node onto the canvas to add it.",
  },
  {
    title: "The Canvas",
    body: "The main area is the canvas. You can:\n\n• Pan by clicking and dragging the empty space\n• Zoom with the scroll wheel or the controls in the bottom-right\n• Select a node by clicking on it\n• Drag nodes to reposition them\n• Connect nodes by dragging from the small handle on the right side of a node to the handle on the left side of another node",
  },
  {
    title: "Properties Panel",
    body: "When you click a node, a properties panel opens on the right. Here you can rename the node and edit its preview text. Click the X or tap the canvas to close it.",
  },
  {
    title: "Save & Run",
    body: "Type a name for your workflow in the top bar, then click Save or Run. The first time you run, you will be asked to name your workflow. After saving, your workflow will appear in the Workflows list and a run entry will appear in the Runs page.",
  },
  {
    title: "You are ready",
    body: "That is all you need to know. Click the Tutorial button in the top bar anytime to revisit this guide. Start building!",
  },
];

export default function Tutorial() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setFirstTime(true);
      setOpen(true);
    }
  }, []);

  const handleFinish = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
    setStep(0);
  };

  const handleClose = () => {
    setOpen(false);
    if (firstTime) {
      localStorage.setItem(STORAGE_KEY, "true");
      setFirstTime(false);
    }
    setStep(0);
  };

  const handleReopen = () => {
    setStep(0);
    setFirstTime(false);
    setOpen(true);
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  if (!open) {
    return (
      <button
        onClick={handleReopen}
        className="text-sm font-semibold text-secondary-text hover:text-primary-text transition-colors font-mono"
      >
        Tutorial
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-full max-w-[480px] bg-background border-2 border-foreground rounded-lg p-8 shadow-elevated">
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-[11px] tracking-wider text-muted-text">
            {step + 1} / {STEPS.length}
          </span>
          <button
            onClick={handleClose}
            className="font-mono text-xs text-muted-text hover:text-primary-text transition-colors"
          >
            Skip
          </button>
        </div>

        <h2 className="font-mono font-bold text-lg text-primary-text mb-3">
          {current.title}
        </h2>

        <div className="font-mono text-sm text-secondary-text whitespace-pre-line leading-relaxed mb-8">
          {current.body}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="font-mono text-sm font-semibold text-secondary-text hover:text-primary-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1.5"
          >
            Previous
          </button>

          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? "bg-foreground" : "bg-border-custom"
                }`}
              />
            ))}
          </div>

          {isLast ? (
            <button
              onClick={handleFinish}
              className="bg-foreground text-background text-sm font-semibold rounded-md py-1.5 px-4 hover:opacity-90 transition-all font-mono"
            >
              Start building
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="bg-foreground text-background text-sm font-semibold rounded-md py-1.5 px-4 hover:opacity-90 transition-all font-mono"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}