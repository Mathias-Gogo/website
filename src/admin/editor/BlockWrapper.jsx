export default function BlockWrapper({ index, total, onMoveUp, onMoveDown, onDelete, children }) {
    return (
        <div className="block-wrapper">
            <div className="block-controls">
                <button onClick={onMoveUp} disabled={index === 0} title="Move up">↑</button>
                <button onClick={onMoveDown} disabled={index === total - 1} title="Move down">↓</button>
                <button onClick={onDelete} title="Delete block" className="block-delete">✕</button>
            </div>
            <div className="block-content">{children}</div>
        </div>
    )
}