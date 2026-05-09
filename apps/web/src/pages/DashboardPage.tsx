import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { useAppSelector } from '../store';
import { selectGameStats } from '../store/slices/gameSlice';
import { Play, Plus, Wheat, Sprout, BarChart3, Save } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, type: 'spring', stiffness: 400, damping: 25 } }),
};

export function DashboardPage() {
  const { user } = useAppSelector((s) => s.auth);
  const stats = useAppSelector(selectGameStats);

  const savedWorlds = [
    { id: '1', name: 'My First Farm', gridSize: '10×10', harvested: stats.totalHarvested, planted: stats.totalPlanted },
  ];

  const statCards = [
    { label: 'Total Planted', value: stats.totalPlanted, icon: Sprout, color: 'text-olive-400' },
    { label: 'Total Harvested', value: stats.totalHarvested, icon: Wheat, color: 'text-harvest-400' },
    { label: 'Game Ticks', value: stats.tick, icon: BarChart3, color: 'text-farm-300' },
    { label: 'Worlds', value: savedWorlds.length, icon: Save, color: 'text-growth' },
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/game" className="btn-primary text-sm !py-2 !px-4 flex items-center gap-1.5"><Plus className="w-4 h-4" /> New World</Link>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedWorlds.map((world) => (
              <motion.div key={world.id} whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                <Link to="/game" className="glass-panel p-5 hover:border-olive-700/40 transition-all group block">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-semibold text-farm-100 group-hover:text-olive-300 transition-colors">{world.name}</h3>
                    <Play className="w-4 h-4 text-olive-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex items-center gap-3 text-farm-500 text-xs">
                    <span>Grid: {world.gridSize}</span><span>🌱 {world.planted}</span><span>🌾 {world.harvested}</span>
                  </div>
                  <p className="text-farm-600 text-xs mt-2">Last played: just now</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
