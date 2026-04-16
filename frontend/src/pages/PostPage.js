import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [toast, setToast] = useState('');

  // Fetch post and comments
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postRes = await API.get(`/posts/${id}`);
        setPost(postRes.data);

        const commentsRes = await API.get(`/posts/${id}/comments`);
        setComments(commentsRes.data);
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError('Post not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const res = await API.post(`/posts/${id}/comments`, { body: commentText.trim() });
      setComments(prev => [...prev, res.data]);
      setCommentText('');
      showToast('Comment posted!');
    } catch {
      showToast('Failed to post comment.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await API.delete(`/posts/${id}/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
      showToast('Comment deleted.');
    } catch {
      showToast('Failed to delete comment.');
    }
  };

  if (loading) {
    return (
      <section className='post-page'>
        <div className='post-container'>
          <p style={{ fontSize: '1.6rem', textAlign: 'center' }}>Loading post...</p>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className='post-page'>
        <div className='post-container'>
          <p style={{ fontSize: '1.6rem', color: '#e74c3c', textAlign: 'center', marginBottom: '2rem' }}>
            {error}
          </p>
          <Link to='/' style={{ color: '#59B2f4', textDecoration: 'underline', fontSize: '1.4rem' }}>
            ← Back to posts
          </Link>
        </div>
      </section>
    );
  }

  const isAuthor = user && (user._id === post.author?._id || user.role === 'admin');

  return (
    <section className='post-page'>
      <div className='post-container'>
        {/* Back button */}
        <Link to='/' style={{
          color: '#59B2f4',
          textDecoration: 'underline',
          fontSize: '1.4rem',
          marginBottom: '2rem',
          display: 'inline-block'
        }}>
          ← Back to posts
        </Link>

        {/* Post header */}
        <article className='post-full'>
          {post.image && (
            <img
              src={`${BASE_URL}/uploads/${post.image}`}
              alt={post.title}
              className='post-full-img'
            />
          )}

          <div className='post-full-header'>
            <h1 className='post-full-title'>{post.title}</h1>
            <div className='post-full-meta'>
              <span>By <Link to={`/profile/users/${post.author?._id}`} style={{ color: '#59B2f4', textDecoration: 'none', cursor: 'pointer' }}><strong>{post.author?.name}</strong></Link></span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Post body */}
          <div className='post-full-body'>
            <p>{post.body}</p>
          </div>

          {/* Edit/Delete buttons for author */}
          {isAuthor && (
            <div className='post-full-actions'>
              <Link to={`/edit-post/${post._id}`} className='btn' style={{
                padding: '1rem 2rem',
                fontSize: '1.4rem',
                textDecoration: 'none',
                display: 'inline-block'
              }}>
                ✏️ Edit
              </Link>
            </div>
          )}
        </article>

        {/* Comments section */}
        <section className='post-comments-section'>
          <h2>Comments ({comments.length})</h2>

          {/* Comment form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className='comment-form'>
              <textarea
                placeholder='Share your thoughts…'
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '1.2rem 1.5rem',
                  fontSize: '1.4rem',
                  background: 'var(--snd-bg-color)',
                  color: 'var(--text-color)',
                  border: '1px solid rgba(89, 178, 244, 0.2)',
                  borderRadius: '0.8rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  transition: '0.3s ease'
                }}
                onFocus={e => e.target.style.boxShadow = '0 0 1rem rgba(89, 178, 244, 0.3)'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
              <button
                type='submit'
                className='btn'
                disabled={commentLoading || !commentText.trim()}
                style={{ marginTop: '1rem' }}
              >
                {commentLoading ? 'Posting…' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p style={{ fontSize: '1.4rem', color: 'var(--ft-color)', padding: '2rem', textAlign: 'center' }}>
              <Link to='/login' style={{ color: '#59B2f4', fontWeight: 700 }}>Log in</Link> to comment.
            </p>
          )}

          {/* Comments list */}
          {comments.length === 0 ? (
            <p style={{
              fontSize: '1.4rem',
              color: 'var(--ft-color)',
              textAlign: 'center',
              padding: '2rem',
              fontStyle: 'italic'
            }}>
              No comments yet. Be the first!
            </p>
          ) : (
            <div className='comments-list'>
              {comments.map(comment => (
                <div key={comment._id} className='comment'>
                  <div className='comment-header'>
                    <strong style={{ color: 'var(--main-color)', fontSize: '1.3rem' }}>
                      {comment.author ? (
                        <Link to={`/profile/users/${comment.author._id}`} style={{ color: 'var(--main-color)', textDecoration: 'none', cursor: 'pointer' }}>
                          {comment.author.name}
                        </Link>
                      ) : 'Anonymous'}
                    </strong>
                    <span style={{ color: 'var(--ft-color)', fontSize: '1.1rem' }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className='comment-body'>{comment.body}</p>
                  {user && (user._id === comment.author?._id || user.role === 'admin') && (
                    <button
                      onClick={() => handleCommentDelete(comment._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#e74c3c',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        padding: 0,
                        fontWeight: 500,
                        transition: '0.2s'
                      }}
                      onMouseEnter={e => e.target.style.opacity = 0.7}
                      onMouseLeave={e => e.target.style.opacity = 1}
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Toast */}
      {toast && <div className='feed-toast'>{toast}</div>}
    </section>
  );
};

export default PostPage;
