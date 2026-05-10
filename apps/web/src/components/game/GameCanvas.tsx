// ============================================================
// AutoHarvest — Game Canvas (Farmer + Drone controls)
// ============================================================

import { useEffect, useRef, useCallback } from 'react';
import { gameEngine } from '../../engine/GameEngine';
import { store, useAppSelector } from '../../store';
import {
  moveRobot, switchControlMode, selectDrone,
  plantCrop, harvestCrop,
} from '../../store/slices/gameSlice';
import { selectTier, selectUnlockedCrops, earnGold } from '../../store/slices/progressionSlice';
import { addConsoleLog, setSelectedCropType } from '../../store/slices/uiSlice';
import type { Direction, CropType } from '@autoharvest/shared';
import { CROP_DEFINITIONS } from '@autoharvest/shared';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = useAppSelector(selectTier);
  const unlockedCrops = useAppSelector(selectUnlockedCrops);
  const selectedCropType = useAppSelector((s) => s.ui.selectedCropType);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameEngine.attach(canvas);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        gameEngine.resize(width, height);
      }
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);
    gameEngine.start();

    return () => {
      resizeObserver.disconnect();
      gameEngine.destroy();
    };
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if user is typing in an input/editor
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    const tag = (e.target as HTMLElement)?.closest?.('.monaco-editor');
    if (tag) return;

    const dirMap: Record<string, Direction> = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      w: 'up', W: 'up', s: 'down', S: 'down', a: 'left', A: 'left', d: 'right', D: 'right',
    };

    // Movement (works for both farmer and drone via moveRobot)
    if (dirMap[e.key]) {
      e.preventDefault();
      store.dispatch(moveRobot(dirMap[e.key]));
      return;
    }

    // Tab: switch control mode
    if (e.key === 'Tab') {
      e.preventDefault();
      const drones = store.getState().game.drones;
      if (drones.length > 0) {
        store.dispatch(switchControlMode());
        const mode = store.getState().game.controlMode;
        store.dispatch(addConsoleLog({
          id: `switch-${Date.now()}`,
          message: mode === 'farmer' ? '🧑‍🌾 Switched to Farmer' : `🤖 Switched to ${store.getState().game.drones.find(d => d.id === store.getState().game.activeDroneId)?.name || 'Drone'}`,
          type: 'info',
          timestamp: Date.now(),
        }));
      }
      return;
    }

    // Number keys 1-4: select drone directly
    if (['1', '2', '3', '4'].includes(e.key)) {
      const idx = parseInt(e.key) - 1;
      const drones = store.getState().game.drones;
      if (idx < drones.length) {
        e.preventDefault();
        store.dispatch(selectDrone(drones[idx].id));
      }
      return;
    }

    // Q / E: cycle through unlocked crops
    if (e.key === 'q' || e.key === 'Q') {
      e.preventDefault();
      const currentCrops = store.getState().progression.unlockedCrops;
      const currentSelected = store.getState().ui.selectedCropType;
      const idx = currentCrops.indexOf(currentSelected);
      const prevIdx = idx <= 0 ? currentCrops.length - 1 : idx - 1;
      const newCrop = currentCrops[prevIdx] as CropType;
      store.dispatch(setSelectedCropType(newCrop));
      const def = CROP_DEFINITIONS[newCrop];
      store.dispatch(addConsoleLog({
        id: `crop-select-${Date.now()}`,
        message: `${def.emoji} Selected ${def.name} for planting`,
        type: 'info',
        timestamp: Date.now(),
      }));
      return;
    }

    if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      const currentCrops = store.getState().progression.unlockedCrops;
      const currentSelected = store.getState().ui.selectedCropType;
      const idx = currentCrops.indexOf(currentSelected);
      const nextIdx = idx >= currentCrops.length - 1 ? 0 : idx + 1;
      const newCrop = currentCrops[nextIdx] as CropType;
      store.dispatch(setSelectedCropType(newCrop));
      const def = CROP_DEFINITIONS[newCrop];
      store.dispatch(addConsoleLog({
        id: `crop-select-${Date.now()}`,
        message: `${def.emoji} Selected ${def.name} for planting`,
        type: 'info',
        timestamp: Date.now(),
      }));
      return;
    }

    // Space: smart action (harvest if ready, else plant SELECTED crop)
    if (e.key === ' ') {
      e.preventDefault();
      const state = store.getState().game;
      const entity = state.controlMode === 'drone' && state.activeDroneId
        ? state.drones.find((d) => d.id === state.activeDroneId)
        : state.farmer;
      if (!entity) return;

      const tile = state.tiles[entity.y]?.[entity.x];
      if (tile?.crop?.stage === 4) {
        const beforeGold = state.inventory.items.gold || 0;
        store.dispatch(harvestCrop({}));
        const afterGold = store.getState().game.inventory.items.gold || 0;
        const goldEarned = afterGold - beforeGold;
        if (goldEarned > 0) store.dispatch(earnGold(goldEarned));
      } else if (tile?.type === 'farmland' && !tile.crop) {
        const cropToPlant = store.getState().ui.selectedCropType as CropType;
        store.dispatch(plantCrop({ cropType: cropToPlant }));
      }
      return;
    }

    // P: Plant selected crop (not hardcoded to wheat)
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      const cropToPlant = store.getState().ui.selectedCropType as CropType;
      store.dispatch(plantCrop({ cropType: cropToPlant }));
      return;
    }

    // H: Harvest
    if (e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      const beforeGold = store.getState().game.inventory.items.gold || 0;
      store.dispatch(harvestCrop({}));
      const afterGold = store.getState().game.inventory.items.gold || 0;
      const goldEarned = afterGold - beforeGold;
      if (goldEarned > 0) store.dispatch(earnGold(goldEarned));
      return;
    }
  }, [unlockedCrops]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Crop Selector Overlay */}
      <CropSelector />
    </div>
  );
}

