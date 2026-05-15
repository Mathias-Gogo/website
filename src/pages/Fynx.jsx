import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

/* ─────────────────────────────────────────────────────────
   SOUND — "Open" 1.8s synth pad
───────────────────────────────────────────────────────── */
function playOpenSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const t = ctx.currentTime
        const m = ctx.createGain()
        m.connect(ctx.destination)

        const pairs = [
            [261.63, 392.00, 0.15, 0.11],
            [523.25, 784.00, 0.045, 0.032],
            [261.63 * 0.998, 392.00 * 1.002, 0.045, 0.032],
        ]

        pairs.forEach(([f1, f2, a1, a2]) => {
            [[f1, a1], [f2, a2]].forEach(([f, amp], i) => {
                const o = ctx.createOscillator()
                const g = ctx.createGain()
                o.type = 'sine'
                o.frequency.value = f
                g.gain.setValueAtTime(0, t)
                g.gain.linearRampToValueAtTime(amp, t + 0.28 + i * 0.08)
                g.gain.linearRampToValueAtTime(amp * 0.75, t + 0.8)
                g.gain.linearRampToValueAtTime(0, t + 1.8)
                o.connect(g)
                g.connect(m)
                o.start(t)
                o.stop(t + 1.9)
            })
        })

        const h = ctx.createOscillator()
        const hg = ctx.createGain()
        h.type = 'sine'
        h.frequency.value = 1046.5
        hg.gain.setValueAtTime(0, t + 0.22)
        hg.gain.linearRampToValueAtTime(0.014, t + 0.5)
        hg.gain.linearRampToValueAtTime(0, t + 1.5)
        h.connect(hg)
        hg.connect(m)
        h.start(t + 0.22)
        h.stop(t + 1.6)

        setTimeout(() => ctx.close(), 2200)
    } catch (e) {
        /* AudioContext blocked — silently skip */
    }
}

