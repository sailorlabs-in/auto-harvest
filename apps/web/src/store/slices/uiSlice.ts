// ============================================================
// AutoHarvest — UI Slice (Redux Toolkit)
// ============================================================

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ConsoleEntry } from '@autoharvest/shared';

export type ActivePanel = 'shop' | 'editor' | 'drones';

interface UIState {
  showConsole: boolean;
  showEditor: boolean;
  showInventory: boolean;
  activePanel: ActivePanel;
  consoleLogs: ConsoleEntry[];
  maxConsoleLogs: number;
  isScriptRunning: boolean;
  currentScript: string;
  selectedDroneForScript: string | null;
}

const DEFAULT_SCRIPT = `// Welcome to AutoHarvest! 🌾
// Write code to control your farming robot.
// Available commands:
//   moveUp(), moveDown(), moveLeft(), moveRight()
//   plant("wheat"), harvest(), getTile(), getInventory()
//   log("message")

// Example: Move and plant
await moveRight();
await plant("wheat");
await moveRight();
await plant("wheat");
log("Planted two wheat crops!");
`;

const initialState: UIState = {
  showConsole: true,
  showEditor: true,
  showInventory: false,
  activePanel: 'shop', // Start with shop visible (Tier 0)
  consoleLogs: [],
  maxConsoleLogs: 200,
  isScriptRunning: false,
  currentScript: DEFAULT_SCRIPT,
  selectedDroneForScript: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleConsole(state) { state.showConsole = !state.showConsole; },
    toggleEditor(state) { state.showEditor = !state.showEditor; },
    toggleInventory(state) { state.showInventory = !state.showInventory; },
    setActivePanel(state, action: PayloadAction<ActivePanel>) {
      state.activePanel = action.payload;
    },
    addConsoleLog(state, action: PayloadAction<ConsoleEntry>) {
      state.consoleLogs.push(action.payload);
      if (state.consoleLogs.length > state.maxConsoleLogs) {
        state.consoleLogs = state.consoleLogs.slice(-state.maxConsoleLogs);
      }
    },
    clearConsole(state) { state.consoleLogs = []; },
    setScriptRunning(state, action: PayloadAction<boolean>) {
      state.isScriptRunning = action.payload;
    },
    setCurrentScript(state, action: PayloadAction<string>) {
      state.currentScript = action.payload;
    },
    setSelectedDroneForScript(state, action: PayloadAction<string | null>) {
      state.selectedDroneForScript = action.payload;
    },
  },
});

export const {
  toggleConsole, toggleEditor, toggleInventory, setActivePanel,
  addConsoleLog, clearConsole, setScriptRunning, setCurrentScript,
  setSelectedDroneForScript,
} = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
