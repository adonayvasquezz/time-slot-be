import { Injectable, Inject } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { IEventRepository } from './repositories/event.repository.interface';

@Injectable()
export class EventsService {
  constructor(
    @Inject('IEventRepository')
    private readonly eventRepository: IEventRepository,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.eventRepository.create(createEventDto);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async findOne(id: string): Promise<Event> {
    return this.eventRepository.findOne(id);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventRepository.update(id, updateEventDto);
  }

  async remove(id: string): Promise<Event> {
    return this.eventRepository.remove(id);
  }
}
