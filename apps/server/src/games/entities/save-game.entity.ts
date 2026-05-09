import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { World } from './world.entity';

@Entity('save_games')
export class SaveGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  worldId: string;

  @ManyToOne(() => World, (world) => world.saves, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'worldId' })
  world: World;

  @Column('text')
  serializedState: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
