// frontend/src/pages/AdminPage.js
import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminPage = () => {
  const [users, setUsers]   = useState([]);
  const [posts, setPosts]   = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab]       = useState('users');
  const [loading, setLoading] = useState(true);
  const [toast, setToast]   = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  // confirmAction = { type: 'deactivate'|'activate'|'remove', id, label }

  useEffect(() => {
    Promise.all([
      API.get('/admin/users'),
      API.get('/admin/posts'),
    ]).then(([uRes, pRes]) => {
      setUsers(uRes.data);
      setPosts(pRes.data);
    }).catch((err) => {
      console.error('Error fetching users/posts:', err);
      showToast('Failed to load some data. Please refresh.');
    }).finally(() => setLoading(false));

    // Fetch messages separately
    API.get('/contact').then((mRes) => {
      setMessages(mRes.data);
    }).catch((err) => {
      console.error('Error fetching messages:', err);
      // Don't show toast for messages, as they might not be critical
    });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, id } = confirmAction;
    try {
      if (type === 'toggleStatus') {
        const { data } = await API.put(`/admin/users/${id}/status`);
        setUsers(users.map(u => u._id === id ? data.user : u));
        showToast(`User ${data.user.status === 'active' ? 'activated' : 'deactivated'} successfully.`);
      } else if (type === 'removePost') {
        await API.put(`/admin/posts/${id}/remove`);
        setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
        showToast('Post removed successfully.');
      } else if (type === 'markRead') {
        await API.put(`/contact/${id}/read`);
        setMessages(messages.map(m => m._id === id ? { ...m, status: 'read' } : m));
        showToast('Message marked as read.');
      } else if (type === 'deleteMessage') {
        await API.delete(`/contact/${id}`);
        setMessages(messages.filter(m => m._id !== id));
        showToast('Message deleted successfully.');
      }
    } catch {
      showToast('Action failed. Please try again.');
    } finally {
      setConfirmAction(null);
    }
  };

  const activeUsers   = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const removedPosts   = posts.filter(p => p.status === 'removed').length;
  const unreadMessages = messages.filter(m => m.status === 'unread').length;

  return (
    <section className='admin-section'>

      {/* ── Heading ── */}
      <h2 className='heading'>Admin <span>Dashboard</span></h2>

      {/* ── Stats cards ── */}
      <div className='admin-stats'>
        <div className='admin-stat-card'>
          <span className='stat-number'>{users.length}</span>
          <span className='stat-label'>Total Members</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-number' style={{ color: '#2ecc71' }}>{activeUsers}</span>
          <span className='stat-label'>Active</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-number' style={{ color: '#e74c3c' }}>{inactiveUsers}</span>
          <span className='stat-label'>Inactive</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-number'>{posts.length}</span>
          <span className='stat-label'>Total Posts</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-number' style={{ color: '#2ecc71' }}>{publishedPosts}</span>
          <span className='stat-label'>Published</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-number' style={{ color: '#e74c3c' }}>{removedPosts}</span>
          <span className='stat-label'>Removed</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-number'>{messages.length}</span>
          <span className='stat-label'>Total Messages</span>
        </div>
        <div className='admin-stat-card'>
          <span className='stat-number' style={{ color: '#e74c3c' }}>{unreadMessages}</span>
          <span className='stat-label'>Unread</span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className='admin-tabs'>
        <button
          className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
          onClick={() => setTab('users')}
        >
          👥 Members ({users.length})
        </button>
        <button
          className={`admin-tab ${tab === 'posts' ? 'active' : ''}`}
          onClick={() => setTab('posts')}
        >
          📝 All Posts ({posts.length})
        </button>
        <button
          className={`admin-tab ${tab === 'messages' ? 'active' : ''}`}
          onClick={() => setTab('messages')}
        >
          💬 Messages ({messages.length})
        </button>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <p style={{ fontSize: '1.6rem', textAlign: 'center', marginTop: '4rem' }}>
          Loading...
        </p>
      ) : (
        <div className='admin-table-wrap'>

          {/* ── Users tab ── */}
          {tab === 'users' && (
            users.length === 0 ? (
              <p style={{ fontSize: '1.6rem', textAlign: 'center', padding: '4rem' }}>
                No members found.
              </p>
            ) : (
              <table className='admin-table'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id}>
                      <td style={{ color: 'var(--ft-color)' }}>{i + 1}</td>
                      <td>
                        <div className='admin-user-info'>
                          <div className='admin-avatar'>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--ft-color)' }}>{u.email}</td>
                      <td style={{ color: 'var(--ft-color)' }}>
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      <td>
                        <span className={`admin-badge ${u.status}`}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                          <button
                            className='admin-action-btn'
                            style={{ background: 'var(--main-color)', color: 'var(--bg-color)' }}
                            onClick={() => setSelectedUser(u)}
                          >
                            View
                          </button>
                          <button
                            className={`admin-action-btn ${u.status === 'active' ? 'danger' : 'success'}`}
                            onClick={() => setConfirmAction({
                              type: 'toggleStatus',
                              id: u._id,
                              label: u.status === 'active'
                                ? `Deactivate "${u.name}"?`
                                : `Activate "${u.name}"?`,
                              desc: u.status === 'active'
                                ? 'This user will no longer be able to log in.'
                                : 'This user will be able to log in again.',
                              btnLabel: u.status === 'active' ? 'Yes, Deactivate' : 'Yes, Activate',
                              btnClass: u.status === 'active' ? 'danger' : 'success',
                            })}
                          >
                            {u.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {/* ── Posts tab ── */}
          {tab === 'posts' && (
            posts.length === 0 ? (
              <p style={{ fontSize: '1.6rem', textAlign: 'center', padding: '4rem' }}>
                No posts found.
              </p>
            ) : (
              <table className='admin-table'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p, i) => (
                    <tr key={p._id}>
                      <td style={{ color: 'var(--ft-color)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{p.title}</td>
                      <td style={{ color: 'var(--ft-color)' }}>{p.author?.name || '—'}</td>
                      <td style={{ color: 'var(--ft-color)' }}>
                        {new Date(p.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      <td>
                        <span className={`admin-badge ${p.status}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                          <button
                            className='admin-action-btn'
                            style={{ background: 'var(--main-color)', color: 'var(--bg-color)' }}
                            onClick={() => setSelectedPost(p)}
                          >
                            View
                          </button>
                          {p.status === 'published' && (
                            <button
                              className='admin-action-btn danger'
                              onClick={() => setConfirmAction({
                                type: 'removePost',
                                id: p._id,
                                label: `Remove "${p.title}"?`,
                                desc: 'This post will be marked as removed and hidden from the feed.',
                                btnLabel: 'Yes, Remove',
                                btnClass: 'danger',
                              })}
                            >
                              Remove
                            </button>
                          )}
                          {p.status === 'removed' && (
                            <span style={{ color: 'var(--ft-color)', fontSize: '1.3rem' }}>
                              Removed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {/* ── Messages tab ── */}
          {tab === 'messages' && (
            messages.length === 0 ? (
              <p style={{ fontSize: '1.6rem', textAlign: 'center', padding: '4rem' }}>
                No messages found.
              </p>
            ) : (
              <table className='admin-table'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m, i) => (
                    <tr key={m._id}>
                      <td style={{ color: 'var(--ft-color)' }}>{i + 1}</td>
                      <td>
                        <div className='admin-user-info'>
                          <div className='admin-avatar'>
                            {m.name?.charAt(0).toUpperCase()}
                          </div>
                          <span>{m.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--ft-color)' }}>{m.email}</td>
                      <td style={{ maxWidth: '300px', wordWrap: 'break-word' }}>{m.message}</td>
                      <td style={{ color: 'var(--ft-color)' }}>
                        {new Date(m.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      <td>
                        <span className={`admin-badge ${m.status}`}>
                          {m.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                          <button
                            className='admin-action-btn'
                            style={{ background: 'var(--main-color)', color: 'var(--bg-color)' }}
                            onClick={() => setSelectedMessage(m)}
                          >
                            View
                          </button>
                          {m.status === 'unread' && (
                            <button
                              className='admin-action-btn success'
                              onClick={() => setConfirmAction({
                                type: 'markRead',
                                id: m._id,
                                label: `Mark message from "${m.name}" as read?`,
                                desc: 'This message will be marked as read.',
                                btnLabel: 'Yes, Mark Read',
                                btnClass: 'success',
                              })}
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            className='admin-action-btn danger'
                            onClick={() => setConfirmAction({
                              type: 'deleteMessage',
                              id: m._id,
                              label: `Delete message from "${m.name}"?`,
                              desc: 'This message will be permanently deleted and cannot be recovered.',
                              btnLabel: 'Yes, Delete',
                              btnClass: 'danger',
                            })}
                          >
                            Delete
                          </button>
                          {m.status === 'read' && (
                            <span style={{ color: 'var(--ft-color)', fontSize: '1.3rem' }}>
                              Read
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      )}

      {/* ── Confirm Dialog ── */}
      {confirmAction && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setConfirmAction(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--snd-bg-color)',
              border: '1px solid rgba(89,178,244,0.2)',
              borderRadius: '1rem',
              padding: '3.5rem',
              maxWidth: '44rem',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 0 3rem rgba(89,178,244,0.15)',
            }}
          >
            <h3 style={{
              fontSize: '2.2rem', fontWeight: 700,
              marginBottom: '1rem', color: 'var(--text-color)',
              fontFamily: 'Nunito, sans-serif',
            }}>
              {confirmAction.label}
            </h3>
            <p style={{
              fontSize: '1.5rem', color: 'var(--ft-color)',
              lineHeight: 1.7, marginBottom: '3rem',
              fontFamily: 'Nunito, sans-serif',
            }}>
              {confirmAction.desc}
            </p>
            <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
              <button
                onClick={handleConfirm}
                className={`admin-action-btn ${confirmAction.btnClass}`}
                style={{ padding: '1rem 2.8rem', fontSize: '1.5rem', borderRadius: '4rem' }}
              >
                {confirmAction.btnLabel}
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                style={{
                  padding: '1rem 2.8rem',
                  background: 'transparent',
                  color: 'var(--text-color)',
                  border: '1px solid rgba(89,178,244,0.3)',
                  borderRadius: '4rem',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  transition: '.3s ease',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Post Modal ── */}
      {selectedPost && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setSelectedPost(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--snd-bg-color)',
              border: '1px solid rgba(89,178,244,0.2)',
              borderRadius: '1rem',
              padding: '3.5rem',
              maxWidth: '80rem',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 0 3rem rgba(89,178,244,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '2.2rem', fontWeight: 700,
                color: 'var(--text-color)',
                fontFamily: 'Nunito, sans-serif',
              }}>
                {selectedPost.title}
              </h3>
              <button
                onClick={() => setSelectedPost(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '2rem',
                  color: 'var(--ft-color)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <strong style={{ color: 'var(--text-color)' }}>Author:</strong> {selectedPost.author?.name || 'Unknown'}
                </div>
                <div>
                  <strong style={{ color: 'var(--text-color)' }}>Email:</strong> {selectedPost.author?.email || 'N/A'}
                </div>
                <div>
                  <strong style={{ color: 'var(--text-color)' }}>Date:</strong> {new Date(selectedPost.createdAt).toLocaleString()}
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-color)' }}>Status:</strong>
                <span className={`admin-badge ${selectedPost.status}`} style={{ marginLeft: '0.5rem' }}>
                  {selectedPost.status}
                </span>
              </div>
              {selectedPost.image && (
                <div style={{ marginBottom: '2rem' }}>
                  <strong style={{ color: 'var(--text-color)' }}>Image:</strong>
                  <div style={{ marginTop: '1rem' }}>
                    <img
<<<<<<< HEAD
                        src={`http://localhost:5000/uploads/${selectedPost.image}`}
                        alt="Post"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '300px',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(89,178,244,0.1)',
                        }}
                      />
=======
                      src={`http://localhost:5000/uploads/${selectedPost.image}`}
                      alt="Post"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(89,178,244,0.1)',
                      }}
                    />
>>>>>>> 178bdad95aed9813738c8def17d4a52f4de1dc66
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <h4 style={{
                fontSize: '1.8rem', fontWeight: 600,
                color: 'var(--text-color)',
                marginBottom: '1rem',
                fontFamily: 'Nunito, sans-serif',
              }}>
                Content:
              </h4>
              <div style={{
                background: 'var(--bg-color)',
                border: '1px solid rgba(89,178,244,0.1)',
                borderRadius: '0.5rem',
                padding: '2rem',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                fontSize: '1.5rem',
                lineHeight: 1.6,
                color: 'var(--text-color)',
                fontFamily: 'Nunito, sans-serif',
              }}>
                {selectedPost.body}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'flex-end' }}>
              {selectedPost.status === 'published' && (
                <button
                  onClick={() => {
                    setConfirmAction({
                      type: 'removePost',
                      id: selectedPost._id,
                      label: `Remove "${selectedPost.title}"?`,
                      desc: 'This post will be marked as removed and hidden from the feed.',
                      btnLabel: 'Yes, Remove',
                      btnClass: 'danger',
                    });
                    setSelectedPost(null);
                  }}
                  className={`admin-action-btn danger`}
                  style={{ padding: '1rem 2.8rem', fontSize: '1.5rem', borderRadius: '4rem' }}
                >
                  Remove Post
                </button>
              )}
              <button
                onClick={() => setSelectedPost(null)}
                style={{
                  padding: '1rem 2.8rem',
                  background: 'transparent',
                  color: 'var(--text-color)',
                  border: '1px solid rgba(89,178,244,0.3)',
                  borderRadius: '4rem',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  transition: '.3s ease',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Message Modal ── */}
      {selectedMessage && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setSelectedMessage(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--snd-bg-color)',
              border: '1px solid rgba(89,178,244,0.2)',
              borderRadius: '1rem',
              padding: '3.5rem',
              maxWidth: '60rem',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 0 3rem rgba(89,178,244,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '2.2rem', fontWeight: 700,
                color: 'var(--text-color)',
                fontFamily: 'Nunito, sans-serif',
              }}>
                Message from {selectedMessage.name}
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '2rem',
                  color: 'var(--ft-color)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                <div>
                  <strong style={{ color: 'var(--text-color)' }}>From:</strong> {selectedMessage.name}
                </div>
                <div>
                  <strong style={{ color: 'var(--text-color)' }}>Email:</strong> {selectedMessage.email}
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-color)' }}>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-color)' }}>Status:</strong>
                <span className={`admin-badge ${selectedMessage.status}`} style={{ marginLeft: '0.5rem' }}>
                  {selectedMessage.status}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <h4 style={{
                fontSize: '1.8rem', fontWeight: 600,
                color: 'var(--text-color)',
                marginBottom: '1rem',
                fontFamily: 'Nunito, sans-serif',
              }}>
                Message:
              </h4>
              <div style={{
                background: 'var(--bg-color)',
                border: '1px solid rgba(89,178,244,0.1)',
                borderRadius: '0.5rem',
                padding: '2rem',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                fontSize: '1.5rem',
                lineHeight: 1.6,
                color: 'var(--text-color)',
                fontFamily: 'Nunito, sans-serif',
              }}>
                {selectedMessage.message}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'flex-end' }}>
              {selectedMessage.status === 'unread' && (
                <button
                  onClick={() => {
                    setConfirmAction({
                      type: 'markRead',
                      id: selectedMessage._id,
                      label: `Mark message from "${selectedMessage.name}" as read?`,
                      desc: 'This message will be marked as read.',
                      btnLabel: 'Yes, Mark Read',
                      btnClass: 'success',
                    });
                    setSelectedMessage(null);
                  }}
                  className={`admin-action-btn success`}
                  style={{ padding: '1rem 2.8rem', fontSize: '1.5rem', borderRadius: '4rem' }}
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => {
                  setConfirmAction({
                    type: 'deleteMessage',
                    id: selectedMessage._id,
                    label: `Delete message from "${selectedMessage.name}"?`,
                    desc: 'This message will be permanently deleted and cannot be recovered.',
                    btnLabel: 'Yes, Delete',
                    btnClass: 'danger',
                  });
                  setSelectedMessage(null);
                }}
                className={`admin-action-btn danger`}
                style={{ padding: '1rem 2.8rem', fontSize: '1.5rem', borderRadius: '4rem' }}
              >
                Delete Message
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                style={{
                  padding: '1rem 2.8rem',
                  background: 'transparent',
                  color: 'var(--text-color)',
                  border: '1px solid rgba(89,178,244,0.3)',
                  borderRadius: '4rem',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  transition: '.3s ease',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── User Modal ── */}
      {selectedUser && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--snd-bg-color)',
              border: '1px solid rgba(89,178,244,0.2)',
              borderRadius: '1rem',
              padding: '3.5rem',
              maxWidth: '60rem',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 0 3rem rgba(89,178,244,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '2.2rem', fontWeight: 700,
                color: 'var(--text-color)',
                fontFamily: 'Nunito, sans-serif',
              }}>
                {selectedUser.name}
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '2rem',
                  color: 'var(--ft-color)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <div className='admin-avatar' style={{ width: '80px', height: '80px', fontSize: '3rem' }}>
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: 'var(--text-color)' }}>Email:</strong> {selectedUser.email}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: 'var(--text-color)' }}>Username:</strong> {selectedUser.username || 'N/A'}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: 'var(--text-color)' }}>Role:</strong> {selectedUser.role || 'User'}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-color)' }}>Joined Date:</strong> {new Date(selectedUser.createdAt).toLocaleString()}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-color)' }}>Status:</strong>
                <span className={`admin-badge ${selectedUser.status}`} style={{ marginLeft: '0.5rem' }}>
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setConfirmAction({
                    type: 'toggleStatus',
                    id: selectedUser._id,
                    label: selectedUser.status === 'active'
                      ? `Deactivate "${selectedUser.name}"?`
                      : `Activate "${selectedUser.name}"?`,
                    desc: selectedUser.status === 'active'
                      ? 'This user will no longer be able to log in.'
                      : 'This user will be able to log in again.',
                    btnLabel: selectedUser.status === 'active' ? 'Yes, Deactivate' : 'Yes, Activate',
                    btnClass: selectedUser.status === 'active' ? 'danger' : 'success',
                  });
                  setSelectedUser(null);
                }}
                className={`admin-action-btn ${selectedUser.status === 'active' ? 'danger' : 'success'}`}
                style={{ padding: '1rem 2.8rem', fontSize: '1.5rem', borderRadius: '4rem' }}
              >
                {selectedUser.status === 'active' ? 'Deactivate User' : 'Activate User'}
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  padding: '1rem 2.8rem',
                  background: 'transparent',
                  color: 'var(--text-color)',
                  border: '1px solid rgba(89,178,244,0.3)',
                  borderRadius: '4rem',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  transition: '.3s ease',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '3rem', left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--main-color)', color: 'var(--bg-color)',
          padding: '1rem 3rem', borderRadius: '999px',
          fontSize: '1.5rem', fontWeight: 600,
          zIndex: 1000, boxShadow: '0 0 1.5rem var(--main-color)',
          fontFamily: 'Nunito, sans-serif',
        }}>
          {toast}
        </div>
      )}

    </section>
  );
};

export default AdminPage;
