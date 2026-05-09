# 🎮 AutoHarvest — Level Codes & Development Reference

> **For developers only.** This file contains ready-to-use level definitions,
> challenge scripts, and templates for rapidly creating new levels.

---

## Level System Architecture

Each level is defined by:
- **Grid layout** (tile type matrix)
- **Starting inventory** (seeds, gold)
- **Objective** (what the player must achieve)
- **Unlocked crops** (which crops are available)
- **Par score** (optimal instructions to complete)
- **Hints** (optional guidance)

### Level Definition Interface

```typescript
interface LevelDefinition {
  id: string;
  number: number;
  name: string;
  description: string;
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';
  gridWidth: number;
  gridHeight: number;
  tileLayout: string[][]; // 'F'=farmland, 'D'=dirt, 'G'=grass, 'W'=water, 'S'=stone
  robotStart: { x: number; y: number; direction: Direction };
  startingInventory: Record<string, number>;
  unlockedCrops: CropType[];
  objectives: LevelObjective[];
  parInstructions: number;
  hints: string[];
  reward: { gold: number; unlocks?: string[] };
}

interface LevelObjective {
  type: 'harvest' | 'plant' | 'collect' | 'reach' | 'efficiency';
  target: string | number;
  quantity: number;
  description: string;
}
```

---

## Level Definitions

---

### Level 1: First Steps

```typescript
{
  id: 'level-001',
  number: 1,
  name: 'First Steps',
  description: 'Learn to move your robot and plant your first crop.',
  difficulty: 'beginner',
  gridWidth: 5,
  gridHeight: 5,
  tileLayout: [
    ['G', 'G', 'G', 'G', 'G'],
    ['G', 'F', 'F', 'F', 'G'],
    ['G', 'F', 'F', 'F', 'G'],
    ['G', 'F', 'F', 'F', 'G'],
    ['G', 'G', 'G', 'G', 'G'],
  ],
  robotStart: { x: 1, y: 1, direction: 'right' },
  startingInventory: { seed_wheat: 5, gold: 50 },
  unlockedCrops: ['wheat'],
  objectives: [
    { type: 'plant', target: 'wheat', quantity: 1, description: 'Plant 1 wheat crop' },
  ],
  parInstructions: 3,
  hints: ['Use moveRight() then plant("wheat")'],
  reward: { gold: 20 },
}
```

**Solution:**
```javascript
await moveRight();
await plant("wheat");
log("Level 1 complete!");
```

---

### Level 2: The Row

```typescript
{
  id: 'level-002',
  number: 2,
  name: 'The Row',
  description: 'Plant a full row of wheat crops.',
  difficulty: 'beginner',
  gridWidth: 7,
  gridHeight: 5,
  tileLayout: [
    ['G', 'D', 'D', 'D', 'D', 'D', 'G'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['G', 'D', 'D', 'D', 'D', 'D', 'G'],
  ],
  robotStart: { x: 1, y: 2, direction: 'right' },
  startingInventory: { seed_wheat: 10, gold: 50 },
  unlockedCrops: ['wheat'],
  objectives: [
    { type: 'plant', target: 'wheat', quantity: 5, description: 'Plant 5 wheat in a row' },
  ],
  parInstructions: 10,
  hints: ['Use a for loop to move and plant'],
  reward: { gold: 40 },
}
```

**Solution:**
```javascript
for (let i = 0; i < 5; i++) {
  await plant("wheat");
  await moveRight();
}
log("Row planted!");
```

---

### Level 3: Harvest Time

```typescript
{
  id: 'level-003',
  number: 3,
  name: 'Harvest Time',
  description: 'Plant wheat, wait for it to grow, and harvest it.',
  difficulty: 'easy',
  gridWidth: 6,
  gridHeight: 6,
  tileLayout: [
    ['G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'F', 'F', 'F', 'F', 'G'],
    ['G', 'F', 'F', 'F', 'F', 'G'],
    ['G', 'F', 'F', 'F', 'F', 'G'],
    ['G', 'F', 'F', 'F', 'F', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G'],
  ],
  robotStart: { x: 1, y: 1, direction: 'right' },
  startingInventory: { seed_wheat: 10, gold: 30 },
  unlockedCrops: ['wheat'],
  objectives: [
    { type: 'harvest', target: 'wheat', quantity: 3, description: 'Harvest 3 wheat crops' },
  ],
  parInstructions: 25,
  hints: ['Plant, wait for growth (50 ticks), then harvest'],
  reward: { gold: 60, unlocks: ['carrot'] },
}
```

