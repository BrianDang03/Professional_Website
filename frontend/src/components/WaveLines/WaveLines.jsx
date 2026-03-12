import { useEffect, useState } from 'react';
import './WaveLines.css';

// ── Path geometry helpers ─────────────────────────────────────────────────
// Wave paths are generated relative to the actual viewport dimensions so the
// visual appearance (amplitude, frequency, diagonal angle) is identical on
// every screen size and orientation.
//
//   y(x)  = startY + slope·x + amp·sin(x·scale + phase)
//   dy/dx = slope  + amp·cos(x·scale + phase)·scale
// Cubic Bezier hermite conversion guarantees C1-continuity at every anchor.

const NUM_SEGS = 14;   // more segments keeps curves smooth at all sizes
const NUM_CYCLES = 1.0; // exactly 1 cycle → each line makes one clear arch OR bowl

// 10 lines all flowing from the left-middle area to the right-middle area.
// Lines alternate between concave-down (arch, phase≈0) and concave-up (bowl, phase≈PI)
// so adjacent lines curve in opposite directions.  Intertwining pairs share the same
// baseline diagonal but are inverted — they cross ~twice across the viewport.
const PI = Math.PI;
const LINE_CONFIGS = [
    // ── upper accent, arch (concave down) ───────────────────────────────
    { startYR: 0.06, endYR: 0.56, ampR: 0.050, phase: 0,          opacity: 0.30, strokeWidth: 0.9 },

    // ── upper intertwining pair: arch + bowl ────────────────────────────
    { startYR: 0.14, endYR: 0.64, ampR: 0.065, phase: 0,          opacity: 0.55, strokeWidth: 1.4 },
    { startYR: 0.14, endYR: 0.64, ampR: 0.065, phase: PI,         opacity: 0.44, strokeWidth: 1.2 },

    // ── upper-center solo bowl (concave up) ─────────────────────────────
    { startYR: 0.21, endYR: 0.71, ampR: 0.040, phase: PI,         opacity: 0.35, strokeWidth: 1.0 },

    // ── center intertwining pair: bowl + arch ────────────────────────────
    { startYR: 0.27, endYR: 0.77, ampR: 0.068, phase: PI,         opacity: 0.55, strokeWidth: 1.4 },
    { startYR: 0.27, endYR: 0.77, ampR: 0.068, phase: 0,          opacity: 0.45, strokeWidth: 1.2 },

    // ── lower-center solo arch (concave down) ───────────────────────────
    { startYR: 0.34, endYR: 0.84, ampR: 0.040, phase: 0,          opacity: 0.32, strokeWidth: 1.0 },

    // ── lower intertwining pair: arch + bowl ────────────────────────────
    { startYR: 0.40, endYR: 0.90, ampR: 0.062, phase: 0,          opacity: 0.50, strokeWidth: 1.3 },
    { startYR: 0.40, endYR: 0.90, ampR: 0.062, phase: PI,         opacity: 0.38, strokeWidth: 1.1 },

    // ── lower accent, bowl (concave up) ─────────────────────────────────
    { startYR: 0.48, endYR: 0.98, ampR: 0.048, phase: PI,         opacity: 0.28, strokeWidth: 0.9 },
];

function buildPath({ startYR, endYR, ampR, phase }, vbW, vbH) {
    const startY = startYR * vbH;
    const endY   = endYR   * vbH;
    const amp    = ampR    * vbH;
    const scale  = (Math.PI * 2 * NUM_CYCLES) / vbW;
    const segW   = vbW / NUM_SEGS;
    const segCp  = segW / 3;
    const slope  = (endY - startY) / vbW;

    const xa  = Array.from({ length: NUM_SEGS + 1 }, (_, i) => i * segW);
    const y   = xa.map(x => startY + slope * x + amp * Math.sin(x * scale + phase));
    const tan = xa.map(x => slope  + amp * Math.cos(x * scale + phase) * scale);

    let d = `M 0,${y[0].toFixed(1)}`;
    for (let i = 0; i < NUM_SEGS; i++) {
        const cp1y = (y[i]     + tan[i]     * segCp).toFixed(1);
        const cp2y = (y[i + 1] - tan[i + 1] * segCp).toFixed(1);
        d += ` C ${(xa[i] + segCp).toFixed(1)},${cp1y} ${(xa[i + 1] - segCp).toFixed(1)},${cp2y} ${xa[i + 1].toFixed(1)},${y[i + 1].toFixed(1)}`;
    }
    return d;
}

export default function WaveLines() {
    // Track the real viewport size so paths are generated for the exact screen.
    // This ensures wave amplitude, frequency, and diagonal look identical on
    // desktop, tablet, and mobile (portrait & landscape).
    const [dims, setDims] = useState({
        w: window.innerWidth,
        h: window.innerHeight,
    });

    useEffect(() => {
        function update() {
            setDims({ w: window.innerWidth, h: window.innerHeight });
        }
        window.addEventListener('resize', update, { passive: true });
        return () => window.removeEventListener('resize', update);
    }, []);

    const { w: vbW, h: vbH } = dims;
    const filterX2 = vbW + 80;
    const filterY2 = vbH + 400;

    return (
        <svg
            className="wave-lines"
            viewBox={`0 0 ${vbW} ${vbH}`}
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                <filter id="wl-glow" filterUnits="userSpaceOnUse" x="-40" y="-200" width={filterX2} height={filterY2} colorInterpolationFilters="sRGB">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <linearGradient id="wl-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(180,220,255,0)" />
                    <stop offset="15%" stopColor="rgba(180,220,255,1)" />
                    <stop offset="85%" stopColor="rgba(180,220,255,1)" />
                    <stop offset="100%" stopColor="rgba(180,220,255,0)" />
                </linearGradient>
            </defs>

            {LINE_CONFIGS.map((cfg, i) => (
                <path
                    key={i}
                    d={buildPath(cfg, vbW, vbH)}
                    fill="none"
                    stroke="url(#wl-grad)"
                    strokeWidth={cfg.strokeWidth}
                    strokeLinecap="round"
                    opacity={cfg.opacity}
                    filter="url(#wl-glow)"
                />
            ))}
        </svg>
    );
}
