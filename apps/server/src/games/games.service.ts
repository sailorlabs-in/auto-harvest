import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { World } from './entities/world.entity';
import { SaveGame } from './entities/save-game.entity';

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
    let save = await this.savesRepo.findOne({ where: { worldId } });
    if (save) {
      save.serializedState = serializedState;
    } else {
      save = this.savesRepo.create({ worldId, serializedState });
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
}