/* ─────────────────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────────────────── */
function AnimCount({ to }) {
    const [v, setV] = useState(0)
    useEffect(() => {
        if (to === null || to === undefined) return
        const t0 = Date.now()
        const dur = 1600
        const tick = () => {
            const p = Math.min((Date.now() - t0) / dur, 1)
            const ease = 1 - Math.pow(1 - p, 3)
            setV(Math.floor(ease * to))
            if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
    }, [to])
    return <>{to === null || to === undefined ? '—' : v.toLocaleString()}</>
}

/* ─────────────────────────────────────────────────────────
   WAITLIST MODAL
───────────────────────────────────────────────────────── */
const STEPS = ['Name & email', 'Your country', 'Your stage', 'Confirm']

const FOUNDER_TYPES = [
    { value: 'idea_trapper', label: 'Idea Trapper', sub: 'Pre-revenue / MVP stage' },
    { value: 'solo_builder', label: 'Solo Builder', sub: 'Early revenue, solo founder' },
    { value: 'growing_team', label: 'Growing Team', sub: 'Small team (2–8 people)' },
]

const COUNTRIES = [
    'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Ethiopia',
    'Tanzania', 'Uganda', 'Rwanda', 'Senegal', 'Côte d\'Ivoire',
    'Cameroon', 'Other',
]

function WaitlistModal({ onClose, onSuccess }) {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({ full_name: '', email: '', country: '', founder_type: '' })
    const [submitting, setSubmitting] = useState(false)
    const [err, setErr] = useState('')
    const [done, setDone] = useState(false)
    const [anim, setAnim] = useState(false)

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    useEffect(() => {
        const h = e => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', h)
        return () => window.removeEventListener('keydown', h)
    }, [onClose])

    const canNext = () => {
        if (step === 1) return form.full_name.trim() && /\S+@\S+/.test(form.email)
        if (step === 2) return !!form.country
        if (step === 3) return !!form.founder_type
        return true
    }

    const next = () => {
        if (!canNext() || anim) return
        if (step < 4) {
            setAnim(true)
            setTimeout(() => { setStep(s => s + 1); setAnim(false) }, 180)
        } else {
            submit()
        }
    }

    const back = () => {
        if (step > 1 && !anim) {
            setAnim(true)
            setTimeout(() => { setStep(s => s - 1); setAnim(false) }, 180)
        }
    }

    const submit = async () => {
        setSubmitting(true); setErr('')
        try {
            const { error } = await supabase.from('waitlist').insert([{
                full_name: form.full_name.trim(),
                email: form.email.trim().toLowerCase(),
                country: form.country,
                founder_type: form.founder_type,
            }])
            if (error && error.code !== '23505') throw error
            setDone(true)
            onSuccess?.()
        } catch {
            setErr('Something went wrong. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const ftLabel = FOUNDER_TYPES.find(f => f.value === form.founder_type)

    return (
        <div className="fx-modal-back" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="fx-modal-box">
                {done ? (
                    <div className="fx-modal-done">
                        <div className="fx-done-emoji">🎉</div>
                        <h3 className="fx-done-title">You're in.</h3>
                        <p className="fx-done-body">
                            Welcome to the Fynx waitlist. We'll reach out with early access
                            before the public launch. Get ready.
                        </p>
                        <button className="fx-btn-primary" onClick={onClose}>
                            Close <ArrowIcon />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="fx-modal-hd">
                            <div>
                                <div className="fx-modal-step">Step {step} of 4 — {STEPS[step - 1]}</div>
                                <div className="fx-modal-title">{STEPS[step - 1]}</div>
                            </div>
                            <button className="fx-modal-close" onClick={onClose}><CloseIcon /></button>
                        </div>

                        <div className="fx-modal-prog">
                            <div className="fx-modal-prog-fill" style={{ width: `${step * 25}%` }} />
                        </div>

                        <div
                            className="fx-modal-body"
                            style={{ opacity: anim ? 0 : 1, transform: anim ? 'translateX(8px)' : 'none', transition: 'opacity 0.18s, transform 0.18s' }}
                        >
                            {step === 1 && (
                                <>
                                    <div className="fx-field">
                                        <label className="fx-label">Full name</label>
                                        <input className="fx-input" placeholder="Ada Okafor" value={form.full_name} onChange={e => set('full_name', e.target.value)} />
                                    </div>
                                    <div className="fx-field">
                                        <label className="fx-label">Email address</label>
                                        <input className="fx-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <div className="fx-field">
                                    <label className="fx-label">Your country</label>
                                    <div className="fx-sel-wrap">
                                        <select className="fx-sel" value={form.country} onChange={e => set('country', e.target.value)}>
                                            <option value="" disabled>Select your country</option>
                                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <p className="fx-hint">Used only to set your pricing tier at launch.</p>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="fx-field">
                                    <label className="fx-label">I am a…</label>
                                    <div className="fx-tiles">
                                        {FOUNDER_TYPES.map(ft => (
                                            <div
                                                key={ft.value}
                                                className={`fx-tile${form.founder_type === ft.value ? ' sel' : ''}`}
                                                onClick={() => set('founder_type', ft.value)}
                                            >
                                                <div className="fx-tile-text">
                                                    <div className="fx-tile-name">{ft.label}</div>
                                                    <div className="fx-tile-sub">{ft.sub}</div>
                                                </div>
                                                <div className="fx-tile-chk"><CheckIcon /></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <>
                                    <div className="fx-review">
                                        {[
                                            { k: 'Name', v: form.full_name },
                                            { k: 'Email', v: form.email },
                                            { k: 'Country', v: form.country },
                                            { k: 'Stage', v: ftLabel ? `${ftLabel.label} — ${ftLabel.sub}` : '' },
                                        ].map(r => (
                                            <div key={r.k} className="fx-review-row">
                                                <span className="fx-review-k">{r.k}</span>
                                                <span className="fx-review-v">{r.v}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="fx-hint" style={{ textAlign: 'center' }}>No spam. No card required. Unsubscribe anytime.</p>
                                    {err && <div className="fx-err">{err}</div>}
                                </>
                            )}
                        </div>

                        <div className="fx-modal-ft">
                            <button className="fx-btn-ghost" onClick={step === 1 ? onClose : back}>
                                {step === 1 ? 'Cancel' : '← Back'}
                            </button>
                            <button
                                className="fx-btn-primary"
                                onClick={next}
                                disabled={!canNext() || submitting}
                            >
                                {step === 4
                                    ? (submitting ? 'Joining…' : <>Join waitlist <ArrowIcon /></>)
                                    : <>Continue <ArrowIcon /></>
                                }
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────
   VIDEO MODAL
───────────────────────────────────────────────────────── */
function VideoModal({ url, onClose }) {
    useEffect(() => {
        const h = e => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', h)
        return () => window.removeEventListener('keydown', h)
    }, [onClose])

    return (
        <div className="fx-video-back" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="fx-video-box">
                <button className="fx-video-close" onClick={onClose}><CloseIcon /></button>
                <div className="fx-video-ratio">
                    <iframe
                        src={url}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Fynx explainer video"
                    />
                </div>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────── */
const ArrowIcon = () => (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
)

const CheckIcon = () => (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
        <path d="M1.5 6l3 3 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const PlayIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
)

/* ─────────────────────────────────────────────────────────
   CSS STRING
───────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  @keyframes fx-rise      { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fx-fade      { from { opacity:0; } to { opacity:1; } }
  @keyframes fx-ripple    { 0% { transform:scale(1); opacity:0.6; } 100% { transform:scale(2.6); opacity:0; } }
  @keyframes fx-ripple2   { 0% { transform:scale(1); opacity:0.35; } 100% { transform:scale(2.0); opacity:0; } }
  @keyframes fx-bounce    { 0%,100% { transform:scale(1); } 50% { transform:scale(1.08); } }
  @keyframes fx-spin      { to { transform:rotate(360deg); } }
  @keyframes fx-count-up  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fx-slide-in  { from { opacity:0; transform:scale(0.96) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
  @keyframes fx-modal-bg  { from { opacity:0; } to { opacity:1; } }
  @keyframes fx-pulse-dot { 0%,100% { box-shadow:0 0 0 3px rgba(249,115,22,0.25); } 50% { box-shadow:0 0 0 7px rgba(249,115,22,0.08); } }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fx-page {
    width: 100%; height: 100vh;
    overflow: hidden;
    position: relative;
    font-family: 'DM Sans', sans-serif;
    background: #060608;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Video background ── */
  .fx-video-bg {
    position: absolute; inset: 0; z-index: 0;
    overflow: hidden;
  }
  .fx-video-bg video {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 1.2s ease;
  }
  .fx-video-bg video.loaded { opacity: 1; }
  .fx-video-placeholder {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0f0c29 0%, #1a0f3d 35%, #2d1b6e 65%, #1a0a2e 100%);
    transition: opacity 1s ease;
  }
  .fx-video-placeholder.hidden { opacity: 0; pointer-events: none; }

  /* ── Overlays ── */
  .fx-overlay {
    position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(
      to top,
      rgba(0,0,0,0.88) 0%,
      rgba(0,0,0,0.45) 40%,
      rgba(0,0,0,0.15) 70%,
      rgba(0,0,0,0.25) 100%
    );
  }
  .fx-noise {
    position: absolute; inset: 0; z-index: 2;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    pointer-events: none;
  }

  /* ── Logo top-left ── */
  .fx-logo {
    position: absolute; top: 28px; left: 36px; z-index: 10;
    display: flex; align-items: center; gap: 10px;
    opacity: 0;
    animation: fx-rise 0.6s ease 0.2s forwards;
    text-decoration: none;
  }
  .fx-logo-mark {
    width: 34px; height: 34px; border-radius: 9px;
    background: #f97316;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 15px; color: #fff; letter-spacing: -0.3px;
  }
  .fx-logo-name {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 17px; color: #fff; letter-spacing: -0.3px;
  }

  /* ── Main content — bottom left ── */
  .fx-content {
    position: absolute; bottom: 0; left: 0;
    z-index: 10;
    padding: 0 48px 52px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
  }

  .fx-left {
    display: flex; flex-direction: column; gap: 6px;
    max-width: 520px;
  }

  .fx-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    opacity: 0;
    animation: fx-rise 0.6s ease 0.5s forwards;
  }

  .fx-wordmark {
    font-family: 'Syne', sans-serif;
    font-size: clamp(52px, 7vw, 88px);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.04em;
    color: #fff;
    opacity: 0;
    animation: fx-rise 0.7s cubic-bezier(0.22,1,0.36,1) 0.6s forwards;
  }
  .fx-wordmark span {
    background: linear-gradient(90deg, #f97316 0%, #fb923c 60%, #fbbf24 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .fx-tagline {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(14px, 1.8vw, 18px);
    font-weight: 300;
    font-style: italic;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.01em;
    margin-top: 4px;
    opacity: 0;
    animation: fx-rise 0.6s ease 0.75s forwards;
  }

  .fx-actions {
    display: flex; align-items: center; gap: 14px;
    margin-top: 28px;
    opacity: 0;
    animation: fx-rise 0.6s ease 0.9s forwards;
  }

  /* ── Watch video button — pulsing circle ── */
  .fx-watch-btn {
    position: relative;
    display: flex; align-items: center; gap: 14px;
    background: none; border: none; cursor: pointer;
    padding: 0;
  }
  .fx-watch-ring {
    position: relative;
    width: 56px; height: 56px; flex-shrink: 0;
  }
  .fx-watch-ring::before,
  .fx-watch-ring::after {
    content: '';
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 1.5px solid rgba(249,115,22,0.5);
    animation: fx-ripple 2.2s ease-out infinite;
  }
  .fx-watch-ring::after {
    animation: fx-ripple2 2.2s ease-out 0.6s infinite;
  }
  .fx-watch-circle {
    position: absolute; inset: 0;
    border-radius: 50%;
    background: rgba(249,115,22,0.15);
    border: 1.5px solid rgba(249,115,22,0.6);
    display: flex; align-items: center; justify-content: center;
    color: #f97316;
    backdrop-filter: blur(4px);
    transition: background 0.2s, transform 0.2s;
    animation: fx-bounce 3s ease-in-out infinite;
  }
  .fx-watch-btn:hover .fx-watch-circle {
    background: rgba(249,115,22,0.3);
    transform: scale(1.08);
    animation: none;
  }
  .fx-watch-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.02em;
    transition: color 0.15s;
  }
  .fx-watch-btn:hover .fx-watch-label { color: #fff; }

  /* ── Join waitlist button ── */
  .fx-join-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 13px 24px;
    background: #f97316; color: #fff;
    border: none; border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer; letter-spacing: 0.02em;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  }
  .fx-join-btn:hover {
    background: #ea580c;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(249,115,22,0.35);
  }
  .fx-join-btn:active { transform: scale(0.97); }

  /* ── Right — waitlist counter ── */
  .fx-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
    opacity: 0;
    animation: fx-rise 0.7s ease 1.0s forwards;
  }
  .fx-counter-num {
    font-family: 'Syne', sans-serif;
    font-size: clamp(44px, 5.5vw, 72px);
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.04em;
    line-height: 1;
  }
  .fx-counter-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 400;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.1em; text-transform: uppercase;
    text-align: right;
  }
  .fx-counter-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #f97316;
    display: inline-block; margin-right: 6px;
    animation: fx-pulse-dot 2s ease infinite;
  }

  /* ── Waitlist section ── */
  .fx-wl-section {
    position: absolute;
    bottom: 52px; left: 50%; transform: translateX(-50%);
    z-index: 10;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    opacity: 0;
    animation: fx-rise 0.6s ease 1.1s forwards;
  }
  .fx-scroll-hint {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.2);
  }

  /* ── Modal backdrop ── */
  .fx-modal-back {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: fx-modal-bg 0.2s ease;
  }

  .fx-modal-box {
    background: #0f0f10;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    width: 100%; max-width: 440px;
    max-height: 92vh;
    display: flex; flex-direction: column;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6);
    animation: fx-slide-in 0.22s ease;
  }

  .fx-modal-hd {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 20px 22px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
  }
  .fx-modal-step {
    font-size: 10px; font-weight: 500; letter-spacing: 1.2px;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
    margin-bottom: 3px; font-family: 'DM Sans', sans-serif;
  }
  .fx-modal-title {
    font-family: 'Syne', sans-serif; font-size: 18px;
    font-weight: 700; color: #fff; letter-spacing: -0.3px;
  }
  .fx-modal-close {
    width: 28px; height: 28px; border-radius: 7px;
    border: none; background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.4); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.12s; flex-shrink: 0; margin-left: 10px;
  }
  .fx-modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

  .fx-modal-prog {
    height: 2px; background: rgba(255,255,255,0.06); flex-shrink: 0;
  }
  .fx-modal-prog-fill {
    height: 100%; background: #f97316;
    transition: width 0.28s ease; border-radius: 0 2px 2px 0;
  }

  .fx-modal-body {
    flex: 1; overflow-y: auto; padding: 22px;
    display: flex; flex-direction: column; gap: 16px;
  }

  .fx-modal-ft {
    padding: 14px 22px; border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
    flex-shrink: 0;
  }

  /* ── Form elements ── */
  .fx-field { display: flex; flex-direction: column; gap: 7px; }
  .fx-label {
    font-size: 10px; font-weight: 500; letter-spacing: 1px;
    text-transform: uppercase; color: rgba(255,255,255,0.3);
    font-family: 'DM Sans', sans-serif;
  }
  .fx-input, .fx-sel {
    width: 100%; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 400; color: #fff;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 11px 14px;
    outline: none; transition: border-color 0.15s, background 0.15s;
    -webkit-appearance: none; appearance: none;
  }
  .fx-input::placeholder { color: rgba(255,255,255,0.2); }
  .fx-input:focus, .fx-sel:focus {
    border-color: #f97316; background: rgba(249,115,22,0.06);
  }
  .fx-sel option { background: #1a1a1c; color: #fff; }
  .fx-sel-wrap { position: relative; }
  .fx-sel-wrap::after {
    content: '';
    position: absolute; right: 13px; top: 50%;
    transform: translateY(-50%);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid rgba(255,255,255,0.3);
    pointer-events: none;
  }
  .fx-hint {
    font-size: 11.5px; font-weight: 300;
    color: rgba(255,255,255,0.25); line-height: 1.6;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Founder type tiles ── */
  .fx-tiles { display: flex; flex-direction: column; gap: 8px; }
  .fx-tile {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; cursor: pointer;
    transition: all 0.13s;
  }
  .fx-tile:hover { border-color: rgba(255,255,255,0.2); }
  .fx-tile.sel { border-color: #f97316; background: rgba(249,115,22,0.08); }
  .fx-tile-text { flex: 1; }
  .fx-tile-name {
    font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.7);
    font-family: 'DM Sans', sans-serif;
  }
  .fx-tile.sel .fx-tile-name { color: #fff; }
  .fx-tile-sub {
    font-size: 11px; font-weight: 300;
    color: rgba(255,255,255,0.3); margin-top: 1px;
    font-family: 'DM Sans', sans-serif;
  }
  .fx-tile-chk {
    width: 18px; height: 18px; border-radius: 50%;
    background: #f97316; color: #fff;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.12s; flex-shrink: 0;
  }
  .fx-tile.sel .fx-tile-chk { opacity: 1; }

  /* ── Review ── */
  .fx-review {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; padding: 16px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .fx-review-row {
    display: flex; justify-content: space-between; align-items: baseline;
    gap: 12px; font-size: 13px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding-bottom: 8px;
  }
  .fx-review-row:last-child { border-bottom: none; padding-bottom: 0; }
  .fx-review-k {
    font-size: 10px; font-weight: 500; letter-spacing: 0.8px;
    text-transform: uppercase; color: rgba(255,255,255,0.25);
    flex-shrink: 0; font-family: 'DM Sans', sans-serif;
  }
  .fx-review-v {
    font-weight: 400; color: rgba(255,255,255,0.8);
    text-align: right; max-width: 240px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Error ── */
  .fx-err {
    font-size: 12px; font-weight: 500; color: #fca5a5;
    padding: 9px 13px; background: rgba(239,68,68,0.12);
    border-radius: 8px; border: 1px solid rgba(239,68,68,0.2);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Modal buttons ── */
  .fx-btn-primary {
    display: flex; align-items: center; gap: 6px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    padding: 10px 22px; background: #f97316; color: #fff;
    border: none; border-radius: 100px; cursor: pointer;
    transition: background 0.13s; white-space: nowrap;
  }
  .fx-btn-primary:hover { background: #ea580c; }
  .fx-btn-primary:disabled { opacity: 0.35; cursor: default; }

  .fx-btn-ghost {
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400;
    padding: 10px 18px; background: none;
    border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.45);
    border-radius: 100px; cursor: pointer; transition: all 0.13s;
  }
  .fx-btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.8); }

  /* ── Done state ── */
  .fx-modal-done {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 44px 28px; text-align: center; gap: 12px;
  }
  .fx-done-emoji { font-size: 48px; }
  .fx-done-title {
    font-family: 'Syne', sans-serif; font-size: 28px;
    font-weight: 700; color: #fff; letter-spacing: -0.5px;
  }
  .fx-done-body {
    font-size: 14px; font-weight: 300;
    color: rgba(255,255,255,0.4); line-height: 1.72;
    max-width: 280px; font-family: 'DM Sans', sans-serif;
  }

  /* ── Video lightbox ── */
  .fx-video-back {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: fx-modal-bg 0.2s ease;
  }
  .fx-video-box {
    width: 100%; max-width: 1000px;
    position: relative;
    animation: fx-slide-in 0.22s ease;
  }
  .fx-video-close {
    position: absolute; top: -40px; right: 0;
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(255,255,255,0.1); border: none;
    color: rgba(255,255,255,0.6); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.13s;
  }
  .fx-video-close:hover { background: rgba(255,255,255,0.18); color: #fff; }
  .fx-video-ratio {
    position: relative; padding-bottom: 56.25%; height: 0;
    border-radius: 14px; overflow: hidden;
    background: #000;
  }
  .fx-video-ratio iframe {
    position: absolute; inset: 0;
    width: 100%; height: 100%; border: none;
  }

  /* ── Mobile ── */
  @media (max-width: 680px) {
    .fx-logo { top: 20px; left: 20px; }
    .fx-content { padding: 0 20px 36px; flex-direction: column; align-items: flex-start; gap: 24px; }
    .fx-right { align-items: flex-start; }
    .fx-wordmark { font-size: 52px; }
    .fx-actions { flex-direction: column; align-items: flex-start; gap: 16px; }
    .fx-modal-back { padding: 0; align-items: flex-end; }
    .fx-modal-box { border-radius: 20px 20px 0 0; max-height: 96vh; }
  }
`

/* ─────────────────────────────────────────────────────────
   PLACEHOLDER URLS — swap these out when ready
───────────────────────────────────────────────────────── */
const HERO_VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4'         // hero reel (loop, no audio)
const EXPLAINER_VIDEO_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ'    // explainer (opens in modal)

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
export default function FynxPage() {
    const [wlOpen, setWlOpen] = useState(false)
    const [vidOpen, setVidOpen] = useState(false)
    const [count, setCount] = useState(null)
    const [videoReady, setVideoReady] = useState(false)
    const videoRef = useRef(null)
    const soundFired = useRef(false)

    /* ── Fetch waitlist count ── */
    useEffect(() => {
        supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true })
            .then(({ count: c }) => { if (c != null) setCount(c) })
    }, [])

    /* ── Lazy-load hero video ── */
    useEffect(() => {
        const vid = videoRef.current
        if (!vid) return
        vid.src = HERO_VIDEO_URL
        vid.load()
        const onReady = () => setVideoReady(true)
        vid.addEventListener('canplaythrough', onReady)
        return () => vid.removeEventListener('canplaythrough', onReady)
    }, [])

    /* ── Fire load sound once DOM is ready ── */
    useEffect(() => {
        if (soundFired.current) return
        soundFired.current = true
        const fire = () => { playOpenSound() }
        if (document.readyState === 'complete') {
            setTimeout(fire, 300)
        } else {
            window.addEventListener('load', () => setTimeout(fire, 300), { once: true })
        }
    }, [])

    /* ── Refresh count after successful waitlist join ── */
    const handleSuccess = () => {
        supabase
            .from('waitlist')
            .select('*', { count: 'exact', head: true })
            .then(({ count: c }) => { if (c != null) setCount(c) })
    }

    return (
        <>
            <style>{CSS}</style>

            <div className="fx-page">

                {/* ── Background video ── */}
                <div className="fx-video-bg">
                    <div className={`fx-video-placeholder${videoReady ? ' hidden' : ''}`} />
                    <video
                        ref={videoRef}
                        className={videoReady ? 'loaded' : ''}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="none"
                    />
                </div>

                {/* ── Overlays ── */}
                <div className="fx-overlay" />
                <div className="fx-noise" />

                {/* ── Logo ── */}
                <a className="fx-logo" href="/">
                    <div className="fx-logo-mark">F</div>
                    <span className="fx-logo-name">Fynx</span>
                </a>

                {/* ── Main content ── */}
                <div className="fx-content">

                    {/* Left — wordmark + CTAs */}
                    <div className="fx-left">
                        <p className="fx-eyebrow">Agentic AI · Built for African Founders</p>
                        <h1 className="fx-wordmark">
                            <span>Fynx</span>
                        </h1>

                        <p className="fx-tagline">Your AI Workforce</p>

                        <div className="fx-actions">

                            {/* Watch video — pulsing ring */}
                            <button className="fx-watch-btn" onClick={() => setVidOpen(true)}>
                                <div className="fx-watch-ring">
                                    <div className="fx-watch-circle">
                                        <PlayIcon />
                                    </div>
                                </div>
                                <span className="fx-watch-label">Watch the film</span>
                            </button>

                            {/* Join waitlist */}
                            <button className="fx-join-btn" onClick={() => setWlOpen(true)}>
                                Join the waitlist <ArrowIcon />
                            </button>

                        </div>
                    </div>

                    {/* Right — live counter */}
                    <div className="fx-right">
                        <div className="fx-counter-num">
                            <AnimCount to={count} />
                        </div>
                        <div className="fx-counter-label">
                            <span className="fx-counter-dot" />
                            founders waiting
                        </div>
                    </div>

                </div>

            </div>

            {/* ── Modals ── */}
            {wlOpen && (
                <WaitlistModal
                    onClose={() => setWlOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}

            {vidOpen && (
                <VideoModal
                    url={EXPLAINER_VIDEO_URL}
                    onClose={() => setVidOpen(false)}
                />
            )}
        </>
    )
}