// frontend/src/pages/ProfilePage.js
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ── Eye / EyeOff SVG icons ───────────────────────────────────
const EyeIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24'
    fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/>
    <circle cx='12' cy='12' r='3'/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24'
    fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94'/>
    <path d='M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19'/>
    <line x1='1' y1='1' x2='23' y2='23'/>
  </svg>
);

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const [name,  setName]  = useState(user?.name || '');
  const [bio,   setBio]   = useState(user?.bio  || '');
  const [pic,   setPic]   = useState(null);
  const [picPreview, setPicPreview] = useState(null);

  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const [showCurPw, setShowCurPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [msg,     setMsg]     = useState('');
  const [msgType, setMsgType] = useState('');
  const [saving,  setSaving]  = useState(false);

  const showMsg = (text, type = 'success') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 4000);
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPic(file);
    setPicPreview(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);
    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      showMsg('Profile updated successfully!', 'success');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/auth/change-password', {
        currentPassword: curPw,
        newPassword: newPw,
      });
      showMsg('Password changed successfully!', 'success');
      setCurPw('');
      setNewPw('');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to change password.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const picSrc = picPreview
    || (user?.profilePic ? `${BASE_URL}/uploads/${user.profilePic}` : null);

  // ── Reusable eye toggle button style ────────────────────────
  const eyeBtnStyle = (active) => ({
    position: 'absolute',
    right: '1.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: active ? 'var(--main-color)' : 'var(--ft-color)',
    transition: 'color .3s ease',
  });

  return (
    <section className='profile-section'>

      <h2 className='heading'>My <span>Profile</span></h2>

      {msg && (
        <p className={msgType === 'success' ? 'profile-msg-success' : 'profile-msg-error'}>
          {msgType === 'success' ? '✅' : '⚠'} {msg}
        </p>
      )}

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

        {/* ── RIGHT: Forms ── */}
        <div className='profile-forms'>

          {/* Edit Profile */}
          <div className='profile-form-box'>
            <h3>Edit <span>Profile</span></h3>
            <form onSubmit={handleProfile}>

              <div className='form-group'>
                <label>Display Name</label>
                <input
                  type='text'
                  placeholder='Your display name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className='form-group'>
                <label>Bio</label>
                <textarea
                  placeholder='Write a short bio…'
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className='profile-textarea'
                />
              </div>

              <div className='form-group'>
                <label>Profile Picture</label>
                <label className='profile-img-upload'>
                  {picSrc
                    ? <img src={picSrc} alt='preview' className='profile-img-preview' />
                    : <span>+ Click to upload photo</span>
                  }
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handlePicChange}
                    hidden
                  />
                </label>
              </div>

              <button type='submit' className='btn' disabled={saving}>
                {saving ? 'Saving…' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className='profile-form-box'>
            <h3>Change <span>Password</span></h3>
            <form onSubmit={handlePassword}>

              <div className='form-group'>
                <label>Current Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showCurPw ? 'text' : 'password'}
                    placeholder='Enter current password'
                    value={curPw}
                    onChange={e => setCurPw(e.target.value)}
                    required
                    style={{ paddingRight: '4.5rem' }}
                  />
                  <button
                    type='button'
                    onClick={() => setShowCurPw(prev => !prev)}
                    aria-label={showCurPw ? 'Hide password' : 'Show password'}
                    style={eyeBtnStyle(showCurPw)}
                  >
                    {showCurPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className='form-group'>
                <label>New Password <span style={{ fontWeight: 400, fontSize: '1.2rem', color: 'var(--ft-color)' }}>( min 6 chars, A-z-0 )</span></label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    placeholder='Enter new password'
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    required
                    minLength={6}
                    style={{ paddingRight: '4.5rem' }}
                  />
                  <button
                    type='button'
                    onClick={() => setShowNewPw(prev => !prev)}
                    aria-label={showNewPw ? 'Hide password' : 'Show password'}
                    style={eyeBtnStyle(showNewPw)}
                  >
                    {showNewPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button type='submit' className='btn' disabled={saving}>
                {saving ? 'Saving…' : 'Change Password'}
              </button>
            </form>
          </div>

        </div>
      </div>

    </section>
  );
};

export default ProfilePage;