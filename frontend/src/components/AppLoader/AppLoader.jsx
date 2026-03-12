import './AppLoader.css';

export default function AppLoader({ show, isExiting, canRevealApp }) {
    if (!show) return null;

    return (
        <div
            className={`app-loader ${isExiting ? "is-exiting" : ""}`}
            role="status"
            aria-live="polite"
            aria-busy={!canRevealApp}
        >
            <div className="app-loader-mark" aria-hidden="true" />
            <p className="app-loader-text">Loading experience...</p>
        </div>
    );
}
