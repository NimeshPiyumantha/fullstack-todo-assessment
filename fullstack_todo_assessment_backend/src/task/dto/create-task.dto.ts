import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Buy books',
    description: 'The title of the task',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Buy books for the next school year.',
    description: 'A detailed description of the task',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;
}