**Solution:**
```javascript
// Plant 3 wheat
for (let i = 0; i < 3; i++) {
  await plant("wheat");
  await moveRight();
}
log("Planted! Waiting for growth...");
await wait(55);

// Go back and harvest
for (let i = 0; i < 3; i++) {
  await moveLeft();
  await harvest();
}
log("Harvested 3 wheat!");
```

---

### Level 4: Mixed Crops

```typescript
{
  id: 'level-004',
  number: 4,
  name: 'Mixed Crops',
  description: 'Plant both wheat and carrots to fill your farm.',
  difficulty: 'easy',
  gridWidth: 8,
  gridHeight: 6,
  tileLayout: [
    ['G', 'D', 'D', 'D', 'D', 'D', 'D', 'G'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['G', 'D', 'D', 'D', 'D', 'D', 'D', 'G'],
  ],
  robotStart: { x: 1, y: 1, direction: 'right' },
  startingInventory: { seed_wheat: 10, seed_carrot: 10, gold: 50 },
  unlockedCrops: ['wheat', 'carrot'],
  objectives: [
    { type: 'plant', target: 'wheat', quantity: 3, description: 'Plant 3 wheat' },
    { type: 'plant', target: 'carrot', quantity: 3, description: 'Plant 3 carrots' },
  ],
  parInstructions: 15,
  hints: ['Alternate between wheat and carrot in each row'],
  reward: { gold: 80 },
}
```

**Solution:**
```javascript
// Row 1: wheat
for (let i = 0; i < 3; i++) {
  await plant("wheat");
  await moveRight();
}

// Go to next row
await moveDown();
for (let i = 0; i < 3; i++) {
  await moveLeft();
}

// Row 2: carrots
for (let i = 0; i < 3; i++) {
  await plant("carrot");
  await moveRight();
}
log("Mixed farm planted!");
```

---

### Level 5: Water Maze

```typescript
{
  id: 'level-005',
  number: 5,
  name: 'Water Maze',
  description: 'Navigate around water tiles to reach farmland.',
  difficulty: 'medium',
  gridWidth: 8,
  gridHeight: 8,
  tileLayout: [
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    ['G', 'D', 'D', 'W', 'W', 'D', 'F', 'G'],
    ['G', 'D', 'F', 'W', 'F', 'D', 'F', 'G'],
    ['G', 'D', 'F', 'D', 'F', 'W', 'F', 'G'],
    ['G', 'D', 'F', 'W', 'F', 'D', 'F', 'G'],
    ['G', 'D', 'F', 'D', 'D', 'D', 'F', 'G'],
    ['G', 'D', 'D', 'D', 'F', 'F', 'F', 'G'],
    ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
  ],
  robotStart: { x: 1, y: 1, direction: 'right' },
  startingInventory: { seed_wheat: 20, seed_carrot: 10, gold: 100 },
  unlockedCrops: ['wheat', 'carrot'],
  objectives: [
    { type: 'plant', target: 'wheat', quantity: 8, description: 'Plant on all farmland tiles' },
    { type: 'harvest', target: 'wheat', quantity: 5, description: 'Harvest 5 crops' },
  ],
  parInstructions: 60,
  hints: ['Use getTileAt(x,y) to check for water before moving', 'Water tiles are not walkable!'],
  reward: { gold: 150, unlocks: ['corn'] },
}
```

**Solution:**
```javascript
// Navigate around water using conditional movement
async function tryMove(dir) {
  const pos = getPosition();
  let tx = pos.x, ty = pos.y;
  if (dir === 'right') tx++;
  if (dir === 'left') tx--;
  if (dir === 'up') ty--;
  if (dir === 'down') ty++;
  const tile = getTileAt(tx, ty);
  if (tile && tile.type !== 'water') {
    if (dir === 'right') return await moveRight();
    if (dir === 'left') return await moveLeft();
    if (dir === 'up') return await moveUp();
    if (dir === 'down') return await moveDown();
  }
  return false;
}

// Navigate and plant
await moveRight();
await moveDown();
await tryMove('right');
await plant("wheat");
log("Navigated the maze!");
```

