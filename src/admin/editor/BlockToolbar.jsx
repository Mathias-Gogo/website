import { useState } from 'react'

const BLOCK_TYPES = [
    { type: 'paragraph', label: '¶  Paragraph' },
    { type: 'heading', label: 'H  Heading' },
    { type: 'image', label: '🖼  Image' },
    { type: 'video', label: '▶  Video' },
    { type: 'chart', label: '📊  Chart' },
]

export default function BlockToolbar({ onAdd }) {
    const [open, setOpen] = useState(false)

    const handleAdd = (type) => {
        onAdd(type)
        setOpen(false)
    }

    return (
        <div className="block-toolbar">
            <button className="add-block-btn" onClick={() => setOpen(p => !p)}>
                + Add Block
            </button>
            {open && (
                <div className="block-toolbar-dropdown">
                    {BLOCK_TYPES.map(b => (
                        <button key={b.type} onClick={() => handleAdd(b.type)}>
                            {b.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}