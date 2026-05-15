import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function MediaLibrary({ onSelect, onClose }) {
    const [media, setMedia] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase
                .from('media')
                .select('*')
                .order('uploaded_at', { ascending: false })
            setMedia(data || [])
            setLoading(false)
        }
        fetch()
    }, [])

    return (
        <div className="media-library-backdrop" onClick={onClose}>
            <div className="media-library" onClick={e => e.stopPropagation()}>
                <div className="media-library-header">
                    <h3>Media Library</h3>
                    <button onClick={onClose}>✕</button>
                </div>
                {loading ? <p>Loading...</p> : (
                    <div className="media-library-grid">
                        {media.map(m => (
                            <div key={m.id} className="media-thumb" onClick={() => { onSelect(m.url); onClose() }}>
                                {m.type === 'image'
                                    ? <img src={m.url} alt={m.filename} />
                                    : <video src={m.url} />
                                }
                                <span>{m.filename}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}