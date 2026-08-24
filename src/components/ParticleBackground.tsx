'use client';

import React from 'react';

/**
 * Ultra-lightweight, 100% GPU-accelerated ambient backdrop
 * Uses zero JS main-thread execution and zero Canvas loops for 120 FPS buttery smooth scrolling
 */
export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Top Left Emerald Glow */}
      <div 
        className="absolute -top-40 -left-40 w-96 sm:w-[550px] h-96 sm:h-[550px] rounded-full bg-emerald-500/10 blur-[100px] transform-gpu" 
        style={{ willChange: 'transform' }}
      />
      
      {/* Center Indigo Nebula */}
      <div 
        className="absolute top-1/3 -right-40 w-96 sm:w-[600px] h-96 sm:h-[600px] rounded-full bg-indigo-600/10 blur-[120px] transform-gpu" 
        style={{ willChange: 'transform' }}
      />
      
      {/* Bottom Purple Nebula */}
      <div 
        className="absolute -bottom-40 left-1/4 w-96 sm:w-[650px] h-96 sm:h-[650px] rounded-full bg-purple-600/10 blur-[120px] transform-gpu" 
        style={{ willChange: 'transform' }}
      />

      {/* Subtle Noise / Radial Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />
    </div>
  );
}
