// ============================================================
// AutoHarvest — Dashboard Page (Real server worlds)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { useAppSelector } from '../store';
import { worldsApi, type WorldResponse } from '../api/apiClient';
import { Play, Plus, Wheat, Sprout, BarChart3, Save, Trash2, Loader2, RefreshCw, Globe2 } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: 'spring', stiffness: 400, damping: 25 } }),
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const [worlds, setWorlds] = useState<WorldResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Fetch worlds from server
  const fetchWorlds = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await worldsApi.list();
      setWorlds(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load worlds. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorlds();
  }, [fetchWorlds]);

  // Create a new world
  const handleCreateWorld = async () => {
    setCreating(true);
    setError('');
    try {
      const world = await worldsApi.create({ name: `Farm #${worlds.length + 1}` });
      navigate(`/game/${world.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create world.');
      setCreating(false);
    }
  };

  // Delete a world
  const handleDeleteWorld = async (worldId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this world? This cannot be undone.')) return;
    setDeleting(worldId);
    try {
      await worldsApi.delete(worldId);
      setWorlds((prev) => prev.filter((w) => w.id !== worldId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete world.');
    } finally {
      setDeleting(null);
    }
  };

  const statCards = [
    { label: 'Total Worlds', value: worlds.length, icon: Globe2, color: 'text-olive-400' },
    { label: 'Account', value: user?.username || '—', icon: Sprout, color: 'text-harvest-400' },
  ];

  return (
    <div className="min-h-screen bg-farm-975">
      <Navbar />
      <div className="pt-24 px-6 pb-12 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
          <h1 className="font-display font-bold text-3xl text-farm-100 mb-2">
            Welcome back, <span className="text-gradient">{user?.username || 'Farmer'}</span>
          </h1>
          <p className="text-farm-400 mb-8">Continue your farming automation journey.</p>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between"
            >
              <span>{error}</span>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 ml-2">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <motion.div initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div key={i} custom={i} variants={fadeIn} whileHover={{ scale: 1.03, y: -2 }} className="glass-panel p-4 cursor-default">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 + i * 0.1 }}>
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              </motion.div>
              <p className="font-display font-bold text-2xl text-farm-100">{stat.value}</p>
              <p className="text-farm-500 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Worlds */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-xl text-farm-100">Your Worlds</h2>
            <div className="flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={fetchWorlds} disabled={loading}
                className="btn-ghost text-sm !py-2 !px-3 flex items-center gap-1.5">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleCreateWorld} disabled={creating}
                className="btn-primary text-sm !py-2 !px-4 flex items-center gap-1.5">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                New World
              </motion.button>
            </div>
          </div>

          {/* Loading state */}
          {loading && worlds.length === 0 && (
            <div className="glass-panel p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-olive-400 animate-spin mr-3" />
              <span className="text-farm-400">Loading your worlds...</span>
            </div>
          )}

          {/* Empty state */}
          {!loading && worlds.length === 0 && (
            <div className="glass-panel p-12 text-center">
              <span className="text-4xl mb-4 block">🌱</span>
              <h3 className="font-display font-semibold text-lg text-farm-200 mb-2">No worlds yet</h3>
              <p className="text-farm-500 text-sm mb-4">Create your first farm world to start automating!</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleCreateWorld} disabled={creating}
                className="btn-primary text-sm !py-2 !px-6 inline-flex items-center gap-2">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create First World
              </motion.button>
            </div>
          )}

          {/* World cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {worlds.map((world) => (
                <motion.div
                  key={world.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Link to={`/game/${world.id}`} className="glass-panel p-5 hover:border-olive-700/40 transition-all group block relative">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display font-semibold text-farm-100 group-hover:text-olive-300 transition-colors">{world.name}</h3>
                      <div className="flex items-center gap-1.5">
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={(e) => handleDeleteWorld(world.id, e)}
                          disabled={deleting === world.id}
                          className="p-1 rounded-md text-farm-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete world"
                        >
                          {deleting === world.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </motion.button>
                        <Play className="w-4 h-4 text-olive-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-farm-500 text-xs">
                      <span>Seed: {world.seed?.slice(0, 8)}...</span>
                    </div>
                    <p className="text-farm-600 text-xs mt-2">
                      Created: {new Date(world.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Guest mode link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-8 text-center">
          <Link to="/game" className="text-farm-600 hover:text-farm-400 text-sm transition-colors">
            or play as guest (no cloud saves) →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
