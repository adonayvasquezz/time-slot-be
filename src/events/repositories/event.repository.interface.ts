import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { Event } from '../entities/event.entity';

export interface IEventRepository {
  create(createEventDto: CreateEventDto): Promise<Event>;
  findAll(): Promise<Event[]>;
  findOne(id: string): Promise<Event>;
  update(id: string, updateEventDto: UpdateEventDto): Promise<Event>;
  remove(id: string): Promise<Event>;
}
