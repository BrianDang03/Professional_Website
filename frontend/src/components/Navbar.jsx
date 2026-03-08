import { NavLink } from "react-router-dom";

export default function Navbar() {
    const navLinkClass = ({ isActive }) =>
        `nav-link ${isActive ? "is-active" : ""}`;

    return (
        <header className="site-header">
            <nav className="site-nav" aria-label="Primary navigation">
                <NavLink to="/" className="brand-mark">
                    <span className="brand-ring" aria-hidden="true" />
                    <span className="brand-text">Brian Dang</span>
                </NavLink>

                <div className="nav-links">
                    <NavLink to="/" className={navLinkClass} end>
                        Home
                    </NavLink>
                    <NavLink to="/portfolio" className={navLinkClass}>
                        Portfolio
                    </NavLink>
                    <NavLink to="/about" className={navLinkClass}>
                        About
                    </NavLink>
                </div>

                <a href="mailto:hello@briandang.dev" className="nav-cta">
                    Contact
                </a>
            </nav>
        </header>
    );
}