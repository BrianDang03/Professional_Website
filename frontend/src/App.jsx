import './App.css';
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Portfolio from './pages/Portfolio';
import About from "./pages/About";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import SkipToContent from "./components/SkipToContent";
import PageTransition from "./components/PageTransition";
import SEO from "./components/SEO";

function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <div className="site-root">
        <SkipToContent />

        <div className="theme-bg" aria-hidden="true">
          <span className="orb orb-left" />
          <span className="orb orb-right" />
          <span className="beam beam-one" />
          <span className="beam beam-two" />
        </div>

        <Navbar />

        <main className="main-content" id="main-content">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home name="Brian Dang" job="Software Engineer" />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/about" element={<About />} />
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
    </ErrorBoundary>
  );
}

export default App;
