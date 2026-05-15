const SECTIONS = ['news', 'research', 'articles']

export default function PostMeta({ meta, onChange }) {

    return (
        <div className="post-meta">

            <label>Slug</label>
            <input
                type="text"
                placeholder="post-slug"
                value={meta.slug || ''}
                onChange={e => onChange({ ...meta, slug: e.target.value, slugManuallyEdited: true })}
            />

            <label>Meta description</label>
            <textarea
                placeholder="Short description for cards and SEO..."
                value={meta.metaDesc || ''}
                rows={3}
                onChange={e => onChange({ ...meta, metaDesc: e.target.value })}
            />

            <label>Section</label>
            <select
                value={meta.section || 'articles'}
                onChange={e => onChange({ ...meta, section: e.target.value })}
            >
                {SECTIONS.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
            </select>

            <label>Status</label>
            <select
                value={meta.status || 'draft'}
                onChange={e => onChange({ ...meta, status: e.target.value })}
            >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
            </select>
        </div>
    )
}