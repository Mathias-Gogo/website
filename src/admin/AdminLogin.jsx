import { useState } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_EMAIL = 'mexuri.info@gmail.com'

const css = `
  .al-wrap {
    min-height: 100vh;
    background: #080808;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, 'Inter', 'Geist', sans-serif;
    -webkit-font-smoothing: antialiased;
    padding: 24px;
  }

  .al-box {
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .al-logo {
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.8px;
    margin-bottom: 8px;
    font-family: 'Georgia', serif;
  }

  .al-logo span { color: #5fcff8; }

  .al-label {
    font-size: 13px;
    color: #525252;
    margin-bottom: 20px;
    font-weight: 400;
    line-height: 1.5;
  }

  .al-input {
    width: 100%;
    background: #111;
    border: 1px solid #1a1a1a;
    border-radius: 10px;
    color: #e5e5e5;
    font-size: 14px;
    padding: 12px 14px;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .al-input:focus { border-color: #5fcff8; }
  .al-input::placeholder { color: #333; }

  .al-btn {
    width: 100%;
    background: #5fcff8;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 13px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s, transform 0.1s;
    margin-top: 4px;
  }

  .al-btn:hover    { background: #5fcff8; }
  .al-btn:active   { transform: scale(0.99); }
  .al-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .al-error {
    font-size: 12.5px;
    color: #5fcff8;
    background: rgba(239, 68, 68, 0.07);
    border: 1px solid rgba(239, 68, 68, 0.15);
    border-radius: 8px;
    padding: 10px 12px;
    line-height: 1.5;
  }

  .al-divider {
    height: 1px;
    background: #1a1a1a;
    margin: 4px 0;
  }
`

export default function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setError('')
        if (email !== ADMIN_EMAIL) return setError('Access denied.')
        setLoading(true)
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
        setLoading(false)
        if (err) return setError(err.message)
        onLogin(data.session)
    }

    const handleKey = (e) => {
        if (e.key === 'Enter') handleLogin()
    }

    return (
        <div className="al-wrap">
            <style>{css}</style>
            <div className="al-box">
                <div className="al-logo">Mexuri<span>.</span></div>
                <p className="al-label">Admin access only. Sign in to continue.</p>

                <div className="al-divider" />

                <input
                    className="al-input"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={handleKey}
                    autoComplete="email"
                />
                <input
                    className="al-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={handleKey}
                    autoComplete="current-password"
                />

                {error && <p className="al-error">{error}</p>}

                <button className="al-btn" onClick={handleLogin} disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign In'}
                </button>
            </div>
        </div>
    )
}