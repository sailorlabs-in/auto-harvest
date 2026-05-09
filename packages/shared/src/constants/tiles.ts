// ============================================================
// AutoHarvest — Tile Definitions
// ============================================================

import { TileType } from '../types/game';

export interface TileDefinition {
  type: TileType;
  name: string;
  canPlant: boolean;
  walkable: boolean;
  color: string;
  borderColor: string;
}

export const TILE_DEFINITIONS: Record<TileType, TileDefinition> = {
  [TileType.DIRT]: {
    type: TileType.DIRT,
    name: 'Dirt',
    canPlant: false,
    walkable: true,
    color: '#8B6F47',
    borderColor: '#705838',
  },
  [TileType.GRASS]: {
    type: TileType.GRASS,
    name: 'Grass',
    canPlant: false,
    walkable: true,
    color: '#5A7D3A',
    borderColor: '#4A6B2E',
  },
  [TileType.WATER]: {
    type: TileType.WATER,
    name: 'Water',
    canPlant: false,
    walkable: false,
    color: '#4A90D9',
    borderColor: '#3A7BC8',
  },
  [TileType.STONE]: {
    type: TileType.STONE,
    name: 'Stone',
    canPlant: false,
    walkable: false,
    color: '#808080',
    borderColor: '#696969',
  },
  [TileType.FARMLAND]: {
    type: TileType.FARMLAND,
    name: 'Farmland',
    canPlant: true,
    walkable: true,
    color: '#6B4423',
    borderColor: '#553618',
  },
};
