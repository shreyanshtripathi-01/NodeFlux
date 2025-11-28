"use client";

import React from "react";
import { motion } from "motion/react";

interface Step {
  num: string;
  title: string;
  body: string;
}

interface ScrollStackProps {
  steps: Step[];
}

export function ScrollStack({ steps }: ScrollStackProps) {
  return (
    <div className="relative flex flex-col w-full">
      {/* Vertical timeline line */}
      <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border-custom" />

      <div className="flex flex-col gap-12 max-w-2xl w-full">
        {steps.map((step, idx) => {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" as const }}
              className="relative pl-14"
            >
              {/* Timeline dot */}
              <div className="absolute left-[15px] top-8 w-[18px] h-[18px] rounded-full border-2 border-foreground bg-background z-10 flex items-center justify-center transition-all duration-300 group-hover:scale-125">
                <div className="w-[6px] h-[6px] rounded-full bg-foreground" />
              </div>

              {/* Card */}
              <div className="group relative bg-background border border-border-custom rounded-lg p-8 shadow-subtle flex flex-col gap-5 hover:border-foreground hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <span className="absolute left-0 top-1/2 w-[3px] h-0 bg-foreground rounded-r transition-all duration-300 -translate-y-1/2 group-hover:h-3/4" />
                <div className="font-mono text-4xl font-semibold text-primary-text">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-2xl mb-3 text-primary-text">
                    {step.title}
                  </h3>
                  <p className="text-base text-secondary-text leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}