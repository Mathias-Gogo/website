import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/* ─────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────── */
const Icon = ({ d, size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
)

const Icons = {
  Back: () => <Icon d="m15 18-6-6 6-6" />,
  Settings: () => <Icon d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />,
  Check: () => <Icon d="M20 6 9 17l-5-5" />,
  Trash: () => <Icon d="M3 6h18 M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6 M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" size={14} />,
  Grip: () => <Icon size={13} d={<><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></>} />,
  Upload: () => <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />,
  Image: () => <Icon d={<><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></>} />,
  Close: () => <Icon d="M18 6 6 18 M6 6l12 12" />,
  Star: () => <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />,
  ChevronDown: () => <Icon d="m6 9 6 6 6-6" size={11} />,
  Spin: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'pe-spin 0.8s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  Text: () => <Icon d={<><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" x2="15" y1="20" y2="20" /><line x1="12" x2="12" y1="4" y2="20" /></>} size={13} />,
  H1: () => <Icon d={<><path d="M6 12h12" /><path d="M6 20V4" /><path d="M18 20V4" /></>} size={13} />,
  Quote: () => <Icon d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" size={13} />,
  Code: () => <Icon d={<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>} size={13} />,
  List: () => <Icon d={<><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></>} size={13} />,
  Divider: () => <Icon d="M5 12h14" size={13} />,
  Video: () => <Icon d={<><rect width="18" height="14" x="3" y="5" rx="2" /><path d="m10 9 5 3-5 3V9z" /></>} size={13} />,
}

/* ─────────────────────────────────────────────────────────
   BLOCK CATALOGUE
───────────────────────────────────────────────────────── */
const BLOCK_TYPES = [
  { type: 'text', label: 'Text', desc: 'Plain paragraph', Icon: Icons.Text },
  { type: 'heading-1', label: 'Heading 1', desc: 'Large section heading', Icon: Icons.H1 },
  { type: 'heading-2', label: 'Heading 2', desc: 'Medium heading', Icon: Icons.H1 },
  { type: 'heading-3', label: 'Heading 3', desc: 'Small heading', Icon: Icons.H1 },
  { type: 'quote', label: 'Quote', desc: 'Highlighted callout', Icon: Icons.Quote },
  { type: 'code', label: 'Code', desc: 'Monospace code block', Icon: Icons.Code },
  { type: 'list', label: 'List', desc: 'Bulleted list item', Icon: Icons.List },
  { type: 'image', label: 'Image', desc: 'Upload an image', Icon: Icons.Image },
  { type: 'divider', label: 'Divider', desc: 'Horizontal rule', Icon: Icons.Divider },
  { type: 'video', label: 'Video', desc: 'YouTube / Vimeo / Cloudinary', Icon: Icons.Video },
]

const TYPE_LABELS = {
  'text': 'Text', 'heading-1': 'H1', 'heading-2': 'H2', 'heading-3': 'H3',
  'quote': 'Quote', 'code': 'Code', 'list': 'List',
  'image': 'Image', 'divider': 'Divider', 'video': 'Video',
}

const PLACEHOLDERS = {
  'text': 'Start writing…', 'heading-1': 'Heading 1', 'heading-2': 'Heading 2',
  'heading-3': 'Heading 3', 'quote': 'Quote…', 'code': 'Code…',
  'list': 'List item…', 'video': 'Paste a YouTube, Vimeo, or Cloudinary URL…',
}

/* ─────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────── */
const CSS = `
  @keyframes pe-spin  { to { transform: rotate(360deg); } }
  @keyframes pe-slide { from { transform: translateX(100%); } to { transform: translateX(0); } }
  @keyframes pe-fade  { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

  .pe-wrap *, .pe-wrap *::before, .pe-wrap *::after { box-sizing: border-box; }
  .pe-wrap { margin: 0; padding: 0; min-height: 100vh; background: #080808; color: #e5e5e5; font-family: -apple-system, 'Inter', 'Geist', sans-serif; display: flex; flex-direction: column; }

  .pe-topbar { height: 52px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid #161616; position: sticky; top: 0; z-index: 50; background: #080808; gap: 16px; flex-shrink: 0; }
  .pe-topbar-left  { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
  .pe-topbar-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  .pe-back-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: #525252; font-size: 13px; font-weight: 500; cursor: pointer; padding: 6px 8px; border-radius: 6px; transition: color 0.15s, background 0.15s; white-space: nowrap; font-family: inherit; flex-shrink: 0; }
  .pe-back-btn:hover { color: #e5e5e5; background: #111; }

  .pe-topbar-title { flex: 1; min-width: 0; background: none; border: none; outline: none; color: #a1a1a1; font-size: 14px; font-weight: 500; font-family: inherit; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; }
  .pe-topbar-title::placeholder { color: #333; }

  .pe-status-badge { font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; padding: 3px 9px; border-radius: 100px; border: 1px solid #262626; background: #111; color: #525252; white-space: nowrap; }
  .pe-status-badge.published { background: rgba(16,185,129,0.08); color: #10b981; border-color: rgba(16,185,129,0.2); }

  .pe-icon-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 7px; background: none; border: 1px solid transparent; color: #525252; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
  .pe-icon-btn:hover { color: #e5e5e5; border-color: #262626; background: #111; }

  .pe-publish-btn { display: flex; align-items: center; gap: 6px; background: #5fcff8; color: #fff; border: none; border-radius: 8px; padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.15s, transform 0.1s; white-space: nowrap; }
  .pe-publish-btn:hover  { background: #5fcff8; }
  .pe-publish-btn:active { transform: scale(0.98); }
  .pe-publish-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .pe-body { flex: 1; overflow-y: auto; padding: 60px 24px 120px; }
  .pe-editor-inner { max-width: 720px; margin: 0 auto; }

  .pe-cover { width: 100%; border-radius: 10px; overflow: hidden; margin-bottom: 32px; position: relative; background: #111; border: 1px solid #1a1a1a; }
  .pe-cover img { width: 100%; display: block; aspect-ratio: 16/7; object-fit: cover; }
  .pe-cover-placeholder { aspect-ratio: 16/7; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #333; font-size: 13px; cursor: pointer; transition: background 0.15s; }
  .pe-cover-placeholder:hover { background: #161616; }
  .pe-cover-overlay { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: flex-end; padding: 12px; opacity: 0; transition: opacity 0.2s; }
  .pe-cover:hover .pe-cover-overlay { opacity: 1; }
  .pe-cover-change-btn { background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.1); color: #e5e5e5; border-radius: 6px; padding: 5px 10px; font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; backdrop-filter: blur(4px); }

  .pe-post-title { width: 100%; background: transparent; border: none; outline: none; color: #fff; font-size: 42px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.15; padding: 0; font-family: inherit; resize: none; overflow: hidden; margin-bottom: 32px; display: block; }
  .pe-post-title::placeholder { color: #222; }

  /* ── Block row ── */
  .pe-block-outer { position: relative; display: flex; align-items: flex-start; gap: 6px; margin-bottom: 2px; }

  .pe-block-gutter { width: 14px; flex-shrink: 0; display: flex; align-items: flex-start; justify-content: center; padding-top: 8px; opacity: 0; transition: opacity 0.15s; }
  .pe-block-outer:hover .pe-block-gutter { opacity: 1; }
  .pe-grip-btn { display: flex; align-items: center; justify-content: center; width: 14px; height: 22px; color: #333; cursor: grab; border-radius: 3px; border: none; background: none; padding: 0; transition: color 0.15s; }
  .pe-grip-btn:hover { color: #555; }
  .pe-grip-btn:active { cursor: grabbing; }

  /* ── Type pill ── */
  .pe-type-pill {
    display: flex; align-items: center; gap: 4px;
    background: #111; border: 1px solid #1e1e1e; border-radius: 6px;
    padding: 0 6px; height: 28px; margin-top: 4px;
    font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
    color: #404040; cursor: pointer; white-space: nowrap; flex-shrink: 0;
    font-family: inherit; transition: all 0.15s; user-select: none;
    min-width: 58px; justify-content: space-between;
  }
  .pe-type-pill:hover { color: #5fcff8; border-color: rgba(249,115,22,0.35); background: rgba(249,115,22,0.06); }
  .pe-type-pill-icon { display: flex; align-items: center; flex-shrink: 0; }
  .pe-type-pill-label { flex: 1; text-align: left; padding: 0 3px; }

  /* ── Type dropdown ── */
  .pe-type-dropdown {
    position: absolute; left: 0; top: calc(100% + 5px);
    background: #111; border: 1px solid #222; border-radius: 10px;
    padding: 6px; width: 230px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.75);
    z-index: 300; animation: pe-fade 0.12s ease;
  }
  .pe-type-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 6px; cursor: pointer; transition: background 0.1s; }
  .pe-type-dropdown-item:hover  { background: rgba(249,115,22,0.1); }
  .pe-type-dropdown-item.active { background: rgba(249,115,22,0.13); }
  .pe-type-dropdown-icon { width: 26px; height: 26px; border-radius: 5px; background: #1a1a1a; border: 1px solid #262626; display: flex; align-items: center; justify-content: center; color: #737373; flex-shrink: 0; }
  .pe-type-dropdown-item:hover  .pe-type-dropdown-icon,
  .pe-type-dropdown-item.active .pe-type-dropdown-icon { border-color: rgba(249,115,22,0.3); color: #5fcff8; }
  .pe-type-dropdown-text { display: flex; flex-direction: column; gap: 1px; }
  .pe-type-dropdown-label { font-size: 12px; font-weight: 500; color: #e5e5e5; }
  .pe-type-dropdown-desc  { font-size: 11px; color: #525252; }

  /* ── Block inner ── */
  .pe-block-inner { flex: 1; min-width: 0; position: relative; }

  .pe-ta { width: 100%; background: transparent; border: none; outline: none; color: #d4d4d4; font-size: 16px; line-height: 1.7; padding: 3px 0; font-family: inherit; resize: none; overflow: hidden; display: block; min-height: 32px; }
  .pe-ta::placeholder { color: #2e2e2e; }
  .pe-ta.heading-1 { font-size: 32px; font-weight: 700; color: #fff; letter-spacing: -0.02em; line-height: 1.25; padding: 6px 0 4px; }
  .pe-ta.heading-2 { font-size: 26px; font-weight: 600; color: #f5f5f5; letter-spacing: -0.015em; line-height: 1.3; padding: 4px 0 3px; }
  .pe-ta.heading-3 { font-size: 21px; font-weight: 600; color: #e5e5e5; line-height: 1.35; padding: 3px 0; }
  .pe-ta.quote { font-style: italic; color: #a1a1a1; border-left: 3px solid #5fcff8; padding-left: 16px; }
  .pe-ta.code { font-family: 'SF Mono', 'Fira Mono', 'Cascadia Code', monospace; font-size: 13.5px; background: #0f0f0f; padding: 14px 16px; border-radius: 8px; color: #a5f3fc; min-height: 56px; border: 1px solid #1a1a1a; }
  .pe-ta.list { padding-left: 4px; }

  .pe-list-bullet { position: absolute; left: -18px; top: 11px; width: 5px; height: 5px; border-radius: 50%; background: #525252; }
  .pe-block-inner.list-item { padding-left: 22px; }
  .pe-divider { width: 100%; height: 1px; background: #1a1a1a; margin: 12px 0; border: none; }

  .pe-img-block { border-radius: 8px; overflow: hidden; margin: 4px 0; }
  .pe-img-block img { width: 100%; display: block; border-radius: 8px; }
  .pe-img-upload { display: flex; align-items: center; justify-content: center; gap: 8px; background: #111; border: 1.5px dashed #262626; border-radius: 8px; color: #525252; font-size: 13px; font-weight: 500; padding: 20px; width: 100%; cursor: pointer; font-family: inherit; transition: all 0.2s; aspect-ratio: 16/9; }
  .pe-img-upload:hover { border-color: #5fcff8; color: #5fcff8; background: rgba(249,115,22,0.03); }

  .pe-del-btn { position: absolute; right: -24px; top: 4px; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 4px; background: none; border: none; color: #2a2a2a; cursor: pointer; transition: all 0.15s; opacity: 0; }
  .pe-block-outer:hover .pe-del-btn { opacity: 1; }
  .pe-del-btn:hover { color: #5fcff8; background: rgba(239,68,68,0.1); }

  .pe-block-outer.drag-over::before { content: ''; position: absolute; left: 0; right: 0; top: -1px; height: 2px; background: #5fcff8; border-radius: 2px; }

  .pe-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 98; animation: pe-fade 0.2s ease; backdrop-filter: blur(2px); }

  .pe-sidebar { position: fixed; top: 0; right: 0; bottom: 0; width: 360px; background: #0d0d0d; border-left: 1px solid #1a1a1a; z-index: 99; display: flex; flex-direction: column; animation: pe-slide 0.25s cubic-bezier(0.4,0,0.2,1); overflow-y: auto; }
  .pe-sidebar-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid #1a1a1a; flex-shrink: 0; }
  .pe-sidebar-header h2 { font-size: 14px; font-weight: 600; color: #e5e5e5; margin: 0; }
  .pe-sidebar-body { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 28px; overflow-y: auto; }
  .pe-sb-section { display: flex; flex-direction: column; gap: 14px; }
  .pe-sb-section-title { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #404040; padding-bottom: 10px; border-bottom: 1px solid #1a1a1a; display: flex; align-items: center; gap: 6px; margin: 0; }
  .pe-sb-field { display: flex; flex-direction: column; gap: 6px; }
  .pe-sb-field label { font-size: 12px; font-weight: 500; color: #737373; }
  .pe-sb-field input, .pe-sb-field textarea, .pe-sb-field select { width: 100%; background: #111; border: 1px solid #1a1a1a; border-radius: 8px; color: #e5e5e5; font-size: 13px; padding: 9px 12px; outline: none; font-family: inherit; transition: border-color 0.2s; resize: none; box-sizing: border-box; }
  .pe-sb-field input:focus, .pe-sb-field textarea:focus, .pe-sb-field select:focus { border-color: #5fcff8; }
  .pe-sb-field input::placeholder, .pe-sb-field textarea::placeholder { color: #333; }
  .pe-sb-field textarea { min-height: 76px; line-height: 1.5; }
  .pe-sb-field select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 32px; }
  .pe-cover-upload { display: flex; align-items: center; justify-content: center; gap: 8px; background: #111; border: 1.5px dashed #262626; border-radius: 10px; color: #525252; font-size: 13px; font-weight: 500; padding: 16px; width: 100%; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .pe-cover-upload:hover { border-color: #5fcff8; color: #5fcff8; }
  .pe-cover-preview { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 8px; border: 1px solid #1a1a1a; display: block; }
  .pe-featured-row { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .pe-featured-row input[type="checkbox"] { width: 16px; height: 16px; accent-color: #5fcff8; cursor: pointer; margin: 0; flex-shrink: 0; }
  .pe-featured-row span { font-size: 13px; color: #a1a1a1; font-weight: 500; }
  .pe-featured-hint { font-size: 11px; color: #404040; padding-left: 26px; }
  .pe-featured-order { padding-left: 26px; display: flex; flex-direction: column; gap: 6px; }
  .pe-featured-order label { font-size: 11px; color: #525252; }
  .pe-featured-order input { width: 72px; background: #111; border: 1px solid #1a1a1a; border-radius: 6px; color: #e5e5e5; font-size: 13px; padding: 6px 10px; outline: none; font-family: inherit; }
  .pe-featured-order input:focus { border-color: #5fcff8; }
  .pe-sidebar-actions { padding: 16px 20px 20px; border-top: 1px solid #1a1a1a; display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }

  .pe-btn-publish { display: flex; align-items: center; justify-content: center; gap: 8px; background: #5fcff8; color: #fff; border: none; border-radius: 10px; padding: 12px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.15s; width: 100%; }
  .pe-btn-publish:hover    { background: #5fcff8; }
  .pe-btn-publish:disabled { opacity: 0.5; cursor: not-allowed; }
  .pe-btn-draft { display: flex; align-items: center; justify-content: center; gap: 8px; background: none; border: 1px solid #262626; color: #a1a1a1; border-radius: 10px; padding: 11px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; width: 100%; }
  .pe-btn-draft:hover    { border-color: #404040; color: #e5e5e5; background: #111; }
  .pe-btn-draft:disabled { opacity: 0.5; cursor: not-allowed; }

  .pe-save-status { font-size: 12px; text-align: center; min-height: 16px; font-weight: 500; color: transparent; transition: color 0.3s; }
  .pe-save-status.success { color: #10b981; }
  .pe-save-status.error   { color: #5fcff8; }
  .pe-save-status.saving  { color: #737373; }

  .pe-loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; color: #525252; font-size: 13px; gap: 10px; background: #080808; }

  /* ── Unsaved modal ── */
  .pe-unsaved-modal { position: fixed; inset: 0; z-index: 400; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); animation: pe-fade 0.15s ease; }
  .pe-unsaved-card { background: #111; border: 1px solid #262626; border-radius: 14px; padding: 28px; width: 340px; }
  .pe-unsaved-card h3 { font-size: 15px; font-weight: 600; color: #e5e5e5; margin: 0 0 8px; }
  .pe-unsaved-card p  { font-size: 13px; color: #737373; margin: 0 0 24px; line-height: 1.5; }
  .pe-unsaved-actions { display: flex; gap: 8px; }
  .pe-unsaved-actions .pe-btn-publish { flex: 1; padding: 10px; font-size: 13px; }
  .pe-unsaved-actions .pe-btn-draft   { width: auto; padding: 10px 16px; font-size: 13px; }

  /* ── Preview modal ── */
  .pe-preview-modal { position: fixed; inset: 0; z-index: 300; background: #080808; overflow-y: auto; animation: pe-fade 0.2s ease; }
  .pe-preview-topbar { position: sticky; top: 0; z-index: 10; height: 52px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; background: rgba(10,10,10,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid #1a1a1a; }
  .pe-preview-topbar span { font-size: 12px; font-weight: 500; color: #525252; letter-spacing: 0.06em; text-transform: uppercase; }
  .pe-preview-body { max-width: 740px; margin: 0 auto; padding: 60px 24px 120px; }
  .pe-preview-cover { width: 100%; aspect-ratio: 16/7; object-fit: cover; border-radius: 12px; margin-bottom: 40px; display: block; border: 1px solid #1a1a1a; }
  .pe-preview-title { font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(32px, 5vw, 52px); font-weight: 400; line-height: 1.1; letter-spacing: -0.03em; color: #fff; margin-bottom: 20px; }
  .pe-preview-meta { font-size: 13px; color: #525252; display: flex; align-items: center; gap: 12px; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid #1a1a1a; }
  .pe-preview-meta span { color: #5fcff8; font-weight: 500; }
  .pe-preview-block-text { font-size: 18px; line-height: 1.8; color: #d4d4d4; margin-bottom: 20px; }
  .pe-preview-block-h1 { font-family: 'Instrument Serif', Georgia, serif; font-size: 34px; font-weight: 400; color: #fff; line-height: 1.2; letter-spacing: -0.02em; margin: 40px 0 16px; }
  .pe-preview-block-h2 { font-family: 'Instrument Serif', Georgia, serif; font-size: 26px; font-weight: 400; color: #f5f5f5; line-height: 1.25; margin: 32px 0 14px; }
  .pe-preview-block-h3 { font-size: 20px; font-weight: 600; color: #e5e5e5; line-height: 1.3; margin: 28px 0 12px; }
  .pe-preview-block-quote { font-style: italic; font-size: 18px; color: #a1a1a1; line-height: 1.7; border-left: 3px solid #5fcff8; padding-left: 20px; margin: 24px 0; }
  .pe-preview-block-code { font-family: 'SF Mono', 'Fira Mono', monospace; font-size: 13.5px; color: #a5f3fc; background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 8px; padding: 16px 20px; margin: 20px 0; overflow-x: auto; white-space: pre-wrap; }
  .pe-preview-block-list { font-size: 18px; line-height: 1.8; color: #d4d4d4; margin-bottom: 8px; padding-left: 24px; position: relative; }
  .pe-preview-block-list::before { content: ''; position: absolute; left: 6px; top: 13px; width: 5px; height: 5px; border-radius: 50%; background: #525252; }
  .pe-preview-block-divider { border: none; height: 1px; background: #1a1a1a; margin: 32px 0; }
  .pe-preview-block-img { width: 100%; border-radius: 10px; margin: 24px 0; display: block; }
  .pe-preview-block-video-wrap { position: relative; padding-bottom: 56.25%; height: 0; border-radius: 10px; overflow: hidden; margin: 24px 0; background: #0f0f0f; border: 1px solid #1a1a1a; }
  .pe-preview-block-video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }

  @media (max-width: 640px) {
    .pe-post-title { font-size: 30px; }
    .pe-sidebar { width: 100%; }
    .pe-body { padding: 40px 16px 100px; }
    .pe-topbar { padding: 0 12px; }
  }
`

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2)
const makeBlock = (type = 'text', content = '') => ({ id: uid(), type, content })