// ─── Crop Selector Overlay ──────────────────────────────────
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../store';

function CropSelector() {
  const dispatch = useAppDispatch();
  const unlockedCrops = useAppSelector(selectUnlockedCrops);
  const selectedCropType = useAppSelector((s) => s.ui.selectedCropType);
  const inventory = useAppSelector((s) => s.game.inventory.items);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-farm-975/80 backdrop-blur-xl border border-farm-800/40 shadow-2xl"
    >
      <span className="text-farm-500 text-[10px] font-medium mr-1 tracking-wide uppercase">Crop</span>
      {unlockedCrops.map((cropType) => {
        const def = CROP_DEFINITIONS[cropType as CropType];
        if (!def) return null;
        const seedCount = inventory[`seed_${cropType}`] || 0;
        const isSelected = selectedCropType === cropType;

        return (
          <motion.button
            key={cropType}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(setSelectedCropType(cropType as CropType))}
            className={`relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg transition-all ${
              isSelected
                ? 'bg-olive-600/30 border border-olive-500/60 shadow-lg shadow-olive-500/20'
                : 'bg-farm-900/50 border border-farm-800/30 hover:border-farm-700/50'
            }`}
            title={`${def.name} (${seedCount} seeds) — Sells for ${def.sellPrice}g each`}
          >
            <span className="text-lg leading-none">{def.emoji}</span>
            <span className={`text-[9px] font-medium ${
              isSelected ? 'text-olive-300' : 'text-farm-500'
            }`}>{def.name}</span>
            <span className={`text-[8px] font-mono ${
              seedCount > 0
                ? isSelected ? 'text-olive-400' : 'text-farm-400'
                : 'text-red-400'
            }`}>{seedCount}</span>
            {isSelected && (
              <motion.div
                layoutId="crop-selector-highlight"
                className="absolute inset-0 rounded-lg border-2 border-olive-400/40"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
      <div className="w-px h-8 bg-farm-800/40 mx-1" />
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-farm-600 text-[9px]">Q ← → E</span>
        <span className="text-farm-700 text-[8px]">Cycle</span>
      </div>
    </motion.div>
  );
}
