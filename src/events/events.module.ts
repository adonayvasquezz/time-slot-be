import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventRepository } from './repositories/event.repository';

@Module({
  imports: [PrismaModule],
  controllers: [EventsController],
  providers: [
    EventsService,
    { provide: 'IEventRepository', useClass: EventRepository },
  ],
  exports: [EventsService],
})
export class EventsModule {}
