import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// ── SVG Icons ──
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
)

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
  </svg>
)

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
    <path d="m2 2 20 20" />
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
)

const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)

const ArchiveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" />
  </svg>
)

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const SpinnerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin">
    <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

const EmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
  </svg>
)

const styles = `
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 32px;
    height: 100%;
  }

  /* ── Header ── */
  .dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
  }

  .dashboard-header h1 {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.4px;
    color: #ffffff;
    margin: 0;
  }

  .dashboard-new-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #5fcff8;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
    letter-spacing: 0.01em;
  }

  .dashboard-new-btn:hover {
    background: #5fcff8;
    transform: translateY(-1px);
  }

  .dashboard-new-btn:active {
    transform: translateY(0);
  }

  /* ── Stats ── */
  .dashboard-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: #111;
    border: 1px solid #1a1a1a;
    border-radius: 12px;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: border-color 0.2s;
  }

  .stat-card:hover {
    border-color: #262626;
  }

  .stat-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #525252;
  }

  .stat-card-header svg {
    color: #404040;
  }

  .stat-card-value {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: #ffffff;
    line-height: 1;
  }

  /* ── Filters ── */
  .dashboard-filters {
    display: flex;
    gap: 6px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .dashboard-filter-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px solid transparent;
    color: #737373;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
  }

  .dashboard-filter-btn:hover {
    color: #a1a1a1;
    background: #111;
    border-color: #1a1a1a;
  }

  .dashboard-filter-btn.active {
    background:rgba(95, 207, 248, 0.28);
    border-color: #5fcff8;
    color: #5fcff8;
    font-weight: 600;
  }

  /* ── Table ── */
  .posts-table-wrap {
    border: 1px solid #1a1a1a;
    border-radius: 12px;
    overflow: hidden;
    background: #111;
  }

  .posts-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .posts-table th {
    text-align: left;
    padding: 12px 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #525252;
    border-bottom: 1px solid #1a1a1a;
    background: #0f0f0f;
    white-space: nowrap;
  }

  .posts-table td {
    padding: 14px 20px;
    border-bottom: 1px solid #161616;
    vertical-align: middle;
    color: #a1a1a1;
    transition: background 0.15s;
  }

  .posts-table tbody tr {
    transition: background 0.15s;
  }

  .posts-table tbody tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }

  .posts-table tbody tr:last-child td {
    border-bottom: none;
  }

  .post-title-cell {
    color: #e5e5e5;
    font-weight: 500;
    max-width: 360px;
  }

  .post-title-cell p {
    font-size: 12px;
    color: #525252;
    margin: 4px 0 0;
    font-weight: 400;
    font-family: 'SF Mono', monospace;
  }

  .section-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    text-transform: capitalize;
    background: #161616;
    color: #737373;
    border: 1px solid #1a1a1a;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    text-transform: capitalize;
    letter-spacing: 0.02em;
  }

  .status-badge.published {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.15);
  }

  .status-badge.draft {
    background: rgba(161, 161, 161, 0.06);
    color: #737373;
    border: 1px solid rgba(161, 161, 161, 0.1);
  }

  .status-badge.archived {
    background: rgba(239, 68, 68, 0.06);
    color: #5fcff8;
    border: 1px solid rgba(239, 68, 68, 0.1);
  }

  .post-actions {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px solid #1a1a1a;
    color: #737373;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .action-btn:hover {
    border-color: #333;
    color: #e5e5e5;
    background: rgba(255, 255, 255, 0.03);
  }

  .action-btn.publish {
    border-color: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }

  .action-btn.publish:hover {
    background: rgba(16, 185, 129, 0.08);
    border-color: rgba(16, 185, 129, 0.35);
  }

  .action-btn.unpublish {
    border-color: rgba(161, 161, 161, 0.15);
    color: #737373;
  }

  .action-btn.unpublish:hover {
    background: rgba(161, 161, 161, 0.05);
    border-color: rgba(161, 161, 161, 0.25);
    color: #a1a1a1;
  }

  .action-btn.delete {
    border-color: rgba(239, 68, 68, 0.15);
    color: rgba(239, 68, 68, 0.3);
  }

  .action-btn.delete:hover {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.3);
  }

  .action-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ── Empty State ── */
  .dashboard-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 24px;
    text-align: center;
    gap: 16px;
  }

  .dashboard-empty-icon {
    color: #262626;
  }

  .dashboard-empty h3 {
    font-size: 16px;
    font-weight: 600;
    color: #525252;
    margin: 0;
  }

  .dashboard-empty p {
    font-size: 13px;
    color: #404040;
    margin: 0;
    max-width: 300px;
    line-height: 1.5;
  }

  /* ── Loading ── */
  .dashboard-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 100px 0;
    color: #525252;
    font-size: 13px;
    font-weight: 500;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .dashboard { padding: 24px 16px; }
    .dashboard-stats { grid-template-columns: repeat(2, 1fr); }
    .posts-table th:nth-child(3),
    .posts-table td:nth-child(3),
    .posts-table th:nth-child(4),
    .posts-table td:nth-child(4) { display: none; }
    .post-actions { flex-wrap: wrap; }
  }
    /* ── Delete Modal ── */
.delete-modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.delete-modal {
  background: #111;
  border: 1px solid #1a1a1a;
  border-radius: 16px;
  padding: 28px;
  width: 100%;
  max-width: 380px;
  animation: scaleIn 0.2s cubic-bezier(0.4,0,0.2,1);
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}

.delete-modal-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.15);
  display: flex; align-items: center; justify-content: center;
  color: #5fcff8;
  margin-bottom: 16px;
}

.delete-modal h3 {
  font-size: 16px; font-weight: 600;
  color: #e5e5e5; margin: 0 0 8px;
  letter-spacing: -0.2px;
}

.delete-modal p {
  font-size: 13px; color: #525252;
  line-height: 1.6; margin: 0 0 24px;
}

.delete-modal p strong {
  color: #a1a1a1; font-weight: 500;
}

.delete-modal-actions {
  display: flex; gap: 10px;
}

.delete-modal-cancel {
  flex: 1;
  background: none; border: 1px solid #262626;
  color: #a1a1a1; border-radius: 10px;
  padding: 10px; font-size: 13px; font-weight: 500;
  cursor: pointer; font-family: inherit;
  transition: all 0.15s;
}

.delete-modal-cancel:hover {
  border-color: #404040; color: #e5e5e5; background: #161616;
}

.delete-modal-confirm {
  flex: 1;
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
  color: #5fcff8; border-radius: 10px;
  padding: 10px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit;
  transition: all 0.15s;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}

.delete-modal-confirm:hover {
  background: rgba(239,68,68,0.16); border-color: rgba(239,68,68,0.35);
}

.delete-modal-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
  `;

