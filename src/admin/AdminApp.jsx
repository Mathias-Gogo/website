import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import PostEditor from './PostEditor'

const ADMIN_EMAIL = 'mexuri.info@gmail.com'

// ── SVG Icons ──
const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="28" height="28" rx="6" fill="#5fcff8" />
    <path d="M8 20V8h2.5l5.5 8.5V8H18v12h-2.5L10 11.5V20H8z" fill="white" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const SpinnerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin">
    <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

const styles = `
  .admin-wrap {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #080808;
    color: #ffffff;
    width: 100%;
    height: 100%;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Topbar ── */
  .admin-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 52px;
    border-bottom: 1px solid #1a1a1a;
    background: rgba(10, 10, 10, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .admin-topbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .admin-topbar-logo {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.3px;
    text-decoration: none;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: opacity 0.2s;
  }

  .admin-topbar-logo:hover {
    opacity: 0.8;
  }

  .admin-topbar-logo span {
    color: #5fcff8;
  }

  .admin-topbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .admin-topbar-email {
    font-size: 12px;
    color: #525252;
    font-weight: 500;
  }

  .admin-signout {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px solid #262626;
    color: #737373;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
  }

  .admin-signout:hover {
    color: #5fcff8;
    border-color: rgba(239, 68, 68, 0.3);
    background: rgba(239, 68, 68, 0.05);
  }

  /* ── Access Denied ── */
  .admin-denied {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 20px;
    color: #525252;
    font-size: 14px;
    text-align: center;
    padding: 24px;
  }

  .admin-denied-icon {
    color: #5fcff8;
    margin-bottom: 8px;
  }

  .admin-denied h2 {
    font-size: 18px;
    font-weight: 600;
    color: #e5e5e5;
    margin: 0;
  }

  .admin-denied p {
    margin: 0;
    max-width: 320px;
    line-height: 1.5;
  }

  .admin-denied p strong {
    color: #a1a1a1;
    font-weight: 500;
  }

  .admin-denied-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: 1px solid #262626;
    color: #a1a1a1;
    border-radius: 10px;
    padding: 10px 20px;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
    margin-top: 8px;
  }

  .admin-denied-btn:hover {
    color: #fff;
    border-color: #525252;
    background: #111;
  }

  /* ── Loading ── */
  .admin-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 10px;
    font-size: 13px;
    color: #525252;
    font-weight: 500;
  }`;

export default function AdminApp() {
  const [session, setSession] = useState(undefined)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    navigate('/admin')
  }

  if (session === undefined) {
    return (
      <div className="admin-wrap">
        <style>{styles}</style>
        <div className="admin-loading">
          <SpinnerIcon />
          Checking session...
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="admin-wrap">
        <style>{styles}</style>
        <AdminLogin onLogin={setSession} />
      </div>
    )
  }

  if (session.user.email !== ADMIN_EMAIL) {
    return (
      <div className="admin-wrap">
        <style>{styles}</style>
        <div className="admin-denied">
          <div className="admin-denied-icon"><ShieldIcon /></div>
          <h2>Access Denied</h2>
          <p>
            Your account <strong>{session.user.email}</strong> does not have permission to access this area.
          </p>
          <button className="admin-denied-btn" onClick={handleSignOut}>
            <LogoutIcon />
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-wrap">
      <style>{styles}</style>

      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <a href="/admin" className="admin-topbar-logo">
            <LogoIcon />
            Mexuri<span>.</span> Admin
          </a>
        </div>
        <div className="admin-topbar-right">
          <span className="admin-topbar-email">{session.user.email}</span>
          <button className="admin-signout" onClick={handleSignOut}>
            <LogoutIcon />
            Sign out
          </button>
        </div>
      </div>

      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="new" element={<PostEditor />} />
        <Route path="edit/:id" element={<PostEditor />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  )
}