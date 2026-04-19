import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState(null);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      setSubmitted(true);
      setEmail('');
      
      // Check if this is development mode with reset link
      if (response.data.isDevelopment && response.data.resetLink) {
        setResetLink(response.data.resetLink);
        setIsDevelopment(true);
      } else {
        // Redirect to login after 3 seconds in production
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resetLink);
    alert('Reset link copied to clipboard!');
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <h2 className="heading">Forgot <span>Password?</span></h2>
        
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--ft-color)', fontSize: '1.4rem', lineHeight: '1.6' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && <p className="login-error">{error}</p>}
        {message && <p style={{ color: '#1ecc71', marginBottom: '1rem', textAlign: 'center', fontSize: '1.4rem' }}>{message}</p>}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn"
              style={{ width: '100%', marginTop: '2rem' }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', color: '#1ecc71', fontSize: '1.4rem' }}>
            <p style={{ marginBottom: '1rem' }}>✓ Request processed!</p>
            <p style={{ marginBottom: '1rem' }}>
              {isDevelopment 
                ? 'Email service not configured. Use the reset link below for testing:'
                : 'Please check your email for the reset link.'}
            </p>
            
            {isDevelopment && resetLink && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--snd-bg-color)', borderRadius: '0.8rem' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--main-color)', fontWeight: '600' }}>
                  Development Mode - Reset Link:
                </p>
                <p style={{ 
                  wordBreak: 'break-all', 
                  color: 'var(--text-color)', 
                  fontSize: '1.2rem',
                  marginBottom: '1rem',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-color)',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--main-color)'
                }}>
                  {resetLink}
                </p>
                <button 
                  onClick={copyToClipboard}
                  style={{
                    padding: '0.8rem 1.6rem',
                    backgroundColor: 'var(--main-color)',
                    color: 'var(--bg-color)',
                    border: 'none',
                    borderRadius: '0.4rem',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginRight: '0.5rem',
                    transition: '.3s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 2rem var(--main-color)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Copy Link
                </button>
                <Link 
                  to={resetLink.replace(window.location.origin, '')}
                  style={{
                    display: 'inline-block',
                    padding: '0.8rem 1.6rem',
                    backgroundColor: 'var(--main-color)',
                    color: 'var(--bg-color)',
                    border: 'none',
                    borderRadius: '0.4rem',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: '.3s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 2rem var(--main-color)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Reset Password
                </Link>
              </div>
            )}
            
            {!isDevelopment && (
              <p style={{ fontSize: '1.3rem', color: 'var(--ft-color)', marginTop: '2rem' }}>
                Redirecting to login...
              </p>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ fontSize: '1.4rem' }}>
            Remember your password? <Link to="/login" style={{ color: 'var(--main-color)', textDecoration: 'none', fontWeight: '600', transition: '.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-color)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--main-color)'; }}>Back to Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
