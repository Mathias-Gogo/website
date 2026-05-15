import { useState } from 'react';
import BlockWrapper from './BlockWrapper'
import BlockToolbar from './BlockToolbar'
import ParagraphBlock from './blocks/ParagraphBlock'
import HeadingBlock from './blocks/HeadingBlock'
import ImageBlock from './blocks/ImageBlock'
import VideoBlock from './blocks/VideoBlock'
import ChartBlock from './blocks/ChartBlock'

const styles = `
  .block-editor {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .block-editor-empty {
    text-align: center;
    padding: 60px 24px;
    color: #737373;
    font-size: 13px;
    border: 1px dashed #1f1f1f;
    border-radius: 10px;
    margin-bottom: 8px;
  }

  .block-wrapper {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: border-color 0.15s;
  }

  .block-wrapper:hover { border-color: #1f1f1f; }

  .block-controls {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 2px;
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .block-wrapper:hover .block-controls { opacity: 1; }

  .block-controls button {
    width: 26px;
    height: 26px;
    background: #111;
    border: 1px solid #1f1f1f;
    border-radius: 6px;
    color: #737373;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    font-family: inherit;
    line-height: 1;
  }

  .block-controls button:hover:not(:disabled) {
    border-color: #737373;
    color: #fff;
  }

  .block-controls button:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  .block-controls .block-delete:hover:not(:disabled) {
    border-color: rgba(239,68,68,0.4);
    color: #f87171;
    background: rgba(239,68,68,0.06);
  }

  .block-content {
    flex: 1;
    min-width: 0;
  }

  /* ── Block type styles ── */

  .block-textarea {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid #1f1f1f;
    color: #e5e5e5;
    font-size: 15px;
    line-height: 1.7;
    padding: 8px 0;
    resize: none;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  .block-textarea:focus { border-bottom-color: #5fcff8; }

  .block-textarea::placeholder { color: #404040; }

  .heading-block {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .heading-block select {
    width: fit-content;
    background: #111;
    border: 1px solid #1f1f1f;
    border-radius: 6px;
    color: #737373;
    font-size: 11px;
    padding: 4px 8px;
    outline: none;
    cursor: pointer;
    font-family: inherit;
  }

  .heading-block input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid #1f1f1f;
    color: #fff;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.3px;
    padding: 6px 0;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  .heading-block input:focus { border-bottom-color: #5fcff8; }
  .heading-block input::placeholder { color: #404040; }

  .image-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .image-block input[type="file"] {
    font-size: 12px;
    color: #737373;
    font-family: inherit;
    cursor: pointer;
  }

  .image-block input[type="text"] {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid #1f1f1f;
    color: #a1a1a1;
    font-size: 12px;
    padding: 6px 0;
    outline: none;
    font-family: inherit;
    font-style: italic;
  }

  .image-block input[type="text"]::placeholder { color: #404040; }
  .image-block input[type="text"]:focus { border-bottom-color: #5fcff8; }

  .image-block p {
    font-size: 12px;
    color: #737373;
  }

  .video-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .video-block input[type="text"] {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid #1f1f1f;
    color: #e5e5e5;
    font-size: 13px;
    padding: 8px 0;
    outline: none;
    font-family: inherit;
  }

  .video-block input[type="text"]::placeholder { color: #404040; }
  .video-block input[type="text"]:focus { border-bottom-color: #5fcff8; }

  .chart-block {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    background: #111;
    border-radius: 8px;
    border: 1px solid #1f1f1f;
  }

  .chart-block select,
  .chart-block input {
    background: #0a0a0a;
    border: 1px solid #1f1f1f;
    border-radius: 6px;
    color: #e5e5e5;
    font-size: 13px;
    padding: 8px 10px;
    outline: none;
    font-family: inherit;
    width: 100%;
    transition: border-color 0.2s;
  }

  .chart-block select:focus,
  .chart-block input:focus { border-color: #5fcff8; }

  .chart-block input::placeholder { color: #404040; }

  /* ── Toolbar ── */

  .block-toolbar {
    position: relative;
    margin-top: 8px;
  }

  .add-block-btn {
    background: none;
    border: 1px dashed #2a2a2a;
    border-radius: 8px;
    color: #737373;
    font-size: 13px;
    padding: 10px;
    width: 100%;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
    text-align: center;
  }

  .add-block-btn:hover {
    border-color: #5fcff8;
    color: #5fcff8;
    background: rgba(249,115,22,0.04);
  }

  .block-toolbar-dropdown {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: #111;
    border: 1px solid #1f1f1f;
    border-radius: 10px;
    padding: 6px;
    min-width: 180px;
    z-index: 10;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  }

  .block-toolbar-dropdown button {
    display: block;
    width: 100%;
    background: none;
    border: none;
    color: #a1a1a1;
    font-size: 13px;
    padding: 9px 12px;
    text-align: left;
    cursor: pointer;
    border-radius: 6px;
    font-family: inherit;
    transition: background 0.15s, color 0.15s;
  }

  .block-toolbar-dropdown button:hover {
    background: rgba(255,255,255,0.04);
    color: #fff;
  }
`

const createBlock = (type) => ({
  id: `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  type,
  ...(type === 'paragraph' && { text: '' }),
  ...(type === 'heading' && { text: '', level: 'h2' }),
  ...(type === 'image' && { url: '', caption: '' }),
  ...(type === 'video' && { url: '', caption: '' }),
  ...(type === 'chart' && { chartType: 'bar', data: [] }),
})

const BLOCK_COMPONENTS = {
  paragraph: ParagraphBlock,
  heading: HeadingBlock,
  image: ImageBlock,
  video: VideoBlock,
  chart: ChartBlock,
}

export default function BlockEditor({ blocks, onChange }) {
  const addBlock = (type) => {
    onChange([...blocks, createBlock(type)])
  }

  const updateBlock = (id, updated) => {
    onChange(blocks.map(b => b.id === id ? updated : b))
  }

  const deleteBlock = (id) => {
    onChange(blocks.filter(b => b.id !== id))
  }

  const moveBlock = (index, direction) => {
    const next = [...blocks]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
      ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
    onChange(next)
  }

  return (
    <div className="block-editor">
      <style>{styles}</style>

      {blocks.length === 0 && (
        <div className="block-editor-empty">
          No blocks yet. Add one below to start writing.
        </div>
      )}

      {blocks.map((block, index) => {
        const BlockComponent = BLOCK_COMPONENTS[block.type]
        if (!BlockComponent) return null

        return (
          <BlockWrapper
            key={block.id}
            index={index}
            total={blocks.length}
            onMoveUp={() => moveBlock(index, 'up')}
            onMoveDown={() => moveBlock(index, 'down')}
            onDelete={() => deleteBlock(block.id)}
          >
            <BlockComponent
              block={block}
              onChange={(updated) => updateBlock(block.id, updated)}
            />
          </BlockWrapper>
        )
      })}

      <BlockToolbar onAdd={addBlock} />
    </div>
  )
}