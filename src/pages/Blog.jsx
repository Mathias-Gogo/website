import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const getEmbedUrl = (url) => {
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`
    const vi = url.match(/vimeo\.com\/(\d+)/)
    if (vi) return `https://player.vimeo.com/video/${vi[1]}`
    return null
}

function renderBlock(block) {
    const s = {
        text: { fontSize: 18, lineHeight: 1.8, color: '#d4d4d4', marginBottom: 20, fontFamily: 'inherit' },
        h1: { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 'clamp(26px,4vw,34px)', fontWeight: 400, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '40px 0 16px' },
        h2: { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 'clamp(22px,3vw,26px)', fontWeight: 400, color: '#f5f5f5', lineHeight: 1.25, margin: '32px 0 14px' },
        h3: { fontSize: 20, fontWeight: 600, color: '#e5e5e5', lineHeight: 1.3, margin: '28px 0 12px' },
        quote: { fontStyle: 'italic', fontSize: 18, color: '#a1a1a1', lineHeight: 1.7, borderLeft: '3px solid #5fcff8', paddingLeft: 20, margin: '24px 0' },
        code: { fontFamily: "'SF Mono','Fira Mono',monospace", fontSize: 13.5, color: '#a5f3fc', background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 8, padding: '16px 20px', margin: '20px 0', overflowX: 'auto', whiteSpace: 'pre-wrap', display: 'block' },
        divider: { border: 'none', height: 1, background: '#1a1a1a', margin: '32px 0', display: 'block' },
        img: { width: '100%', borderRadius: 10, margin: '24px 0', display: 'block' },
        vidWrap: { position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 10, overflow: 'hidden', margin: '24px 0', background: '#0f0f0f', border: '1px solid #1a1a1a' },
        vidIframe: { position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' },
        list: { fontSize: 18, lineHeight: 1.8, color: '#d4d4d4', marginBottom: 8, paddingLeft: 24, position: 'relative' },
    }

    switch (block.type) {
        case 'text': return <p key={block.id} style={s.text}>{block.content}</p>
        case 'heading-1': return <h2 key={block.id} style={s.h1}>{block.content}</h2>
        case 'heading-2': return <h3 key={block.id} style={s.h2}>{block.content}</h3>
        case 'heading-3': return <h4 key={block.id} style={s.h3}>{block.content}</h4>
        case 'quote': return <blockquote key={block.id} style={s.quote}>{block.content}</blockquote>
        case 'code': return <pre key={block.id} style={s.code}>{block.content}</pre>
        case 'divider': return <hr key={block.id} style={s.divider} />
        case 'image': return block.content ? <img key={block.id} src={block.content} alt="" style={s.img} /> : null
        case 'list': return (
            <p key={block.id} style={s.list}>
                <span style={{ position: 'absolute', left: 6, top: 13, width: 5, height: 5, borderRadius: '50%', background: '#525252', display: 'inline-block' }} />
                {block.content}
            </p>
        )
        case 'video': {
            if (!block.content) return null
            const embedUrl = getEmbedUrl(block.content)
            return embedUrl
                ? <div key={block.id} style={s.vidWrap}>
                    <iframe src={embedUrl} style={s.vidIframe} allowFullScreen />
                </div>
                : <video key={block.id} src={block.content} controls style={{ width: '100%', borderRadius: 10, margin: '24px 0' }} />
        }
        default: return null
    }
}

export default function Blog() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [related, setRelated] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ; (async () => {
            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .eq('status', 'published')
                .single()

            if (!data) { navigate('/'); return }
            setPost(data)

            // fetch related from same section
            const { data: rel } = await supabase
                .from('posts')
                .select('id, title, slug, cover_image, meta, sections')
                .eq('status', 'published')
                .contains('sections', data.sections || [])
                .neq('slug', slug)
                .limit(3)

            setRelated(rel || [])
            setLoading(false)
        })()
    }, [slug])

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#525252', fontFamily: 'inherit', fontSize: 13 }}>
            Loading…
        </div>
    )

    if (!post) return null

    const readTime = Math.max(1, Math.ceil(
        (post.content || []).filter(b => b.content).map(b => b.content).join(' ').split(' ').length / 200
    ))

    return (
        <div style={{ background: '#080808', color: '#e5e5e5', minHeight: '100vh', fontFamily: "-apple-system,'Geist','DM Sans',sans-serif", WebkitFontSmoothing: 'antialiased' }}>

            {/* Topbar */}
            <div style={{ position: 'sticky', top: 0, zIndex: 50, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #1a1a1a' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', color: '#737373', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', padding: '6px 8px', borderRadius: 6, transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#e5e5e5'}
                    onMouseLeave={e => e.currentTarget.style.color = '#737373'}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Mexuri
                </button>
                <span style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 15, color: '#404040' }}>
                    {post.title}
                </span>
                <div style={{ width: 80 }} />
            </div>

            {/* Body */}
            <div style={{ maxWidth: 740, margin: '0 auto', padding: '60px 24px 120px' }}>

                {/* Cover */}
                {post.cover_image && (
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        style={{ width: '100%', aspectRatio: '16/7', objectFit: 'cover', borderRadius: 14, marginBottom: 44, display: 'block', border: '1px solid #1a1a1a' }}
                    />
                )}

                {/* Category + read time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#5fcff8' }}>
                        {post.sections?.[0] || 'Article'}
                    </span>
                    <span style={{ color: '#333' }}>·</span>
                    <span style={{ fontSize: 12, color: '#525252' }}>{readTime} min read</span>
                </div>

                {/* Title */}
                <h1 style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff', marginBottom: 24 }}>
                    {post.title}
                </h1>

                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#525252', marginBottom: 44, paddingBottom: 36, borderBottom: '1px solid #1a1a1a' }}>
                    <span>Mexuri</span>
                    <span>·</span>
                    <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                {/* Blocks */}
                <div>{(post.content || []).map(renderBlock)}</div>

                {/* End rule */}
                <hr style={{ border: 'none', height: 1, background: '#1a1a1a', margin: '64px 0 60px' }} />

                {/* Related posts */}
                {related.length > 0 && (
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#404040', marginBottom: 28 }}>
                            More from Mexuri
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                            {related.map(r => (
                                <div
                                    key={r.id}
                                    onClick={() => { navigate(`/blog/${r.slug}`); window.scrollTo(0, 0) }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div style={{ width: '100%', aspectRatio: '16/10', borderRadius: 10, overflow: 'hidden', background: '#161616', marginBottom: 12, border: '1px solid #1a1a1a' }}>
                                        {r.cover_image && <img src={r.cover_image} alt={r.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }} />}
                                    </div>
                                    <p style={{ fontSize: 13.5, fontWeight: 500, color: '#e5e5e5', lineHeight: 1.4, marginBottom: 5 }}>{r.title}</p>
                                    <p style={{ fontSize: 12, color: '#525252' }}>{r.sections?.[0]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}