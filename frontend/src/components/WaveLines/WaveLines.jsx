import { useEffect, useState } from 'react';
import './WaveLines.css';

// ── Wuthering Waves–inspired energy streams ───────────────────────────────
//
// Design language:
//   • Three layered "currents": deep background haze, mid-field energy band,
//     and foreground wisps — mimicking the depth of WW's resonance streams
//   • Two color families: icy blue-white (primary) + soft teal (accent)
//   • All streams flow upper-left → lower-right like wind across a landscape
//   • 0.5 cycles per line = one clean arc sweeping through the middle
//   • Dual glow filters: a wide haze for depth + tight bloom for brightness
//
// startYR / endYR = fraction of viewport height from the TOP (0 = top edge).

const NUM_SEGS = 16;
const PI = Math.PI;

// ── Stream definitions ────────────────────────────────────────────────────
// All streams share phase=0 so every arc bows DOWNWARD with peak at x=50%.
// Large ampR (0.27–0.32) creates the sweeping curve seen in the reference.
// Lines enter near the top-left and exit at the right-middle, forming
// one tight flowing band — the arc bottom sits around 60–70% screen height.
const STREAMS = [
    // Layer A: background haze
    { startYR: 0.30, endYR: 0.65, ampR: 0.07,  cycles: 1.5, phase: 0,          color: 'blue',  opacity: 0.18, width: 0.70 },
    { startYR: 0.34, endYR: 0.68, ampR: 0.08,  cycles: 1.5, phase: PI * 0.5,   color: 'teal',  opacity: 0.15, width: 0.65 },
    { startYR: 0.40, endYR: 0.72, ampR: 0.075, cycles: 1.5, phase: PI,          color: 'blue',  opacity: 0.16, width: 0.65 },
    { startYR: 0.46, endYR: 0.77, ampR: 0.08,  cycles: 1.5, phase: PI * 1.5,   color: 'teal',  opacity: 0.14, width: 0.60 },

    // Layer B: main energy band
    { startYR: 0.32, endYR: 0.66, ampR: 0.09,  cycles: 1.5, phase: 0,          color: 'blue',  opacity: 0.52, width: 1.4  },
    { startYR: 0.35, endYR: 0.68, ampR: 0.095, cycles: 1.5, phase: PI * 0.4,   color: 'white', opacity: 0.44, width: 1.2  },
    { startYR: 0.37, endYR: 0.70, ampR: 0.10,  cycles: 1.5, phase: PI,          color: 'blue',  opacity: 0.55, width: 1.5  },
    { startYR: 0.40, endYR: 0.72, ampR: 0.085, cycles: 1.5, phase: PI * 0.6,   color: 'teal',  opacity: 0.40, width: 1.1  },
    { startYR: 0.43, endYR: 0.75, ampR: 0.095, cycles: 1.5, phase: PI * 1.2,   color: 'blue',  opacity: 0.48, width: 1.3  },
    { startYR: 0.46, endYR: 0.78, ampR: 0.08,  cycles: 1.5, phase: PI * 0.8,   color: 'white', opacity: 0.35, width: 1.0  },

    // Layer C: foreground wisps
    { startYR: 0.33, endYR: 0.67, ampR: 0.10,  cycles: 1.5, phase: PI * 0.2,   color: 'white', opacity: 0.60, width: 0.90 },
    { startYR: 0.36, endYR: 0.69, ampR: 0.095, cycles: 1.5, phase: PI * 0.9,   color: 'blue',  opacity: 0.52, width: 0.85 },
    { startYR: 0.39, endYR: 0.72, ampR: 0.09,  cycles: 1.5, phase: PI * 0.3,   color: 'teal',  opacity: 0.45, width: 0.80 },
    { startYR: 0.44, endYR: 0.76, ampR: 0.10,  cycles: 1.5, phase: PI * 1.1,   color: 'white', opacity: 0.38, width: 0.75 },
];

const GRAD = { blue: 'wl-grad-blue', teal: 'wl-grad-teal', white: 'wl-grad-white' };

