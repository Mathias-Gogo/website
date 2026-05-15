export default function HeadingBlock({ block, onChange }) {
    return (
        <div className="heading-block">
            <select
                value={block.level || 'h2'}
                onChange={e => onChange({ ...block, level: e.target.value })}
            >
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
            </select>
            <input
                type="text"
                placeholder="Heading text..."
                value={block.text || ''}
                onChange={e => onChange({ ...block, text: e.target.value })}
            />
        </div>
    )
}