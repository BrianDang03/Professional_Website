import './App.css';
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Footer from "./components/Footer"
import TiltFlipCard from "./components/tilt_flip_card/TiltFlipCard"

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home name="Brian Dang" job="Software Engineer"/>} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<h1>404 Page Not Found</h1>}/>
      </Routes>
      <TiltFlipCard
        front={
          <>
            <h3>Project Chaos</h3>
            <p>Unity game project — click to see details.</p>
          </>
        }
        back={
          <>
            <h3>Details</h3>
            <ul>
              <li>Role: Game Dev</li>
              <li>Tech: Unity, C#</li>
              <li>Status: Completed</li>
            </ul>
          </>
        }
      />
      <Footer />
    </div>
  );
}

export default App;
