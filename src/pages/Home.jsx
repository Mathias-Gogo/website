import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'

const HERO_VIDEO =
  "https://res.cloudinary.com/dbrjr5zqp/video/upload/v1778840498/Day_clear_blue_skies_clouds_202605151115_p3depy.mp4";

function usePosts() {
  const [featured, setFeatured] = useState({ main: null, small: [] })
  const [stories, setStories] = useState([])
  const [research, setResearch] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, slug, cover_image, meta, sections, is_featured, featured_order')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (!data) { setLoading(false); return }

      const featuredPosts = data
        .filter(p => p.is_featured)
        .sort((a, b) => a.featured_order - b.featured_order)

      setFeatured({
        main: featuredPosts[0] || null,
        small: featuredPosts.slice(1, 3),
      })

      setStories(data.filter(p => p.sections?.includes('news')))
      setResearch(data.filter(p => p.sections?.includes('research')))
      setBlogs(data.filter(p => p.sections?.includes('articles')))

      setLoading(false)
    }
    fetch()
  }, [])

  return { featured, stories, research, blogs, loading }
}

const FOOTER_PRODUCTS = ["Fynx", "Fynx API", "Fynx for Enterprise", "Fynx Mobile", "Fynx Cloud"]
const FOOTER_SOLUTIONS = ["AI Agents", "Code Generation", "Customer Support", "Education", "Healthcare", "Financial Services"]
const FOOTER_RESOURCES = ["Blog", "Partner Network", "Community", "Connectors", "Courses", "Customer Stories", "Engineering at Mexuri", "Events", "Inside Fynx", "Plugins", "Powered by Mexuri", "Service Partners", "Startups Program", "Tutorials", "Use Cases"]
const FOOTER_COMPANY = ["About", "Careers", "Economic Futures", "Research", "News", "Constitution", "Responsible Scaling", "Security & Compliance", "Transparency"]
const FOOTER_TERMS = ["Privacy Choices", "Privacy Policy", "Health Data Privacy", "Responsible Disclosure", "Terms of Service: Commercial", "Terms of Service: Consumer", "Usage Policy"]
const FOOTER_HELP = ["Availability", "Status", "Support Center"]

/* ─────────────────────────────────────────────────────────
   SKELETON COMPONENTS
───────────────────────────────────────────────────────── */
const shimmerStyle = {
  background: 'linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.4s ease infinite',
}

