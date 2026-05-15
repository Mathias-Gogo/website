export default function VideoBlock({ block, onChange }) {
    return (
        <div className="video-block">
            <input
                type="text"
                placeholder="Paste video URL (YouTube, Cloudinary, etc.)..."
                value={block.url || ''}
                onChange={e => onChange({ ...block, url: e.target.value })}
            />
            {block.url && (
                <video src={block.url} controls style={{ width: '100%', marginTop: 8, borderRadius: 6 }} />
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