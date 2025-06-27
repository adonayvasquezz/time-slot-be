import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { Event } from '../entities/event.entity';
import { IEventRepository } from './event.repository.interface';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
        startTime: new Date(createEventDto.startTime),
        endTime: new Date(createEventDto.endTime),
      },
    });
  }

  async findAll(): Promise<Event[]> {
    return this.prisma.event.findMany({
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    await this.findOne(id);
    const updateData: any = { ...updateEventDto };
    if (updateEventDto.date) {
      updateData.date = new Date(updateEventDto.date);
    }
    if (updateEventDto.startTime) {
      updateData.startTime = new Date(updateEventDto.startTime);
    }
    if (updateEventDto.endTime) {
      updateData.endTime = new Date(updateEventDto.endTime);
    }
    return this.prisma.event.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<Event> {
    await this.findOne(id);
    return this.prisma.event.delete({
      where: { id },
    });
  }
}
