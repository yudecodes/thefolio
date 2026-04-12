import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

// Validators
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidAge = (dateString) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
};

export default function RegisterPage() {
  const navigate = useNavigate();

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

  const [errors, setErrors] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    let isValid = true;

    // VALIDATIONS
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name required";
      isValid = false;
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email";
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Min 6 chars";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!isValidAge(formData.dob)) {
      newErrors.dob = "Must be 18+";
      isValid = false;
    }

    if (!formData.terms) {
      newErrors.terms = "Accept terms";
      isValid = false;
    }

    setFieldErrors(newErrors);
    if (!isValid) return;

    try {
      // 🔥 IMPORTANT: only send what backend expects
      const payload = {
        name: formData.fullname,
        email: formData.email,
        password: formData.password
      };

      const { data } = await API.post('/auth/register', payload);

      localStorage.setItem('token', data.token);
      navigate('/home');

    } catch (err) {
      setErrors(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>

      {errors && <p className="error">{errors}</p>}

      <form onSubmit={handleSubmit}>

        <input
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
        />
        {fieldErrors.fullname && <span>{fieldErrors.fullname}</span>}

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {fieldErrors.email && <span>{fieldErrors.email}</span>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {fieldErrors.password && <span>{fieldErrors.password}</span>}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {fieldErrors.confirmPassword && <span>{fieldErrors.confirmPassword}</span>}

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
        {fieldErrors.dob && <span>{fieldErrors.dob}</span>}

        <label>
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />
          Accept Terms
        </label>
        {fieldErrors.terms && <span>{fieldErrors.terms}</span>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}