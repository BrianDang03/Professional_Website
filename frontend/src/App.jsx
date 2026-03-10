import './App.css';
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import SkipToContent from "./components/SkipToContent/SkipToContent";
import PageTransition from "./components/PageTransition";
import SEO from "./components/SEO";

const Home = lazy(() => import("./pages/Home/Home"));
const Portfolio = lazy(() => import("./pages/Portfolio/Portfolio"));
const About = lazy(() => import("./pages/About/About"));

const BOOT_MIN_DELAY_MS = 420;
const BOOT_ASSET_TIMEOUT_MS = 1800;
const BOOT_IMAGES = ["modem.jpg", "headshot.jpg", "contact.png", "flipIcon.png"];
const ROUTE_PRELOADERS = [
  () => import("./pages/About/About"),
  () => import("./pages/Portfolio/Portfolio")
];

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((resolve) => {
      window.setTimeout(resolve, timeoutMs);
    })
  ]);
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    const done = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };
    img.onload = done;
    img.onerror = done;
    img.src = src;

    if (typeof img.decode === "function") {
      img.decode().then(done).catch(done);
    }
  });
}

function RouteLoadingFallback({ label }) {
  return (
    <section className="page-shell route-loading" role="status" aria-live="polite" aria-busy="true">
      <div className="route-loading-content">
        <div className="app-loader-mark" aria-hidden="true" />
        <p className="app-loader-text">{label}</p>
      </div>
    </section>
  );
}

function AnimatedWaves() {
  const r0 = useRef(null);
  const r1 = useRef(null);
  const r2 = useRef(null);
  const r3 = useRef(null);
  const b0 = useRef(null);
  const b1 = useRef(null);
  const b2 = useRef(null);
  const b3 = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    // Each wave has independent start-Y and end-Y oscillators at different periods
    // and phases. As they drift apart or together the chord tilts and the
    // concavity of the wave shape changes naturally on its own.
    const WAVES = [
      { r: r0, b: b0, baseY: 250, sAmp: 45, sFreq: 1.55e-4, sPhase: 0.0, eAmp: 38, eFreq: 1.95e-4, ePhase: 2.1, wAmp: 46, wSpeed: 6.5e-5, wOff: 0.0 },
      { r: r1, b: b1, baseY: 340, sAmp: 40, sFreq: 1.78e-4, sPhase: 1.3, eAmp: 44, eFreq: 1.28e-4, ePhase: 3.8, wAmp: 42, wSpeed: 5.6e-5, wOff: 1.2 },
      { r: r2, b: b2, baseY: 430, sAmp: 42, sFreq: 1.35e-4, sPhase: 2.6, eAmp: 36, eFreq: 1.64e-4, ePhase: 0.8, wAmp: 44, wSpeed: 7.1e-5, wOff: 2.5 },
      { r: r3, b: b3, baseY: 520, sAmp: 38, sFreq: 1.44e-4, sPhase: 4.1, eAmp: 42, eFreq: 1.78e-4, ePhase: 1.9, wAmp: 40, wSpeed: 6.1e-5, wOff: 3.7 },
    ];

    function buildPath(w, t) {
      const sY = w.baseY + w.sAmp * Math.sin(w.sFreq * t + w.sPhase);
      const eY = w.baseY + w.eAmp * Math.sin(w.eFreq * t + w.ePhase);
      // The chord defines a tilted baseline from sY to eY.
      const chord = x => sY + (eY - sY) * (x / 3000);
      // Wave humps sit on top of the chord so concavity follows the chord tilt.
      const hump  = x => w.wAmp * Math.sin((x / 3000) * Math.PI * 3 + w.wSpeed * t + w.wOff);
      const y = x => chord(x) + hump(x);
      return (
        `M 0,${sY.toFixed(1)} ` +
        `Q 380,${y(380).toFixed(1)} 780,${y(780).toFixed(1)} ` +
        `T 1560,${y(1560).toFixed(1)} ` +
        `T 2320,${y(2320).toFixed(1)} ` +
        `T 3000,${eY.toFixed(1)}`
      );
    }

    function animate(ts) {
      WAVES.forEach(w => {
        const d = buildPath(w, ts);
        if (w.r.current) w.r.current.setAttribute('d', d);
        if (w.b.current) w.b.current.setAttribute('d', d);
      });
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <svg className="flowing-wave" viewBox="0 0 3000 1000" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
          <stop offset="20%" stopColor="rgba(100, 180, 255, 0.38)" />
          <stop offset="50%" stopColor="rgba(130, 210, 255, 0.56)" />
          <stop offset="80%" stopColor="rgba(100, 180, 255, 0.38)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>
      </defs>
      {/* Base lines – always visible; share the same JS-driven path geometry */}
      <path ref={b0} d="" stroke="url(#wave-gradient)" strokeWidth="1.6" fill="none" className="wave-base" />
      <path ref={b1} d="" stroke="url(#wave-gradient)" strokeWidth="1.5" fill="none" className="wave-base wave-base-2" />
      <path ref={b2} d="" stroke="url(#wave-gradient)" strokeWidth="1.5" fill="none" className="wave-base wave-base-3" />
      <path ref={b3} d="" stroke="url(#wave-gradient)" strokeWidth="1.6" fill="none" className="wave-base wave-base-4" />
      {/* Scan highlights – traveling glow overlay */}
      <path ref={r0} d="" stroke="url(#wave-gradient)" strokeWidth="2.9" fill="none" className="wave-line" />
      <path ref={r1} d="" stroke="url(#wave-gradient)" strokeWidth="2.8" fill="none" className="wave-line wave-line-2" />
      <path ref={r2} d="" stroke="url(#wave-gradient)" strokeWidth="2.8" fill="none" className="wave-line wave-line-3" />
      <path ref={r3} d="" stroke="url(#wave-gradient)" strokeWidth="2.9" fill="none" className="wave-line wave-line-4" />
    </svg>
  );
}

