// ============================================================
// AutoHarvest — Drone Manager Panel
// ============================================================

import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectDrones, selectActiveDrone, selectDrone as selectDroneAction, setDroneStatus, setDroneScript } from '../../store/slices/gameSlice';
import { selectTier, selectCanAutomate } from '../../store/slices/progressionSlice';
import { setSelectedDroneForScript } from '../../store/slices/uiSlice';
import { Bot, Play, Square, Crosshair, Code2, Zap } from 'lucide-react';

export function DroneManagerPanel() {
  const dispatch = useAppDispatch();
  const drones = useAppSelector(selectDrones);
  const activeDrone = useAppSelector(selectActiveDrone);
  const tier = useAppSelector(selectTier);
  const canAutomate = useAppSelector(selectCanAutomate);

  if (drones.length === 0) {
    return (
      <div className="h-full glass-panel flex items-center justify-center p-6">
        <div className="text-center">
          <Bot className="w-10 h-10 text-farm-700 mx-auto mb-3" />
          <p className="text-farm-400 text-sm font-display font-semibold">No Drones Yet</p>
          <p className="text-farm-600 text-xs mt-1">Buy your first drone from the Shop!</p>
        </div>
      </div>
    );
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'manual': return '🎮';
      case 'scripted': return '⟳';
      default: return '💤';
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'manual': return 'text-blue-400';
      case 'scripted': return 'text-amber-400';
      default: return 'text-farm-600';
    }
  };

  return (
    <div className="h-full flex flex-col glass-panel overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-farm-800/40">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-400" />
          <span className="font-display font-semibold text-sm text-farm-200">Drones ({drones.length})</span>
        </div>
        <span className="text-xs text-farm-500">Tab to switch</span>
      </div>

      {/* Drone list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {drones.map((drone, i) => {
          const isActive = activeDrone?.id === drone.id;
          return (
            <motion.div
              key={drone.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-lg border p-3 transition-all cursor-pointer ${
                isActive
                  ? 'border-blue-600/50 bg-blue-900/15'
                  : 'border-farm-800/40 bg-farm-900/40 hover:border-farm-700/40'
              }`}
              onClick={() => dispatch(selectDroneAction(drone.id))}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <span className="font-display font-semibold text-sm text-farm-100">{drone.name}</span>
                </div>
                <span className={`text-xs font-mono ${statusColor(drone.status)}`}>
                  {statusIcon(drone.status)} {drone.status}
                </span>
              </div>

              {/* Position & energy */}
              <div className="flex items-center gap-3 text-farm-500 text-xs mb-2">
                <span className="flex items-center gap-1">
                  <Crosshair className="w-3 h-3" /> ({drone.x}, {drone.y})
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" /> {Math.round(drone.energy)}/{drone.maxEnergy}
                </span>
              </div>

              {/* Energy bar */}
              <div className="w-full h-1.5 rounded-full bg-farm-800/50 overflow-hidden mb-2">
                <motion.div
                  className="h-full rounded-full bg-yellow-500"
                  animate={{ width: `${(drone.energy / drone.maxEnergy) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Actions */}
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="flex gap-1.5 mt-2 pt-2 border-t border-farm-800/30"
                >
                  {drone.status !== 'manual' && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); dispatch(setDroneStatus({ droneId: drone.id, status: 'manual' })); }}
                      className="flex-1 py-1 text-xs rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 flex items-center justify-center gap-1"
                    >
                      <Play className="w-3 h-3" /> Control
                    </motion.button>
                  )}
                  {canAutomate && drone.status !== 'scripted' && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setDroneStatus({ droneId: drone.id, status: 'scripted' }));
                        dispatch(setSelectedDroneForScript(drone.id));
                      }}
                      className="flex-1 py-1 text-xs rounded bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 flex items-center justify-center gap-1"
                    >
                      <Code2 className="w-3 h-3" /> Auto
                    </motion.button>
                  )}
                  {drone.status !== 'idle' && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); dispatch(setDroneStatus({ droneId: drone.id, status: 'idle' })); }}
                      className="flex-1 py-1 text-xs rounded bg-farm-800/40 text-farm-400 hover:bg-farm-800/60 flex items-center justify-center gap-1"
                    >
                      <Square className="w-3 h-3" /> Stop
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
