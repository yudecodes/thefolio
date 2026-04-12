// frontend/src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidAge = (dateString) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
};

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dob: '',
    interest: '',
    terms: false
  });

  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name])  setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError)      setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    let isValid = true;

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required"; isValid = false;
    } else if (formData.fullname.trim().length < 3) {
      newErrors.fullname = "Full name must be at least 3 characters"; isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"; isValid = false;
    } else if (formData.username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters"; isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"; isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format (example: user@email.com)"; isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required"; isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"; isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"; isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"; isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"; isValid = false;
    }

    if (!formData.gender)   { newErrors.gender = "Please select your gender"; isValid = false; }
    if (!formData.dob)      { newErrors.dob = "Date of birth is required"; isValid = false; }
    else if (!isValidAge(formData.dob)) { newErrors.dob = "You must be at least 18 years old"; isValid = false; }
    if (!formData.interest) { newErrors.interest = "Please select your experience level"; isValid = false; }
    if (!formData.terms)    { newErrors.terms = "You must agree to the terms"; isValid = false; }

    setErrors(newErrors);

    // ── DEBUG: see validation result in console ──────────────
    console.log('isValid:', isValid);
    console.log('formData:', formData);

    if (isValid) {
      setLoading(true);
      setApiError('');

      try {
        const payload = {
          name:     formData.fullname.trim(),
          email:    formData.email.trim(),
          password: formData.password,
        };

        // ── DEBUG: confirm payload before sending ────────────
        console.log('📤 Sending to API:', payload);

        const { data } = await API.post('/auth/register', payload);

        // ── DEBUG: confirm success response ─────────────────
        console.log('✅ Register success:', data);

        localStorage.setItem('token', data.token);
        setUser(data.user);
        setSuccess(true);

        setTimeout(() => {
          navigate(data.user.role === 'admin' ? '/admin' : '/feed');
        }, 1500);

      } catch (err) {
        // ── DEBUG: log full error so we can see what happened ─
        console.log('❌ Error:', err.message);
        console.log('❌ Response status:', err.response?.status);
        console.log('❌ Response data:', err.response?.data);

        setApiError(
          err.response?.data?.message || `Error: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="register-section" id="register">
      <div className="register-container">
        <h2 className="heading">Join My <span>Community</span></h2>

        <img
          src={`${process.env.REACT_APP_BACKEND_URL}/images/laptopYellowMug.jpg`}
          alt="Web development workspace with code on multiple monitors"
          className="register-image"
        />

        <div className="register-intro">
          <h3>What You'll Receive</h3>
          <ul>
            <li><strong>Monthly Newsletter:</strong> Updates on my latest projects, coding challenges I've solved, and web development insights</li>
            <li><strong>Exclusive Content:</strong> Behind-the-scenes look at my learning journey and tutorials on topics I'm mastering</li>
            <li><strong>Early Access:</strong> Be the first to know about new projects, blog posts, and portfolio updates</li>
            <li><strong>Community Connection:</strong> Join a network of aspiring developers and tech enthusiasts</li>
            <li><strong>Resource Sharing:</strong> Get access to my curated list of helpful tools, tutorials, and learning materials</li>
          </ul>
        </div>

        {apiError && (
          <p className="error" style={{ marginBottom: '16px', fontSize: '0.95rem' }}>
            ⚠ {apiError}
          </p>
        )}

        {success && (
          <p style={{ color: 'green', marginBottom: '16px', fontSize: '0.95rem' }}>
            ✅ Registration successful! Redirecting you now…
          </p>
        )}

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="fullname">Full Name *</label>
            <input type="text" id="fullname" name="fullname" placeholder="Enter your full name" value={formData.fullname} onChange={handleChange} />
            {errors.fullname && <span className="error">{errors.fullname}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="username">Preferred Username *</label>
            <input type="text" id="username" name="username" placeholder="Choose a unique username" value={formData.username} onChange={handleChange} />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input type="password" id="password" name="password" placeholder="Enter your Password" value={formData.password} onChange={handleChange} />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your Password" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          <div className="gender-group">
            <label>Gender:</label>
            <input type="radio" id="male" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} />
            <label htmlFor="male">Male</label>
            <input type="radio" id="female" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} />
            <label htmlFor="female">Female</label>
            <input type="radio" id="other" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} />
            <label htmlFor="other">Other</label>
            <br />
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth *</label>
            <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} />
            {errors.dob && <span className="error">{errors.dob}</span>}
          </div>

          <div className="form-group">
            <label>Experience Level *</label>
            <div className="radio-group">
              <div className="radio-option">
                <input type="radio" id="beginner" name="interest" value="beginner" checked={formData.interest === 'beginner'} onChange={handleChange} />
                <label htmlFor="beginner">Beginner - Just starting my web development journey</label>
              </div>
              <div className="radio-option">
                <input type="radio" id="intermediate" name="interest" value="intermediate" checked={formData.interest === 'intermediate'} onChange={handleChange} />
                <label htmlFor="intermediate">Intermediate - I have some experience with HTML/CSS/JavaScript</label>
              </div>
              <div className="radio-option">
                <input type="radio" id="expert" name="interest" value="expert" checked={formData.interest === 'expert'} onChange={handleChange} />
                <label htmlFor="expert">Expert - I'm experienced in full-stack development</label>
              </div>
            </div>
            {errors.interest && <span className="error">{errors.interest}</span>}
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} />
              <label htmlFor="terms">
                I agree to receive periodic updates and newsletters about web development topics.
                I understand my information will be kept private and I can unsubscribe at any time. *
              </label>
            </div>
            {errors.terms && <span className="error">{errors.terms}</span>}
          </div>

          <button type="submit" className="btn" disabled={loading || success}>
            {loading ? 'Registering…' : success ? '✓ Registered!' : 'Join the Community'}
          </button>

        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '1.2rem', fontWeight: '500' }}>
          Already have an account? <Link to="/login" style={{ textDecoration: 'underline', color: '#59B2f4', fontWeight: '700', transition: '0.3s ease' }} className="login-link">Login here</Link>
        </p>

      </div>
    </section>
  );
}