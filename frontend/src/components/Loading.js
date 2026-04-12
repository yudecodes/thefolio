import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Loading() {
  const [dots, setDots] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Animate dots
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Redirect after 3 seconds
    const timeout = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="index-body">
      <div className="index-loader-container">
        <div className="index-logo">
           <img className="index-logo" src="/images/LogoYuan.png" alt="Logo" />
        </div>
        <h1 className="index-h1">My Personal Website</h1>
        <div className="index-spinner"></div>
        <div className="index-loading-text">Loading<span>{dots}</span></div>
      </div>
    </div>
  );
}