function App() {
  const location = useLocation();
  const [showDecorations, setShowDecorations] = useState(false);
  const [isWavePaintReady, setIsWavePaintReady] = useState(false);
  const [areShapesLocked, setAreShapesLocked] = useState(false);
  const [isBootReady, setIsBootReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);
  const hasLoggedBootMeasureRef = useRef(false);
  const canRevealApp = isBootReady && isWavePaintReady;

  useEffect(() => {
    if (!import.meta.env.DEV || typeof performance === "undefined") {
      return;
    }

    performance.mark("app-boot-start");
  }, []);

  useEffect(() => {
    const canControlScrollRestoration = typeof window !== "undefined" && "scrollRestoration" in window.history;
    const previousScrollRestoration = canControlScrollRestoration ? window.history.scrollRestoration : undefined;

    if (canControlScrollRestoration) {
      window.history.scrollRestoration = "manual";
    }

    // Prevent browsers from restoring old scroll position on refresh.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    return () => {
      if (canControlScrollRestoration && previousScrollRestoration) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    let idleHandle;
    let fallbackPreloadTimeout;
    let minDelayTimeout;
    let bootTimeout;
    let rafBootA;
    let rafBootB;

    const boot = async () => {
      const minDelay = new Promise((resolve) => {
        minDelayTimeout = window.setTimeout(resolve, BOOT_MIN_DELAY_MS);
      });

      const nextPaint = new Promise((resolve) => {
        rafBootA = window.requestAnimationFrame(() => {
          rafBootB = window.requestAnimationFrame(resolve);
        });
      });

      const preloadImages = Promise.allSettled(
        BOOT_IMAGES.map((name) => preloadImage(`${import.meta.env.BASE_URL}${name}`))
      );

      const preloadReady = withTimeout(
        preloadImages,
        BOOT_ASSET_TIMEOUT_MS
      );

      bootTimeout = window.setTimeout(() => {
        if (!isCancelled) {
          setIsBootReady(true);
        }
      }, BOOT_ASSET_TIMEOUT_MS + BOOT_MIN_DELAY_MS + 300);

      await Promise.allSettled([minDelay, nextPaint, preloadReady]);

      if (!isCancelled) {
        setIsBootReady(true);
      }
    };

    boot();

    const preloadNonCriticalInBackground = () => {
      BOOT_IMAGES.forEach((name) => {
        const img = new Image();
        img.src = `${import.meta.env.BASE_URL}${name}`;
      });

      ROUTE_PRELOADERS.forEach((loadRoute) => {
        void loadRoute();
      });
    };

    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(preloadNonCriticalInBackground, { timeout: 1200 });
    } else {
      fallbackPreloadTimeout = window.setTimeout(preloadNonCriticalInBackground, 350);
    }

    return () => {
      isCancelled = true;
      window.clearTimeout(minDelayTimeout);
      window.clearTimeout(bootTimeout);
      window.clearTimeout(fallbackPreloadTimeout);
      window.cancelAnimationFrame(rafBootA);
      window.cancelAnimationFrame(rafBootB);
      if (idleHandle && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleHandle);
      }
    };
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV || !isBootReady || hasLoggedBootMeasureRef.current || typeof performance === "undefined") {
      return;
    }

    performance.mark("app-boot-ready");
    performance.measure("app-boot-duration", "app-boot-start", "app-boot-ready");

    const [entry] = performance.getEntriesByName("app-boot-duration").slice(-1);
    if (entry) {
      console.info(`[perf] App boot ready in ${entry.duration.toFixed(1)}ms`);
    }

    hasLoggedBootMeasureRef.current = true;
  }, [isBootReady]);

  useEffect(() => {
    let rafA;
    let rafB;

    // Prime decorations behind the loader so the first visible frame already has flowing shapes.
    rafA = window.requestAnimationFrame(() => {
      rafB = window.requestAnimationFrame(() => {
        setShowDecorations(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(rafA);
      window.cancelAnimationFrame(rafB);
    };
  }, []);

  useEffect(() => {
    if (!showDecorations) {
      return;
    }

    let rafA;
    let rafB;
    let isCancelled = false;

    // Wait an extra paint cycle after mounting waves so reveal starts with lines already rendered.
    rafA = window.requestAnimationFrame(() => {
      rafB = window.requestAnimationFrame(() => {
        if (!isCancelled) {
          setIsWavePaintReady(true);
        }
      });
    });

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(rafA);
      window.cancelAnimationFrame(rafB);
    };
  }, [showDecorations]);

  useEffect(() => {
    if (!showDecorations) {
      return;
    }

    const lockTimeout = window.setTimeout(() => {
      setAreShapesLocked(true);
    }, 3600);

    return () => {
      window.clearTimeout(lockTimeout);
    };
  }, [showDecorations]);

  useEffect(() => {
    if (!canRevealApp) {
      return;
    }

    let hideLoaderTimeout;
    const rafId = window.requestAnimationFrame(() => {
      setIsLoaderExiting(true);
      hideLoaderTimeout = window.setTimeout(() => {
        setShowLoader(false);
      }, 260);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(hideLoaderTimeout);
    };
  }, [canRevealApp]);

  return (
    <ErrorBoundary>
      <>
        <div className={`site-root ${canRevealApp ? "site-root-enter" : "site-root-preboot"}`}>
          <SkipToContent />

          <div className={`theme-bg ${showDecorations ? "is-ready" : "is-deferred"} ${areShapesLocked ? "is-locked" : ""}`} aria-hidden="true">
            {showDecorations && (
              <>
                <AnimatedWaves />
                <span className="orb orb-left" />
                <span className="orb orb-nav-cut orb-nav-1" />
                <span className="orb orb-nav-cut orb-nav-2" />
                <span className="hexagon hex-1" />
                <span className="hexagon hex-2" />
                <span className="hexagon hex-5" />
                <span className="hexagon hex-6" />
                <span className="orb orb-3" />
                <span className="orb orb-8" />
                <span className="floating-plus plus-1" />
                <span className="floating-plus plus-4" />
                <span className="floating-plus plus-6" />
              </>
            )}
          </div>

          <div className={`theme-bg-footer ${showDecorations ? "is-ready" : "is-deferred"} ${areShapesLocked ? "is-locked" : ""}`} aria-hidden="true">
            {showDecorations && (
              <>
                <span className="beam beam-two" />
                <span className="hexagon hex-3" />
                <span className="hexagon hex-4" />
                <span className="hexagon hex-7" />
                <span className="hexagon hex-8" />
                <span className="orb orb-10" />
                <span className="floating-plus plus-7" />
              </>
            )}
          </div>

          <Navbar />

          <main className="main-content" id="main-content">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <Suspense fallback={<RouteLoadingFallback label="Loading home..." />}>
                      <Home name="Brian Dang" job="Software Engineer" />
                    </Suspense>
                  }
                />
                <Route
                  path="/portfolio"
                  element={
                    <Suspense fallback={<RouteLoadingFallback label="Loading portfolio..." />}>
                      <Portfolio />
                    </Suspense>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <Suspense fallback={<RouteLoadingFallback label="Loading about..." />}>
                      <About />
                    </Suspense>
                  }
                />
                <Route
                  path="*"
                  element={
                    <PageTransition>
                      <SEO title="404 - Page Not Found" />
                      <section className="page-shell">
                        <h1>404</h1>
                        <p>The signal you requested does not exist on this frequency.</p>
                      </section>
                    </PageTransition>
                  }
                />
              </Routes>
            </AnimatePresence>
          </main>

          <Footer />
        </div>

        {showLoader && (
          <div
            className={`app-loader ${isLoaderExiting ? "is-exiting" : ""}`}
            role="status"
            aria-live="polite"
            aria-busy={!canRevealApp}
          >
            <div className="app-loader-mark" aria-hidden="true" />
            <p className="app-loader-text">Loading experience...</p>
          </div>
        )}
      </>
    </ErrorBoundary>
  );
}

export default App;
