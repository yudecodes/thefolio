// frontend/src/components/Header.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem('lightmode') === 'active';
  });

  // ── Logout confirmation state ──────────────────────────────
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add('lightmode');
      localStorage.setItem('lightmode', 'active');
    } else {
      document.body.classList.remove('lightmode');
      localStorage.setItem('lightmode', 'inactive');
    }
  }, [lightMode]);

  const handleLogoutConfirmed = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <header className="header">

        {/* Logo */}
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <span
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: lightMode ? '#191f36' : '#ffffff',
              transition: 'color .3s ease',
              cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#59B2f4'}
            onMouseLeave={e => e.currentTarget.style.color = lightMode ? '#191f36' : '#ffffff'}
          >
            Yuan
          </span>
        </Link>

        <input type="checkbox" id="menu-toggle" className="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon">
          <i className="fa-solid fa-bars"></i>
        </label>

        <nav className="navbar">
          <Link to="/home"    className={isActive('/home')}>Home</Link>
          <Link to="/about"   className={isActive('/about')}>About</Link>
          {(!user || user.role !== 'admin') && (
            <Link to="/contact" className={isActive('/contact')}>Contact</Link>
          )}

          {!user && (
            <>
              <Link to="/register" className={isActive('/register')}>Register</Link>
              <Link to="/login"    className={isActive('/login')}>Login</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/feed"    className={isActive('/feed')}>Feed</Link>
              <Link to="/profile" className={isActive('/profile')}>Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={isActive('/admin')}>Admin</Link>
              )}
              {/* Logout — opens confirmation dialog */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-color)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginLeft: '4rem',
                  fontFamily: 'Nunito, sans-serif',
                  transition: '.3s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#59B2f4'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-color)'}
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Theme toggle — both SVGs always in DOM so CSS :first/:last-child works */}
        <button id="switch-theme" onClick={() => setLightMode(prev => !prev)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
            <path d="M440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57ZM480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80Z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
            <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/>
          </svg>
        </button>

      </header>

      {/* ── Logout Confirmation Modal ─────────────────────────── */}
      {showLogoutConfirm && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn .2s ease',
          }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--snd-bg-color)',
              border: '1px solid rgba(89,178,244,0.25)',
              borderRadius: '1rem',
              padding: '4rem 3.5rem',
              maxWidth: '44rem',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 0 3rem rgba(89,178,244,0.15)',
              animation: 'slideUp .25s ease',
            }}
          >
            {/* Icon */}
            <div style={{
              width: '6rem', height: '6rem',
              background: 'rgba(231,76,60,0.15)',
              border: '1px solid rgba(231,76,60,0.3)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 2rem',
              fontSize: '2.4rem',
            }}>
              🚪
            </div>

            <h3 style={{
              fontSize: '2.4rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--text-color)',
              fontFamily: 'Nunito, sans-serif',
            }}>
              Log out?
            </h3>

            <p style={{
              fontSize: '1.5rem',
              color: 'var(--ft-color)',
              lineHeight: 1.7,
              marginBottom: '3rem',
              fontFamily: 'Nunito, sans-serif',
            }}>
              Are you sure you want to log out of <span style={{ color: 'var(--main-color)', fontWeight: 700 }}>TheFolio</span>?
            </p>

            <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center' }}>
              {/* Confirm */}
              <button
                onClick={handleLogoutConfirmed}
                style={{
                  padding: '1rem 2.8rem',
                  background: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4rem',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  transition: '.3s ease',
                  boxShadow: '0 0 1rem rgba(231,76,60,0.4)',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 2rem rgba(231,76,60,0.6)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 1rem rgba(231,76,60,0.4)'}
              >
                Yes, Log out
              </button>

              {/* Cancel */}
              <button
                onClick={() => setShowLogoutConfirm(false)}
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
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--main-color)';
                  e.currentTarget.style.color = 'var(--main-color)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(89,178,244,0.3)';
                  e.currentTarget.style.color = 'var(--text-color)';
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}