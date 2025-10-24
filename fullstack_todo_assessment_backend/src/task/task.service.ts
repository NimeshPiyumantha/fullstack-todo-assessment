import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      status: 'todo',
    });
    return this.tasksRepository.save(task);
  }

  async findActiveTasks(): Promise<Task[]> {
    return this.tasksRepository.find({
      where: {
        status: 'todo',
      },
      order: {
        createdAt: 'DESC',
      },
      take: 5,
    });
  }

  async completeTask(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    task.status = 'done';
    return this.tasksRepository.save(task);
  }
}
