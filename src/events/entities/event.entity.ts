import { ApiProperty } from '@nestjs/swagger';

export class Event {
  @ApiProperty({ description: 'Unique identifier for the event' })
  id: string;

  @ApiProperty({ description: 'Title of the event' })
  title: string;

  @ApiProperty({ description: 'Description of the event', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Date of the event' })
  date: Date;

  @ApiProperty({ description: 'Start time of the event' })
  startTime: Date;

  @ApiProperty({ description: 'End time of the event' })
  endTime: Date;

  @ApiProperty({
    description: 'Google Calendar event ID if synced',
    nullable: true,
  })
  googleCalendarEventId: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
