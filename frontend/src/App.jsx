import './App.css';
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Portfolio from './pages/Portfolio';
import About from "./pages/About";
import Footer from "./components/Footer"

function App() {
  return (
    <div className="site-root">
      <div className="theme-bg" aria-hidden="true">
        <span className="orb orb-left" />
        <span className="orb orb-right" />
        <span className="beam beam-one" />
        <span className="beam beam-two" />
      </div>

      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home name="Brian Dang" job="Software Engineer" />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route
            path="*"
            element={
              <section className="page-shell">
                <h1>404</h1>
                <p>The signal you requested does not exist on this frequency.</p>
              </section>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
