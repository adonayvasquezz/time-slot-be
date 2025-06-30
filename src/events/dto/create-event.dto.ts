import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string | Date;

  @IsDateString()
  @IsNotEmpty()
  startTime: string | Date;

  @IsDateString()
  @IsNotEmpty()
  endTime: string | Date;

  @IsString()
  @IsOptional()
  userId: string;
}