function SkeletonCard({ height = '360px', width = '520px' }) {
  return (
    <div style={{ flex: `0 0 ${width}`, display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{
        width: '100%', height,
        borderRadius: '14px',
        border: '1px solid #1e1e1e',
        flexShrink: 0,
        ...shimmerStyle,
      }} />
      <div style={{ height: '18px', width: '80%', borderRadius: '6px', ...shimmerStyle }} />
      <div style={{ height: '13px', width: '52%', borderRadius: '6px', ...shimmerStyle }} />
    </div>
  )
}

function SkeletonFeaturedMain() {
  return (
    <div style={{
      borderRadius: '16px',
      border: '1px solid #1e1e1e',
      aspectRatio: '5/4',
      minHeight: '640px',
      ...shimmerStyle,
    }} />
  )
}

function SkeletonFeaturedSmall() {
  return (
    <div style={{
      borderRadius: '16px',
      border: '1px solid #1e1e1e',
      aspectRatio: '16/11',
      ...shimmerStyle,
    }} />
  )
}

/* ─────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

  :root {
    --bg: #080808;
    --surface: #111111;
    --surface-elevated: #161616;
    --border: #222222;
    --border-subtle: #1a1a1a;
    --text-1: #ffffff;
    --text-2: #b0b0b0;
    --text-3: #737373;
    --text-4: #4a4a4a;
    --blue: #5fcff8;
    --blue-hv: rgb(74, 174, 210);
    --blue-glow: rgba(249, 115, 22, 0.12);
    --font-display: 'Syne', 'Montserrat', system-ui, sans-serif;
    --font-body: 'DM Sans', 'Montserrat', system-ui, sans-serif;
    --font-accent: 'Montserrat', system-ui, sans-serif;
    --nav-h: 72px;
    --max-w: 1600px;
    --section-pad: 22px;
    --section-pad-sm: 80px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; scrollbar-width: none; }
  html { scroll-behavior: smooth; }

  .mexuri-home {
    font-family: var(--font-body);
    background: var(--bg);
    color: var(--text-1);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
  }

  /* ── Skeleton shimmer ── */
  @keyframes skeleton-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── NAV ── */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    height: var(--nav-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 3rem;
    transition: background 0.5s cubic-bezier(0.4,0,0.2,1),
                border-color 0.5s cubic-bezier(0.4,0,0.2,1),
                box-shadow 0.5s cubic-bezier(0.4,0,0.2,1);
    border-bottom: 1px solid transparent;
    max-width: 100%;
    margin: 0 auto;
  }

  .nav.scrolled {
    background: rgba(10, 10, 10, 0.88);
    backdrop-filter: blur(20px) saturate(1.3);
    -webkit-backdrop-filter: blur(20px) saturate(1.3);
    border-bottom-color: var(--border-subtle);
  }

  .nav-logo {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--text-1);
    text-decoration: none;
    letter-spacing: -0.8px;
    flex-shrink: 0;
  }
  .nav-logo span { color: var(--blue); }

  .nav-center {
    display: flex;
    align-items: center;
    gap: 3rem;
    list-style: none;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .nav-center a, .nav-center button {
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    color: var(--text-2);
    text-decoration: none;
    transition: color 0.3s ease;
    white-space: nowrap;
    background: none;
    border: none;
    cursor: pointer;
    letter-spacing: 0.01em;
  }
  .nav-center a:hover, .nav-center button:hover { color: var(--text-1); }

  .nav-dropdown-wrap { position: relative; }

  .nav-dropdown-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0;
  }
  .nav-dropdown-btn svg { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); opacity: 0.6; }
  .nav-dropdown-btn.open svg { transform: rotate(180deg); opacity: 1; }

  .nav-dropdown {
    position: absolute;
    top: calc(100% + 18px);
    left: 50%;
    background: var(--surface-elevated);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 8px;
    min-width: 220px;
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) translateY(-8px);
    transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.4,0,0.2,1), visibility 0.25s;
    pointer-events: none;
    box-shadow: 0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02);
  }
  .nav-dropdown.open {
    opacity: 1; visibility: visible;
    transform: translateX(-50%) translateY(0);
    pointer-events: all;
  }
  .nav-dropdown a {
    display: block;
    padding: 0.65rem 1rem;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text-2);
    text-decoration: none;
    border-radius: 10px;
    transition: background 0.2s, color 0.2s;
    white-space: nowrap;
  }
  .nav-dropdown a:hover { background: rgba(255,255,255,0.04); color: var(--text-1); }
  .nav-dropdown-label {
    font-family: var(--font-accent);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-4);
    padding: 0.6rem 1rem 0.3rem;
  }

  .nav-cta {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    background: var(--blue);
    border: none;
    border-radius: 10px;
    padding: 10px 24px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    flex-shrink: 0;
    letter-spacing: 0.01em;
  }
  .nav-cta:hover {
    background: var(--blue-hv);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px var(--blue-glow);
  }

  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    margin-left: auto;
  }
  .nav-hamburger span {
    display: block;
    width: 22px;
    height: 1.5px;
    background: var(--text-1);
    transition: transform 0.3s, opacity 0.3s;
    transform-origin: center;
  }
  .nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .nav-hamburger.open span:nth-child(2) { opacity: 0; }
  .nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  .nav-drawer {
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: min(380px, 88vw);
    background: var(--surface);
    border-left: 1px solid var(--border);
    z-index: 200;
    display: flex;
    flex-direction: column;
    padding: 1.5rem 2rem;
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .nav-drawer.open { transform: translateX(0); }

  .nav-drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    z-index: 199;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.35s, visibility 0.35s;
  }
  .nav-drawer-overlay.open { opacity: 1; visibility: visible; }

  .nav-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.5rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--border-subtle);
  }

  .nav-drawer-close {
    background: none;
    border: none;
    color: var(--text-3);
    cursor: pointer;
    font-size: 22px;
    line-height: 1;
    padding: 4px;
    transition: color 0.2s;
  }
  .nav-drawer-close:hover { color: var(--text-1); }

  .nav-drawer-links { display: flex; flex-direction: column; flex: 1; }
  .nav-drawer-links > a {
    display: block;
    padding: 1rem 0;
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 600;
    color: var(--text-1);
    text-decoration: none;
    border-bottom: 1px solid var(--border-subtle);
    transition: color 0.2s;
    letter-spacing: -0.2px;
  }
  .nav-drawer-links > a:hover { color: var(--blue); }

  .nav-drawer-section-label {
    display: block;
    padding: 1.5rem 0 0.6rem;
    font-family: var(--font-accent);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-4);
  }

  .nav-drawer-sub a {
    display: block;
    padding: 0.7rem 0 0.7rem 1.25rem;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-2);
    text-decoration: none;
    transition: color 0.2s;
    border-left: 2px solid var(--border-subtle);
  }
  .nav-drawer-sub a:hover { color: var(--text-1); border-left-color: var(--blue); }

  .nav-drawer-cta {
    margin-top: 2rem;
    display: block;
    text-align: center;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    background: var(--blue);
    border-radius: 100px;
    padding: 14px 28px;
    text-decoration: none;
    transition: background 0.2s;
    letter-spacing: 0.01em;
  }
  .nav-drawer-cta:hover { background: var(--blue-hv); }

  /* ── Hero ── */
  .hero {
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
  }

  .hero-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.9) 100%);
    z-index: 1;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 48px 100px;
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 80px;
    align-items: end;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(40px, 5.5vw, 72px);
    line-height: 1.08;
    font-weight: 700;
    letter-spacing: -2px;
    color: var(--text-1);
  }

  .hero-right { max-width: 420px; padding-bottom: 8px; }
  .hero-right p {
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.7;
    margin-bottom: 24px;
    color: var(--text-2);
    font-weight: 400;
  }

  /* ── Fynx Banner ── */
  .fynx-banner {
    position: relative;
    display: flex;
    margin: 60px auto 0 auto;
    width: 95%;
    aspect-ratio: 16 / 7;
    border-radius: 16px;
    overflow: hidden;
    font-family: 'Syne', sans-serif;
  }

  .fynx-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 80% 110%, #f97316 0%, transparent 55%),
      radial-gradient(ellipse at 15% -20%, rgb(4, 112, 151) 0%, transparent 50%),
      radial-gradient(ellipse at 60% 60%, #5fcff8 0%, transparent 60%),
      linear-gradient(135deg, rgb(12,41,32) 0%, rgb(17,110,209) 40%, #5fcff8 70%, #1a0a2e 100%);
    z-index: 0;
  }

  .fynx-noise {
    position: absolute; inset: 0; z-index: 1;
    opacity: 0.045;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  .fynx-grid {
    position: absolute; inset: 0; z-index: 1;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse at 20% 80%, black 20%, transparent 70%);
  }

  .fynx-glow {
    position: absolute; bottom: -40px; left: -20px;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%);
    z-index: 1; filter: blur(30px);
  }

  .fynx-content {
    position: absolute; bottom: 0; left: 0;
    padding: 28px 32px; z-index: 2;
    display: flex; flex-direction: column; gap: 4px;
  }

  .fynx-actions {
    display: flex; align-items: center; gap: 10px;
    margin-top: 20px; opacity: 0; transform: translateY(10px);
    animation: fynx-rise 0.7s cubic-bezier(0.22,1,0.36,1) 0.42s forwards;
  }

  .fynx-btn-primary {
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    color: #fff; background: #f97316; border: none; border-radius: 8px;
    padding: 10px 20px; cursor: pointer; letter-spacing: 0.02em;
    transition: background 0.15s, transform 0.1s;
  }
  .fynx-btn-primary:hover  { background: #ea580c; }
  .fynx-btn-primary:active { transform: scale(0.97); }

  .fynx-btn-ghost {
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px; padding: 10px 20px; cursor: pointer;
    letter-spacing: 0.02em; backdrop-filter: blur(8px);
    transition: background 0.15s, color 0.15s, transform 0.1s;
  }
  .fynx-btn-ghost:hover  { background: rgba(255,255,255,0.1); color: #fff; }
  .fynx-btn-ghost:active { transform: scale(0.97); }

  .fynx-wordmark {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 6vw, 64px); font-weight: 800;
    background: linear-gradient(90deg, #ffffff, rgba(241,244,249,0.8));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -0.03em; line-height: 1; margin: 0;
    opacity: 0; transform: translateY(16px);
    animation: fynx-rise 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s forwards;
  }
  .fynx-wordmark span {
    background: linear-gradient(90deg, #f1f4f9, #fb923c);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .fynx-tagline {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(12px, 1.6vw, 16px); font-weight: 500;
    color: rgba(255,255,255,0.55); letter-spacing: 0.08em;
    text-transform: uppercase; margin: 0;
    opacity: 0; transform: translateY(12px);
    animation: fynx-rise 0.7s cubic-bezier(0.22,1,0.36,1) 0.28s forwards;
  }

  @keyframes fynx-rise {
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── Watch button ── */
  .watch-btn {
    background: none; border: none; color: var(--text-1);
    font-family: var(--font-body); font-size: 15px; font-weight: 600;
    cursor: pointer; padding: 0;
    display: inline-flex; align-items: center; gap: 10px;
    transition: gap 0.3s ease, color 0.3s ease; letter-spacing: 0.01em;
  }
  .watch-btn::after { content: '→'; font-size: 18px; transition: transform 0.3s ease; }
  .watch-btn:hover { gap: 14px; color: var(--blue); }
  .watch-btn:hover::after { transform: translateX(4px); }

  /* ── Featured ── */
  .featured-section {
    padding: var(--section-pad) 48px;
    max-width: var(--max-w);
    margin: 50px auto;
  }

  .featured-grid {
    display: grid;
    grid-template-columns: 1.8fr 1fr;
    gap: 28px;
    align-items: stretch;
  }

  .feature-card {
    position: relative; border-radius: 16px; overflow: hidden;
    background: var(--surface); cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease;
    border: 1px solid var(--border-subtle);
  }
  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03);
  }
  .feature-card.tall { aspect-ratio: 5/4; min-height: 640px; }
  .feature-card.small { aspect-ratio: 16/11; min-height: 40%; }

  .feature-right { display: grid; grid-template-rows: 1fr 1fr; gap: 28px; }

  .feature-card img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
  }
  .feature-card:hover img { transform: scale(1.04); }

  .feature-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.05) 70%, rgba(0,0,0,0) 100%);
    z-index: 1; transition: background 0.4s ease;
  }
  .feature-card:hover .feature-card-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0) 100%);
  }

  .feature-card-content {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 36px; z-index: 2;
  }
  .feature-card-content h3 {
    font-family: var(--font-display); font-size: 28px; font-weight: 700;
    margin-bottom: 10px; letter-spacing: -0.5px; line-height: 1.2; color: var(--text-1);
  }
  .feature-card.small .feature-card-content h3 { font-size: 20px; letter-spacing: -0.3px; }
  .feature-card-content p { font-family: var(--font-body); font-size: 14px; color: var(--text-2); font-weight: 400; line-height: 1.5; max-width: 90%; }
  .feature-card.small .feature-card-content p { font-size: 13px; }

  .feature-empty { text-align: center; padding: 100px 0; color: var(--text-3); font-family: var(--font-body); font-size: 15px; }

  /* ── Section rows ── */
  .section {
    padding: var(--section-pad) 48px;
    max-width: var(--max-w);
    margin: 0 auto;
  }

  .section-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;
  }

  .section-title {
    font-family: var(--font-display); font-size: 13px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3);
  }

  .section-arrows { display: flex; gap: 10px; }

  .section-arrow {
    width: 40px; height: 40px; border-radius: 50%;
    border: 1px solid var(--border); background: transparent;
    color: var(--text-3); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
  }
  .section-arrow:hover:not(:disabled) { border-color: var(--text-2); color: var(--text-1); background: var(--surface-elevated); }
  .section-arrow:disabled { opacity: 0.25; cursor: not-allowed; }
  .section-arrow svg { width: 16px; height: 16px; }

  .scroll-row-wrap { position: relative; overflow: hidden; }

  .scroll-row {
    display: flex; gap: 28px; overflow-x: auto;
    scroll-behavior: smooth; scroll-snap-type: x mandatory;
    padding-bottom: 16px; scrollbar-width: none; -ms-overflow-style: none;
  }
  .scroll-row::-webkit-scrollbar { display: none; }

  .story-card {
    flex: 0 0 520px; display: flex; flex-direction: column;
    scroll-snap-align: start; cursor: pointer;
  }
  .story-card .img-wrap {
    width: 100%; height: 360px; overflow: hidden; border-radius: 14px;
    margin-bottom: 20px; background: var(--surface);
    border: 1px solid var(--border-subtle); transition: border-color 0.3s ease;
  }
  .story-card:hover .img-wrap { border-color: var(--border); }
  .story-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
  .story-card:hover img { transform: scale(1.04); }
  .story-card h4 { font-family: var(--font-display); font-size: 18px; font-weight: 600; line-height: 1.35; letter-spacing: -0.3px; color: var(--text-1); transition: color 0.2s ease; }
  .story-card:hover h4 { color: var(--blue); }
  .story-card .meta { font-family: var(--font-body); font-size: 13px; color: var(--text-3); margin-top: 8px; line-height: 1.5; font-weight: 400; }

  .blog-card {
    flex: 0 0 520px; display: flex; flex-direction: column;
    scroll-snap-align: start; cursor: pointer;
  }
  .blog-card .img-wrap {
    width: 100%; height: 360px; overflow: hidden; border-radius: 14px;
    margin-bottom: 18px; background: var(--surface);
    border: 1px solid var(--border-subtle); transition: border-color 0.3s ease;
  }
  .blog-card:hover .img-wrap { border-color: var(--border); }
  .blog-card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
  .blog-card:hover img { transform: scale(1.04); }
  .blog-card h4 { font-family: var(--font-display); font-size: 17px; font-weight: 600; line-height: 1.35; letter-spacing: -0.3px; margin-bottom: 6px; color: var(--text-1); transition: color 0.2s ease; }
  .blog-card:hover h4 { color: var(--blue); }
  .blog-card .meta { font-family: var(--font-body); font-size: 13px; color: var(--text-3); font-weight: 400; }

  .section-empty { color: var(--text-4); font-family: var(--font-body); font-size: 14px; padding: 60px 0; font-weight: 400; }

  /* ── Video Modal ── */
  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.92);
    backdrop-filter: blur(8px); z-index: 300;
    display: flex; align-items: center; justify-content: center;
    padding: 32px; animation: fadeIn 0.25s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal-box {
    position: relative; width: 100%; max-width: 1000px;
    aspect-ratio: 16/9; background: #000; border-radius: 16px;
    overflow: hidden; animation: scaleIn 0.3s cubic-bezier(0.4,0,0.2,1);
    border: 1px solid var(--border);
  }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

  .modal-close {
    position: absolute; top: -52px; right: 0;
    background: rgba(255,255,255,0.08); color: #fff;
    border: 1px solid rgba(255,255,255,0.12); border-radius: 50%;
    width: 40px; height: 40px; font-size: 18px; cursor: pointer;
    font-weight: 500; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, transform 0.2s;
  }
  .modal-close:hover { background: rgba(255,255,255,0.15); transform: rotate(90deg); }
  .modal-box video { width: 100%; height: 100%; border: 0; display: block; }

  /* ── Footer ── */
  .footer {
    border-top: 1px solid var(--border-subtle);
    padding: 80px 48px 48px;
    max-width: var(--max-w);
    margin: 0 auto;
  }
  .footer-grid { display: grid; grid-template-columns: 200px 1fr; gap: 100px; }
  .footer-brand { display: flex; flex-direction: column; gap: 32px; }
  .footer-logo-lg { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: var(--text-1); text-decoration: none; letter-spacing: -1px; }
  .footer-logo-lg span { color: var(--blue); }
  .footer-socials { display: flex; gap: 16px; margin-top: auto; }
  .footer-socials a { color: var(--text-4); transition: color 0.3s ease, transform 0.2s ease; display: flex; align-items: center; }
  .footer-socials a:hover { color: var(--text-1); transform: translateY(-2px); }
  .footer-socials svg { width: 20px; height: 20px; }
  .footer-links-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 48px; }
  .footer-col h5 { font-family: var(--font-accent); font-size: 12px; font-weight: 600; color: var(--text-1); margin-bottom: 20px; letter-spacing: 0.06em; text-transform: uppercase; }
  .footer-col a { display: block; font-family: var(--font-body); font-size: 13.5px; color: var(--text-3); text-decoration: none; padding: 6px 0; transition: color 0.25s ease, padding-left 0.25s ease; line-height: 1.6; font-weight: 400; }
  .footer-col a:hover { color: var(--text-1); padding-left: 4px; }
  .footer-bottom { margin-top: 64px; padding-top: 28px; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; }
  .footer-copy { font-family: var(--font-body); font-size: 12.5px; color: var(--text-4); font-weight: 400; }
  .footer-legal { display: flex; gap: 24px; }
  .footer-legal a { font-family: var(--font-body); font-size: 12.5px; color: var(--text-4); text-decoration: none; transition: color 0.25s ease; font-weight: 400; }
  .footer-legal a:hover { color: var(--text-1); }

  /* ── Responsive ── */
  @media (min-width: 901px) and (max-width: 1240px) {
    .footer-links-grid { grid-template-columns: repeat(2, 1fr); }
    .footer-grid { gap: 60px; }
    .featured-grid { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; }
    .feature-card.tall { max-height: 250px; width: 100%; }
    .feature-card.small { width: 100%; }
    .feature-right { border: 1px solid white; width: 100%; display: flex; flex-direction: row; }
    .story-card, .blog-card { flex: 0 0 420px; }
    .story-card .img-wrap, .blog-card .img-wrap { height: 300px; }
  }

  @media (max-width: 900px) {
    .nav-center { display: none; }
    .nav-hamburger { display: flex; }
    .nav-cta { display: none; }
    .nav { padding: 0 1.5rem; }
    .hero-content { grid-template-columns: 1fr; padding: 0 24px 60px; gap: 28px; }
    .hero-title { font-size: clamp(32px, 9vw, 48px); letter-spacing: -1px; }
    .section, .featured-section { padding: var(--section-pad-sm) 24px; }
    .featured-grid { grid-template-columns: 1fr; gap: 20px; }
    .feature-card.tall { aspect-ratio: 16/10; min-height: auto; }
    .feature-right { grid-template-rows: none; grid-template-columns: 1fr 1fr; gap: 16px; }
    .feature-card.small { aspect-ratio: 4/3; min-height: auto; }
    .feature-card-content { padding: 24px; }
    .feature-card-content h3 { font-size: 22px; }
    .feature-card.small .feature-card-content h3 { font-size: 15px; }
    .story-card, .blog-card { flex: 0 0 300px; }
    .story-card .img-wrap, .blog-card .img-wrap { height: 240px; }
    .footer-grid { grid-template-columns: 1fr; gap: 48px; }
    .footer-links-grid { grid-template-columns: repeat(2, 1fr); gap: 36px; }
    .footer-bottom { flex-direction: column; gap: 16px; align-items: flex-start; }
  }

  @media (max-width: 560px) {
    .feature-right { grid-template-columns: 1fr; }
    .feature-card.small { aspect-ratio: 16/10; }
    .footer-links-grid { grid-template-columns: 1fr; }
    .story-card, .blog-card { flex: 0 0 280px; }
  }
