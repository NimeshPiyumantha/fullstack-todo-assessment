import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@ApiTags('Tasks')
@Controller('api/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: Task,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get the 5 most recent active tasks' })
  @ApiResponse({
    status: 200,
    description: 'A list of the 5 most recent active (to-do) tasks.',
    type: [Task],
  })
  findAllActive(): Promise<Task[]> {
    return this.taskService.findActiveTasks();
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a task as completed' })
  @ApiParam({ name: 'id', description: 'The ID of the task to complete' })
  @ApiResponse({
    status: 200,
    description: 'The task has been marked as done.',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  complete(@Param('id') id: string): Promise<Task> {
    return this.taskService.completeTask(+id);
  }
}
