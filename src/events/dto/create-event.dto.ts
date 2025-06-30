import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Meeting with team' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Discuss project updates', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-06-17' })
  @IsDateString()
  @IsNotEmpty()
  date: string | Date;

  @ApiProperty({ example: '2025-06-17T10:14:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startTime: string | Date;

  @ApiProperty({ example: '2025-06-17T12:14:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  endTime: string | Date;

  @ApiProperty({ example: 'userId123' })
  @IsString()
  @IsOptional()
  userId: string;
}