---

### Level 6: The Grid Fill

```typescript
{
  id: 'level-006',
  number: 6,
  name: 'The Grid Fill',
  description: 'Fill an entire grid with crops using nested loops.',
  difficulty: 'medium',
  gridWidth: 8,
  gridHeight: 8,
  tileLayout: [
    ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['D', 'F', 'F', 'F', 'F', 'F', 'F', 'D'],
    ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
  ],
  robotStart: { x: 1, y: 1, direction: 'right' },
  startingInventory: { seed_wheat: 50, seed_carrot: 20, gold: 200 },
  unlockedCrops: ['wheat', 'carrot', 'corn'],
  objectives: [
    { type: 'plant', target: '*', quantity: 36, description: 'Plant on all 36 farmland tiles' },
  ],
  parInstructions: 80,
  hints: ['Use nested for loops', 'Snake pattern: go right on even rows, left on odd rows'],
  reward: { gold: 300, unlocks: ['potato'] },
}
```

**Solution (Snake Pattern):**
```javascript
for (let row = 0; row < 6; row++) {
  for (let col = 0; col < 6; col++) {
    await plant("wheat");
    if (col < 5) {
      if (row % 2 === 0) await moveRight();
      else await moveLeft();
    }
  }
  if (row < 5) await moveDown();
}
log(`Filled the grid! ${JSON.stringify(getInventory())}`);
```

---

### Level 7: Resource Manager

```typescript
{
  id: 'level-007',
  number: 7,
  name: 'Resource Manager',
  description: 'Manage limited seeds wisely. Plant, harvest, replant.',
  difficulty: 'hard',
  gridWidth: 10,
  gridHeight: 10,
  tileLayout: /* standard 10x10 with farmland center */,
  robotStart: { x: 1, y: 1, direction: 'right' },
  startingInventory: { seed_wheat: 5, gold: 20 },
  unlockedCrops: ['wheat', 'carrot', 'corn', 'potato'],
  objectives: [
    { type: 'collect', target: 'wheat', quantity: 30, description: 'Collect 30 wheat total' },
    { type: 'collect', target: 'gold', quantity: 200, description: 'Earn 200 gold' },
  ],
  parInstructions: 200,
  hints: [
    'You only start with 5 seeds!',
    'Harvest gives 50% chance of seed back',
    'Plant → harvest → replant cycle',
  ],
  reward: { gold: 500, unlocks: ['tomato'] },
}
```

---

### Level 8: Efficiency Challenge

```typescript
{
  id: 'level-008',
  number: 8,
  name: 'Efficiency Challenge',
  description: 'Harvest 20 crops in under 100 instructions.',
  difficulty: 'hard',
  gridWidth: 10,
  gridHeight: 10,
  tileLayout: /* standard with pre-planted harvestable crops */,
  robotStart: { x: 1, y: 1, direction: 'right' },
  startingInventory: { gold: 100 },
  unlockedCrops: ['wheat', 'carrot', 'corn', 'potato'],
  objectives: [
    { type: 'harvest', target: '*', quantity: 20, description: 'Harvest 20 crops' },
    { type: 'efficiency', target: 'instructions', quantity: 100, description: 'Use ≤100 instructions' },
  ],
  parInstructions: 60,
  hints: ['Optimize your movement path', 'Avoid unnecessary moves'],
  reward: { gold: 800, unlocks: ['pumpkin'] },
}
```

---

### Level 9: The Labyrinth Farm

