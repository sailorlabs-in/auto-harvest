import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../store';
import { setAuth } from '../store/slices/authSlice';
import { Navbar } from '../components/layout/Navbar';
import { Sprout, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      dispatch(setAuth({ user: { id: '1', username: email.split('@')[0], email, createdAt: new Date().toISOString() }, token: 'demo-token' }));
      navigate('/dashboard');
    } catch { setError('Invalid credentials.'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-farm-975">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="fixed inset-0 bg-glow-olive opacity-20 pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.2 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-olive-500 to-olive-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-olive-900/30">
              <Sprout className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="font-display font-bold text-2xl text-farm-100 mb-2">Welcome back, farmer</h1>
            <p className="text-farm-400 text-sm">Sign in to continue your automation journey</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              <div>
                <label className="block text-farm-300 text-sm font-medium mb-1.5">Email</label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-farm-500" />
                  <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@farm.io" required className="input-field !pl-10" /></div>
              </div>
              <div>
                <label className="block text-farm-300 text-sm font-medium mb-1.5">Password</label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-farm-500" />
                  <input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="input-field !pl-10 !pr-10" />
                  <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-farm-500 hover:text-farm-300 transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </motion.button></div>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} id="login-submit" type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
              </motion.button>
            </form>
            <div className="mt-4 text-center"><p className="text-farm-500 text-sm">Don't have an account? <Link to="/register" className="text-olive-400 hover:text-olive-300">Sign up</Link></p></div>
          </motion.div>
          <div className="mt-6 text-center"><Link to="/game" className="text-farm-500 hover:text-farm-300 text-sm">or play without an account →</Link></div>
        </motion.div>
      </div>
    </div>
  );
}