const FILTERS = ['all', 'published', 'draft', 'archived']

export default function AdminDashboard() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)
  const [confirmPost, setConfirmPost] = useState(null) // post to confirm deletion
  const navigate = useNavigate()

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, sections, status, is_featured, created_at, published_at')
      .order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirmPost) return
    setDeleting(confirmPost.id)
    await supabase.from('posts').delete().eq('id', confirmPost.id)
    setPosts(prev => prev.filter(p => p.id !== confirmPost.id))
    setDeleting(null)
    setConfirmPost(null)
  }

  const handleTogglePublish = async (post) => {
    const isPublished = post.status === 'published'
    const updates = {
      status: isPublished ? 'draft' : 'published',
      published_at: isPublished ? null : new Date().toISOString()
    }
    await supabase.from('posts').update(updates).eq('id', post.id)
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, ...updates } : p))
  }

  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter)

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    featured: posts.filter(p => p.is_featured).length,
  }

  const formatDate = (str) => {
    if (!str) return '—'
    return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getFilterIcon = (f) => {
    switch (f) {
      case 'all': return <FileTextIcon />
      case 'published': return <CheckCircleIcon />
      case 'draft': return <ClockIcon />
      case 'archived': return <ArchiveIcon />
      default: return <FileTextIcon />
    }
  }

  const getStatIcon = (key) => {
    switch (key) {
      case 'total': return <FileTextIcon />
      case 'published': return <CheckCircleIcon />
      case 'draft': return <ClockIcon />
      case 'featured': return <StarIcon />
      default: return <FileTextIcon />
    }
  }

  return (
    <div className="dashboard">
      <style>{styles}</style>

      <div className="dashboard-header">
        <h1>Posts</h1>
        <button className="dashboard-new-btn" onClick={() => navigate('/admin/new')}>
          <PlusIcon />
          New Post
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        {[
          { key: 'total', label: 'Total Posts' },
          { key: 'published', label: 'Published' },
          { key: 'draft', label: 'Drafts' },
          { key: 'featured', label: 'Featured' },
        ].map(({ key, label }) => (
          <div className="stat-card" key={key}>
            <div className="stat-card-header">
              {getStatIcon(key)}
              {label}
            </div>
            <div className="stat-card-value">{stats[key]}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="dashboard-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`dashboard-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {getFilterIcon(f)}
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="dashboard-loading">
          <SpinnerIcon />
          Loading posts...
        </div>
      ) : filtered.length === 0 ? (
        <div className="posts-table-wrap">
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon"><EmptyIcon /></div>
            <h3>No {filter === 'all' ? '' : filter} posts yet</h3>
            <p>Get started by creating your first post to share with your audience.</p>
            <button className="dashboard-new-btn" onClick={() => navigate('/admin/new')}>
              <PlusIcon />
              Create Post
            </button>
          </div>
        </div>
      ) : (
        <div className="posts-table-wrap">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Section</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id}>
                  <td>
                    <div className="post-title-cell">
                      {post.title || 'Untitled'}
                      <p>/{post.slug}</p>
                    </div>
                  </td>
                  <td>
                    <span className="section-badge">
                      {post.sections?.[0] || '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${post.status}`}>
                      {post.status === 'published' && <CheckCircleIcon />}
                      {post.status === 'draft' && <ClockIcon />}
                      {post.status === 'archived' && <ArchiveIcon />}
                      {post.status}
                    </span>
                  </td>
                  <td>{formatDate(post.published_at || post.created_at)}</td>
                  <td>
                    <div className="post-actions">
                      <button
                        className="action-btn"
                        onClick={() => navigate(`/admin/edit/${post.id}`)}
                      >
                        <EditIcon />
                        Edit
                      </button>
                      <button
                        className={`action-btn ${post.status === 'published' ? 'unpublish' : 'publish'}`}
                        onClick={() => handleTogglePublish(post)}
                      >
                        {post.status === 'published' ? <EyeOffIcon /> : <EyeIcon />}
                        {post.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => setConfirmPost(post)}
                        disabled={deleting === post.id}
                      >
                        {deleting === post.id ? <SpinnerIcon /> : <TrashIcon />}
                        {deleting === post.id ? 'Deleting…' : 'Delete'}
                      </button>

                      {confirmPost && (
                        <div className="delete-modal-backdrop" onClick={() => setConfirmPost(null)}>
                          <div className="delete-modal" onClick={e => e.stopPropagation()}>
                            <div className="delete-modal-icon">
                              <TrashIcon />
                            </div>
                            <h3>Delete post</h3>
                            <p>
                              Are you sure you want to delete{' '}
                              <strong>"{confirmPost.title || 'Untitled'}"</strong>?
                              This action cannot be undone.
                            </p>
                            <div className="delete-modal-actions">
                              <button
                                className="delete-modal-cancel"
                                onClick={() => setConfirmPost(null)}
                              >
                                Cancel
                              </button>
                              <button
                                className="delete-modal-confirm"
                                onClick={handleDelete}
                                disabled={!!deleting}
                              >
                                {deleting ? <SpinnerIcon /> : <TrashIcon />}
                                {deleting ? 'Deleting…' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}