/* ─────────────────────────────────────────────────────────
   BLOCK TYPE DROPDOWN
───────────────────────────────────────────────────────── */
function BlockTypeDropdown({ currentType, onSelect }) {
  return (
    <div className="pe-type-dropdown">
      {BLOCK_TYPES.map((b) => (
        <div
          key={b.type}
          className={`pe-type-dropdown-item${b.type === currentType ? ' active' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); onSelect(b.type) }}
        >
          <div className="pe-type-dropdown-icon"><b.Icon /></div>
          <div className="pe-type-dropdown-text">
            <span className="pe-type-dropdown-label">{b.label}</span>
            <span className="pe-type-dropdown-desc">{b.desc}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   SINGLE BLOCK
───────────────────────────────────────────────────────── */
function Block({ block, index, total, onChange, onAdd, onDelete, onFocus, isFocused, onDragStart, onDragOver, onDrop, isDragOver }) {
  const taRef = useRef(null)
  const fileRef = useRef(null)
  const pillRef = useRef(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => {
      if (!pillRef.current?.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  /* Auto-resize textarea */
  const resize = useCallback(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [])
  useEffect(() => { resize() }, [block.content, resize])

  /* Focus on new block */
  useEffect(() => {
    if (isFocused && taRef.current && block.type !== 'image' && block.type !== 'divider') {
      taRef.current.focus()
      const len = taRef.current.value.length
      taRef.current.setSelectionRange(len, len)
    }
  }, [isFocused, block.type])

  const handleTypeSelect = (type) => {
    onChange(block.id, { type })
    setDropdownOpen(false)
    setTimeout(() => taRef.current?.focus(), 0)
  }

  const handleChange = (e) => {
    onChange(block.id, { content: e.target.value })
    resize()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && block.type !== 'code') {
      e.preventDefault()
      const newType = block.type.startsWith('heading') ? 'text' : block.type === 'divider' ? 'text' : block.type
      onAdd(index, newType === 'divider' ? 'text' : newType)
      return
    }
    if (e.key === 'Backspace' && !block.content && total > 1) {
      e.preventDefault()
      onDelete(block.id, index)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = file.name.split('.').pop()
    const path = `content_${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('post-media').upload(path, file, { upsert: true })
    if (error) return
    const { data } = supabase.storage.from('post-media').getPublicUrl(path)
    onChange(block.id, { content: data.publicUrl })
  }

  const CurrentIcon = BLOCK_TYPES.find(b => b.type === block.type)?.Icon ?? Icons.Text
  const pillLabel = TYPE_LABELS[block.type] ?? block.type

  const getVideoEmbed = (url) => {
    if (!url) return null
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=0`
    const vi = url.match(/vimeo\.com\/(\d+)/)
    if (vi) return `https://player.vimeo.com/video/${vi[1]}`
    return null
  }

  const renderContent = () => {
    if (block.type === 'divider') return <div className="pe-divider" />

    if (block.type === 'image') {
      return block.content
        ? <div className="pe-img-block"><img src={block.content} alt="" /></div>
        : (
          <label className="pe-img-upload">
            <Icons.Upload /> Upload image
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          </label>
        )
    }

    if (block.type === 'video') {
      const embedUrl = getVideoEmbed(block.content)
      const isDirect = block.content && (block.content.match(/\.(mp4|webm|ogg)$/i) || block.content.includes('cloudinary'))
      if (!block.content) {
        return <textarea ref={taRef} className="pe-ta text" placeholder={PLACEHOLDERS['video']} value={block.content} onChange={handleChange} onKeyDown={handleKeyDown} rows={1} style={{ marginTop: 6 }} />
      }
      if (embedUrl) {
        return (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 10, overflow: 'hidden', background: '#0f0f0f', border: '1px solid #1a1a1a', marginTop: 6 }}>
            <iframe src={embedUrl} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        )
      }
      if (isDirect) return <video src={block.content} controls style={{ width: '100%', borderRadius: 10, background: '#0f0f0f', border: '1px solid #1a1a1a', marginTop: 6 }} />
      return <textarea ref={taRef} className="pe-ta text" placeholder={PLACEHOLDERS['video']} value={block.content} onChange={handleChange} onKeyDown={handleKeyDown} rows={1} style={{ marginTop: 6 }} />
    }

    return (
      <>
        {block.type === 'list' && <span className="pe-list-bullet" />}
        <textarea
          ref={taRef}
          className={`pe-ta ${block.type}`}
          placeholder={PLACEHOLDERS[block.type] || ''}
          value={block.content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => onFocus(index)}
          rows={1}
        />
      </>
    )
  }

  return (
    <div
      className={`pe-block-outer${isDragOver ? ' drag-over' : ''}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(index) }}
      onDrop={() => onDrop(index)}
    >
      {/* Grip */}
      <div className="pe-block-gutter">
        <button className="pe-grip-btn" tabIndex={-1}><Icons.Grip /></button>
      </div>

      {/* Type pill + dropdown */}
      <div style={{ position: 'relative', flexShrink: 0 }} ref={pillRef}>
        <button
          className="pe-type-pill"
          onClick={() => setDropdownOpen(o => !o)}
          tabIndex={-1}
          title="Change block type"
        >
          <span className="pe-type-pill-icon"><CurrentIcon /></span>
          <span className="pe-type-pill-label">{pillLabel}</span>
          <Icons.ChevronDown />
        </button>
        {dropdownOpen && (
          <BlockTypeDropdown currentType={block.type} onSelect={handleTypeSelect} />
        )}
      </div>

      {/* Content */}
      <div className={`pe-block-inner${block.type === 'list' ? ' list-item' : ''}`}>
        {renderContent()}
      </div>

      {/* Delete */}
      <button className="pe-del-btn" onClick={() => onDelete(block.id, index)} tabIndex={-1}>
        <Icons.Trash />
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────── */
export default function PostEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [blocks, setBlocks] = useState([makeBlock('text')])
  const [focusedIdx, setFocusedIdx] = useState(0)
  const [postTitle, setPostTitle] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [coverUploading, setCoverUploading] = useState(false)
  const [meta, setMeta] = useState({ slug: '', slugEdited: false, metaDesc: '', section: 'articles', status: 'draft' })
  const [featured, setFeatured] = useState({ on: false, order: 1 })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState({ msg: '', type: '' })
  const [loading, setLoading] = useState(isEditing)
  const [isDirty, setIsDirty] = useState(false)
  const [showUnsaved, setShowUnsaved] = useState(false)

  useEffect(() => { setIsDirty(true) }, [postTitle, blocks, coverImage, meta, featured])

  useEffect(() => {
    const handler = (e) => { if (isDirty) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const dragIdx = useRef(null)
  const [dragOverIdx, setDragOverIdx] = useState(null)

  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = CSS
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])

  useEffect(() => {
    if (!isEditing) return
      ; (async () => {
        const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
        if (error || !data) { navigate('/admin'); return }
        setPostTitle(data.title || '')
        setBlocks(data.content?.length ? data.content : [makeBlock('text')])
        setCoverImage(data.cover_image || '')
        setFeatured({ on: data.is_featured || false, order: data.featured_order || 1 })
        setMeta({ slug: data.slug || '', slugEdited: true, metaDesc: data.meta || '', section: data.sections?.[0] || 'articles', status: data.status || 'draft' })
        setLoading(false)
        setIsDirty(false)
      })()
  }, [id])

  const handleTitleChange = (val) => {
    setPostTitle(val)
    if (!meta.slugEdited) {
      setMeta(p => ({ ...p, slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))
    }
  }

  const titleRef = useRef(null)
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [postTitle])

  const updateBlock = useCallback((blockId, updates) => {
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, ...updates } : b))
  }, [])

  const addBlock = useCallback((afterIndex, type = 'text') => {
    const nb = makeBlock(type)
    setBlocks(prev => { const next = [...prev]; next.splice(afterIndex + 1, 0, nb); return next })
    setFocusedIdx(afterIndex + 1)
  }, [])

  const deleteBlock = useCallback((blockId, index) => {
    setBlocks(prev => prev.length <= 1 ? prev : prev.filter(b => b.id !== blockId))
    setFocusedIdx(Math.max(0, index - 1))
  }, [])

  const handleDragStart = (idx) => { dragIdx.current = idx }
  const handleDragOver = (idx) => { setDragOverIdx(idx) }
  const handleDrop = (idx) => {
    const from = dragIdx.current
    if (from === null || from === idx) { setDragOverIdx(null); return }
    setBlocks(prev => { const next = [...prev]; const [moved] = next.splice(from, 1); next.splice(idx, 0, moved); return next })
    dragIdx.current = null; setDragOverIdx(null)
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    const path = `cover_${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('post-media').upload(path, file, { upsert: true })
    if (error) { setCoverUploading(false); return }
    const { data } = supabase.storage.from('post-media').getPublicUrl(path)
    setCoverImage(data.publicUrl); setCoverUploading(false)
  }

  const showStatus = (msg, type) => {
    setSaveStatus({ msg, type })
    setTimeout(() => setSaveStatus({ msg: '', type: '' }), 3000)
  }

  const handleSave = async (statusOverride) => {
    if (!postTitle.trim()) return showStatus('Title is required', 'error')
    if (!meta.slug.trim()) return showStatus('Slug is required', 'error')
    setSaving(true); showStatus('Saving…', 'saving')
    const payload = {
      title: postTitle, slug: meta.slug, meta: meta.metaDesc,
      cover_image: coverImage, content: blocks, sections: [meta.section],
      is_featured: featured.on,
      featured_order: featured.on ? Math.min(3, Math.max(1, featured.order)) : null,
      status: statusOverride || meta.status,
      published_at: statusOverride === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }
    let error
    if (isEditing) { ; ({ error } = await supabase.from('posts').update(payload).eq('id', id)) }
    else { ; ({ error } = await supabase.from('posts').insert(payload)) }
    setSaving(false)
    if (error) return showStatus(error.message, 'error')
    if (statusOverride) setMeta(p => ({ ...p, status: statusOverride }))
    showStatus(statusOverride === 'published' ? 'Published ✓' : 'Saved ✓', 'success')
    setIsDirty(false)
    setTimeout(() => navigate('/admin'), 1200)
  }

  const handleNavigateAway = () => {
    if (isDirty) setShowUnsaved(true)
    else navigate('/admin')
  }

  if (loading) return <div className="pe-loading"><Icons.Spin /> Loading post…</div>

  const isPublished = meta.status === 'published'

  return (
    <div className="pe-wrap">

      {/* ── TOP BAR ── */}
      <header className="pe-topbar">
        <div className="pe-topbar-left">
          <button className="pe-back-btn" onClick={handleNavigateAway}>
            <Icons.Back /> All Posts
          </button>
          <input className="pe-topbar-title" value={postTitle} placeholder="Untitled" readOnly />
        </div>
        <div className="pe-topbar-right">
          <span className={`pe-status-badge${isPublished ? ' published' : ''}`}>{meta.status}</span>
          <button className="pe-icon-btn" onClick={() => setSidebarOpen(true)} title="Post settings">
            <Icons.Settings />
          </button>
          <button className="pe-publish-btn" onClick={() => handleSave('published')} disabled={saving}>
            {saving ? <><Icons.Spin /> Saving…</> : isPublished ? <><Icons.Check /> Update</> : <><Icons.Check /> Publish</>}
          </button>
        </div>
      </header>

      {/* ── EDITOR BODY ── */}
      <main className="pe-body">
        <div className="pe-editor-inner">

          {/* Cover */}
          <div className="pe-cover">
            {coverImage
              ? <>
                <img src={coverImage} alt="Cover" />
                <div className="pe-cover-overlay">
                  <label className="pe-cover-change-btn">
                    Change cover
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} />
                  </label>
                </div>
              </>
              : <label className="pe-cover-placeholder">
                <Icons.Upload />
                {coverUploading ? 'Uploading…' : 'Add cover image'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} disabled={coverUploading} />
              </label>
            }
          </div>

          {/* Title */}
          <textarea
            ref={titleRef}
            className="pe-post-title"
            placeholder="Post title…"
            value={postTitle}
            onChange={e => handleTitleChange(e.target.value)}
            rows={1}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addBlock(-1, 'text'); setFocusedIdx(0) } }}
          />

          {/* Blocks */}
          <div
            onDragLeave={() => setDragOverIdx(null)}
            onClick={(e) => { if (e.target === e.currentTarget) addBlock(blocks.length - 1, 'text') }}
            style={{ minHeight: '40vh', paddingBottom: '20vh' }}
          >
            {blocks.map((block, index) => (
              <Block
                key={block.id} block={block} index={index} total={blocks.length}
                onChange={updateBlock} onAdd={addBlock} onDelete={deleteBlock}
                onFocus={setFocusedIdx} isFocused={focusedIdx === index}
                onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop}
                isDragOver={dragOverIdx === index}
              />
            ))}
          </div>
        </div>
      </main>

      {/* ── SIDEBAR ── */}
      {sidebarOpen && <div className="pe-overlay" onClick={() => setSidebarOpen(false)} />}
      {sidebarOpen && (
        <aside className="pe-sidebar">
          <div className="pe-sidebar-header">
            <h2>Post Settings</h2>
            <button className="pe-icon-btn" onClick={() => setSidebarOpen(false)}><Icons.Close /></button>
          </div>
          <div className="pe-sidebar-body">
            <button className="pe-btn-draft" style={{ marginBottom: 10 }}
              onClick={() => { setSidebarOpen(false); setPreviewOpen(true) }}>
              Preview Post
            </button>
            <div className="pe-sb-section">
              <p className="pe-sb-section-title"><Icons.Settings /> Post Details</p>
              <div className="pe-sb-field">
                <label>Slug</label>
                <input value={meta.slug} onChange={e => setMeta(p => ({ ...p, slug: e.target.value, slugEdited: true }))} placeholder="post-url-slug" />
              </div>
              <div className="pe-sb-field">
                <label>Meta Description</label>
                <textarea value={meta.metaDesc} onChange={e => setMeta(p => ({ ...p, metaDesc: e.target.value }))} placeholder="Brief description for SEO…" />
              </div>
              <div className="pe-sb-field">
                <label>Section</label>
                <select value={meta.section} onChange={e => setMeta(p => ({ ...p, section: e.target.value }))}>
                  <option value="articles">Articles</option>
                  <option value="news">News</option>
                  <option value="research">Research</option>
                  <option value="guides">Guides</option>
                </select>
              </div>
            </div>
            <div className="pe-sb-section">
              <p className="pe-sb-section-title"><Icons.Image /> Cover Image</p>
              {coverImage && <img src={coverImage} alt="Cover" className="pe-cover-preview" />}
              <label className="pe-cover-upload">
                {coverUploading ? <><Icons.Spin /> Uploading…</> : coverImage ? <><Icons.Upload /> Change Cover</> : <><Icons.Upload /> Upload Cover</>}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} disabled={coverUploading} />
              </label>
            </div>
            <div className="pe-sb-section">
              <p className="pe-sb-section-title"><Icons.Star /> Featured</p>
              <label className="pe-featured-row">
                <input type="checkbox" checked={featured.on} onChange={e => setFeatured(p => ({ ...p, on: e.target.checked }))} />
                <span>Feature this post</span>
              </label>
              <span className="pe-featured-hint">Maximum 3 featured posts at a time.</span>
              {featured.on && (
                <div className="pe-featured-order">
                  <label>Display order (1 – 3)</label>
                  <input type="number" min="1" max="3" value={featured.order}
                    onChange={e => setFeatured(p => ({ ...p, order: Math.min(3, Math.max(1, parseInt(e.target.value) || 1)) }))} />
                </div>
              )}
            </div>
          </div>
          <div className="pe-sidebar-actions">
            <p className={`pe-save-status ${saveStatus.type}`}>{saveStatus.msg}</p>
            <button className="pe-btn-publish" onClick={() => handleSave('published')} disabled={saving}>
              {saving ? <><Icons.Spin /> Saving…</> : isPublished ? <><Icons.Check /> Update Post</> : <><Icons.Check /> Publish</>}
            </button>
            <button className="pe-btn-draft" onClick={() => handleSave('draft')} disabled={saving}>Save as Draft</button>
          </div>
        </aside>
      )}

      {/* ── PREVIEW ── */}
      {previewOpen && (
        <div className="pe-preview-modal">
          <div className="pe-preview-topbar">
            <span>Preview</span>
            <button className="pe-icon-btn" onClick={() => setPreviewOpen(false)}><Icons.Close /></button>
          </div>
          <div className="pe-preview-body">
            {coverImage && <img src={coverImage} alt="" className="pe-preview-cover" />}
            <h1 className="pe-preview-title">{postTitle || 'Untitled'}</h1>
            <div className="pe-preview-meta">
              <span>{meta.section}</span><span>·</span>
              <span style={{ color: '#525252' }}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            {blocks.map((block) => {
              if (block.type === 'text') return <p key={block.id} className="pe-preview-block-text">{block.content}</p>
              if (block.type === 'heading-1') return <h2 key={block.id} className="pe-preview-block-h1">{block.content}</h2>
              if (block.type === 'heading-2') return <h3 key={block.id} className="pe-preview-block-h2">{block.content}</h3>
              if (block.type === 'heading-3') return <h4 key={block.id} className="pe-preview-block-h3">{block.content}</h4>
              if (block.type === 'quote') return <blockquote key={block.id} className="pe-preview-block-quote">{block.content}</blockquote>
              if (block.type === 'code') return <pre key={block.id} className="pe-preview-block-code">{block.content}</pre>
              if (block.type === 'list') return <p key={block.id} className="pe-preview-block-list">{block.content}</p>
              if (block.type === 'divider') return <hr key={block.id} className="pe-preview-block-divider" />
              if (block.type === 'image' && block.content) return <img key={block.id} src={block.content} alt="" className="pe-preview-block-img" />
              if (block.type === 'video' && block.content) {
                const yt = block.content.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
                const vi = block.content.match(/vimeo\.com\/(\d+)/)
                const embedUrl = yt ? `https://www.youtube.com/embed/${yt[1]}` : vi ? `https://player.vimeo.com/video/${vi[1]}` : null
                return embedUrl
                  ? <div key={block.id} className="pe-preview-block-video-wrap"><iframe src={embedUrl} allowFullScreen /></div>
                  : <video key={block.id} src={block.content} controls style={{ width: '100%', borderRadius: 10, margin: '24px 0' }} />
              }
              return null
            })}
          </div>
        </div>
      )}

      {/* ── UNSAVED CHANGES MODAL ── */}
      {showUnsaved && (
        <div className="pe-unsaved-modal">
          <div className="pe-unsaved-card">
            <h3>Unsaved changes</h3>
            <p>You have unsaved changes. Save as a draft before leaving, or discard them.</p>
            <div className="pe-unsaved-actions">
              <button className="pe-btn-publish" onClick={() => handleSave('draft').then(() => { setShowUnsaved(false); navigate('/admin') })} disabled={saving}>
                {saving ? <><Icons.Spin /> Saving…</> : 'Save Draft'}
              </button>
              <button className="pe-btn-draft" onClick={() => { setIsDirty(false); navigate('/admin') }}>Discard</button>
              <button className="pe-btn-draft" onClick={() => setShowUnsaved(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}