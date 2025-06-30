import { Injectable, Inject } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { User } from './entities/user.entity';
import { IEventRepository } from './repositories/event.repository.interface';
import { IUserRepository } from './repositories/user.repository.interface';
import { GoogleCalendarService } from '../google/google-calendar.service';

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
