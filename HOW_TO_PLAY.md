# 🌾 AutoHarvest — How to Play

## Getting Started

AutoHarvest is a **farming automation programming game**. You control a robot on a tile-based farm grid and write code to automate farming tasks.

---

## Controls

| Key | Action |
|-----|--------|
| `W` / `↑` | Move robot up |
| `S` / `↓` | Move robot down |
| `A` / `←` | Move robot left |
| `D` / `→` | Move robot right |
| `Space` | Harvest crop (if ready) or Plant wheat |
| `P` | Plant wheat on current tile |
| `H` | Harvest crop on current tile |

---

## Game Screen Layout

```
┌──────────────────────────────────────────────────┐
│ 🌱 AutoHarvest  │ Dashboard │      Save │ Load  │  ← Top Bar
├──────────────────────────────────────────────────┤
│ ⚡ Energy  │ 💰 Gold │ 🌾 Seeds │ T:tick │ Stats │  ← Resource Bar
├─────────────────────────────┬────────────────────┤
│                             │  Script Editor     │
│                             │  ┌──────────────┐  │
│       Farm Canvas           │  │ your code    │  │
│       (10×10 grid)          │  │ goes here... │  │
│                             │  └──────────────┘  │
│       🤖 Robot moves here   ├────────────────────┤
│                             │  Console           │
│                             │  > output logs...  │
├─────────────────────────────┴────────────────────┤
│ WASD: Move │ Space: Harvest/Plant │ P: Plant     │  ← Controls Hint
└──────────────────────────────────────────────────┘
```

---

## Core Concepts

### 🗺️ Tile Types

| Tile | Color | Can Plant? | Walkable? |
|------|-------|-----------|-----------|
| **Farmland** | Dark brown | ✅ Yes | ✅ Yes |
| **Dirt** | Light brown | ❌ No | ✅ Yes |
| **Grass** | Green | ❌ No | ✅ Yes |
| **Water** | Blue | ❌ No | ❌ No |
| **Stone** | Gray | ❌ No | ❌ No |

### 🌱 Crops

| Crop | Growth Time | Yield | Seed Cost | Sell Price |
|------|-------------|-------|-----------|-----------|
| 🌾 Wheat | 50 ticks | 3 | 5g | 4g each |
| 🥕 Carrot | 40 ticks | 4 | 3g | 3g each |
| 🌽 Corn | 80 ticks | 2 | 10g | 8g each |
| 🥔 Potato | 60 ticks | 3 | 4g | 5g each |
| 🍅 Tomato | 70 ticks | 5 | 8g | 6g each |
| 🎃 Pumpkin | 120 ticks | 1 | 20g | 30g each |

### 🌿 Growth Stages

1. **Seed** (0–15%) — small brown dot
2. **Sprout** (15–40%) — green stem appears
3. **Growing** (40–75%) — plant gets bigger, colored
4. **Mature** (75–99%) — full size, deep color
5. **Harvestable** (100%) — glowing! Ready to pick 🌟

### ⚡ Energy System

- Robot has **100 max energy**
- Moving costs **1 energy**
- Planting costs **2 energy**
- Harvesting costs **2 energy**
- Energy regenerates at **0.5 per tick** (5 per second)

---

## Writing Scripts

### The Script Editor

The right panel contains a **Monaco code editor** where you write JavaScript to control your robot.

Click **▶ Run** to execute your script. Click **■ Stop** to halt it.

### Available API Functions

```javascript
// Movement (returns true/false)
await moveUp();
await moveDown();
await moveLeft();
await moveRight();

// Farming
await plant("wheat");     // Plant a crop (wheat, carrot, corn, potato, tomato, pumpkin)
await harvest();          // Harvest crop on current tile (must be harvestable)

// Information
getTile();                // Get current tile info {x, y, type, crop}
getTileAt(x, y);          // Get tile at specific position
getPosition();            // Get robot {x, y, direction}
getInventory();           // Get all items {wheat: 5, gold: 100, ...}
getEnergy();              // Get {current, max} energy

// Utility
log("message");           // Print to console
await wait(ticks);        // Pause for N ticks
```

### Example Scripts

#### Simple Plant & Harvest
```javascript
// Move to farmland and plant
await moveRight();
await plant("wheat");
log("Planted wheat! Waiting to grow...");
await wait(50);
await harvest();
log("Harvested!");
```

#### Auto-Plant a Row
```javascript
for (let i = 0; i < 8; i++) {
  await moveRight();
  await plant("wheat");
  log(`Planted at position ${i}`);
}
```

#### Full Farm Automation
```javascript
// Plant entire row, wait, then harvest
for (let i = 0; i < 8; i++) {
  await moveRight();
  await plant("wheat");
}

log("Waiting for crops to grow...");
await wait(60);

// Go back and harvest
for (let i = 0; i < 8; i++) {
  await moveLeft();
  await harvest();
}

log("Full cycle complete!");
log(getInventory());
```

---

## Tips & Tricks

1. **Start with wheat** — it's cheap and grows fast
2. **Check your seeds** — you need `seed_wheat` to plant wheat
3. **Harvesting gives seeds** — 50% chance to get a seed back
4. **Watch your energy** — wait for it to regenerate if low
5. **Use loops** — automate repetitive tasks with `for` and `while`
6. **Check tile type** — you can only plant on farmland tiles
7. **Save often** — use the Save button to persist progress

---

## Scripting Safety

- Scripts have a **10,000 instruction limit** per run
- Scripts timeout after **5 seconds**
- `while(true)` loops are automatically throttled
- No access to `window`, `document`, `fetch`, or `eval`
- All commands run in a sandboxed environment
