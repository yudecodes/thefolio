// frontend/src/App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import HomePage from './pages/HomePage';
import Contact from './pages/Contact';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';
import About from './pages/About';

function App() {
  return (
    <>
      <Header />

      <Routes>
        {/* ── Public routes ───────────────────────── */}
        <Route path="/"          element={<Navigate to="/feed" replace />} />
        <Route path="/home"      element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/contact"   element={<Contact />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/posts/:id" element={<PostPage />} />

        {/* ── Protected routes ────────────────────── */}
        <Route path="/feed" element={
          <ProtectedRoute><HomePage /></ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />

        <Route path="/profile/users/:userId" element={
          <ProtectedRoute><UserProfilePage /></ProtectedRoute>
        } />

        <Route path="/create-post" element={
          <ProtectedRoute><CreatePostPage /></ProtectedRoute>
        } />

        <Route path="/edit-post/:id" element={
          <ProtectedRoute><EditPostPage /></ProtectedRoute>
        } />

        {/* ── Admin only ──────────────────────────── */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>
        } />

        {/* ── Catch-all ───────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;