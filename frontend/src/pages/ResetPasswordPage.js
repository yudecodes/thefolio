import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';

// Eye icons
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 5) {
      setError('Password must be at least 5 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(response.data.message);
      setPasswordReset(true);
      setNewPassword('');
      setConfirmPassword('');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <h2 className="heading">Reset Your <span>Password</span></h2>

        {error && <p className="login-error">{error}</p>}
        {message && <p style={{ color: '#1ecc71', marginBottom: '1rem', textAlign: 'center', fontSize: '1.4rem' }}>{message}</p>}

        {!passwordReset ? (
          <form onSubmit={handleSubmit} className="login-form">
            {/* ── New Password ── */}
            <div className="form-group">
              <label>New Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ paddingRight: '4.5rem', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '1.2rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-color, #888)',
                    padding: '.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '.4rem',
                    transition: '.3s ease',
                    opacity: showPassword ? 1 : 0.6,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = 'rgba(89,178,244,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = showPassword ? 1 : 0.6; e.currentTarget.style.background = 'transparent'; }}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* ── Confirm Password ── */}
            <div className="form-group">
              <label>Confirm Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ paddingRight: '4.5rem', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '1.2rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-color, #888)',
                    padding: '.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '.4rem',
                    transition: '.3s ease',
                    opacity: showConfirmPassword ? 1 : 0.6,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = 'rgba(89,178,244,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = showConfirmPassword ? 1 : 0.6; e.currentTarget.style.background = 'transparent'; }}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn"
              style={{ width: '100%', marginTop: '2rem' }}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', color: '#1ecc71', fontSize: '1.4rem' }}>
            <p style={{ marginBottom: '1rem' }}>✓ Password reset successfully!</p>
            <p style={{ marginBottom: '1rem' }}>Please login with your new password.</p>
            <p style={{ fontSize: '1.3rem', color: 'var(--ft-color)', marginTop: '2rem' }}>
              Redirecting to login...
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ fontSize: '1.4rem' }}>
            <Link to="/login" style={{ color: 'var(--main-color)', textDecoration: 'none', fontWeight: '600', transition: '.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-color)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--main-color)'; }}>Back to Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
