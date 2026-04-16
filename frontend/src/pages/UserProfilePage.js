// frontend/src/pages/UserProfilePage.js
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get(`/auth/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('User not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <section className='profile-section'>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ fontSize: '1.6rem' }}>Loading profile...</p>
        </div>
      </section>
    );
  }

  if (error || !user) {
    return (
      <section className='profile-section'>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ fontSize: '1.6rem', color: '#e74c3c', marginBottom: '2rem' }}>
            {error}
          </p>
          <Link to='/feed' style={{ color: '#59B2f4', textDecoration: 'underline', fontSize: '1.4rem' }}>
            ← Back to feed
          </Link>
        </div>
      </section>
    );
  }

  const picSrc = user?.profilePic ? `${BASE_URL}/uploads/${user.profilePic}` : null;

  return (
    <section className='profile-section'>

      {/* ── Back button ── */}
      <Link to='/feed' style={{
        color: '#59B2f4',
        textDecoration: 'underline',
        fontSize: '1.4rem',
        marginBottom: '2rem',
        display: 'inline-block'
      }}>
        ← Back to feed
      </Link>

      {/* ── Page heading ── */}
      <h2 className='heading'>{user.name}'s <span>Profile</span></h2>

      <div className='profile-grid'>

        {/* ── LEFT: Avatar + info ── */}
        <div className='profile-card'>
          <div className='profile-avatar-wrap'>
            {picSrc
              ? <img src={picSrc} alt='Profile' className='profile-avatar' />
              : (
                <div className='profile-avatar-placeholder'>
                  {user?.name?.charAt(0).toUpperCase() || '?'}
                </div>
              )
            }
          </div>
          <h3 className='profile-name'>{user?.name}</h3>
          <p className='profile-email'>{user?.email}</p>
          <span className={`profile-role-badge ${user?.role}`}>
            {user?.role}
          </span>
          {user?.bio && <p className='profile-bio'>{user.bio}</p>}
        </div>

        {/* ── RIGHT: Read-only info ── */}
        <div className='profile-forms'>
          <div className='profile-form-box'>
            <h3>About <span>{user.name}</span></h3>
            <div style={{ padding: '2rem 0' }}>
              {user?.bio ? (
                <p style={{ fontSize: '1.4rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {user.bio}
                </p>
              ) : (
                <p style={{ fontSize: '1.4rem', color: 'var(--ft-color)', fontStyle: 'italic' }}>
                  No bio yet
                </p>
              )}
              <p style={{ fontSize: '1.3rem', color: 'var(--ft-color)', marginTop: '1.5rem' }}>
                <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfilePage;
