import { Injectable, Inject } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { IEventRepository } from './repositories/event.repository.interface';
import { IUserRepository } from './repositories/user.repository.interface';
import { GoogleCalendarService } from '../google/google-calendar.service';
import { EventConflictException } from './exceptions/event-conflict.exception';

@Injectable()
export class EventsService {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    externalId: string,
    idpToken: string,
  ): Promise<Event> {
    let user = await this.userRepository.findByExternalId(externalId);
    if (!user) {
      throw new Error(`User does not exist`);
    }

    const conflictingEvents = await this.eventRepository.findConflictingEvents(
      new Date(createEventDto.startTime),
      new Date(createEventDto.endTime),
    );

    if (conflictingEvents.length > 0) {
      throw new EventConflictException(conflictingEvents);
    }

    if (idpToken) {
      const googleConflictingEvents =
        await this.googleCalendarService.checkConflictingEvents(
          idpToken,
          new Date(createEventDto.startTime).toISOString(),
          new Date(createEventDto.endTime).toISOString(),
        );

      if (googleConflictingEvents.length > 0) {
        const eventTitles = googleConflictingEvents
          .map((event) => event.summary || 'Event without title')
          .join(', ');
        throw new EventConflictException([
          {
            title: `Event in Google Calendar: ${eventTitles}`,
            startTime: createEventDto.startTime,
            endTime: createEventDto.endTime,
          },
        ]);
      }
    }

    await this.userRepository.update(user.id, {
      idpToken,
    });

    const event = await this.eventRepository.create({
      ...createEventDto,
      userId: user.id,
    });

    if (idpToken) {
      try {
        const googleEvent =
          await this.googleCalendarService.syncEventToGoogleCalendar(
            idpToken,
            event,
          );
        const eventUpdated = await this.eventRepository.update(event.id, {
          googleCalendarEventId: googleEvent.id,
        });
        return eventUpdated;
      } catch (error) {
        console.error('Error syncing with Google Calendar:', error);
        return event;
      }
    }

    return event;
  }

  async findAll(externalUserId: string): Promise<Event[]> {
    const user = await this.userRepository.findByExternalId(externalUserId);
    if (!user) {
      await this.userRepository.create({
        externalId: externalUserId,
      });
      return [];
    }
    return this.eventRepository.findAllByUserId(user.id);
  }

  async findOne(id: string): Promise<Event> {
    return this.eventRepository.findOne(id);
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    idpToken?: string,
  ): Promise<Event> {
    if (updateEventDto.startTime && updateEventDto.endTime) {
      const conflictingEvents =
        await this.eventRepository.findConflictingEvents(
          new Date(updateEventDto.startTime),
          new Date(updateEventDto.endTime),
          id,
        );

      if (conflictingEvents.length > 0) {
        throw new EventConflictException(conflictingEvents);
      }

      if (idpToken) {
        const event = await this.eventRepository.findOne(id);
        const googleConflictingEvents =
          await this.googleCalendarService.checkConflictingEvents(
            idpToken,
            new Date(updateEventDto.startTime).toISOString(),
            new Date(updateEventDto.endTime).toISOString(),
            event.googleCalendarEventId || undefined,
          );

        if (googleConflictingEvents.length > 0) {
          const eventTitles = googleConflictingEvents
            .map((event) => event.summary || 'Event without title')
            .join(', ');
          throw new EventConflictException([
            {
              title: `Event in google calendar: ${eventTitles}`,
              startTime: updateEventDto.startTime,
              endTime: updateEventDto.endTime,
            },
          ]);
        }
      }
    }

    const event = await this.eventRepository.update(id, updateEventDto);

    if (idpToken && event.googleCalendarEventId) {
      try {
        await this.googleCalendarService.syncEventToGoogleCalendar(
          idpToken,
          event,
        );
      } catch (error) {
        console.error('Error syncing with Google Calendar:', error);
        return event;
      }
    }
    return event;
  }

  async remove(id: string, idpToken: string): Promise<Event> {
    const event = await this.eventRepository.findOne(id);

    if (idpToken && event.googleCalendarEventId) {
      try {
        await this.googleCalendarService.deleteEvent(
          idpToken,
          event.googleCalendarEventId,
        );
      } catch (error) {
        console.error('Error deleting from Google Calendar:', error);
        return this.eventRepository.remove(id);
      }
    }

    return this.eventRepository.remove(id);
  }
}
