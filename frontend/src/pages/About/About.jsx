import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../../components/SEO';
import PageTransition from '../../components/PageTransition';
import SkillsGrid from '../../components/SkillsGrid/SkillsGrid';
import ContactForm from '../../components/ContactForm/ContactForm';
import './About.css';

export default function About() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.scrollTo) return;
    // Delay past the 400ms page-enter transition so scroll isn't
    // overridden by PageTransition's scroll-to-top on mount.
    const id = setTimeout(() => {
      document.getElementById(state.scrollTo)?.scrollIntoView({ behavior: "smooth" });
    }, 480);
    return () => clearTimeout(id);
  }, [state?.scrollTo]);

  return (
    <PageTransition>
      <SEO
        title="About"
        description="Learn about Brian Dang - software engineer and M.S. CS candidate at Colorado School of Mines, building production tools, automation, and open-source contributions."
        keywords="about, bio, education, Colorado School of Mines, University of Colorado Denver, skills, software engineer"
      />
      <section className="page-shell about-page">
        <button className="back-link" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <p className="hero-kicker">Background</p>
        <h1>About Me</h1>

        <div className="about-content">
          <p className="about-intro">
            I've been a gamer my whole life. FPS, Dark Souls, RPGs, puzzles, hack and slash.
            I grew up chasing that feeling of finally figuring something out after it had
            been grinding at me for hours. Turns out engineering gives me the exact same
            thing. Building a system, wrestling with a problem, and then watching it click
            and ship. That's my version of beating a hard boss. That drive is what got me
            into software and it's still what keeps me going.
          </p>

          <div className="about-section">
            <h2>My Story</h2>
            <p>
              I didn't start in tech. I started in medicine, working as a pharmacy tech
              and on track to become a pharmacist. Six months in I knew something was wrong.
              The work felt dead. Uninspiring. I was going through the motions every single
              day and it was draining me.
            </p>
            <p>
              So I made a decision on a complete whim. I liked games, I had always liked
              tech, so I figured why not give computer science a shot. I enrolled at the
              University of Colorado Denver with no coding background and just started. It
              clicked immediately. The problem solving, the building, the feeling of finally
              making something work after it had been grinding at you. It felt like
              everything medicine never did.
            </p>
            <p>
              From there I contributed to <strong>&lt;T&gt;LAPACK</strong>, an NSF-funded
              open source C++ linear algebra library at UCD, implementing core numerical
              routines merged into the production codebase. Then at Wanco Inc. I built two
              tools that became critical dependencies on the manufacturing floor.
              <strong> Modem Wizard</strong>, a full stack MERN application I shipped in
              six weeks learning the stack for the first time, now processes 40 to 90 units
              every week. A <strong>Python automation tool</strong> I wrote with Playwright
              cut a four hour fulfillment process down to ten minutes and serves three active
              production lines. I am now pursuing my M.S. in Computer Science at Colorado
              School of Mines and I have not looked back once.
            </p>
            <p>
              The next step is getting into a high impact engineering environment where the
              work carries real weight and the standards are uncompromising. I want to spend
              several years in that world, absorbing what it means to build at that level.
              Then, eventually, I want to bring all of it into game development. Gameplay
              engineering, systems design, building the kinds of experiences that make
              someone feel exactly what I felt growing up. That is where this is all heading.
            </p>
          </div>

          <div className="about-section">
            <h2>Education</h2>
            <div className="about-edu">
              <div className="about-edu-card">
                <div className="about-edu-header">
                  <span className="about-edu-degree">M.S. Computer Science</span>
                  <span className="about-edu-dash">—</span>
                  <span className="about-edu-year">Aug 2026 – May 2028</span>
                </div>
                <span className="about-edu-school">Colorado School of Mines</span>
              </div>
              <div className="about-edu-card">
                <div className="about-edu-header">
                  <span className="about-edu-degree">B.A. Computer Science</span>
                  <span className="about-edu-dash">—</span>
                  <span className="about-edu-year">Aug 2022 – May 2026</span>
                </div>
                <span className="about-edu-school">University of Colorado Denver</span>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>What I Build</h2>
            <ul className="about-list" role="list">
              <li>Production-grade internal tools that replace unreliable manual workflows</li>
              <li>Full-stack web applications — database schema, API, and UI shipped as one</li>
              <li>Browser and workflow automation that compresses hours of work into minutes</li>
              <li>Gameplay systems with focus on feel, responsiveness, and real-time feedback</li>
              <li>Open-source contributions to numerical computing and systems libraries</li>
              <li>Third-party API integrations built under real deadline pressure</li>
            </ul>
          </div>

          <div className="about-section">
            <h2>Technical Skills</h2>
            <SkillsGrid />
          </div>

          <div className="about-section" id="get-in-touch">
            <h2>Get in Touch</h2>
            <p>
              I'm open to discussing new projects, engineering roles, or technical collaboration.
              If you have something real to build, I want to hear about it.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}