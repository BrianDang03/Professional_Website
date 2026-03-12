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

const NUM_SEGS = 12;   // segments per path (more = smoother on tall viewports)
const NUM_CYCLES = 2;  // sine cycles across the full viewport width

// Line configs expressed as fractions of viewport height so the proportions
// are pixel-identical on every screen size and orientation.
const LINE_CONFIGS = [
    { startYR: -0.12, endYR: 1.00, ampR: 0.055, phase: 0, opacity: 0.55, strokeWidth: 1.4 },
    { startYR: -0.06, endYR: 1.06, ampR: 0.068, phase: 0, opacity: 0.45, strokeWidth: 1.2 },
    { startYR:  0,    endYR: 1.12, ampR: 0.072, phase: 0, opacity: 0.50, strokeWidth: 1.3 },
    { startYR:  0.06, endYR: 1.18, ampR: 0.068, phase: 0, opacity: 0.40, strokeWidth: 1.2 },
    { startYR:  0.12, endYR: 1.24, ampR: 0.055, phase: 0, opacity: 0.35, strokeWidth: 1.1 },
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
