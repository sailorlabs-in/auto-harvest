// ============================================================
// AutoHarvest — Tier Progress Bar
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../store';
import { selectTier, selectTotalGoldEarned, selectNextTierThreshold } from '../../store/slices/progressionSlice';
import { TIER_INFO, TIER_THRESHOLDS } from '@autoharvest/shared';
import { Trophy, ChevronRight } from 'lucide-react';

export function TierProgressBar() {
  const tier = useAppSelector(selectTier);
  const totalGold = useAppSelector(selectTotalGoldEarned);
  const nextThreshold = useAppSelector(selectNextTierThreshold);
  const tierInfo = TIER_INFO[tier];
  const nextTierInfo = TIER_INFO[tier + 1];

  const currentThreshold = TIER_THRESHOLDS[tier];
  const progress = tier >= 4
    ? 100
    : ((totalGold - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      {/* Tier badge */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-farm-900/60 border border-farm-800/40"
        title={`Tier ${tier}: ${tierInfo.name} — ${tierInfo.description}`}
      >
        <span className="text-sm">{tierInfo.icon}</span>
        <span className="text-xs font-display font-semibold text-farm-200">T{tier}</span>
      </motion.div>

      {/* Progress bar to next tier */}
      {tier < 4 && nextTierInfo && (
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className="flex-1 h-2 rounded-full bg-farm-800/50 overflow-hidden relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-olive-600 to-olive-400"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <ChevronRight className="w-3 h-3 text-farm-600" />
            <span className="text-[10px] text-farm-500" title={nextTierInfo.description}>
              {nextTierInfo.icon}
            </span>
          </div>
        </div>
      )}

      {tier >= 4 && (
        <div className="flex items-center gap-1">
          <Trophy className="w-3 h-3 text-yellow-500" />
          <span className="text-[10px] text-yellow-500 font-medium">MAX</span>
        </div>
      )}
    </motion.div>
  );
}