```typescript
{
  id: 'level-009',
  number: 9,
  name: 'The Labyrinth Farm',
  description: 'Navigate a stone maze to find and farm hidden plots.',
  difficulty: 'expert',
  gridWidth: 12,
  gridHeight: 12,
  tileLayout: [
    ['S','S','S','S','S','S','S','S','S','S','S','S'],
    ['S','D','D','S','F','F','S','D','D','D','F','S'],
    ['S','D','S','S','F','F','S','D','S','D','F','S'],
    ['S','D','D','D','D','D','D','D','S','D','D','S'],
    ['S','S','S','D','S','S','S','D','S','S','D','S'],
    ['S','F','D','D','D','F','S','D','D','D','D','S'],
    ['S','F','S','S','D','F','S','S','S','D','S','S'],
    ['S','D','D','D','D','D','D','D','D','D','D','S'],
    ['S','D','S','S','S','D','S','S','S','D','S','S'],
    ['S','D','D','D','F','D','F','F','D','D','F','S'],
    ['S','S','S','D','F','D','F','F','D','S','F','S'],
    ['S','S','S','S','S','S','S','S','S','S','S','S'],
  ],
  robotStart: { x: 1, y: 1, direction: 'right' },
  startingInventory: { seed_wheat: 30, seed_carrot: 20, seed_corn: 10, gold: 200 },
  unlockedCrops: ['wheat', 'carrot', 'corn', 'potato', 'tomato', 'pumpkin'],
  objectives: [
    { type: 'plant', target: '*', quantity: 15, description: 'Find and plant on 15 farmland tiles' },
    { type: 'harvest', target: '*', quantity: 10, description: 'Harvest 10 crops' },
  ],
  parInstructions: 300,
  hints: ['Use getTileAt() to scan ahead', 'Implement a pathfinding algorithm'],
  reward: { gold: 2000 },
}
```

---

### Level 10: Ultimate Automation

```typescript
{
  id: 'level-010',
  number: 10,
  name: 'Ultimate Automation',
  description: 'Build a fully automated farm that plants, waits, and harvests all crop types.',
  difficulty: 'expert',
  gridWidth: 15,
  gridHeight: 15,
  tileLayout: /* large grid with mixed terrain */,
  robotStart: { x: 1, y: 1, direction: 'right' },
  startingInventory: {
    seed_wheat: 50, seed_carrot: 30, seed_corn: 20,
    seed_potato: 15, seed_tomato: 10, seed_pumpkin: 5, gold: 500,
  },
  unlockedCrops: ['wheat', 'carrot', 'corn', 'potato', 'tomato', 'pumpkin'],
  objectives: [
    { type: 'harvest', target: '*', quantity: 50, description: 'Harvest 50 total crops' },
    { type: 'collect', target: 'gold', quantity: 1000, description: 'Earn 1000 gold' },
    { type: 'plant', target: 'pumpkin', quantity: 3, description: 'Grow 3 pumpkins' },
  ],
  parInstructions: 500,
  hints: [
    'Cycle through crop types for variety bonus',
    'Pumpkins take 120 ticks — plant them first!',
    'Build reusable functions for farming patterns',
  ],
  reward: { gold: 5000 },
}
```

**Solution Template:**
```javascript
const crops = ["wheat", "carrot", "corn", "potato"];

async function farmRow(crop, length) {
  for (let i = 0; i < length; i++) {
    await plant(crop);
    if (i < length - 1) await moveRight();
  }
}

async function harvestRow(length) {
  for (let i = 0; i < length; i++) {
    await harvest();
    if (i < length - 1) await moveLeft();
  }
}

// Plant pumpkins first (longest grow time)
await moveDown();
await plant("pumpkin");
await moveRight();
await plant("pumpkin");
await moveRight();
await plant("pumpkin");

// Move to next row and farm other crops
await moveDown();
for (let i = 0; i < 2; i++) { await moveLeft(); }

for (let row = 0; row < crops.length; row++) {
  await farmRow(crops[row], 6);
  await moveDown();
  for (let i = 0; i < 5; i++) await moveLeft();
}

log("Planted everything! Waiting for growth...");
await wait(130); // Wait for pumpkins

// Harvest everything
log("Harvesting...");
log(getInventory());
```

---

## Quick Reference: Adding a New Level

1. Copy a level definition template above
2. Change `id`, `number`, `name`, `description`
3. Define `tileLayout` grid (use letters: F/D/G/W/S)
4. Set `robotStart` position
5. Define `startingInventory`
6. Set `objectives` array
7. Write solution script
8. Test with par instruction count

### Tile Layout Key
```
F = Farmland (plantable)
D = Dirt (walkable, not plantable)
G = Grass (walkable, decorative)
W = Water (not walkable)
S = Stone (not walkable)
```
