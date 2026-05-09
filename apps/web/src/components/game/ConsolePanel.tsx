// ============================================================
// AutoHarvest — Console Panel (Redux + Motion)
// ============================================================

import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { clearConsole, toggleConsole } from '../../store/slices/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export function ConsolePanel() {
  const dispatch = useAppDispatch();
  const { consoleLogs, showConsole } = useAppSelector((s) => s.ui);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [consoleLogs]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.4 }}
      className="glass-panel-dark flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-farm-800/40">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch(toggleConsole())}
          className="flex items-center gap-2 text-sm font-medium text-farm-300 hover:text-farm-100 transition-colors"
        >
          <Terminal className="w-4 h-4 text-olive-400" />
          Console
          <motion.span
            key={consoleLogs.length}
            initial={{ scale: 1.3, color: '#90BE6D' }}
            animate={{ scale: 1, color: '#68635a' }}
            className="text-xs"
          >
            ({consoleLogs.length})
          </motion.span>
          {showConsole ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch(clearConsole())}
          className="text-farm-500 hover:text-danger transition-colors p-1"
          title="Clear console"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showConsole && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 160, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="overflow-hidden"
          >
            <div ref={scrollRef} className="h-full overflow-y-auto px-3 py-2 space-y-0.5 font-mono text-xs">
              {consoleLogs.length === 0 ? (
                <p className="text-farm-600 italic">No output yet. Run a script or press keys to interact...</p>
              ) : (
                consoleLogs.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex gap-2 leading-relaxed ${
                      entry.type === 'error' ? 'text-red-400' :
                      entry.type === 'warn' ? 'text-yellow-400' :
                      entry.type === 'success' ? 'text-growth' : 'text-farm-400'
                    }`}
                  >
                    <span className="text-farm-600 select-none shrink-0">
                      {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className="break-all">{entry.message}</span>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
