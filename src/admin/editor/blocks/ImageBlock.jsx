import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function ImageBlock({ block, onChange }) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')

    const handleUpload = async (e) => {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Current session:', session)
        // ... rest of function
        const file = e.target.files[0]
        if (!file) return
        setUploading(true)
        setError('')

        const ext = file.name.split('.').pop()
        const path = `${Date.now()}.${ext}`

        const { data: uploadData, error: uploadErr } = await supabase.storage
            .from('post-media')
            .upload(path, file, { upsert: true })

        console.log('Upload result:', uploadData, uploadErr)

        if (uploadErr) {
            console.log('Full error:', JSON.stringify(uploadErr))
            setError(uploadErr.message);
            setUploading(false);
            return
        }

        const { data } = supabase.storage.from('post-media').getPublicUrl(path)
        onChange({ ...block, url: data.publicUrl })
        setUploading(false)
    }

    return (
        <div className="image-block">
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
            {uploading && <p>Uploading...</p>}
            {error && <p className="admin-error">{error}</p>}
            {block.url && (
                <img src={block.url} alt="block" style={{ width: '100%', borderRadius: 6, marginTop: 8 }} />
            )}
            <input
                type="text"
                placeholder="Caption (optional)"
                value={block.caption || ''}
                onChange={e => onChange({ ...block, caption: e.target.value })}
            />
        </div>
    )
}