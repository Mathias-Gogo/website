export default function FeaturedToggle({ isFeatured, featuredOrder, onChange }) {
    return (
        <div className="featured-toggle">
            <label>
                <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={e => onChange({ isFeatured: e.target.checked, featuredOrder })}
                />
                Mark as Featured
            </label>
            {isFeatured && (
                <select
                    value={featuredOrder || 1}
                    onChange={e => onChange({ isFeatured, featuredOrder: Number(e.target.value) })}
                >
                    <option value={1}>Featured Slot 1 (Main)</option>
                    <option value={2}>Featured Slot 2</option>
                    <option value={3}>Featured Slot 3</option>
                </select>
            )}
        </div>
    )
}