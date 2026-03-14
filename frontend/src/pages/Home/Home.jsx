import { useRef, useEffect } from 'react';
import { Zap, Layers, Cpu } from 'lucide-react';
import SEO from "../../components/SEO";
import PageTransition from "../../components/PageTransition";
import HeroBlock from "../../components/HeroBlock/HeroBlock";
import HomeCards from "../../components/HomeCards/HomeCards";
import "./Home.css";

const PILLARS = [
  {
    Icon: Zap,
    title: "Gameplay Engineering",
    body: "Feel-first feature design: physics, state machines, and real-time systems built to run at 60 fps.",
    color: "var(--pillar-color-a)",
  },
  {
    Icon: Layers,
    title: "Full-Stack Web",
    body: "React to backend — production-deployed applications built end-to-end with performance in mind.",
    color: "var(--pillar-color-b)",
  },
  {
    Icon: Cpu,
    title: "System Architecture",
    body: "Modular, maintainable code designed for iteration, scalability, and long-term team support.",
    color: "var(--pillar-color-c)",
  },
];

const TECH = [
  "JavaScript", "TypeScript", "C#", "C++", "Python",
  "React", "Node.js", "Unity", "Unreal Engine", "Git",
];

export default function Home({ name, job }) {
  const fadeOverlayRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    function onScroll() {
      const el = fadeOverlayRef.current;
      const hero = heroRef.current;
      if (!el || !hero) return;
      // Bottom of the hero block relative to the viewport
      const heroBottom = hero.getBoundingClientRect().bottom;
      // Navbar is ~60px; once hero bottom clears it, start fading
      const FADE_START = 60;   // px — hero bottom at this viewport position triggers start
      const FADE_RANGE = 320;  // px — distance over which opacity goes 0 → 1
      const gone = FADE_START - heroBottom;          // positive once hero has left
      const progress = Math.min(Math.max(gone / FADE_RANGE, 0), 1);
      el.style.opacity = progress.toFixed(4);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <PageTransition>
      <SEO />
      <section className="home-shell">
        <div className="home-hero" ref={heroRef}>
          <HeroBlock
            name={name}
            job={job}
            intro="Software engineer with a gameplay focus. I design and ship systems end-to-end — from player mechanics to production web interfaces — with an emphasis on feel, performance, and maintainability."
          />
          <HomeCards />
        </div>

        {/* Pillar tiles */}
        <div className="home-pillars" role="list">
          {PILLARS.map(({ Icon, title, body, color }, i) => (
            <div
              key={title}
              className="home-pillar"
              role="listitem"
              style={{ "--pillar-accent": color, "--pillar-delay": `${500 + i * 120}ms` }}
            >
              <Icon className="home-pillar-icon" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>

        {/* Tech strip */}
        <div className="home-tech-strip" aria-label="Technologies">
          {TECH.map((t) => (
            <span key={t} className="home-tag">{t}</span>
          ))}
        </div>

        <div className="home-bottom-line" aria-hidden="true" />
      </section>

      {/* Scroll space so the fade-to-black has room to complete */}
      <div className="home-fade-spacer" aria-hidden="true" />

      <div className="scroll-fade-overlay" ref={fadeOverlayRef} aria-hidden="true" />
    </PageTransition>
  );
}