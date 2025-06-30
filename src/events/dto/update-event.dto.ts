import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateEventDto {
  @ApiProperty({ example: 'Updated meeting title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-06-17', required: false })
  @IsDateString()
  @IsOptional()
  date?: string | Date;

  @ApiProperty({ example: '2025-06-17T10:14:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  startTime?: string | Date;

  @ApiProperty({ example: '2025-06-17T12:14:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  endTime?: string | Date;

  @ApiProperty({ example: 'userId123', required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ example: 'googleEventId123', required: false })
  @IsString()
  @IsOptional()
  googleCalendarEventId?: string | null;
}