`

/* ─────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────── */
const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

/* ─────────────────────────────────────────────────────────
   SLIDER HOOK
───────────────────────────────────────────────────────── */
function useSlider(itemCount) {
  const ref = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(itemCount > 3)

  const check = () => {
    const el = ref.current
    if (!el) return
    setCanPrev(el.scrollLeft > 5)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 5)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('scroll', check, { passive: true })
    check()
    return () => el.removeEventListener('scroll', check)
  }, [])

  const scroll = (dir) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -420 : 420, behavior: 'smooth' })
  }

  return { ref, canPrev, canNext, scroll }
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function Home() {
  const [videoOpen, setVideoOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { featured, stories, research, blogs, loading } = usePosts()

  const storiesSlider = useSlider(stories.length)
  const researchSlider = useSlider(research.length)
  const blogsSlider = useSlider(blogs.length)

  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <div className="mexuri-home">
      <style>{styles}</style>

      {/* ── NAV ── */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a href="#" className="nav-logo">Mexuri<span>.</span></a>

        <ul className="nav-center">
          <li><a href="#">Products</a></li>
          <li className="nav-dropdown-wrap" ref={dropdownRef}>
            <button
              className={`nav-dropdown-btn${dropdownOpen ? ' open' : ''}`}
              onClick={() => setDropdownOpen(p => !p)}
            >
              Resources
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className={`nav-dropdown${dropdownOpen ? ' open' : ''}`}>
              <div className="nav-dropdown-label">Explore</div>
              <a href="#" onClick={() => setDropdownOpen(false)}>Research</a>
              <a href="#" onClick={() => setDropdownOpen(false)}>Articles</a>
              <a href="#" onClick={() => setDropdownOpen(false)}>Economic Impact</a>
            </div>
          </li>
          <li><a href="#news">News</a></li>
        </ul>

        <a href="#" className="nav-cta">Try Fynx</a>

        <button
          className={`nav-hamburger${drawerOpen ? ' open' : ''}`}
          onClick={() => setDrawerOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div className={`nav-drawer-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <div className={`nav-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="nav-drawer-header">
          <span className="nav-logo">Mexuri<span>.</span></span>
          <button className="nav-drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        <div className="nav-drawer-links">
          <a href="#" onClick={() => setDrawerOpen(false)}>Products</a>
          <span className="nav-drawer-section-label">Resources</span>
          <div className="nav-drawer-sub">
            <a href="#" onClick={() => setDrawerOpen(false)}>Research</a>
            <a href="#" onClick={() => setDrawerOpen(false)}>Articles</a>
            <a href="#" onClick={() => setDrawerOpen(false)}>Economic Impact</a>
          </div>
          <a href="#" onClick={() => setDrawerOpen(false)}>News</a>
        </div>
        <a href="#" className="nav-drawer-cta">Try Fynx</a>
      </div>

      {/* ── HERO ── */}
      <header className="hero">
        <video className="hero-video" src={HERO_VIDEO} autoPlay muted loop playsInline />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">
            Technology for every<br />corner of Africa.
          </h1>
          <div className="hero-right">
            <p>
              Big problems exist across Africa. We exist to solve them — with
              technology built here, for here.
            </p>
            <button className="watch-btn" onClick={() => setVideoOpen(true)}>
              Watch Video
            </button>
          </div>
        </div>
      </header>

      {/* ── FYNX BANNER ── */}
      <div className="fynx-banner">
        <div className="fynx-gradient" />
        <div className="fynx-noise" />
        <div className="fynx-grid" />
        <div className="fynx-glow" />
        <div className="fynx-content">
          <h1 className="fynx-wordmark">Introducing <span>Fynx 1.0</span></h1>
          <p className="fynx-tagline">Your AI Employees</p>
          <div className="fynx-actions">
            <a href="/fynx">
              <button className="fynx-btn-primary">Check it out</button>
            </a>
            <button className="fynx-btn-ghost">Read about it</button>
          </div>
        </div>
      </div>

      {/* ── FEATURED ── */}
      <section className="featured-section">
        <div className="section-header" style={{ marginBottom: '28px' }}>
          <h2 className="section-title">Featured</h2>
        </div>

        {loading ? (
          <div className="featured-grid">
            <SkeletonFeaturedMain />
            <div className="feature-right">
              <SkeletonFeaturedSmall />
              <SkeletonFeaturedSmall />
            </div>
          </div>
        ) : !featured.main ? (
          <div className="feature-empty">No featured posts yet.</div>
        ) : (
          <div className="featured-grid">
            <div className="feature-card tall" onClick={() => navigate(`/blog/${featured.main.slug}`)}>
              <img src={featured.main.cover_image} alt={featured.main.title} loading="lazy" />
              <div className="feature-card-overlay" />
              <div className="feature-card-content">
                <h3>{featured.main.title}</h3>
                <p>{featured.main.meta}</p>
              </div>
            </div>
            <div className="feature-right">
              {featured.small.map((c) => (
                <div className="feature-card small" key={c.id} onClick={() => navigate(`/blog/${c.slug}`)}>
                  <img src={c.cover_image} alt={c.title} loading="lazy" />
                  <div className="feature-card-overlay" />
                  <div className="feature-card-content">
                    <h3>{c.title}</h3>
                    <p>{c.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── NEWS ── */}
      <section className="section" id="news">
        <div className="section-header">
          <h2 className="section-title">Latest News / Stories</h2>
          <div className="section-arrows">
            <button className="section-arrow" onClick={() => storiesSlider.scroll('left')} disabled={!storiesSlider.canPrev}><ArrowLeft /></button>
            <button className="section-arrow" onClick={() => storiesSlider.scroll('right')} disabled={!storiesSlider.canNext}><ArrowRight /></button>
          </div>
        </div>
        <div className="scroll-row" ref={storiesSlider.ref}>
          {loading
            ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
            : stories.length === 0
              ? <p className="section-empty">No stories published yet.</p>
              : stories.map((s) => (
                <div className="story-card" key={s.id} onClick={() => navigate(`/blog/${s.slug}`)}>
                  <div className="img-wrap">
                    <img src={s.cover_image} alt={s.title} loading="lazy" />
                  </div>
                  <h4>{s.title}</h4>
                </div>
              ))
          }
        </div>
      </section>

      {/* ── RESEARCH ── */}
      <section className="section" id="research">
        <div className="section-header">
          <h2 className="section-title">Research</h2>
          <div className="section-arrows">
            <button className="section-arrow" onClick={() => researchSlider.scroll('left')} disabled={!researchSlider.canPrev}><ArrowLeft /></button>
            <button className="section-arrow" onClick={() => researchSlider.scroll('right')} disabled={!researchSlider.canNext}><ArrowRight /></button>
          </div>
        </div>
        <div className="scroll-row" ref={researchSlider.ref}>
          {loading
            ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
            : research.length === 0
              ? <p className="section-empty">No research published yet.</p>
              : research.map((s) => (
                <div className="story-card" key={s.id} onClick={() => navigate(`/blog/${s.slug}`)}>
                  <div className="img-wrap">
                    <img src={s.cover_image} alt={s.title} loading="lazy" />
                  </div>
                  <h4>{s.title}</h4>
                  {s.meta && <p className="meta">{s.meta}</p>}
                </div>
              ))
          }
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section className="section" id="articles">
        <div className="section-header">
          <h2 className="section-title">Articles</h2>
          <div className="section-arrows">
            <button className="section-arrow" onClick={() => blogsSlider.scroll('left')} disabled={!blogsSlider.canPrev}><ArrowLeft /></button>
            <button className="section-arrow" onClick={() => blogsSlider.scroll('right')} disabled={!blogsSlider.canNext}><ArrowRight /></button>
          </div>
        </div>
        <div className="scroll-row" ref={blogsSlider.ref}>
          {loading
            ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
            : blogs.length === 0
              ? <p className="section-empty">No articles published yet.</p>
              : blogs.map((b) => (
                <div className="blog-card" key={b.id} onClick={() => navigate(`/blog/${b.slug}`)}>
                  <div className="img-wrap">
                    <img src={b.cover_image} alt={b.title} loading="lazy" />
                  </div>
                  <h4>{b.title}</h4>
                  <p className="meta">{b.meta}</p>
                </div>
              ))
          }
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="footer-logo-lg">Mexuri<span>.</span></a>
            <div className="footer-socials">
              <a href="https://www.linkedin.com/company/mexuri/" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="https://www.instagram.com/mexuri_ai/" aria-label="X"><XIcon /></a>
              <a href="https://youtube.com/@mexuri-m6b?si=MV_nkOi6BC4-Z8Jk" aria-label="YouTube"><YouTubeIcon /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© Mexuri 2026. All rights reserved.</span>
          <div className="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>

      {/* ── VIDEO MODAL ── */}
      {videoOpen && (
        <div className="modal-backdrop" onClick={() => setVideoOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setVideoOpen(false)} aria-label="Close">✕</button>
            <video src={HERO_VIDEO} controls autoPlay />
          </div>
        </div>
      )}
    </div>
  )
}