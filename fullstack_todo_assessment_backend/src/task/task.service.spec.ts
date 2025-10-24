import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

const mockTaskRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
};

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new task with status "todo"', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
      };

      const taskEntity = {
        ...createTaskDto,
        status: 'todo', // Service should set this
      };

      const savedTask = {
        id: 1,
        ...taskEntity,
        createdAt: new Date(),
      };

      mockTaskRepository.create.mockReturnValue(taskEntity);
      mockTaskRepository.save.mockResolvedValue(savedTask);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(savedTask);
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        status: 'todo',
      });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(taskEntity);
    });
  });

  describe('findActiveTasks', () => {
    it('should find and return the 5 most recent active tasks', async () => {
      const mockTasks = [{ id: 1, title: 'Task 1', status: 'todo' }];
      mockTaskRepository.find.mockResolvedValue(mockTasks);

      const result = await service.findActiveTasks();

      expect(result).toEqual(mockTasks);

      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: {
          status: 'todo',
        },
        order: {
          createdAt: 'DESC',
        },
        take: 5,
      });
    });
  });

  describe('completeTask', () => {
    it('should find a task, update its status to "done", and save it', async () => {
      const taskId = 1;
      const existingTask = {
        id: taskId,
        title: 'Test Task',
        status: 'todo',
        createdAt: new Date(),
      };

      const completedTask = {
        ...existingTask,
        status: 'done',
      };

      mockTaskRepository.findOneBy.mockResolvedValue(existingTask);

      mockTaskRepository.save.mockResolvedValue(completedTask);

      const result = await service.completeTask(taskId);

      expect(result).toEqual(completedTask);
      expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: taskId });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'done',
        }),
      );
    });

    it('should throw a NotFoundException if the task does not exist', async () => {
      const taskId = 999;
      mockTaskRepository.findOneBy.mockResolvedValue(null);

      await expect(service.completeTask(taskId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.completeTask(taskId)).rejects.toThrow(
        `Task with ID ${taskId} not found`,
      );
      expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: taskId });
      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });
  });
});
