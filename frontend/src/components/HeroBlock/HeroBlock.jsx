import './HeroBlock.css';
import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function HeroBlock({ name, job, lead = "Ideas engineered into unforgettable experiences." }) {
  const navigate = useNavigate();

  const handleContact = useCallback(() => {
    navigate('/about', { state: { scrollTo: 'get-in-touch' } });
  }, [navigate]);

  return (
    <div className="hero-block">
      <h1>{name}</h1>
      <h2>{job}</h2>
      <p className="hero-lead">{lead}</p>
      <div className="hero-ctas">
        <Link to="/portfolio" className="hero-btn hero-btn-primary">View My Work</Link>
        <button type="button" className="hero-btn hero-btn-secondary" onClick={handleContact}>
          Get in Touch
        </button>
      </div>
    </div>
  );
}
