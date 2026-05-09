// ============================================================
// AutoHarvest — Canvas Renderer (Farmer + Drones + Zones)
// ============================================================

import type { TileState, FarmerState, DroneState, FarmZone } from '@autoharvest/shared';
import {
  TILE_SIZE, TILE_GAP, TILE_DEFINITIONS, CROP_DEFINITIONS, GrowthStage,
} from '@autoharvest/shared';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private cameraX = 0;
  private cameraY = 0;
  private scale = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  resize(width: number, height: number) {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  centerOnGrid(gridWidth: number, gridHeight: number) {
    const totalW = gridWidth * (TILE_SIZE + TILE_GAP);
    const totalH = gridHeight * (TILE_SIZE + TILE_GAP);
    const canvasW = this.canvas.clientWidth;
    const canvasH = this.canvas.clientHeight;
    const scaleX = (canvasW - 40) / totalW;
    const scaleY = (canvasH - 40) / totalH;
    this.scale = Math.min(scaleX, scaleY, 1.5);
    this.cameraX = (canvasW - totalW * this.scale) / 2;
    this.cameraY = (canvasH - totalH * this.scale) / 2;
  }

  clear() {
    this.ctx.fillStyle = '#121110';
    this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
  }

  drawGrid(tiles: TileState[][]) {
    this.ctx.save();
    this.ctx.translate(this.cameraX, this.cameraY);
    this.ctx.scale(this.scale, this.scale);
    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        this.drawTile(tiles[y][x]);
      }
    }
    this.ctx.restore();
  }

  private drawTile(tile: TileState) {
    const px = tile.x * (TILE_SIZE + TILE_GAP);
    const py = tile.y * (TILE_SIZE + TILE_GAP);
    const tileDef = TILE_DEFINITIONS[tile.type];

    this.ctx.fillStyle = tileDef.color;
    this.ctx.beginPath();
    this.roundRect(px, py, TILE_SIZE, TILE_SIZE, 4);
    this.ctx.fill();

    this.ctx.strokeStyle = tileDef.borderColor;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    if (tile.type === 'farmland') {
      this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
      for (let i = 0; i < 3; i++) {
        this.ctx.fillRect(px + 6, py + 15 + i * 15, TILE_SIZE - 12, 2);
      }
    }

    if (tile.crop) this.drawCrop(tile, px, py);
  }

  private drawCrop(tile: TileState, px: number, py: number) {
    const crop = tile.crop!;
    const def = CROP_DEFINITIONS[crop.type];
    const cx = px + TILE_SIZE / 2;
    const cy = py + TILE_SIZE / 2;

    let color: string, size: number;
    switch (crop.stage) {
      case GrowthStage.SEED: color = def.color.seed; size = 6; break;
      case GrowthStage.SPROUT: color = def.color.sprout; size = 10; break;
      case GrowthStage.GROWING: color = def.color.growing; size = 16; break;
      case GrowthStage.MATURE: color = def.color.mature; size = 20; break;
      case GrowthStage.HARVESTABLE:
        color = def.color.harvestable; size = 24;
        const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10 * pulse;
        break;
      default: color = def.color.seed; size = 6;
    }

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    if (crop.stage <= GrowthStage.SPROUT) {
      this.ctx.arc(cx, cy + 8, size / 2, 0, Math.PI * 2);
      this.ctx.fill();
      if (crop.stage === GrowthStage.SPROUT) {
        this.ctx.strokeStyle = '#90BE6D'; this.ctx.lineWidth = 2;
        this.ctx.beginPath(); this.ctx.moveTo(cx, cy + 8); this.ctx.lineTo(cx, cy - 2); this.ctx.stroke();
        this.ctx.fillStyle = '#90BE6D'; this.ctx.beginPath();
        this.ctx.ellipse(cx + 4, cy, 4, 2, 0.3, 0, Math.PI * 2); this.ctx.fill();
      }
    } else {
      this.ctx.strokeStyle = '#5A7D3A'; this.ctx.lineWidth = 3;
      this.ctx.beginPath(); this.ctx.moveTo(cx, cy + TILE_SIZE / 2 - 10); this.ctx.lineTo(cx, cy - size / 2 + 4); this.ctx.stroke();
      this.ctx.fillStyle = '#6B8E3D';
      this.ctx.beginPath(); this.ctx.ellipse(cx - 6, cy + 4, 8, 4, -0.5, 0, Math.PI * 2); this.ctx.fill();
      this.ctx.beginPath(); this.ctx.ellipse(cx + 6, cy + 8, 7, 3, 0.5, 0, Math.PI * 2); this.ctx.fill();
      this.ctx.fillStyle = color; this.ctx.beginPath();
      this.ctx.arc(cx, cy - size / 4, size / 3, 0, Math.PI * 2); this.ctx.fill();
    }
    this.ctx.shadowBlur = 0; this.ctx.shadowColor = 'transparent';

    if (crop.stage !== GrowthStage.HARVESTABLE) {
      const barW = TILE_SIZE - 16, barH = 4, barX = px + 8, barY = py + TILE_SIZE - 10;
      this.ctx.fillStyle = 'rgba(0,0,0,0.4)'; this.ctx.fillRect(barX, barY, barW, barH);
      this.ctx.fillStyle = color; this.ctx.fillRect(barX, barY, barW * (crop.growthProgress / 100), barH);
    }
  }

  // ─── Farmer (Green hat character) ─────────────────────

  drawFarmer(farmer: FarmerState, isActive: boolean) {
    this.ctx.save();
    this.ctx.translate(this.cameraX, this.cameraY);
    this.ctx.scale(this.scale, this.scale);

    const px = farmer.visualX * (TILE_SIZE + TILE_GAP) + TILE_SIZE / 2;
    const py = farmer.visualY * (TILE_SIZE + TILE_GAP) + TILE_SIZE / 2;
    const size = TILE_SIZE * 0.35;

    // Active glow
    if (isActive) {
      this.ctx.shadowColor = '#90BE6D';
      this.ctx.shadowBlur = 14;
    }

    // Body (overalls — brown)
    this.ctx.fillStyle = '#6B4226';
    this.ctx.beginPath();
    this.roundRect(px - size * 0.7, py - size * 0.3, size * 1.4, size * 1.4, 4);
    this.ctx.fill();

    // Head (skin)
    this.ctx.fillStyle = '#F5D6BA';
    this.ctx.beginPath();
    this.ctx.arc(px, py - size * 0.5, size * 0.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Hat (green straw hat)
    this.ctx.fillStyle = '#5A7D3A';
    this.ctx.beginPath();
    this.roundRect(px - size * 0.8, py - size * 1.1, size * 1.6, size * 0.4, 3);
    this.ctx.fill();
    this.ctx.fillStyle = '#4A6D2A';
    this.ctx.beginPath();
    this.roundRect(px - size * 0.5, py - size * 1.4, size * 1, size * 0.5, 3);
    this.ctx.fill();

    // Eyes (small dots based on direction)
    const eyeOff = size * 0.2;
    let exOff = 0, eyOff = 0;
    switch (farmer.direction) {
      case 'up': eyOff = -eyeOff; break;
      case 'down': eyOff = eyeOff; break;
      case 'left': exOff = -eyeOff; break;
      case 'right': exOff = eyeOff; break;
    }
    this.ctx.fillStyle = '#333';
    this.ctx.beginPath(); this.ctx.arc(px - 4 + exOff, py - size * 0.5 + eyOff, 2, 0, Math.PI * 2); this.ctx.fill();
    this.ctx.beginPath(); this.ctx.arc(px + 4 + exOff, py - size * 0.5 + eyOff, 2, 0, Math.PI * 2); this.ctx.fill();

    this.ctx.shadowBlur = 0;

    // Active indicator (dashed border)
    if (isActive) {
      this.ctx.strokeStyle = '#90BE6D';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([3, 3]);
      this.ctx.beginPath();
      const tx = farmer.x * (TILE_SIZE + TILE_GAP);
      const ty = farmer.y * (TILE_SIZE + TILE_GAP);
      this.roundRect(tx - 1, ty - 1, TILE_SIZE + 2, TILE_SIZE + 2, 5);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // Energy bar
    this.drawEnergyBar(px - size, py + size + 8, size * 2, farmer.energy, farmer.maxEnergy);

    // Label
    if (isActive) {
      this.ctx.fillStyle = 'rgba(144,190,109,0.8)';
      this.ctx.font = '9px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🧑‍🌾 You', px, py + size + 20);
    }

    this.ctx.restore();
  }

  // ─── Drone ────────────────────────────────────────────

  drawDrone(drone: DroneState, isActive: boolean) {
    this.ctx.save();
    this.ctx.translate(this.cameraX, this.cameraY);
    this.ctx.scale(this.scale, this.scale);

    const px = drone.visualX * (TILE_SIZE + TILE_GAP) + TILE_SIZE / 2;
    const py = drone.visualY * (TILE_SIZE + TILE_GAP) + TILE_SIZE / 2;
    const size = TILE_SIZE * 0.32;

    // Color based on status
    const statusColors = {
      idle: { body: '#3D3D3D', eye: '#777', glow: '#555' },
      manual: { body: '#2D3436', eye: '#3B82F6', glow: '#3B82F6' },
      scripted: { body: '#2D3436', eye: '#F59E0B', glow: '#F59E0B' },
    };
    const colors = statusColors[drone.status];

    // Glow
    if (isActive || drone.status === 'scripted') {
      this.ctx.shadowColor = colors.glow;
      this.ctx.shadowBlur = drone.status === 'scripted' ? 8 + Math.sin(Date.now() / 200) * 4 : 12;
    }

    // Body
    this.ctx.fillStyle = colors.body;
    this.ctx.beginPath();
    this.roundRect(px - size, py - size, size * 2, size * 2, 6);
    this.ctx.fill();

    // Border
    this.ctx.strokeStyle = colors.eye;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.roundRect(px - size, py - size, size * 2, size * 2, 6);
    this.ctx.stroke();

    this.ctx.shadowBlur = 0;

    // Propeller arms
    const propAngle = (Date.now() / 100) % (Math.PI * 2);
    this.ctx.strokeStyle = '#555';
    this.ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const angle = propAngle + (i * Math.PI / 2);
      const armX = px + Math.cos(angle) * size * 0.7;
      const armY = py + Math.sin(angle) * size * 0.7;
      this.ctx.beginPath();
      this.ctx.arc(armX, armY, 4, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Eye (direction-based)
    const eyeOffset = size * 0.35;
    let eyeX = px, eyeY = py;
    switch (drone.direction) {
      case 'up': eyeY -= eyeOffset; break;
      case 'down': eyeY += eyeOffset; break;
      case 'left': eyeX -= eyeOffset; break;
      case 'right': eyeX += eyeOffset; break;
    }
    this.ctx.fillStyle = colors.eye;
    this.ctx.beginPath(); this.ctx.arc(eyeX, eyeY, 4, 0, Math.PI * 2); this.ctx.fill();
    this.ctx.fillStyle = '#FFF';
    this.ctx.beginPath(); this.ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2); this.ctx.fill();

    // Circuit lines
    this.ctx.strokeStyle = `${colors.eye}40`;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(px - size + 5, py + 3); this.ctx.lineTo(px + size - 5, py + 3);
    this.ctx.stroke();

    // Active tile highlight
    if (isActive) {
      this.ctx.strokeStyle = colors.eye + '80';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      const tx = drone.x * (TILE_SIZE + TILE_GAP);
      const ty = drone.y * (TILE_SIZE + TILE_GAP);
      this.roundRect(tx - 1, ty - 1, TILE_SIZE + 2, TILE_SIZE + 2, 5);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // Energy bar
    this.drawEnergyBar(px - size, py + size + 4, size * 2, drone.energy, drone.maxEnergy);

    // Status label
    this.ctx.font = '8px sans-serif';
    this.ctx.textAlign = 'center';
    const label = drone.status === 'scripted' ? '⟳ Auto' : drone.status === 'manual' ? '🎮' : '';
    if (label) {
      this.ctx.fillStyle = colors.eye;
      this.ctx.fillText(label, px, py - size - 4);
    }

    // Name label
    this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
    this.ctx.fillText(drone.name, px, py + size + 18);

    this.ctx.restore();
  }

  // ─── Farm Zone overlay ────────────────────────────────

  drawFarmZones(zones: FarmZone[]) {
    this.ctx.save();
    this.ctx.translate(this.cameraX, this.cameraY);
    this.ctx.scale(this.scale, this.scale);

    for (const zone of zones) {
      const x1 = zone.x1 * (TILE_SIZE + TILE_GAP);
      const y1 = zone.y1 * (TILE_SIZE + TILE_GAP);
      const w = (zone.x2 - zone.x1 + 1) * (TILE_SIZE + TILE_GAP) - TILE_GAP;
      const h = (zone.y2 - zone.y1 + 1) * (TILE_SIZE + TILE_GAP) - TILE_GAP;

      this.ctx.fillStyle = zone.color + '15';
      this.ctx.fillRect(x1, y1, w, h);

      this.ctx.strokeStyle = zone.color + '60';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([6, 4]);
      this.ctx.strokeRect(x1, y1, w, h);
      this.ctx.setLineDash([]);

      // Zone label
      this.ctx.fillStyle = zone.color + 'AA';
      this.ctx.font = 'bold 10px sans-serif';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(zone.name, x1 + 4, y1 - 4);
    }

    this.ctx.restore();
  }

  // ─── Energy bar helper ────────────────────────────────

  private drawEnergyBar(x: number, y: number, width: number, energy: number, maxEnergy: number) {
    const ratio = energy / maxEnergy;
    const barH = 3;
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.fillRect(x, y, width, barH);
    this.ctx.fillStyle = ratio > 0.3 ? '#FFD700' : '#E74C3C';
    this.ctx.fillRect(x, y, width * ratio, barH);
  }

  // ─── Main render ──────────────────────────────────────

  render(
    tiles: TileState[][],
    farmer: FarmerState,
    drones: DroneState[],
    zones: FarmZone[],
    gridWidth: number,
    gridHeight: number,
    controlMode: 'farmer' | 'drone',
    activeDroneId: string | null,
  ) {
    this.clear();
    this.centerOnGrid(gridWidth, gridHeight);
    this.drawGrid(tiles);
    this.drawFarmZones(zones);
    this.drawFarmer(farmer, controlMode === 'farmer');
    for (const drone of drones) {
      this.drawDrone(drone, controlMode === 'drone' && drone.id === activeDroneId);
    }
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number) {
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    this.ctx.lineTo(x + w, y + h - r);
    this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.ctx.lineTo(x + r, y + h);
    this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
  }
}
