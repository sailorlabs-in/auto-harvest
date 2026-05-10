// ============================================================
// AutoHarvest — Game Page (Tier-conditional panels)
// ============================================================

import { motion } from 'framer-motion';
import { GameCanvas } from '../components/game/GameCanvas';
import { ResourceBar } from '../components/game/ResourceBar';
import { CodeEditorPanel } from '../components/game/CodeEditorPanel';
import { ConsolePanel } from '../components/game/ConsolePanel';
import { ShopPanel } from '../components/game/ShopPanel';
import { DroneManagerPanel } from '../components/game/DroneManagerPanel';
import { store, useAppSelector, useAppDispatch } from '../store';
import { selectTier, selectIsScriptUnlocked, earnGold } from '../store/slices/progressionSlice';
import { selectDrones } from '../store/slices/gameSlice';
import { setActivePanel, type ActivePanel } from '../store/slices/uiSlice';
import { loadSerializedState } from '../store/slices/gameSlice';
import { Link } from 'react-router-dom';
import { Sprout, Home, Save, Download, Settings, ShoppingCart, Code2, Bot } from 'lucide-react';

export function GamePage() {
  const dispatch = useAppDispatch();
  const tier = useAppSelector(selectTier);
  const isScriptUnlocked = useAppSelector(selectIsScriptUnlocked);
  const drones = useAppSelector(selectDrones);
  const activePanel = useAppSelector((s) => s.ui.activePanel);

  // Track gold earned for tier progression — hook into harvest
  const goldInInventory = useAppSelector((s) => s.game.inventory.items.gold || 0);

  const handleSave = () => {
    const state = store.getState();
    const data = JSON.stringify({
      game: state.game,
      progression: state.progression,
    });
    localStorage.setItem('autoharvest-save', data);
    alert('Game saved!');
  };

  const handleLoad = () => {
    const data = localStorage.getItem('autoharvest-save');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.game) store.dispatch(loadSerializedState(JSON.stringify(parsed.game)));
        // Progression would need its own load action
      } catch {}
      alert('Game loaded!');
    }
  };

  // Determine available tabs
  const tabs: { key: ActivePanel; label: string; icon: typeof ShoppingCart; enabled: boolean }[] = [
    { key: 'shop', label: 'Shop', icon: ShoppingCart, enabled: true },
    { key: 'editor', label: 'Script', icon: Code2, enabled: isScriptUnlocked },
    { key: 'drones', label: 'Drones', icon: Bot, enabled: drones.length > 0 },
  ];

  return (
    <div className="h-screen w-screen bg-farm-975 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="flex items-center justify-between px-3 py-2 border-b border-farm-800/40 bg-farm-975/90 backdrop-blur-xl z-20"
      >
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="w-7 h-7 rounded-lg bg-gradient-to-br from-olive-500 to-olive-700 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-display font-bold text-sm text-farm-200 group-hover:text-olive-300 transition-colors">AutoHarvest</span>
          </Link>
          <div className="w-px h-5 bg-farm-700/40" />
          <Link to="/dashboard" className="btn-ghost !py-1 !px-2 text-xs flex items-center gap-1"><Home className="w-3 h-3" /> Dashboard</Link>
        </div>

        <div className="flex items-center gap-1.5">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave}
            className="btn-ghost !py-1 !px-2 text-xs flex items-center gap-1"><Save className="w-3 h-3" /> Save</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLoad}
            className="btn-ghost !py-1 !px-2 text-xs flex items-center gap-1"><Download className="w-3 h-3" /> Load</motion.button>
          <button className="btn-ghost !py-1 !px-2 text-xs flex items-center gap-1 text-farm-500"><Settings className="w-3 h-3" /></button>
        </div>
      </motion.div>

      {/* Resource Bar */}
      <div className="px-3 py-1.5">
        <ResourceBar />
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex gap-3 px-3 pb-3 overflow-hidden min-h-0">
        {/* Left: Game Canvas */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
          className="flex-1 flex flex-col gap-2 min-w-0"
        >
          <div className="flex-1 glass-panel overflow-hidden">
            <GameCanvas />
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-farm-600 text-xs px-2 flex gap-3">
            <span>WASD: Move</span>
            <span>Space: Harvest/Plant</span>
            <span>Q/E: Cycle Crop</span>
            {drones.length > 0 && <span>Tab: Switch Control</span>}
            {drones.length > 0 && <span>1-{Math.min(drones.length, 4)}: Select Drone</span>}
          </motion.div>
        </motion.div>

        {/* Right: Panel Tabs + Content */}
        <div className="w-[380px] flex flex-col gap-2 shrink-0">
          {/* Panel tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex border border-farm-800/40 rounded-lg overflow-hidden bg-farm-900/40"
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => tab.enabled && dispatch(setActivePanel(tab.key))}
                disabled={!tab.enabled}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-all ${
                  activePanel === tab.key && tab.enabled
                    ? 'bg-olive-600/20 text-olive-300 border-b-2 border-olive-500'
                    : tab.enabled
                      ? 'text-farm-500 hover:text-farm-300 hover:bg-farm-800/30'
                      : 'text-farm-700 cursor-not-allowed'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
                {!tab.enabled && tab.key === 'editor' && (
                  <span className="text-[9px] text-farm-700">T2</span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Panel content */}
          <div className="flex-1 min-h-0">
            {activePanel === 'shop' && <ShopPanel />}
            {activePanel === 'editor' && isScriptUnlocked && <CodeEditorPanel />}
            {activePanel === 'drones' && drones.length > 0 && <DroneManagerPanel />}
            {activePanel === 'editor' && !isScriptUnlocked && (
              <div className="h-full glass-panel flex items-center justify-center p-6">
                <div className="text-center">
                  <span className="text-4xl mb-3 block">🔒</span>
                  <p className="font-display font-semibold text-farm-300">Script Editor Locked</p>
                  <p className="text-farm-500 text-xs mt-1">Earn 200 gold to unlock Tier 2</p>
                </div>
              </div>
            )}
            {activePanel === 'drones' && drones.length === 0 && (
              <div className="h-full glass-panel flex items-center justify-center p-6">
                <div className="text-center">
                  <span className="text-4xl mb-3 block">🤖</span>
                  <p className="font-display font-semibold text-farm-300">No Drones</p>
                  <p className="text-farm-500 text-xs mt-1">Buy drones from the Shop tab</p>
                </div>
              </div>
            )}
          </div>

          {/* Console (always visible) */}
          <ConsolePanel />
        </div>
      </div>
    </div>
  );
}
