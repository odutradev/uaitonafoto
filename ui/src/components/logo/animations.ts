export const motionTokens = {
  easePop: 'cubic-bezier(.34, 1.56, .64, 1)',
  easeOut: 'cubic-bezier(.16, 1, .3, 1)',
  easeInOut: 'cubic-bezier(.65, 0, .35, 1)',
  durFast: '150ms',
  durBase: '300ms',
  durSlow: '600ms'
} as const

export const logoAnimationKeyframes = `
@keyframes uai-enter-frame {
  0% { transform: scale(0.4) rotate(-12deg); opacity: 0; }
  100% { transform: none; opacity: 1; }
}

@keyframes uai-enter-dot {
  0% { transform: translate(160%, -160%) scale(0.6); opacity: 0; }
  100% { transform: none; opacity: 1; }
}

@keyframes uai-flash-dot {
  0%, 70%, 100% { transform: scale(1); }
  75% { transform: scale(1.35); }
  85% { transform: scale(0.95); }
}

@keyframes uai-flash-burst {
  0%, 70%, 100% { opacity: 0; transform: scale(0.4); }
  74% { opacity: 0.95; transform: scale(1.4); }
  90% { opacity: 0; transform: scale(2.2); }
}

@keyframes uai-shutter-frame {
  0% { transform: none; }
  30% { transform: scale(0.88, 0.82); }
  100% { transform: none; }
}

@keyframes uai-shutter-dot {
  0% { transform: none; }
  30% { transform: scale(0.25); }
  60% { transform: scale(1.2); }
  100% { transform: none; }
}

@keyframes uai-word-up {
  0% { transform: translateY(110%); opacity: 0; }
  100% { transform: none; opacity: 1; }
}

@keyframes uai-cap-highlight {
  0%, 40% { color: #FFCF1F; }
  100% { color: inherit; }
}

@keyframes uai-develop-frame {
  0% { fill: #8a8478; filter: blur(4px); }
  100% { filter: none; }
}

@keyframes uai-develop-dot {
  0% { fill: #c9c2b2; filter: blur(6px); transform: scale(0.7); }
  100% { filter: none; transform: none; }
}

@keyframes uai-live-ring {
  0% { transform: scale(1); opacity: 0.9; }
  100% { transform: scale(2.2); opacity: 0; }
}

@keyframes uai-breathe {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes uai-dot-float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-6%, 6%); }
}

@keyframes uai-spin {
  100% { transform: rotate(360deg); }
}

@keyframes uai-blink {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.45); opacity: 0.35; }
}

@keyframes uai-hop {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-16px); }
}

@keyframes uai-draw {
  0% { stroke-dashoffset: 100; }
  50% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -100; }
}

@keyframes uai-draw-dot {
  0%, 35% { transform: scale(0); }
  50%, 75% { transform: scale(1); }
  100% { transform: scale(0); }
}

@keyframes uai-morph {
  0%, 100% { rx: 28px; }
  50% { rx: 46px; }
}

.uai-logo-sym * {
  transform-box: fill-box;
  transform-origin: center;
}

.uai-logo-sym .uai-orbit-group {
  transform-box: view-box;
  transform-origin: 50px 50px;
}

.uai-logo-sym .uai-morph-dot {
  transform-box: view-box;
  transform-origin: 50px 50px;
}

@media (prefers-reduced-motion: reduce) {
  .uai-logo-animated,
  .uai-logo-animated * {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
`
