// ============================================================
// AutoHarvest — Navbar Component (Redux + Motion)
// ============================================================

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { Sprout, LayoutDashboard, LogOut, LogIn, Gamepad2 } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-farm-800/40"
    >
      <div className="backdrop-blur-xl bg-farm-975/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-olive-500 to-olive-700 flex items-center justify-center shadow-lg shadow-olive-900/30 group-hover:shadow-olive-800/50 transition-shadow"
            >
              <Sprout className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-display font-bold text-lg text-farm-100 group-hover:text-olive-300 transition-colors">
              AutoHarvest
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/guide" className={`btn-ghost flex items-center gap-2 text-sm ${isActive('/guide') ? 'text-olive-400 bg-farm-800/40' : ''}`}>
              <Gamepad2 className="w-4 h-4" /> Guide
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`btn-ghost flex items-center gap-2 text-sm ${isActive('/dashboard') ? 'text-olive-400 bg-farm-800/40' : ''}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <span className="text-farm-500 text-sm px-2">{user?.username}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch(logout())}
                  className="btn-ghost flex items-center gap-2 text-sm text-farm-400 hover:text-danger"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login" className={`btn-ghost flex items-center gap-2 text-sm ${isActive('/login') ? 'text-olive-400' : ''}`}>
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="btn-primary text-sm !py-2 !px-4">Get Started</Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
