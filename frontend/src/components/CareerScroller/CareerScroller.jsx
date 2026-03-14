import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './CareerScroller.css';

// â”€â”€â”€ scroll windows â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// First ENTRY_END Ã— scroll is the overlay slide-in buffer.
// The carousel then runs from ENTRY_END â†’ CAROUSEL_END.
const ENTRY_END = 0.06;
const CAROUSEL_END = 0.94;

// â”€â”€â”€ career data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CAREER = [
    {
        year: '2020', title: 'Junior Developer', company: 'Company A',
        desc: 'Built web interfaces and learned the fundamentals of production code.',
    },
    {
        year: '2021', title: 'Gameplay Programmer', company: 'Studio B',
        desc: 'Shipped player-feel mechanics and real-time systems in Unity.',
    },
    {
        year: '2022', title: 'Full-Stack Engineer', company: 'Startup C',
        desc: 'React to Node.js â€” end-to-end features on a production platform.',
    },
    {
        year: '2023', title: 'Software Engineer', company: 'Company D',
        desc: 'Led systems architecture across gameplay and web projects.',
    },
];

// â”€â”€â”€ easing helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }


// â”€â”€â”€ component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function CareerScroller() {
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const trackRef = useRef(null);
    const bgYearRefs = useRef([]);   // huge decorative year text per panel
    const contentRefs = useRef([]);   // foreground content block per panel
    const dotRefs = useRef([]);   // station indicator dots
    const counterRef = useRef(null); // "01 / 04" panel counter
    const rafRef = useRef(null);
    const progressRef = useRef(0);
    // Read viewport width directly â€” no React re-render needed on resize
    const dimsRef = useRef({ w: typeof window !== 'undefined' ? window.innerWidth : 1440 });

    // Keep dimsRef fresh on resize
    useEffect(() => {
        dimsRef.current = { w: window.innerWidth };
        function onResize() { dimsRef.current = { w: window.innerWidth }; }
        window.addEventListener('resize', onResize, { passive: true });
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // RAF loop + scroll listener â€” all DOM mutations are direct, zero React re-renders
    useEffect(() => {
        function tick() {
            const p = progressRef.current;
            const vw = dimsRef.current.w;

            // Map scroll progress â†’ carousel position (0 = panel 0, N-1 = last panel)
            const rawFloat = clamp01((p - ENTRY_END) / (CAROUSEL_END - ENTRY_END)) * (CAREER.length - 1);
            const seg = Math.min(Math.floor(rawFloat), CAREER.length - 2);
            const easedFloat = seg + easeInOutCubic(rawFloat - seg);

            // â”€â”€ Slide the track â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            // Each panel is 100vw; advancing 1 unit of activeFloat = moving 1 viewport width.
            if (trackRef.current) {
                trackRef.current.style.transform =
                    `translateX(${(-easedFloat * vw).toFixed(1)}px)`;
            }

            // â”€â”€ Per-panel content reveals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            // d = (how far past this panel the scroll is), range: â€“âˆž â†’ +âˆž
            //   d < â€“0.9: panel completely to the right, nothing visible
            //   d â‰ˆ â€“0.7: bg year blooms in (depth layer first)
            //   d â‰ˆ â€“0.4: foreground content stamps up from below
            //   d â‰¥  0  : panel is centred / past, fully visible
            for (let i = 0; i < CAREER.length; i++) {
                const d = easedFloat - i;
                const bgP = easeOutCubic(clamp01((d + 1.0) / 0.6));
                const inP = easeOutCubic(clamp01((d + 0.4) / 0.4));

                const bgEl = bgYearRefs.current[i];
                const ctEl = contentRefs.current[i];
                if (bgEl) {
                    bgEl.style.opacity = (bgP * 0.12).toFixed(4);
                    bgEl.style.transform = `translateX(${(-d * 30).toFixed(1)}px)`;
                }
                if (ctEl) {
                    ctEl.style.opacity = inP.toFixed(4);
                    ctEl.style.transform = `translateY(${((1 - inP) * 32).toFixed(1)}px)`;
                }
            }

            // â”€â”€ Station indicator dots â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            for (let i = 0; i < CAREER.length; i++) {
                const dot = dotRefs.current[i];
                if (!dot) continue;
                const active = clamp01(1 - Math.abs(easedFloat - i));
                // Active dot grows 1.5Ã— and becomes fully opaque
                dot.style.transform = `scaleX(${(1 + active * 1.8).toFixed(3)})`;
                dot.style.opacity = (0.25 + active * 0.65).toFixed(3);
            }

            // Panel counter
            if (counterRef.current) {
                const idx = Math.round(clamp01(easedFloat / (CAREER.length - 1)) * (CAREER.length - 1));
                counterRef.current.textContent =
                    `${String(idx + 1).padStart(2, '0')} \u2014 ${String(CAREER.length).padStart(2, '0')}`;
            }

            rafRef.current = requestAnimationFrame(tick);
        }

        function onScroll() {
            const c = containerRef.current;
            if (!c) return;
            const rect = c.getBoundingClientRect();
            const vh = window.innerHeight;
            const scrollable = rect.height - vh;
            progressRef.current = Math.max(0, Math.min(1, -rect.top / scrollable));

            if (overlayRef.current) {
                // Overlay slides up from below the fold into view as the section enters
                const slideP = Math.max(0, Math.min(1, (vh - rect.top) / vh));
                const active = rect.top < vh && rect.bottom > 0;
                overlayRef.current.style.visibility = active ? 'visible' : 'hidden';
                overlayRef.current.style.transform =
                    `translateY(${((1 - slideP) * 100).toFixed(2)}vh)`;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const overlay = (
        <div className="cs-sticky" ref={overlayRef} style={{ visibility: 'hidden' }}>

            {/* â”€â”€ Section label (top-left) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="cs-label" aria-hidden="true"><span>Career</span></div>

            {/* â”€â”€ Horizontal train â€” all panels in one sliding track â”€â”€â”€â”€â”€ */}
            <div className="cs-track" ref={trackRef}>
                {CAREER.map((item, i) => (
                    <div key={i} className="cs-panel">

                        {/* Enormous decorative year â€” background depth layer */}
                        <div
                            className="cs-panel__bg-year"
                            ref={el => { bgYearRefs.current[i] = el; }}
                            style={{ opacity: 0 }}
                            aria-hidden="true"
                        >
                            {item.year}
                        </div>

                        {/* Foreground content block */}
                        <div
                            className="cs-panel__content"
                            ref={el => { contentRefs.current[i] = el; }}
                            style={{ opacity: 0, transform: 'translateY(24px)' }}
                        >
                            <span className="cs-panel__company">{item.company}</span>
                            <div className="cs-panel__rule" aria-hidden="true" />
                            <h2 className="cs-panel__title">{item.title}</h2>
                            <p className="cs-panel__desc">{item.desc}</p>
                            <span className="cs-panel__year-tag" aria-hidden="true">{item.year}</span>
                        </div>

                    </div>
                ))}
            </div>

            {/* â”€â”€ Station progress dots â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            {/* Panel counter */}
            <div className="cs-counter" ref={counterRef} aria-hidden="true">01 — 04</div>

            <div className="cs-dots" aria-hidden="true">
                {CAREER.map((_, i) => (
                    <div
                        key={i}
                        className="cs-dot"
                        ref={el => { dotRefs.current[i] = el; }}
                    />
                ))}
            </div>

            {/* â”€â”€ Scroll cue â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="cs-scroll-cue" aria-hidden="true" />

        </div>
    );

    return (
        <>
            {/* Scroll spacer â€” lives in document flow to drive scroll progress */}
            <div className="cs-container" ref={containerRef} />
            {/* Overlay portalled to body â€” fully independent of layout */}
            {createPortal(overlay, document.body)}
        </>
    );
}

