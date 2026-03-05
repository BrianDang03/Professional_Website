import './App.css';
import { Link, Routes, Route } from "react-router-dom";

function NameTitle({name}) {
  return <h1>{name}</h1>
}

function JobTitle({job}) {
  return <h2>{job}</h2>
}

function HomePage({name, job}) {
  return (
    <div>
      <NameTitle name={name} />
      <JobTitle job={job} />
    </div>
  );
}

function AboutPage() {
  return <h1>About Page</h1>
}

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage name="Brian Dang" job="Software Engineer"/>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<h1>404 Page Not Found</h1>}/>
      </Routes>
      <footer>
        Footer
      </footer>
    </div>
  );
}

export default App;
