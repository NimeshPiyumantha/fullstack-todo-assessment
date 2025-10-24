import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

const mockTaskService = {
  create: jest.fn(),
  findActiveTasks: jest.fn(),
  completeTask: jest.fn(),
};

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call taskService.create with the correct DTO', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
      };
      const expectedTask = {
        id: 1,
        ...createTaskDto,
        status: 'todo',
        createdAt: new Date(),
      };

      mockTaskService.create.mockResolvedValue(expectedTask);

      const result = await controller.create(createTaskDto);

      expect(result).toEqual(expectedTask);
      expect(mockTaskService.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findAllActive', () => {
    it('should call taskService.findActiveTasks and return the result', async () => {
      const expectedTasks = [{ id: 1, title: 'Task 1', status: 'todo' }];

      mockTaskService.findActiveTasks.mockResolvedValue(expectedTasks);

      const result = await controller.findAllActive();

      expect(result).toEqual(expectedTasks);
      expect(mockTaskService.findActiveTasks).toHaveBeenCalledTimes(1);
    });
  });

  describe('complete', () => {
    it('should call taskService.completeTask with the correct ID', async () => {
      const taskId = '1';
      const expectedTask = { id: 1, title: 'Task 1', status: 'done' };

      mockTaskService.completeTask.mockResolvedValue(expectedTask);

      const result = await controller.complete(taskId);

      expect(result).toEqual(expectedTask);
      expect(mockTaskService.completeTask).toHaveBeenCalledWith(1);
    });
  });
});
