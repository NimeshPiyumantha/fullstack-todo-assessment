import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'task' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 20, default: 'todo', nullable: false })
  status: 'todo' | 'done';

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