function buildPath({ startYR, endYR, ampR, cycles, phase }, vbW, vbH) {
    const startY = startYR * vbH;
    const endY   = endYR   * vbH;
    const amp    = ampR    * vbH;
    const scale  = (PI * 2 * cycles) / vbW;
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
    const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });

    useEffect(() => {
        function update() { setDims({ w: window.innerWidth, h: window.innerHeight }); }
        window.addEventListener('resize', update, { passive: true });
        return () => window.removeEventListener('resize', update);
    }, []);

    const { w: vbW, h: vbH } = dims;

    return (
        <svg
            className="wave-lines"
            viewBox={`0 0 ${vbW} ${vbH}`}
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                {/* Wide bloom: outer glow halo around each stream */}
                <filter id="wl-bloom" filterUnits="userSpaceOnUse"
                    x="-5%" y={-vbH * 0.35} width="110%" height={vbH * 1.7}
                    colorInterpolationFilters="sRGB">
                    <feGaussianBlur stdDeviation="7" result="halo" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="core" />
                    <feMerge>
                        <feMergeNode in="halo" />
                        <feMergeNode in="core" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Soft haze: background depth blur only */}
                <filter id="wl-haze" filterUnits="userSpaceOnUse"
                    x="-5%" y={-vbH * 0.2} width="110%" height={vbH * 1.4}
                    colorInterpolationFilters="sRGB">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Icy blue-white — primary resonance color */}
                <linearGradient id="wl-grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="rgba(140,200,255,0)" />
                    <stop offset="10%"  stopColor="rgba(165,218,255,0.9)" />
                    <stop offset="50%"  stopColor="rgba(195,232,255,1)" />
                    <stop offset="90%"  stopColor="rgba(165,218,255,0.9)" />
                    <stop offset="100%" stopColor="rgba(140,200,255,0)" />
                </linearGradient>

                {/* Pure white core — brightest wisp highlights */}
                <linearGradient id="wl-grad-white" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="rgba(215,235,255,0)" />
                    <stop offset="10%"  stopColor="rgba(232,244,255,0.88)" />
                    <stop offset="50%"  stopColor="rgba(248,252,255,1)" />
                    <stop offset="90%"  stopColor="rgba(232,244,255,0.88)" />
                    <stop offset="100%" stopColor="rgba(215,235,255,0)" />
                </linearGradient>

                {/* Soft teal — secondary accent for depth variation */}
                <linearGradient id="wl-grad-teal" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="rgba(90,210,195,0)" />
                    <stop offset="10%"  stopColor="rgba(115,222,210,0.82)" />
                    <stop offset="50%"  stopColor="rgba(138,232,220,1)" />
                    <stop offset="90%"  stopColor="rgba(115,222,210,0.82)" />
                    <stop offset="100%" stopColor="rgba(90,210,195,0)" />
                </linearGradient>
            </defs>

            {/* Layer A — background haze */}
            {STREAMS.slice(0, 4).map((s, i) => (
                <path key={`a${i}`}
                    d={buildPath(s, vbW, vbH)}
                    fill="none"
                    stroke={`url(#${GRAD[s.color]})`}
                    strokeWidth={s.width}
                    strokeLinecap="round"
                    opacity={s.opacity}
                    filter="url(#wl-haze)"
                />
            ))}

            {/* Layer B — mid-field energy band */}
            {STREAMS.slice(4, 10).map((s, i) => (
                <path key={`b${i}`}
                    d={buildPath(s, vbW, vbH)}
                    fill="none"
                    stroke={`url(#${GRAD[s.color]})`}
                    strokeWidth={s.width}
                    strokeLinecap="round"
                    opacity={s.opacity}
                    filter="url(#wl-bloom)"
                />
            ))}

            {/* Layer C — foreground wisps */}
            {STREAMS.slice(10).map((s, i) => (
                <path key={`c${i}`}
                    d={buildPath(s, vbW, vbH)}
                    fill="none"
                    stroke={`url(#${GRAD[s.color]})`}
                    strokeWidth={s.width}
                    strokeLinecap="round"
                    opacity={s.opacity}
                    filter="url(#wl-bloom)"
                />
            ))}
        </svg>
    );
}
