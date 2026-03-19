import { useRef, useEffect } from 'react';
import './TimelineSection.css';

const VISIBLE    = 4;
const BREAKPOINT = 1024;
const isH = () => window.innerWidth >= BREAKPOINT;

const ENTRIES = [
    {
        year: '2022',
        title: 'Open Source Contributor',
        company: '<T>LAPACK \u00b7 Univ. of Colorado Denver',
        desc: 'Implemented core symmetric eigenvalue routines for an NSF-funded C++ template linear algebra library. Contributions reviewed and merged as one of 17 contributors.',
        color: '#a87bf5',
    },
    {
        year: '2023',
        title: 'Software Engineer',
        company: 'Wanco Inc.',
        desc: 'Built Modem Wizard from scratch in 6 weeks \u2014 a full-stack MERN app that became a critical dependency on the manufacturing floor, processing 40\u201390 modems every week.',
        color: '#7b9cf5',
    },
    {
        year: '2024',
        title: 'Software Engineer',
        company: 'Wanco Inc.',
        desc: 'Built a Python automation tool with Playwright that cut Suntech asset tracker fulfillment from 4 hours down to 10 minutes per box. Serves three active production lines.',
        color: '#4abf8e',
    },
    {
        year: '2025',
        title: 'M.S. CS Candidate',
        company: 'Colorado School of Mines',
        desc: 'Pursuing a graduate degree in Computer Science \u2014 deepening expertise in algorithms, systems, and high-impact engineering while continuing to build production software.',
        color: '#f5a97b',
    },
    {
        year: '20xx',
        title: 'Role Title',
        company: 'Company Name A',
        desc: 'Description of key responsibilities, impact, and technologies used in this role.',
        color: '#e87b7b',
    },
    {
        year: '20xx',
        title: 'Role Title',
        company: 'Company Name B',
        desc: 'Description of key responsibilities, impact, and technologies used in this role.',
        color: '#f5e97b',
    },
    {
        year: '20xx',
        title: 'Role Title',
        company: 'Company Name C',
        desc: 'Description of key responsibilities, impact, and technologies used in this role.',
        color: '#7be8f5',
    },
    {
        year: '20xx',
        title: 'Role Title',
        company: 'Company Name D',
        desc: 'Description of key responsibilities, impact, and technologies used in this role.',
        color: '#b87bf5',
    },
];

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function lerp(a, b, t)   { return a + (b - a) * t; }
function clamp01(v)       { return v < 0 ? 0 : v > 1 ? 1 : v; }

