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
import { addConsoleLog } from '../../store/slices/uiSlice';
import type { Direction, CropType } from '@autoharvest/shared';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = useAppSelector(selectTier);
  const unlockedCrops = useAppSelector(selectUnlockedCrops);

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

    // Space: smart action (harvest if ready, else plant)
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
        const firstCrop = (unlockedCrops[0] || 'wheat') as CropType;
        store.dispatch(plantCrop({ cropType: firstCrop }));
      }
      return;
    }

    // P: Plant wheat
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      store.dispatch(plantCrop({ cropType: 'wheat' as CropType }));
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
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
