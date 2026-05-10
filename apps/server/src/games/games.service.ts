import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { World } from './entities/world.entity';
import { SaveGame } from './entities/save-game.entity';
import { SHOP_ITEMS, CROP_DEFINITIONS } from '@autoharvest/shared';
import * as crypto from 'crypto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(World) private worldsRepo: Repository<World>,
    @InjectRepository(SaveGame) private savesRepo: Repository<SaveGame>,
  ) {}

  async createWorld(userId: string, name: string, seed?: string) {
    const world = this.worldsRepo.create({ userId, name, seed: seed || String(Date.now()) });
    return this.worldsRepo.save(world);
  }

  async getUserWorlds(userId: string) {
    return this.worldsRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async getWorld(id: string, userId: string) {
    const world = await this.worldsRepo.findOne({ where: { id, userId } });
    if (!world) throw new NotFoundException('World not found');
    return world;
  }

  async saveGame(worldId: string, serializedState: string) {
    // Validate save data integrity
    this.validateSaveIntegrity(serializedState);

    // Generate checksum
    const checksum = crypto.createHash('sha256').update(serializedState).digest('hex').slice(0, 16);

    let save = await this.savesRepo.findOne({ where: { worldId } });
    if (save) {
      save.serializedState = serializedState;
      save.checksum = checksum;
      save.version = (save.version || 0) + 1;
    } else {
      save = this.savesRepo.create({ worldId, serializedState, checksum, version: 1 });
    }
    return this.savesRepo.save(save);
  }

  async loadGame(worldId: string) {
    const save = await this.savesRepo.findOne({ where: { worldId } });
    if (!save) throw new NotFoundException('No save found for this world');
    return save;
  }

  async deleteWorld(id: string, userId: string) {
    const world = await this.getWorld(id, userId);
    await this.worldsRepo.remove(world);
    return { deleted: true };
  }

  // ─── Server-side purchase validation ──────────────────

  async validatePurchase(
    worldId: string,
    itemId: string,
    currentGold: number,
    currentTier: number,
    purchasedItems: string[],
  ): Promise<{ success: boolean; newGold: number; message?: string }> {
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) {
      return { success: false, newGold: currentGold, message: 'Item not found' };
    }

    // Check tier requirement
    if (currentTier < item.requiredTier) {
      return { success: false, newGold: currentGold, message: `Requires Tier ${item.requiredTier}` };
    }

    // Check max purchases
    const purchaseCount = purchasedItems.filter((id) => id === itemId).length;
    if (purchaseCount >= item.maxPurchases) {
      return { success: false, newGold: currentGold, message: 'Already purchased maximum times' };
    }

    // Check gold
    if (currentGold < item.cost) {
      return { success: false, newGold: currentGold, message: 'Not enough gold' };
    }

    // Verify against saved state (anti-cheat)
    try {
      const save = await this.savesRepo.findOne({ where: { worldId } });
      if (save) {
        const state = JSON.parse(save.serializedState);
        const serverGold = state?.game?.inventory?.items?.gold || 0;

        // Allow some tolerance (client may have earned gold since last save)
        // But reject if client claims way more gold than server knows about
        if (currentGold > serverGold * 2 + 500) {
          return {
            success: false,
            newGold: currentGold,
            message: 'Gold amount seems inconsistent. Please save your game first.',
          };
        }
      }
    } catch {
      // No save found — first-time purchase, that's okay
    }

    const newGold = currentGold - item.cost;
    return { success: true, newGold };
  }

  // ─── Save integrity validation ────────────────────────

  private validateSaveIntegrity(serializedState: string) {
    try {
      const data = JSON.parse(serializedState);

      // Must have game state
      if (!data.game) {
        throw new BadRequestException('Invalid save: missing game state');
      }

      const game = data.game;

      // Grid must exist
      if (!game.tiles || !Array.isArray(game.tiles)) {
        throw new BadRequestException('Invalid save: missing tile data');
      }

      // Gold cannot be negative
      if (game.inventory?.items?.gold !== undefined && game.inventory.items.gold < 0) {
        throw new BadRequestException('Invalid save: negative gold');
      }

      // Grid dimensions must be reasonable
      if (game.gridWidth > 100 || game.gridHeight > 100) {
        throw new BadRequestException('Invalid save: grid too large');
      }

      // Tick must be non-negative
      if (game.tick !== undefined && game.tick < 0) {
        throw new BadRequestException('Invalid save: negative tick count');
      }

      // Progression validation
      if (data.progression) {
        const prog = data.progression;
        if (prog.tier < 0 || prog.tier > 4) {
          throw new BadRequestException('Invalid save: invalid tier');
        }
        if (prog.totalGoldEarned < 0) {
          throw new BadRequestException('Invalid save: negative total gold earned');
        }
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException('Invalid save: malformed JSON');
    }
  }
}
