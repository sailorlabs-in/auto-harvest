import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { SaveGame } from './save-game.entity';

@Entity('worlds')
export class World {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  seed: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.worlds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => SaveGame, (save) => save.world)
  saves: SaveGame[];

  @CreateDateColumn()
  createdAt: Date;
}
