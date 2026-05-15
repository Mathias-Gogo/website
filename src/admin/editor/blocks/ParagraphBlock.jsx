export default function ParagraphBlock({ block, onChange }) {
    return (
        <textarea
            className="block-textarea"
            placeholder="Write something..."
            value={block.text || ''}
            onChange={e => onChange({ ...block, text: e.target.value })}
            rows={4}
        />
    )
}