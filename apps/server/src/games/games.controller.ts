import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsString, IsOptional } from 'class-validator';

class CreateWorldDto {
  @IsString() name: string;
  @IsOptional() @IsString() seed?: string;
}

class SaveGameDto {
  @IsString() serializedState: string;
}

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Post('worlds')
  createWorld(@Req() req: any, @Body() dto: CreateWorldDto) {
    return this.gamesService.createWorld(req.user.id, dto.name, dto.seed);
  }

  @Get('worlds')
  getWorlds(@Req() req: any) {
    return this.gamesService.getUserWorlds(req.user.id);
  }

  @Get('worlds/:id')
  getWorld(@Req() req: any, @Param('id') id: string) {
    return this.gamesService.getWorld(id, req.user.id);
  }

  @Delete('worlds/:id')
  deleteWorld(@Req() req: any, @Param('id') id: string) {
    return this.gamesService.deleteWorld(id, req.user.id);
  }

  @Post('worlds/:id/save')
  saveGame(@Param('id') id: string, @Body() dto: SaveGameDto) {
    return this.gamesService.saveGame(id, dto.serializedState);
  }

  @Get('worlds/:id/load')
  loadGame(@Param('id') id: string) {
    return this.gamesService.loadGame(id);
  }
}
