// frontend/src/pages/HomePage.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const HomePage = () => {
  const { user } = useAuth();

  const [posts, setPosts]               = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState('');

  // Modal
  const [showModal, setShowModal]       = useState(false);
  const [editingPost, setEditingPost]   = useState(null);
  const [form, setForm]                 = useState({ title: '', body: '' });
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving]             = useState(false);
  const [formError, setFormError]       = useState('');

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Toast
  const [toast, setToast] = useState('');

  // ── Comments ─────────────────────────────────────────────────
  // commentsByPost: { [postId]: { list: [], loading: false, open: false, text: '' } }
  const [commentsByPost, setCommentsByPost] = useState({});

  // ── Fetch posts ──────────────────────────────────────────────
  useEffect(() => {
    API.get('/posts')
      .then(res => { setPosts(res.data); setFiltered(res.data); })
      .catch(err => {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Search filter ────────────────────────────────────────────
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? posts.filter(p =>
            p.title?.toLowerCase().includes(q) ||
            p.body?.toLowerCase().includes(q) ||
            p.author?.name?.toLowerCase().includes(q)
          )
        : posts
    );
  }, [search, posts]);

  // ── Toast helper ─────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ── Open create modal ────────────────────────────────────────
  const openCreate = () => {
    setEditingPost(null);
    setForm({ title: '', body: '' });
    setImageFile(null);
    setImagePreview(null);
    setFormError('');
    setShowModal(true);
  };

  // ── Open edit modal ──────────────────────────────────────────
  const openEdit = (post) => {
    setEditingPost(post);
    setForm({ title: post.title, body: post.body });
    setImageFile(null);
    setImagePreview(post.image ? `${BASE_URL}/uploads/${post.image}` : null);
    setFormError('');
    setShowModal(true);
  };

  // ── Close modal ──────────────────────────────────────────────
  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setForm({ title: '', body: '' });
    setImageFile(null);
    setImagePreview(null);
    setFormError('');
  };

  // ── Handle image pick ────────────────────────────────────────
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── Save (create or edit) ────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      setFormError('Title and content are both required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('body', form.body);
      if (imageFile) payload.append('image', imageFile);

      if (editingPost) {
        const res = await API.put(`/posts/${editingPost._id}`, payload);
        setPosts(prev => prev.map(p => p._id === editingPost._id ? res.data : p));
        showToast('Post updated!');
      } else {
        const res = await API.post('/posts', payload);
        setPosts(prev => [res.data, ...prev]);
        showToast('Post published!');
      }
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await API.delete(`/posts/${id}`);
      setPosts(prev => prev.filter(p => p._id !== id));
      showToast('Post deleted.');
    } catch {
      showToast('Failed to delete post.');
    } finally {
      setConfirmDelete(null);
    }
  };

  // ── Comments: toggle open & lazy-load ────────────────────────
  const toggleComments = async (postId) => {
    // If already open, just close it
    const current = commentsByPost[postId];
    if (current?.open) {
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: { ...prev[postId], open: false },
      }));
      return;
    }

    // Open and fetch if not loaded yet
    setCommentsByPost(prev => ({
      ...prev,
      [postId]: { list: current?.list || [], loading: !current?.list?.length, open: true, text: current?.text || '' },
    }));

    if (!current?.list?.length) {
      try {
        const res = await API.get(`/posts/${postId}/comments`);
        setCommentsByPost(prev => ({
          ...prev,
          [postId]: { ...prev[postId], list: res.data, loading: false },
        }));
      } catch {
        setCommentsByPost(prev => ({
          ...prev,
          [postId]: { ...prev[postId], loading: false },
        }));
        showToast('Failed to load comments.');
      }
    }
  };

  // ── Comments: update text input ──────────────────────────────
  const setCommentText = (postId, text) => {
    setCommentsByPost(prev => ({
      ...prev,
      [postId]: { ...prev[postId], text },
    }));
  };

  // ── Comments: submit ─────────────────────────────────────────
  const handleCommentSubmit = async (postId) => {
    const text = commentsByPost[postId]?.text?.trim();
    if (!text) return;

    try {
      const res = await API.post(`/posts/${postId}/comments`, { body: text });
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          list: [...(prev[postId]?.list || []), res.data],
          text: '',
        },
      }));
    } catch {
      showToast('Failed to post comment.');
    }
  };

  // ── Comments: delete ─────────────────────────────────────────
  const handleCommentDelete = async (postId, commentId) => {
    try {
      await API.delete(`/posts/${postId}/comments/${commentId}`);
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          list: prev[postId].list.filter(c => c._id !== commentId),
        },
      }));
    } catch {
      showToast('Failed to delete comment.');
    }
  };

  if (loading) return (
    <section>
      <p style={{ fontSize: '1.6rem', textAlign: 'center' }}>Loading posts...</p>
    </section>
  );

  if (error) return (
    <section>
      <p style={{ fontSize: '1.6rem', color: '#e74c3c', textAlign: 'center' }}>{error}</p>
    </section>
  );

  return (
    <section className='home-page'>

      {/* ── Top bar ── */}
      <div className='feed-header'>
        <h2 className='heading'>Latest <span>Posts</span></h2>
        <div className='feed-controls'>
          <input
            className='feed-search'
            type='text'
            placeholder='Search posts…'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className='btn' onClick={openCreate}>+ New Post</button>
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <p style={{ fontSize: '1.6rem', textAlign: 'center', marginTop: '4rem' }}>
          {search ? `No results for "${search}"` : 'No posts yet. Be the first to write one!'}
        </p>
      ) : (
        <div className='posts-grid'>
          {filtered.map(post => {
            // Always destructure with safe defaults so unvisited posts
            // never accidentally mirror the state of an opened post.
            const cs = {
              open: false,
              loading: false,
              list: [],
              text: '',
              ...commentsByPost[post._id],   // override only what's been set
            };

            return (
              <div key={post._id} className='post-card'>
                {post.image && (
                  <img
                    src={`${BASE_URL}/uploads/${post.image}`}
                    alt={post.title}
                    className='post-card-img'
                  />
                )}
                <div className='post-card-body'>
                  <h3 className='post-card-title'>
                    <Link to={`/posts/${post._id}`}>{post.title}</Link>
                  </h3>
                  <p className='post-card-excerpt'>{post.body?.substring(0, 120)}...</p>
                  <small className='post-card-meta'>
                    By <span className='post-author-name'>{post.author?.name}</span> · {new Date(post.createdAt).toLocaleDateString()}
                  </small>

                  {/* Edit/Delete only for author or admin */}
                  {user && (user._id === post.author?._id || user.role === 'admin') && (
                    <div className='post-card-actions'>
                      <button className='post-btn-edit' onClick={() => openEdit(post)}>
                        ✏️ Edit
                      </button>
                      <button className='post-btn-delete' onClick={() => setConfirmDelete(post)}>
                        🗑 Delete
                      </button>
                    </div>
                  )}

                  {/* ── Comment toggle button ── */}
                  <button
                    className='post-btn-comments'
                    onClick={() => toggleComments(post._id)}
                    style={{
                      marginTop: '.4rem',
                      width: '100%',
                      padding: '.9rem',
                      background: cs.open ? 'rgba(89,178,244,0.12)' : 'rgba(89,178,244,0.06)',
                      border: '1px solid rgba(89,178,244,0.25)',
                      borderRadius: '.6rem',
                      color: 'var(--main-color)',
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      fontFamily: 'Nunito, sans-serif',
                      cursor: 'pointer',
                      transition: '.3s ease',
                      letterSpacing: '.03rem',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(89,178,244,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = cs.open ? 'rgba(89,178,244,0.12)' : 'rgba(89,178,244,0.06)'}
                  >
                    💬 {cs.open ? 'Hide Comments' : `Comments${cs.list.length ? ` (${cs.list.length})` : ''}`}
                  </button>

                  {/* ── Comments section — only renders when explicitly opened ── */}
                  {cs.open && (
                    <div className='post-comments' style={{
                      marginTop: '1.2rem',
                      borderTop: '1px solid rgba(89,178,244,0.15)',
                      paddingTop: '1.2rem',
                    }}>

                      {/* Comment list */}
                      {cs.loading ? (
                        <p style={{ fontSize: '1.4rem', color: 'var(--ft-color)', textAlign: 'center', padding: '1rem 0' }}>
                          Loading comments…
                        </p>
                      ) : cs.list.length === 0 ? (
                        <p style={{
                          fontSize: '1.35rem',
                          color: 'var(--ft-color)',
                          textAlign: 'center',
                          padding: '1rem 0',
                          fontStyle: 'italic',
                        }}>
                          No comments yet. Be the first!
                        </p>
                      ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.2rem 0' }}>
                          {cs.list.map(comment => (
                            <li
                              key={comment._id}
                              style={{
                                padding: '1rem 1.2rem',
                                marginBottom: '.8rem',
                                background: 'var(--snd-bg-color)',
                                borderRadius: '.8rem',
                                fontSize: '1.4rem',
                                borderLeft: '3px solid rgba(89,178,244,0.35)',
                                transition: '.3s ease',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', marginBottom: '.4rem' }}>
                                    {/* Avatar circle */}
                                    <div style={{
                                      width: '2.8rem',
                                      height: '2.8rem',
                                      borderRadius: '50%',
                                      background: 'var(--main-color)',
                                      color: 'var(--bg-color)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '1.2rem',
                                      fontWeight: 700,
                                      flexShrink: 0,
                                    }}>
                                      {(comment.author?.name || 'A')[0].toUpperCase()}
                                    </div>
                                    <span style={{ fontWeight: 700, color: 'var(--main-color)', fontSize: '1.35rem' }}>
                                      {comment.author?.name || 'Anonymous'}
                                    </span>
                                    <span style={{ color: 'var(--ft-color)', fontSize: '1.15rem' }}>
                                      · {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p style={{ margin: '0 0 0 3.6rem', color: 'var(--text-color)', lineHeight: 1.6 }}>
                                    {comment.body}
                                  </p>
                                </div>

                                {/* Delete comment — only for comment author or admin */}
                                {user && (user._id === comment.author?._id || user.role === 'admin') && (
                                  <button
                                    onClick={() => handleCommentDelete(post._id, comment._id)}
                                    title='Delete comment'
                                    style={{
                                      background: 'rgba(231,76,60,0.1)',
                                      border: '1px solid rgba(231,76,60,0.25)',
                                      borderRadius: '.5rem',
                                      cursor: 'pointer',
                                      color: '#e74c3c',
                                      fontSize: '1.1rem',
                                      padding: '.3rem .7rem',
                                      marginLeft: '1rem',
                                      flexShrink: 0,
                                      fontFamily: 'Nunito, sans-serif',
                                      transition: '.3s ease',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#e74c3c'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(231,76,60,0.1)'; e.currentTarget.style.color = '#e74c3c'; }}
                                  >
                                    🗑
                                  </button>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Comment input — only for logged-in users */}
                      {user ? (
                        <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center' }}>
                          <input
                            type='text'
                            placeholder='Write a comment…'
                            value={cs.text || ''}
                            onChange={e => setCommentText(post._id, e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCommentSubmit(post._id)}
                            onFocus={e => e.target.style.boxShadow = '0 0 1rem var(--main-color)'}
                            onBlur={e => e.target.style.boxShadow = 'none'}
                            style={{
                              flex: 1,
                              padding: '1rem 1.4rem',
                              fontSize: '1.4rem',
                              background: 'var(--snd-bg-color)',
                              color: 'var(--text-color)',
                              border: 'none',
                              borderRadius: '.8rem',
                              outline: 'none',
                              fontFamily: 'Nunito, sans-serif',
                              transition: '.3s ease',
                            }}
                          />
                          <button
                            className='btn'
                            onClick={() => handleCommentSubmit(post._id)}
                            style={{ padding: '.9rem 2rem', fontSize: '1.4rem', whiteSpace: 'nowrap' }}
                          >
                            Post
                          </button>
                        </div>
                      ) : (
                        <p style={{
                          fontSize: '1.35rem',
                          color: 'var(--ft-color)',
                          textAlign: 'center',
                          padding: '.8rem',
                          background: 'rgba(89,178,244,0.06)',
                          borderRadius: '.6rem',
                          border: '1px solid rgba(89,178,244,0.15)',
                        }}>
                          <Link to='/login' style={{ color: 'var(--main-color)', fontWeight: 700 }}>Log in</Link> to leave a comment.
                        </p>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {showModal && (
        <div className='feed-modal-overlay' onClick={closeModal}>
          <div className='feed-modal-box' onClick={e => e.stopPropagation()}>
            <h3>{editingPost ? 'Edit Post' : 'New Post'}</h3>

            {formError && <p className='feed-modal-error'>{formError}</p>}

            <div className='form-group'>
              <label>Title *</label>
              <input
                type='text'
                placeholder='Post title…'
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className='form-group'>
              <label>Content *</label>
              <textarea
                rows={6}
                placeholder='Write your post…'
                value={form.body}
                onChange={e => setForm({ ...form, body: e.target.value })}
                style={{
                  width: '100%', padding: '1.5rem',
                  fontSize: '1.6rem', background: 'var(--snd-bg-color)',
                  color: 'var(--text-color)', borderRadius: '.8rem',
                  resize: 'none', fontFamily: 'inherit',
                  border: 'none', outline: 'none', transition: '.3s ease'
                }}
                onFocus={e => e.target.style.boxShadow = '0 0 1rem var(--main-color)'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>

            <div className='form-group'>
              <label>Image <span style={{ fontWeight: 400, color: 'var(--ft-color)' }}>(optional)</span></label>
              <label className='feed-img-upload'>
                {imagePreview
                  ? <img src={imagePreview} alt='preview' className='feed-img-preview' />
                  : <span>+ Click to upload image</span>
                }
                <input type='file' accept='image/*' onChange={handleImage} hidden />
              </label>
            </div>

            <div className='feed-modal-actions'>
              <button className='btn' onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editingPost ? 'Save Changes' : 'Publish'}
              </button>
              <button className='feed-btn-cancel' onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Delete ── */}
      {confirmDelete && (
        <div className='feed-modal-overlay' onClick={() => setConfirmDelete(null)}>
          <div className='feed-modal-box' onClick={e => e.stopPropagation()}>
            <h3>Delete Post?</h3>
            <p style={{ fontSize: '1.6rem', margin: '2rem 0' }}>
              Are you sure you want to delete <strong>"{confirmDelete.title}"</strong>? This cannot be undone.
            </p>
            <div className='feed-modal-actions'>
              <button className='post-btn-delete' style={{ padding: '1rem 2.8rem', fontSize: '1.6rem' }}
                onClick={() => handleDelete(confirmDelete._id)}>
                Yes, Delete
              </button>
              <button className='feed-btn-cancel' onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <div className='feed-toast'>{toast}</div>}

    </section>
  );
};

export default HomePage;