import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/about">About</Link>
        </nav>
    );
}