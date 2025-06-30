import { ConflictException } from '@nestjs/common';

export class EventConflictException extends ConflictException {
  constructor(conflictingEvents: any[]) {
    const eventTitles = conflictingEvents
      .map((event) => event.title)
      .join(', ');
    super(
      `The event cannot be created because it conflicts with the following event: ${eventTitles}`,
    );
  }
}
