# AutoHarvest: Developer Hacks & Advanced Scripts

Welcome to the advanced scripting guide! These scripts are designed to fully automate your farming operations, pushing the drone engine to its maximum potential.

---

## 1. The Full-Farm Sweeper (Plant & Harvest)

This is the ultimate script for a single drone. It uses `getGridSize()` to calculate the exact boundaries of your farm. It sweeps back and forth across every row, planting if the tile is empty and harvesting if the crop is fully grown. 

**Requirements:** High Energy capacity (upgrade your drone first!) and plenty of seeds.

```javascript
// Get farm dimensions
const grid = getGridSize();
const width = grid.width;
const height = grid.height;

let movingRight = true;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width - 1; x++) {
    // 1. Process current tile
    const tile = getTile();
    
    // Harvest if ready (stage 4 = HARVESTABLE)
    if (tile && tile.crop && tile.crop.stage === 4) {
      await harvest();
    } 
    // Plant if it's empty farmland
    else if (tile && tile.type === 'farmland' && !tile.crop) {
      await plant("wheat"); // Change "wheat" to your desired crop!
    }

    // 2. Move to next tile
    if (movingRight) {
      await moveRight();
    } else {
      await moveLeft();
    }
  }

  // Process the final tile in the row before moving down
  const lastTile = getTile();
  if (lastTile && lastTile.crop && lastTile.crop.stage === 4) await harvest();
  else if (lastTile && lastTile.type === 'farmland' && !lastTile.crop) await plant("wheat");

  // Move down to the next row (if we aren't on the last row)
  if (y < height - 1) {
    await moveDown();
    movingRight = !movingRight; // Flip direction for the snake pattern
  }
}

// Return to origin (0, 0)
log("Sweep complete. Returning to base...");
while(true) {
  const pos = getPosition();
  if (pos.x === 0 && pos.y === 0) break;
  
  if (pos.x > 0) await moveLeft();
  if (pos.y > 0) await moveUp();
}

log("Recharging...");
await wait(50); // Pause to let energy regen
```

---

## 2. The Dedicated Harvester (Swarm Tactics)

If you have multiple drones, it's highly efficient to assign them specific roles. This script is for a drone whose *only* job is to find and harvest mature crops. It scans the grid using `getTileAt()` to avoid wasting movement energy.

```javascript
const grid = getGridSize();
const myPos = getPosition();

let targetFound = false;
let targetX = 0;
let targetY = 0;

// Scan the whole farm for a harvestable crop (Stage 4)
for (let y = 0; y < grid.height; y++) {
  for (let x = 0; x < grid.width; x++) {
    const tile = getTileAt(x, y);
    if (tile && tile.crop && tile.crop.stage === 4) {
      targetFound = true;
      targetX = x;
      targetY = y;
      break;
    }
  }
  if (targetFound) break;
}

if (targetFound) {
  log(`Found ripe crop at (${targetX}, ${targetY})!`);
  
  // Navigate to target
  while (getPosition().x < targetX) await moveRight();
  while (getPosition().x > targetX) await moveLeft();
  while (getPosition().y < targetY) await moveDown();
  while (getPosition().y > targetY) await moveUp();
  
  // Harvest!
  await harvest();
} else {
  // Nothing to do, wait to conserve energy
  await wait(20);
}
```

---

## 3. The Dedicated Planter (Swarm Tactics)

This is the partner to the Dedicated Harvester. It looks for empty farmland and plants high-value crops. 

```javascript
const grid = getGridSize();

let emptyFound = false;
let targetX = 0;
let targetY = 0;

// Scan for empty farmland
for (let y = 0; y < grid.height; y++) {
  for (let x = 0; x < grid.width; x++) {
    const tile = getTileAt(x, y);
    if (tile && tile.type === 'farmland' && !tile.crop) {
      emptyFound = true;
      targetX = x;
      targetY = y;
      break;
    }
  }
  if (emptyFound) break;
}

if (emptyFound) {
  // Navigate
  while (getPosition().x < targetX) await moveRight();
  while (getPosition().x > targetX) await moveLeft();
  while (getPosition().y < targetY) await moveDown();
  while (getPosition().y > targetY) await moveUp();
  
  // Plant High-Value Crop
  await plant("pumpkin"); 
} else {
  await wait(20);
}
```

---

## 4. The Energy Manager

If you have a very large grid (16x16), drones might run out of energy mid-task. Use `getEnergy()` to make smart decisions.

```javascript
const energy = getEnergy();

// If we are below 20% energy, stop moving and wait to recharge
if (energy.current < energy.max * 0.2) {
  log("Low energy! Initiating recharge sequence...");
  await wait(50); // Wait 5 seconds to regen
} else {
  // Normal operations here...
  await moveRight();
}
```
