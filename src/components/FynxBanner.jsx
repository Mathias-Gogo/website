import './FynxBanner.css'

export default function FynxBanner({ badgeText = 'Now in beta', tagline = 'Your AI Workforce' }) {
    return (
        <div className="fynx-banner">
            <div className="fynx-gradient" />
            <div className="fynx-noise" />
            <div className="fynx-grid" />
            <div className="fynx-glow" />

            <div className="fynx-badge">
                <div className="fynx-badge-dot" />
                <span className="fynx-badge-text">{badgeText}</span>
            </div>

            <div className="fynx-content">
                <h1 className="fynx-wordmark"><span>Fynx</span></h1>
                <p className="fynx-tagline">{tagline}</p>
            </div>
        </div>
    )
}