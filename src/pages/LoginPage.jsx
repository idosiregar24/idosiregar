import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/admin');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFF8F0' }}>
      {/* Background decorations */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-peach-300/20 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-black/5 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-brand-dark mb-1">Welcome Back</h2>
            <p className="text-sm text-gray-400">Sign in to your admin dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-2 border border-red-100">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50/80 border border-gray-100 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
                placeholder="admin@ido.com"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50/80 border border-gray-100 focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-300"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-brand-dark text-white text-sm font-bold hover:bg-brand-dark/90 transition-all shadow-lg shadow-brand-dark/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-300 mt-8">
            <a href="/" className="hover:text-brand-teal transition-colors">← Back to homepage</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