export default function TimelineSection() {
    const driverRef  = useRef(null);
    const sectionRef = useRef(null);
    const railRef    = useRef(null);
    const fillRef    = useRef(null);
    const dotRefs    = useRef([]);
    const entryRefs  = useRef([]);
    const rafRef     = useRef(null);

    useEffect(() => {
        const N           = ENTRIES.length;
        const extraSlides = N - VISIBLE;
        const FADE_RANGE  = 0.4;
        // Desktop uses gentle smoothing; mobile uses a higher factor so the
        // animation tracks touch-momentum scrolling without lagging behind.
        const LERP_DESKTOP = 0.09;
        const LERP_MOBILE  = 0.20;

        // Both orientations use the same sticky carousel driver height
        function setDriverHeight() {
            if (!driverRef.current) return;
            driverRef.current.style.height = `${150 + extraSlides * 100}vh`;
        }
        setDriverHeight();

        let targetFill   = 0;
        let displayFill  = 0;
        let targetSlide  = 0;
        let displaySlide = 0;

        function tick() {
            const rail    = railRef.current;
            const fill    = fillRef.current;
            const section = sectionRef.current;
            const driver  = driverRef.current;
            if (!rail || !fill || !section || !driver) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            const railRect = rail.getBoundingClientRect();
            const vh       = window.innerHeight;
            const h        = isH();

            // Shared progress  same two-phase logic for both orientations:
            //   Phase 1: fill animates from 0 to 100%
            //   Phase 2: carousel slides through extra entries
            const driverRect     = driver.getBoundingClientRect();
            const scrollableDist = driver.offsetHeight - vh;
            const rawProgress    = scrollableDist > 0
                ? clamp01(-driverRect.top / scrollableDist)
                : 0;

            const totalPhases  = 1 + extraSlides;
            const fillPhaseEnd = 1 / totalPhases;

            targetFill  = clamp01(rawProgress / fillPhaseEnd);
            targetSlide = extraSlides > 0
                ? clamp01((rawProgress - fillPhaseEnd) / Math.max(1 - fillPhaseEnd, 1e-6)) * extraSlides
                : 0;

            const lf = h ? LERP_DESKTOP : LERP_MOBILE;
            displayFill  = lerp(displayFill,  targetFill,  lf);
            displaySlide = lerp(displaySlide, targetSlide, lf);
            const snap = h ? 0.001 : 0.002;
            if (Math.abs(displayFill  - targetFill)  < snap) displayFill  = targetFill;
            if (Math.abs(displaySlide - targetSlide) < snap) displaySlide = targetSlide;

            if (h) {
                //  Desktop: horizontal carousel 
                fill.style.transformOrigin = 'left center';
                fill.style.transform = `scaleX(${displayFill.toFixed(5)})`;

                const slotWidth  = railRect.width / VISIBLE;
                const fillFrontX = railRect.left + displayFill * railRect.width;

                dotRefs.current.forEach((dot, i) => {
                    if (!dot) return;
                    const content = entryRefs.current[i];
                    const outer   = dot.parentElement;
                    const slotPos    = i - displaySlide;
                    const dotCenterX = railRect.left + (slotPos + 0.5) * slotWidth;

                    const fillReveal = displayFill < 0.999
                        ? easeOutCubic(clamp01((fillFrontX - dotCenterX + 64) / 64))
                        : 1;

                    let slideVis;
                    if      (slotPos <= -FADE_RANGE)             slideVis = 0;
                    else if (slotPos < 0)                         slideVis = clamp01((slotPos + FADE_RANGE) / FADE_RANGE);
                    else if (slotPos > VISIBLE - 1 + FADE_RANGE) slideVis = 0;
                    else if (slotPos > VISIBLE - 1)              slideVis = clamp01((VISIBLE - 1 + FADE_RANGE - slotPos) / FADE_RANGE);
                    else                                          slideVis = 1;

                    const ep = fillReveal * slideVis;

                    if (outer) {
                        outer.style.left   = `${(slotPos * slotWidth).toFixed(2)}px`;
                        outer.style.width  = `${slotWidth.toFixed(2)}px`;
                        outer.style.top    = '';
                        outer.style.height = '';
                    }
                    if (content) {
                        content.style.opacity   = ep.toFixed(4);
                        const dir    = i % 2 === 0 ? 1 : -1;
                        const yShift = displayFill < 0.999 ? (1 - fillReveal) * 18 * dir : 0;
                        content.style.transform = `translateY(${yShift.toFixed(2)}px)`;
                    }
                    dot.style.opacity   = ep.toFixed(4);
                    dot.style.transform = `translate(-50%, -50%) scale(${(0.25 + ep * 0.75).toFixed(4)})`;
                    dot.style.boxShadow = ep > 0.05
                        ? `0 0 ${(ep * 14).toFixed(1)}px ${(ep * 6).toFixed(1)}px ${dot.dataset.color}55`
                        : 'none';
                });

            } else {
                //  Mobile: vertical carousel (same phases, vertical axis) 
                fill.style.transformOrigin = 'top center';
                fill.style.transform = `scaleY(${displayFill.toFixed(5)})`;

                const slotHeight = railRect.height / VISIBLE;

                dotRefs.current.forEach((dot, i) => {
                    if (!dot) return;
                    const content = entryRefs.current[i];
                    const outer   = dot.parentElement;
                    const slotPos = i - displaySlide;

                    // Fill reveal: has the fill front passed this dot's vertical centre?
                    const dotRelY    = (slotPos + 0.5) * slotHeight; // px from rail top
                    const fillFrontY = displayFill * railRect.height;
                    const dist       = fillFrontY - dotRelY;

                    const fillReveal = displayFill < 0.999
                        ? easeOutCubic(clamp01((dist + 64) / 64))
                        : 1;

                    let slideVis;
                    if      (slotPos <= -FADE_RANGE)             slideVis = 0;
                    else if (slotPos < 0)                         slideVis = clamp01((slotPos + FADE_RANGE) / FADE_RANGE);
                    else if (slotPos > VISIBLE - 1 + FADE_RANGE) slideVis = 0;
                    else if (slotPos > VISIBLE - 1)              slideVis = clamp01((VISIBLE - 1 + FADE_RANGE - slotPos) / FADE_RANGE);
                    else                                          slideVis = 1;

                    const ep = fillReveal * slideVis;

                    if (outer) {
                        outer.style.top    = `${(slotPos * slotHeight).toFixed(2)}px`;
                        outer.style.height = `${slotHeight.toFixed(2)}px`;
                        outer.style.left   = '';
                        outer.style.width  = '';
                    }
                    if (content) {
                        content.style.opacity   = ep.toFixed(4);
                        content.style.transform = `translateX(${((1 - fillReveal) * 28).toFixed(2)}px)`;
                    }
                    dot.style.opacity   = ep.toFixed(4);
                    dot.style.transform = `translateY(-50%) scale(${(0.25 + ep * 0.75).toFixed(4)})`;
                    dot.style.boxShadow = ep > 0.05
                        ? `0 0 ${(ep * 14).toFixed(1)}px ${(ep * 6).toFixed(1)}px ${dot.dataset.color}55`
                        : 'none';
                });
            }

            rafRef.current = requestAnimationFrame(tick);
        }

        rafRef.current = requestAnimationFrame(tick);

        function onResize() {
            setDriverHeight();
            displayFill  = 0; targetFill  = 0;
            displaySlide = 0; targetSlide = 0;

            const h = isH();
            if (fillRef.current) {
                fillRef.current.style.transformOrigin = h ? 'left center' : 'top center';
                fillRef.current.style.transform       = h ? 'scaleX(0)'   : 'scaleY(0)';
            }
            dotRefs.current.forEach(dot => {
                if (!dot) return;
                dot.style.opacity   = '0';
                dot.style.transform = h ? 'translate(-50%, -50%) scale(0.25)' : 'translateY(-50%) scale(0.25)';
                dot.style.boxShadow = 'none';
            });
            entryRefs.current.forEach(el => {
                if (!el) return;
                el.style.opacity   = '0';
                el.style.transform = '';
                const outer = el.parentElement;
                if (outer) {
                    outer.style.left   = '';
                    outer.style.width  = '';
                    outer.style.top    = '';
                    outer.style.height = '';
                }
            });
        }

        window.addEventListener('resize', onResize, { passive: true });
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <div className="tl-driver" ref={driverRef}>
        <section className="tl-section" ref={sectionRef} aria-label="Career timeline">
            <div className="tl-header">
                <p className="tl-kicker">Experience</p>
                <h2 className="tl-heading">Career</h2>
            </div>

            <div className="tl-track">
                <div className="tl-rail" ref={railRef}>
                    <div className="tl-rail__bg" />
                    <div className="tl-rail__fill" ref={fillRef} />
                </div>

                <div className="tl-entries">
                    {ENTRIES.map((item, i) => (
                        <div
                            key={i}
                            className={`tl-entry tl-entry--${i % 2 === 0 ? 'above' : 'below'}`}
                        >
                            <div
                                className="tl-dot"
                                ref={el => { dotRefs.current[i] = el; }}
                                data-color={item.color}
                                style={{ background: item.color, opacity: 0 }}
                                aria-hidden="true"
                            />
                            <div
                                className="tl-content"
                                ref={el => { entryRefs.current[i] = el; }}
                                style={{ opacity: 0 }}
                            >
                                <div className="tl-meta">
                                    <span className="tl-company" style={{ color: item.color }}>
                                        {item.company}
                                    </span>
                                    <span className="tl-year">{item.year}</span>
                                </div>
                                <h3 className="tl-title">{item.title}</h3>
                                <p className="tl-desc">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        </div>
    );
}