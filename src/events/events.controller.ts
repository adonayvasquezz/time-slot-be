import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe';
import { StripUndefinedPipe } from '../common/pipes/strip-undefined.pipe';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(
    @Body(ParseDatePipe, StripUndefinedPipe) createEventDto: CreateEventDto,
    @Req() req: Request,
  ) {
    console.log('POST /events access token:', req.headers['authorization']);
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    console.log('GET /events access token:', req.headers['authorization']);
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    console.log(
      `GET /events/${id} access token:`,
      req.headers['authorization'],
    );
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ParseDatePipe, StripUndefinedPipe) updateEventDto: UpdateEventDto,
    @Req() req: Request,
  ) {
    console.log(
      `PATCH /events/${id} access token:`,
      req.headers['authorization'],
    );
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: Request) {
    console.log(
      `DELETE /events/${id} access token:`,
      req.headers['authorization'],
    );
    return this.eventsService.remove(id);
  }
}
