"use client";

import React, { useState } from "react";

interface Card {
  title: string;
  body: string;
}

interface CardSwapProps {
  cards: Card[];
}

export function CardSwap({ cards }: CardSwapProps) {
  const [order, setOrder] = useState([0, 1, 2]);

  const handleSwap = () => {
    // Rotate the order
    setOrder((prev) => [prev[1], prev[2], prev[0]]);
  };

  return (
    <div className="relative w-full max-w-md h-[280px] mx-auto cursor-pointer" onClick={handleSwap}>
      {order.map((cardIndex, positionIndex) => {
        const card = cards[cardIndex];
        // Calculate offsets based on positionIndex
        // positionIndex 2 is the front card, 0 is the back card
        const offset = (2 - positionIndex) * 12;
        const zIndex = positionIndex;
        const scale = 1 - (2 - positionIndex) * 0.05;
        const opacity = scale;

        return (
          <div
            key={cardIndex}
            className="absolute inset-0 bg-background border border-border-custom rounded-custom-lg p-8 shadow-subtle flex flex-col justify-between transition-all duration-500 ease-out"
            style={{
              transform: `translate3d(0, ${offset}px, 0) scale(${scale})`,
              zIndex,
              opacity,
            }}
          >
            <div>
              <span className="font-mono text-xs text-muted-text uppercase tracking-widest block mb-4">
                Feature 0{cardIndex + 1}
              </span>
              <h3 className="font-display font-semibold text-xl mb-3 text-primary-text">
                {card.title}
              </h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                {card.body}
              </p>
            </div>
            <div className="text-right text-xs text-muted-text font-mono">
              Click card to swap
            </div>
          </div>
        );
      })}
    </div>
  );
}
