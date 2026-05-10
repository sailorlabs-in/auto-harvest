// ============================================================
// AutoHarvest — Register Page (Confirm Password + Eye Toggle)
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch } from '../store';
import { setAuth } from '../store/slices/authSlice';
import { authApi } from '../api/apiClient';
import { Navbar } from '../components/layout/Navbar';
import { Sprout, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Check, X } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const passwordStrength = (() => {
    if (password.length === 0) return { level: 0, label: '', color: '' };
    if (password.length < 6) return { level: 1, label: 'Too short', color: 'bg-red-500' };
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = [password.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score <= 1) return { level: 2, label: 'Weak', color: 'bg-orange-500' };
    if (score === 2) return { level: 3, label: 'Fair', color: 'bg-yellow-500' };
    if (score === 3) return { level: 4, label: 'Good', color: 'bg-olive-500' };
    return { level: 5, label: 'Strong', color: 'bg-growth' };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.register({ username, email, password });
      dispatch(
        setAuth({
          user: response.user,
          token: response.accessToken,
        }),
      );
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(typeof msg === 'string' ? msg : msg[0] || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-farm-975">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-6 pt-16 pb-8">
        <div className="fixed inset-0 bg-glow-harvest opacity-20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.15 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-olive-500 to-olive-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-olive-900/30"
            >
              <Sprout className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="font-display font-bold text-2xl text-farm-100 mb-2">
              Create your farm
            </h1>
            <p className="text-farm-400 text-sm">
              Start your automation journey today
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-panel p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username */}
              <div>
                <label className="block text-farm-300 text-sm font-medium mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-farm-500" />
                  <input
                    id="register-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="farmer_42"
                    required
                    className="input-field !pl-10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-farm-300 text-sm font-medium mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-farm-500" />
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@farm.io"
                    required
                    className="input-field !pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-farm-300 text-sm font-medium mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-farm-500" />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="input-field !pl-10 !pr-10"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-farm-500 hover:text-farm-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>

                {/* Password Strength Indicator */}
                <AnimatePresence>
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              i <= passwordStrength.level ? passwordStrength.color : 'bg-farm-800'
                            }`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: i * 0.05 }}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${
                        passwordStrength.level <= 2 ? 'text-red-400' :
                        passwordStrength.level === 3 ? 'text-yellow-400' :
                        'text-growth'
                      }`}>
                        {passwordStrength.label}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-farm-300 text-sm font-medium mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-farm-500" />
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className={`input-field !pl-10 !pr-16 ${
                      passwordMismatch
                        ? '!border-red-500/50 focus:!border-red-500/70 focus:!ring-red-500/20'
                        : passwordsMatch
                          ? '!border-growth/50 focus:!border-growth/70 focus:!ring-growth/20'
                          : ''
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {/* Match indicator */}
                    <AnimatePresence>
                      {passwordsMatch && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="text-growth"
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                      {passwordMismatch && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Eye toggle */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-farm-500 hover:text-farm-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Mismatch warning */}
                <AnimatePresence>
                  {passwordMismatch && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-xs mt-1.5"
                    >
                      Passwords do not match
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id="register-submit"
                type="submit"
                disabled={loading || passwordMismatch}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-farm-500 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-olive-400 hover:text-olive-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>

          <div className="mt-6 text-center">
            <Link
              to="/game"
              className="text-farm-500 hover:text-farm-300 text-sm transition-colors"
            >
              or play without an account →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
